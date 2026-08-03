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
      "Power inherited through bloodline. Four lines carry it in " +
      "Cairntír today — Averick imbues weapons with elemental force, " +
      "Siuloir mends wounds, and the Line of Emyrs is rarer and " +
      "stranger, said to command the raw elements directly.",
    socialStructure: "Hereditary Clan Chief",
    magicSkillIds: ["ancestralAverick", "ancestralSiuloir", "ancestralEmyrs", "ancestralFetch"],
    accentColor: "#7d5ba6",
    backgroundImage: "assets/images/backgrounds/deveran-bg.png",
    magicOrigin: "The Deverans hold to the misted Highlands and stone circles of their ancestors — and it is that same bloodline, passed down through the clans, that gives their magic its power."
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
      "warrior's own fury and hardens their stance alike, the " +
      "Vision unbalances a foe, and the Curse is spoken of more " +
      "quietly — a hex that lingers and festers.",
    socialStructure: "Warrior-Caste Shamanic Society",
    magicSkillIds: ["runeBlade", "runeVision", "runeCurse", "runeSong"],
    accentColor: "#4f7ca6",
    backgroundImage: "assets/images/backgrounds/drakvarr-bg.png",
    magicOrigin: "The Drakvarr carve out a hard life among fjord and battle-hall — and their magic is carved too, etched into rune and skin by warriors and shamans alike."
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
    accentColor: "#5a8f5a",
    backgroundImage: "assets/images/backgrounds/gaeldrim-bg.png",
    magicOrigin: "The Gaeldrim dwell among ancient groves, bogs, and green hills — and it is that same living land, older than any people upon it, that gives their magic its power."
  },
  vandiri: {
    id: "vandiri",
    name: "Vandiri",
    tagline: "Storm-blessed, water-guarded.",
    description:
      "A people whose magic is granted by ancient, deeply revered " +
      "spirits — not inherited by blood, but sought through devotion " +
      "and rite. Three great spirits answer those who call upon them " +
      "today, each with its own domain and its own demands.",
    magicName: "Rite Magic",
    magicDescription:
      "Power granted through sacred rite rather than bloodline or " +
      "rune. The Thunder-Wrath answers with fire and righteous fury, " +
      "Unmaking answers with storm and the unweaving of a foe's " +
      "strength, and Protection answers by guarding those you hold " +
      "dear, even without being called.",
    socialStructure: "Devotional Rite-Society",
    magicSkillIds: ["riteThunderWrath", "riteUnmaking", "riteProtection", "riteGriot"],
    accentColor: "#c17a3d",
    backgroundImage: "assets/images/backgrounds/vandiri-bg.png",
    magicOrigin: "The Vandiri dwell among sun-warmed savanna, tropical rivers, and coastal storm — and it is devotion to the old spirits of that land, given form through sacred rite, that grants their magic its power."
  },
  yorenshi: {
    id: "yorenshi",
    name: "Yorenshi",
    tagline: "Kami-bound, shape-sworn.",
    description:
      "An island people whose magic flows from kami — spirits bound to " +
      "storm, water, mountain, and beast alike. Shrine-keepers, not " +
      "chiefs or clans, hold authority here, tending the old rites " +
      "that keep each spirit's favor.",
    magicName: "Kami Rite",
    magicDescription:
      "Power granted by the kami. The Way of Tengu sharpens body and " +
      "blade through pure martial discipline, the Way of Suijin calls " +
      "on the river-spirit's favor through song and instrument, and " +
      "the Way of the Elements lets the caster take on the raw form " +
      "of fire, water, earth, wind, mist, or lightning for a time.",
    socialStructure: "Shrine-Keeper Hierarchy",
    magicSkillIds: ["wayTengu", "waySuijin", "wayYokai", "wayOnmyoji"],
    accentColor: "#d17b9e",
    backgroundImage: "assets/images/backgrounds/yorenshi-bg.png",
    magicOrigin: "The Yorenshi dwell among mist-wrapped peaks and cherry-blossomed shorelines — and it is devotion to the kami of that land which grants their magic its power."
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
      "A werewolf-like people descended, the old clans say, from the " +
      "first hunters to walk the northern crags — mostly human in " +
      "shape, but marked with fangs, fur, and a wolfish edge that " +
      "never quite fades. Solitary by nature, the Wulver are known " +
      "to leave a fresh catch on a stranger's doorstep rather than " +
      "cause them any trouble.",
    image: "assets/images/characters/wulver.png"
  },
  sidhe: {
    id: "sidhe",
    name: "Sídhe",
    origin: "Old blood of the Gaeldrim",
    description:
      "Kin to a deposed and elder people who, the old stories say, " +
      "lost their claim to Cairntír long ago and withdrew beneath " +
      "its hollow hills rather than yield entirely. Uncanny rather " +
      "than simply fair, the Sídhe are said to strike bargains as " +
      "easily as they break them, and old habit still keeps most " +
      "mortals from naming them plainly.",
    image: "assets/images/characters/sidhe.png"
  },
  leopardkin: {
    id: "leopardkin",
    name: "Leopard-kin",
    origin: "Old blood of the Vandiri",
    description:
      "A feline-featured people, quiet and solitary by nature, " +
      "said to descend from the old spirit-societies of the deep " +
      "bush. The Leopard-kin are known as keen-eyed trackers and " +
      "patient hunters, rarely seen unless they wish to be.",
    image: "assets/images/characters/full-set/leopardkin-male-sword-shield.png"
  },
  giant: {
    id: "giant",
    name: "Giant",
    origin: "Old blood of all four peoples",
    description:
      "Descended, by every clan's account, from the great stone-kin " +
      "said to have shaped Cairntír's coastline with their bare " +
      "hands. Broad, long-lived, and slow to anger — though each " +
      "people tells the old story a little differently, and none of " +
      "them quite agree on how it ends.",
    image: "assets/images/characters/giant.png"
  },
  dragonkin: {
    id: "dragonkin",
    name: "Dragonkin",
    origin: "Old blood of the Yorenshi",
    description:
      "Said to carry the blood of the dragons long honored at the " +
      "island shrines, the Dragonkin bear scaled skin and eyes that " +
      "catch the light like an ember. Reverence and wariness follow " +
      "them in equal measure — old debts, the shrine-keepers say, " +
      "run both ways.",
    image: "assets/images/characters/dragonkin.png"
  }
};

