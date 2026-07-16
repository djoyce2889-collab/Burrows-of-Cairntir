/* ============================================================
   COMBAT.JS
   ============================================================ */

let currentCombat = null;

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

function getEffectRankSum(kind) {
  return currentCombat.activeEffects
    .filter((e) => e.kind === kind)
    .reduce((sum, e) => sum + e.rankBonus, 0);
}

function getPlayerCombatStyleBonus() {
  const style = COMBAT_STYLES[playerCharacter.combatStyle];
  return style || { attackBonus: 0, defenseBonus: 0 };
}

function getEffectivePlayerAttackTier(baseTierName) {
  const equipBonus = playerCharacter.weaponEnchantment ? 1 : 0;
  const styleBonus = getPlayerCombatStyleBonus().attackBonus;
  return shiftTierByRank(baseTierName, getEffectRankSum("playerAttackBonus") + equipBonus + styleBonus);
}

function getEffectiveEnemyTier() {
  return shiftTierByRank(currentCombat.enemyThreatTier, getEffectRankSum("enemyDebuff"));
}

function getArmorEnchantDefenseBonus() {
  if (!playerCharacter.armorEnchantment) return 0;
  const effect = ARMOR_ENCHANT_EFFECTS[playerCharacter.armorEnchantment.type];
  return effect ? effect.defenseBonus : 0;
}

function getDefendingTierName(attackType, character) {
  let baseTierName;
  if (attackType === "magic") {
    baseTierName = getAdvantageTier(character, "magicResistance").name;
  } else {
    const acTier = getAdvantageTier(character, "armorClass");
    const dodgeTier = getAdvantageTier(character, "dodge");
    baseTierName = acTier.min >= dodgeTier.min ? acTier.name : dodgeTier.name;
  }
  if (character === playerCharacter) {
    const equipBonus = getArmorEnchantDefenseBonus();
    const styleBonus = getPlayerCombatStyleBonus().defenseBonus;
    return shiftTierByRank(baseTierName, getEffectRankSum("playerDefenseBonus") + equipBonus + styleBonus);
  }
  return baseTierName;
}

function startCombat(enemyId) {
  const enemyTemplate = ENEMIES[enemyId];
  const diff = getCurrentDifficultySettings();
  const scaledMaxHP = Math.max(1, Math.round(enemyTemplate.hitPoints * diff.enemyHpMultiplier));

  const maxHP = getHitPoints(playerCharacter);
  if (playerCharacter.currentHP === undefined || playerCharacter.currentHP === null) {
    playerCharacter.currentHP = maxHP;
  } else if (playerCharacter.currentHP > maxHP) {
    playerCharacter.currentHP = maxHP;
  }

  followers.forEach((follower) => {
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

  currentCombat = {
    enemyId: enemyId,
    enemyName: enemyTemplate.name,
    enemyDescription: enemyTemplate.description,
    enemyMaxHP: scaledMaxHP,
    enemyCurrentHP: scaledMaxHP,
    enemyThreatTier: enemyTemplate.threatTier,
    enemyAttackType: enemyTemplate.attackType,
    playerDefending: false,
    activeEffects: [],
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
      const dmg = rollDamage("Novice");
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - dmg);
      currentCombat.log.push({ actor: "effect", kind: "companion", damage: dmg });
    }
  });

  currentCombat.activeEffects = currentCombat.activeEffects.filter((effect) => {
    if (effect.roundsRemaining === null) return true;
    effect.roundsRemaining -= 1;
    return effect.roundsRemaining > 0;
  });
}

