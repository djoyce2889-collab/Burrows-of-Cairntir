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

  return bestRank + bonusRank;
}

function getAdaptiveScaling() {
  const powerRank = getPlayerPowerRank();
  return {
    hpMultiplier: 1 + powerRank * 0.3,
    damageMultiplier: 1 + powerRank * 0.12
  };
}

function getEffectRankSum(kind) {
  return currentCombat.activeEffects
    .filter((e) => e.kind === kind)
    .reduce((sum, e) => sum + e.rankBonus, 0);
}

/**
 * Bard songs (Line of Siuloir) are persistent effects — they
 * never expire on their own, but only 2 can play at once.
 */
function getActiveSongCount() {
  return currentCombat.activeEffects.filter((e) => e.source === "song").length;
}

function stopSong(spellName) {
  const idx = currentCombat.activeEffects.findIndex((e) => e.source === "song" && e.spellName === spellName);
  if (idx === -1) return false;
  const effect = currentCombat.activeEffects[idx];
  if (effect.kind === "fortify" && effect.bonusHP) {
    playerCharacter.currentHP = Math.max(0, playerCharacter.currentHP - effect.bonusHP);
  }
  currentCombat.activeEffects.splice(idx, 1);
  currentCombat.log.push({ actor: "effect", kind: "songStopped", spellName: spellName });
  return true;
}

function getPlayerCombatStyleBonus() {
  const style = COMBAT_STYLES[playerCharacter.combatStyle];
  return style || { attackBonus: 0, defenseBonus: 0, spellDamageBonus: 0, healBonus: 0 };
}

function getEffectivePlayerAttackTier(baseTierName) {
  const equipBonus = playerCharacter.weaponEnchantment ? 1 : 0;
  const styleBonus = getPlayerCombatStyleBonus().attackBonus;
  return shiftTierByRank(baseTierName, getEffectRankSum("playerAttackBonus") + equipBonus + styleBonus);
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
  return shiftTierByRank(currentCombat.enemyThreatTier, getEffectRankSum("enemyDebuff"));
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
function getFlatDamageAbsorb(character) {
  let total = 0;
  currentCombat.activeEffects.forEach((e) => {
    if (e.kind === "absorb" && (e.target === "all" || e.target === character)) {
      total += e.reduction;
    }
  });
  return total;
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
function getDefendingTierName(attackType, character) {
  if (attackType === "magic") {
    return getAdvantageTier(character, "magicResistance").name;
  }

  let acTierName = getAdvantageTier(character, "armorClass").name;
  let dodgeTierName = getAdvantageTier(character, "dodge").name;

  if (character === playerCharacter) {
    const equipBonus = getArmorEnchantDefenseBonus();
    const styleBonus = getPlayerCombatStyleBonus().defenseBonus;
    const generalBonus = getEffectRankSum("playerDefenseBonus") + equipBonus + styleBonus;
    acTierName = shiftTierByRank(acTierName, generalBonus + getEffectRankSum("acBuff"));
    dodgeTierName = shiftTierByRank(dodgeTierName, generalBonus + getEffectRankSum("dodgeBuff"));
  }

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
    log: [],
    result: null
  };

  return currentCombat;
}

function tickCombatEffects() {
  currentCombat.activeEffects.forEach((effect) => {
    if (effect.kind === "dot") {
      const dmg = Math.max(1, Math.floor(rollDamage(effect.casterTierName) / 2));
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - dmg);
      currentCombat.log.push({ actor: "effect", kind: "dot", damage: dmg });
    } else if (effect.kind === "companion") {
      const heavyTier = shiftTierByRank(effect.casterTierName || "Novice", 2);
      const dmg = rollDamage(heavyTier);
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - dmg);
      currentCombat.log.push({ actor: "effect", kind: "companion", damage: dmg });
    } else if (effect.kind === "hot") {
      const healAmt = Math.max(1, Math.floor(rollDamage(effect.casterTierName || "Novice") / 2));
      const maxHP = getHitPoints(playerCharacter);
      playerCharacter.currentHP = Math.min(maxHP, playerCharacter.currentHP + healAmt);
      currentCombat.log.push({ actor: "effect", kind: "hot", healAmount: healAmt });
    } else if (effect.kind === "manaRegen") {
      const manaMax = getManaPoolMax(playerCharacter);
      const before = playerCharacter.currentMana;
      playerCharacter.currentMana = Math.min(manaMax, playerCharacter.currentMana + 8);
      const actualGain = playerCharacter.currentMana - before;
      if (actualGain > 0) {
        currentCombat.log.push({ actor: "effect", kind: "manaRegen", manaAmount: actualGain });
      }
    }
  });

  currentCombat.activeEffects = currentCombat.activeEffects.filter((effect) => {
    if (effect.roundsRemaining === null) return true;
    effect.roundsRemaining -= 1;
    if (effect.roundsRemaining <= 0) {
      if (effect.kind === "fortify" && effect.bonusHP) {
        playerCharacter.currentHP = Math.max(0, playerCharacter.currentHP - effect.bonusHP);
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

    const pick = getFollowerAttackPick(follower);
    useSkill(follower, pick.skillId);

    const hasGuaranteedFollowerAction = consumeGuaranteedEffect("guaranteedFollowerAction");
    const hit = hasGuaranteedFollowerAction || rollSuccess(pick.tierName, getEffectiveEnemyTier());
    let damage = 0;
    if (hit) {
      damage = rollDamage(pick.tierName);
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
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

  if (effect.procType === "deflect") {
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "deflect" });
    return true;
  }
  if (effect.procType === "counterBurn") {
    const burnDmg = Math.max(1, Math.floor(rollDamage("Novice") / 2));
    currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - burnDmg);
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "counterBurn", damage: burnDmg });
  } else if (effect.procType === "chill") {
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: 2 });
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "chill" });
  } else if (effect.procType === "counterCurse") {
    currentCombat.activeEffects.push({ kind: "dot", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION, casterTierName: "Novice" });
    currentCombat.log.push({ actor: "effect", kind: "enchantProc", procType: "counterCurse" });
  }
  return false;
}