const TRAITS = {
  keenSenses: { id: "keenSenses", name: "Keen Senses", description: "Sharp sight and hearing, quick to notice what others miss." },
  thickHide: { id: "thickHide", name: "Thick Hide", description: "Hardened against cold, injury, and the wear of the wild." },
  predatorInstinct: { id: "predatorInstinct", name: "Predator's Instinct", description: "A hunter's read on tracks, tension, and the moment to strike." },
  faeCunning: { id: "faeCunning", name: "Fae Cunning", description: "A quick, slippery wit — good for talking around trouble." },
  adaptable: { id: "adaptable", name: "Adaptable", description: "Picks up new skills a little faster than most." },
  ironWill: { id: "ironWill", name: "Iron Will", description: "Steady under fear, pain, and the pull of strange magic." },
  honeyedTongue: { id: "honeyedTongue", name: "Honeyed Tongue", description: "A natural, persuasive way with words and people." },
  surefooted: { id: "surefooted", name: "Sure-Footed", description: "Steady on cliffs, ice, and ground that shifts underfoot." },
  nightsight: { id: "nightsight", name: "Nightsight", description: "Sees clearly in near-darkness, where others go blind." },
  beastkinship: { id: "beastkinship", name: "Kinship with Beasts", description: "Animals read as calm, trusting, or wary around you — rarely hostile without cause." },
  quickfooted: { id: "quickfooted", name: "Quickfooted", description: "Instinct and agility let you slip free of blows before they land — a permanent boost to your Dodge." },
  deepWell: { id: "deepWell", name: "Deep Well", description: "A reservoir of magical strength deeper than most carry — permanently increases your maximum mana." },
  weightedStrike: { id: "weightedStrike", name: "Weighted Strike", description: "A natural sense for where a blow lands hardest — permanently increases your physical weapon damage." },
  arcaneGift: { id: "arcaneGift", name: "Arcane Gift", description: "A natural affinity for raw magic, sharpening the force behind every spell you cast — permanently increases your spell damage." }
};

