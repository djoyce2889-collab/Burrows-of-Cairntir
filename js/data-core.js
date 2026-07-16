/* ============================================================
   DATA-CORE.JS
   Cultures, races, traits, skills, advantages, mana, difficulty.
   ============================================================ */

const CULTURES = {
  deveran: {
    id: "deveran",
    name: "Deverans",
    tagline: "Clan-born, blood-sworn.",
    description:
      "A clan-based people whose magic runs in family bloodlines. " +
      "Each Deveran clan carries its own ancestral gift, passed " +
      "down rather than learned. Leadership follows the hereditary " +
      "chief, and loyalty to one's bloodline is sacred.",
    magicName: "Ancestral Magic",
    magicDescription:
      "Power inherited through bloodline. Three lines carry it in " +
      "Cairntír today — Averick imbues weapons with elemental force, " +
      "Siuloir mends wounds, and the Line of Emyrs is rarer and " +
      "stranger, said to command the raw elements directly.",
    socialStructure: "Hereditary Clan Chief",
    magicSkillIds: ["ancestralAverick", "ancestralSiuloir", "ancestralEmyrs"],
    accentColor: "#7d5ba6"
  },
  drakvarr: {
    id: "drakvarr",
    name: "Drakvarr",
    tagline: "Rune-marked, shield-sworn.",
    description:
      "A warrior-caste, shaman-guided people who carve their magic " +
      "into stone and skin. The Drakvarr honor strength earned in " +
      "battle as much as wisdom earned in ritual, and their shamans " +
      "read the future in rune-casts.",
    magicName: "Rune Magic",
    magicDescription:
      "Power drawn from carved and spoken runes. The Blade fuels a " +
      "warrior's own fury, the Shield hardens their stance, the " +
      "Vision unbalances a foe, and the Curse is spoken of more " +
      "quietly — a hex that lingers and festers.",
    socialStructure: "Warrior-Caste Shamanic Society",
    magicSkillIds: ["runeBlade", "runeShield", "runeVision", "runeCurse"],
    accentColor: "#4f7ca6"
  },
  gaeldrim: {
    id: "gaeldrim",
    name: "Gaeldrim",
    tagline: "Grove-sworn, kin of the wild.",
    description:
      "A druidic people whose magic flows from the natural world. " +
      "Rather than a single hereditary ruler, the Gaeldrim follow " +
      "the Túath system — clans bound by shared land and consensus " +
      "rather than bloodline succession.",
    magicName: "Druidic Magic",
    magicDescription:
      "Power drawn from living things. The Wild calls a beast " +
      "companion to fight at your side, the Grove mends wounds, the " +
      "Storm calls down raw weather, and the Path of the Barrow is " +
      "the fourth and darkest — a lingering curse from what rests " +
      "beneath the land rather than what grows on it.",
    socialStructure: "Túath (Clan Consensus)",
    magicSkillIds: ["pathWild", "pathGrove", "pathStorm", "pathBarrow"],
    accentColor: "#5a8f5a"
  }
};

const RACES = {
  human: {
    id: "human",
    name: "Human",
    origin: "Common to all three peoples",
    description:
      "Ordinary folk, found in every hall, village, and grove across " +
      "the land — Deveran, Drakvarr, and Gaeldrim alike.",
    image: "assets/images/characters/human.png"
  },
  alfar: {
    id: "alfar",
    name: "Álfar",
    origin: "Old blood of the Drakvarr",
    description:
      "Long-lived and keen-eyed, the Álfar are said to have walked " +
      "Cairntír before the first rune was ever cut into stone. Their " +
      "kin are most often found among the Drakvarr, though old blood " +
      "still surfaces in halls far from the coast.",
    image: "assets/images/characters/alfar.png"
  },
  dwarf: {
    id: "dwarf",
    name: "Dwarf",
    origin: "Old blood of the Drakvarr",
    description:
      "Stout, deep-delving, and stubborn as stone — the Dwarves are " +
      "said to have taught the Drakvarr their first runes, and their " +
      "halls still lie beneath the mountains their ancestors hollowed " +
      "out long before the coast was ever settled.",
    image: "assets/images/characters/dwarf.png"
  },
  wulver: {
    id: "wulver",
    name: "Wulver",
    origin: "Old blood of the Deverans",
    description:
      "A wolf-headed people descended, the old clans say, from the " +
      "first hunters to walk the northern crags. Solitary by nature, " +
      "the Wulver are known to leave a fresh catch on a stranger's " +
      "doorstep rather than cause them any trouble.",
    image: "assets/images/characters/wulver.png"
  },
  sidhe: {
    id: "sidhe",
    name: "Sídhe",
    origin: "Old blood of the Gaeldrim",
    description:
      "Kin to the hidden folk who dwell beneath the hollow hills and " +
      "deep groves of Cairntír — strange, fair, and only loosely " +
      "bound by the rules that govern mortal folk.",
    image: "assets/images/characters/sidhe.png"
  },
  giant: {
    id: "giant",
    name: "Giant",
    origin: "Old blood of all three peoples",
    description:
      "Descended, by every clan's account, from the great stone-kin " +
      "said to have shaped Cairntír's coastline with their bare " +
      "hands. Broad, long-lived, and slow to anger — though each " +
      "people tells the old story a little differently, and none of " +
      "them quite agree on how it ends.",
    image: "assets/images/characters/giant.png"
  }
};

