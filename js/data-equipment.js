/* ============================================================
   DATA-EQUIPMENT.JS
   Starting gear, crafting recipes, enchantment types.
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
  craftCloth: { id: "craftCloth", name: "Cloth Robes", category: "armor", craftingSkill: "tailoring", linkedSkill: "clothArmor", material: "Hide", materialCost: 1 }
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