const TRAIT_EFFECT_TEXT = {
  keenSenses: "+2 accuracy on your first attack of every fight.",
  thickHide: "Reduces incoming physical damage by 2 on every hit.",
  predatorInstinct: "25% bonus damage against enemies below half health.",
  faeCunning: "+15% success chance to flee combat.",
  adaptable: "Gains +1 bonus progress toward the next skill tier every time you use a trained skill.",
  ironWill: "Roughly halves the enemy's chance to inflict a status effect on hit.",
  honeyedTongue: "+15% success chance on Persuasion checks.",
  surefooted: "+15% success chance on Survival checks.",
  nightsight: "+1 accuracy, but only inside dark dungeons (Frosthollow Vault, Blackforge Deep).",
  beastkinship: "+1 to the effectiveness of any summoned companion.",
  quickfooted: "A permanent boost to your Dodge.",
  deepWell: "+15 maximum Mana.",
  weightedStrike: "+1 to your physical weapon damage.",
  arcaneGift: "+1 to your spell damage."
};

const TRAIT_SELECTION_MIN = 2;
const TRAIT_SELECTION_MAX = 3;
const MAX_FOLLOWERS = 2;
const MAX_STARTING_SKILLS = 6;

const SKILLS = {
  riteThunderWrath: { id: "riteThunderWrath", name: "Rite of the Thunder-Wrath", category: "Magic", cultureLocked: "vandiri", description: "Damage magic — sacred fire and righteous fury called down upon the guilty, said to answer the same storm-spirits that once judged wrongdoers beneath open savanna sky. The Vandiri are a devotional rite-society; this line is the old law made manifest, punishment given voice and flame." },
  riteUnmaking: { id: "riteUnmaking", name: "Rite of Unmaking", category: "Magic", cultureLocked: "vandiri", description: "Debuff magic — storm and unraveling that drains a foe's strength, aim, or defense over time, drawn from the belief that a wronged spirit can be turned back upon the one who wronged it. Where Thunder-Wrath strikes outright, Unmaking is patient — a slow undoing of what a foe stood on." },
  riteProtection: { id: "riteProtection", name: "Rite of Protection", category: "Magic", cultureLocked: "vandiri", description: "Ward and support magic — silent guardian rites that answer harm before it's called upon, heal, or hold a party together against the dark. The Vandiri hold that a well-tended spirit watches over its people unseen; this line is that watchfulness given weight in battle." },

  ancestralAverick: { id: "ancestralAverick", name: "Line of Averick", category: "Magic", cultureLocked: "deveran", description: "The warblood line — weapon-buff magic, wreathing your blade in fire, frost, or storm for a time. Named for a forebear said to have struck a bargain with the elements themselves rather than any god; one of three distinct Deveran ancestor-bloodlines, each said to run truer in some clans than others." },
  ancestralSiuloir: { id: "ancestralSiuloir", name: "Line of Siuloir", category: "Magic", cultureLocked: "deveran", description: "The wardblood line — a bard's song magic, mending wounds and heartening the whole party for as long as it plays. Siuloir is remembered as a healer-poet whose songs were said to outlast the wounds they closed; a second Deveran bloodline, carried through voice and instrument rather than blade." },
  ancestralEmyrs: { id: "ancestralEmyrs", name: "Line of Emyrs", category: "Magic", cultureLocked: "deveran", description: "The wizard line — rare and volatile among the Deveran, commanding fire, water, earth, and air directly rather than through any bloodline gift. Emyrs is spoken of less as an ancestor than a warning — power taken raw from the world itself, without a bloodline's restraint to temper it." },

  runeBlade: { id: "runeBlade", name: "Runes of the Blade", category: "Magic", cultureLocked: "drakvarr", description: "Self-buff magic — battle-runes carved and spoken over your own weapon to fuel strength and fury for a time, the old Norse rite of readying a blade before the shield-wall closes. A warrior's own runecraft, meant to be cast on oneself, not another." },
  runeVision: { id: "runeVision", name: "Runes of the Vision", category: "Magic", cultureLocked: "drakvarr", description: "Debuff and guaranteed-effect magic — seer-runes drawn from the old Norse belief that fate could be glimpsed and bent, if only briefly. Unbalances a foe's footing or grants the caster a moment of uncanny, unerring certainty." },
  runeCurse: { id: "runeCurse", name: "Runes of the Curse", category: "Magic", cultureLocked: "drakvarr", description: "Damage-over-time magic — hex-runes carved with intent to wound slowly, the darker half of Drakvarr runecraft, spoken of in hushed terms even among those who practice it. What Rune of Blade sharpens for a fight, Rune of Curse leaves to fester long after." },
  runeSong: { id: "runeSong", name: "Rune-Song of the Skald", category: "Magic", cultureLocked: "drakvarr", description: "Bard song magic — a skald's verse sung to nyckelharpa strings, healing and heartening allies or wearing a foe down for as long as it plays. The Drakvarr warband's own poet-historian, whose sagas were believed to carry real weight in battle, not just memory of it." },

  pathWild: { id: "pathWild", name: "Path of the Wild", category: "Magic", cultureLocked: "gaeldrim", description: "Summon magic — a Gaeldrim rite that calls a beast companion to fight at your side for the rest of the dungeon, once per run. Rooted in the old Irish belief that certain animals are kin-bound to a person, not merely tamed — a bond struck once, and honored for as long as the journey lasts." },
  pathGrove: { id: "pathGrove", name: "Path of the Grove", category: "Magic", cultureLocked: "gaeldrim", description: "Healing magic — growth drawn from root and leaf, mending wounds as the land itself was long believed to mend those who kept faith with it. The gentler face of Gaeldrim druidic power, tied to sacred groves said to remember every hand that tended them." },
  pathStorm: { id: "pathStorm", name: "Path of the Storm", category: "Magic", cultureLocked: "gaeldrim", description: "Damage magic — wind, rain, and lightning called down from a sky the old druids held was never truly silent. The fiercer face of Gaeldrim tradition, invoked when the grove's patience runs out." },
  pathBarrow: { id: "pathBarrow", name: "Path of the Barrow", category: "Magic", cultureLocked: "gaeldrim", description: "Damage-over-time and debuff magic — the dark path, a lingering curse drawn from what rests beneath Gaeldrim burial mounds. Where Grove tends the living land, Barrow answers what the land has buried, and what it hasn't fully let go of." },

  wayTengu: { id: "wayTengu", name: "Way of Tengu", category: "Magic", cultureLocked: "yorenshi", description: "Martial damage magic — a mountain-spirit's fighting discipline honored by the Yorenshi, inhuman precision and wind-aided strikes honed through combat mastery alone, no instrument or ritual required. Tengu are held to be exacting teachers, demanding total discipline of anyone who would learn from them." },
  waySuijin: { id: "waySuijin", name: "Way of Suijin", category: "Magic", cultureLocked: "yorenshi", description: "Bard song magic — the river-spirit's favor, called through Yorenshi song and instrument (biwa, taiko, shakuhachi), healing, heartening, or unsettling a foe for as long as it plays. Suijin is honored as guardian of water and safe passage; this line channels a river-spirit's favor rather than the discipline of Tengu or the binding of the onmyōji." },
  wayYokai: { id: "wayYokai", name: "Way of the Elements", category: "Magic", cultureLocked: "yorenshi", description: "Shapeshifting magic — a brief transformation channeling the raw power of a natural element, a Yorenshi rite of the kami that reshapes the caster's own body rather than summoning a spirit apart from them. The most physically transformative of Yorenshi's four traditions." },
  wayOnmyoji: { id: "wayOnmyoji", name: "Way of the Onmyōji", category: "Magic", cultureLocked: "yorenshi", description: "Ward and summon magic — a Yorenshi diviner-sorcerer's art, binding restless and vengeful spirits as shikigami to fight beside you, ward you, or watch over the whole party. Where Way of the Elements changes the caster, the onmyōji's power is always borrowed — bound, not become." },

  ancestralFetch: { id: "ancestralFetch", name: "Line of Alistair", category: "Magic", cultureLocked: "deveran", description: "Shapeshifting magic — a third Deveran ancestor-bloodline, calling on the dread beasts and fae of Highland legend to lend their shape and strength for a time. Alistair is remembered less fondly than Averick or Siuloir — a bloodline said to have made its bargains with things that were never quite trustworthy to begin with." },
  riteGriot: { id: "riteGriot", name: "Rite of the Griot", category: "Magic", cultureLocked: "vandiri", description: "Bard song magic — the griot's drum and kalimba, a hereditary praise-singer and oral historian carrying real magic in rhythm, healing, heartening, or wearing down a foe for as long as it plays. Where Thunder-Wrath and Unmaking call on the spirits directly, the griot calls on memory and story instead." },

  swords: { id: "swords", name: "Sword", category: "Weapon", description: "Skill with blades in close combat." },
  axes: { id: "axes", name: "Axe", category: "Weapon", description: "Heavy, cleaving strikes with an axe." },
  archery: { id: "archery", name: "Archery", category: "Weapon", description: "Accuracy and power with a bow." },
  unarmedCombat: { id: "unarmedCombat", name: "Unarmed Combat", category: "Weapon", description: "Fighting with fists, feet, and improvised force." },
  daggers: { id: "daggers", name: "Daggers", category: "Weapon", description: "Fast, precise strikes built for finding an opening." },
  twoHanded: { id: "twoHanded", name: "Two-Handed", category: "Weapon", description: "Heavy weapons built for devastating power over speed or defense." },

  shields: { id: "shields", name: "Shields", category: "Armor", description: "Wielding a shield effectively — deflecting and absorbing blows that would otherwise land." },
  plateArmor: { id: "plateArmor", name: "Plate", category: "Armor", description: "Moving and fighting effectively in heavy plate — the strongest Armor Class bonus of any armor, at the cost of any Dodge or mana benefit." },
  chainArmor: { id: "chainArmor", name: "Chain", category: "Armor", description: "Wearing chainmail without it slowing you down — a strong Armor Class bonus, second only to plate, plus a modest boost to Dodge." },
  leatherArmor: { id: "leatherArmor", name: "Leather", category: "Armor", description: "Light, flexible armor that trades protection for speed — a light Armor Class bonus, but the best Dodge boost of any armor." },
  clothArmor: { id: "clothArmor", name: "Cloth", category: "Armor", description: "Light robes and wraps, favored by those who cast — no Armor Class or Dodge benefit, but a real boost to your maximum mana." },

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
  { min: 100, name: "Master" },
  { min: 150, name: "Grandmaster" }
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
    base: 60,
    tierBonus: { Untrained: 0, Novice: 10, Adept: 20, Expert: 35, Master: 55, Grandmaster: 85 }
  }
};

