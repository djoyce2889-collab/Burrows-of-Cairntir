/* ============================================================
   DATA-EQUIPMENT.JS
   Starting gear, crafting recipes, enchantment types, combat styles.
   ============================================================ */

const STARTING_EQUIPMENT = {
  swords: "Old Sword",
  axes: "Worn Axe",
  archery: "Simple Bow",
  daggers: "Worn Dagger"
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
