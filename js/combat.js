/* ============================================================
   COMBAT.JS
   ============================================================ */

let currentCombat = null;

let dungeonCompanion = null;
let dungeonCompanionUsed = false;
let followerDungeonCompanions = {};

function resetDungeonCompanionState() {
  dungeonCompanion = null;
  dungeonCompanionUsed = false;
  followerDungeonCompanions = {};
}

function getFollowerCompanionOption(follower) {
  if (followerDungeonCompanions[follower.name]) return null;
  const magicSkillIds = Object.keys(follower.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );
  for (const skillId of magicSkillIds) {
    const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    const allSpells = SPELLS[skillId] || [];
    const companionSpell = allSpells.find(
      (s) => s.type === "companion" && known.includes(s.id) && isSpellActive(follower, s.id)
    );
    if (companionSpell) return { skillId, spell: companionSpell };
  }
  return null;
}

function performFollowerCompanionCast(follower, skillId, spell) {
  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  followerDungeonCompanions[follower.name] = { casterTierName: tierBefore };
  currentCombat.activeEffects = currentCombat.activeEffects.filter(
    (e) => !(e.kind === "companion" && e.owner === follower)
  );
  currentCombat.activeEffects.push({
    kind: "companion",
    rankBonus: 0,
    roundsRemaining: null,
    casterTierName: tierBefore,
    owner: follower
  });

  currentCombat.log.push({
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    skillId: skillId,
    spellName: spell.name,
    castKind: "companion"
  });
}

/**
 * Followers marked inactive (left at Homebase) are skipped
 * entirely in combat — every place that needs "who's actually
 * traveling with you" reads from this instead of the raw
 * followers array.
 */
function getActiveFollowers() {
  return followers.filter((f) => f.active !== false);
}

function getTierRank(tierName) {
  return SKILL_TIERS.findIndex((tier) => tier.name === tierName);
}

function shiftTierByRank(tierName, rankShift) {
  const baseRank = getTierRank(tierName);
  const newRank = Math.max(0, Math.min(SKILL_TIERS.length - 1, baseRank + rankShift));
  return SKILL_TIERS[newRank].name;
}

function rollSuccess(attackerTierName, defenderTierName, adjustment) {
  const base = SUCCESS_CHANCE_BY_TIER[attackerTierName];
  const rankDiff = getTierRank(attackerTierName) - getTierRank(defenderTierName);
  let chance = base + rankDiff * TIER_SHIFT_PER_RANK + (adjustment || 0);
  chance = Math.max(MIN_SUCCESS_CHANCE, Math.min(MAX_SUCCESS_CHANCE, chance));
  return Math.random() < chance;
}

function rollDamage(attackerTierName) {
  const range = DAMAGE_RANGE_BY_TIER[attackerTierName];
  return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
}

function getCurrentDifficultySettings() {
  return DIFFICULTY_SETTINGS[selectedDifficulty] || DIFFICULTY_SETTINGS.normal;
}

/**
 * Now also accounts for: crafted gear quality (Adept/Expert/
 * Master weapons and armor were invisible to this before), each
 * active follower traveling with you (a fuller party fights
 * meaningfully harder than a solo character), and combat-relevant
 * traits (Keen Senses, Thick Hide, Predator's Instinct, Iron
 * Will) — all of which previously had zero effect on difficulty
 * scaling despite meaningfully strengthening the player.
 */
function getPlayerPowerRank() {
  const relevantIds = Object.keys(playerCharacter.skills).filter(
    (id) => SKILLS[id] && (SKILLS[id].category === "Weapon" || SKILLS[id].category === "Magic")
  );

  let bestRank = 0;
  relevantIds.forEach((id) => {
    const rank = getTierRank(getCharacterSkillTier(playerCharacter, id).name);
    if (rank > bestRank) bestRank = rank;
  });

  let bonusRank = 0;
  if (playerCharacter.weaponEnchantment) bonusRank += 1;
  if (playerCharacter.armorEnchantment) bonusRank += 1;
  const style = COMBAT_STYLES[playerCharacter.combatStyle];
  if (style) bonusRank += style.attackBonus + style.defenseBonus;

  const craftedWeaponBonus = getCraftedItemBonus(playerCharacter, playerCharacter.equippedWeaponSkill);
  const craftedArmorBonus = getCraftedItemBonus(playerCharacter, playerCharacter.equippedArmorSkill);
  bonusRank += craftedWeaponBonus + craftedArmorBonus;

  bonusRank += getActiveFollowers().length;

  const combatTraitIds = ["keenSenses", "thickHide", "predatorInstinct", "ironWill"];
  if (playerCharacter.traits) {
    bonusRank += playerCharacter.traits.filter((t) => combatTraitIds.includes(t)).length;
  }

  return bestRank + bonusRank;
}

function getAdaptiveScaling() {
  const powerRank = getPlayerPowerRank();
  return {
    hpMultiplier: 1 + powerRank * 0.95,
    damageMultiplier: 1 + powerRank * 0.38
  };
}

/**
 * Now accepts an optional owner (defaults to playerCharacter).
 * Effects without an explicit "owner" field are treated as
 * belonging to the player — so every existing player spell
 * still works exactly as before, with zero changes needed on
 * their end. Follower-owned effects (added starting this batch)
 * are the only ones that ever set owner explicitly.
 */
/**
 * Casting a curse (dot-type effect) that's already active on the
 * enemy replaces the old copy instead of stacking a second one —
 * only one instance of any specific curse can ever be active at
 * once, no matter who cast it or how many times it's recast.
 */
function pushDotEffect(newEffect, allowStack) {
  if (!allowStack) {
    currentCombat.activeEffects = currentCombat.activeEffects.filter(
      (e) => !(e.kind === "dot" && e.spellName === newEffect.spellName)
    );
  }
  currentCombat.activeEffects.push(newEffect);
}

/**
 * Cooldown tracking for spells like Warrior's Fire that can't be
 * recast immediately after use. Lives on currentCombat (resets
 * each fight), keyed by character + spellId so player and
 * followers each track their own cooldowns independently.
 */
function getSpellCooldownRemaining(character, spellId) {
  if (!currentCombat.spellCooldowns) return 0;
  const entry = currentCombat.spellCooldowns.find(
    (c) => c.character === character && c.spellId === spellId
  );
  return entry ? entry.roundsRemaining : 0;
}

function setSpellCooldown(character, spellId, rounds) {
  if (!currentCombat.spellCooldowns) currentCombat.spellCooldowns = [];
  const existing = currentCombat.spellCooldowns.find(
    (c) => c.character === character && c.spellId === spellId
  );
  if (existing) {
    existing.roundsRemaining = rounds;
  } else {
    currentCombat.spellCooldowns.push({ character, spellId, roundsRemaining: rounds });
  }
}

function tickSpellCooldowns() {
  if (!currentCombat.spellCooldowns) return;
  const nimbleRecovery = playerCharacter.equippedArmorSkill === "leatherArmor" && hasChosenPerk(playerCharacter, "leatherArmor", "nimbleRecovery");
  currentCombat.spellCooldowns.forEach((c) => {
    c.roundsRemaining -= (nimbleRecovery && c.character === playerCharacter) ? 2 : 1;
  });
  currentCombat.spellCooldowns = currentCombat.spellCooldowns.filter((c) => c.roundsRemaining > 0);
}

function getEffectRankSum(kind, owner) {
  const targetOwner = owner || playerCharacter;
  return currentCombat.activeEffects
    .filter((e) => e.kind === kind && (e.partyWide || (e.owner || playerCharacter) === targetOwner))
    .reduce((sum, e) => sum + e.rankBonus, 0);
}

/**
 * Generic version of getPlayerCombatStyleBonus() that works for
 * any character, not just the player. Shield/offhand-equipment
 * gating only applies to the player for now, since followers
 * don't yet have their own shield/offhand equip UI.
 */
function getCombatStyleBonusFor(character) {
  const style = COMBAT_STYLES[character.combatStyle];
  if (!style) return { attackBonus: 0, defenseBonus: 0, spellDamageBonus: 0, healBonus: 0, supportBonus: 0 };

  const result = Object.assign({}, style);

  if (character === playerCharacter) {
    const needsShield = character.combatStyle === "swordShield" || character.combatStyle === "axeShield";
    if (needsShield && !character.equippedShield) {
      result.defenseBonus = 0;
    }
    if (character.combatStyle === "dual" && !character.equippedOffhandSkill) {
      result.attackBonus = 0;
    }
  }

  if (character.chronicleBonuses) {
    result.attackBonus = Math.round((result.attackBonus || 0) + (character.chronicleBonuses.attackBonus || 0));
    result.spellDamageBonus = Math.round((result.spellDamageBonus || 0) + (character.chronicleBonuses.spellDamageBonus || 0));
    result.healBonus = Math.round((result.healBonus || 0) + (character.chronicleBonuses.healBonus || 0));
    result.supportBonus = Math.round((result.supportBonus || 0) + (character.chronicleBonuses.supportBonus || 0));
  }

  return result;
}

function getEffectiveAttackTierFor(character, baseTierName) {
  const equipBonus = character.weaponEnchantment ? 1 : 0;
  const styleBonus = getCombatStyleBonusFor(character).attackBonus;
  const craftedBonus = getCraftedItemBonus(character, character.equippedWeaponSkill);
  const traitBonus = (character.traits && character.traits.includes("weightedStrike")) ? TRAIT_ATTACK_DAMAGE_RANK_BONUS.weightedStrike : 0;
  return shiftTierByRank(baseTierName, getEffectRankSum("playerAttackBonus", character) + equipBonus + styleBonus + craftedBonus + traitBonus);
}

function getEffectiveSpellDamageTierFor(character, baseTierName) {
  const baseAttackTier = getEffectiveAttackTierFor(character, baseTierName);
  const spellBonus = getCombatStyleBonusFor(character).spellDamageBonus || 0;
  const songBonus = getEffectRankSum("spellDamageBuff", character);
  const traitBonus = (character.traits && character.traits.includes("arcaneGift")) ? TRAIT_SPELL_DAMAGE_RANK_BONUS.arcaneGift : 0;
  return shiftTierByRank(baseAttackTier, spellBonus + songBonus + traitBonus);
}

function getEffectiveHealTierFor(character, baseTierName) {
  const healBonus = getCombatStyleBonusFor(character).healBonus || 0;
  return shiftTierByRank(baseTierName, healBonus);
}

function getEffectiveSupportTierFor(character, baseTierName) {
  const supportBonus = getCombatStyleBonusFor(character).supportBonus || 0;
  return shiftTierByRank(baseTierName, supportBonus);
}

/**
 * Bard songs (Line of Siuloir) are persistent effects — they
 * never expire on their own, but only 2 can play at once.
 */
function getActiveSongCount() {
  return currentCombat.activeEffects.filter((e) => e.source === "song" && (e.owner || playerCharacter) === playerCharacter).length;
}

function stopSong(spellName) {
  const idx = currentCombat.activeEffects.findIndex(
    (e) => e.source === "song" && e.spellName === spellName && (e.owner || playerCharacter) === playerCharacter
  );
  if (idx === -1) return false;
  const effect = currentCombat.activeEffects[idx];
  if (effect.kind === "fortify" && effect.bonusHP) {
    playerCharacter.currentHP = Math.max(0, playerCharacter.currentHP - effect.bonusHP);
  }
  currentCombat.activeEffects.splice(idx, 1);
  currentCombat.log.push({ actor: "effect", kind: "songStopped", spellName: spellName });
  return true;
}

function stopAllSongsFor(character) {
  const isPlayer = character === playerCharacter;
  const songs = currentCombat.activeEffects.filter((e) =>
    e.source === "song" && (isPlayer ? (e.owner || playerCharacter) === playerCharacter : e.owner === character)
  );
  songs.forEach((effect) => {
    if (effect.kind === "fortify" && effect.bonusHP) {
      const fortifyTargets = effect.partyWide ? [playerCharacter, ...getActiveFollowers()] : [character];
      fortifyTargets.forEach((t) => { t.currentHP = Math.max(0, t.currentHP - effect.bonusHP); });
    }
    currentCombat.log.push({
      actor: "effect",
      kind: "songStopped",
      spellName: effect.spellName,
      ownerName: isPlayer ? undefined : character.name
    });
  });
  currentCombat.activeEffects = currentCombat.activeEffects.filter((e) => !songs.includes(e));
}

/**
 * Sword & Shield / Axe & Shield only grant their defense bonus
 * if a Shield is actually equipped, and Dual Wielding only
 * grants its attack bonus if a second weapon is actually
 * equipped in the offhand — picking the style alone is no
 * longer enough on its own.
 */
const SHIELD_TIER_BONUS = { Untrained: 0, Novice: 0, Adept: 1, Expert: 2, Master: 3 };

function getPlayerCombatStyleBonus() {
  const style = COMBAT_STYLES[playerCharacter.combatStyle];
  if (!style) return { attackBonus: 0, defenseBonus: 0, spellDamageBonus: 0, healBonus: 0, supportBonus: 0 };

  const result = Object.assign({}, style);

  const needsShield = playerCharacter.combatStyle === "swordShield" || playerCharacter.combatStyle === "axeShield";
  if (needsShield && !playerCharacter.equippedShield) {
    result.defenseBonus = 0;
  } else if (needsShield && playerCharacter.equippedShield) {
    const shieldTierName = getCharacterSkillTier(playerCharacter, "shields").name;
    result.defenseBonus += SHIELD_TIER_BONUS[shieldTierName] || 0;
    if (hasChosenPerk(playerCharacter, "shields", "bracedStance")) result.defenseBonus += 1;
    if (hasChosenPerk(playerCharacter, "shields", "unbreakableWall")) result.defenseBonus += 1;
  }

  if (playerCharacter.combatStyle === "dual" && !playerCharacter.equippedOffhandSkill) {
    result.attackBonus = 0;
  }

  if (playerCharacter.chronicleBonuses) {
    result.attackBonus = Math.round((result.attackBonus || 0) + (playerCharacter.chronicleBonuses.attackBonus || 0));
    result.spellDamageBonus = Math.round((result.spellDamageBonus || 0) + (playerCharacter.chronicleBonuses.spellDamageBonus || 0));
    result.healBonus = Math.round((result.healBonus || 0) + (playerCharacter.chronicleBonuses.healBonus || 0));
    result.supportBonus = Math.round((result.supportBonus || 0) + (playerCharacter.chronicleBonuses.supportBonus || 0));
  }

  return result;
}

function getEffectivePlayerAttackTier(baseTierName) {
  const equipBonus = playerCharacter.weaponEnchantment ? 1 : 0;
  const styleBonus = getPlayerCombatStyleBonus().attackBonus;
  const craftedBonus = getCraftedItemBonus(playerCharacter, playerCharacter.equippedWeaponSkill);
  const traitBonus = (playerCharacter.traits && playerCharacter.traits.includes("weightedStrike")) ? TRAIT_ATTACK_DAMAGE_RANK_BONUS.weightedStrike : 0;
  let weaponMasteryBonus = 0;
  const equippedWeapon = playerCharacter.equippedWeaponSkill;
  if (equippedWeapon === "swords" && hasChosenPerk(playerCharacter, "swords", "mastersForm")) weaponMasteryBonus += 1;
  if (equippedWeapon === "axes" && hasChosenPerk(playerCharacter, "axes", "cleavingForce")) weaponMasteryBonus += 1;
  if (equippedWeapon === "archery" && hasChosenPerk(playerCharacter, "archery", "practicedVolley")) weaponMasteryBonus += 1;
  if (equippedWeapon === "unarmedCombat" && hasChosenPerk(playerCharacter, "unarmedCombat", "disciplinedForm")) weaponMasteryBonus += 1;
  return shiftTierByRank(baseTierName, getEffectRankSum("playerAttackBonus") + equipBonus + styleBonus + craftedBonus + traitBonus + weaponMasteryBonus);
}

function getEffectivePlayerSpellDamageTier(baseTierName) {
  const baseAttackTier = getEffectivePlayerAttackTier(baseTierName);
  const spellBonus = getPlayerCombatStyleBonus().spellDamageBonus || 0;
  const traitBonus = (playerCharacter.traits && playerCharacter.traits.includes("arcaneGift")) ? TRAIT_SPELL_DAMAGE_RANK_BONUS.arcaneGift : 0;
  const songBonus = getEffectRankSum("spellDamageBuff");
  const clothBonus = (playerCharacter.equippedArmorSkill === "clothArmor" && hasChosenPerk(playerCharacter, "clothArmor", "practicedCasting")) ? 1 : 0;
  return shiftTierByRank(baseAttackTier, spellBonus + songBonus + traitBonus + clothBonus);
}

function getEffectivePlayerHealTier(baseTierName) {
  const healBonus = getPlayerCombatStyleBonus().healBonus || 0;
  return shiftTierByRank(baseTierName, healBonus);
}

function getEffectivePlayerSupportTier(baseTierName) {
  const supportBonus = getPlayerCombatStyleBonus().supportBonus || 0;
  return shiftTierByRank(baseTierName, supportBonus);
}

function getEffectiveEnemyTier() {
  return shiftTierByRank(
    currentCombat.enemyThreatTier,
    getEffectRankSum("enemyDebuff") + getEffectRankSum("defenseDebuff")
  );
}

/**
 * Used only for the enemy's OWN attack roll (their accuracy),
 * separate from getEffectiveEnemyTier (used when YOU attack
 * them). Existing enemyDebuff spells weaken both, same as
 * before — accuracyDebuff (Blinding Curse) only weakens this one.
 */
function getEnemyAttackTier() {
  return shiftTierByRank(
    currentCombat.enemyThreatTier,
    getEffectRankSum("enemyDebuff") + getEffectRankSum("accuracyDebuff")
  );
}

function getArmorEnchantDefenseBonus() {
  if (!playerCharacter.armorEnchantment) return 0;
  const effect = ARMOR_ENCHANT_EFFECTS[playerCharacter.armorEnchantment.type];
  return effect ? effect.defenseBonus : 0;
}

/**
 * Flat damage reduction from Aegis Ward / Circle of Aegis —
 * applies to every hit regardless of attack type (physical or
 * magic), unlike the tier-shift defenses above which only cover
 * physical attacks. A separate function since it needs to be
 * subtracted from the final damage number, not folded into a
 * success-chance tier shift.
 */
/**
 * Keen Senses: your very first action each fight (melee or
 * spell) gets a sharp accuracy bonus, as you spot the opening
 * before the enemy is ready. Consumes itself once used.
 */