const ARMOR_PROTECTION_RANK_BONUS = {
  plateArmor: 3,
  chainArmor: 2,
  leatherArmor: 1,
  clothArmor: 0
};

const ARMOR_DODGE_RANK_BONUS = {
  leatherArmor: 2,
  chainArmor: 1,
  plateArmor: 0,
  clothArmor: 0
};

const ARMOR_MANA_BONUS = {
  clothArmor: 15,
  leatherArmor: 0,
  chainArmor: 0,
  plateArmor: 0
};

// ----------------------------------------------------------
// ARMOR STEALTH BONUS
// Flat rank bonus applied to Backstab's attack tier when the
// matching armor skill is equipped, on top of the Stealth
// skill-tier bonus. Only Leather Armor grants one.
// ----------------------------------------------------------
const ARMOR_STEALTH_BONUS = {
  clothArmor: 0,
  leatherArmor: 1,
  chainArmor: 0,
  plateArmor: 0
};

// ----------------------------------------------------------
// TRAIT MANA BONUS
// Flat max-mana bonuses granted by specific traits. Applied on
// top of the normal tier-based mana pool in getManaPoolMax().
// ----------------------------------------------------------
const TRAIT_MANA_BONUS = {
  deepWell: 15
};

const TRAIT_SPELL_DAMAGE_RANK_BONUS = {
  arcaneGift: 1
};

