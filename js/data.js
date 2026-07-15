
/* ============================================================
   DATA.JS
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
      "the land — Deveran, Drakvarr, and Gaeldrim alike."
  },
  alfar: {
    id: "alfar",
    name: "Álfar",
    origin: "Old blood of the Drakvarr",
    description:
      "Long-lived and keen-eyed, the Álfar are said to have walked " +
      "Cairntír before the first rune was ever cut into stone. Their " +
      "kin are most often found among the Drakvarr, though old blood " +
      "still surfaces in halls far from the coast."
  },
  dwarf: {
    id: "dwarf",
    name: "Dwarf",
    origin: "Old blood of the Drakvarr",
    description:
      "Stout, deep-delving, and stubborn as stone — the Dwarves are " +
      "said to have taught the Drakvarr their first runes, and their " +
      "halls still lie beneath the mountains their ancestors hollowed " +
      "out long before the coast was ever settled."
  },
  wulver: {
    id: "wulver",
    name: "Wulver",
    origin: "Old blood of the Deverans",
    description:
      "A wolf-headed people descended, the old clans say, from the " +
      "first hunters to walk the northern crags. Solitary by nature, " +
      "the Wulver are known to leave a fresh catch on a stranger's " +
      "doorstep rather than cause them any trouble."
  },
  sidhe: {
    id: "sidhe",
    name: "Sídhe",
    origin: "Old blood of the Gaeldrim",
    description:
      "Kin to the hidden folk who dwell beneath the hollow hills and " +
      "deep groves of Cairntír — strange, fair, and only loosely " +
      "bound by the rules that govern mortal folk."
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
      "them quite agree on how it ends."
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

  pathWild: { id: "pathWild", name: "Path of the Wild", category: "Magic", cultureLocked: "gaeldrim", description: "Calls a beast companion to fight at your side for the rest of the battle." },
  pathGrove: { id: "pathGrove", name: "Path of the Grove", category: "Magic", cultureLocked: "gaeldrim", description: "Growth and healing, mending wounds from root and leaf." },
  pathStorm: { id: "pathStorm", name: "Path of the Storm", category: "Magic", cultureLocked: "gaeldrim", description: "Wind, rain, and lightning, called down from the turning sky." },
  pathBarrow: { id: "pathBarrow", name: "Path of the Barrow", category: "Magic", cultureLocked: "gaeldrim", description: "The dark path — a lingering curse from what rests beneath the land." },

  swords: { id: "swords", name: "Swords", category: "Weapon", description: "Skill with blades in close combat." },
  axes: { id: "axes", name: "Axes", category: "Weapon", description: "Heavy, cleaving strikes with axes." },
  archery: { id: "archery", name: "Archery", category: "Weapon", description: "Accuracy and power with a bow." },
  unarmedCombat: { id: "unarmedCombat", name: "Unarmed Combat", category: "Weapon", description: "Fighting with fists, feet, and improvised force." },

  plateArmor: { id: "plateArmor", name: "Plate", category: "Armor", description: "Moving and fighting effectively in heavy plate." },
  chainArmor: { id: "chainArmor", name: "Chain", category: "Armor", description: "Wearing chainmail without it slowing you down." },
  leatherArmor: { id: "leatherArmor", name: "Leather", category: "Armor", description: "Light, flexible armor that trades protection for speed." },
  clothArmor: { id: "clothArmor", name: "Cloth", category: "Armor", description: "Light robes and wraps, favored by those who cast." },

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
  { min: 5, name: "Novice" },
  { min: 15, name: "Adept" },
  { min: 30, name: "Expert" },
  { min: 50, name: "Master" }
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

const MANA_CONFIG = {
  base: 60,
  tierBonus: { Untrained: 0, Novice: 10, Adept: 20, Expert: 35, Master: 50 },
  costPerCast: 10
};

const DUNGEONS = {
  duncairnKeep: {
    id: "duncairnKeep",
    name: "Duncairn Keep",
    difficulty: "Novice",
    musicSrc: "assets/audio/duncairn-keep.mp3",
    image: "assets/images/duncairn-keep.png",
    description:
      "An abandoned Deveran castle on a fog-bound hill, empty since " +
      "the chief's line died out under circumstances the clans still " +
      "won't speak of plainly. The gates stand open. Nothing living " +
      "has gone in and come back out to say why."
  },
  sunkenLonghall: {
    id: "sunkenLonghall",
    name: "The Sunken Longhall",
    difficulty: "Novice",
    musicSrc: "assets/audio/sunken-longhall.mp3",
    image: "assets/images/sunken-longhall.png",
    description:
      "A Drakvarr hall, half-swallowed by a rising bog, its rafters " +
      "still marked with runes no living shaman will speak aloud. " +
      "Black water laps at the entrance where a war-fleet once " +
      "launched. The runes overhead still glow faintly at night — no " +
      "one left alive to carve new ones, and no one left alive to " +
      "ask why the old ones still burn."
  },
  wychrootGrove: {
    id: "wychrootGrove",
    name: "The Wychroot Grove",
    difficulty: "Novice",
    musicSrc: "assets/audio/wychroot-grove.mp3",
    image: "assets/images/wychroot-grove.png",
    description:
      "A grove gone wrong — roots grown thick around old grave-mounds, " +
      "where the Path of the Barrow is said to still answer, if you " +
      "know how to ask. Sunlight barely reaches the ground here " +
      "anymore. The trees are old enough to remember who's buried " +
      "beneath them, and they haven't forgotten."
  },
  hollowmereCairn: {
    id: "hollowmereCairn",
    name: "The Hollowmere Cairn",
    difficulty: "Adept",
    musicSrc: "assets/audio/hollowmere-cairn.mp3",
    image: "assets/images/hollowmere-cairn.png",
    description:
      "A burial-mound complex out on the moors where several Deveran " +
      "clans' dead lie together. The old ancestral magic here has " +
      "gone wrong, tinged with something wilder and less patient than " +
      "any bloodline gift should be."
  },
  frosthollowVault: {
    id: "frosthollowVault",
    name: "Frosthollow Vault",
    difficulty: "Adept",
    musicSrc: "assets/audio/frosthollow-vault.mp3",
    image: "assets/images/frosthollow-vault.png",
    description:
      "An ice-cave forge-vault where the Drakvarr's greatest " +
      "rune-smiths were buried beside their finest work. The runes " +
      "here run colder and stranger than any spoken aloud in living " +
      "memory — and the smiths seem to still be finishing something."
  },
  hollowVale: {
    id: "hollowVale",
    name: "The Hollow Vale",
    difficulty: "Expert",
    musicSrc: "assets/audio/hollow-vale.mp3",
    image: "assets/images/hollow-vale.png",
    description:
      "A ring of standing stones where the Túath once gathered to " +
      "decide as one. Something answers in their place now, and it " +
      "has no interest in consensus."
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

const ENEMIES = {
  restlessGuardsman: {
    id: "restlessGuardsman",
    name: "Restless Guardsman",
    description: "A Deveran man-at-arms in tarnished mail, still walking his old post at the gate long after anyone told him to stop.",
    image: "assets/images/enemies/restless-guardsman.png",
    hitPoints: 22,
    attackType: "physical",
    threatTier: "Novice",
    lootTable: ["Old Ore", "Grave Essence"]
  },
  wailingWraith: {
    id: "wailingWraith",
    name: "Wailing Wraith",
    description: "A grief-shaped thing that was once someone's kin, its voice alone enough to make the air feel colder.",
    image: "assets/images/enemies/wailing-wraith.png",
    hitPoints: 16,
    attackType: "magic",
    threatTier: "Novice",
    lootTable: ["Grave Essence", "Grave Essence"]
  },
  graveBoundHound: {
    id: "graveBoundHound",
    name: "Grave-Bound Hound",
    description: "A hound long dead, its collar still bearing a clan crest, moving with a hunter's memory rather than a hunter's breath.",
    image: "assets/images/enemies/grave-bound-hound.png",
    hitPoints: 14,
    attackType: "physical",
    threatTier: "Novice",
    lootTable: ["Hide"]
  },
  hollowRetainer: {
    id: "hollowRetainer",
    name: "Hollow Retainer",
    description: "Something pale that drifts more than walks, humming a tune with no tune left to it.",
    image: "assets/images/enemies/hollow-retainer.png",
    hitPoints: 18,
    attackType: "magic",
    threatTier: "Novice",
    lootTable: ["Grave Essence"]
  },
  rotHandedSteward: {
    id: "rotHandedSteward",
    name: "Rot-Handed Steward",
    description: "Once a keeper of this keep's stores, now keeping only its dark.",
    image: "assets/images/enemies/rot-handed-steward.png",
    hitPoints: 20,
    attackType: "physical",
    threatTier: "Novice",
    lootTable: ["Old Ore"]
  },
  chiefsShade: {
    id: "chiefsShade",
    name: "The Chief's Shade",
    description: "Wearing the shape of a Deveran chief, its ancestral magic curdled into something that answers to no bloodline at all.",
    image: "assets/images/enemies/chiefs-shade.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Adept",
    lootTable: ["Chief's Signet", "Grave Essence", "Grave Essence"]
  },

  bogWight: {
    id: "bogWight",
    name: "Bog Wight",
    description: "A drowned thing risen from the black water, weed-wrapped and slow but relentless.",
    image: "assets/images/enemies/bog-wight.png",
    hitPoints: 18,
    attackType: "physical",
    threatTier: "Novice",
    lootTable: ["Hide"]
  },
  drownedShieldman: {
    id: "drownedShieldman",
    name: "Drowned Shieldman",
    description: "A Drakvarr warrior lost with his ship, still holding a shield gone green with rot.",
    image: "assets/images/enemies/drowned-shieldman.png",
    hitPoints: 20,
    attackType: "physical",
    threatTier: "Novice",
    lootTable: ["Old Ore"]
  },
  runehauntedThrall: {
    id: "runehauntedThrall",
    name: "Rune-Haunted Thrall",
    description: "A servant bound to the hall in life, and bound to it still, rune-marks glowing faintly under drowned skin.",
    image: "assets/images/enemies/runehaunted-thrall.png",
    hitPoints: 16,
    attackType: "magic",
    threatTier: "Novice",
    lootTable: ["Grave Essence"]
  },
  tidewrackedDraugr: {
    id: "tidewrackedDraugr",
    name: "Tidewracked Draugr",
    description: "Once the hall's own chieftain, now something the tide never quite finished taking.",
    image: "assets/images/enemies/tidewracked-draugr.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Adept",
    lootTable: ["Draugr Rune-Ring", "Grave Essence", "Grave Essence"]
  },

  rootboundHusk: {
    id: "rootboundHusk",
    name: "Rootbound Husk",
    description: "A body long claimed by the grove, roots grown through and around what's left of it.",
    image: "assets/images/enemies/rootbound-husk.png",
    hitPoints: 18,
    attackType: "physical",
    threatTier: "Novice",
    lootTable: ["Hide"]
  },
  whisperingBriar: {
    id: "whisperingBriar",
    name: "Whispering Briar",
    description: "A tangle of thorn and old magic that seems to know exactly where you're standing without looking.",
    image: "assets/images/enemies/whispering-briar.png",
    hitPoints: 15,
    attackType: "magic",
    threatTier: "Novice",
    lootTable: ["Grave Essence"]
  },
  mossHound: {
    id: "mossHound",
    name: "Moss-Grown Hound",
    description: "A hunting hound, dead a very long time, moss thick over old bones that still move like they remember the chase.",
    image: "assets/images/enemies/moss-hound.png",
    hitPoints: 16,
    attackType: "physical",
    threatTier: "Novice",
    lootTable: ["Hide"]
  },
  theBarrowKeeper: {
    id: "theBarrowKeeper",
    name: "The Barrow Keeper",
    description: "Once a druid who tended these grave-mounds, now something the mounds tend in return.",
    image: "assets/images/enemies/the-barrow-keeper.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Adept",
    lootTable: ["Barrow Sigil", "Grave Essence", "Grave Essence"]
  },

  cairnbornSentinel: {
    id: "cairnbornSentinel",
    name: "Cairn-Born Sentinel",
    description: "A guardian raised from stacked stone and older grief, standing watch over graves that no longer need watching.",
    image: "assets/images/enemies/cairnborn-sentinel.png",
    hitPoints: 30,
    attackType: "physical",
    threatTier: "Adept",
    lootTable: ["Old Ore"]
  },
  emberTouchedWraith: {
    id: "emberTouchedWraith",
    name: "Ember-Touched Wraith",
    description: "A restless spirit wreathed faintly in wrongly-colored fire, ancestral magic gone brittle and strange.",
    image: "assets/images/enemies/ember-touched-wraith.png",
    hitPoints: 26,
    attackType: "magic",
    threatTier: "Adept",
    lootTable: ["Grave Essence"]
  },
  kinlessShade: {
    id: "kinlessShade",
    name: "Kinless Shade",
    description: "A shade that belongs to no clan mark anyone can name — cast out even in death.",
    image: "assets/images/enemies/kinless-shade.png",
    hitPoints: 28,
    attackType: "magic",
    threatTier: "Adept",
    lootTable: ["Grave Essence"]
  },
  theUnnamedAncestor: {
    id: "theUnnamedAncestor",
    name: "The Unnamed Ancestor",
    description: "Whatever bloodline this once belonged to, no living clan will claim it now.",
    image: "assets/images/enemies/the-unnamed-ancestor.png",
    hitPoints: 50,
    attackType: "magic",
    threatTier: "Expert",
    lootTable: ["Ancestor's Ember", "Grave Essence", "Grave Essence"]
  },

  frostboundWarrior: {
    id: "frostboundWarrior",
    name: "Frostbound Warrior",
    description: "A Drakvarr fighter frozen mid-stride, ice thick over old armor, still swinging.",
    image: "assets/images/enemies/frostbound-warrior.png",
    hitPoints: 32,
    attackType: "physical",
    threatTier: "Adept",
    lootTable: ["Old Ore"]
  },
  iceboundShaman: {
    id: "iceboundShaman",
    name: "Icebound Shaman",
    description: "A shaman whose rune-casting froze mid-ritual, and never quite finished.",
    image: "assets/images/enemies/icebound-shaman.png",
    hitPoints: 27,
    attackType: "magic",
    threatTier: "Adept",
    lootTable: ["Grave Essence"]
  },
  rimeforgedGolem: {
    id: "rimeforgedGolem",
    name: "Rime-Forged Golem",
    description: "A forge-guardian of ice and old iron, built to protect the vault's finest work.",
    image: "assets/images/enemies/rimeforged-golem.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Adept",
    lootTable: ["Old Ore"]
  },
  theFrozenSmith: {
    id: "theFrozenSmith",
    name: "The Frozen Smith",
    description: "The vault's greatest rune-smith, still at their anvil, still not quite finished with whatever they were making.",
    image: "assets/images/enemies/the-frozen-smith.png",
    hitPoints: 52,
    attackType: "magic",
    threatTier: "Expert",
    lootTable: ["Frostforged Rune", "Grave Essence", "Grave Essence"]
  },

  thornwovenStalker: {
    id: "thornwovenStalker",
    name: "Thornwoven Stalker",
    description: "Something that moves like a person and hunts like a thicket, thorns woven through what was once a Gaeldrim cloak.",
    image: "assets/images/enemies/thornwoven-stalker.png",
    hitPoints: 34,
    attackType: "physical",
    threatTier: "Expert",
    lootTable: ["Hide"]
  },
  stoneboundVoice: {
    id: "stoneboundVoice",
    name: "Stonebound Voice",
    description: "One of the standing stones, or something speaking through it — hard to say which, harder to argue with.",
    image: "assets/images/enemies/stonebound-voice.png",
    hitPoints: 30,
    attackType: "magic",
    threatTier: "Expert",
    lootTable: ["Grave Essence"]
  },
  tuathRemnant: {
    id: "tuathRemnant",
    name: "Túath Remnant",
    description: "One of the gathered dead, still standing in the circle it died arguing in.",
    image: "assets/images/enemies/tuath-remnant.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Expert",
    lootTable: ["Hide"]
  },
  theConsensus: {
    id: "theConsensus",
    name: "The Consensus",
    description: "Not one voice but many, fused together into something that no longer needs to agree with anyone.",
    image: "assets/images/enemies/the-consensus.png",
    hitPoints: 60,
    attackType: "magic",
    threatTier: "Master",
    lootTable: ["Vale Sigil", "Grave Essence", "Grave Essence", "Grave Essence"]
  }
};

const SPELLS = {
  ancestralAverick: [
    { id: "flametouchedBlade", name: "Flametouched Blade", type: "enchant", description: "Wreathes your weapon in fire for a few rounds, adding burn to every strike." },
    { id: "frostbiteEdge", name: "Frostbite Edge", type: "enchant", description: "Chills your blade to biting cold for a few rounds." },
    { id: "stormedge", name: "Stormedge", type: "enchant", description: "Charges your weapon with crackling energy for a few rounds." },
    { id: "emberweight", name: "Emberweight", type: "enchant", description: "Weighs your strikes with smoldering ember-heat for a few rounds." },
    { id: "thunderbrand", name: "Thunderbrand", type: "enchant", description: "Brands your weapon with a rolling thunderclap for a few rounds." },
    { id: "glacialEdge", name: "Glacial Edge", type: "enchant", description: "Coats your blade in unnatural frost for a few rounds." }
  ],
  ancestralSiuloir: [
    { id: "ancestralMending", name: "Ancestral Mending", type: "heal", description: "Calls on a healer ancestor's blessing to mend your wounds." }
  ],
  ancestralEmyrs: [
    { id: "fireball", name: "Fireball", type: "damage", description: "A burst of raw fire, called directly from the elements." },
    { id: "frostbolt", name: "Frostbolt", type: "damage", description: "A bolt of unnatural cold." },
    { id: "stoneshard", name: "Stoneshard", type: "damage", description: "Earth wrenched violently into a jagged shard." },
    { id: "galeburst", name: "Galeburst", type: "damage", description: "Wind driven to a cutting edge." },
    { id: "tideclaw", name: "Tideclaw", type: "damage", description: "Water given sudden, violent shape." },
    { id: "emberlash", name: "Emberlash", type: "damage", description: "A whip of fire, quick and unpredictable." }
  ],

  runeBlade: [
    { id: "rageRune", name: "Rage Rune", type: "buff", description: "Carves a rune of fury, strengthening your next few strikes." },
    { id: "bloodfuryMark", name: "Bloodfury Mark", type: "buff", description: "A mark that turns battle-heat into raw strength for a few rounds." },
    { id: "warcryRune", name: "Warcry Rune", type: "buff", description: "A rune spoken aloud, sharpening your next few attacks." },
    { id: "battleRuneStrike", name: "Battle-Rune Strike", type: "buff", description: "A rune carved mid-swing, fueling ferocity for a few rounds." },
    { id: "furyrune", name: "Furyrune", type: "buff", description: "A rune that answers battle with more battle." },
    { id: "ironbloodRune", name: "Ironblood Rune", type: "buff", description: "A rune that hardens resolve into raw power." }
  ],
  runeShield: [
    { id: "ironruneGuard", name: "Ironrune Guard", type: "guard", description: "Hardens your stance against harm for a few rounds." },
    { id: "bulwarkMark", name: "Bulwark Mark", type: "guard", description: "A rune meant to hold a shield wall, lent to just you." },
    { id: "stonewallRune", name: "Stonewall Rune", type: "guard", description: "A rune that turns your footing to stone, briefly." },
    { id: "wardRuneRiposte", name: "Ward-Rune Riposte", type: "guard", description: "A defensive rune that steadies you against the next blows." },
    { id: "shieldsongRune", name: "Shieldsong Rune", type: "guard", description: "An old rune sung by shield-bearers before a charge." },
    { id: "deflectionMark", name: "Deflection Mark", type: "guard", description: "A rune that turns harm aside before it lands." }
  ],
  runeVision: [
    { id: "omenmark", name: "Omenmark", type: "debuff", description: "Marks your foe with a rune of ill omen, weakening them for a few rounds." },
    { id: "ravensightRune", name: "Ravensight Rune", type: "debuff", description: "Sees as the raven sees, revealing an opening in your foe's guard." },
    { id: "foreseenOpening", name: "Foreseen Opening", type: "debuff", description: "A glimpse ahead shows exactly where your foe will falter." },
    { id: "seersWarning", name: "Seer's Warning", type: "debuff", description: "An omen-rune unsettles your foe's footing for a few rounds." },
    { id: "fateglimpse", name: "Fateglimpse", type: "debuff", description: "A brief look at how this fight ends, used against them." },
    { id: "threadcutVision", name: "Threadcut Vision", type: "debuff", description: "A vision of a thread best cut now." }
  ],
  runeCurse: [
    { id: "witheringHex", name: "Withering Hex", type: "dot", description: "A rune that saps your foe's strength, festering over a few rounds." },
    { id: "doomrune", name: "Doomrune", type: "dot", description: "A hex marking your foe for lingering misfortune." },
    { id: "blightmark", name: "Blightmark", type: "dot", description: "A rune that spreads like rot over a few rounds." },
    { id: "hexbind", name: "Hexbind", type: "dot", description: "A curse that tangles and wears down a foe over time." },
    { id: "curseweave", name: "Curseweave", type: "dot", description: "Several small hexes, woven into one lingering curse." },
    { id: "illFortuneRune", name: "Ill-Fortune Rune", type: "dot", description: "A rune that turns luck against its target, over and over." }
  ],

  pathWild: [
    { id: "wolfsCall", name: "Wolf's Call", type: "companion", description: "Calls a spectral wolf to fight beside you for the rest of the battle." },
    { id: "stagsCharge", name: "Stag's Charge", type: "companion", description: "Calls a great stag to strike alongside you for the rest of the battle." },
    { id: "talonkin", name: "Talonkin", type: "companion", description: "Calls a taloned hunter to your side for the rest of the battle." },
    { id: "houndbond", name: "Houndbond", type: "companion", description: "Calls a loyal hound to fight at your side for the rest of the battle." },
    { id: "beastclawBond", name: "Beastclaw Bond", type: "companion", description: "Calls a clawed beast companion for the rest of the battle." },
    { id: "wardenOfClaws", name: "Warden of Claws", type: "companion", description: "Calls a fierce guardian beast for the rest of the battle." }
  ],
  pathGrove: [
    { id: "grovesBlessing", name: "Grove's Blessing", type: "heal", description: "The grove's quiet strength restores you." }
  ],
  pathStorm: [
    { id: "lightningLash", name: "Lightning Lash", type: "damage", description: "A crack of lightning arcs to your foe." },
    { id: "thunderclap", name: "Thunderclap", type: "damage", description: "A crack of sound and force together." },
    { id: "squallstrike", name: "Squallstrike", type: "damage", description: "A sudden, violent gust." },
    { id: "frostgale", name: "Frostgale", type: "damage", description: "A cold wind that bites like a blade." },
    { id: "stormcall", name: "Stormcall", type: "damage", description: "A small piece of a much larger storm." },
    { id: "windshear", name: "Windshear", type: "damage", description: "A gust sharp enough to cut." }
  ],
  pathBarrow: [
    { id: "graspOfTheDead", name: "Grasp of the Dead", type: "dot", description: "Unseen hands from below drag at your foe, over and over." },
    { id: "barrowsChill", name: "Barrow's Chill", type: "dot", description: "A grave-chill that saps strength over a few rounds." },
    { id: "bonewhisper", name: "Bonewhisper", type: "dot", description: "A whisper from old bones that lingers and gnaws." },
    { id: "gravehand", name: "Gravehand", type: "dot", description: "A hand that shouldn't move, moving again and again." },
    { id: "shroudtouch", name: "Shroudtouch", type: "dot", description: "A touch cold as burial cloth, slow to fade." },
    { id: "wraithcall", name: "Wraithcall", type: "dot", description: "A restless spirit, called to wear your foe down." }
  ]
};

const STARTING_EQUIPMENT = {
  swords: "Old Sword",
  axes: "Worn Axe",
  archery: "Simple Bow",
  plateArmor: "Worn Plate Armor",
  chainArmor: "Worn Chainmail",
  leatherArmor: "Worn Leather Armor",
  clothArmor: "Worn Cloth Robes"
};

const CRAFTING_RECIPES = {
  craftSword: { id: "craftSword", name: "Sword", craftingSkill: "smithing", linkedSkill: "swords", material: "Old Ore", materialCost: 2 },
  craftAxe: { id: "craftAxe", name: "Axe", craftingSkill: "smithing", linkedSkill: "axes", material: "Old Ore", materialCost: 2 },
  craftBow: { id: "craftBow", name: "Bow", craftingSkill: "smithing", linkedSkill: "archery", material: "Old Ore", materialCost: 1 },
  craftPlate: { id: "craftPlate", name: "Plate Armor", craftingSkill: "smithing", linkedSkill: "plateArmor", material: "Old Ore", materialCost: 3 },
  craftChain: { id: "craftChain", name: "Chainmail", craftingSkill: "smithing", linkedSkill: "chainArmor", material: "Old Ore", materialCost: 2 },
  craftLeather: { id: "craftLeather", name: "Leather Armor", craftingSkill: "tailoring", linkedSkill: "leatherArmor", material: "Hide", materialCost: 2 },
  craftCloth: { id: "craftCloth", name: "Cloth Robes", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 },
  craftEnchantment: { id: "craftEnchantment", name: "Minor Enchantment", craftingSkill: "enchanting", linkedSkill: null, material: "Grave Essence", materialCost: 2 }
};

const DUNGEON_CONTENT = {
  duncairnKeep: {
    startRoomId: "gateway",
    rooms: {
      gateway: {
        text: "The gates of Duncairn Keep stand open, rusted from disuse rather than force. Fog pools around the threshold like it's reluctant to follow you in. Somewhere above, a banner snaps in wind you can't feel down here.",
        choices: [
          { label: "Step through the gate", type: "goto", target: "courtyard" }
        ]
      },
      courtyard: {
        text: "Weeds have split the flagstones of the courtyard, and a dry well sits crooked near the far wall. The great doors to the hall stand ahead, banded in iron gone the color of old blood.",
        choices: [
          { label: "Cross to the hall doors", type: "goto", target: "greatHallDoors" },
          { label: "Search the old well (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "wellFind", failureTarget: "houndAmbush" }
        ]
      },
      wellFind: {
        text: "The well is dry, but wedged in its cracked stones you find a scrap of old ore, worn smooth by whoever hid it there.",
        loot: ["Old Ore"],
        choices: [
          { label: "Head to the hall doors", type: "goto", target: "greatHallDoors" }
        ]
      },
      houndAmbush: {
        text: "Something moves at the mouth of the well before you can look twice — a hound long dead, its collar still bearing a clan crest, lunges from the dark.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "graveBoundHound", target: "greatHallDoors" }
        ]
      },
      greatHallDoors: {
        text: "The iron-banded doors groan against years of rust. Beyond them, faint torchlight flickers where no living hand should be tending a flame.",
        choices: [
          { label: "Push the doors open", type: "goto", target: "greatHallFight" }
        ]
      },
      greatHallFight: {
        text: "A guardsman in tarnished mail turns at the sound of the doors — too slowly, too stiffly, his eyes fixed on a war that ended long ago.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "restlessGuardsman", target: "greatHall" }
        ]
      },
      greatHall: {
        text: "The Great Hall opens around you, its long table still set for a feast no one came to eat. Dust lies thick over silver gone black with age. A side door leads to what might once have been an armory.",
        choices: [
          { label: "Move deeper into the keep", type: "goto", target: "diningHall" },
          { label: "Search the old armory (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "armory", failureTarget: "diningHall" }
        ]
      },
      armory: {
        text: "Racks of rusted weapons line the armory walls. Wedged behind a fallen shield, a scrap of old writing — a bloodline technique, half-remembered.",
        choices: [
          { label: "Study the technique (Line of Averick)", type: "discover", skillId: "ancestralAverick", spellId: "stormedge", target: "diningHall" },
          { label: "Leave it and move on", type: "goto", target: "diningHall" }
        ]
      },
      diningHall: {
        text: "A side room off the hall, chairs overturned, as if the last meal ended badly. A door to the north leads toward what look like the keep's private chambers. A smaller door leads to what was once a library.",
        choices: [
          { label: "Continue north", type: "goto", target: "bannerHall" },
          { label: "Search the library (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "library", failureTarget: "bannerHall" }
        ]
      },
      library: {
        text: "Most of the books have rotted to pulp, but one journal, sealed in wax, has survived — a wizard's notes, still legible.",
        choices: [
          { label: "Study the notes (Line of Emyrs)", type: "discover", skillId: "ancestralEmyrs", spellId: "frostbolt", target: "bannerHall" },
          { label: "Leave it and move on", type: "goto", target: "bannerHall" }
        ]
      },
      bannerHall: {
        text: "Deveran clan banners hang in tatters along this corridor, each stitched with a different clan mark — none of them the chief's own.",
        choices: [
          { label: "Search among the banners (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "bannerLoot", failureTarget: "corridor" },
          { label: "Move on", type: "goto", target: "corridor" }
        ]
      },
      bannerLoot: {
        text: "Behind one banner, you find a pouch someone hid and never came back for.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Continue", type: "goto", target: "corridor" }
        ]
      },
      corridor: {
        text: "A narrow corridor slopes down on one side toward cold, damp air, and climbs on the other toward a stairwell of pale stone. A second hound blocks the way up, hackles raised over a collar it no longer needs.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "graveBoundHound", target: "stairwell" }
        ]
      },
      stairwell: {
        text: "The stairwell forks: one flight climbs toward what was once the chief's solar, the other descends toward the keep's crypts.",
        choices: [
          { label: "Climb to the solar", type: "goto", target: "solarRoom" },
          { label: "Descend to the crypts", type: "goto", target: "cryptEntrance" }
        ]
      },
      solarRoom: {
        text: "The solar is a ruin of fine furniture and rot. Something pale drifts near the shattered window, humming a tune with no tune to it.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "hollowRetainer", target: "solarAftermath" }
        ]
      },
      solarAftermath: {
        text: "Beneath the wreckage of a writing desk, you find a bundle of grave-warm essence, still faintly glowing.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Descend toward the chief's door", type: "goto", target: "chiefsDoor" }
        ]
      },
      cryptEntrance: {
        text: "The crypt entrance is close and dark, lined with alcoves. Something with too many teeth is curled in the nearest one, not quite sleeping.",
        choices: [
          { label: "Slip past quietly (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "cryptPast", failureTarget: "cryptFight" }
        ]
      },
      cryptFight: {
        text: "It wakes before you're halfway past — a steward, once, his hands blackened with rot, rising to bar your way.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rotHandedSteward", target: "cryptPast" }
        ]
      },
      cryptPast: {
        text: "Past the alcoves, an old strongbox sits half-buried in rubble, its lock long since rusted through.",
        loot: ["Old Ore", "Grave Essence"],
        choices: [
          { label: "Climb back toward the chief's door", type: "goto", target: "chiefsDoor" }
        ]
      },
      chiefsDoor: {
        text: "Both paths end here, at a door carved with the same crest that flew over every banner in this keep — whole, unmarked, and very cold to the touch.",
        choices: [
          { label: "Open the door", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Inside, something wearing the shape of a Deveran chief turns from an empty throne. Its ancestral magic has curdled into something that answers to no line at all.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "chiefsShade", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Shade dissolves into the dust it should have become years ago. Duncairn Keep is silent again — properly, finally silent — and whatever kept its gates from rusting shut seems to have gone with it.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  sunkenLonghall: {
    startRoomId: "shoreline",
    rooms: {
      shoreline: {
        text: "Black bog-water laps at a half-sunken longhall, its roof-runes still glowing faint blue beneath a crust of algae. The entrance is a dark gap where the doors used to be.",
        choices: [
          { label: "Wade toward the entrance", type: "goto", target: "entryHall" }
        ]
      },
      entryHall: {
        text: "The entry hall is waterlogged and dim. Driftwood and old fishing nets have washed in with the tide. Something shifts beneath the water near the far wall.",
        choices: [
          { label: "Cross the hall", type: "goto", target: "greatRoomDoors" },
          { label: "Search the driftwood (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "driftwoodFind", failureTarget: "wightAmbush" }
        ]
      },
      driftwoodFind: {
        text: "Tangled in the driftwood, a scrap of good hide, still usable.",
        loot: ["Hide"],
        choices: [
          { label: "Continue to the doors", type: "goto", target: "greatRoomDoors" }
        ]
      },
      wightAmbush: {
        text: "The shifting shape rises from the black water — a bog wight, weed-wrapped and slow, but closing fast.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "bogWight", target: "greatRoomDoors" }
        ]
      },
      greatRoomDoors: {
        text: "The doors to the great room hang half-open, rune-carved rafters visible beyond, still faintly glowing.",
        choices: [
          { label: "Push through", type: "goto", target: "shieldmanFight" }
        ]
      },
      shieldmanFight: {
        text: "A drowned shieldman turns at the sound, shield raised, rot-green and slow but still remembering how to fight.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "drownedShieldman", target: "greatRoom" }
        ]
      },
      greatRoom: {
        text: "The great room's long table is warped from the water, but the rune-carved rafters above still burn faint blue. A side chamber holds what looks like the shaman's own alcove.",
        choices: [
          { label: "Move toward the rune archive", type: "goto", target: "runeArchive" },
          { label: "Move deeper into the hall", type: "goto", target: "corridor" }
        ]
      },
      runeArchive: {
        text: "The shaman's alcove is dry, somehow, untouched by the flood. Carved tablets line the walls — one still legible.",
        choices: [
          { label: "Study the tablet (Runes of the Blade)", type: "discover", skillId: "runeBlade", spellId: "bloodfuryMark", target: "corridor" },
          { label: "Leave it and move on", type: "goto", target: "corridor" }
        ]
      },
      corridor: {
        text: "A flooded corridor leads deeper into the hall. A rune-haunted thrall drifts into view, glowing marks faint under drowned skin.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "runehauntedThrall", target: "fork" }
        ]
      },
      fork: {
        text: "The corridor splits: one way climbs toward drier ground and a second archive, the other descends toward what feels like the hall's oldest chamber.",
        choices: [
          { label: "Climb toward the second archive", type: "goto", target: "secondArchive" },
          { label: "Descend toward the old chamber", type: "goto", target: "oldChamberFight" }
        ]
      },
      secondArchive: {
        text: "A second set of tablets, less water-damaged than the first. One still reads clearly.",
        choices: [
          { label: "Study the tablet (Runes of the Vision)", type: "discover", skillId: "runeVision", spellId: "ravensightRune", target: "converge" }
        ]
      },
      oldChamberFight: {
        text: "The old chamber holds another drowned shieldman, standing guard over nothing in particular anymore.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "drownedShieldman", target: "converge" }
        ]
      },
      converge: {
        text: "Both paths lead to the same flooded stairwell, descending toward a chamber where the water runs strangely still.",
        choices: [
          { label: "Descend", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "The still water hides something moving just beneath the surface. You could try to slip past quietly, or simply wade through and take what comes.",
        choices: [
          { label: "Slip past quietly (Stealth)", type: "check", skillId: "stealth", difficulty: "Novice", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "Whatever was beneath the water rises before you can pass — a bog wight, hungrier than the last.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "bogWight", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "A final door, carved with a ship's prow, stands at the end of the flooded hall — cold, and strangely dry to the touch.",
        choices: [
          { label: "Open the door", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Inside, a figure rises from a throne of driftwood and rope — the hall's own chieftain, tidewracked, still holding the shape of command.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "tidewrackedDraugr", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Draugr collapses into black water and weed, and the rune-light overhead finally, quietly, goes out. The Sunken Longhall is just a ruin now.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  wychrootGrove: {
    startRoomId: "groveEdge",
    rooms: {
      groveEdge: {
        text: "The tree line swallows the light almost immediately. Roots as thick as your waist have grown up and over old grave-mounds, and the air smells of wet earth and something older.",
        choices: [
          { label: "Step into the grove", type: "goto", target: "innerPath" }
        ]
      },
      innerPath: {
        text: "The path narrows between close-grown trees. Something rustles in the underbrush — could be nothing, could be a mossbound hound.",
        choices: [
          { label: "Push forward carefully", type: "goto", target: "clearingDoors" },
          { label: "Search the underbrush (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "underbrushFind", failureTarget: "houndAmbush" }
        ]
      },
      underbrushFind: {
        text: "Tangled in a thornbush, a scrap of hide from some animal that didn't get away in time.",
        loot: ["Hide"],
        choices: [
          { label: "Continue on", type: "goto", target: "clearingDoors" }
        ]
      },
      houndAmbush: {
        text: "The rustling was a moss-grown hound after all — dead a long time, moving like it still remembers the hunt.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "mossHound", target: "clearingDoors" }
        ]
      },
      clearingDoors: {
        text: "The trees open onto a wide clearing, thick with grave-mounds. A rootbound husk stands motionless among them, until it isn't.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rootboundHusk", target: "clearing" }
        ]
      },
      clearing: {
        text: "The clearing is ringed with old carved stones, half-swallowed by moss. One stone bears markings still readable, if you look closely.",
        choices: [
          { label: "Read the marked stone", type: "goto", target: "markedStone" },
          { label: "Move deeper into the grove", type: "goto", target: "deeperPath" }
        ]
      },
      markedStone: {
        text: "The marking is old druidic knotwork, half a spell captured in stone.",
        choices: [
          { label: "Learn what remains (Path of the Wild)", type: "discover", skillId: "pathWild", spellId: "stagsCharge", target: "deeperPath" },
          { label: "Leave it and move on", type: "goto", target: "deeperPath" }
        ]
      },
      deeperPath: {
        text: "The trees grow closer together here, roots interlocking overhead like a second canopy. A whispering briar blocks the way, thorns twitching toward you.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "whisperingBriar", target: "fork" }
        ]
      },
      fork: {
        text: "The path splits around a fallen, hollowed tree: one way circles left through thicker growth, the other cuts right past a second ring of stones.",
        choices: [
          { label: "Circle left", type: "goto", target: "leftPathFight" },
          { label: "Cut right, past the stones", type: "goto", target: "rightPathStudy" }
        ]
      },
      leftPathFight: {
        text: "Thicker growth means another rootbound husk, roused by your footsteps.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rootboundHusk", target: "converge" }
        ]
      },
      rightPathStudy: {
        text: "The second ring of stones is better preserved than the first, its knotwork still sharp.",
        choices: [
          { label: "Study the knotwork (Path of the Storm)", type: "discover", skillId: "pathStorm", spellId: "frostgale", target: "converge" }
        ]
      },
      converge: {
        text: "Both paths lead to the same place: a wide grave-mound, larger than the rest, roots grown thick and deliberate around its edges.",
        choices: [
          { label: "Approach the great mound", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "Something moves at the base of the mound — not quite hidden, not quite waiting either. You could try to slip past, or simply meet it head-on.",
        choices: [
          { label: "Slip past quietly (Stealth)", type: "check", skillId: "stealth", difficulty: "Novice", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "It notices you before you can pass — another whispering briar, thorns already moving.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "whisperingBriar", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "A gap opens in the roots at the mound's base, dark and close, leading down into the earth itself.",
        choices: [
          { label: "Descend into the mound", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Inside, a figure kneels among the roots — once a druid, tending these graves, now something the graves tend in return.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theBarrowKeeper", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Keeper dissolves into loam and root, and the grove, for the first time, feels merely old rather than watching. The Wychroot Grove is quiet.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  hollowmereCairn: {
    startRoomId: "moorEdge",
    rooms: {
      moorEdge: {
        text: "The moor stretches out under a bruised sky, heather thick between scattered burial mounds. Faint elemental light — red, then blue — leaks from cracks in the largest cairn ahead.",
        choices: [
          { label: "Cross the moor toward the largest cairn", type: "goto", target: "outerMounds" }
        ]
      },
      outerMounds: {
        text: "Smaller mounds ring the largest one, each marked with a different clan sign. A cairn-born sentinel stands among them, stone shifting as you approach.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "cairnbornSentinel", target: "moundPath" },
          { label: "Try to slip past unseen (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "moundPath", failureTarget: "sentinelAmbush" }
        ]
      },
      sentinelAmbush: {
        text: "It notices you halfway past, stone grinding as it turns to intercept.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "cairnbornSentinel", target: "moundPath" }
        ]
      },
      moundPath: {
        text: "A path winds between the mounds toward the central cairn. Wisps of colored light drift along the ground here, unnaturally bright.",
        choices: [
          { label: "Continue toward the central cairn", type: "goto", target: "wraithEncounter" },
          { label: "Follow the light-wisps (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "wispFind", failureTarget: "wraithEncounter" }
        ]
      },
      wispFind: {
        text: "The wisps lead to a half-buried cache, old ore still good beneath the dirt.",
        loot: ["Old Ore"],
        choices: [
          { label: "Continue toward the central cairn", type: "goto", target: "wraithEncounter" }
        ]
      },
      wraithEncounter: {
        text: "An ember-touched wraith drifts across the path, wreathed in fire that shouldn't still be burning after all this time.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "emberTouchedWraith", target: "cairnEntrance" }
        ]
      },
      cairnEntrance: {
        text: "The central cairn's entrance is a dark gap between leaning stones, elemental light pulsing faintly from within. A smaller side-cairn nearby looks less disturbed.",
        choices: [
          { label: "Enter the central cairn", type: "goto", target: "innerCairn" },
          { label: "Check the smaller side-cairn first", type: "goto", target: "sideCairn" }
        ]
      },
      sideCairn: {
        text: "The side-cairn holds old grave goods, mostly ruined — except for one scrap of ancestral writing, still whole.",
        choices: [
          { label: "Study the writing (Line of Averick)", type: "discover", skillId: "ancestralAverick", spellId: "frostbiteEdge", target: "innerCairn" },
          { label: "Leave it and enter the central cairn", type: "goto", target: "innerCairn" }
        ]
      },
      innerCairn: {
        text: "Inside, the passage narrows, walls lined with old clan markings that pulse faintly in time with the light ahead. A kinless shade drifts into view, belonging to no mark you recognize.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "kinlessShade", target: "deepPassage" }
        ]
      },
      deepPassage: {
        text: "The passage splits: one way leads toward a chamber that smells of old fire, the other toward one that hums faintly with something else.",
        choices: [
          { label: "Take the fire-scented passage", type: "goto", target: "fireChamberFight" },
          { label: "Take the humming passage", type: "goto", target: "hummingChamberStudy" }
        ]
      },
      fireChamberFight: {
        text: "The fire-scented chamber holds another ember-touched wraith, flames guttering strangely around it.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "emberTouchedWraith", target: "converge" }
        ]
      },
      hummingChamberStudy: {
        text: "The humming chamber holds a wizard's cache, one page of notes still intact despite everything.",
        choices: [
          { label: "Study the notes (Line of Emyrs)", type: "discover", skillId: "ancestralEmyrs", spellId: "stoneshard", target: "converge" }
        ]
      },
      converge: {
        text: "Both passages open onto the same final chamber — the heart of the cairn, where the light is brightest and the air feels thin.",
        choices: [
          { label: "Approach the heart of the cairn", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "Something waits at the threshold, barely visible in the shifting light. You could try to read the moment and move carefully, or simply push through.",
        choices: [
          { label: "Read the moment carefully (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "It resolves into a kinless shade, faster than the last, already closing.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "kinlessShade", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "The final chamber's entrance is a ring of stones, light pulsing between them like something breathing.",
        choices: [
          { label: "Step through the ring", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "At the center, a figure made of shifting, colored fire turns toward you — an ancestor no clan will claim, its gift long since curdled into something else.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theUnnamedAncestor", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Ancestor scatters into embers and goes dark. The Hollowmere Cairn's light fades with it, leaving only ordinary moor and ordinary stone.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  frosthollowVault: {
    startRoomId: "glacierEntrance",
    rooms: {
      glacierEntrance: {
        text: "The entrance is a dark gap in the ice, jagged icicles hanging like teeth. Faint blue rune-light glows somewhere deep inside.",
        choices: [
          { label: "Step into the vault", type: "goto", target: "outerIce" }
        ]
      },
      outerIce: {
        text: "The outer chamber is thick with frost, old forge-tools half-buried in snowdrift. A frostbound warrior stands motionless nearby, ice thick over old armor.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "frostboundWarrior", target: "innerPath" },
          { label: "Move quietly around it (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "innerPath", failureTarget: "warriorAmbush" }
        ]
      },
      warriorAmbush: {
        text: "Ice cracks as it turns toward you before you can slip past.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "frostboundWarrior", target: "innerPath" }
        ]
      },
      innerPath: {
        text: "The passage narrows, walls veined with frozen rune-light. A side alcove looks less disturbed than the rest of the tunnel.",
        choices: [
          { label: "Continue deeper", type: "goto", target: "shamanEncounter" },
          { label: "Check the alcove (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "alcoveFind", failureTarget: "shamanEncounter" }
        ]
      },
      alcoveFind: {
        text: "The alcove holds a cache of good ore, untouched by frost.",
        loot: ["Old Ore"],
        choices: [
          { label: "Continue deeper", type: "goto", target: "shamanEncounter" }
        ]
      },
      shamanEncounter: {
        text: "An icebound shaman stands mid-ritual, frozen at the exact moment it never finished casting — until it does.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "iceboundShaman", target: "forgeHallDoors" }
        ]
      },
      forgeHallDoors: {
        text: "Wide doors, rimed in frost, lead into what must be the forge hall proper. A smaller passage branches off to one side.",
        choices: [
          { label: "Enter the forge hall", type: "goto", target: "forgeHall" },
          { label: "Take the side passage first", type: "goto", target: "sidePassageStudy" }
        ]
      },
      sidePassageStudy: {
        text: "The side passage ends in a small shrine, one rune-tablet still legible beneath the frost.",
        choices: [
          { label: "Study the tablet (Runes of the Shield)", type: "discover", skillId: "runeShield", spellId: "stonewallRune", target: "forgeHall" },
          { label: "Leave it and enter the forge hall", type: "goto", target: "forgeHall" }
        ]
      },
      forgeHall: {
        text: "The forge hall is vast and frozen mid-work — half-finished blades still clamped in ice, tools scattered where they were dropped. A rime-forged golem stands guard over the anvil.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rimeforgedGolem", target: "fork" }
        ]
      },
      fork: {
        text: "Beyond the forge, the vault splits: one passage climbs toward what looks like a rune-archive, the other descends toward colder, darker air.",
        choices: [
          { label: "Climb toward the archive", type: "goto", target: "archiveStudy" },
          { label: "Descend into the cold", type: "goto", target: "coldPassageFight" }
        ]
      },
      archiveStudy: {
        text: "The archive holds rows of frozen tablets. One, cracked but readable, catches your eye.",
        choices: [
          { label: "Study the tablet (Runes of the Curse)", type: "discover", skillId: "runeCurse", spellId: "blightmark", target: "converge" }
        ]
      },
      coldPassageFight: {
        text: "The cold passage holds another frostbound warrior, patient and slow but no less dangerous for it.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "frostboundWarrior", target: "converge" }
        ]
      },
      converge: {
        text: "Both paths end at a final ice-sealed door, faint blue light pulsing steadily from beyond it.",
        choices: [
          { label: "Approach the door", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "Something is working just beyond the door — you can hear the faint ring of a hammer, over and over. You could try to time your approach, or simply enter.",
        choices: [
          { label: "Time your approach (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "The hammering stops the moment you're spotted — a rime-forged golem, roused and ready.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rimeforgedGolem", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "The ice-sealed door gives way easily, colder air pouring out from whatever lies beyond.",
        choices: [
          { label: "Enter", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "At the anvil, a figure still works — the vault's greatest rune-smith, frozen mid-strike on a piece that was never quite finished, and never will be.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theFrozenSmith", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Smith's hammer falls still at last, and the blue rune-light fades from the walls. Frosthollow Vault is only ice now, and silence.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  hollowVale: {
    startRoomId: "valeEdge",
    rooms: {
      valeEdge: {
        text: "The vale opens wide and empty under a darkening sky, a great ring of standing stones visible at its center, carved with druidic knotwork. Long shadows stretch toward you across the grass.",
        choices: [
          { label: "Cross the vale toward the stones", type: "goto", target: "outerRing" }
        ]
      },
      outerRing: {
        text: "A thornwoven stalker moves at the edge of your vision, thorns woven through what was once a Gaeldrim cloak.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "thornwovenStalker", target: "innerVale" },
          { label: "Try to avoid it (Stealth)", type: "check", skillId: "stealth", difficulty: "Expert", successTarget: "innerVale", failureTarget: "stalkerAmbush" }
        ]
      },
      stalkerAmbush: {
        text: "It catches your movement before you can pass unseen.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "thornwovenStalker", target: "innerVale" }
        ]
      },
      innerVale: {
        text: "Closer to the ring, the grass gives way to bare, cracked earth. A faint green-white light pulses from the center of the stone circle. A smaller cluster of stones stands off to one side.",
        choices: [
          { label: "Move toward the smaller cluster", type: "goto", target: "smallCluster" },
          { label: "Head straight for the ring", type: "goto", target: "voiceEncounter" }
        ]
      },
      smallCluster: {
        text: "The smaller stones are older, their knotwork worn nearly smooth — except for one line, still sharp.",
        choices: [
          { label: "Read the line (Path of the Barrow)", type: "discover", skillId: "pathBarrow", spellId: "bonewhisper", target: "voiceEncounter" },
          { label: "Leave it and continue", type: "goto", target: "voiceEncounter" }
        ]
      },
      voiceEncounter: {
        text: "One of the standing stones speaks — or something speaking through it — as you draw near, and the air itself seems to answer.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "stoneboundVoice", target: "ringApproach" }
        ]
      },
      ringApproach: {
        text: "The great ring is close now, tuath remnants visible standing motionless between the stones, still arranged as if for a gathering. One side of the ring holds a lone standing stone, apart from the rest.",
        choices: [
          { label: "Approach the lone stone", type: "goto", target: "loneStoneStudy" },
          { label: "Move straight through the gathering", type: "goto", target: "remnantFight" }
        ]
      },
      loneStoneStudy: {
        text: "The lone stone's carving is different from the rest — a storm-pattern, still humming faintly with old weather.",
        choices: [
          { label: "Study the pattern (Path of the Storm)", type: "discover", skillId: "pathStorm", spellId: "thunderclap", target: "remnantFight" }
        ]
      },
      remnantFight: {
        text: "The gathered dead stir as you pass between them — a Túath remnant, still standing in the circle it died arguing in.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "tuathRemnant", target: "innerRing" }
        ]
      },
      innerRing: {
        text: "Inside the great ring, the ground is cracked open at the very center, green-white light pulsing up from beneath. The air hums with something that isn't quite sound.",
        choices: [
          { label: "Approach the crack in the earth", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "The light pulses faster the closer you get, and for a moment it feels almost like being watched by many eyes at once. You could try to steady yourself and time your approach, or simply step forward.",
        choices: [
          { label: "Steady yourself and approach carefully (Survival)", type: "check", skillId: "survival", difficulty: "Expert", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "The ground itself seems to resist you — another thornwoven stalker, faster than the last, rising from the cracked earth.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "thornwovenStalker", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "The crack in the earth widens just enough to step through, green-white light washing over everything.",
        choices: [
          { label: "Step down into the light", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Below, the light resolves into something that was once many voices and is now only one — the Túath's old consensus, fused into a single, unyielding will.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theConsensus", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Consensus scatters into a hundred fading voices, and then into none at all. The Hollow Vale is silent, and for the first time in a very long while, actually empty.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  }
};