function consumeKeenSensesBonus() {
  if (currentCombat.firstPlayerActionTaken) return 0;
  currentCombat.firstPlayerActionTaken = true;
  if (playerCharacter.traits && playerCharacter.traits.includes("keenSenses")) return 2;
  return 0;
}

/**
 * Thick Hide: flat damage reduction on every PHYSICAL hit you
 * personally take — doesn't apply to magic attacks, and doesn't
 * apply to followers.
 */
function getThickHideReduction(target, attackType) {
  if (target !== playerCharacter || attackType !== "physical") return 0;
  if (playerCharacter.traits && playerCharacter.traits.includes("thickHide")) return 2;
  return 0;
}

const NIGHTSIGHT_DUNGEON_IDS = ["frosthollowVault", "blackforgeDeep"];

/**
 * Nightsight grants a small accuracy bonus specifically while
 * fighting inside your colder, darker dungeons.
 */
function getNightsightBonus() {
  if (!playerCharacter.traits || !playerCharacter.traits.includes("nightsight")) return 0;
  if (!NIGHTSIGHT_DUNGEON_IDS.includes(selectedDungeonId)) return 0;
  return 1;
}

/**
 * Vulnerability Curse (Rite of Unmaking) amplifies EVERY hit the
 * enemy takes, from any source — melee, spells, follower attacks,
 * dot ticks, companion hits. This central helper is what every
 * damage-to-enemy code path routes through so the bonus applies
 * universally instead of needing separate logic at each site.
 */
/**
 * Rite of Protection's 5 "ward" spells (everything except Ward
 * of the Deep) don't work like normal spells — once active, they
 * silently trigger every time the caster is hit, for as long as
 * combat lasts (no duration, no recast). This checks the active
 * wards and applies whichever ones the owner has up.
 */
function triggerOnHitWards(character) {
  const wards = currentCombat.activeEffects.filter(
    (e) => e.kind === "onHitWard" && e.owner === character
  );

  wards.forEach((ward) => {
    if (ward.wardType === "onHitBuff") {
      const rank = (ward.spellName === "Fury's Answer" && hasChosenPerk(playerCharacter, "riteProtection", "furysEdge")) ? 2 : 1;
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: rank, roundsRemaining: 1 });
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: "grows stronger" });
    } else if (ward.wardType === "onHitHeal") {
      const maxHP = getHitPoints(character);
      let healAmt = Math.max(1, Math.floor(rollDamage("Novice") / 2));
      if (ward.spellName === "Mercy's Touch" && hasChosenPerk(playerCharacter, "riteProtection", "mercysDepth")) {
        healAmt = Math.round(healAmt * 1.5);
      }
      character.currentHP = Math.min(maxHP, character.currentHP + healAmt);
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: `mends ${healAmt} Hit Points` });
    } else if (ward.wardType === "onHitManaRegen") {
      const manaMax = getManaPoolMax(character);
      let manaAmt = 5;
      if (ward.spellName === "Deep Current" && hasChosenPerk(playerCharacter, "riteProtection", "deeperCurrent")) {
        manaAmt = 8;
      }
      character.currentMana = Math.min(manaMax, character.currentMana + manaAmt);
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: `returns ${manaAmt} mana` });
    } else if (ward.wardType === "onHitGroupHeal") {
      let healAmt = Math.max(1, Math.floor(rollDamage("Novice") / 2));
      if (ward.spellName === "Mother's Circle" && hasChosenPerk(playerCharacter, "riteProtection", "widerCircle")) {
        healAmt = Math.round(healAmt * 1.5);
      }
      [playerCharacter, ...getActiveFollowers()].forEach((member) => {
        if (member.currentHP <= 0) return;
        const maxHP = getHitPoints(member);
        member.currentHP = Math.min(maxHP, member.currentHP + healAmt);
      });
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: `mends the whole party for ${healAmt}` });
    } else if (ward.wardType === "onHitDebuff") {
      const debuffRank = (ward.spellName === "Undertow" && hasChosenPerk(playerCharacter, "riteProtection", "undertowsGrip")) ? -2 : -1;
      currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: debuffRank, roundsRemaining: 1 });
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: "drags your foe down" });
    }
  });
}

function applyDamageToEnemy(rawDamage) {
  const hasVulnerability = currentCombat.activeEffects.some((e) => e.kind === "vulnerability");
  const finalDamage = hasVulnerability ? Math.round(rawDamage * 1.25) : rawDamage;
  currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - finalDamage);
  return finalDamage;
}

function getFlatDamageAbsorb(character) {
  let total = 0;
  currentCombat.activeEffects.forEach((e) => {
    if (e.kind === "absorb" && (e.target === "all" || e.target === character)) {
      total += e.reduction;
    }
  });
  return total;
}

const ENEMY_CASTABLE_TYPES = ["damage", "burst"];

/**
 * Picks a random damage-flavored spell from whichever culture
 * the current dungeon belongs to — this is what gives magic
 * enemies a genuine, named spell instead of generic magic
 * damage. Returns null if the dungeon has no culture tag, or
 * that culture has no usable spells (shouldn't normally happen).
 */
const ENEMY_EXCLUDED_SKILL_IDS = ["ancestralFetch", "wayYokai"];

function getEnemyCultureSpell() {
  const dungeon = DUNGEONS[selectedDungeonId];
  if (!dungeon || !dungeon.culture) return null;
  const culture = CULTURES[dungeon.culture];
  if (!culture) return null;

  const castableTypes = dungeon.enemyCastableTypes || ENEMY_CASTABLE_TYPES;

  const pool = [];
  culture.magicSkillIds.forEach((skillId) => {
    if (ENEMY_EXCLUDED_SKILL_IDS.includes(skillId)) return;
    const spells = SPELLS[skillId] || [];
    spells.forEach((spell) => {
      if (castableTypes.includes(spell.type)) {
        pool.push({ skillId, spell, cultureId: dungeon.culture });
      }
    });
  });

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Runes of the Vision guarantee effects (guaranteedHit,
 * guaranteedSpellHit, guaranteedFollowerAction, guaranteedDodge,
 * guaranteedStun) are all one-shot — the FIRST time the matching
 * moment comes up, they consume themselves. This checks for one
 * by kind, removes it if found, and returns whether it was there.
 */
function consumeGuaranteedEffect(kind) {
  const idx = currentCombat.activeEffects.findIndex((e) => e.kind === kind);
  if (idx === -1) return false;
  if (hasChosenPerk(playerCharacter, "runeVision", "twiceSeen") && Math.random() < 0.3) return true;
  currentCombat.activeEffects.splice(idx, 1);
  return true;
}

/**
 * Same idea as consumeGuaranteedEffect, but scoped to a specific
 * character — needed for guaranteedDodge now that both the player
 * and followers can each have their own, so consuming one doesn't
 * accidentally consume someone else's.
 */
function consumeGuaranteedEffectFor(character) {
  const idx = currentCombat.activeEffects.findIndex((e) => e.kind === "guaranteedDodge" && e.target === character);
  if (idx === -1) return false;
  currentCombat.activeEffects.splice(idx, 1);
  return true;
}

/**
 * AC and Dodge are now tracked as separate buffable tiers (via
 * "acBuff" and "dodgeBuff" effect kinds) so a spell can boost
 * one without the other, then the higher of the two still wins
 * as your effective physical defense, same as before.
 */
/**
 * Now applies buffs to WHOEVER is defending, not just the
 * player — a follower's own Ironrune Guard, acBuff, dodgeBuff,
 * or defensive song now correctly protects her when an enemy
 * targets her specifically. Armor enchantment bonuses stay
 * player-only, since followers don't have their own enchant
 * slots yet.
 */
function getDefendingTierName(attackType, character) {
  if (attackType === "magic") {
    return getAdvantageTier(character, "magicResistance").name;
  }

  let acTierName = getAdvantageTier(character, "armorClass").name;
  let dodgeTierName = getAdvantageTier(character, "dodge").name;

  const equipBonus = character === playerCharacter ? getArmorEnchantDefenseBonus() : 0;
  const styleBonus = getCombatStyleBonusFor(character).defenseBonus;
  let armorAcBonus = 0;
  let armorDodgeBonus = 0;
  if (character === playerCharacter) {
    const armor = character.equippedArmorSkill;
    if (armor === "plateArmor") {
      if (hasChosenPerk(character, "plateArmor", "reinforcedPlating")) armorAcBonus += 1;
      if (hasChosenPerk(character, "plateArmor", "weightedGuard")) armorAcBonus += 1;
    } else if (armor === "chainArmor") {
      if (hasChosenPerk(character, "chainArmor", "flexibleLinks")) armorAcBonus += 1;
      if (hasChosenPerk(character, "chainArmor", "sturdyChain")) armorAcBonus += 1;
      if (hasChosenPerk(character, "chainArmor", "balancedWeight")) armorDodgeBonus += 1;
      if (hasChosenPerk(character, "chainArmor", "practicedBearing")) armorDodgeBonus += 1;
    } else if (armor === "leatherArmor") {
      if (hasChosenPerk(character, "leatherArmor", "suppleHide")) armorDodgeBonus += 1;
      if (hasChosenPerk(character, "leatherArmor", "evasiveInstinct")) armorDodgeBonus += 1;
    } else if (armor === "clothArmor") {
      if (hasChosenPerk(character, "clothArmor", "lightBearing")) armorDodgeBonus += 1;
    }
  }
  const generalBonus = getEffectRankSum("playerDefenseBonus", character) + equipBonus + styleBonus;
  acTierName = shiftTierByRank(acTierName, generalBonus + getEffectRankSum("acBuff", character) + armorAcBonus);
  dodgeTierName = shiftTierByRank(dodgeTierName, generalBonus + getEffectRankSum("dodgeBuff", character) + armorDodgeBonus);

  return getTierRank(acTierName) >= getTierRank(dodgeTierName) ? acTierName : dodgeTierName;
}

function startCombat(enemyId) {
  const enemyTemplate = ENEMIES[enemyId];
  const diff = getCurrentDifficultySettings();
  const adaptive = getAdaptiveScaling();
  const scaledMaxHP = Math.max(
    1,
    Math.round(enemyTemplate.hitPoints * diff.enemyHpMultiplier * adaptive.hpMultiplier)
  );

  const maxHP = getHitPoints(playerCharacter);
  if (playerCharacter.currentHP === undefined || playerCharacter.currentHP === null) {
    playerCharacter.currentHP = maxHP;
  } else if (playerCharacter.currentHP > maxHP) {
    playerCharacter.currentHP = maxHP;
  }

  getActiveFollowers().forEach((follower) => {
    const followerMaxHP = getHitPoints(follower);
    if (follower.currentHP === undefined || follower.currentHP === null) {
      follower.currentHP = followerMaxHP;
    } else if (follower.currentHP > followerMaxHP) {
      follower.currentHP = followerMaxHP;
    }
    if (follower.currentMana === undefined || follower.currentMana === null) {
      follower.currentMana = getManaPoolMax(follower);
    }
  });

  const initialEffects = [];
  if (dungeonCompanion) {
    initialEffects.push({
      kind: "companion",
      rankBonus: 0,
      roundsRemaining: null,
      casterTierName: dungeonCompanion.casterTierName
    });
  }
  getActiveFollowers().forEach((follower) => {
    const followerCompanion = followerDungeonCompanions[follower.name];
    if (followerCompanion) {
      initialEffects.push({
        kind: "companion",
        rankBonus: 0,
        roundsRemaining: null,
        casterTierName: followerCompanion.casterTierName,
        owner: follower
      });
    }
  });

  if (hasChosenPerk(playerCharacter, "runeVision", "wardedInstinct")) {
    initialEffects.push({ kind: "guaranteedDodge", rankBonus: 0, roundsRemaining: null, target: playerCharacter });
  }
  if (hasChosenPerk(playerCharacter, "runeVision", "theLongSight")) {
    initialEffects.push({ kind: "guaranteedDodge", rankBonus: 0, roundsRemaining: null, target: playerCharacter });
  }
  if (hasChosenPerk(playerCharacter, "pathStorm", "eyeOfTheStorm")) {
    initialEffects.push({ kind: "eyeOfTheStorm", rankBonus: 0, roundsRemaining: null });
  }

  const gameViewportEl = document.getElementById("game-viewport");
  if (gameViewportEl) {
    gameViewportEl.classList.remove(
      "hit-flash-fire", "hit-flash-physical", "hit-flash-lightning",
      "hit-flash-ice", "hit-flash-poison", "heal-flash", "low-hp-pulse"
    );
  }

  currentCombat = {
    enemyId: enemyId,
    enemyName: enemyTemplate.name,
    enemyDescription: enemyTemplate.description,
    enemyMaxHP: scaledMaxHP,
    enemyCurrentHP: scaledMaxHP,
    enemyThreatTier: enemyTemplate.threatTier,
    enemyAttackType: enemyTemplate.attackType,
    playerDefending: false,
    activeEffects: initialEffects,
    firstPlayerActionTaken: false,
    log: [],
    result: null
  };

  return currentCombat;
}

const PASSIVE_MANA_REGEN_PER_ROUND = 3;

/**
 * Every living character — player and followers alike — slowly
 * regenerates a small amount of mana each round, regardless of
 * any active spell effect. Silent (no log entry) since it happens
 * every single round and would otherwise clutter the combat log.
 * Meaningfully slower than a bard's manaRegen song (+8/round).
 */
function applyPassiveManaRegen() {
  [playerCharacter, ...getActiveFollowers()].forEach((character) => {
    if (character.currentHP <= 0) return;
    const manaMax = getManaPoolMax(character);
    character.currentMana = Math.min(manaMax, character.currentMana + PASSIVE_MANA_REGEN_PER_ROUND);
  });
}

function tickCombatEffects() {
  currentCombat.activeEffects.forEach((effect) => {
    const owner = effect.owner || playerCharacter;

    if (effect.source === "song" && owner.currentHP <= 0) {
      effect._ownerDowned = true;
      return;
    }

    if (effect.source === "song") {
      effect.roundsSung = (effect.roundsSung || 0) + 1;
    }

    if (effect.kind === "dot") {
      const dmg = applyDamageToEnemy(Math.max(1, Math.floor(rollDamage(effect.casterTierName) / 2 * (1 + (effect.tickBonusPct || 0)))));
      currentCombat.log.push({ actor: "effect", kind: "dot", damage: dmg, spellName: effect.spellName });
    } else if (effect.kind === "companion") {
      const kinshipBonus = playerCharacter.traits && playerCharacter.traits.includes("beastkinship") ? 1 : 0;
      let companionBonusRank = 0;
      if (effect.spellName === "Wolf's Call" && hasChosenPerk(playerCharacter, "pathWild", "loyalWolf")) companionBonusRank = 1;
      if (effect.spellName === "Hollow Hound" && hasChosenPerk(playerCharacter, "pathBarrow", "hollowHunger")) companionBonusRank = 1;
      if (effect.spellName === "Onryō's Wrath" && hasChosenPerk(playerCharacter, "wayOnmyoji", "vengefulBond")) companionBonusRank = 1;
      if (effect.spellName === "Ember-Lash" && hasChosenPerk(playerCharacter, "riteThunderWrath", "embersCall")) companionBonusRank = 1;
      if (effect.spellName === "Thunder Caller" && hasChosenPerk(playerCharacter, "riteThunderWrath", "thundersCall")) companionBonusRank = 1;
      const heavyTier = shiftTierByRank(effect.casterTierName || "Novice", 2 + kinshipBonus + companionBonusRank);
      const dmg = applyDamageToEnemy(rollDamage(heavyTier));
      currentCombat.log.push({ actor: "effect", kind: "companion", damage: dmg });
    } else if (effect.kind === "hot" && owner.currentHP > 0) {
      const healTargets = effect.partyWide ? [playerCharacter, ...getActiveFollowers()] : [owner];
      healTargets.forEach((target) => {
        if (target.currentHP <= 0) return;
        const maxHP = getHitPoints(target);
        if (target.currentHP < maxHP) {
          const healAmt = Math.max(1, Math.floor(rollDamage(effect.casterTierName || "Novice") / 2 * (1 + (effect.healBonusPct || 0))));
          target.currentHP = Math.min(maxHP, target.currentHP + healAmt);
          currentCombat.log.push({ actor: "effect", kind: "hot", healAmount: healAmt, spellName: effect.spellName, ownerName: target.name });
        }
      });
    } else if (effect.kind === "manaRegen") {
      const manaMax = getManaPoolMax(owner);
      const before = owner.currentMana;
      owner.currentMana = Math.min(manaMax, owner.currentMana + 8 + (effect.regenBonus || 0));
      const actualGain = owner.currentMana - before;
      if (actualGain > 0) {
        currentCombat.log.push({ actor: "effect", kind: "manaRegen", manaAmount: actualGain, spellName: effect.spellName, ownerName: owner.name });
      }
    } else if (
      effect.source === "song" &&
      (effect.kind === "playerAttackBonus" || effect.kind === "fortify" || effect.kind === "spellDamageBuff")
    ) {
      currentCombat.log.push({ actor: "effect", kind: "songContinues", spellName: effect.spellName, ownerName: owner.name });
    }

    if (effect.source === "song") {
      let songDrainAmount = 3;
      if (effect.spellName === "Lay of Mending" && hasChosenPerk(playerCharacter, "ancestralSiuloir", "lingeringMelody")) {
        songDrainAmount = 2;
      }
      if (effect.spellName === "Skald's Lay of Mending" && hasChosenPerk(playerCharacter, "runeSong", "skaldsMemory")) {
        songDrainAmount = 2;
      }
      if (effect.spellName === "Griot's Healing Refrain" && hasChosenPerk(playerCharacter, "riteGriot", "healingRhythm")) {
        songDrainAmount = 2;
      }
      if (owner.currentMana >= songDrainAmount) {
        owner.currentMana -= songDrainAmount;
      } else {
        owner.currentMana = 0;
        effect._outOfMana = true;
      }
    }
  });

  currentCombat.activeEffects = currentCombat.activeEffects.filter((effect) => {
    const owner = effect.owner || playerCharacter;
    const fortifyTargets = effect.partyWide ? [playerCharacter, ...getActiveFollowers()] : [owner];

    if (effect._outOfMana) {
      if (effect.kind === "fortify" && effect.bonusHP) {
        fortifyTargets.forEach((t) => { t.currentHP = Math.max(0, t.currentHP - effect.bonusHP); });
      }
      if ((hasChosenPerk(playerCharacter, "ancestralSiuloir", "endlessRefrain") || hasChosenPerk(playerCharacter, "riteGriot", "unbrokenRhythm")) && Math.random() < 0.35) {
        owner.currentMana = 1;
        return true;
      }
      currentCombat.log.push({ actor: "effect", kind: "songStopped", spellName: effect.spellName, outOfMana: true, ownerName: owner.name });
      return false;
    }

    if (effect._ownerDowned) {
      if (effect.kind === "fortify" && effect.bonusHP) {
        fortifyTargets.forEach((t) => { t.currentHP = Math.max(0, t.currentHP - effect.bonusHP); });
      }
      currentCombat.log.push({ actor: "effect", kind: "songStopped", spellName: effect.spellName, ownerDowned: true, ownerName: owner.name });
      return false;
    }
    if (effect._justCast) {
      effect._justCast = false;
      return true;
    }
    if (effect.roundsRemaining === null) return true;
    effect.roundsRemaining -= 1;
    if (effect.roundsRemaining <= 0) {
      const isAverickBuffEffect = effect.kind === "playerAttackBonus" &&
        ["Flametouched Blade", "Glacial Edge", "Warblood Fury"].includes(effect.spellName);
      if (isAverickBuffEffect && hasChosenPerk(playerCharacter, "ancestralAverick", "undyingBloodline") && Math.random() < 0.35) {
        effect.roundsRemaining = 5;
        return true;
      }
      const isRuneBladeBuffEffect = effect.kind === "playerAttackBonus" &&
        ["Bloodfury Mark", "Warcry Rune"].includes(effect.spellName);
      if (isRuneBladeBuffEffect && hasChosenPerk(playerCharacter, "runeBlade", "runesRenewed") && Math.random() < 0.35) {
        effect.roundsRemaining = SPELL_EFFECT_DURATION;
        return true;
      }
      if (effect.kind === "fortify" && effect.bonusHP) {
        fortifyTargets.forEach((t) => { t.currentHP = Math.max(0, t.currentHP - effect.bonusHP); });
      }
      return false;
    }
    return true;
  });
}

function pickEnemyTarget() {
  const candidates = [playerCharacter];
  getActiveFollowers().forEach((f) => {
    if (f.currentHP > 0) candidates.push(f);
  });
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getFollowerAttackPick(follower) {
  const skillId = follower.equippedWeaponSkill || "unarmedCombat";
  const tierName = getCharacterSkillTier(follower, skillId).name;
  return { skillId, tierName };
}

function getFollowerHealOption(follower) {
  const magicSkillIds = Object.keys(follower.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );
  for (const skillId of magicSkillIds) {
    const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    const allSpells = SPELLS[skillId] || [];
    const healSpell = allSpells.find(
      (s) => s.type === "heal" && known.includes(s.id) && isSpellActive(follower, s.id)
    );
    if (healSpell) return { skillId, spell: healSpell };
  }
  return null;
}

/**
 * How many songs this specific follower currently has active —
 * mirrors the player's 2-song cap, but counted per-follower so
 * one follower singing doesn't block another from singing too.
 */
function getFollowerSongCount(follower) {
  return currentCombat.activeEffects.filter((e) => e.source === "song" && e.owner === follower).length;
}

/**
 * Finds a Line of Siuloir song this follower knows, has active,
 * and isn't already singing — she won't try to sing the same
 * song twice in one fight.
 */
const BARD_SKILL_IDS = ["ancestralSiuloir", "waySuijin", "runeSong", "riteGriot"];

function getFollowerSongOption(follower) {
  const currentSong = currentCombat.activeEffects.find((e) => e.source === "song" && e.owner === follower);
  if (currentSong && (currentSong.roundsSung || 0) < 5) return null;

  const alreadySinging = currentSong ? [currentSong.spellName] : [];

  for (const skillId of BARD_SKILL_IDS) {
    if (!follower.skills[skillId]) continue;
    const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    const allSpells = SPELLS[skillId] || [];
    const songSpell = allSpells.find(
      (s) => known.includes(s.id) && isSpellActive(follower, s.id) && !alreadySinging.includes(s.name)
    );
    if (songSpell) return { skillId, spell: songSpell };
  }
  return null;
}

/**
 * Actually sings the song — mirrors the relevant branches of
 * performPlayerCast, but every effect is tagged with
 * owner: follower, so sub-pieces 1-3's owner-aware functions
 * correctly apply it to HER stats, not the player's.
 */
function performFollowerSongCast(follower, skillId, spell) {
  currentCombat.activeEffects = currentCombat.activeEffects.filter(
    (e) => !(e.source === "song" && e.owner === follower)
  );

  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  useSkill(follower, skillId);
  follower.currentMana -= MANA_CONFIG.costPerCast;

  const logEntry = {
    actor: "follower",
    followerName: follower.name,
    action: "sing",
    spellName: spell.name
  };

  if (spell.type === "hot") {
    currentCombat.activeEffects.push({
      kind: "hot", rankBonus: 0, roundsRemaining: null, casterTierName: tierBefore,
      source: "song", spellName: spell.name, owner: follower, partyWide: true
    });
  } else if (spell.type === "buff") {
    const supportBonus = getCombatStyleBonusFor(follower).supportBonus || 0;
    currentCombat.activeEffects.push({
      kind: "playerAttackBonus", rankBonus: 1 + supportBonus, roundsRemaining: null,
      source: "song", spellName: spell.name, owner: follower, partyWide: true, roundsSung: 0
    });
  } else if (spell.type === "fortify") {
    const bonusAmount = rollDamage(tierBefore);
    [playerCharacter, ...getActiveFollowers()].forEach((t) => { t.currentHP += bonusAmount; });
    currentCombat.activeEffects.push({
      kind: "fortify", rankBonus: 0, roundsRemaining: null, bonusHP: bonusAmount,
      source: "song", spellName: spell.name, owner: follower, partyWide: true
    });
    logEntry.healAmount = bonusAmount;
  } else if (spell.type === "spellDamageBuff") {
    const supportBonus = getCombatStyleBonusFor(follower).supportBonus || 0;
    currentCombat.activeEffects.push({
      kind: "spellDamageBuff", rankBonus: 1 + supportBonus, roundsRemaining: null,
      source: "song", spellName: spell.name, owner: follower, partyWide: true, roundsSung: 0
    });
  } else if (spell.type === "manaRegen") {
    currentCombat.activeEffects.push({
      kind: "manaRegen", rankBonus: 0, roundsRemaining: null,
      source: "song", spellName: spell.name, owner: follower
    });
  } else if (spell.type === "dot") {
    pushDotEffect({
      kind: "dot", rankBonus: 0, roundsRemaining: null, casterTierName: tierBefore,
      source: "song", spellName: spell.name, owner: follower
    });
  }

  currentCombat.log.push(logEntry);
}

const FOLLOWER_ATTACK_SPELL_TYPES = ["damage", "undeadSlayer", "execute", "dot", "doubleDrain", "powerSteal"];

function getFollowerAttackSpellOption(follower) {
  const magicSkillIds = Object.keys(follower.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );
  for (const skillId of magicSkillIds) {
    const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    const allSpells = SPELLS[skillId] || [];
    const attackSpell = allSpells.find((s) => {
      if (!FOLLOWER_ATTACK_SPELL_TYPES.includes(s.type)) return false;
      if (!known.includes(s.id)) return false;
      if (!isSpellActive(follower, s.id)) return false;
      if (s.type === "dot") {
        const alreadyActive = currentCombat.activeEffects.some(
          (e) => e.kind === "dot" && e.spellName === s.name
        );
        if (alreadyActive) return false;
      }
      return true;
    });
    if (attackSpell) return { skillId, spell: attackSpell };
  }
  return null;
}

function performFollowerHeal(follower, skillId, spell, target) {
  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  useSkill(follower, skillId);
  follower.currentMana -= MANA_CONFIG.costPerCast;

  const healAmount = rollDamage(tierBefore);
  const maxHP = getHitPoints(target);
  target.currentHP = Math.min(maxHP, (target.currentHP || 0) + healAmount);

  currentCombat.log.push({
    actor: "follower",
    followerName: follower.name,
    action: "heal",
    targetName: target === playerCharacter ? playerCharacter.name : follower.name,
    healAmount: healAmount
  });
}

function performFollowerAttackSpell(follower, skillId, spell) {
  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  useSkill(follower, skillId);
  follower.currentMana -= MANA_CONFIG.costPerCast;

  if (spell.type === "dot") {
    pushDotEffect({
      kind: "dot",
      rankBonus: 0,
      roundsRemaining: SPELL_EFFECT_DURATION,
      casterTierName: tierBefore,
      spellName: spell.name
    });
    currentCombat.log.push({
      actor: "follower",
      followerName: follower.name,
      action: "cast",
      spellName: spell.name
    });
    return;
  }

  let attackTierName = getEffectiveSpellDamageTierFor(follower, tierBefore);
  if (spell.type === "burst") {
    attackTierName = shiftTierByRank(attackTierName, 2);
  }

  const hit = rollSuccess(attackTierName, getEffectiveEnemyTier());
  let damage = 0;

  if (hit) {
    damage = rollDamage(attackTierName);

    if (spell.type === "undeadSlayer") {
      const enemyTemplate = ENEMIES[currentCombat.enemyId];
      const isUndead = enemyTemplate && (enemyTemplate.soundCategory === "zombie" || enemyTemplate.soundCategory === "spectral");
      if (isUndead) damage = damage * 2;
    } else if (spell.type === "execute") {
      const missingHpPct = 1 - currentCombat.enemyCurrentHP / currentCombat.enemyMaxHP;
      damage = Math.round(damage * (1 + missingHpPct * 1.5));
    }

    damage = applyDamageToEnemy(damage);

    if (spell.type === "lifetap") {
      const followerMax = getHitPoints(follower);
      follower.currentHP = Math.min(followerMax, follower.currentHP + damage);
    } else if (spell.type === "doubleDrain") {
      const followerMax = getHitPoints(follower);
      const manaMax = getManaPoolMax(follower);
      follower.currentHP = Math.min(followerMax, follower.currentHP + damage);
      const manaGain = Math.max(1, Math.floor(damage / 2));
      follower.currentMana = Math.min(manaMax, follower.currentMana + manaGain);
    } else if (spell.type === "powerSteal") {
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION, owner: follower });
      currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
    }
  }

  currentCombat.log.push({
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    spellName: spell.name,
    hit: hit,
    damage: damage
  });
}