const TRAIT_ATTACK_DAMAGE_RANK_BONUS = {
  weightedStrike: 1
};

const MANA_CONFIG = {
  base: 70,
  tierBonus: { Untrained: 0, Novice: 10, Adept: 20, Expert: 35, Master: 50 },
  costPerCast: 10
};

const DIFFICULTY_SETTINGS = {
  easy: {
    id: "easy",
    name: "Easy",
    description: "A gentler road below Cairntír — foes hit softer and fall faster.",
    enemyHpMultiplier: 5,
    enemyDamageMultiplier: 1,
    enemyAccuracyAdjustment: -0.1
  },
  normal: {
    id: "normal",
    name: "Normal",
    description: "The road as it's always been walked.",
    enemyHpMultiplier: 8,
    enemyDamageMultiplier: 1.5,
    enemyAccuracyAdjustment: 0.10
  },
  hard: {
    id: "hard",
    name: "Hard",
    description: "A harder road — foes hit harder and take more killing.",
    enemyHpMultiplier: 12,
    enemyDamageMultiplier: 2,
    enemyAccuracyAdjustment: 0.15
  },
  master: {
    id: "master",
    name: "Master",
    description: "The road as the old stories tell it — unforgiving, and not meant to be walked twice.",
    enemyHpMultiplier: 16,
    enemyDamageMultiplier: 2.5,
    enemyAccuracyAdjustment: 0.20
  }
};