const TRAITS = {
  keenSenses: { id: "keenSenses", name: "Keen Senses", description: "Sharp sight and hearing, quick to notice what others miss." },
  thickHide: { id: "thickHide", name: "Thick Hide", description: "Hardened against cold, injury, and the wear of the wild." },
  predatorInstinct: { id: "predatorInstinct", name: "Predator's Instinct", description: "A hunter's read on tracks, tension, and the moment to strike." },
  faeCunning: { id: "faeCunning", name: "Fae Cunning", description: "A quick, slippery wit — good for talking around trouble." },
  adaptable: { id: "adaptable", name: "Adaptable", description: "Picks up new skills a little faster than most." },
  ironWill: { id: "ironWill", name: "Iron Will", description: "Steady under fear, pain, and the pull of strange magic." },
  silverTongue: { id: "silverTongue", name: "Silver Tongue", description: "A natural, persuasive way with words and people." },
  surefooted: { id: "surefooted", name: "Sure-Footed", description: "Steady on cliffs, ice, and ground that shifts underfoot." },
  nightsight: { id: "nightsight", name: "Nightsight", description: "Sees clearly in near-darkness, where others go blind." },
  beastkinship: { id: "beastkinship", name: "Kinship with Beasts", description: "Animals read as calm, trusting, or wary around you — rarely hostile without cause." },
  quickfooted: { id: "quickfooted", name: "Quickfooted", description: "Instinct and agility let you slip free of blows before they land — a permanent boost to your Dodge." }
};

const TRAIT_SELECTION_MIN = 2;
const TRAIT_SELECTION_MAX = 3;
const MAX_FOLLOWERS = 3;
const MAX_STARTING_SKILLS = 6;

const SKILLS = {
  ancestralAverick: { id: "ancestralAverick", name: "Line of Averick", category: "Magic", cultureLocked: "deveran", description: "The warblood line — imbues your weapon with elemental force for a time." },
  ancestralSiuloir: { id: "ancestralSiuloir", name: "Line of Siuloir", category: "Magic", cultureLocked: "deveran", description: "The wardblood line — mends wounds through ancestral blessing." },
  ancestralEmyrs: { id: "ancestralEmyrs", name: "Line of Emyrs", category: "Magic", cultureLocked: "deveran", description: "The wizard line — rare and volatile, commanding fire, water, earth, and air directly." },

  runeBlade: { id: "runeBlade", name: "Runes of the Blade", category: "Magic", cultureLocked: "drakvarr", description: "Battle-runes that fuel your own strength and fury for a time." },
  runeShield: { id: "runeShield", name: "Runes of the Shield", category: "Magic", cultureLocked: "drakvarr", description: "Ward-runes that harden your stance against harm for a time." },
  runeVision: { id: "runeVision", name: "Runes of the Vision", category: "Magic", cultureLocked: "drakvarr", description: "Seer-runes that unbalance and weaken a foe for a time." },
  runeCurse: { id: "runeCurse", name: "Runes of the Curse", category: "Magic", cultureLocked: "drakvarr", description: "Hex-runes that fester and linger, doing harm over time." },

  pathWild: { id: "pathWild", name: "Path of the Wild", category: "Magic", cultureLocked: "gaeldrim", description: "Calls a beast companion to fight at your side for the rest of the dungeon — once per dungeon run." },
  pathGrove: { id: "pathGrove", name: "Path of the Grove", category: "Magic", cultureLocked: "gaeldrim", description: "Growth and healing, mending wounds from root and leaf." },
  pathStorm: { id: "pathStorm", name: "Path of the Storm", category: "Magic", cultureLocked: "gaeldrim", description: "Wind, rain, and lightning, called down from the turning sky." },
  pathBarrow: { id: "pathBarrow", name: "Path of the Barrow", category: "Magic", cultureLocked: "gaeldrim", description: "The dark path — a lingering curse from what rests beneath the land." },

  swords: { id: "swords", name: "Sword", category: "Weapon", description: "Skill with blades in close combat." },
  axes: { id: "axes", name: "Axe", category: "Weapon", description: "Heavy, cleaving strikes with an axe." },
  archery: { id: "archery", name: "Archery", category: "Weapon", description: "Accuracy and power with a bow." },
  unarmedCombat: { id: "unarmedCombat", name: "Unarmed Combat", category: "Weapon", description: "Fighting with fists, feet, and improvised force." },

  plateArmor: { id: "plateArmor", name: "Plate", category: "Armor", description: "Moving and fighting effectively in heavy plate — the strongest protection there is." },
  chainArmor: { id: "chainArmor", name: "Chain", category: "Armor", description: "Wearing chainmail without it slowing you down — strong, second only to plate." },
  leatherArmor: { id: "leatherArmor", name: "Leather", category: "Armor", description: "Light, flexible armor that trades protection for speed." },
  clothArmor: { id: "clothArmor", name: "Cloth", category: "Armor", description: "Light robes and wraps, favored by those who cast — the least protective armor." },

  smithing: { id: "smithing", name: "Smithing", category: "Crafting", description: "Forging weapons and heavy/medium armor from ore and metal." },
  tailoring: { id: "tailoring", name: "Tailoring", category: "Crafting", description: "Working hide and cloth into leather and cloth armor." },
  enchanting: { id: "enchanting", name: "Enchanting", category: "Crafting", description: "Binding magical properties into weapons and armor." },

  stealth: { id: "stealth", name: "Stealth", category: "General", description: "Moving unseen and unheard." },
  survival: { id: "survival", name: "Survival", category: "General", description: "Enduring the wild — foraging, tracking, resilience." },
  persuasion: { id: "persuasion", name: "Persuasion", category: "General", description: "Talking your way through where a blade won't help." },
  lockpicking: { id: "lockpicking", name: "Lockpicking", category: "General", description: "Bypassing locks, traps, and other stubborn obstacles." }
};

