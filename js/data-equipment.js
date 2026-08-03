/* ============================================================
   DATA-EQUIPMENT.JS
   Starting gear, crafting recipes, enchantment types, combat styles.
   ============================================================ */

const STARTING_EQUIPMENT = {
  swords: "Old Sword",
  axes: "Worn Axe",
  archery: "Simple Bow",
  daggers: "Worn Dagger",
  twoHanded: "Worn Greatsword"
};

const STARTING_ARMOR_SETS = {
  plateArmor: ["Plate Helm (Novice-crafted)", "Plate Cuirass (Novice-crafted)", "Plate Greaves (Novice-crafted)", "Plate Gauntlets (Novice-crafted)", "Plate Boots (Novice-crafted)"],
  chainArmor: ["Chain Coif (Novice-crafted)", "Chain Hauberk (Novice-crafted)", "Chain Chausses (Novice-crafted)", "Chain Gauntlets (Novice-crafted)", "Chain Boots (Novice-crafted)"],
  leatherArmor: ["Leather Cap (Novice-crafted)", "Leather Jerkin (Novice-crafted)", "Leather Leggings (Novice-crafted)", "Leather Gloves (Novice-crafted)", "Leather Boots (Novice-crafted)"],
  clothArmor: ["Cloth Hood (Novice-crafted)", "Cloth Robe (Novice-crafted)", "Cloth Trousers (Novice-crafted)", "Cloth Gloves (Novice-crafted)", "Cloth Shoes (Novice-crafted)"]
};