const SUCCESS_CHANCE_BY_TIER = {
  Untrained: 0.45,
  Novice: 0.55,
  Adept: 0.65,
  Expert: 0.75,
  Master: 0.85,
  Grandmaster: 0.95
};

const TIER_SHIFT_PER_RANK = 0.08;
const MIN_SUCCESS_CHANCE = 0.05;
const MAX_SUCCESS_CHANCE = 0.95;

const DAMAGE_RANGE_BY_TIER = {
  Untrained: [2, 4],
  Novice: [3, 6],
  Adept: [5, 9],
  Expert: [8, 13],
  Master: [12, 20],
  Grandmaster: [18, 30]
};

const DEFEND_SUCCESS_PENALTY = 0.20;
const SPELL_EFFECT_DURATION = 3;

const ARCHETYPES = [
  { id: "single", name: "Single Weapon", fileSlug: "single" },
  { id: "swordShield", name: "Sword & Shield", fileSlug: "sword-shield" },
  { id: "axeShield", name: "Axe & Shield", fileSlug: "axe-shield" },
  { id: "dualWield", name: "Dual-Wield", fileSlug: "dual-wield" },
  { id: "archer", name: "Archer", fileSlug: "archer" },
  { id: "spellcaster", name: "Spellcaster", fileSlug: "spellcaster" },
  { id: "martialArts", name: "Martial Arts", fileSlug: "martial-arts" },
  { id: "bard", name: "Bard", fileSlug: "bard" },
  { id: "twoHanded", name: "Two-Handed", fileSlug: "two-handed" },
  { id: "stealth", name: "Stealth", fileSlug: "stealth" }
];

// ------------------------------------------------------------
// CURRENCY
// Stored internally as a single integer (total copper) to avoid
// carrying/rounding issues — only converted to Gold/Silver/Copper
// for display. 10 Copper = 1 Silver, 10 Silver = 1 Gold (so 1 Gold
// = 100 Copper total).
// ------------------------------------------------------------
const COPPER_PER_SILVER = 10;
const SILVER_PER_GOLD = 10;
const COPPER_PER_GOLD = COPPER_PER_SILVER * SILVER_PER_GOLD;

function formatCurrency(totalCopper) {
  const gold = Math.floor(totalCopper / COPPER_PER_GOLD);
  const silver = Math.floor((totalCopper % COPPER_PER_GOLD) / COPPER_PER_SILVER);
  const copper = totalCopper % COPPER_PER_SILVER;
  const parts = [];
  if (gold > 0) parts.push(`${gold} Gold`);
  if (silver > 0) parts.push(`${silver} Silver`);
  if (copper > 0 || parts.length === 0) parts.push(`${copper} Copper`);
  return parts.join(", ");
}

function addCurrency(character, amount) {
  character.currency = (character.currency || 0) + amount;
}

function trySpendCurrency(character, amount) {
  if ((character.currency || 0) < amount) return false;
  character.currency -= amount;
  return true;
}

const CURRENCY_DROP_BY_TIER = {
  Novice: [2, 6],
  Adept: [5, 12],
  Expert: [10, 22],
  Master: [18, 35],
  Grandmaster: [30, 55]
};
const BOSS_CURRENCY_MULTIPLIER = 3;

function rollEnemyCurrencyDrop(enemyId) {
  const template = ENEMIES[enemyId];
  if (!template) return 0;
  const range = CURRENCY_DROP_BY_TIER[template.threatTier] || CURRENCY_DROP_BY_TIER.Master;
  let amount = range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
  if (getBossEnemyIds().has(enemyId)) {
    amount *= BOSS_CURRENCY_MULTIPLIER;
  }
  return amount;
}
