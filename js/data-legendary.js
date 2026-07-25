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
  },
  ancestralEmyrs: {
    itemName: "Emyrs's Unbroken Ward",
    skillId: "ancestralEmyrs",
    cultureId: "deveran",
    description: "Your first ward each fight can't be dispelled or overwritten by anything, friendly or hostile, for its full duration.",
  },
  ancestralSiuloir: {
    itemName: "Siuloir's Undying Verse",
    skillId: "ancestralSiuloir",
    cultureId: "deveran",
    description: "Your songs no longer count against the active-song cap — you can keep every song running at once.",
  },
  ancestralFetch: {
    itemName: "Fraser's Second Skin",
    skillId: "ancestralFetch",
    cultureId: "deveran",
    description: "Your Fetch form no longer has a countdown — once transformed, you stay transformed until you choose to change back or the fight ends.",
  },
  runeVision: {
    itemName: "Sigrun's Foresight",
    skillId: "runeVision",
    cultureId: "drakvarr",
    description: "You always see the enemy's next intended action before choosing yours.",
  },
  pathWild: {
    itemName: "Fionnbharr's Unspent Fury",
    skillId: "pathWild",
    cultureId: "gaeldrim",
    description: "Unused momentum carries between rounds — holding back a round makes your next attack hit harder.",
  },
  pathGrove: {
    itemName: "Bríghid's Second Bloom",
    skillId: "pathGrove",
    cultureId: "gaeldrim",
    description: "Your healing spells can push a target's HP briefly above their normal max for the rest of the fight.",
  },
  riteProtection: {
    itemName: "Zuberi's Standing Vow",
    skillId: "riteProtection",
    cultureId: "vandiri",
    description: "Your protection rite automatically re-triggers once, free, the instant it's consumed.",
  },
  riteThunderWrath: {
    itemName: "Adaeze's Storm-Voice",
    skillId: "riteThunderWrath",
    cultureId: "vandiri",
    description: "Warrior's Resolve no longer has a cooldown — call on it as often as you need.",
  },
  waySuijin: {
    itemName: "Mizuhana's Deep Well",
    skillId: "waySuijin",
    cultureId: "yorenshi",
    description: "Your healing spells cost no mana for the rest of the fight, after your first successful heal.",
  },
  wayYokai: {
    itemName: "Kitsura's Stolen Form",
    skillId: "wayYokai",
    cultureId: "yorenshi",
    description: "Your elemental form no longer has a cooldown between transformations — swap freely, whenever you want.",
  },
  wayOnmyoji: {
    itemName: "Kage's Hidden Ward",
    skillId: "wayOnmyoji",
    cultureId: "yorenshi",
    description: "Your first ward or omen effect each fight costs no turn.",
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