const CRAFTING_RECIPES = {
  craftSword: { id: "craftSword", name: "Sword", category: "weapon", craftingSkill: "smithing", linkedSkill: "swords", material: "Old Ore", materialCost: 2 },
  craftAxe: { id: "craftAxe", name: "Axe", category: "weapon", craftingSkill: "smithing", linkedSkill: "axes", material: "Old Ore", materialCost: 2 },
  craftBow: { id: "craftBow", name: "Bow", category: "weapon", craftingSkill: "smithing", linkedSkill: "archery", material: "Old Ore", materialCost: 1 },
  craftDagger: { id: "craftDagger", name: "Dagger", category: "weapon", craftingSkill: "smithing", linkedSkill: "daggers", material: "Old Ore", materialCost: 1 },
  craftGreatsword: { id: "craftGreatsword", name: "Greatsword", category: "weapon", craftingSkill: "smithing", linkedSkill: "twoHanded", material: "Old Ore", materialCost: 3 },
  craftPlateHelm: { id: "craftPlateHelm", name: "Plate Helm", category: "armor", slot: "head", craftingSkill: "smithing", linkedSkill: "plateArmor", material: "Old Ore", materialCost: 2 },
  craftPlateCuirass: { id: "craftPlateCuirass", name: "Plate Cuirass", category: "armor", slot: "chest", craftingSkill: "smithing", linkedSkill: "plateArmor", material: "Old Ore", materialCost: 3 },
  craftPlateGreaves: { id: "craftPlateGreaves", name: "Plate Greaves", category: "armor", slot: "legs", craftingSkill: "smithing", linkedSkill: "plateArmor", material: "Old Ore", materialCost: 2 },
  craftPlateGauntlets: { id: "craftPlateGauntlets", name: "Plate Gauntlets", category: "armor", slot: "gloves", craftingSkill: "smithing", linkedSkill: "plateArmor", material: "Old Ore", materialCost: 2 },
  craftPlateBoots: { id: "craftPlateBoots", name: "Plate Boots", category: "armor", slot: "boots", craftingSkill: "smithing", linkedSkill: "plateArmor", material: "Old Ore", materialCost: 2 },

  craftChainCoif: { id: "craftChainCoif", name: "Chain Coif", category: "armor", slot: "head", craftingSkill: "smithing", linkedSkill: "chainArmor", material: "Old Ore", materialCost: 1 },
  craftChainHauberk: { id: "craftChainHauberk", name: "Chain Hauberk", category: "armor", slot: "chest", craftingSkill: "smithing", linkedSkill: "chainArmor", material: "Old Ore", materialCost: 2 },
  craftChainChausses: { id: "craftChainChausses", name: "Chain Chausses", category: "armor", slot: "legs", craftingSkill: "smithing", linkedSkill: "chainArmor", material: "Old Ore", materialCost: 1 },
  craftChainGauntlets: { id: "craftChainGauntlets", name: "Chain Gauntlets", category: "armor", slot: "gloves", craftingSkill: "smithing", linkedSkill: "chainArmor", material: "Old Ore", materialCost: 1 },
  craftChainBoots: { id: "craftChainBoots", name: "Chain Boots", category: "armor", slot: "boots", craftingSkill: "smithing", linkedSkill: "chainArmor", material: "Old Ore", materialCost: 1 },

  craftLeatherCap: { id: "craftLeatherCap", name: "Leather Cap", category: "armor", slot: "head", craftingSkill: "tailoring", linkedSkill: "leatherArmor", material: "Hide", materialCost: 1 },
  craftLeatherJerkin: { id: "craftLeatherJerkin", name: "Leather Jerkin", category: "armor", slot: "chest", craftingSkill: "tailoring", linkedSkill: "leatherArmor", material: "Hide", materialCost: 2 },
  craftLeatherLeggings: { id: "craftLeatherLeggings", name: "Leather Leggings", category: "armor", slot: "legs", craftingSkill: "tailoring", linkedSkill: "leatherArmor", material: "Hide", materialCost: 1 },
  craftLeatherGloves: { id: "craftLeatherGloves", name: "Leather Gloves", category: "armor", slot: "gloves", craftingSkill: "tailoring", linkedSkill: "leatherArmor", material: "Hide", materialCost: 1 },
  craftLeatherBoots: { id: "craftLeatherBoots", name: "Leather Boots", category: "armor", slot: "boots", craftingSkill: "tailoring", linkedSkill: "leatherArmor", material: "Hide", materialCost: 1 },

  craftClothHood: { id: "craftClothHood", name: "Cloth Hood", category: "armor", slot: "head", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 },
  craftClothRobe: { id: "craftClothRobe", name: "Cloth Robe", category: "armor", slot: "chest", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 },
  craftClothTrousers: { id: "craftClothTrousers", name: "Cloth Trousers", category: "armor", slot: "legs", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 },
  craftClothGloves: { id: "craftClothGloves", name: "Cloth Gloves", category: "armor", slot: "gloves", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 },
  craftClothShoes: { id: "craftClothShoes", name: "Cloth Shoes", category: "armor", slot: "boots", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 },
  craftShield: { id: "craftShield", name: "Shield", category: "armor", craftingSkill: "smithing", linkedSkill: "shields", material: "Old Ore", materialCost: 2 }
};

const ENCHANTMENT_TYPES = {
  flame: { id: "flame", name: "Flame", description: "A burning enchantment. On armor: moderate defense, plus a chance to burn attackers back when struck." },
  frost: { id: "frost", name: "Frost", description: "A chilling enchantment. On armor: moderate defense, plus a chance to chill an attacker's next strike." },
  storm: { id: "storm", name: "Storm", description: "A crackling enchantment. On armor: moderate defense, plus a chance to fully deflect a blow." },
  ward: { id: "ward", name: "Ward", description: "A protective enchantment. On armor: the strongest raw defense boost, steady and reliable, no chance-based effect." },
  curse: { id: "curse", name: "Curse", description: "A dark enchantment. On armor: moderate defense, plus a chance to curse an attacker with a lingering hex." },
  vision: { id: "vision", name: "Vision", description: "A far-seeing enchantment. On armor: a strong, reliable defense boost, watchful and steady, no chance-based effect." }
};

const ARMOR_ENCHANT_EFFECTS = {
  flame: { defenseBonus: 1, procType: "counterBurn", procChance: 0.5 },
  frost: { defenseBonus: 1, procType: "chill", procChance: 0.5 },
  storm: { defenseBonus: 1, procType: "deflect", procChance: 0.5 },
  ward: { defenseBonus: 2, procType: null, procChance: 0 },
  curse: { defenseBonus: 1, procType: "counterCurse", procChance: 0.5 },
  vision: { defenseBonus: 2, procType: null, procChance: 0 }
};