/**
 * Followers cast at most ONE Rite of Protection ward per fight —
 * checks their known spells for any ward/autoRevive type they
 * haven't already cast this combat.
 */
function getFollowerWardOption(follower) {
  const alreadyWarded = currentCombat.activeEffects.some(
    (e) => (e.kind === "onHitWard" || e.kind === "autoRevive") && e.owner === follower
  );
  if (alreadyWarded) return null;

  const wardTypes = ["autoRevive", "onHitBuff", "onHitHeal", "onHitManaRegen", "onHitGroupHeal", "onHitDebuff"];
  const knownIds = (follower.knownSpells && follower.knownSpells.riteProtection) || [];
  if (knownIds.length === 0) return null;

  const allSpells = SPELLS.riteProtection || [];
  const castable = allSpells.find((s) => knownIds.includes(s.id) && wardTypes.includes(s.type));
  return castable ? { skillId: "riteProtection", spell: castable } : null;
}

function performFollowerWardCast(follower, skillId, spell) {
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  if (spell.type === "autoRevive") {
    currentCombat.activeEffects.push({
      kind: "autoRevive", rankBonus: 0, roundsRemaining: null, owner: follower, spellName: spell.name
    });
  } else {
    currentCombat.activeEffects.push({
      kind: "onHitWard", rankBonus: 0, roundsRemaining: null, owner: follower, wardType: spell.type, spellName: spell.name
    });
  }

  currentCombat.log.push({
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    spellName: spell.name,
    castKind: "ward"
  });
}

/**
 * Warrior's Fire (cooldownBuff) is a self-buff, not an attack —
 * checks if the follower knows it and it's off cooldown.
 */
function getFollowerCooldownBuffOption(follower) {
  const knownIds = (follower.knownSpells && follower.knownSpells.riteThunderWrath) || [];
  if (knownIds.length === 0) return null;

  const allSpells = SPELLS.riteThunderWrath || [];
  const castable = allSpells.find(
    (s) => knownIds.includes(s.id) && s.type === "cooldownBuff" && getSpellCooldownRemaining(follower, s.id) === 0
  );
  return castable ? { skillId: "riteThunderWrath", spell: castable } : null;
}

function performFollowerCooldownBuffCast(follower, skillId, spell) {
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  currentCombat.activeEffects.push({
    kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: 4, owner: follower, spellName: spell.name
  });
  setSpellCooldown(follower, spell.id, 4);

  currentCombat.log.push({
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    spellName: spell.name,
    castKind: "cooldownBuff"
  });
}

const FOLLOWER_DEBUFF_SPELL_TYPES = ["damageAmpDebuff", "accuracyDebuff", "damageDebuff", "defenseDebuff", "spellLock"];

/**
 * Followers cast a debuff only if that exact effect isn't
 * already active on the enemy from an earlier cast this fight.
 */
function getFollowerDebuffOption(follower) {
  const knownIds = (follower.knownSpells && follower.knownSpells.riteUnmaking) || [];
  if (knownIds.length === 0) return null;

  const allSpells = SPELLS.riteUnmaking || [];
  const castable = allSpells.find((s) => {
    if (!FOLLOWER_DEBUFF_SPELL_TYPES.includes(s.type)) return false;
    if (!knownIds.includes(s.id)) return false;
    const effectKind = s.type === "damageAmpDebuff" ? "vulnerability" : s.type === "spellLock" ? "silence" : s.type;
    return !currentCombat.activeEffects.some((e) => e.kind === effectKind);
  });
  return castable ? { skillId: "riteUnmaking", spell: castable } : null;
}

function performFollowerDebuffCast(follower, skillId, spell) {
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  if (spell.type === "damageAmpDebuff") {
    currentCombat.activeEffects.push({ kind: "vulnerability", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "spellLock") {
    currentCombat.activeEffects.push({ kind: "silence", rankBonus: 0, roundsRemaining: null });
  } else {
    currentCombat.activeEffects.push({ kind: spell.type, rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  }

  currentCombat.log.push({
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    spellName: spell.name,
    castKind: "debuff"
  });
}

const FOLLOWER_YOKAI_FORM_SPELL_IDS = ["fireForm", "waterForm", "earthForm", "windForm", "mistForm", "lightningForm"];

/**
 * Followers cast at most one persistent Way of the Yōkai
 * transformation per fight — mirrors getFollowerWardOption's
 * "already warded" pattern, just checking for an existing
 * yokaiForm effect owned by this follower instead.
 */
function getFollowerYokaiFormOption(follower) {
  const alreadyTransformed = currentCombat.activeEffects.some(
    (e) => e.kind === "yokaiForm" && e.owner === follower
  );
  if (alreadyTransformed) return null;
  const knownIds = (follower.knownSpells && follower.knownSpells.wayYokai) || [];
  if (knownIds.length === 0) return null;
  const allSpells = SPELLS.wayYokai || [];
  const castable = allSpells.find((s) => FOLLOWER_YOKAI_FORM_SPELL_IDS.includes(s.id) && knownIds.includes(s.id) && isSpellActive(follower, s.id));
  return castable ? { skillId: "wayYokai", spell: castable } : null;
}

function performFollowerYokaiFormCast(follower, skillId, spell) {
  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  currentCombat.activeEffects = currentCombat.activeEffects.filter(
    (e) => !((e.kind === "yokaiForm" || e.kind === "fetchForm") && e.owner === follower)
  );
  currentCombat.activeEffects.push({ kind: "yokaiForm", spellName: spell.name, owner: follower, roundsRemaining: YOKAI_FORM_DURATION, _justCast: true });

  const logEntry = {
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    skillId: skillId,
    spellName: spell.name,
    castKind: "yokaiForm"
  };

  if (spell.type === "buff") {
    currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: YOKAI_FORM_DURATION, owner: follower, _justCast: true });
  } else if (spell.type === "acBuff") {
    currentCombat.activeEffects.push({ kind: "acBuff", rankBonus: 1, roundsRemaining: YOKAI_FORM_DURATION, owner: follower, _justCast: true });
  } else if (spell.type === "damageDebuff") {
    currentCombat.activeEffects.push({ kind: "damageDebuff", rankBonus: -1, roundsRemaining: YOKAI_FORM_DURATION, _justCast: true });
  } else if (spell.type === "lifetap") {
    const attackTier = getEffectiveAttackTierFor(follower, tierBefore);
    const hit = rollSuccess(attackTier, getEffectiveEnemyTier());
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      const followerMax = getHitPoints(follower);
      follower.currentHP = Math.min(followerMax, follower.currentHP + damage);
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "burst") {
    const attackTier = shiftTierByRank(getEffectiveAttackTierFor(follower, tierBefore), 2);
    const hit = rollSuccess(attackTier, getEffectiveEnemyTier());
    let damage = 0;
    if (hit) damage = applyDamageToEnemy(rollDamage(attackTier));
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "guaranteedDodge") {
    currentCombat.activeEffects.push({ kind: "guaranteedDodge", rankBonus: 0, roundsRemaining: null, target: follower });
  }

  currentCombat.log.push(logEntry);
}

function performFollowersTurn() {
  const activeFollowers = getActiveFollowers();
  if (!activeFollowers || activeFollowers.length === 0) return;

  activeFollowers.forEach((follower) => {
    if (currentCombat.enemyCurrentHP <= 0) return;
    if (follower.currentHP <= 0) return;

    const healOption = getFollowerHealOption(follower);
    const followerMax = getHitPoints(follower);
    const playerMax = getHitPoints(playerCharacter);
    const followerHurt = follower.currentHP < followerMax * 0.6;
    const playerHurt = playerCharacter.currentHP < playerMax * 0.6;

    if (healOption && follower.currentMana >= MANA_CONFIG.costPerCast && (followerHurt || playerHurt)) {
      const healSelfFirst =
        followerHurt && (!playerHurt || follower.currentHP / followerMax <= playerCharacter.currentHP / playerMax);
      const target = healSelfFirst ? follower : playerCharacter;
      performFollowerHeal(follower, healOption.skillId, healOption.spell, target);
      return;
    }

    const songOption = getFollowerSongOption(follower);
    if (songOption && follower.currentMana >= MANA_CONFIG.costPerCast) {
      stopAllSongsFor(follower);
      performFollowerSongCast(follower, songOption.skillId, songOption.spell);
      return;
    }

    const wardOption = getFollowerWardOption(follower);
    if (wardOption && follower.currentMana >= MANA_CONFIG.costPerCast) {
      performFollowerWardCast(follower, wardOption.skillId, wardOption.spell);
      return;
    }

    const cooldownBuffOption = getFollowerCooldownBuffOption(follower);
    if (cooldownBuffOption && follower.currentMana >= MANA_CONFIG.costPerCast) {
      performFollowerCooldownBuffCast(follower, cooldownBuffOption.skillId, cooldownBuffOption.spell);
      return;
    }

    const attackSpellOption = getFollowerAttackSpellOption(follower);
    if (attackSpellOption && follower.currentMana >= MANA_CONFIG.costPerCast) {
      performFollowerAttackSpell(follower, attackSpellOption.skillId, attackSpellOption.spell);
      return;
    }

    const debuffOption = getFollowerDebuffOption(follower);
    if (debuffOption && follower.currentMana >= MANA_CONFIG.costPerCast) {
      performFollowerDebuffCast(follower, debuffOption.skillId, debuffOption.spell);
      return;
    }

    const yokaiFormOption = getFollowerYokaiFormOption(follower);
    if (yokaiFormOption && follower.currentMana >= MANA_CONFIG.costPerCast) {
      performFollowerYokaiFormCast(follower, yokaiFormOption.skillId, yokaiFormOption.spell);
      return;
}

const fetchFormOption = getFollowerFetchFormOption(follower);
if (fetchFormOption && follower.currentMana >= MANA_CONFIG.costPerCast) {
  performFollowerFetchFormCast(follower, fetchFormOption.skillId, fetchFormOption.spell);
  return;
}

    const pick = getFollowerAttackPick(follower);
    useSkill(follower, pick.skillId);

    const attackTierName = getEffectiveAttackTierFor(follower, pick.tierName);
    const hasGuaranteedFollowerAction = consumeGuaranteedEffect("guaranteedFollowerAction");
    const hit = hasGuaranteedFollowerAction || rollSuccess(attackTierName, getEffectiveEnemyTier());
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTierName));
    }

    currentCombat.log.push({
      actor: "follower",
      followerName: follower.name,
      skillId: pick.skillId,
      hit: hit,
      damage: damage
    });
  });
}

