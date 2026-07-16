/* ============================================================
   CHARACTER.JS
   ============================================================ */

let playerCharacter = null;
let followers = [];

function createCharacter(name, raceId, cultureId, startingSkillIds, traitIds, combatStyle) {
  const skills = {};
  startingSkillIds.forEach((skillId) => {
    skills[skillId] = { timesUsed: 0 };
  });

  const knownSpells = {};
  startingSkillIds.forEach((skillId) => {
    if (SKILLS[skillId] && SKILLS[skillId].category === "Magic" && SPELLS[skillId]) {
      const allSpells = SPELLS[skillId];
      const starter = allSpells[Math.floor(Math.random() * allSpells.length)];
      knownSpells[skillId] = [starter.id];
    }
  });

  const inventory = [];
  startingSkillIds.forEach((skillId) => {
    if (STARTING_EQUIPMENT[skillId]) {
      inventory.push(STARTING_EQUIPMENT[skillId]);
    }
  });

  const character = {
    name: name,
    raceId: raceId,
    cultureId: cultureId,
    skills: skills,
    knownSpells: knownSpells,
    traits: traitIds.slice(),
    combatStyle: combatStyle || "single",
    inventory: inventory,
    flags: {}
  };

  character.currentMana = getManaPoolMax(character);

  return character;
}

function getSkillTier(timesUsed) {
  let currentTier = SKILL_TIERS[0];
  for (let i = 0; i < SKILL_TIERS.length; i++) {
    if (timesUsed >= SKILL_TIERS[i].min) {
      currentTier = SKILL_TIERS[i];
    }
  }
  return currentTier;
}

function getTierRankLocal(tierName) {
  return SKILL_TIERS.findIndex((t) => t.name === tierName);
}

function discoverSpell(character, skillId, spellId) {
  if (!character.skills[skillId]) return null;
  const allSpells = SPELLS[skillId];
  if (!allSpells) return null;
  const spell = allSpells.find((s) => s.id === spellId);
  if (!spell) return null;

  if (!character.knownSpells) character.knownSpells = {};
  if (!character.knownSpells[skillId]) character.knownSpells[skillId] = [];

  if (character.knownSpells[skillId].includes(spellId)) return null;
  character.knownSpells[skillId].push(spellId);
  return spell;
}

function useSkill(character, skillId) {
  if (!character) return null;

  if (!character.skills[skillId]) {
    character.skills[skillId] = { timesUsed: 0 };
  }

  const skill = character.skills[skillId];
  const tierBefore = getSkillTier(skill.timesUsed);
  skill.timesUsed += 1;
  const tierAfter = getSkillTier(skill.timesUsed);

  return {
    skillId: skillId,
    timesUsed: skill.timesUsed,
    tier: tierAfter,
    tierJustIncreased: tierAfter.name !== tierBefore.name
  };
}

function getAvailableStartingSkills(cultureId) {
  return Object.values(SKILLS).filter((skill) => {
    if (!skill.cultureLocked) return true;
    return skill.cultureLocked === cultureId;
  });
}

function getCharacterSkillTier(character, skillId) {
  const skill = character.skills[skillId];
  const timesUsed = skill ? skill.timesUsed : 0;
  return getSkillTier(timesUsed);
}

function getHighestTierAmong(character, skillIds) {
  let best = SKILL_TIERS[0];
  skillIds.forEach((skillId) => {
    const tier = getCharacterSkillTier(character, skillId);
    if (tier.min > best.min) {
      best = tier;
    }
  });
  return best;
}

function getAdvantageTier(character, advantageId) {
  const advantage = ADVANTAGES[advantageId];
  let drivingSkillIds = advantage.drivenBy.slice();

  if (advantageId === "magicResistance") {
    const culture = CULTURES[character.cultureId];
    drivingSkillIds = drivingSkillIds.concat(culture.magicSkillIds);
  }

  let tier;

  if (advantageId === "armorClass") {
    let bestRank = -1;
    drivingSkillIds.forEach((skillId) => {
      if (!character.skills[skillId]) return;
      const rawRank = getTierRankLocal(getCharacterSkillTier(character, skillId).name);
      const bonus = ARMOR_PROTECTION_RANK_BONUS[skillId] || 0;
      const effectiveRank = Math.min(SKILL_TIERS.length - 1, rawRank + bonus);
      if (effectiveRank > bestRank) bestRank = effectiveRank;
    });
    tier = bestRank === -1 ? SKILL_TIERS[0] : SKILL_TIERS[bestRank];
  } else {
    tier = getHighestTierAmong(character, drivingSkillIds);
  }

  if (advantageId === "dodge" && character.traits && character.traits.includes("quickfooted")) {
    const boostedRank = Math.min(SKILL_TIERS.length - 1, getTierRankLocal(tier.name) + 1);
    tier = SKILL_TIERS[boostedRank];
  }

  return tier;
}

function getHitPoints(character) {
  const hpAdvantage = ADVANTAGES.hitPoints;
  const survivalTier = getHighestTierAmong(character, hpAdvantage.drivenBy);
  const bonus = hpAdvantage.tierBonus[survivalTier.name] || 0;
  return hpAdvantage.base + bonus;
}

function getManaPoolMax(character) {
  const magicSkillIds = Object.keys(character.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );
  if (magicSkillIds.length === 0) return 0;

  const bestTier = getHighestTierAmong(character, magicSkillIds);
  const bonus = MANA_CONFIG.tierBonus[bestTier.name] || 0;
  return MANA_CONFIG.base + bonus;
}

function refillMana(character) {
  character.currentMana = getManaPoolMax(character);
}