const ENCHANT_MATERIAL = "Grave Essence";
const ENCHANT_MATERIAL_COST = 2;

// ----------------------------------------------------------
// COMBAT STYLES
// spellDamageBonus and healBonus are new fields (default 0 on
// the original weapon-focused styles) — they shift the tier
// used for damage-spell and heal-spell rolls respectively,
// separate from the weapon-focused attackBonus/defenseBonus.
// ----------------------------------------------------------
const COMBAT_STYLES = {
  single: {
    id: "single",
    name: "Single Weapon",
    description: "One weapon, no shield — balanced and simple.",
    attackBonus: 0,
    defenseBonus: 0,
    spellDamageBonus: 0,
    healBonus: 0,
    supportBonus: 0
  },
  dual: {
    id: "dual",
    name: "Dual Wielding",
    description: "Two weapons at once — no shield, but hits harder.",
    attackBonus: 1,
    defenseBonus: 0,
    spellDamageBonus: 0,
    healBonus: 0
  },
  swordShield: {
    id: "swordShield",
    name: "Sword & Shield",
    description: "A blade paired with a shield — steady and defensive.",
    attackBonus: 0,
    defenseBonus: 1,
    spellDamageBonus: 0,
    healBonus: 0
  },
  axeShield: {
    id: "axeShield",
    name: "Axe & Shield",
    description: "A heavier blade paired with a shield — sturdy and forceful.",
    attackBonus: 0,
    defenseBonus: 1,
    spellDamageBonus: 0,
    healBonus: 0
  },
  caster: {
    id: "caster",
    name: "Spellcaster",
    description: "Focuses raw magical power into damaging spells rather than melee combat.",
    attackBonus: 0,
    defenseBonus: 0,
    spellDamageBonus: 1,
    healBonus: 0
  },
  healer: {
    id: "healer",
    name: "Healer",
    description: "Channels magic toward mending wounds rather than dealing harm.",
    attackBonus: 0,
    defenseBonus: 0,
    spellDamageBonus: 0,
    healBonus: 1,
    supportBonus: 0
  },
  bard: {
    id: "bard",
    name: "Bard",
    description: "Focuses magic toward buffs and hexes rather than raw damage or healing — songs and rites land stronger and last longer in your hands.",
    attackBonus: 0,
    defenseBonus: 0,
    spellDamageBonus: 0,
    healBonus: 0,
    supportBonus: 1
  },
  archer: {
    id: "archer",
    name: "Archer",
    description: "Focuses on precision with a bow — you'll rarely miss, though each shot lands a touch softer than a dedicated melee strike.",
    attackBonus: 0,
    defenseBonus: 0,
    spellDamageBonus: 0,
    healBonus: 0
  },
  twoHanded: {
    id: "twoHanded",
    name: "Two-Handed",
    description: "A single heavy weapon gripped with both hands — hits far harder, but leaves you with less to guard yourself with.",
    attackBonus: 2,
    defenseBonus: -1,
    spellDamageBonus: 0,
    healBonus: 0
  },
  stealth: {
    id: "stealth",
    name: "Stealth",
    description: "Quick, quiet, and built around finding an opening rather than trading blows — a dagger in hand and a moment's hesitation is all it takes.",
    attackBonus: 0,
    defenseBonus: 1,
    spellDamageBonus: 0,
    healBonus: 0
  }
};