function tryArmorEnchantProc(enemyEffectiveTier) {
  if (!playerCharacter.armorEnchantment) return false;
  const effect = ARMOR_ENCHANT_EFFECTS[playerCharacter.armorEnchantment.type];
  if (!effect || !effect.procType) return false;
  if (Math.random() >= effect.procChance) return false;

  const craftedBonus = getCraftedItemBonus(playerCharacter, playerCharacter.equippedArmorSkill);

  if (effect.procType === "deflect") {
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "deflect" });
    return true;
  }
  if (effect.procType === "counterBurn") {
    const burnDmg = Math.max(1, Math.floor(rollDamage("Novice") / 2)) + craftedBonus;
    currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - burnDmg);
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "counterBurn", damage: burnDmg });
  } else if (effect.procType === "chill") {
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1 - craftedBonus, roundsRemaining: 2 });
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "chill" });
  } else if (effect.procType === "counterCurse") {
    const curseTier = shiftTierByRank("Novice", craftedBonus);
    currentCombat.activeEffects.push({ kind: "dot", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION, casterTierName: curseTier });
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "counterCurse" });
  }
  return false;
}

const ENEMY_SELF_HEAL_IDS = ["arenaTroll"];

/**
 * Finds a heal/hot-type spell from the current dungeon's
 * culture, if one exists — not every culture has one (Drakvarr
 * and Vandiri currently don't), in which case this returns null
 * and the enemy just fights normally instead.
 */
function getEnemyHealSpell() {
  const dungeon = DUNGEONS[selectedDungeonId];
  if (!dungeon || !dungeon.culture) return null;
  const culture = CULTURES[dungeon.culture];
  if (!culture) return null;

  const healTypes = ["heal", "hot", "groupHeal"];
  const pool = [];
  culture.magicSkillIds.forEach((skillId) => {
    const spells = SPELLS[skillId] || [];
    spells.forEach((spell) => {
      if (healTypes.includes(spell.type)) {
        pool.push({ skillId, spell, cultureId: dungeon.culture });
      }
    });
  });

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Below 40% HP, any enemy except the 4 named bosses will heal
 * themselves instead of attacking that round, if their culture
 * has a heal-type spell available. Returns true if healing
 * happened (meaning the normal attack should be skipped).
 */
function tryEnemySelfHeal() {
  if (!ENEMY_SELF_HEAL_IDS.includes(currentCombat.enemyId)) return false;
  const hpPct = currentCombat.enemyCurrentHP / currentCombat.enemyMaxHP;
  if (hpPct >= 0.4) return false;

  const healOption = getEnemyHealSpell();
  const healAmt = rollDamage(currentCombat.enemyThreatTier);
  currentCombat.enemyCurrentHP = Math.min(currentCombat.enemyMaxHP, currentCombat.enemyCurrentHP + healAmt);

  currentCombat.log.push({
    actor: "enemy",
    action: "heal",
    spellName: healOption ? healOption.spell.name : null,
    healAmount: healAmt
  });

  return true;
}

function resolveEnemyAttack() {
  const isStunned = currentCombat.activeEffects.some((e) => e.kind === "stun" && e.target !== "player");
  if (isStunned) {
    currentCombat.activeEffects = currentCombat.activeEffects.filter(
      (e) => !(e.kind === "stun" && e.target !== "player")
    );
  }

  tickCombatEffects();
  tickSpellCooldowns();
  applyPassiveManaRegen();
  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return;
  }

  if (tryEnemySelfHeal()) {
    currentCombat.playerDefending = false;
    return;
  }

  const isVisionStunned = consumeGuaranteedEffect("guaranteedStun");
  if (isStunned || isVisionStunned) {
    currentCombat.playerDefending = false;
    currentCombat.log.push({ actor: "effect", kind: "stunned" });
    return;
  }

  const isFeared = currentCombat.activeEffects.some((e) => e.kind === "fear" && e.target !== "player");
  if (isFeared && Math.random() < 0.4) {
    currentCombat.playerDefending = false;
    currentCombat.log.push({ actor: "effect", kind: "feared" });
    return;
  }

  const diff = getCurrentDifficultySettings();
  const adaptive = getAdaptiveScaling();
  const target = pickEnemyTarget();
  const isPlayerTarget = target === playerCharacter;
  const attackType = currentCombat.enemyAttackType;
  const enemyEffectiveTier = getEnemyAttackTier();
  const defenderTier = getDefendingTierName(attackType, target);
  const adjustment = isPlayerTarget && currentCombat.playerDefending ? -DEFEND_SUCCESS_PENALTY : 0;

  const targetHasGuaranteedDodge = currentCombat.activeEffects.some((e) => e.kind === "guaranteedDodge" && e.target === target);
  let hit = targetHasGuaranteedDodge ? (consumeGuaranteedEffectFor(target) ? false : rollSuccess(enemyEffectiveTier, defenderTier, adjustment)) : rollSuccess(enemyEffectiveTier, defenderTier, adjustment);

  if (hit && isPlayerTarget) {
    const armor = playerCharacter.equippedArmorSkill;
    const ghostStepDodge = armor === "leatherArmor" && hasChosenPerk(playerCharacter, "leatherArmor", "ghostStep") && Math.random() < 0.2;
    const untouchableDodge = armor === "leatherArmor" && hasChosenPerk(playerCharacter, "leatherArmor", "untouchable") && !currentCombat.untouchableUsed;
    const shadowsGraceDodge = armor === "leatherArmor" && hasChosenPerk(playerCharacter, "leatherArmor", "shadowsGrace") && Math.random() < 0.2;
    const plateBlock = armor === "plateArmor" && hasChosenPerk(playerCharacter, "plateArmor", "deflectingSteel") && Math.random() < 0.2;
    const chainBlock = armor === "chainArmor" && hasChosenPerk(playerCharacter, "chainArmor", "chainmailMastery") && Math.random() < 0.2;
    if (untouchableDodge) currentCombat.untouchableUsed = true;
    if (ghostStepDodge || untouchableDodge || shadowsGraceDodge || plateBlock || chainBlock) {
      hit = false;
    }
  }
  let damage = 0;
  let deflected = false;

  if (hit && isPlayerTarget) {
    deflected = tryArmorEnchantProc(enemyEffectiveTier);
  }

  const isSilenced = consumeGuaranteedEffect("silence");
  const enemyCastInfo = (attackType === "magic" && !isSilenced) ? getEnemyCultureSpell() : null;
  let hasCultureTraining = false;
  if (enemyCastInfo) {
    const cultureSkillIds = CULTURES[enemyCastInfo.cultureId].magicSkillIds;
    hasCultureTraining = Object.keys(target.skills || {}).some((skillId) => cultureSkillIds.includes(skillId));
  }

  let backfired = false;
  if (hit && !deflected && isPlayerTarget) {
    const illFortuneEffect = currentCombat.activeEffects.find((e) => e.kind === "curseBack");
    const backfireChance = (illFortuneEffect && illFortuneEffect.hasFortuneReversed) ? 0.5 : 0.35;
    if (illFortuneEffect && Math.random() < backfireChance) {
      backfired = true;
    }
  }

  if (hit && !deflected && !backfired) {
    if (!isPlayerTarget) {
      triggerOnHitWards(target);
    }
    const damageDebuffTier = shiftTierByRank(enemyEffectiveTier, getEffectRankSum("damageDebuff"));
    damage = Math.max(
      1,
      Math.round(rollDamage(damageDebuffTier) * diff.enemyDamageMultiplier * adaptive.damageMultiplier)
    );

    if (enemyCastInfo && hasCultureTraining) {
      damage = Math.max(1, Math.round(damage * 0.75));
    }

    let absorbed = getFlatDamageAbsorb(target) + getThickHideReduction(target, attackType);
    if (isPlayerTarget) {
      const armor = playerCharacter.equippedArmorSkill;
      if (armor === "chainArmor" && hasChosenPerk(playerCharacter, "chainArmor", "reactiveMail") && Math.random() < 0.3) {
        const counterDmg = Math.max(1, Math.floor(rollDamage("Novice") / 2));
        currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - counterDmg);
        currentCombat.log.push({ actor: "effect", kind: "thornProc", damage: counterDmg });
      }
      if (armor === "chainArmor" && hasChosenPerk(playerCharacter, "chainArmor", "layeredProtection")) {
        absorbed += 2;
      }
      if (armor === "plateArmor" && hasChosenPerk(playerCharacter, "plateArmor", "livingFortress")) {
        absorbed += 2;
      }
      if (attackType === "magic" && armor === "clothArmor") {
        if (hasChosenPerk(playerCharacter, "clothArmor", "arcaneWard") && Math.random() < 0.2) {
          absorbed += damage;
        } else if (hasChosenPerk(playerCharacter, "clothArmor", "wardedCloth")) {
          absorbed += 2;
        }
      }
    }
    if (absorbed > 0) {
      damage = Math.max(0, damage - absorbed);
    }
    target.currentHP = Math.max(0, target.currentHP - damage);
    const armorSlotSkillFields = [
      "equippedHeadSkill", "equippedChestSkill", "equippedLegsSkill",
      "equippedGlovesSkill", "equippedBootsSkill"
    ];
    armorSlotSkillFields.forEach((field) => {
      const skillId = target[field];
      if (skillId && target.skills[skillId]) {
        useSkill(target, skillId);
      }
    });
    if (target.equippedShield && target.skills.shields) {
      useSkill(target, "shields");
    }
    if (target.currentHP <= 0) {
      const wardIndex = currentCombat.activeEffects.findIndex((e) => e.kind === "autoRevive");
      if (wardIndex !== -1) {
        const savingEffect = currentCombat.activeEffects[wardIndex];
        savingEffect.charges = (savingEffect.charges || 1) - 1;
        if (savingEffect.charges <= 0) {
          currentCombat.activeEffects.splice(wardIndex, 1);
        }
        const maxHP = getHitPoints(target);
        const manaMax = getManaPoolMax(target);
        let restorePct = (savingEffect.spellName === "Onryō's Vigil" && hasChosenPerk(playerCharacter, "wayOnmyoji", "vigilantSpirit")) ? 0.5 : 0.3;
        if (savingEffect.spellName === "Ward of the Deep" && hasChosenPerk(playerCharacter, "riteProtection", "deepsMercy")) {
          restorePct += 0.15;
        }
        target.currentHP = Math.max(1, Math.round(maxHP * restorePct));
        target.currentMana = Math.min(manaMax, target.currentMana + Math.round(manaMax * 0.2));
        currentCombat.log.push({ actor: "effect", kind: "wardOfTheDeepSave", targetName: target.name });
      }
    }
  } else if (backfired) {
    damage = applyDamageToEnemy(
      Math.max(1, Math.round(rollDamage(enemyEffectiveTier) * diff.enemyDamageMultiplier))
    );
  }

  if (currentCombat.playerDefending && isPlayerTarget && !hit) {
    currentCombat.justDefendedSuccess = true;
  }
  if (currentCombat.playerDefending && isPlayerTarget && hit && playerCharacter.equippedShield &&
    hasChosenPerk(playerCharacter, "shields", "punishingBlock")) {
    const counterDmg = Math.max(1, Math.floor(rollDamage("Novice") / 2));
    currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - counterDmg);
    currentCombat.log.push({ actor: "effect", kind: "thornProc", damage: counterDmg });
  }
  currentCombat.playerDefending = false;
  currentCombat.log.push({
    actor: "enemy",
    hit: hit && !deflected && !backfired,
    backfired: backfired,
    damage: damage,
    isPlayerTarget: isPlayerTarget,
    targetName: isPlayerTarget ? playerCharacter.name : target.name,
    spellName: enemyCastInfo ? enemyCastInfo.spell.name : null,
    spellCultureId: enemyCastInfo ? enemyCastInfo.cultureId : null,
    culturallyResisted: enemyCastInfo ? hasCultureTraining : undefined
  });

  if (hit && isPlayerTarget) {
    triggerOnHitWards(playerCharacter);
  }

  if (hit && !deflected && isPlayerTarget) {
    const hasIronWill = playerCharacter.traits && playerCharacter.traits.includes("ironWill");
    const hasMomentumResist = (playerCharacter.equippedWeaponSkill === "axes" && hasChosenPerk(playerCharacter, "axes", "unstoppableMomentum")) ||
      (playerCharacter.equippedWeaponSkill === "unarmedCombat" && hasChosenPerk(playerCharacter, "unarmedCombat", "unbrokenFocus"));
    let procChance = hasIronWill ? 0.06 : 0.15;
    if (hasMomentumResist) procChance = Math.max(0.02, procChance - 0.1);
    const armorForResist = playerCharacter.equippedArmorSkill;
    if ((armorForResist === "plateArmor" && hasChosenPerk(playerCharacter, "plateArmor", "unshakeable")) ||
        (armorForResist === "chainArmor" && hasChosenPerk(playerCharacter, "chainArmor", "unyieldingLinks"))) {
      procChance = Math.max(0.02, procChance - 0.1);
    }
    if ((armorForResist === "plateArmor" && hasChosenPerk(playerCharacter, "plateArmor", "immovable")) && Math.random() < 0.3) {
      procChance = 0;
    }
    if (Math.random() < procChance) {
      const inflictFear = Math.random() < 0.5;
      currentCombat.activeEffects.push({
        kind: inflictFear ? "fear" : "stun",
        rankBonus: 0,
        roundsRemaining: inflictFear ? SPELL_EFFECT_DURATION : 1,
        target: "player"
      });
      currentCombat.log.push({ actor: "effect", kind: "enemyInflicted", inflictType: inflictFear ? "fear" : "stun" });
    }

    const thornwardEffect = currentCombat.activeEffects.find((e) => e.kind === "thornward");
    if (thornwardEffect) {
      const counterMultiplier = thornwardEffect.thornedWard ? 0.75 : 0.5;
      const counterDmg = Math.max(1, Math.floor(rollDamage("Novice") * counterMultiplier));
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - counterDmg);
      currentCombat.log.push({ actor: "effect", kind: "thornProc", damage: counterDmg });
    }
  }

  if (hit && !deflected && !isPlayerTarget && target.currentHP <= 0) {
    currentCombat.log.push({ actor: "effect", kind: "downed", name: target.name });
  }

  if (playerCharacter.currentHP <= 0) {
    currentCombat.result = "defeat";
  }
}

const SHIELD_BASH_ID = "shieldBash";

/**
 * Shield Bash — only available with a shield actually equipped.
 * Low damage (tier shifted down), high stun chance, 3-round
 * cooldown so it can't be spammed into a permanent stun-lock.
 */
function performShieldBash() {
  if (!currentCombat || currentCombat.result) return currentCombat;
  const hasBulwarksAnswer = hasChosenPerk(playerCharacter, "shields", "bulwarksAnswer") && !currentCombat.bulwarksAnswerUsed;
  if (getSpellCooldownRemaining(playerCharacter, SHIELD_BASH_ID) > 0 && !hasBulwarksAnswer) return currentCombat;

  const skillId = playerCharacter.equippedWeaponSkill || "unarmedCombat";
  const tierBefore = getCharacterSkillTier(playerCharacter, skillId).name;
  useSkill(playerCharacter, skillId);

  const attackTier = shiftTierByRank(getEffectivePlayerAttackTier(tierBefore), -2);
  const enemyTier = getEffectiveEnemyTier();
  const hasAegisBearer = hasChosenPerk(playerCharacter, "shields", "aegisBearer") && Math.random() < 0.25;
  const hit = hasAegisBearer || rollSuccess(attackTier, enemyTier);
  let damage = 0;
  let stunned = false;

  if (hit) {
    damage = applyDamageToEnemy(rollDamage(attackTier));
    const stunChance = hasChosenPerk(playerCharacter, "shields", "steadyGuard") ? 0.8 : 0.6;
    if (Math.random() < stunChance) {
      currentCombat.activeEffects.push({ kind: "stun", rankBonus: 0, roundsRemaining: 1 });
      stunned = true;
    }
    if (currentCombat.justDefendedSuccess && hasChosenPerk(playerCharacter, "shields", "riposte")) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.3));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
  }

  const shieldCooldown = hasChosenPerk(playerCharacter, "shields", "quickRecovery") ? 2 : 3;
  if (hasBulwarksAnswer && getSpellCooldownRemaining(playerCharacter, SHIELD_BASH_ID) > 0) {
    currentCombat.bulwarksAnswerUsed = true;
  } else {
    setSpellCooldown(playerCharacter, SHIELD_BASH_ID, shieldCooldown);
  }

  currentCombat.log.push({
    actor: "player",
    action: "shieldBash",
    hit: hit,
    damage: damage,
    stunned: stunned
  });

  performFollowersTurn();

  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return currentCombat;
  }

  resolveEnemyAttack();
  return currentCombat;
}