function pickEnemyTarget() {
  const candidates = [playerCharacter];
  followers.forEach((f) => {
    if (f.currentHP > 0) candidates.push(f);
  });
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getFollowerAttackPick(follower) {
  const weaponSkillIds = Object.keys(follower.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Weapon"
  );

  if (weaponSkillIds.length === 0) {
    return { skillId: "unarmedCombat", tierName: getCharacterSkillTier(follower, "unarmedCombat").name };
  }

  let bestSkillId = weaponSkillIds[0];
  let bestTier = getCharacterSkillTier(follower, bestSkillId);
  weaponSkillIds.forEach((id) => {
    const t = getCharacterSkillTier(follower, id);
    if (t.min > bestTier.min) {
      bestTier = t;
      bestSkillId = id;
    }
  });

  return { skillId: bestSkillId, tierName: bestTier.name };
}

function getFollowerHealOption(follower) {
  const magicSkillIds = Object.keys(follower.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );
  for (const skillId of magicSkillIds) {
    const known = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    const allSpells = SPELLS[skillId] || [];
    const healSpell = allSpells.find((s) => s.type === "heal" && known.includes(s.id));
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
  if (!followers || followers.length === 0) return;

  followers.forEach((follower) => {
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

    const hit = rollSuccess(pick.tierName, getEffectiveEnemyTier());
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

  const diff = getCurrentDifficultySettings();
  const target = pickEnemyTarget();
  const isPlayerTarget = target === playerCharacter;
  const attackType = currentCombat.enemyAttackType;
  const enemyEffectiveTier = getEffectiveEnemyTier();
  const defenderTier = getDefendingTierName(attackType, target);
  const adjustment = isPlayerTarget && currentCombat.playerDefending ? -DEFEND_SUCCESS_PENALTY : 0;

  const hit = rollSuccess(enemyEffectiveTier, defenderTier, adjustment);
  let damage = 0;
  let deflected = false;

  if (hit && isPlayerTarget) {
    deflected = tryArmorEnchantProc(enemyEffectiveTier);
  }

  if (hit && !deflected) {
    damage = Math.max(1, Math.round(rollDamage(enemyEffectiveTier) * diff.enemyDamageMultiplier));
    target.currentHP = Math.max(0, target.currentHP - damage);
  }

  currentCombat.playerDefending = false;
  currentCombat.log.push({
    actor: "enemy",
    hit: hit && !deflected,
    damage: damage,
    isPlayerTarget: isPlayerTarget,
    targetName: isPlayerTarget ? playerCharacter.name : target.name
  });

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
  const hit = rollSuccess(attackTier, enemyTier);
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
    const attackTier = getEffectivePlayerAttackTier(tierBefore);
    const enemyTier = getEffectiveEnemyTier();
    const hit = rollSuccess(attackTier, enemyTier);
    let damage = 0;
    if (hit) {
      damage = rollDamage(attackTier);
      currentCombat.enemyCurrentHP = Math.max(0, currentCombat.enemyCurrentHP - damage);
    }
    logEntry.hit = hit;
    logEntry.damage = damage;
  } else if (spell.type === "heal") {
    const healAmount = rollDamage(tierBefore);
    const maxHP = getHitPoints(playerCharacter);
    playerCharacter.currentHP = Math.min(maxHP, playerCharacter.currentHP + healAmount);
    logEntry.healAmount = healAmount;
  } else if (spell.type === "enchant" || spell.type === "buff") {
    currentCombat.activeEffects.push({ kind: "playerAttackBonus", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "guard") {
    currentCombat.activeEffects.push({ kind: "playerDefenseBonus", rankBonus: 1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "debuff") {
    currentCombat.activeEffects.push({ kind: "enemyDebuff", rankBonus: -1, roundsRemaining: SPELL_EFFECT_DURATION });
  } else if (spell.type === "dot") {
    currentCombat.activeEffects.push({ kind: "dot", rankBonus: 0, roundsRemaining: SPELL_EFFECT_DURATION, casterTierName: tierBefore });
  } else if (spell.type === "companion") {
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
    if (e.kind === "playerAttackBonus") return `Empowered strikes (${e.roundsRemaining} rounds left)`;
    if (e.kind === "playerDefenseBonus") return `Braced defense (${e.roundsRemaining} rounds left)`;
    if (e.kind === "enemyDebuff") return `Foe weakened (${e.roundsRemaining} rounds left)`;
    if (e.kind === "dot") return `Curse lingers (${e.roundsRemaining} rounds left)`;
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
    if (entry.spellType === "companion") {
      return `You call on ${actionName}, and a beast answers your call.`;
    }

    if (entry.spellName) {
      return entry.hit
        ? `You call on ${actionName} and land a solid hit.`
        : `You call on ${actionName}, but it goes wide.`;
    }

    if (playerCharacter.weaponEnchantment) {
      const enchantType = ENCHANTMENT_TYPES[playerCharacter.weaponEnchantment.type];
      const flavor = enchantType ? enchantType.name : "";
      return entry.hit
        ? `You strike with your ${flavor}-enchanted ${actionName}, and land a solid hit.`
        : `You strike with your ${flavor}-enchanted ${actionName}, but the blow goes wide.`;
    }

    return entry.hit
      ? `You strike with your ${actionName} and land a solid hit.`
      : `You strike with your ${actionName}, but the blow goes wide.`;
  }

  const targetLabel = entry.isPlayerTarget ? "you" : entry.targetName;

  if (entry.isPlayerTarget && !entry.hit && playerCharacter.armorEnchantment) {
    const enchantType = ENCHANTMENT_TYPES[playerCharacter.armorEnchantment.type];
    const flavor = enchantType ? enchantType.name : "";
    return `${currentCombat.enemyName} strikes at you, but your ${flavor}-enchanted armor turns the blow aside.`;
  }

  return entry.hit
    ? `${currentCombat.enemyName} strikes at ${targetLabel} and lands a hit.`
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