const SKILL_CATEGORY_ORDER = ["Magic", "Weapon", "Armor", "Crafting", "General"];

const SKILL_TIERS = [
  { min: 0, name: "Untrained" },
  { min: 10, name: "Novice" },
  { min: 30, name: "Adept" },
  { min: 60, name: "Expert" },
  { min: 100, name: "Master" }
];

const ADVANTAGES = {
  armorClass: {
    id: "armorClass",
    name: "Armor Class",
    description: "How well your training turns aside physical blows.",
    drivenBy: ["plateArmor", "chainArmor", "leatherArmor", "clothArmor"],
    displayAsNumber: false
  },
  dodge: {
    id: "dodge",
    name: "Dodge",
    description: "How well you avoid a physical attack outright.",
    drivenBy: ["unarmedCombat", "stealth"],
    displayAsNumber: false
  },
  magicResistance: {
    id: "magicResistance",
    name: "Magic Resistance",
    description: "How well you shrug off or blunt a magical attack.",
    drivenBy: ["enchanting"],
    displayAsNumber: false
  },
  hitPoints: {
    id: "hitPoints",
    name: "Hit Points",
    description: "How much harm you can take before you're out of the fight.",
    drivenBy: ["survival"],
    displayAsNumber: true,
    base: 50,
    tierBonus: { Untrained: 0, Novice: 10, Adept: 20, Expert: 35, Master: 55 }
  }
};

const ARMOR_PROTECTION_RANK_BONUS = {
  plateArmor: 3,
  chainArmor: 2,
  leatherArmor: 1,
  clothArmor: 0
};

const MANA_CONFIG = {
  base: 60,
  tierBonus: { Untrained: 0, Novice: 10, Adept: 20, Expert: 35, Master: 50 },
  costPerCast: 10
};

const DIFFICULTY_SETTINGS = {
  easy: {
    id: "easy",
    name: "Easy",
    description: "A gentler road below Cairntír — foes hit softer and fall faster.",
    enemyHpMultiplier: 0.75,
    enemyDamageMultiplier: 0.75
  },
  normal: {
    id: "normal",
    name: "Normal",
    description: "The road as it's always been walked.",
    enemyHpMultiplier: 1,
    enemyDamageMultiplier: 1
  },
  hard: {
    id: "hard",
    name: "Hard",
    description: "A harder road — foes hit harder and take more killing.",
    enemyHpMultiplier: 1.3,
    enemyDamageMultiplier: 1.25
  }
};

const SUCCESS_CHANCE_BY_TIER = {
  Untrained: 0.45,
  Novice: 0.55,
  Adept: 0.65,
  Expert: 0.75,
  Master: 0.85
};

const TIER_SHIFT_PER_RANK = 0.08;
const MIN_SUCCESS_CHANCE = 0.05;
const MAX_SUCCESS_CHANCE = 0.95;

const DAMAGE_RANGE_BY_TIER = {
  Untrained: [2, 4],
  Novice: [3, 6],
  Adept: [5, 9],
  Expert: [8, 13],
  Master: [12, 20]
};

const DEFEND_SUCCESS_PENALTY = 0.20;
const SPELL_EFFECT_DURATION = 3;

const ARCHETYPES = [
  { id: "swordShield", name: "Sword & Shield", fileSlug: "sword-shield" },
  { id: "axeShield", name: "Axe & Shield", fileSlug: "axe-shield" },
  { id: "dualWield", name: "Dual-Wield", fileSlug: "dual-wield" },
  { id: "archer", name: "Archer", fileSlug: "archer" },
  { id: "spellcaster", name: "Spellcaster", fileSlug: "spellcaster" }
];