function performPlayerAction(skillId) {
  if (!currentCombat || currentCombat.result) return currentCombat;

  const tierBefore = getCharacterSkillTier(playerCharacter, skillId).name;
  useSkill(playerCharacter, skillId);

  const attackTier = getEffectivePlayerAttackTier(tierBefore);
  const isArcherShot = playerCharacter.combatStyle === "archer" && skillId === "archery";
  const keenSensesBonus = consumeKeenSensesBonus();
  let weaponAccuracyBonus = 0;
  if (skillId === "swords" && hasChosenPerk(playerCharacter, "swords", "balancedGrip")) weaponAccuracyBonus += 1;
  if (skillId === "archery" && hasChosenPerk(playerCharacter, "archery", "steadyAim")) weaponAccuracyBonus += 1;
  if (playerCharacter.equippedArmorSkill === "leatherArmor" && hasChosenPerk(playerCharacter, "leatherArmor", "quietStep") && !currentCombat.firstAttackUsed) {
    weaponAccuracyBonus += 1;
  }
  const accuracyTier = shiftTierByRank(attackTier, (isArcherShot ? 2 : 0) + keenSensesBonus + getNightsightBonus() + weaponAccuracyBonus);
  let enemyTier = getEffectiveEnemyTier();
  if ((skillId === "swords" && hasChosenPerk(playerCharacter, "swords", "precisionStrike")) ||
      (skillId === "archery" && hasChosenPerk(playerCharacter, "archery", "piercingShot"))) {
    enemyTier = shiftTierByRank(enemyTier, -1);
  }
  const hasRecklessPower = skillId === "axes" && hasChosenPerk(playerCharacter, "axes", "recklessPower");
  const hasCalledShot = skillId === "archery" && hasChosenPerk(playerCharacter, "archery", "calledShot");
  if (hasRecklessPower || hasCalledShot) {
    enemyTier = shiftTierByRank(enemyTier, 1);
  }
  const AVERICK_BUFF_SPELL_NAMES = ["Flametouched Blade", "Glacial Edge", "Warblood Fury"];
  const hasAverickReckoning = characterHasLegendary(playerCharacter, "Averick's Reckoning") &&
    currentCombat.activeEffects.some((e) => e.kind === "playerAttackBonus" && AVERICK_BUFF_SPELL_NAMES.includes(e.spellName));
  if (hasAverickReckoning) {
    enemyTier = shiftTierByRank(enemyTier, -1);
  }
  const hasGuaranteedHit = consumeGuaranteedEffect("guaranteedHit");
  const hasPerfectStep = characterHasLegendary(playerCharacter, "Kurogane's Perfect Step") && !currentCombat.firstAttackUsed;
  const hasPerfectLoose = skillId === "archery" && hasChosenPerk(playerCharacter, "archery", "perfectLoose") && Math.random() < 0.3;
  const isFirstAttack = !currentCombat.firstAttackUsed;
  currentCombat.firstAttackUsed = true;
  let hit = hasGuaranteedHit || hasPerfectStep || hasPerfectLoose || rollSuccess(accuracyTier, enemyTier);
  if (!hit && skillId === "swords" && hasChosenPerk(playerCharacter, "swords", "unyieldingSteel") && Math.random() < 0.25) {
    hit = rollSuccess(accuracyTier, enemyTier);
  }
  let damage = 0;

  if (hit) {
    let baseDamage = rollDamage(attackTier);
    if (hasRecklessPower || hasCalledShot) baseDamage = Math.round(baseDamage * 1.3);
    damage = applyDamageToEnemy(baseDamage);
    if (skillId === "swords" && hasChosenPerk(playerCharacter, "swords", "honedEdge")) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.15));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (skillId === "axes" && hasChosenPerk(playerCharacter, "axes", "heavySwing")) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.15));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (skillId === "unarmedCombat" && hasChosenPerk(playerCharacter, "unarmedCombat", "ironFists")) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.15));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    const woundedPctForWeapon = 1 - currentCombat.enemyCurrentHP / currentCombat.enemyMaxHP;
    if (skillId === "swords" && hasChosenPerk(playerCharacter, "swords", "practicedCut") && woundedPctForWeapon >= 0.5) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.25));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (skillId === "axes" && hasChosenPerk(playerCharacter, "axes", "brutalFollowThrough") && woundedPctForWeapon >= 0.5) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.25));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (skillId === "axes" && hasChosenPerk(playerCharacter, "axes", "executionersArc") && woundedPctForWeapon >= 0.7) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.5));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (skillId === "archery" && hasChosenPerk(playerCharacter, "archery", "rangersFocus") && isFirstAttack) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.3));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (skillId === "unarmedCombat" && hasChosenPerk(playerCharacter, "unarmedCombat", "onePerfectStrike") && isFirstAttack) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.5));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (currentCombat.justDefendedSuccess &&
      ((skillId === "swords" && hasChosenPerk(playerCharacter, "swords", "riposteInstinct")) ||
       (skillId === "unarmedCombat" && hasChosenPerk(playerCharacter, "unarmedCombat", "counterStrike")))) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.3));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (skillId === "axes" && hasChosenPerk(playerCharacter, "axes", "sunderingBlow") && Math.random() < 0.3) {
      currentCombat.activeEffects.push({ kind: "defenseDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
    }
    if (skillId === "unarmedCombat" && hasChosenPerk(playerCharacter, "unarmedCombat", "pressurePointStrike") && Math.random() < 0.25) {
      currentCombat.activeEffects.push({ kind: "stun", rankBonus: 0, roundsRemaining: 1 });
    }
    if (skillId === "swords" && hasChosenPerk(playerCharacter, "swords", "blademastersReflex") && Math.random() < 0.25) {
      const echoDamage = applyDamageToEnemy(rollDamage(attackTier));
      currentCombat.log.push({ actor: "effect", kind: "ancestralEcho", damage: echoDamage });
    }
    if (skillId === "archery" && hasChosenPerk(playerCharacter, "archery", "rainOfArrows") && Math.random() < 0.25) {
      const echoDamage = applyDamageToEnemy(rollDamage(attackTier));
      currentCombat.log.push({ actor: "effect", kind: "ancestralEcho", damage: echoDamage });
    }
    if (hasChosenPerk(playerCharacter, "runeBlade", "berserkersGift") && playerCharacter.currentHP < getHitPoints(playerCharacter) * 0.5) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.2));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (hasPerfectStep === false && hasChosenPerk(playerCharacter, "wayTengu", "disciplineUnbroken") && !currentCombat.firstAttackUsed) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.5));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
    if (!currentCombat.windWalkerUsed && hasChosenPerk(playerCharacter, "wayTengu", "windWalker")) {
      currentCombat.windWalkerUsed = true;
      const echoDamage = applyDamageToEnemy(rollDamage(attackTier));
      currentCombat.log.push({ actor: "effect", kind: "ancestralEcho", damage: echoDamage });
    }
  }

  if (hit && playerCharacter.traits && playerCharacter.traits.includes("predatorInstinct")) {
    const woundedPct = 1 - currentCombat.enemyCurrentHP / currentCombat.enemyMaxHP;
    if (woundedPct >= 0.5) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.25));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
  }

  if (characterHasLegendary(playerCharacter, "Ivarr's Grudge")) {
    if (hit) {
      currentCombat.ivarrStreak = (currentCombat.ivarrStreak || 0) + 1;
      const streakStacks = Math.min(5, currentCombat.ivarrStreak - 1);
      if (streakStacks > 0) {
        const bonusDmg = Math.max(1, Math.round(damage * streakStacks * 0.05));
        damage += bonusDmg;
        currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
      }
    } else {
      currentCombat.ivarrStreak = 0;
    }
  }

  const hasMomentumPerk = (skillId === "axes" && hasChosenPerk(playerCharacter, "axes", "momentum")) ||
    (skillId === "unarmedCombat" && hasChosenPerk(playerCharacter, "unarmedCombat", "focusedChi"));
  if (hasMomentumPerk) {
    if (hit) {
      currentCombat.weaponStreak = (currentCombat.weaponStreak || 0) + 1;
      const streakStacks = Math.min(4, currentCombat.weaponStreak - 1);
      if (streakStacks > 0) {
        const bonusDmg = Math.max(1, Math.round(damage * streakStacks * 0.05));
        damage += bonusDmg;
        currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
      }
    } else {
      currentCombat.weaponStreak = 0;
    }
  }

  currentCombat.justDefendedSuccess = false;

  currentCombat.log.push({ actor: "player", skillId: skillId, spellName: null, hit: hit, damage: damage });

  performFollowersTurn();

  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return currentCombat;
  }

  resolveEnemyAttack();
  return currentCombat;
}

const PERSISTENT_YOKAI_SPELL_IDS = ["fireForm", "waterForm", "earthForm", "windForm", "mistForm", "lightningForm"];
const YOKAI_FORM_DURATION = 5;

const PERSISTENT_FETCH_SPELL_IDS = ["beithirForm", "baobhanSithForm", "cuSidheForm", "catSithForm", "stagForm", "nuckelaveeForm"];
const FETCH_FORM_DURATION = 5;
const FOLLOWER_FETCH_FORM_SPELL_IDS = ["beithirForm", "baobhanSithForm", "cuSidheForm", "catSithForm", "stagForm", "nuckelaveeForm"];

function getFollowerFetchFormOption(follower) {
  const alreadyTransformed = currentCombat.activeEffects.some(
    (e) => e.kind === "fetchForm" && e.owner === follower
  );
  if (alreadyTransformed) return null;
  const knownIds = (follower.knownSpells && follower.knownSpells.ancestralFetch) || [];
  if (knownIds.length === 0) return null;
  const allSpells = SPELLS.ancestralFetch || [];
  const castable = allSpells.find((s) => FOLLOWER_FETCH_FORM_SPELL_IDS.includes(s.id) && knownIds.includes(s.id) && isSpellActive(follower, s.id));
  return castable ? { skillId: "ancestralFetch", spell: castable } : null;
}

function performFollowerFetchFormCast(follower, skillId, spell) {
  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  currentCombat.activeEffects = currentCombat.activeEffects.filter(
    (e) => !((e.kind === "fetchForm" || e.kind === "yokaiForm") && e.owner === follower)
  );
  currentCombat.activeEffects.push({ kind: "fetchForm", spellName: spell.name, owner: follower, roundsRemaining: FETCH_FORM_DURATION, _justCast: true });

  const logEntry = {
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    skillId: skillId,
    spellName: spell.name,
    castKind: "fetchForm"
  };

  if (spell.type === "buff") {
    currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: FETCH_FORM_DURATION, owner: follower, _justCast: true });
  } else if (spell.type === "acBuff") {
    currentCombat.activeEffects.push({ kind: "acBuff", rankBonus: 1, roundsRemaining: FETCH_FORM_DURATION, owner: follower, _justCast: true });
  } else if (spell.type === "damageDebuff") {
    currentCombat.activeEffects.push({ kind: "damageDebuff", rankBonus: -1, roundsRemaining: FETCH_FORM_DURATION, _justCast: true });
  } else if (spell.type === "lifetap") {
    const attackTier = getEffectiveAttackTierFor(follower, tierBefore);
    const hit = rollSuccess(attackTier, getEffectiveEnemyTier());
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      const followerMax = getHitPoints(follower);
      follower.currentHP = Math.min(followerMax, follower.currentHP + damage);
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "burst") {
    const attackTier = shiftTierByRank(getEffectiveAttackTierFor(follower, tierBefore), 2);
    const hit = rollSuccess(attackTier, getEffectiveEnemyTier());
    let damage = 0;
    if (hit) damage = applyDamageToEnemy(rollDamage(attackTier));
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "guaranteedDodge") {
    currentCombat.activeEffects.push({ kind: "guaranteedDodge", rankBonus: 0, roundsRemaining: null, target: follower });
  }

  currentCombat.log.push(logEntry);
}

const FOLLOWER_UTILITY_SPELL_TYPES = ["absorb", "stun", "guaranteedHit", "manaRefund", "autoRevive"];

function getFollowerUtilitySpellOption(follower) {
  const magicSkillIds = Object.keys(follower.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );
  for (const skillId of magicSkillIds) {
    const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    const allSpells = SPELLS[skillId] || [];
    const utilitySpell = allSpells.find((s) => {
      if (!FOLLOWER_UTILITY_SPELL_TYPES.includes(s.type)) return false;
      if (!known.includes(s.id)) return false;
      if (!isSpellActive(follower, s.id)) return false;
      if (s.type === "absorb") {
        const alreadyActive = currentCombat.activeEffects.some((e) => e.kind === "absorb" && e.target === follower);
        if (alreadyActive) return false;
      }
      if (s.type === "autoRevive") {
        const alreadyWarded = currentCombat.activeEffects.some((e) => e.kind === "autoRevive" && e.owner === follower);
        if (alreadyWarded) return false;
      }
      return true;
    });
    if (utilitySpell) return { skillId, spell: utilitySpell };
  }
  return null;
}

function performFollowerUtilitySpell(follower, skillId, spell) {
  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  const logEntry = {
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    skillId: skillId,
    spellName: spell.name,
    castKind: "utility",
    spellType: spell.type
  };

  if (spell.type === "absorb") {
    const reduction = Math.max(2, Math.floor(rollDamage(tierBefore) / 2));
    currentCombat.activeEffects.push({ kind: "absorb", rankBonus: 0, roundsRemaining: 2, target: follower, reduction: reduction });
  } else if (spell.type === "stun") {
    currentCombat.activeEffects.push({ kind: "stun", rankBonus: 0, roundsRemaining: 1 });
  } else if (spell.type === "guaranteedHit") {
    currentCombat.activeEffects.push({ kind: "guaranteedFollowerAction", rankBonus: 0, roundsRemaining: null });
  } else if (spell.type === "manaRefund") {
    const refundAmount = rollDamage(tierBefore);
    const manaMax = getManaPoolMax(follower);
    follower.currentMana = Math.min(manaMax, follower.currentMana + refundAmount);
    logEntry.manaAmount = refundAmount;
  } else if (spell.type === "autoRevive") {
    currentCombat.activeEffects.push({ kind: "autoRevive", rankBonus: 0, roundsRemaining: null, owner: follower, spellName: spell.name });
  }

  currentCombat.log.push(logEntry);
}

function getFollowerCompanionOption(follower) {
  if (followerDungeonCompanions[follower.name]) return null;
  const magicSkillIds = Object.keys(follower.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );
  for (const skillId of magicSkillIds) {
    const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    const allSpells = SPELLS[skillId] || [];
    const companionSpell = allSpells.find(
      (s) => s.type === "companion" && known.includes(s.id) && isSpellActive(follower, s.id)
    );
    if (companionSpell) return { skillId, spell: companionSpell };
  }
  return null;
}

function performFollowerCompanionCast(follower, skillId, spell) {
  const tierBefore = getCharacterSkillTier(follower, skillId).name;
  follower.currentMana -= MANA_CONFIG.costPerCast;
  useSkill(follower, skillId);

  followerDungeonCompanions[follower.name] = { casterTierName: tierBefore };
  currentCombat.activeEffects = currentCombat.activeEffects.filter(
    (e) => !(e.kind === "companion" && e.owner === follower)
  );
  currentCombat.activeEffects.push({
    kind: "companion",
    rankBonus: 0,
    roundsRemaining: null,
    casterTierName: tierBefore,
    owner: follower
  });

  currentCombat.log.push({
    actor: "follower",
    followerName: follower.name,
    action: "cast",
    skillId: skillId,
    spellName: spell.name,
    castKind: "companion"
  });
}

