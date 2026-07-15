/* ============================================================
   COMBAT.JS
   ------------------------------------------------------------
   Enemies now target a random living party member each round —
   you or any follower — instead of always going after you.
   Followers with a healing spell will automatically heal
   whoever's hurt worse (themselves or you) instead of attacking,
   when someone drops below 60% HP. A follower reduced to 0 HP
   is "downed" for the rest of that fight, but recovers fully
   once you're back at Homebase.
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

function getEffectRankSum(kind) {
  return currentCombat.activeEffects
    .filter((e) => e.kind === kind)
    .reduce((sum, e) => sum + e.rankBonus, 0);
}

function getEffectivePlayerAttackTier(baseTierName) {
  return shiftTierByRank(baseTierName, getEffectRankSum("playerAttackBonus"));
}

function getEffectiveEnemyTier() {
  return shiftTierByRank(currentCombat.enemyThreatTier, getEffectRankSum("enemyDebuff"));
}

/**
 * Works for the player OR a follower. The player's own "guard"
 * buff (from Runes of the Shield etc.) only applies when the
 * player themselves is the target — it's a personal ward, not a
 * party-wide one.
 */
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
    return shiftTierByRank(baseTierName, getEffectRankSum("playerDefenseBonus"));
  }
  return baseTierName;
}

function startCombat(enemyId) {
  const enemyTemplate = ENEMIES[enemyId];
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
    enemyMaxHP: enemyTemplate.hitPoints,
    enemyCurrentHP: enemyTemplate.hitPoints,
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

/**
 * Picks a random living party member (player or a follower who
 * isn't downed) for the enemy to attack this round.
 */
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

/**
 * Finds a known "heal" spell among a follower's trained magic
 * lines, if they have one. Returns { skillId, spell } or null.
 */
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

/**
 * Runs each follower's turn: heal (self or the player, whoever
 * needs it more) if they know a heal spell and someone's hurt,
 * otherwise attack normally. Downed followers (0 HP) do nothing.
 */
function performFollowersTurn() {
  if (!followers || followers.length === 0) return;

  followers.forEach((follower) => {
    if (currentCombat.enemyCurrentHP <= 0) return;
    if (follower.currentHP <= 0) return; // downed, can't act

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

function resolveEnemyAttack() {
  tickCombatEffects();
  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return;
  }

  const target = pickEnemyTarget();
  const isPlayerTarget = target === playerCharacter;
  const attackType = currentCombat.enemyAttackType;
  const enemyEffectiveTier = getEffectiveEnemyTier();
  const defenderTier = getDefendingTierName(attackType, target);
  const adjustment = isPlayerTarget && currentCombat.playerDefending ? -DEFEND_SUCCESS_PENALTY : 0;

  const hit = rollSuccess(enemyEffectiveTier, defenderTier, adjustment);
  let damage = 0;

  if (hit) {
    damage = rollDamage(enemyEffectiveTier);
    target.currentHP = Math.max(0, target.currentHP - damage);
  }

  currentCombat.playerDefending = false;
  currentCombat.log.push({
    actor: "enemy",
    hit: hit,
    damage: damage,
    isPlayerTarget: isPlayerTarget,
    targetName: isPlayerTarget ? playerCharacter.name : target.name
  });

  if (hit && !isPlayerTarget && target.currentHP <= 0) {
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
    return entry.hit
      ? `You strike with your ${actionName} and land a solid hit.`
      : `You strike with your ${actionName}, but the blow goes wide.`;
  }

  const targetLabel = entry.isPlayerTarget ? "you" : entry.targetName;
  return entry.hit
    ? `${currentCombat.enemyName} strikes at ${targetLabel} and lands a hit.`
    : `${currentCombat.enemyName} strikes at ${targetLabel}, but misses.`;
}

function describeRecentRound() {
  if (!currentCombat || currentCombat.log.length === 0) return "";
  const windowSize = followers.length + 4; // player + each follower + effects + enemy
  const recent = currentCombat.log.slice(-windowSize);
  return recent.map(describeLogEntry).filter(Boolean).join(" ");
}
