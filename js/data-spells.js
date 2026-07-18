/* ============================================================
   DATA-SPELLS.JS
   Named spells for every magic line.
   ============================================================ */

const SPELLS = {
  ancestralAverick: [
    { id: "flametouchedBlade", name: "Flametouched Blade", type: "buff", description: "Wreathes your weapon in fire for a few rounds, strengthening every strike." },
    { id: "glacialEdge", name: "Glacial Edge", type: "buff", description: "Coats your blade in unnatural frost for a few rounds, strengthening every strike." },
    { id: "warbloodFury", name: "Warblood Fury", type: "buff", description: "The old warblood rises in you, strengthening your physical strikes for a time." },
    { id: "ancestorsVigor", name: "Ancestor's Vigor", type: "fortify", description: "Calls on the vitality of those who came before, granting a temporary reserve of extra Hit Points." },
    { id: "fleetbloodGrace", name: "Fleetblood Grace", type: "dodgeBuff", description: "Quickens your blood with old, evasive grace, making you harder to strike for a time." },
    { id: "ironbloodWard", name: "Ironblood Ward", type: "acBuff", description: "Hardens your bearing with ancestral resolve, turning aside blows more readily for a time." }
  ],
  ancestralSiuloir: [
    { id: "layOfMending", name: "Lay of Mending", type: "hot", description: "A soft healing song, sung to a lute's quiet rhythm — a steady mending for as long as it plays." },
    { id: "warChant", name: "War-Chant", type: "buff", description: "A driving battle-song that strengthens your physical strikes for as long as it plays." },
    { id: "balladOfVigor", name: "Ballad of Vigor", type: "fortify", description: "A rousing ballad that grants a reserve of extra Hit Points for as long as it plays." },
    { id: "hymnOfPower", name: "Hymn of Power", type: "spellDamageBuff", description: "A resonant hymn that strengthens your magic for as long as it plays." },
    { id: "luteSongOfTheDeepWell", name: "Lute-Song of the Deep Well", type: "manaRegen", description: "A slow, meditative melody that steadily restores your mana for as long as it plays." },
    { id: "dirgeOfRuin", name: "Dirge of Ruin", type: "dot", description: "A mournful dirge that wears away at your foe for as long as it plays." }
  ],

  ancestralEmyrs: [
    { id: "manaflow", name: "Manaflow", type: "manaRefund", description: "Draws raw magic back into yourself, instantly restoring a measure of mana." },
    { id: "aegisWard", name: "Aegis Ward", type: "absorb", description: "Wraps you in a ward of raw elemental force for a time, reducing every blow that lands against you." },
    { id: "somnusbind", name: "Somnusbind", type: "stun", description: "A binding of pure will that drops your foe into a sudden, total sleep, costing them their next action." },
    { id: "circleOfAegis", name: "Circle of Aegis", type: "groupAbsorb", description: "Extends a ward of raw elemental force over your whole party for a time, reducing every blow that lands against any of you." },
    { id: "mindshatter", name: "Mindshatter", type: "damage", description: "A direct assault on your foe's mind, striking with raw psychic force." },
    { id: "arcaneCataclysm", name: "Arcane Cataclysm", type: "burst", description: "The raw elements unleashed all at once, in a single devastating strike." }
  ],

  runeBlade: [
    { id: "bloodfuryMark", name: "Bloodfury Mark", type: "buff", description: "A mark that turns battle-heat into raw strength for a few rounds." },
    { id: "furyrune", name: "Furyrune", type: "burst", description: "A rune that answers battle with a single, devastating blow." },
    { id: "warcryRune", name: "Warcry Rune", type: "buffAndDebuff", description: "A rune spoken aloud, sharpening your next few attacks while unsettling your foe's." },
    { id: "ironruneGuard", name: "Ironrune Guard", type: "acBuff", description: "Hardens your stance against harm for a few rounds." },
    { id: "stonewallRune", name: "Stonewall Rune", type: "fortify", description: "A rune that turns your footing to stone, granting a reserve of extra Hit Points." },
    { id: "deflectionMark", name: "Deflection Mark", type: "absorb", description: "A rune that turns harm aside before it lands, reducing every blow for a few rounds." }
  ],

  runeVision: [
    { id: "foreseenOpening", name: "Foreseen Opening", type: "guaranteedHit", description: "A glimpse ahead shows exactly where your foe will falter — your next attack cannot fail to land." },
    { id: "ravensightRune", name: "Ravensight Rune", type: "guaranteedSpellHit", description: "Sees as the raven sees, revealing an opening in your foe's guard — your next spell cannot fail to land." },
    { id: "fateglimpse", name: "Fateglimpse", type: "guaranteedFollowerAction", description: "A brief look at how this fight ends, lent to a companion — their next action cannot fail." },
    { id: "seersWarning", name: "Seer's Warning", type: "guaranteedDodge", description: "An omen-rune shows you the blow before it falls — your foe's next attack cannot land." },
    { id: "threadcutVision", name: "Threadcut Vision", type: "guaranteedStun", description: "A vision of a thread best cut now — your foe loses their next turn, without fail." },
    { id: "omensEnd", name: "Omen's End", type: "execute", description: "A vision of the fight's final blow, made real — deals far greater harm the closer your foe already stands to defeat." }
  ],
  runeCurse: [
    { id: "witheringHex", name: "Withering Hex", type: "dot", description: "A rune that saps your foe's strength, festering over a few rounds." },
    { id: "doomrune", name: "Doomrune", type: "debuff", description: "A hex marking your foe for lingering misfortune, weakening their attacks for a time." },
    { id: "hexbind", name: "Hexbind", type: "stun", description: "A binding curse that tangles your foe's limbs, costing them their next turn entirely." },
    { id: "illFortuneRune", name: "Ill-Fortune Rune", type: "curseBack", description: "Turns your foe's own luck against them for a time — their strikes may yet fall on themselves instead." },
    { id: "bloodbondHex", name: "Bloodbond Hex", type: "groupHeal", description: "A dark pact that draws vitality from the fight itself, mending your whole party at once." },
    { id: "strengthstealRune", name: "Strengthsteal Rune", type: "buffAndDebuff", description: "Steals the raw strength from your foe's limbs and binds it to your own, weakening them as you grow stronger." }
  ],

  pathWild: [
    { id: "wolfsCall", name: "Wolf's Call", type: "companion", description: "Calls a spectral wolf to fight at your side for the rest of the battle — a heavy hitter, stronger than any ordinary strike." },
    { id: "thornward", name: "Thornward", type: "thornward", description: "Wraps you in living thorns for a time — whenever your foe strikes you, they take a reduced measure of damage back." },
    { id: "blightmist", name: "Blightmist", type: "dot", description: "A poisonous mist that clings only to your foe, doing harm over a few rounds." },
    { id: "naturesFortitude", name: "Nature's Fortitude", type: "fortify", description: "Roots your vitality in the wild for a time, granting a temporary reserve of extra Hit Points that absorbs harm first." },
    { id: "naturesWraith", name: "Nature's Wraith", type: "buff", description: "Calls on raw wild fury, strengthening your physical strikes for a time." },
    { id: "naturesBounty", name: "Nature's Bounty", type: "hot", description: "A slow, steady mending drawn from the land, restoring Hit Points over a few rounds." }
  ],
  pathGrove: [
    { id: "grovesBlessing", name: "Grove's Blessing", type: "heal", description: "The grove's quiet strength restores you, mending a measure of your wounds." },
    { id: "grovesProtection", name: "Grove's Protection", type: "groupHeal", description: "A wave of living strength washes over your whole party, mending wounds for everyone at once." },
    { id: "verdantBlight", name: "Verdant Blight", type: "dot", description: "A creeping rot that spreads through your foe, doing harm over a few rounds." },
    { id: "witheringGrasp", name: "Withering Grasp", type: "debuff", description: "Grasping roots sap your foe's strength, weakening their attacks for a time." },
    { id: "barkskin", name: "Barkskin", type: "guard", description: "Your skin hardens into living bark for a time, turning aside blows that would otherwise land true." },
    { id: "venomstrike", name: "Venomstrike", type: "damage", description: "A bolt of concentrated venom, striking your foe with raw toxic force." }
  ],
  pathStorm: [
    { id: "lightningLash", name: "Lightning Lash", type: "damage", description: "A crack of lightning arcs to your foe, striking true." },
    { id: "frostgale", name: "Frostgale", type: "damage", description: "A cold wind that bites like a blade, cutting deep." },
    { id: "stormcall", name: "Stormcall", type: "dot", description: "A small piece of a much larger storm, called down to batter your foe over several rounds." },
    { id: "windshear", name: "Windshear", type: "stun", description: "A gust sharp enough to knock your foe clean off their feet, costing them their next turn." },
    { id: "wildfireBolt", name: "Wildfire Bolt", type: "burst", description: "A lightning-sparked bolt of raw wildfire, striking with devastating force." },
    { id: "ashgale", name: "Ashgale", type: "dot", description: "A choking wind of embers and ash that clings to your foe, burning over several rounds." }
  ],
  pathBarrow: [
    {
    id: "hollowHound",
    name: "Hollow Hound",
    description: "Calls an undead hound up from the barrow to fight at your side for the rest of the dungeon.",
    type: "companion"
  },
  {
    id: "gravehunger",
    name: "Gravehunger",
    description: "Drains the life from your foe, damaging them and healing you for the same amount.",
    type: "lifetap"
  },
    { id: "graspOfTheDead", name: "Grasp of the Dead", type: "dot", description: "Unseen hands from below drag at your foe, over and over." },
    { id: "barrowsChill", name: "Barrow's Chill", type: "dot", description: "A grave-chill that saps strength over a few rounds." },
    { id: "bonewhisper", name: "Bonewhisper", type: "fear", description: "A whisper from old bones that unravels your foe's nerve, leaving them too shaken to act some rounds." },
    { id: "gravehand", name: "Gravehand", type: "undeadSlayer", description: "A grave-cold hand that reaches out and grips your foe — devastating against the undead, merely painful against the living." },
    { id: "shroudtouch", name: "Shroudtouch", type: "resurrect", description: "A burial-cloth touch that calls a fallen companion back from the edge, restoring them to the fight." },
    { id: "wraithcall", name: "Wraithcall", type: "burst", description: "A restless spirit hurled at your foe in a single devastating strike." }
  ]
};
