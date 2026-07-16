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

/**
 * Changes which weapon skill a character fights with. Only ever
 * called from the Inventory screen, which is only reachable from
 * Homebase — so this naturally can't happen mid-dungeon.
 */
function setEquippedWeapon(character, skillId) {
  character.equippedWeaponSkill = skillId;
}

/**
 * Changes which armor skill a character defends with. Same
 * Homebase-only restriction as the weapon slot.
 */
function setEquippedArmor(character, skillId) {
  character.equippedArmorSkill = skillId;
}

/**
 * Grants a character an entirely new skill they didn't start
 * with (used by dungeon "learnSkill" discoveries), starting at
 * Untrained. Does nothing if they already have it. If it's a
 * Weapon or Armor skill and the character has no equipped item
 * of that kind yet, auto-equips it so it's immediately usable.
 */
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

/**
 * Armor Class is now driven by whichever single armor skill is
 * currently EQUIPPED (see equippedArmorSkill), not the best of
 * everything trained — so carrying both Plate and Chain no
 * longer silently gives you the better of the two for free.
 */
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
