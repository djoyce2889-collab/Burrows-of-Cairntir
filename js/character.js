/* ============================================================
   CHARACTER.JS
   ============================================================ */

let playerCharacter = null;
let followers = [];

function getSkillIdForSpellId(spellId) {
  for (const skillId of Object.keys(SPELLS)) {
    if (SPELLS[skillId].some((s) => s.id === spellId)) return skillId;
  }
  return null;
}

function createCharacter(name, raceId, cultureId, startingSkillIds, traitIds, combatStyle, portraitImage, startingSpellIds) {
  const skills = {};
  startingSkillIds.forEach((skillId) => {
    skills[skillId] = { timesUsed: 0 };
  });

  const knownSpells = {};
  (startingSpellIds || []).forEach((spellId) => {
    const skillId = getSkillIdForSpellId(spellId);
    if (!skillId || !startingSkillIds.includes(skillId)) return;
    if (!knownSpells[skillId]) knownSpells[skillId] = [];
    knownSpells[skillId].push(spellId);
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
    activeSpellIds: (startingSpellIds || []).slice(0, 4),
    traits: traitIds.slice(),
    combatStyle: combatStyle || "single",
    portraitImage: portraitImage || null,
    equippedWeaponSkill: startingWeaponId,
    equippedArmorSkill: startingArmorId,
    equippedShield: false,
    equippedOffhandSkill: null,
    inventory: inventory,
    active: true,
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
  let gain = SKILLS[skillId] && SKILLS[skillId].category === "Magic" ? 2 : 1;
  if (character.traits && character.traits.includes("adaptable")) {
    gain += 1;
  }
  return gain;
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
    const allMagicSkillIds = Object.keys(character.skills).filter(
      (id) => SKILLS[id] && SKILLS[id].category === "Magic"
    );
    drivingSkillIds = drivingSkillIds.concat(allMagicSkillIds);
  }

  let tier;

  if (advantageId === "armorClass") {
    const equippedId = character.equippedArmorSkill;
    if (!equippedId || !character.skills[equippedId]) {
      tier = SKILL_TIERS[0];
    } else {
      const rawRank = getTierRankLocal(getCharacterSkillTier(character, equippedId).name);
      const bonus = ARMOR_PROTECTION_RANK_BONUS[equippedId] || 0;
      const craftedBonus = getCraftedItemBonus(character, equippedId);
      const effectiveRank = Math.min(SKILL_TIERS.length - 1, rawRank + bonus + craftedBonus);
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

/**
 * Crafted weapons/armor are genuinely better than starting gear —
 * the better the craftsmanship (Adept/Expert/Master), the bigger
 * the bonus. Checks the character's whole inventory for the best
 * crafted item matching the given skill, regardless of which
 * exact copy is technically "equipped" (since equip is skill-based,
 * not item-based, in this game).
 */
function getCraftedItemBonus(character, skillId) {
  if (!character.inventory || !skillId) return 0;
  const recipe = Object.values(CRAFTING_RECIPES).find((r) => r.linkedSkill === skillId);
  if (!recipe) return 0;

  const tierBonusMap = { Novice: 0, Adept: 1, Expert: 2, Master: 3 };
  let bestBonus = 0;

  character.inventory.forEach((item) => {
    if (item.startsWith(`${recipe.name} (`)) {
      const match = item.match(/\(([A-Za-z]+)-crafted\)/);
      if (match && tierBonusMap[match[1]] !== undefined) {
        bestBonus = Math.max(bestBonus, tierBonusMap[match[1]]);
      }
    }
  });

  return bestBonus;
}

function getAllKnownSpells(character) {
  const result = [];
  Object.keys(character.knownSpells || {}).forEach((skillId) => {
    const ids = character.knownSpells[skillId] || [];
    const allForSkill = SPELLS[skillId] || [];
    ids.forEach((spellId) => {
      const spell = allForSkill.find((s) => s.id === spellId);
      if (spell) result.push({ skillId: skillId, spell: spell });
    });
  });
  return result;
}

function isSpellActive(character, spellId) {
  return !!(character.activeSpellIds && character.activeSpellIds.includes(spellId));
}

function toggleActiveSpell(character, spellId) {
  if (!character.activeSpellIds) character.activeSpellIds = [];
  const idx = character.activeSpellIds.indexOf(spellId);
  if (idx !== -1) {
    character.activeSpellIds.splice(idx, 1);
    return true;
  }
  if (character.activeSpellIds.length >= 4) return false;
  character.activeSpellIds.push(spellId);
  return true;
}

/**
 * Flattens a character's knownSpells object into a simple list
 * of { skillId, spell } pairs, for easy display on a spell
 * management screen.
 */
function getAllKnownSpells(character) {
  const result = [];
  Object.keys(character.knownSpells || {}).forEach((skillId) => {
    const ids = character.knownSpells[skillId] || [];
    const allForSkill = SPELLS[skillId] || [];
    ids.forEach((spellId) => {
      const spell = allForSkill.find((s) => s.id === spellId);
      if (spell) result.push({ skillId: skillId, spell: spell });
    });
  });
  return result;
}

function isSpellActive(character, spellId) {
  return !!(character.activeSpellIds && character.activeSpellIds.includes(spellId));
}

/**
 * Toggles a spell in/out of a character's active loadout.
 * Returns false (and leaves state unchanged) if trying to
 * activate a 5th spell past the cap of 4 — the caller can use
 * that to show a "loadout full" message.
 */
function toggleActiveSpell(character, spellId) {
  if (!character.activeSpellIds) character.activeSpellIds = [];
  const idx = character.activeSpellIds.indexOf(spellId);
  if (idx !== -1) {
    character.activeSpellIds.splice(idx, 1);
    return true;
  }
  if (character.activeSpellIds.length >= 4) return false;
  character.activeSpellIds.push(spellId);
  return true;
}