function performPlayerCast(skillId, spell, target) {
  if (!currentCombat || currentCombat.result) return currentCombat;
  if (playerCharacter.currentMana < MANA_CONFIG.costPerCast) return currentCombat;

  const healTarget = target || playerCharacter;

  if (skillId === "wayYokai" && PERSISTENT_YOKAI_SPELL_IDS.includes(spell.id)) {
    currentCombat.activeEffects = currentCombat.activeEffects.filter((e) => !((e.kind === "yokaiForm" || e.kind === "fetchForm") && !e.owner));
    currentCombat.activeEffects.push({ kind: "yokaiForm", spellName: spell.name, roundsRemaining: YOKAI_FORM_DURATION, _justCast: true });
  }

  const isSong = BARD_SKILL_IDS.includes(skillId);
  const songCap = (hasChosenPerk(playerCharacter, "ancestralSiuloir", "twinVerse") || hasChosenPerk(playerCharacter, "runeSong", "twinVerseSkald") || hasChosenPerk(playerCharacter, "waySuijin", "twinMelody") || hasChosenPerk(playerCharacter, "riteGriot", "twinSong")) ? 3 : 2;
  if (isSong && getActiveSongCount() >= songCap) return currentCombat;

  if (spell.type === "companion" && dungeonCompanionUsed) {
    const alreadyRecast = dungeonCompanion && dungeonCompanion.recastUsed;
    const canPacksReturn = spell.name === "Wolf's Call" && hasChosenPerk(playerCharacter, "pathWild", "packsReturn") && !alreadyRecast;
    if (!canPacksReturn) return currentCombat;
  }

  playerCharacter.currentMana -= MANA_CONFIG.costPerCast;

  if (playerCharacter.equippedArmorSkill === "clothArmor" && hasChosenPerk(playerCharacter, "clothArmor", "boundlessFocus") && Math.random() < 0.25) {
    playerCharacter.currentMana += MANA_CONFIG.costPerCast;
  }

  if (skillId === "ancestralFetch" && hasChosenPerk(playerCharacter, "ancestralFetch", "betweenForms") && Math.random() < 0.3) {
    playerCharacter.currentMana += MANA_CONFIG.costPerCast;
  }

  if (skillId === "pathWild" && hasChosenPerk(playerCharacter, "pathWild", "oneWithTheWild") && Math.random() < 0.3) {
    playerCharacter.currentMana += MANA_CONFIG.costPerCast;
  }

  if (skillId === "pathStorm" && hasChosenPerk(playerCharacter, "pathStorm", "stormEverlasting") && Math.random() < 0.3) {
    playerCharacter.currentMana += MANA_CONFIG.costPerCast;
  }

  if (skillId === "waySuijin" && hasChosenPerk(playerCharacter, "waySuijin", "endlessCurrent") && Math.random() < 0.3) {
    playerCharacter.currentMana += MANA_CONFIG.costPerCast;
  }

  if (skillId === "wayYokai" && hasChosenPerk(playerCharacter, "wayYokai", "formless") && Math.random() < 0.3) {
    playerCharacter.currentMana += MANA_CONFIG.costPerCast;
  }

  if (skillId === "wayOnmyoji" && hasChosenPerk(playerCharacter, "wayOnmyoji", "shikigamiUnbound") && Math.random() < 0.3) {
    playerCharacter.currentMana += MANA_CONFIG.costPerCast;
  }

  if (skillId === "wayYokai" && hasChosenPerk(playerCharacter, "wayYokai", "everyElement") && Math.random() < 0.25) {
    const echoTier = getEffectivePlayerAttackTier(getCharacterSkillTier(playerCharacter, skillId).name);
    if (rollSuccess(echoTier, getEffectiveEnemyTier())) {
      const echoDamage = applyDamageToEnemy(rollDamage(echoTier));
      currentCombat.log.push({ actor: "effect", kind: "ancestralEcho", damage: echoDamage });
    }
  }

  if (skillId === "ancestralFetch" && hasChosenPerk(playerCharacter, "ancestralFetch", "oldBloodRising") && Math.random() < 0.25) {
    const echoTier = getEffectivePlayerAttackTier(getCharacterSkillTier(playerCharacter, skillId).name);
    if (rollSuccess(echoTier, getEffectiveEnemyTier())) {
      const echoDamage = applyDamageToEnemy(rollDamage(echoTier));
      currentCombat.log.push({ actor: "effect", kind: "ancestralEcho", damage: echoDamage });
    }
  }

  const tierBefore = getCharacterSkillTier(playerCharacter, skillId).name;
  useSkill(playerCharacter, skillId);

  const logEntry = {
    actor: "player",
    skillId: skillId,
    spellName: spell.name,
    spellType: spell.type
  };

  if (spell.type === "damage") {
    const attackTier = getEffectivePlayerSpellDamageTier(tierBefore);
    const keenSensesBonus = consumeKeenSensesBonus();
    const accuracyTier = shiftTierByRank(attackTier, keenSensesBonus + getNightsightBonus());
    const enemyTier = getEffectiveEnemyTier();
    const hasGuaranteedSpellHit = consumeGuaranteedEffect("guaranteedSpellHit");
    const hasUnbrokenSky = skillId === "pathStorm" && characterHasLegendary(playerCharacter, "Neasa's Unbroken Sky");
    const hasEyeOfTheStorm = skillId === "pathStorm" && consumeGuaranteedEffect("eyeOfTheStorm");
    const hit = hasGuaranteedSpellHit || hasUnbrokenSky || hasEyeOfTheStorm || rollSuccess(accuracyTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      if (spell.name === "Lightning Lash" && hasChosenPerk(playerCharacter, "pathStorm", "lightningsEdge")) damage = Math.round(damage * 1.25);
      if (spell.name === "Frostgale" && hasChosenPerk(playerCharacter, "pathStorm", "bitterGale")) damage = Math.round(damage * 1.25);
      if (spell.name === "Venomstrike" && hasChosenPerk(playerCharacter, "pathGrove", "venomsBite")) damage = Math.round(damage * 1.25);
      if (spell.name === "Gale-Fist Strike" && hasChosenPerk(playerCharacter, "wayTengu", "windsEdge")) damage = Math.round(damage * 1.25);
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "damageAmpDebuff" || spell.type === "accuracyDebuff" || spell.type === "damageDebuff" || spell.type === "defenseDebuff") {
    const hasKwabenasUndoing = skillId === "riteUnmaking" && characterHasLegendary(playerCharacter, "Kwabena's Undoing");
    const hasWitheringBreath = spell.name === "Nuckelavee Form" && hasChosenPerk(playerCharacter, "ancestralFetch", "witheringBreath");
    const hasScatteringGale = spell.name === "Wind Form" && hasChosenPerk(playerCharacter, "wayYokai", "scatteringGale");
    const hasHollowNote = spell.name === "Shakuhachi of the Hollow Wind" && hasChosenPerk(playerCharacter, "waySuijin", "hollowNote");
    const debuffKindByType = {
      damageAmpDebuff: "vulnerability",
      accuracyDebuff: "accuracyDebuff",
      damageDebuff: "damageDebuff",
      defenseDebuff: "defenseDebuff"
    };
    const hasVulnerableGrasp = spell.name === "Vulnerability Curse" && hasChosenPerk(playerCharacter, "riteUnmaking", "vulnerableGrasp");
    const hasBlindingGrip = spell.name === "Blinding Curse" && hasChosenPerk(playerCharacter, "riteUnmaking", "blindingGrip");
    const hasCripplingGrasp = spell.name === "Crippling Curse" && hasChosenPerk(playerCharacter, "riteUnmaking", "cripplingGrasp");
    const hasExposingGrip = spell.name === "Exposing Curse" && hasChosenPerk(playerCharacter, "riteUnmaking", "exposingGrip");
    let debuffRank = spell.type === "damageAmpDebuff" ? (hasVulnerableGrasp ? 0.15 : 0) : (hasKwabenasUndoing ? -2 : -1);
    if (hasWitheringBreath || hasScatteringGale || hasHollowNote || hasBlindingGrip || hasCripplingGrasp || hasExposingGrip) debuffRank -= 1;
    let debuffDuration = SPELL_EFFECT_DURATION;
    if (skillId === "riteUnmaking" && hasChosenPerk(playerCharacter, "riteUnmaking", "totalUnmaking") && Math.random() < 0.3) {
      debuffDuration = null;
    }
    if (!(skillId === "riteUnmaking" && hasChosenPerk(playerCharacter, "riteUnmaking", "unmakingCompounds"))) {
      currentCombat.activeEffects = currentCombat.activeEffects.filter((e) => e.kind !== debuffKindByType[spell.type]);
    }
    currentCombat.activeEffects.push({
      kind: debuffKindByType[spell.type],
      rankBonus: debuffRank,
      roundsRemaining: debuffDuration
    });
  } else if (spell.type === "spellLock") {
    const silenceStack = (spell.name === "Silencing Curse" && hasChosenPerk(playerCharacter, "riteUnmaking", "silencingGrip")) ? 2 : 1;
    for (let i = 0; i < silenceStack; i++) {
      currentCombat.activeEffects.push({ kind: "silence", rankBonus: 0, roundsRemaining: null });
    }
  } else if (spell.type === "autoRevive") {
    const wardCharges = (spell.name === "Ward of the Deep" && hasChosenPerk(playerCharacter, "riteProtection", "theDeepAnswers")) ? 2 : 1;
    currentCombat.activeEffects.push({
      kind: "autoRevive",
      rankBonus: 0,
      roundsRemaining: null,
      owner: playerCharacter,
      spellName: spell.name,
      charges: wardCharges
    });
  } else if (
    spell.type === "onHitBuff" || spell.type === "onHitHeal" ||
    spell.type === "onHitManaRegen" || spell.type === "onHitGroupHeal" ||
    spell.type === "onHitDebuff"
  ) {
    const wardStack = hasChosenPerk(playerCharacter, "riteProtection", "twiceWarded") ? 2 : 1;
    for (let i = 0; i < wardStack; i++) {
      currentCombat.activeEffects.push({
        kind: "onHitWard",
        rankBonus: 0,
        roundsRemaining: null,
        owner: playerCharacter,
        wardType: spell.type,
        spellName: spell.name
      });
    }
  } else if (spell.type === "powerSteal") {
    const attackTier = getEffectivePlayerSpellDamageTier(tierBefore);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      const stealRank = hasChosenPerk(playerCharacter, "riteUnmaking", "devouringGalesDepth") ? 2 : 1;
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: stealRank, roundsRemaining: SPELL_EFFECT_DURATION });
      currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -stealRank, roundsRemaining: SPELL_EFFECT_DURATION });
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "doubleDrain") {
    const attackTier = getEffectivePlayerSpellDamageTier(tierBefore);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      if (spell.name === "Thunderstrike" && hasChosenPerk(playerCharacter, "riteThunderWrath", "thunderstrikesFury")) {
        damage = Math.round(damage * 1.3);
      }
      const maxHP = getHitPoints(playerCharacter);
      const manaMax = getManaPoolMax(playerCharacter);
      playerCharacter.currentHP = Math.min(maxHP, playerCharacter.currentHP + damage);
      const manaGain = Math.max(1, Math.floor(damage / 2));
      playerCharacter.currentMana = Math.min(manaMax, playerCharacter.currentMana + manaGain);
      logEntry.manaGained = manaGain;
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "execute") {
    const attackTier = getEffectivePlayerSpellDamageTier(tierBefore);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = rollDamage(attackTier);
      const missingHpPct = 1 - currentCombat.enemyCurrentHP / currentCombat.enemyMaxHP;
      let executeMultiplier = 1 + missingHpPct * 1.5;
      if (spell.name === "Omen's End" && hasChosenPerk(playerCharacter, "runeVision", "omensWeight")) {
        executeMultiplier += 0.3;
      }
      if (spell.name === "Mountain-Breaker" && hasChosenPerk(playerCharacter, "wayTengu", "mountainsFall")) {
        executeMultiplier += 0.3;
      }
      damage = applyDamageToEnemy(Math.round(damage * executeMultiplier));
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "guaranteedHit" || spell.type === "guaranteedSpellHit" || spell.type === "guaranteedStun") {
    const stackCount = (spell.name === "Threadcut Vision" && hasChosenPerk(playerCharacter, "runeVision", "threadcuttersPatience")) ? 2 : 1;
    for (let i = 0; i < stackCount; i++) {
      currentCombat.activeEffects.push({ kind: spell.type, rankBonus: 0, roundsRemaining: null });
    }
    if (spell.name === "Foreseen Opening" && hasChosenPerk(playerCharacter, "runeVision", "clearerSight")) {
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: 1, spellName: spell.name });
    }
    if (spell.name === "Ravensight Rune" && hasChosenPerk(playerCharacter, "runeVision", "ravensFocus")) {
      currentCombat.activeEffects.push({ kind: "spellDamageBuff", rankBonus: 1, roundsRemaining: 1, spellName: spell.name });
    }
    if (spell.name === "Tengu's Eye" && hasChosenPerk(playerCharacter, "wayTengu", "tengusClarity")) {
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: 1, spellName: spell.name });
    }
    if (spell.name === "Gashadokuro's Eye" && hasChosenPerk(playerCharacter, "wayOnmyoji", "unerringSight")) {
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: 1, spellName: spell.name });
    }
  } else if (spell.type === "guaranteedDodge") {
    const dodgeStack = (spell.name === "Mist Form" && hasChosenPerk(playerCharacter, "wayYokai", "driftingMist")) ? 2 : 1;
    for (let i = 0; i < dodgeStack; i++) {
      currentCombat.activeEffects.push({ kind: "guaranteedDodge", rankBonus: 0, roundsRemaining: null, target: playerCharacter });
    }
  } else if (spell.type === "guaranteedFollowerAction") {
    const followerStack = (spell.name === "Fateglimpse" && hasChosenPerk(playerCharacter, "runeVision", "sharedFate")) ? 2 : 1;
    for (let i = 0; i < followerStack; i++) {
      currentCombat.activeEffects.push({ kind: "guaranteedFollowerAction", rankBonus: 0, roundsRemaining: null });
    }
  } else if (spell.type === "heal") {
    const healTier = getEffectivePlayerHealTier(tierBefore);
    let healAmount = rollDamage(healTier);
    if (spell.name === "Grove's Blessing" && hasChosenPerk(playerCharacter, "pathGrove", "grovesGentleHand")) {
      healAmount = Math.round(healAmount * 1.4);
    }
    if (spell.name === "Warrior's Resolve" && hasChosenPerk(playerCharacter, "riteThunderWrath", "resolvesDepth")) {
      healAmount = Math.round(healAmount * 1.4);
    }
    if (spell.name === "Warrior's Resolve" && hasChosenPerk(playerCharacter, "riteThunderWrath", "unbrokenWrath") && Math.random() < 0.3) {
      playerCharacter.currentMana += MANA_CONFIG.costPerCast;
    }
    let targetMaxHP = getHitPoints(healTarget);
    if (skillId === "pathGrove" && hasChosenPerk(playerCharacter, "pathGrove", "grovesMercy")) {
      targetMaxHP = Math.round(targetMaxHP * 1.15);
    }
    healTarget.currentHP = Math.min(targetMaxHP, healTarget.currentHP + healAmount);
    logEntry.healAmount = healAmount;
    logEntry.healTargetName = healTarget === playerCharacter ? null : healTarget.name;
    if (skillId === "pathGrove" && hasChosenPerk(playerCharacter, "pathGrove", "evergreen") && Math.random() < 0.3) {
      playerCharacter.currentMana += MANA_CONFIG.costPerCast;
    }
  } else if (spell.type === "enchant" || spell.type === "buff") {
    const AVERICK_WEAPON_BUFFS = ["Flametouched Blade", "Glacial Edge", "Warblood Fury"];
    const isAverickWeaponBuff = skillId === "ancestralAverick" && AVERICK_WEAPON_BUFFS.includes(spell.name);
    let buffDuration = skillId === "ancestralAverick" ? 5 : SPELL_EFFECT_DURATION;
    if (isAverickWeaponBuff && hasChosenPerk(playerCharacter, "ancestralAverick", "ancestorsEdge")) {
      buffDuration += 1;
    }
    let buffRank = 1;
    if (spell.name === "Warblood Fury" && hasChosenPerk(playerCharacter, "ancestralAverick", "warbloodFuryReborn")) {
      buffRank += 1;
    }
    if (spell.name === "War-Chant" && hasChosenPerk(playerCharacter, "ancestralSiuloir", "warDrumsWeight")) {
      buffRank += 1;
    }
    if (spell.name === "Cù Sídhe Form" && hasChosenPerk(playerCharacter, "ancestralFetch", "feralCunning")) {
      buffRank += 1;
    }
    if (spell.name === "Skald's War-Verse" && hasChosenPerk(playerCharacter, "runeSong", "warVersesWeight")) {
      buffRank += 1;
    }
    if (spell.name === "Bloodfury Mark" && hasChosenPerk(playerCharacter, "runeBlade", "battleFury")) {
      buffDuration += 1;
    }
    if (spell.name === "Nature's Wraith" && hasChosenPerk(playerCharacter, "pathWild", "wildFury")) {
      buffRank += 1;
    }
    if (spell.name === "Fire Form" && hasChosenPerk(playerCharacter, "wayYokai", "livingFlame")) {
      buffRank += 1;
    }
    if (spell.name === "Taiko of the Storm's Approach" && hasChosenPerk(playerCharacter, "waySuijin", "stormsApproach")) {
      buffRank += 1;
    }
    if (spell.name === "Griot's War-Praise" && hasChosenPerk(playerCharacter, "riteGriot", "warPraisesWeight")) {
      buffRank += 1;
    }
    currentCombat.activeEffects.push({
      kind: "playerAttackBonus",
      rankBonus: buffRank,
      roundsRemaining: isSong ? null : buffDuration,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong
    });
    if (isAverickWeaponBuff && hasChosenPerk(playerCharacter, "ancestralAverick", "ancestralReckoning") && Math.random() < 0.3) {
      const echoTier = getEffectivePlayerAttackTier(tierBefore);
      if (rollSuccess(echoTier, getEffectiveEnemyTier())) {
        const echoDamage = applyDamageToEnemy(rollDamage(echoTier));
        currentCombat.log.push({ actor: "effect", kind: "ancestralEcho", damage: echoDamage });
      }
    }
  } else if (spell.type === "guard") {
    const guardRank = ((spell.name === "Barkskin" && hasChosenPerk(playerCharacter, "pathGrove", "guardingBark")) ||
      (spell.name === "Root-Stance Discipline" && hasChosenPerk(playerCharacter, "wayTengu", "groundedRoot"))) ? 2 : 1;
    currentCombat.activeEffects.push({ kind: "playerDefenseBonus", rankBonus: guardRank, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "debuff") {
    const debuffRank = ((spell.name === "Doomrune" && hasChosenPerk(playerCharacter, "runeCurse", "doomrunesWeight")) ||
      (spell.name === "Withering Grasp" && hasChosenPerk(playerCharacter, "pathGrove", "witheringRoots")) ||
      (spell.name === "Judgment's Weight" && hasChosenPerk(playerCharacter, "riteThunderWrath", "judgmentsWeight"))) ? -2 : -1;
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: debuffRank, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "dot") {
    let tickBonusPct = (spell.name === "Dirge of Ruin" && hasChosenPerk(playerCharacter, "ancestralSiuloir", "dirgesGrip")) ? 0.5 : 0;
    if (spell.name === "Withering Hex" && hasChosenPerk(playerCharacter, "runeCurse", "witheringGrip")) tickBonusPct = 0.5;
    if (spell.name === "Skald's Curse-Verse" && hasChosenPerk(playerCharacter, "runeSong", "curseVersesGrip")) tickBonusPct = 0.5;
    if (spell.name === "Blightmist" && hasChosenPerk(playerCharacter, "pathWild", "creepingBlight")) tickBonusPct = 0.5;
    if (spell.name === "Verdant Blight" && hasChosenPerk(playerCharacter, "pathGrove", "spreadingRot")) tickBonusPct = 0.5;
    if (spell.name === "Stormcall" && hasChosenPerk(playerCharacter, "pathStorm", "stormsPatience")) tickBonusPct = 0.5;
    if (spell.name === "Ashgale" && hasChosenPerk(playerCharacter, "pathStorm", "ashenWind")) tickBonusPct = 0.5;
    if (spell.name === "Grasp of the Dead" && hasChosenPerk(playerCharacter, "pathBarrow", "graspingDead")) tickBonusPct = 0.5;
    if (spell.name === "Wrath Unbound" && hasChosenPerk(playerCharacter, "riteThunderWrath", "wrathsGrip")) tickBonusPct = 0.5;
    if (spell.name === "Griot's Lament" && hasChosenPerk(playerCharacter, "riteGriot", "lamentsGrip")) tickBonusPct = 0.5;
    let dotDuration = SPELL_EFFECT_DURATION;
    if (skillId === "runeCurse" && hasChosenPerk(playerCharacter, "runeCurse", "doomEverlasting") && Math.random() < 0.3) {
      dotDuration = null;
    }
    if (skillId === "pathBarrow" && hasChosenPerk(playerCharacter, "pathBarrow", "undyingGrasp") && Math.random() < 0.3) {
      dotDuration = null;
    }
    const allowStack = skillId === "runeCurse" && hasChosenPerk(playerCharacter, "runeCurse", "cursesCompound");
    pushDotEffect({
      kind: "dot",
      rankBonus: 0,
      roundsRemaining: dotDuration,
      casterTierName: tierBefore,
      spellName: spell.name,
      tickBonusPct: tickBonusPct
    }, allowStack);
  } else if (spell.type === "stun") {
    const stunRounds = ((spell.name === "Somnusbind" && hasChosenPerk(playerCharacter, "ancestralEmyrs", "deepSleep")) ||
      (spell.name === "Hexbind" && hasChosenPerk(playerCharacter, "runeCurse", "bindingHex")) ||
      (spell.name === "Windshear" && hasChosenPerk(playerCharacter, "pathStorm", "knockdownGust")) ||
      (spell.name === "Nukekubi's Grip" && hasChosenPerk(playerCharacter, "wayOnmyoji", "dreadfulGrip"))) ? 2 : 1;
    currentCombat.activeEffects.push({ kind: "stun", rankBonus: 0, roundsRemaining: stunRounds });
  } else if (spell.type === "fear") {
    let fearDuration = SPELL_EFFECT_DURATION;
    if (spell.name === "Bonewhisper" && hasChosenPerk(playerCharacter, "pathBarrow", "boneDeepWhisper")) fearDuration += 1;
    if (spell.name === "Shakuhachi of the Wandering Dead" && hasChosenPerk(playerCharacter, "waySuijin", "wanderingDread")) fearDuration += 1;
    currentCombat.activeEffects.push({ kind: "fear", rankBonus: 0, roundsRemaining: fearDuration });
  } else if (spell.type === "undeadSlayer") {
    const attackTier = getEffectivePlayerSpellDamageTier(tierBefore);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = rollDamage(attackTier);
      const enemyTemplate = ENEMIES[currentCombat.enemyId];
      const isUndead = enemyTemplate && (enemyTemplate.soundCategory === "zombie" || enemyTemplate.soundCategory === "spectral");
      if (isUndead) damage = damage * 2;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "resurrect") {
    if (getSpellCooldownRemaining(playerCharacter, spell.id) > 0) {
      logEntry.onCooldown = true;
    } else {
      const downedFollower = followers.find((f) => f.currentHP <= 0);
      if (downedFollower) {
        const maxHP = getHitPoints(downedFollower);
        const restorePct = hasChosenPerk(playerCharacter, "pathBarrow", "shroudsMercy") ? 0.6 : 0.4;
        downedFollower.currentHP = Math.max(1, Math.round(maxHP * restorePct));
        logEntry.resurrectedName = downedFollower.name;
      } else {
        logEntry.resurrectFailed = true;
      }
      if (!hasChosenPerk(playerCharacter, "pathBarrow", "theBarrowRemembers")) {
        setSpellCooldown(playerCharacter, spell.id, 9999);
      }
    }
  } else if (spell.type === "burst") {
    const attackTier = shiftTierByRank(getEffectivePlayerSpellDamageTier(tierBefore), 2);
    const enemyTier = getEffectiveEnemyTier();
    const hasUnbrokenSky = skillId === "pathStorm" && characterHasLegendary(playerCharacter, "Neasa's Unbroken Sky");
    const hit = hasUnbrokenSky || rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      if (spell.name === "Beithir Form" && hasChosenPerk(playerCharacter, "ancestralFetch", "hungeringBite")) {
        damage = Math.round(damage * 1.25);
      }
      if (spell.name === "Furyrune" && hasChosenPerk(playerCharacter, "runeBlade", "furyrunesWrath")) {
        damage = Math.round(damage * 1.25);
      }
      if (spell.name === "Wildfire Bolt" && hasChosenPerk(playerCharacter, "pathStorm", "wildfiresReach")) {
        damage = Math.round(damage * 1.25);
      }
      if (spell.name === "Wraithcall" && hasChosenPerk(playerCharacter, "pathBarrow", "wraithsFury")) {
        damage = Math.round(damage * 1.25);
      }
      if (spell.name === "Crow's Talon" && hasChosenPerk(playerCharacter, "wayTengu", "talonsFlurry")) {
        damage = Math.round(damage * 1.25);
      }
      if (spell.name === "Lightning Form" && hasChosenPerk(playerCharacter, "wayYokai", "wreathedLightning")) {
        damage = Math.round(damage * 1.25);
      }
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "lifetap") {
    const attackTier = getEffectivePlayerSpellDamageTier(tierBefore);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      if (spell.name === "Baobhan Sìth Form" && hasChosenPerk(playerCharacter, "ancestralFetch", "drainingGrasp")) {
        damage = Math.round(damage * 1.3);
      }
      if (spell.name === "Gravehunger" && hasChosenPerk(playerCharacter, "pathBarrow", "deeperHunger")) {
        damage = Math.round(damage * 1.3);
      }
      if (spell.name === "Water Form" && hasChosenPerk(playerCharacter, "wayYokai", "flowingWater")) {
        damage = Math.round(damage * 1.3);
      }
      const maxHP = getHitPoints(playerCharacter);
      playerCharacter.currentHP = Math.min(maxHP, playerCharacter.currentHP + damage);
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "thornward") {
    currentCombat.activeEffects.push({ kind: "thornward", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION, thornedWard: hasChosenPerk(playerCharacter, "pathWild", "thornedWard") });
  } else if (spell.type === "fortify") {
    let bonusAmount = rollDamage(tierBefore);
    const isAncestorsVigor = skillId === "ancestralAverick" && spell.name === "Ancestor's Vigor";
    if (isAncestorsVigor && hasChosenPerk(playerCharacter, "ancestralAverick", "warbloodResilience")) {
      bonusAmount = Math.round(bonusAmount * 1.4);
    }
    if (spell.name === "Ballad of Vigor" && hasChosenPerk(playerCharacter, "ancestralSiuloir", "unbrokenBallad")) {
      bonusAmount = Math.round(bonusAmount * 1.4);
    }
    if (spell.name === "Stonewall Rune" && hasChosenPerk(playerCharacter, "runeBlade", "stonewallResolve")) {
      bonusAmount = Math.round(bonusAmount * 1.4);
    }
    if (spell.name === "Saga of Vigor" && hasChosenPerk(playerCharacter, "runeSong", "sagasDepth")) {
      bonusAmount = Math.round(bonusAmount * 1.4);
    }
    if (spell.name === "Nature's Fortitude" && hasChosenPerk(playerCharacter, "pathWild", "bloomingVigor")) {
      bonusAmount = Math.round(bonusAmount * 1.4);
    }
    if (spell.name === "Taiko of the Raging Surf" && hasChosenPerk(playerCharacter, "waySuijin", "ragingSurfsHeight")) {
      bonusAmount = Math.round(bonusAmount * 1.4);
    }
    if (spell.name === "Griot's Song of Endurance" && hasChosenPerk(playerCharacter, "riteGriot", "endurancesDepth")) {
      bonusAmount = Math.round(bonusAmount * 1.4);
    }
    let fortifyDuration = isSong ? null : SPELL_EFFECT_DURATION;
    if (isAncestorsVigor && !isSong && hasChosenPerk(playerCharacter, "ancestralAverick", "steadyHand")) {
      fortifyDuration += 1;
    }
    const fortifyTargets = isSong ? [playerCharacter, ...getActiveFollowers()] : [playerCharacter];
    fortifyTargets.forEach((t) => { t.currentHP += bonusAmount; });
    currentCombat.activeEffects.push({
      kind: "fortify",
      rankBonus: 0,
      roundsRemaining: fortifyDuration,
      bonusHP: bonusAmount,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong
    });
    logEntry.healAmount = bonusAmount;
  } else if (spell.type === "hot") {
    let healBonusPct = (spell.name === "Nature's Bounty" && hasChosenPerk(playerCharacter, "pathWild", "bountysDepth")) ? 0.5 : 0;
    if (spell.name === "Biwa of the Deep Current" && hasChosenPerk(playerCharacter, "waySuijin", "deepCurrentsFlow")) healBonusPct = 0.5;
    currentCombat.activeEffects.push({
      kind: "hot",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      casterTierName: tierBefore,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong,
      healBonusPct: healBonusPct
    });
  } else if (spell.type === "spellDamageBuff") {
    let spellDmgRank = (spell.name === "Hymn of Power" && hasChosenPerk(playerCharacter, "ancestralSiuloir", "resonantHymn")) ? 2 : 1;
    if (spell.name === "Skald's Rune-Hymn" && hasChosenPerk(playerCharacter, "runeSong", "runeHymnsPower")) spellDmgRank = 2;
    if (spell.name === "Griot's Rhythm of Power" && hasChosenPerk(playerCharacter, "riteGriot", "rhythmOfPower")) spellDmgRank = 2;
    currentCombat.activeEffects.push({
      kind: "spellDamageBuff",
      rankBonus: spellDmgRank,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong
    });
  } else if (spell.type === "manaRegen") {
    let regenBonus = (spell.name === "Lute-Song of the Deep Well" && hasChosenPerk(playerCharacter, "ancestralSiuloir", "steadyTempo")) ? 3 : 0;
    if (spell.name === "Talharpa's Deep Drone" && hasChosenPerk(playerCharacter, "runeSong", "deepDrone")) regenBonus = 3;
    if (spell.name === "Kalimba's Deep Pulse" && hasChosenPerk(playerCharacter, "riteGriot", "deepPulse")) regenBonus = 3;
    currentCombat.activeEffects.push({
      kind: "manaRegen",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      regenBonus: regenBonus
    });
  } else if (spell.type === "groupHeal") {
    let healAmount = rollDamage(tierBefore);
    if (spell.name === "Bloodbond Hex" && hasChosenPerk(playerCharacter, "runeCurse", "bloodbondsDepth")) {
      healAmount = Math.round(healAmount * 1.4);
    }
    if (spell.name === "Grove's Protection" && hasChosenPerk(playerCharacter, "pathGrove", "widerBlessing")) {
      healAmount = Math.round(healAmount * 1.4);
    }
    if (spell.name === "Biwa of the Returning Tide" && hasChosenPerk(playerCharacter, "waySuijin", "returningTidesDepth")) {
      healAmount = Math.round(healAmount * 1.4);
    }
    const playerMaxHP = getHitPoints(playerCharacter);
    playerCharacter.currentHP = Math.min(playerMaxHP, playerCharacter.currentHP + healAmount);
    getActiveFollowers().forEach((follower) => {
      if (follower.currentHP <= 0) return;
      const followerMaxHP = getHitPoints(follower);
      follower.currentHP = Math.min(followerMaxHP, follower.currentHP + healAmount);
    });
    logEntry.healAmount = healAmount;
  } else if (spell.type === "buffAndDebuff") {
    let bothRank = 1;
    if (spell.name === "Warcry Rune" && hasChosenPerk(playerCharacter, "runeBlade", "warcrysEdge")) bothRank = 2;
    if (spell.name === "Strengthsteal Rune" && hasChosenPerk(playerCharacter, "runeCurse", "strengthstealsGrasp")) bothRank = 2;
    currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: bothRank, roundsRemaining: SPELL_EFFECT_DURATION, spellName: spell.name });
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -bothRank, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "curseBack") {
    currentCombat.activeEffects.push({ kind: "curseBack", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION, hasFortuneReversed: hasChosenPerk(playerCharacter, "runeCurse", "fortuneReversed") });
  } else if (spell.type === "cooldownBuff") {
    if (getSpellCooldownRemaining(playerCharacter, spell.id) > 0) {
      logEntry.onCooldown = true;
    } else {
      currentCombat.activeEffects.push({
        kind: "playerAttackBonus",
        rankBonus: 1,
        roundsRemaining: 4,
        spellName: spell.name
      });
      setSpellCooldown(playerCharacter, spell.id, 4);
    }
  } else if (spell.type === "manaRefund") {
    let refundAmount = rollDamage(tierBefore);
    if (spell.name === "Manaflow" && hasChosenPerk(playerCharacter, "ancestralEmyrs", "quickenedFlow")) {
      refundAmount = Math.round(refundAmount * 1.4);
    }
    if (spell.name === "Ubume's Gift" && hasChosenPerk(playerCharacter, "wayOnmyoji", "sorrowsGift")) {
      refundAmount = Math.round(refundAmount * 1.4);
    }
    const manaMax = getManaPoolMax(playerCharacter);
    playerCharacter.currentMana = Math.min(manaMax, playerCharacter.currentMana + refundAmount);
    logEntry.manaAmount = refundAmount;
  } else if (spell.type === "absorb") {
    let reduction = Math.max(2, Math.floor(rollDamage(tierBefore) / 2));
    let absorbDuration = 2;
    if (spell.name === "Aegis Ward" && hasChosenPerk(playerCharacter, "ancestralEmyrs", "steadyWard")) absorbDuration += 1;
    if (spell.name === "Aegis Ward" && hasChosenPerk(playerCharacter, "ancestralEmyrs", "wardedTwice")) absorbDuration += 1;
    if (spell.name === "Deflection Mark" && hasChosenPerk(playerCharacter, "runeBlade", "deflectingRune")) {
      reduction = Math.round(reduction * 1.4);
    }
    if (spell.name === "Yūrei's Veil" && hasChosenPerk(playerCharacter, "wayOnmyoji", "trailingVeil")) {
      reduction = Math.round(reduction * 1.4);
    }
    if (spell.name === "Yūrei's Veil" && hasChosenPerk(playerCharacter, "wayOnmyoji", "twiceBound")) {
      absorbDuration += 1;
    }
    currentCombat.activeEffects.push({ kind: "absorb", rankBonus: 0, roundsRemaining: absorbDuration, target: playerCharacter, reduction: reduction });
  } else if (spell.type === "groupAbsorb") {
    let reduction = Math.max(2, Math.floor(rollDamage(tierBefore) / 2));
    if (spell.name === "Circle of Aegis" && hasChosenPerk(playerCharacter, "ancestralEmyrs", "circleUnbroken")) {
      reduction = Math.round(reduction * 1.4);
    }
    currentCombat.activeEffects.push({ kind: "absorb", rankBonus: 0, roundsRemaining: 2, target: "all", reduction: reduction });
  } else if (spell.type === "dodgeBuff") {
    const dodgeRank = ((skillId === "ancestralAverick" && hasChosenPerk(playerCharacter, "ancestralAverick", "fleetbloodInstinct")) ||
      (spell.name === "Feather-Step" && hasChosenPerk(playerCharacter, "wayTengu", "featherLight"))) ? 2 : 1;
    currentCombat.activeEffects.push({ kind: "dodgeBuff", rankBonus: dodgeRank, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "acBuff") {
    let acRank = 1;
    if (skillId === "ancestralAverick" && hasChosenPerk(playerCharacter, "ancestralAverick", "steadfastAncestors")) acRank = 2;
    if (spell.name === "Stag Form" && hasChosenPerk(playerCharacter, "ancestralFetch", "sureFooting")) acRank = 2;
    if (spell.name === "Earth Form" && hasChosenPerk(playerCharacter, "wayYokai", "livingStone")) acRank = 2;
    if (spell.name === "Ironrune Guard" && hasChosenPerk(playerCharacter, "runeBlade", "ironStance")) acRank = 2;
    currentCombat.activeEffects.push({ kind: "acBuff", rankBonus: acRank, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "companion") {
    const wasRecast = dungeonCompanionUsed && spell.name === "Wolf's Call";
    dungeonCompanion = { casterTierName: tierBefore, spellName: spell.name, recastUsed: wasRecast };
    dungeonCompanionUsed = true;
    const isTwinElemental = ["Ember-Lash", "Thunder Caller"].includes(spell.name) &&
      hasChosenPerk(playerCharacter, "riteThunderWrath", "twinElementals");
    if (isTwinElemental) {
      currentCombat.activeEffects = currentCombat.activeEffects.filter((e) => !(e.kind === "companion" && e.spellName === spell.name));
    } else {
      currentCombat.activeEffects = currentCombat.activeEffects.filter((e) => e.kind !== "companion");
    }
    currentCombat.activeEffects.push({ kind: "companion", rankBonus: 0, roundsRemaining: null, casterTierName: tierBefore, spellName: spell.name });
  }

  if (skillId === "wayYokai" && PERSISTENT_YOKAI_SPELL_IDS.includes(spell.id)) {
    const yokaiEffectKind = spell.type === "buff" ? "playerAttackBonus" : spell.type;
    const justAddedEffect = [...currentCombat.activeEffects].reverse().find((e) => e.kind === yokaiEffectKind && !e.owner);
    if (justAddedEffect) {
      justAddedEffect.roundsRemaining = YOKAI_FORM_DURATION;
      justAddedEffect._justCast = true;
    }
  }

  if (skillId === "runeCurse" && spell.type !== "groupHeal" && characterHasLegendary(playerCharacter, "Kolgrim's Brand")) {
    currentCombat.activeEffects.forEach((e) => {
      if (e.spellName === spell.name) e.roundsRemaining = null;
    });
  }

  currentCombat.log.push(logEntry);

  performFollowersTurn();

  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return currentCombat;
  }

  resolveEnemyAttack();
  return currentCombat;
}

function performPlayerDefend() {
  if (!currentCombat || currentCombat.result) return currentCombat;

  currentCombat.playerDefending = true;
  currentCombat.log.push({ actor: "player", action: "defend" });

  resolveEnemyAttack();
  return currentCombat;
}

function performPlayerFlee() {
  if (!currentCombat || currentCombat.result) return currentCombat;

  const dodgeTier = getAdvantageTier(playerCharacter, "dodge").name;
  const faeCunningBonus = playerCharacter.traits && playerCharacter.traits.includes("faeCunning") ? 0.15 : 0;
  const leatherFleeBonus = (playerCharacter.equippedArmorSkill === "leatherArmor" && hasChosenPerk(playerCharacter, "leatherArmor", "practicedMobility")) ? 0.15 : 0;
  const success = rollSuccess(dodgeTier, currentCombat.enemyThreatTier, faeCunningBonus + leatherFleeBonus);
  currentCombat.log.push({ actor: "player", action: "flee", success: success });

  if (success) {
    currentCombat.result = "fled";
    return currentCombat;
  }

  resolveEnemyAttack();
  return currentCombat;
}

function claimVictoryLoot() {
  const enemyTemplate = ENEMIES[currentCombat.enemyId];
  const loot = enemyTemplate.lootTable || [];
  const BOOSTED_MATERIALS = ["Old Ore", "Grave Essence"];
  loot.forEach((itemName) => {
    playerCharacter.inventory.push(itemName);
    if (BOOSTED_MATERIALS.includes(itemName)) {
      playerCharacter.inventory.push(itemName);
    }
  });
  return loot;
}

function getEnemyConditionText() {
  const pct = currentCombat.enemyCurrentHP / currentCombat.enemyMaxHP;
  if (pct >= 0.99) return "unharmed";
  if (pct >= 0.7) return "lightly wounded";
  if (pct >= 0.4) return "badly wounded";
  if (pct > 0) return "barely standing";
  return "defeated";
}

function getActiveEffectsSummary() {
  if (!currentCombat.activeEffects.length) return "";
  const parts = currentCombat.activeEffects.map((e) => {
    if (e.source === "song") return `${e.spellName} playing${e.owner && e.owner !== playerCharacter ? ` (${e.owner.name})` : ""}`;
    if (e.kind === "playerAttackBonus") return `Empowered strikes (${e.roundsRemaining} rounds left)`;
    if (e.kind === "playerDefenseBonus") return `Braced defense (${e.roundsRemaining} rounds left)`;
    if (e.kind === "enemyDebuff") return `Foe weakened (${e.roundsRemaining} rounds left)`;
    if (e.kind === "dot") return `Curse lingers (${e.roundsRemaining} rounds left)`;
    if (e.kind === "fear") return `Foe gripped by fear (${e.roundsRemaining} rounds left)`;
    if (e.kind === "thornward") return `Thornward active (${e.roundsRemaining} rounds left)`;
    if (e.kind === "fortify") return `Fortified (${e.roundsRemaining} rounds left)`;
    if (e.kind === "hot") return `Nature's Bounty mending (${e.roundsRemaining} rounds left)`;
    if (e.kind === "dodgeBuff") return `Evasive grace (${e.roundsRemaining} rounds left)`;
    if (e.kind === "acBuff") return `Hardened bearing (${e.roundsRemaining} rounds left)`;
    if (e.kind === "spellDamageBuff") return `Empowered magic (${e.roundsRemaining} rounds left)`;
    if (e.kind === "manaRegen") return `Mana regenerating${e.owner && e.owner !== playerCharacter ? ` (${e.owner.name})` : ""}`;
    if (e.kind === "absorb") return `Warded against harm (${e.roundsRemaining} rounds left)`;
    if (e.kind === "curseBack") return `Foe's fortune turned (${e.roundsRemaining} rounds left)`;
    if (e.kind === "stun") return "Foe knocked down, losing their next turn";
    if (e.kind === "companion") return "Beast companion at your side";
    if (e.kind === "onHitWard") return `${e.spellName} watching, ready to answer the next blow`;
    return "";
  });
  return parts.filter(Boolean).join(" &middot; ");
}

function describeLogEntry(entry) {
  if (entry.actor === "effect") {
    if (entry.kind === "dot") return `${entry.spellName || "The lingering curse"} bites again for ${entry.damage} harm.`;
    if (entry.kind === "companion") return `Your companion strikes for ${entry.damage} harm.`;
    if (entry.kind === "downed") return `${entry.name} is knocked out of the fight!`;
    if (entry.kind === "feared") return `${currentCombat.enemyName} freezes, too shaken by fear to strike.`;
    if (entry.kind === "stunned") return `${currentCombat.enemyName} is still reeling, knocked off balance and unable to act.`;
    if (entry.kind === "enemyInflicted") {
      return entry.inflictType === "fear"
        ? `${currentCombat.enemyName}'s onslaught leaves you badly shaken.`
        : `${currentCombat.enemyName}'s blow leaves you reeling, off balance.`;
    }
    if (entry.kind === "hot") {
      const who = entry.ownerName && entry.ownerName !== playerCharacter.name ? entry.ownerName : "you";
      return `${entry.spellName || "The lingering magic"} mends ${who} further, restoring ${entry.healAmount} Hit Points.`;
    }
    if (entry.kind === "thornProc") return `Your thorns lash back at ${currentCombat.enemyName} for ${entry.damage}.`;
    if (entry.kind === "ancestralEcho") return `Your ancestors' fury answers in kind, striking again for ${entry.damage}.`;
    if (entry.kind === "manaRegen") {
      const who = entry.ownerName && entry.ownerName !== playerCharacter.name ? `${entry.ownerName}'s` : "your";
      return `${entry.spellName || "The song's melody"} restores ${entry.manaAmount} mana to ${who} pool.`;
    }
    if (entry.kind === "wardTriggered") return `${entry.wardName} answers the blow — ${entry.effectText}.`;
    if (entry.kind === "wardOfTheDeepSave") return `Ward of the Deep pulls ${entry.targetName} back from the edge, restoring them well beyond an ordinary revival.`;
    if (entry.kind === "songStopped") {
      const isYou = !entry.ownerName || entry.ownerName === playerCharacter.name;
      const possessive = isYou ? "your" : `${entry.ownerName}'s`;
      const subject = isYou ? "You let" : `${entry.ownerName} lets`;
      if (entry.ownerDowned) {
        return `${entry.spellName} falls silent as ${possessive} strength gives out.`;
      }
      return entry.outOfMana
        ? `${entry.spellName} fades as ${possessive} mana runs dry.`
        : `${subject} ${entry.spellName} fade to silence.`;
    }
    if (entry.kind === "songContinues") return `${entry.spellName} continues to play, its magic humming steadily.`;
    if (entry.kind === "enchantProc") {
      if (entry.procType === "deflect") return "Your Storm-enchanted armor crackles and deflects the blow entirely!";
      if (entry.procType === "counterBurn") return `Your Flame-enchanted armor sears back, burning your foe for ${entry.damage}.`;
      if (entry.procType === "chill") return "Your Frost-enchanted armor bites back, chilling your foe's next strike.";
      if (entry.procType === "counterCurse") return "Your Curse-enchanted armor lashes back with a lingering hex.";
      return "";
    }
    return "";
  }

  if (entry.actor === "enemy" && entry.action === "heal") {
    return `${currentCombat.enemyName} calls on ${entry.spellName}, mending ${entry.healAmount} Hit Points.`;
  }

  if (entry.actor === "follower") {
    if (entry.action === "heal") {
      return `${entry.followerName} calls on healing magic, restoring ${entry.healAmount} Hit Points to ${entry.targetName}.`;
    }
    if (entry.action === "cast") {
      if (entry.castKind === "ward") {
        return `${entry.followerName} calls on ${entry.spellName}, and a silent ward settles over her — ready to answer the next blow.`;
      }
      if (entry.castKind === "utility") {
        if (entry.spellType === "absorb") {
          return `${entry.followerName} calls on ${entry.spellName}, and a ward of raw force settles over her.`;
        }
        if (entry.spellType === "stun") {
          return `${entry.followerName} calls on ${entry.spellName}, and their foe is knocked clean off their feet.`;
        }
        if (entry.spellType === "guaranteedHit") {
          return `${entry.followerName} calls on ${entry.spellName}, and sees with perfect clarity exactly where the next strike will land.`;
        }
        if (entry.spellType === "manaRefund") {
          return `${entry.followerName} calls on ${entry.spellName}, drawing ${entry.manaAmount} mana back into herself.`;
        }
        if (entry.spellType === "autoRevive") {
          return `${entry.followerName} calls on ${entry.spellName}, and a silent watch settles over the party.`;
        }
        return `${entry.followerName} calls on ${entry.spellName}.`;
      }
      if (entry.castKind === "cooldownBuff") {
        return `${entry.followerName} calls on ${entry.spellName}, and her strikes burn brighter for a time.`;
      }
      if (entry.castKind === "debuff") {
        return `${entry.followerName} calls on ${entry.spellName}, and their foe falters.`;
      }
      if (entry.castKind === "yokaiForm") {
        return `${entry.followerName} calls on ${entry.spellName}, and their shape shifts.`;
      }
      if (entry.hit === undefined) {
        return `${entry.followerName} calls on ${entry.spellName}, a curse taking hold.`;
      }
      return entry.hit
        ? `${entry.followerName} calls on ${entry.spellName} and lands a solid hit for ${entry.damage}.`
        : `${entry.followerName} calls on ${entry.spellName}, but it goes wide.`;
    }
    if (entry.action === "sing") {
      return entry.healAmount
        ? `${entry.followerName} strikes up ${entry.spellName}, gaining ${entry.healAmount} temporary Hit Points.`
        : `${entry.followerName} strikes up ${entry.spellName}, its melody taking hold.`;
    }
    return entry.hit
      ? `${entry.followerName} strikes and lands a hit for ${entry.damage}.`
      : `${entry.followerName} strikes, but misses.`;
  }

  if (entry.actor === "player") {
    if (entry.action === "incapacitated") {
      return entry.incapacitateType === "stun"
        ? "You're still too rattled to act — the moment slips past you."
        : "Fear holds you rooted in place, and the moment passes.";
    }
    if (entry.action === "defend") {
      return "You brace yourself, ready to turn aside the next blow.";
    }
    if (entry.action === "shieldBash") {
      if (!entry.hit) return "You slam your shield forward, but your foe twists away.";
      return entry.stunned
        ? `You slam your shield into your foe for ${entry.damage}, knocking them senseless!`
        : `You slam your shield into your foe for ${entry.damage}.`;
    }
    if (entry.action === "flee") {
      return entry.success
        ? "You break away and flee."
        : "You try to break away, but fail to escape.";
    }

    const actionName = entry.spellName || SKILLS[entry.skillId].name;

    if (entry.spellType === "heal") {
      return entry.healTargetName
        ? `You call on ${actionName}, restoring ${entry.healAmount} Hit Points to ${entry.healTargetName}.`
        : `You call on ${actionName}, restoring ${entry.healAmount} Hit Points.`;
    }
    if (entry.spellType === "enchant" || entry.spellType === "buff") {
      return `You call on ${actionName}, and feel your strikes grow stronger.`;
    }
    if (entry.spellType === "guard") {
      return `You call on ${actionName}, bracing yourself against harm to come.`;
    }
    if (entry.spellType === "debuff") {
      return `You call on ${actionName}, and your foe falters.`;
    }
    if (entry.spellType === "dot") {
      return `You call on ${actionName}, a curse taking hold.`;
    }
    if (entry.spellType === "fear") {
      return `You call on ${actionName}, and something ancient stirs beneath your foe's courage.`;
    }
    if (entry.spellType === "stun") {
      return `You call on ${actionName}, and your foe is knocked clean off their feet.`;
    }
    if (entry.spellType === "thornward") {
      return `You call on ${actionName}, and living thorns wrap protectively around you.`;
    }
    if (entry.spellType === "fortify") {
      return `You call on ${actionName}, gaining ${entry.healAmount} temporary Hit Points.`;
    }
    if (entry.spellType === "hot") {
      return `You call on ${actionName}, and a slow mending begins to take hold.`;
    }
    if (entry.spellType === "spellDamageBuff") {
      return `You strike up ${actionName}, and your magic hums stronger for as long as it plays.`;
    }
    if (entry.spellType === "manaRegen") {
      return `You strike up ${actionName}, a slow steady rhythm that will replenish your mana as it plays.`;
    }
    if (entry.spellType === "groupHeal") {
      return `You call on ${actionName}, restoring ${entry.healAmount} Hit Points to everyone at your side.`;
    }
    if (entry.spellType === "dodgeBuff") {
      return `You call on ${actionName}, and your footwork grows swift and sure.`;
    }
    if (entry.spellType === "acBuff") {
      return `You call on ${actionName}, and your bearing hardens against harm.`;
    }
    if (entry.spellType === "buffAndDebuff") {
      return `You call on ${actionName}, and feel your strikes grow stronger as your foe falters.`;
    }
    if (entry.spellType === "damageAmpDebuff") {
      return `You call on ${actionName}, and your foe is left exposed to every strike that follows.`;
    }
    if (entry.spellType === "accuracyDebuff") {
      return `You call on ${actionName}, and your foe's own aim begins to fail them.`;
    }
    if (entry.spellType === "defenseDebuff") {
      return `You call on ${actionName}, and your foe's guard falls open.`;
    }
    if (entry.spellType === "spellLock") {
      return `You call on ${actionName}, and your foe's own magic falls silent.`;
    }
    if (
      entry.spellType === "onHitBuff" || entry.spellType === "onHitHeal" ||
      entry.spellType === "onHitManaRegen" || entry.spellType === "onHitGroupHeal" ||
      entry.spellType === "onHitDebuff"
    ) {
      return `You call on ${actionName}, and a silent ward settles over you — ready to answer the next blow.`;
    }
    if (entry.spellType === "powerSteal") {
      return entry.hit
        ? `You call on ${actionName}, tearing ${entry.damage} strength away from your foe — and making it your own.`
        : `You call on ${actionName}, but it fails to take hold.`;
    }
    if (entry.spellType === "doubleDrain") {
      return entry.hit
        ? `You call on ${actionName} and drain your foe for ${entry.damage}, restoring the same in Hit Points and ${entry.manaGained} mana.`
        : `You call on ${actionName}, but it fails to find its mark.`;
    }
    if (entry.spellType === "cooldownBuff") {
      return entry.onCooldown
        ? `You reach for ${actionName}, but the fire hasn't rekindled yet.`
        : `You call on ${actionName}, and your strikes burn brighter for a time.`;
    }
    if (entry.spellType === "manaRefund") {
      return `You call on ${actionName}, drawing ${entry.manaAmount} mana back into yourself.`;
    }
    if (entry.spellType === "absorb") {
      return `You call on ${actionName}, and a ward of raw force settles over you.`;
    }
    if (entry.spellType === "groupAbsorb") {
      return `You call on ${actionName}, and a ward of raw force settles over your whole party.`;
    }
    if (entry.spellType === "guaranteedHit" || entry.spellType === "guaranteedSpellHit") {
      return `You call on ${actionName}, and see with perfect clarity exactly where your next strike will land.`;
    }
    if (entry.spellType === "guaranteedStun") {
      return `You call on ${actionName}, and see the exact thread of your foe's next move — ready to cut it short.`;
    }
    if (entry.spellType === "guaranteedDodge") {
      return `You call on ${actionName}, and see the blow that hasn't fallen yet.`;
    }
    if (entry.spellType === "guaranteedFollowerAction") {
      return `You call on ${actionName}, lending your sight to a companion's next move.`;
    }
    if (entry.spellType === "curseBack") {
      return `You call on ${actionName}, and ill fortune settles over your foe.`;
    }
    if (entry.spellType === "companion") {
      return `You call on ${actionName}, and a beast answers your call — it will fight at your side for the rest of this dungeon.`;
    }
    if (entry.spellType === "resurrect") {
      return entry.resurrectedName
        ? `You call on ${actionName}, and ${entry.resurrectedName} is pulled back from the edge, rejoining the fight.`
        : `You call on ${actionName}, but no fallen companion answers the call.`;
    }

    if (entry.spellName) {
      return entry.hit
        ? `You call on ${actionName} and land a solid hit for ${entry.damage}.`
        : `You call on ${actionName}, but it goes wide.`;
    }

    if (playerCharacter.weaponEnchantment) {
      const enchantType = ENCHANTMENT_TYPES[playerCharacter.weaponEnchantment.type];
      const flavor = enchantType ? enchantType.name : "";
      return entry.hit
        ? `You strike with your ${flavor}-enchanted ${actionName}, and land a solid hit for ${entry.damage}.`
        : `You strike with your ${flavor}-enchanted ${actionName}, but the blow goes wide.`;
    }

    return entry.hit
      ? `You strike with your ${actionName} and land a solid hit for ${entry.damage}.`
      : `You strike with your ${actionName}, but the blow goes wide.`;
  }

  const targetLabel = entry.isPlayerTarget ? "you" : entry.targetName;

  if (entry.isPlayerTarget && !entry.hit && playerCharacter.armorEnchantment) {
    const enchantType = ENCHANTMENT_TYPES[playerCharacter.armorEnchantment.type];
    const flavor = enchantType ? enchantType.name : "";
    return `${currentCombat.enemyName} strikes at you, but your ${flavor}-enchanted armor turns the blow aside.`;
  }

  if (entry.spellName) {
    if (!entry.hit) {
      return `${currentCombat.enemyName} calls on ${entry.spellName}, but it goes wide of ${targetLabel}.`;
    }
    if (entry.backfired) {
      return `${currentCombat.enemyName} calls on ${entry.spellName} at you — but ill fortune turns it back on them for ${entry.damage}!`;
    }
    return `${currentCombat.enemyName} calls on ${entry.spellName}, striking ${targetLabel} for ${entry.damage}.`;
  }

  return entry.hit
    ? `${currentCombat.enemyName} strikes at ${targetLabel} and lands a hit for ${entry.damage}.`
    : entry.backfired
      ? `${currentCombat.enemyName} strikes at you — but ill fortune turns the blow back on them for ${entry.damage}!`
      : `${currentCombat.enemyName} strikes at ${targetLabel}, but misses.`;
}

function describeRecentRound() {
  if (!currentCombat || currentCombat.log.length === 0) return "";
  const windowSize = followers.length + 4;
  const recent = currentCombat.log.slice(-windowSize);
  return recent.map(describeLogEntry).filter(Boolean).join(" ");
}

function getRecentRoundLines() {
  if (!currentCombat || currentCombat.log.length === 0) return [];
  const windowSize = followers.length + 4;
  const recent = currentCombat.log.slice(-windowSize);
  return recent.map(describeLogEntry).filter(Boolean);
}