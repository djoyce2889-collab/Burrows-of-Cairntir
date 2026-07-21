/* ============================================================
   COMBAT.JS
   ============================================================ */

let currentCombat = null;

let dungeonCompanion = null;
let dungeonCompanionUsed = false;

function resetDungeonCompanionState() {
  dungeonCompanion = null;
  dungeonCompanionUsed = false;
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
function pushDotEffect(newEffect) {
  currentCombat.activeEffects = currentCombat.activeEffects.filter(
    (e) => !(e.kind === "dot" && e.spellName === newEffect.spellName)
  );
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
  currentCombat.spellCooldowns.forEach((c) => {
    c.roundsRemaining -= 1;
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
  if (!style) return { attackBonus: 0, defenseBonus: 0, spellDamageBonus: 0, healBonus: 0 };

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

  return result;
}

function getEffectiveAttackTierFor(character, baseTierName) {
  const equipBonus = character.weaponEnchantment ? 1 : 0;
  const styleBonus = getCombatStyleBonusFor(character).attackBonus;
  const craftedBonus = getCraftedItemBonus(character, character.equippedWeaponSkill);
  return shiftTierByRank(baseTierName, getEffectRankSum("playerAttackBonus", character) + equipBonus + styleBonus + craftedBonus);
}

function getEffectiveSpellDamageTierFor(character, baseTierName) {
  const baseAttackTier = getEffectiveAttackTierFor(character, baseTierName);
  const spellBonus = getCombatStyleBonusFor(character).spellDamageBonus || 0;
  const songBonus = getEffectRankSum("spellDamageBuff", character);
  return shiftTierByRank(baseAttackTier, spellBonus + songBonus);
}

function getEffectiveHealTierFor(character, baseTierName) {
  const healBonus = getCombatStyleBonusFor(character).healBonus || 0;
  return shiftTierByRank(baseTierName, healBonus);
}

/**
 * Bard songs (Line of Siuloir) are persistent effects — they
 * never expire on their own, but only 2 can play at once.
 */
function getActiveSongCount() {
  return currentCombat.activeEffects.filter((e) => e.source === "song").length;
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

/**
 * Sword & Shield / Axe & Shield only grant their defense bonus
 * if a Shield is actually equipped, and Dual Wielding only
 * grants its attack bonus if a second weapon is actually
 * equipped in the offhand — picking the style alone is no
 * longer enough on its own.
 */
function getPlayerCombatStyleBonus() {
  const style = COMBAT_STYLES[playerCharacter.combatStyle];
  if (!style) return { attackBonus: 0, defenseBonus: 0, spellDamageBonus: 0, healBonus: 0 };

  const result = Object.assign({}, style);

  const needsShield = playerCharacter.combatStyle === "swordShield" || playerCharacter.combatStyle === "axeShield";
  if (needsShield && !playerCharacter.equippedShield) {
    result.defenseBonus = 0;
  }

  if (playerCharacter.combatStyle === "dual" && !playerCharacter.equippedOffhandSkill) {
    result.attackBonus = 0;
  }

  return result;
}

function getEffectivePlayerAttackTier(baseTierName) {
  const equipBonus = playerCharacter.weaponEnchantment ? 1 : 0;
  const styleBonus = getPlayerCombatStyleBonus().attackBonus;
  const craftedBonus = getCraftedItemBonus(playerCharacter, playerCharacter.equippedWeaponSkill);
  return shiftTierByRank(baseTierName, getEffectRankSum("playerAttackBonus") + equipBonus + styleBonus + craftedBonus);
}

function getEffectivePlayerSpellDamageTier(baseTierName) {
  const baseAttackTier = getEffectivePlayerAttackTier(baseTierName);
  const spellBonus = getPlayerCombatStyleBonus().spellDamageBonus || 0;
  const songBonus = getEffectRankSum("spellDamageBuff");
  return shiftTierByRank(baseAttackTier, spellBonus + songBonus);
}

function getEffectivePlayerHealTier(baseTierName) {
  const healBonus = getPlayerCombatStyleBonus().healBonus || 0;
  return shiftTierByRank(baseTierName, healBonus);
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
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: 1 });
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: "grows stronger" });
    } else if (ward.wardType === "onHitHeal") {
      const maxHP = getHitPoints(character);
      const healAmt = Math.max(1, Math.floor(rollDamage("Novice") / 2));
      character.currentHP = Math.min(maxHP, character.currentHP + healAmt);
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: `mends ${healAmt} Hit Points` });
    } else if (ward.wardType === "onHitManaRegen") {
      const manaMax = getManaPoolMax(character);
      character.currentMana = Math.min(manaMax, character.currentMana + 5);
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: "returns 5 mana" });
    } else if (ward.wardType === "onHitGroupHeal") {
      const healAmt = Math.max(1, Math.floor(rollDamage("Novice") / 2));
      [playerCharacter, ...getActiveFollowers()].forEach((member) => {
        if (member.currentHP <= 0) return;
        const maxHP = getHitPoints(member);
        member.currentHP = Math.min(maxHP, member.currentHP + healAmt);
      });
      currentCombat.log.push({ actor: "effect", kind: "wardTriggered", wardName: ward.spellName, effectText: `mends the whole party for ${healAmt}` });
    } else if (ward.wardType === "onHitDebuff") {
      currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: 1 });
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
function getEnemyCultureSpell() {
  const dungeon = DUNGEONS[selectedDungeonId];
  if (!dungeon || !dungeon.culture) return null;
  const culture = CULTURES[dungeon.culture];
  if (!culture) return null;

  const castableTypes = dungeon.enemyCastableTypes || ENEMY_CASTABLE_TYPES;

  const pool = [];
  culture.magicSkillIds.forEach((skillId) => {
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
  const generalBonus = getEffectRankSum("playerDefenseBonus", character) + equipBonus + styleBonus;
  acTierName = shiftTierByRank(acTierName, generalBonus + getEffectRankSum("acBuff", character));
  dodgeTierName = shiftTierByRank(dodgeTierName, generalBonus + getEffectRankSum("dodgeBuff", character));

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

    if (effect.kind === "dot") {
      const dmg = applyDamageToEnemy(Math.max(1, Math.floor(rollDamage(effect.casterTierName) / 2)));
      currentCombat.log.push({ actor: "effect", kind: "dot", damage: dmg, spellName: effect.spellName });
    } else if (effect.kind === "companion") {
      const kinshipBonus = playerCharacter.traits && playerCharacter.traits.includes("beastkinship") ? 1 : 0;
      const heavyTier = shiftTierByRank(effect.casterTierName || "Novice", 2 + kinshipBonus);
      const dmg = applyDamageToEnemy(rollDamage(heavyTier));
      currentCombat.log.push({ actor: "effect", kind: "companion", damage: dmg });
    } else if (effect.kind === "hot") {
      const healTargets = effect.partyWide ? [playerCharacter, ...getActiveFollowers()] : [owner];
      healTargets.forEach((target) => {
        if (target.currentHP <= 0) return;
        const maxHP = getHitPoints(target);
        if (target.currentHP < maxHP) {
          const healAmt = Math.max(1, Math.floor(rollDamage(effect.casterTierName || "Novice") / 2));
          target.currentHP = Math.min(maxHP, target.currentHP + healAmt);
          currentCombat.log.push({ actor: "effect", kind: "hot", healAmount: healAmt, spellName: effect.spellName, ownerName: target.name });
        }
      });
    } else if (effect.kind === "manaRegen") {
      const manaMax = getManaPoolMax(owner);
      const before = owner.currentMana;
      owner.currentMana = Math.min(manaMax, owner.currentMana + 8);
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
      const songDrainAmount = 3;
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
      currentCombat.log.push({ actor: "effect", kind: "songStopped", spellName: effect.spellName, outOfMana: true, ownerName: owner.name });
      return false;
    }
    if (effect.roundsRemaining === null) return true;
    effect.roundsRemaining -= 1;
    if (effect.roundsRemaining <= 0) {
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
function getFollowerSongOption(follower) {
  const skillId = "ancestralSiuloir";
  if (!follower.skills[skillId]) return null;
  const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
  const allSpells = SPELLS[skillId] || [];
  const alreadySinging = currentCombat.activeEffects
    .filter((e) => e.source === "song" && e.owner === follower)
    .map((e) => e.spellName);

  const songSpell = allSpells.find(
    (s) => known.includes(s.id) && isSpellActive(follower, s.id) && !alreadySinging.includes(s.name)
  );
  return songSpell ? { skillId, spell: songSpell } : null;
}

/**
 * Actually sings the song — mirrors the relevant branches of
 * performPlayerCast, but every effect is tagged with
 * owner: follower, so sub-pieces 1-3's owner-aware functions
 * correctly apply it to HER stats, not the player's.
 */
function performFollowerSongCast(follower, skillId, spell) {
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
    currentCombat.activeEffects.push({
      kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: null,
      source: "song", spellName: spell.name, owner: follower, partyWide: true
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
    currentCombat.activeEffects.push({
      kind: "spellDamageBuff", rankBonus: 1, roundsRemaining: null,
      source: "song", spellName: spell.name, owner: follower, partyWide: true
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

const FOLLOWER_ATTACK_SPELL_TYPES = ["damage", "burst", "undeadSlayer", "execute", "lifetap", "dot", "doubleDrain", "powerSteal"];

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
    if (songOption && follower.currentMana >= MANA_CONFIG.costPerCast && getFollowerSongCount(follower) < 2) {
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

  const targetHasGuaranteedDodge = isPlayerTarget && currentCombat.activeEffects.some((e) => e.kind === "guaranteedDodge");
  const hit = targetHasGuaranteedDodge ? (consumeGuaranteedEffect("guaranteedDodge") ? false : rollSuccess(enemyEffectiveTier, defenderTier, adjustment)) : rollSuccess(enemyEffectiveTier, defenderTier, adjustment);
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
    const hasIllFortune = currentCombat.activeEffects.some((e) => e.kind === "curseBack");
    if (hasIllFortune && Math.random() < 0.35) {
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

    const absorbed = getFlatDamageAbsorb(target) + getThickHideReduction(target, attackType);
    if (absorbed > 0) {
      damage = Math.max(0, damage - absorbed);
    }
    target.currentHP = Math.max(0, target.currentHP - damage);
    if (target.equippedArmorSkill && target.skills[target.equippedArmorSkill]) {
      useSkill(target, target.equippedArmorSkill);
    }
    if (target.currentHP <= 0) {
      const wardIndex = currentCombat.activeEffects.findIndex((e) => e.kind === "autoRevive");
      if (wardIndex !== -1) {
        currentCombat.activeEffects.splice(wardIndex, 1);
        const maxHP = getHitPoints(target);
        const manaMax = getManaPoolMax(target);
        target.currentHP = Math.max(1, Math.round(maxHP * 0.3));
        target.currentMana = Math.min(manaMax, target.currentMana + Math.round(manaMax * 0.2));
        currentCombat.log.push({ actor: "effect", kind: "wardOfTheDeepSave", targetName: target.name });
      }
    }
  } else if (backfired) {
    damage = applyDamageToEnemy(
      Math.max(1, Math.round(rollDamage(enemyEffectiveTier) * diff.enemyDamageMultiplier))
    );
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
    const procChance = hasIronWill ? 0.06 : 0.15;
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

    const hasThornward = currentCombat.activeEffects.some((e) => e.kind === "thornward");
    if (hasThornward) {
      const counterDmg = Math.max(1, Math.floor(rollDamage("Novice") / 2));
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
  if (getSpellCooldownRemaining(playerCharacter, SHIELD_BASH_ID) > 0) return currentCombat;

  const skillId = playerCharacter.equippedWeaponSkill || "unarmedCombat";
  const tierBefore = getCharacterSkillTier(playerCharacter, skillId).name;
  useSkill(playerCharacter, skillId);

  const attackTier = shiftTierByRank(getEffectivePlayerAttackTier(tierBefore), -2);
  const enemyTier = getEffectiveEnemyTier();
  const hit = rollSuccess(attackTier, enemyTier);
  let damage = 0;
  let stunned = false;

  if (hit) {
    damage = applyDamageToEnemy(rollDamage(attackTier));
    if (Math.random() < 0.6) {
      currentCombat.activeEffects.push({ kind: "stun", rankBonus: 0, roundsRemaining: 1 });
      stunned = true;
    }
  }

  setSpellCooldown(playerCharacter, SHIELD_BASH_ID, 3);

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
  const accuracyTier = shiftTierByRank(attackTier, (isArcherShot ? 2 : 0) + keenSensesBonus + getNightsightBonus());
  const enemyTier = getEffectiveEnemyTier();
  const hasGuaranteedHit = consumeGuaranteedEffect("guaranteedHit");
  const hit = hasGuaranteedHit || rollSuccess(accuracyTier, enemyTier);
  let damage = 0;

  if (hit) {
    damage = applyDamageToEnemy(rollDamage(attackTier));
  }

  if (hit && playerCharacter.traits && playerCharacter.traits.includes("predatorInstinct")) {
    const woundedPct = 1 - currentCombat.enemyCurrentHP / currentCombat.enemyMaxHP;
    if (woundedPct >= 0.5) {
      const bonusDmg = Math.max(1, Math.round(damage * 0.25));
      damage += bonusDmg;
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - bonusDmg);
    }
  }

  currentCombat.log.push({ actor: "player", skillId: skillId, spellName: null, hit: hit, damage: damage });

  performFollowersTurn();

  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return currentCombat;
  }

  resolveEnemyAttack();
  return currentCombat;
}

function performPlayerCast(skillId, spell) {
  if (!currentCombat || currentCombat.result) return currentCombat;
  if (playerCharacter.currentMana < MANA_CONFIG.costPerCast) return currentCombat;

  const isSong = skillId === "ancestralSiuloir";
  if (isSong && getActiveSongCount() >= 2) return currentCombat;

  playerCharacter.currentMana -= MANA_CONFIG.costPerCast;

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
    const hit = hasGuaranteedSpellHit || rollSuccess(accuracyTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "damageAmpDebuff") {
    currentCombat.activeEffects.push({ kind: "vulnerability", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "accuracyDebuff") {
    currentCombat.activeEffects.push({ kind: "accuracyDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "damageDebuff") {
    currentCombat.activeEffects.push({ kind: "damageDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "defenseDebuff") {
    currentCombat.activeEffects.push({ kind: "defenseDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "spellLock") {
    currentCombat.activeEffects.push({ kind: "silence", rankBonus: 0, roundsRemaining: null });
  } else if (spell.type === "autoRevive") {
    currentCombat.activeEffects.push({
      kind: "autoRevive",
      rankBonus: 0,
      roundsRemaining: null,
      owner: playerCharacter,
      spellName: spell.name
    });
  } else if (
    spell.type === "onHitBuff" || spell.type === "onHitHeal" ||
    spell.type === "onHitManaRegen" || spell.type === "onHitGroupHeal" ||
    spell.type === "onHitDebuff"
  ) {
    currentCombat.activeEffects.push({
      kind: "onHitWard",
      rankBonus: 0,
      roundsRemaining: null,
      owner: playerCharacter,
      wardType: spell.type,
      spellName: spell.name
    });
  } else if (spell.type === "powerSteal") {
    const attackTier = getEffectivePlayerSpellDamageTier(tierBefore);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
      currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
      currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
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
      const executeMultiplier = 1 + missingHpPct * 1.5;
      damage = applyDamageToEnemy(Math.round(damage * executeMultiplier));
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "guaranteedHit" || spell.type === "guaranteedSpellHit" || spell.type === "guaranteedStun") {
    currentCombat.activeEffects.push({ kind: spell.type, rankBonus: 0, roundsRemaining: null });
  } else if (spell.type === "guaranteedDodge") {
    currentCombat.activeEffects.push({ kind: "guaranteedDodge", rankBonus: 0, roundsRemaining: null, target: playerCharacter });
  } else if (spell.type === "guaranteedFollowerAction") {
    currentCombat.activeEffects.push({ kind: "guaranteedFollowerAction", rankBonus: 0, roundsRemaining: null });
  } else if (spell.type === "heal") {
    const healTier = getEffectivePlayerHealTier(tierBefore);
    const healAmount = rollDamage(healTier);
    const maxHP = getHitPoints(playerCharacter);
    playerCharacter.currentHP = Math.min(maxHP, playerCharacter.currentHP + healAmount);
    logEntry.healAmount = healAmount;
  } else if (spell.type === "enchant" || spell.type === "buff") {
    currentCombat.activeEffects.push({
      kind: "playerAttackBonus",
      rankBonus: 1,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong
    });
  } else if (spell.type === "guard") {
    currentCombat.activeEffects.push({ kind: "playerDefenseBonus", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "debuff") {
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "dot") {
    pushDotEffect({
      kind: "dot",
      rankBonus: 0,
      roundsRemaining: SPELL_EFFECT_DURATION,
      casterTierName: tierBefore,
      spellName: spell.name
    });
  } else if (spell.type === "stun") {
    currentCombat.activeEffects.push({ kind: "stun", rankBonus: 0, roundsRemaining: 1 });
  } else if (spell.type === "fear") {
    currentCombat.activeEffects.push({ kind: "fear", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION });
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
    const downedFollower = followers.find((f) => f.currentHP <= 0);
    if (downedFollower) {
      const maxHP = getHitPoints(downedFollower);
      downedFollower.currentHP = Math.max(1, Math.round(maxHP * 0.4));
      logEntry.resurrectedName = downedFollower.name;
    } else {
      logEntry.resurrectFailed = true;
    }
  } else if (spell.type === "burst") {
    const attackTier = shiftTierByRank(getEffectivePlayerSpellDamageTier(tierBefore), 2);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = applyDamageToEnemy(rollDamage(attackTier));
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "thornward") {
    currentCombat.activeEffects.push({ kind: "thornward", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "fortify") {
    const bonusAmount = rollDamage(tierBefore);
    const fortifyTargets = isSong ? [playerCharacter, ...getActiveFollowers()] : [playerCharacter];
    fortifyTargets.forEach((t) => { t.currentHP += bonusAmount; });
    currentCombat.activeEffects.push({
      kind: "fortify",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      bonusHP: bonusAmount,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong
    });
    logEntry.healAmount = bonusAmount;
  } else if (spell.type === "hot") {
    currentCombat.activeEffects.push({
      kind: "hot",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      casterTierName: tierBefore,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong
    });
  } else if (spell.type === "spellDamageBuff") {
    currentCombat.activeEffects.push({
      kind: "spellDamageBuff",
      rankBonus: 1,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      source: isSong ? "song" : undefined,
      spellName: spell.name,
      partyWide: isSong
    });
  } else if (spell.type === "manaRegen") {
    currentCombat.activeEffects.push({
      kind: "manaRegen",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      source: isSong ? "song" : undefined,
      spellName: spell.name
    });
  } else if (spell.type === "groupHeal") {
    const healAmount = rollDamage(tierBefore);
    const playerMaxHP = getHitPoints(playerCharacter);
    playerCharacter.currentHP = Math.min(playerMaxHP, playerCharacter.currentHP + healAmount);
    getActiveFollowers().forEach((follower) => {
      if (follower.currentHP <= 0) return;
      const followerMaxHP = getHitPoints(follower);
      follower.currentHP = Math.min(followerMaxHP, follower.currentHP + healAmount);
    });
    logEntry.healAmount = healAmount;
  } else if (spell.type === "buffAndDebuff") {
    currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "curseBack") {
    currentCombat.activeEffects.push({ kind: "curseBack", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION });
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
    const refundAmount = rollDamage(tierBefore);
    const manaMax = getManaPoolMax(playerCharacter);
    playerCharacter.currentMana = Math.min(manaMax, playerCharacter.currentMana + refundAmount);
    logEntry.manaAmount = refundAmount;
  } else if (spell.type === "absorb") {
    const reduction = Math.max(2, Math.floor(rollDamage(tierBefore) / 2));
    currentCombat.activeEffects.push({ kind: "absorb", rankBonus: 0, roundsRemaining: 2, target: playerCharacter, reduction: reduction });
  } else if (spell.type === "groupAbsorb") {
    const reduction = Math.max(2, Math.floor(rollDamage(tierBefore) / 2));
    currentCombat.activeEffects.push({ kind: "absorb", rankBonus: 0, roundsRemaining: 2, target: "all", reduction: reduction });
  } else if (spell.type === "dodgeBuff") {
    currentCombat.activeEffects.push({ kind: "dodgeBuff", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "acBuff") {
    currentCombat.activeEffects.push({ kind: "acBuff", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "companion") {
    dungeonCompanion = { casterTierName: tierBefore };
    dungeonCompanionUsed = true;
    currentCombat.activeEffects = currentCombat.activeEffects.filter((e) => e.kind !== "companion");
    currentCombat.activeEffects.push({ kind: "companion", rankBonus: 0, roundsRemaining: null, casterTierName: tierBefore });
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
  const success = rollSuccess(dodgeTier, currentCombat.enemyThreatTier, faeCunningBonus);
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
    if (entry.kind === "manaRegen") {
      const who = entry.ownerName && entry.ownerName !== playerCharacter.name ? `${entry.ownerName}'s` : "your";
      return `${entry.spellName || "The song's melody"} restores ${entry.manaAmount} mana to ${who} pool.`;
    }
    if (entry.kind === "wardTriggered") return `${entry.wardName} answers the blow — ${entry.effectText}.`;
    if (entry.kind === "wardOfTheDeepSave") return `Ward of the Deep pulls ${entry.targetName} back from the edge, restoring them well beyond an ordinary revival.`;
    if (entry.kind === "songStopped") {
      return entry.outOfMana
        ? `${entry.spellName} fades as your mana runs dry.`
        : `You let ${entry.spellName} fade to silence.`;
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
      if (entry.castKind === "cooldownBuff") {
        return `${entry.followerName} calls on ${entry.spellName}, and her strikes burn brighter for a time.`;
      }
      if (entry.castKind === "debuff") {
        return `${entry.followerName} calls on ${entry.spellName}, and their foe falters.`;
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
      return `You call on ${actionName}, restoring ${entry.healAmount} Hit Points.`;
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