// ------------------------------------------------------------
// SHOP ITEMS
// Sold by the Wandering Trader at Homebase. One shared pool
// across all 5 cultures — any player can buy any item regardless
// of their own culture. "slot" determines where it equips:
// weapon (linkedSkill says which), armor (armorSlot says which),
// ring, or amulet. "effectId" is a label for the item's special
// mechanical effect — hooked into combat.js as a follow-up pass,
// not yet implemented for most of these (Fragarach is wired as
// the worked example).
// ------------------------------------------------------------
const SHOP_ITEMS = {
  fragarach: {
    id: "fragarach", name: "Fragarach", culture: "gaeldrim",
    slot: "weapon", linkedSkill: "swords",
    description: "The legendary \"Answerer\" — said to cut through any armor ever forged.",
    effectId: "defenseShredOnHit", price: 500, sellValue: 200
  },
  skofnungsEdge: {
    id: "skofnungsEdge", name: "Skofnung's Edge", culture: "drakvarr",
    slot: "weapon", linkedSkill: "axes",
    description: "Buried with a great chieftain — its wounds are said to never fully heal.",
    effectId: "dotOnHit", price: 500, sellValue: 200
  },
  yamaubasClaw: {
    id: "yamaubasClaw", name: "Yamauba's Claw", culture: "yorenshi",
    slot: "weapon", linkedSkill: "daggers",
    description: "Carved from the mountain witch's own claw — strikes faster than the eye can follow.",
    effectId: "flatAccuracyBonus", price: 300, sellValue: 120
  },
  dagdasClub: {
    id: "dagdasClub", name: "The Dagda's Club", culture: "gaeldrim",
    slot: "weapon", linkedSkill: "twoHanded",
    description: "One end kills, the other revives — the Dagda's own legendary weapon, or a fragment worthy of the name.",
    effectId: "heavyDamageAccuracyTradeoff", price: 300, sellValue: 120
  },
  cuSithsWarning: {
    id: "cuSithsWarning", name: "The Cù Sìth's Warning", culture: "deveran",
    slot: "weapon", linkedSkill: "archery",
    description: "Strung with sinew from the fairy hound that heralds death with three barks.",
    effectId: "executeOnWoundedHit", price: 800, sellValue: 320
  },
  anansiKnot: {
    id: "anansiKnot", name: "The Anansi Knot", culture: "vandiri",
    slot: "ring",
    description: "A woven-cord ring, tied by the trickster spider himself.",
    effectId: "flatPersuasionBonus", price: 200, sellValue: 80
  },
  nineTailedWard: {
    id: "nineTailedWard", name: "The Nine-Tailed Ward", culture: "yorenshi",
    slot: "amulet",
    description: "A charm said to carry a fox-spirit's own protective cunning.",
    effectId: "flatDodgeBonus", price: 400, sellValue: 160
  },
  kelpiesBridle: {
    id: "kelpiesBridle", name: "The Kelpie's Bridle", culture: "deveran",
    slot: "amulet",
    description: "A small bridle-shaped talisman, carrying a measure of the kelpie's own luring charm.",
    effectId: "flatSurvivalBonus", price: 200, sellValue: 80
  },
  ochrePaintedHide: {
    id: "ochrePaintedHide", name: "Ochre-Painted Hide", culture: "vandiri",
    slot: "armor", armorSlot: "chest", linkedSkill: "leatherArmor",
    description: "Ceremonial hide armor, said to be blessed by ancestral spirits the moment it's worn.",
    effectId: "flatMaxHpBonus", price: 500, sellValue: 200
  },
  morrigansCrowMask: {
    id: "morrigansCrowMask", name: "The Morrígan's Crow-Mask", culture: "gaeldrim",
    slot: "armor", armorSlot: "head", linkedSkill: "leatherArmor",
    description: "A mask said to let its wearer glimpse a battlefield moments before it happens.",
    effectId: "flatAttackAccuracyBonus", price: 500, sellValue: 200
  },
  silverHandedBlade: {
    id: "silverHandedBlade", name: "The Silver-Handed Blade", culture: "gaeldrim",
    slot: "weapon", linkedSkill: "swords",
    description: "Named for Nuada's silver arm, restored by a god of healing.",
    effectId: "healOnHit", price: 600, sellValue: 240
  },
  ivarrsLesserGrudge: {
    id: "ivarrsLesserGrudge", name: "Ivarr's Lesser Grudge", culture: "drakvarr",
    slot: "weapon", linkedSkill: "axes",
    description: "A lesser echo of a legend — damage builds with every consecutive hit landed.",
    effectId: "stackingDamageOnConsecutiveHits", price: 600, sellValue: 240
  },
  nukekubisEdge: {
    id: "nukekubisEdge", name: "The Nukekubi's Edge", culture: "yorenshi",
    slot: "weapon", linkedSkill: "daggers",
    description: "A blade said to sever cleanly in a single motion.",
    effectId: "defenseBypassOnHit", price: 600, sellValue: 240
  },
  baobhanSithsArrow: {
    id: "baobhanSithsArrow", name: "The Baobhan Sìth's Arrow", culture: "deveran",
    slot: "weapon", linkedSkill: "archery",
    description: "Fletched with hair from the blood-drinking fae — every shot drinks deep in turn.",
    effectId: "lifestealOnHit", price: 800, sellValue: 320
  },
  fomorianWard: {
    id: "fomorianWard", name: "The Fomorian Ward", culture: "gaeldrim",
    slot: "armor", armorSlot: "chest", linkedSkill: "plateArmor",
    description: "A captured Fomorian war-shield, reforged into wearable plate.",
    effectId: "flatDefenseBonus", price: 500, sellValue: 200
  },
  griotsMemoryBand: {
    id: "griotsMemoryBand", name: "Griot's Memory Band", culture: "vandiri",
    slot: "ring",
    description: "Said to hold a griot's endless recall.",
    effectId: "flatEnchantingBonus", price: 300, sellValue: 120
  },
  onryosTear: {
    id: "onryosTear", name: "The Onryō's Tear", culture: "yorenshi",
    slot: "amulet",
    description: "A vengeful spirit's grief, crystallized.",
    effectId: "fearOnHit", price: 500, sellValue: 200
  },
  tuathsBindingCoin: {
    id: "tuathsBindingCoin", name: "The Tuath's Binding Coin", culture: "gaeldrim",
    slot: "amulet",
    description: "An old consensus-token from a council long since scattered.",
    effectId: "flatMaxManaBonus", price: 500, sellValue: 200
  },
  sasabonsamsGrip: {
    id: "sasabonsamsGrip", name: "The Sasabonsam's Grip", culture: "vandiri",
    slot: "armor", armorSlot: "legs", linkedSkill: "leatherArmor",
    description: "Greaves said to root you to the canopy the way the beast itself never falls.",
    effectId: "flatDodgeBonus", price: 500, sellValue: 200
  },
  ashenPipersGauntlets: {
    id: "ashenPipersGauntlets", name: "The Ashen Piper's Gauntlets", culture: "deveran",
    slot: "armor", armorSlot: "gloves", linkedSkill: "chainArmor",
    description: "Worn by a keep's last defender, who never once stopped playing.",
    effectId: "flatAttackBonus", price: 500, sellValue: 200
  },
  nuesFang: {
    id: "nuesFang", name: "The Nue's Fang", culture: "yorenshi",
    slot: "weapon", linkedSkill: "swords",
    description: "Cut from the chimera-omen's own bite.",
    effectId: "bonusDamageVsWounded", price: 700, sellValue: 280
  },
  chainBoundCleaver: {
    id: "chainBoundCleaver", name: "The Chain-Bound Cleaver", culture: "drakvarr",
    slot: "weapon", linkedSkill: "axes",
    description: "Forged for a giant kept leashed for very good reason.",
    effectId: "bonusDamageFirstStrike", price: 700, sellValue: 280
  },
  silkThreadedEdge: {
    id: "silkThreadedEdge", name: "The Silk-Threaded Edge", culture: "vandiri",
    slot: "weapon", linkedSkill: "daggers",
    description: "A trickster's blade — never quite where you expect it.",
    effectId: "bonusBackstabDamage", price: 700, sellValue: 280
  },
  thrymsBrokenHammer: {
    id: "thrymsBrokenHammer", name: "Thrym's Broken Hammer", culture: "drakvarr",
    slot: "weapon", linkedSkill: "twoHanded",
    description: "A fragment of the giant-king's own weapon.",
    effectId: "stunChanceOnHit", price: 900, sellValue: 360
  },
  watcherOwlsEye: {
    id: "watcherOwlsEye", name: "The Watcher Owl's Eye", culture: "yorenshi",
    slot: "weapon", linkedSkill: "archery",
    description: "Fletched from a forest sentinel's own feathers.",
    effectId: "highAccuracyBonus", price: 800, sellValue: 320
  },
  stoneFathersSlab: {
    id: "stoneFathersSlab", name: "The Stone-Father's Slab", culture: "drakvarr",
    slot: "armor", armorSlot: "chest", linkedSkill: "plateArmor",
    description: "Hewn from the eldest troll's own hide.",
    effectId: "flatMaxHpBonus", price: 600, sellValue: 240
  },
  oathBrokenChampionsBand: {
    id: "oathBrokenChampionsBand", name: "The Oath-Broken Champion's Band", culture: "gaeldrim",
    slot: "ring",
    description: "Worn by a warrior who paid dearly for breaking his word.",
    effectId: "flatAttackAccuracyBonus", price: 500, sellValue: 200
  },
  whisperingImpsBell: {
    id: "whisperingImpsBell", name: "The Whispering Imp's Bell", culture: "vandiri",
    slot: "amulet",
    description: "Rings faintly, just before a bad bargain closes.",
    effectId: "flatPersuasionBonus", price: 300, sellValue: 120
  },
  draugrsReforgedMail: {
    id: "draugrsReforgedMail", name: "The Draugr's Reforged Mail", culture: "drakvarr",
    slot: "armor", armorSlot: "chest", linkedSkill: "chainArmor",
    description: "Taken from something that stopped needing it a long time ago.",
    effectId: "flatDefenseBonus", price: 600, sellValue: 240
  },
  siltFusedCrown: {
    id: "siltFusedCrown", name: "The Silt-Fused Crown", culture: "vandiri",
    slot: "armor", armorSlot: "head", linkedSkill: "clothArmor",
    description: "Worn by a shrine-keeper the swamp never let go of.",
    effectId: "flatMaxManaBonus", price: 600, sellValue: 240
  },
  lastChosensBlade: {
    id: "lastChosensBlade", name: "The Last Chosen's Blade", culture: "drakvarr",
    slot: "weapon", linkedSkill: "swords",
    description: "Carried by an einherjar who never earned his place in the hall the easy way.",
    effectId: "bonusAttackAtLowHp", price: 700, sellValue: 280
  },
  boneStrewnCleaver: {
    id: "boneStrewnCleaver", name: "The Bone-Strewn Cleaver", culture: "vandiri",
    slot: "weapon", linkedSkill: "axes",
    description: "Swung by something that never once needed to hide what it was surrounded by.",
    effectId: "bonusDamageVsFullHealth", price: 600, sellValue: 240
  },
  boundPerformersNeedle: {
    id: "boundPerformersNeedle", name: "The Bound Performer's Needle", culture: "yorenshi",
    slot: "weapon", linkedSkill: "daggers",
    description: "Biwa-strings fused into bleeding fingers, turned to a blade instead.",
    effectId: "reducedBackstabCooldown", price: 800, sellValue: 320
  },
  bridgewardTrollsMaul: {
    id: "bridgewardTrollsMaul", name: "The Bridgeward Troll's Maul", culture: "drakvarr",
    slot: "weapon", linkedSkill: "twoHanded",
    description: "Taken from something that never once moved off its crossing.",
    effectId: "flatDefenseBonusWhileWielded", price: 900, sellValue: 360
  },
  frostTouchedRavensTalon: {
    id: "frostTouchedRavensTalon", name: "The Frost-Touched Raven's Talon", culture: "deveran",
    slot: "weapon", linkedSkill: "archery",
    description: "Fletched from an omen bird that watched before it struck.",
    effectId: "bonusCriticalDamage", price: 800, sellValue: 320
  },
  chiefsShadesAegis: {
    id: "chiefsShadesAegis", name: "The Chief's Shade's Aegis", culture: "deveran",
    slot: "armor", armorSlot: "chest", linkedSkill: "plateArmor",
    description: "Carried by ancestral magic curdled into something answering no bloodline at all.",
    effectId: "chanceFullBlock", price: 1000, sellValue: 400
  },
  webSpinnersThread: {
    id: "webSpinnersThread", name: "The Web-Spinner's Thread", culture: "vandiri",
    slot: "ring",
    description: "Spun by the patient creature behind every one of Anansi's bargains.",
    effectId: "flatStealthBonus", price: 500, sellValue: 200
  },
  onmyojisTalisman: {
    id: "onmyojisTalisman", name: "The Onmyoji's Talisman", culture: "yorenshi",
    slot: "amulet",
    description: "Warding paper burned with pale spirit-fire.",
    effectId: "flatSpellDamageBonus", price: 600, sellValue: 240
  },
  battleBoundWraithsShroud: {
    id: "battleBoundWraithsShroud", name: "The Battle-Bound Wraith's Shroud", culture: "gaeldrim",
    slot: "armor", armorSlot: "chest", linkedSkill: "clothArmor",
    description: "Worn by a warrior frozen mid battle-cry, still ready.",
    effectId: "flatAttackAccuracyBonus", price: 600, sellValue: 240
  },
  graveWardensCowl: {
    id: "graveWardensCowl", name: "The Grave-Warden's Cowl", culture: "gaeldrim",
    slot: "armor", armorSlot: "head", linkedSkill: "leatherArmor",
    description: "Worn by something that's tended unmarked graves longer than anyone's kept count.",
    effectId: "flatMaxHpBonus", price: 600, sellValue: 240
  }
};

