/* ============================================================
   DATA-EQUIPMENT.JS
   Starting gear, crafting recipes, enchantment types, combat styles.
   ============================================================ */

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
  craftSword: { id: "craftSword", name: "Sword", category: "weapon", craftingSkill: "smithing", linkedSkill: "swords", material: "Old Ore", materialCost: 2 },
  craftAxe: { id: "craftAxe", name: "Axe", category: "weapon", craftingSkill: "smithing", linkedSkill: "axes", material: "Old Ore", materialCost: 2 },
  craftBow: { id: "craftBow", name: "Bow", category: "weapon", craftingSkill: "smithing", linkedSkill: "archery", material: "Old Ore", materialCost: 1 },
  craftPlate: { id: "craftPlate", name: "Plate Armor", category: "armor", craftingSkill: "smithing", linkedSkill: "plateArmor", material: "Old Ore", materialCost: 3 },
  craftChain: { id: "craftChain", name: "Chainmail", category: "armor", craftingSkill: "smithing", linkedSkill: "chainArmor", material: "Old Ore", materialCost: 2 },
  craftLeather: { id: "craftLeather", name: "Leather Armor", category: "armor", craftingSkill: "tailoring", linkedSkill: "leatherArmor", material: "Hide", materialCost: 2 },
  craftCloth: { id: "craftCloth", name: "Cloth Robes", category: "armor", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 },
  craftShield: { id: "craftShield", name: "Shield", category: "armor", craftingSkill: "smithing", linkedSkill: null, material: "Old Ore", materialCost: 2 }
};

const ENCHANTMENT_TYPES = {
  flame: { id: "flame", name: "Flame", description: "A burning enchantment, aggressive and direct." },
  frost: { id: "frost", name: "Frost", description: "A chilling enchantment, cold and precise." },
  storm: { id: "storm", name: "Storm", description: "A crackling enchantment, wild and sharp." },
  ward: { id: "ward", name: "Ward", description: "A protective enchantment, steady and defensive." },
  curse: { id: "curse", name: "Curse", description: "A dark enchantment, patient and lingering." },
  vision: { id: "vision", name: "Vision", description: "A far-seeing enchantment, subtle and watchful." }
};

const ENCHANT_MATERIAL = "Grave Essence";
const ENCHANT_MATERIAL_COST = 2;

// ----------------------------------------------------------
// COMBAT STYLES
// Chosen once, during character creation. Dual Wielding trades
// all defense for extra offense; the shield combos trade some
// offense for extra defense. These are a permanent character
// choice, not something re-equipped mid-run.
// ----------------------------------------------------------
const COMBAT_STYLES = {
  single: {
    id: "single",
    name: "Single Weapon",
    description: "One weapon, no shield — balanced and simple.",
    attackBonus: 0,
    defenseBonus: 0
  },
  dual: {
    id: "dual",
    name: "Dual Wielding",
    description: "Two weapons at once — no shield, but hits harder.",
    attackBonus: 1,
    defenseBonus: 0
  },
  swordShield: {
    id: "swordShield",
    name: "Sword & Shield",
    description: "A blade paired with a shield — steady and defensive.",
    attackBonus: 0,
    defenseBonus: 1
  },
  axeShield: {
    id: "axeShield",
    name: "Axe & Shield",
    description: "A heavier blade paired with a shield — sturdy and forceful.",
    attackBonus: 0,
    defenseBonus: 1
  }
};