function resolveEnemyAttack() {
  tickCombatEffects();
  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return;
  }

  const isStunned = currentCombat.activeEffects.some((e) => e.kind === "stun");
  const isVisionStunned = consumeGuaranteedEffect("guaranteedStun");
  if (isStunned || isVisionStunned) {
    currentCombat.playerDefending = false;
    currentCombat.log.push({ actor: "effect", kind: "stunned" });
    return;
  }

  const isFeared = currentCombat.activeEffects.some((e) => e.kind === "fear");
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
  const enemyEffectiveTier = getEffectiveEnemyTier();
  const defenderTier = getDefendingTierName(attackType, target);
  const adjustment = isPlayerTarget && currentCombat.playerDefending ? -DEFEND_SUCCESS_PENALTY : 0;

  const targetHasGuaranteedDodge = isPlayerTarget && currentCombat.activeEffects.some((e) => e.kind === "guaranteedDodge");
  const hit = targetHasGuaranteedDodge ? (consumeGuaranteedEffect("guaranteedDodge") ? false : rollSuccess(enemyEffectiveTier, defenderTier, adjustment)) : rollSuccess(enemyEffectiveTier, defenderTier, adjustment);
  let damage = 0;
  let deflected = false;

  if (hit && isPlayerTarget) {
    deflected = tryArmorEnchantProc(enemyEffectiveTier);
  }

  let backfired = false;
  if (hit && !deflected && isPlayerTarget) {
    const hasIllFortune = currentCombat.activeEffects.some((e) => e.kind === "curseBack");
    if (hasIllFortune && Math.random() < 0.35) {
      backfired = true;
    }
  }

  if (hit && !deflected && !backfired) {
    damage = Math.max(
      1,
      Math.round(rollDamage(enemyEffectiveTier) * diff.enemyDamageMultiplier * adaptive.damageMultiplier)
    );
    const absorbed = getFlatDamageAbsorb(target);
    if (absorbed > 0) {
      damage = Math.max(0, damage - absorbed);
    }
    target.currentHP = Math.max(0, target.currentHP - damage);
  } else if (backfired) {
    damage = Math.max(
      1,
      Math.round(rollDamage(enemyEffectiveTier) * diff.enemyDamageMultiplier)
    );
    currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
  }

  currentCombat.playerDefending = false;
  currentCombat.log.push({
    actor: "enemy",
    hit: hit && !deflected && !backfired,
    backfired: backfired,
    damage: damage,
    isPlayerTarget: isPlayerTarget,
    targetName: isPlayerTarget ? playerCharacter.name : target.name
  });

  if (hit && !deflected && isPlayerTarget) {
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

function performPlayerAction(skillId) {
  if (!currentCombat || currentCombat.result) return currentCombat;

  const tierBefore = getCharacterSkillTier(playerCharacter, skillId).name;
  useSkill(playerCharacter, skillId);

  const attackTier = getEffectivePlayerAttackTier(tierBefore);
  const enemyTier = getEffectiveEnemyTier();
  const hasGuaranteedHit = consumeGuaranteedEffect("guaranteedHit");
  const hit = hasGuaranteedHit || rollSuccess(attackTier, enemyTier);
  let damage = 0;

  if (hit) {
    damage = rollDamage(attackTier);
    currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
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
    const enemyTier = getEffectiveEnemyTier();
    const hasGuaranteedSpellHit = consumeGuaranteedEffect("guaranteedSpellHit");
    const hit = hasGuaranteedSpellHit || rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = rollDamage(attackTier);
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
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
      damage = Math.round(damage * executeMultiplier);
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
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
      spellName: spell.name
    });
  } else if (spell.type === "guard") {
    currentCombat.activeEffects.push({ kind: "playerDefenseBonus", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "debuff") {
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "dot") {
    currentCombat.activeEffects.push({
      kind: "dot",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      casterTierName: tierBefore,
      source: isSong ? "song" : undefined,
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
      damage = rollDamage(attackTier);
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "thornward") {
    currentCombat.activeEffects.push({ kind: "thornward", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "fortify") {
    const bonusAmount = rollDamage(tierBefore);
    playerCharacter.currentHP += bonusAmount;
    currentCombat.activeEffects.push({
      kind: "fortify",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      bonusHP: bonusAmount,
      source: isSong ? "song" : undefined,
      spellName: spell.name
    });
    logEntry.healAmount = bonusAmount;
  } else if (spell.type === "hot") {
    currentCombat.activeEffects.push({
      kind: "hot",
      rankBonus: 0,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      casterTierName: tierBefore,
      source: isSong ? "song" : undefined,
      spellName: spell.name
    });
  } else if (spell.type === "spellDamageBuff") {
    currentCombat.activeEffects.push({
      kind: "spellDamageBuff",
      rankBonus: 1,
      roundsRemaining: isSong ? null : SPELL_EFFECT_DURATION,
      source: isSong ? "song" : undefined,
      spellName: spell.name
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
  const success = rollSuccess(dodgeTier, currentCombat.enemyThreatTier);
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
  loot.forEach((itemName) => playerCharacter.inventory.push(itemName));
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
    if (e.source === "song") return `${e.spellName} playing`;
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
    if (e.kind === "manaRegen") return "Mana regenerating";
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
    if (entry.kind === "dot") return `The lingering curse bites again for ${entry.damage} harm.`;
    if (entry.kind === "companion") return `Your companion strikes for ${entry.damage} harm.`;
    if (entry.kind === "downed") return `${entry.name} is knocked out of the fight!`;
    if (entry.kind === "feared") return `${currentCombat.enemyName} freezes, too shaken by fear to strike.`;
    if (entry.kind === "stunned") return `${currentCombat.enemyName} is still reeling, knocked off balance and unable to act.`;
    if (entry.kind === "hot") return `Nature's Bounty mends you further, restoring ${entry.healAmount} Hit Points.`;
    if (entry.kind === "thornProc") return `Your thorns lash back at ${currentCombat.enemyName} for ${entry.damage}.`;
    if (entry.kind === "manaRegen") return `The song's melody restores ${entry.manaAmount} mana.`;
    if (entry.kind === "songStopped") return `You let ${entry.spellName} fade to silence.`;
    if (entry.kind === "enchantProc") {
      if (entry.procType === "deflect") return "Your Storm-enchanted armor crackles and deflects the blow entirely!";
      if (entry.procType === "counterBurn") return `Your Flame-enchanted armor sears back, burning your foe for ${entry.damage}.`;
      if (entry.procType === "chill") return "Your Frost-enchanted armor bites back, chilling your foe's next strike.";
      if (entry.procType === "counterCurse") return "Your Curse-enchanted armor lashes back with a lingering hex.";
      return "";
    }
    return "";
  }

  if (entry.actor === "follower") {
    if (entry.action === "heal") {
      return `${entry.followerName} calls on healing magic, restoring ${entry.healAmount} Hit Points to ${entry.targetName}.`;
    }
    return entry.hit
      ? `${entry.followerName} strikes and lands a hit for ${entry.damage}.`
      : `${entry.followerName} strikes, but misses.`;
  }

  if (entry.actor === "player") {
    if (entry.action === "defend") {
      return "You brace yourself, ready to turn aside the next blow.";
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