const SHOP_ITEM_EFFECT_TEXT = {
  fragarach: "40% chance on hit to weaken the enemy's defense for 3 rounds.",
  skofnungsEdge: "Chance on hit to apply a burning wound over time.",
  yamaubasClaw: "+1 accuracy on every attack.",
  dagdasClub: "Bigger damage every hit, at a small accuracy cost.",
  cuSithsWarning: "Bonus damage against badly-wounded enemies.",
  anansiKnot: "+15% success chance on Persuasion attempts.",
  nineTailedWard: "+15% success chance to flee combat.",
  kelpiesBridle: "+15% success chance on Survival checks.",
  ochrePaintedHide: "+20 maximum Hit Points.",
  morrigansCrowMask: "+1 accuracy on every attack.",
  silverHandedBlade: "Restores a small amount of Hit Points on every hit.",
  ivarrsLesserGrudge: "Damage builds with consecutive hits landed.",
  nukekubisEdge: "Bonus damage on every hit that bypasses some defense.",
  baobhanSithsArrow: "Heals you for 40% of damage dealt on every hit.",
  fomorianWard: "+1 to your defense.",
  griotsMemoryBand: "+15% success chance on Enchanting attempts.",
  onryosTear: "30% chance on hit to frighten the enemy.",
  tuathsBindingCoin: "+15 maximum Mana.",
  sasabonsamsGrip: "+1 to your dodge chance.",
  ashenPipersGauntlets: "+1 accuracy on every attack.",
  nuesFang: "Bonus damage against badly-wounded enemies.",
  chainBoundCleaver: "Bonus damage on your first strike each fight.",
  silkThreadedEdge: "Increases the bonus damage of your Backstab.",
  thrymsBrokenHammer: "25% chance on hit to stun the enemy.",
  watcherOwlsEye: "+2 accuracy on every attack.",
  stoneFathersSlab: "+20 maximum Hit Points.",
  oathBrokenChampionsBand: "+1 accuracy on every attack.",
  whisperingImpsBell: "+15% success chance on Persuasion attempts.",
  draugrsReforgedMail: "+1 to your defense.",
  siltFusedCrown: "+15 maximum Mana.",
  lastChosensBlade: "Bonus damage while your Hit Points are low.",
  boneStrewnCleaver: "Bonus damage against enemies at full health.",
  boundPerformersNeedle: "Backstab's cooldown is 1 round shorter.",
  bridgewardTrollsMaul: "+1 to your defense while equipped.",
  frostTouchedRavensTalon: "30% chance on hit to deal 50% bonus damage.",
  chiefsShadesAegis: "20% chance to fully block an incoming attack.",
  webSpinnersThread: "+15% success chance on Stealth checks.",
  onmyojisTalisman: "+1 to your spell damage.",
  battleBoundWraithsShroud: "+1 accuracy on every attack.",
  graveWardensCowl: "+20 maximum Hit Points."
};

const SHOP_STOCK_SIZE = 10;
const SHOP_STOCK_KEEP_COUNT = 3;
