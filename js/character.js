/* ============================================================
   CHARACTER.JS
   ============================================================ */

let playerCharacter = null;
let followers = [];

function createCharacter(name, raceId, cultureId, startingSkillIds, traitIds, combatStyle, portraitImage) {
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

  const startingWeaponId = startingSkillIds.find(
    (id) => SKILLS[id] && SKILLS[id].category === "Weapon"
  ) || "unarmedCombat";
  const startingArmorId = startingSkillIds.find(
    (id) => SKILLS[id] && SKILLS[id].category === "Armor"
  ) || null;

  const character = {
    name: name,
    raceId: raceId,
    cultureId: cultureId,
    skills: skills,
    knownSpells: knownSpells,
    traits: traitIds.slice(),
    combatStyle: combatStyle || "single",
    portraitImage: portraitImage || null,
    equippedWeaponSkill: startingWeaponId,
    equippedArmorSkill: startingArmorId,
    inventory: inventory,
    flags: {}
  };

  character.currentMana = getManaPoolMax(character);

  return character;
}

function setEquippedWeapon(character, skillId) {
  character.equippedWeaponSkill = skillId;
}

function setEquippedArmor(character, skillId) {
  character.equippedArmorSkill = skillId;
}

function learnNewSkill(character, skillId) {
  if (!SKILLS[skillId]) return false;
  if (character.skills[skillId]) return false;

  character.skills[skillId] = { timesUsed: 0 };

  if (SKILLS[skillId].category === "Weapon" && !character.equippedWeaponSkill) {
    character.equippedWeaponSkill = skillId;
  }
  if (SKILLS[skillId].category === "Armor" && !character.equippedArmorSkill) {
    character.equippedArmorSkill = skillId;
  }

  return true;
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

/**
 * Skills matching the character's own culture (their culture's
 * magic line) now gain progress a bit faster on every single use
 * — not just a one-time head start — reflecting that it comes
 * more naturally to them throughout the whole game. Non-matching
 * skills, and anyone without a culture set, gain progress at the
 * normal +1 rate.
 */
function getSkillUseGain(character, skillId) {
  const culture = CULTURES[character.cultureId];
  if (culture && culture.magicSkillIds && culture.magicSkillIds.includes(skillId)) {
    return 2;
  }
  return 1;
}

function useSkill(character, skillId) {
  if (!character) return null;

  if (!character.skills[skillId]) {
    character.skills[skillId] = { timesUsed: 0 };
  }

  const skill = character.skills[skillId];
  const tierBefore = getSkillTier(skill.timesUsed);
  skill.timesUsed += getSkillUseGain(character, skillId);
  const tierAfter = getSkillTier(skill.timesUsed);

  return {
    skillId: skillId,
    timesUsed: skill.timesUsed,
    tier: tierAfter,
    tierJustIncreased: tierAfter.name !== tierBefore.name
  };
}

function getAvailableStartingSkills(cultureId) {
  return Object.values(SKILLS);
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
    const equippedId = character.equippedArmorSkill;
    if (!equippedId || !character.skills[equippedId]) {
      tier = SKILL_TIERS[0];
    } else {
      const rawRank = getTierRankLocal(getCharacterSkillTier(character, equippedId).name);
      const bonus = ARMOR_PROTECTION_RANK_BONUS[equippedId] || 0;
      const effectiveRank = Math.min(SKILL_TIERS.length - 1, rawRank + bonus);
      tier = SKILL_TIERS[effectiveRank];
    }
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

/**
 * Now also adds any flat mana bonus from traits (currently just
 * Deep Well, +15) on top of the normal tier-based pool.
 */
function getManaPoolMax(character) {
  const magicSkillIds = Object.keys(character.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Magic"
  );

  let base = 0;
  if (magicSkillIds.length > 0) {
    const bestTier = getHighestTierAmong(character, magicSkillIds);
    base = MANA_CONFIG.base + (MANA_CONFIG.tierBonus[bestTier.name] || 0);
  }

  let traitBonus = 0;
  if (character.traits) {
    character.traits.forEach((traitId) => {
      if (TRAIT_MANA_BONUS[traitId]) {
        traitBonus += TRAIT_MANA_BONUS[traitId];
      }
    });
  }

  if (base === 0 && traitBonus === 0) return 0;
  return base + traitBonus;
}

function refillMana(character) {
  character.currentMana = getManaPoolMax(character);
}
