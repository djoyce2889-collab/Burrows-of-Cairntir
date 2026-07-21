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
    healBonus: 0
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
    healBonus: 1
  },
  archer: {
    id: "archer",
    name: "Archer",
    description: "Focuses on precision with a bow — you'll rarely miss, though each shot lands a touch softer than a dedicated melee strike.",
    attackBonus: 0,
    defenseBonus: 0,
    spellDamageBonus: 0,
    healBonus: 0
  }
};
