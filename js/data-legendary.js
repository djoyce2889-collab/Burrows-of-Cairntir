/* ============================================================
   DATA-LEGENDARY.JS
   Arena-earned legendary items. Offered once per character, on
   Hard difficulty, after ARENA_LEGENDARY_DEFEAT_THRESHOLD falls
   in a single Training Grounds session. Which item is offered is
   based on whichever of the 6 linked magic skills the player has
   trained furthest (highest timesUsed). Each item is a unique,
   non-stacking effect — not a stat/tier upgrade — checked directly
   by name in combat.js rather than through the crafted-item
   tier-bonus system.
   ------------------------------------------------------------ */

const ARENA_LEGENDARY_DEFEAT_THRESHOLD = 10;

const LEGENDARY_ARENA_ITEMS = {
  ancestralAverick: {
    itemName: "Averick's Reckoning",
    skillId: "ancestralAverick",
    cultureId: "deveran",
    description: "For the rest of any fight, your buffed weapon ignores a portion of the enemy's defense outright.",
  },
  runeCurse: {
    itemName: "Kolgrim's Brand",
    skillId: "runeCurse",
    cultureId: "drakvarr",
    description: "Any curse you land never expires on its own — it lasts until the enemy dies.",
  },
  runeBlade: {
    itemName: "Ivarr's Grudge",
    skillId: "runeBlade",
    cultureId: "drakvarr",
    description: "Consecutive hits against the same enemy build momentum, each one landing a little harder than the last.",
  },
  pathStorm: {
    itemName: "Neasa's Unbroken Sky",
    skillId: "pathStorm",
    cultureId: "gaeldrim",
    description: "Your storm spells can never be dodged or deflected.",
  },
  wayTengu: {
    itemName: "Kurogane's Perfect Step",
    skillId: "wayTengu",
    cultureId: "yorenshi",
    description: "Your first attack each fight cannot miss and cannot be countered.",
  },
  riteUnmaking: {
    itemName: "Kwabena's Undoing",
    skillId: "riteUnmaking",
    cultureId: "vandiri",
    description: "Your unmaking spells ignore enemy resistances and immunities entirely.",
  }
};

/**
 * Returns the legendary item tied to whichever of the 6 eligible
 * magic skills the character has trained furthest (highest
 * timesUsed). Returns null if the character has none of the 6
 * skills trained at all.
 */
function getEligibleLegendaryFor(character) {
  let best = null;
  let bestUsed = -1;
  Object.keys(LEGENDARY_ARENA_ITEMS).forEach((skillId) => {
    const skill = character.skills[skillId];
    if (skill && skill.timesUsed > bestUsed) {
      bestUsed = skill.timesUsed;
      best = LEGENDARY_ARENA_ITEMS[skillId];
    }
  });
  return best;
}

function characterHasLegendary(character, itemName) {
  return !!(character.inventory && character.inventory.includes(itemName));
}
