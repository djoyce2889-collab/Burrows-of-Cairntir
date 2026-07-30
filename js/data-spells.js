/* ============================================================
   DATA-SPELLS.JS
   Named spells for every magic line.
   ============================================================ */

const SPELLS = {
  riteProtection: [
    { id: "wardOfTheDeep", name: "Ward of the Deep", type: "autoRevive", description: "If you or a companion falls, this ward pulls them back — restoring more than an ordinary revival grants." },
    { id: "furysAnswer", name: "Fury's Answer", type: "onHitBuff", description: "Every blow that lands against you only sharpens your own strikes in answer." },
    { id: "mercysTouch", name: "Mercy's Touch", type: "onHitHeal", description: "Every blow that lands against you calls forth a measure of healing in turn." },
    { id: "deepCurrent", name: "Deep Current", type: "onHitManaRegen", description: "Every blow that lands against you stirs the deep waters, returning mana." },
    { id: "mothersCircle", name: "Mother's Circle", type: "onHitGroupHeal", description: "When harm touches any of your own, the whole circle is mended a little." },
    { id: "undertow", name: "Undertow", type: "onHitDebuff", description: "Whatever strikes you and yours is dragged down in turn, weakened for its trouble." },
    { id: "canopysWard", name: "Canopy's Ward", type: "absorb", description: "Calls on the cover of the high canopy to soften every blow that lands against you for a time." },
    { id: "swampboundVigil", name: "Swampbound Vigil", type: "groupAbsorb", description: "Extends the swamp's own protection over your whole party for a time, reducing every blow that lands against any of you." }
  ],

  riteUnmaking: [
    { id: "devouringGale", name: "Devouring Gale", type: "powerSteal", description: "Deals damage and steals strength itself — weakening the enemy's attacks while strengthening yours, for a few rounds." },
    { id: "vulnerabilityCurse", name: "Vulnerability Curse", type: "damageAmpDebuff", description: "A curse that leaves your foe exposed — every blow that lands against them, from any source, strikes a little harder for a time." },
    { id: "blindingCurse", name: "Blinding Curse", type: "accuracyDebuff", description: "Weakens only the enemy's own aim, making them more likely to miss you, without changing how easy they are to strike." },
    { id: "cripplingCurse", name: "Crippling Curse", type: "damageDebuff", description: "Weakens the raw force behind the enemy's blows, without affecting their aim." },
    { id: "exposingCurse", name: "Exposing Curse", type: "defenseDebuff", description: "Leaves the enemy's guard down, making them easier for you specifically to strike." },
    { id: "silencingCurse", name: "Silencing Curse", type: "spellLock", description: "Prevents the enemy from calling on their own magic next turn, forcing a plain attack instead." },
    { id: "unravelingRite", name: "Unraveling Rite", type: "debuff", description: "Loosens the threads holding your foe's strength together, weakening them for a time." }
  ],

  riteThunderWrath: [
    { id: "wrathUnbound", name: "Wrath Unbound", type: "dot", description: "A lingering wound of righteous fury that saps your foe's strength over a few rounds." },
    { id: "emberLash", name: "Ember-Lash", type: "companion", description: "Calls a fire elemental to fight at your side for the rest of the dungeon." },
    { id: "judgmentsWeight", name: "Judgment's Weight", type: "debuff", description: "Marks a foe as guilty, weakening their strikes for a time." },
    { id: "thunderCaller", name: "Thunder Caller", type: "companion", description: "Calls a lightning elemental to fight at your side for the rest of the dungeon." },
    { id: "warriorsFire", name: "Warrior's Resolve", type: "heal", description: "A burst of hard-won resolve, mending your wounds in an instant." },
    { id: "thunderstrike", name: "Thunderstrike", type: "doubleDrain", description: "A direct strike that drains your foe, returning both Hit Points and mana to you." }
  ],

  ancestralAverick: [
    { id: "flametouchedBlade", name: "Flametouched Blade", type: "buff", description: "Wreathes your weapon in fire for a few rounds, strengthening every strike." },
    { id: "glacialEdge", name: "Glacial Edge", type: "buff", description: "Coats your blade in unnatural frost for a few rounds, strengthening every strike." },
    { id: "warbloodFury", name: "Warblood Fury", type: "buff", description: "The old warblood rises in you, strengthening your physical strikes for a time." },
    { id: "ancestorsVigor", name: "Ancestor's Vigor", type: "fortify", description: "Calls on the vitality of those who came before, granting a temporary reserve of extra Hit Points." },
    { id: "fleetbloodGrace", name: "Fleetblood Grace", type: "dodgeBuff", description: "Quickens your blood with old, evasive grace, making you harder to strike for a time." },
    { id: "ironbloodWard", name: "Ironblood Ward", type: "acBuff", description: "Hardens your bearing with ancestral resolve, turning aside blows more readily for a time." }
  ],
  ancestralSiuloir: [
    { id: "layOfMending", name: "Lay of Mending", type: "hot", description: "A soft healing song, sung to a guitar's quiet rhythm — a steady mending for as long as it plays." },
    { id: "warChant", name: "War-Chant", type: "buff", description: "A driving battle-song beaten out on a bodhrán that strengthens your physical strikes for as long as it plays." },
    { id: "balladOfVigor", name: "Ballad of Vigor", type: "fortify", description: "A rousing ballad strummed on a guitar that grants a reserve of extra Hit Points for as long as it plays." },
    { id: "hymnOfPower", name: "Hymn of Power", type: "spellDamageBuff", description: "A resonant hymn beaten out on a bodhrán that strengthens your magic for as long as it plays." },
    { id: "luteSongOfTheDeepWell", name: "Lute-Song of the Deep Well", type: "manaRegen", description: "A slow, meditative melody plucked on a lute that steadily restores your mana for as long as it plays." },
    { id: "dirgeOfRuin", name: "Dirge of Ruin", type: "dot", description: "A mournful dirge piped on the bagpipes that wears away at your foe for as long as it plays." }
  ],

  ancestralEmyrs: [
    { id: "manaflow", name: "Manaflow", type: "manaRefund", description: "Draws raw magic back into yourself, instantly restoring a measure of mana." },
    { id: "aegisWard", name: "Aegis Ward", type: "absorb", description: "Wraps you in a ward of raw elemental force for a time, reducing every blow that lands against you." },
    { id: "somnusbind", name: "Somnusbind", type: "stun", description: "A binding of pure will that drops your foe into a sudden, total sleep, costing them their next action." },
    { id: "circleOfAegis", name: "Circle of Aegis", type: "groupAbsorb", description: "Extends a ward of raw elemental force over your whole party for a time, reducing every blow that lands against any of you." },
    { id: "mindshatter", name: "Mindshatter", type: "damage", description: "A direct assault on your foe's mind, striking with raw psychic force." },
    { id: "arcaneCataclysm", name: "Arcane Cataclysm", type: "burst", description: "The raw elements unleashed all at once, in a single devastating strike." },
    { id: "elementalSurge", name: "Elemental Surge", type: "buff", description: "Calls up a surge of raw current that sharpens every strike you land for a time." },
    { id: "rootwardensGift", name: "Rootwarden's Gift", type: "hot", description: "A slow, steady restoration drawn from the old growth itself, mending you over several rounds." },
    { id: "winterwardVigil", name: "Winterward Vigil", type: "acBuff", description: "Wraps you in a cold, unyielding ward, hardening you against incoming blows for a time." }
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
    { id: "omensEnd", name: "Omen's End", type: "execute", description: "A vision of the fight's final blow, made real — deals far greater harm the closer your foe already stands to defeat." },
    { id: "serpentsSightRune", name: "Serpent's Sight Rune", type: "guaranteedHit", description: "A carved vision of the strike before it lands — your next attack cannot miss." },
    { id: "giantskinRune", name: "Giantskin Rune", type: "fortify", description: "Etches a rune of borrowed hide across your own, granting a temporary reserve of extra Hit Points." }
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
    { id: "ashgale", name: "Ashgale", type: "dot", description: "A choking wind of embers and ash that clings to your foe, burning over several rounds." },
    { id: "ravensWarningPath", name: "Raven's Warning", type: "guaranteedDodge", description: "A flicker of foresight, the same kind that's warned warriors for centuries — you see the blow coming and step clean out of its path." }
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
    { id: "bonewhisper", name: "Bonewhisper", type: "fear", description: "A whisper from old bones that unravels your foe's nerve, leaving them too shaken to act some rounds." },
    { id: "shroudtouch", name: "Shroudtouch", type: "resurrect", description: "A burial-cloth touch that calls a fallen companion back from the edge, restoring them to the fight." },
    { id: "wraithcall", name: "Wraithcall", type: "burst", description: "A restless spirit hurled at your foe in a single devastating strike." },
    { id: "hostboundWard", name: "Hostbound Ward", type: "guard", description: "Calls on the old road-wardings, punishing anything that strikes at you or yours while it holds." },
    { id: "otherworldsThreshold", name: "Otherworld's Threshold", type: "damage", description: "Tears open a narrow seam to the Otherworld just long enough to strike through it." }
  ],

  wayTengu: [
    { id: "galeFistStrike", name: "Gale-Fist Strike", type: "damage", description: "A martial strike infused with mountain wind." },
    { id: "crowsTalon", name: "Crow's Talon", type: "burst", description: "A rapid flurry of strikes, harder-hitting than a normal blow." },
    { id: "rootStanceDiscipline", name: "Root-Stance Discipline", type: "guard", description: "A grounding stance that braces against incoming harm." },
    { id: "featherStep", name: "Feather-Step", type: "dodgeBuff", description: "Inhuman lightness of foot, slipping past incoming blows." },
    { id: "tengusEye", name: "Tengu's Eye", type: "guaranteedHit", description: "Perfect martial clarity — your next strike cannot miss." },
    { id: "mountainBreaker", name: "Mountain-Breaker", type: "execute", description: "A finishing blow that lands far harder against a badly wounded foe." },
    { id: "windingGale", name: "Winding Gale", type: "guaranteedDodge", description: "A sudden gust turns you aside from harm entirely, guaranteeing you dodge the next blow." }
  ],

  waySuijin: [
    { id: "biwaOfTheDeepCurrent", name: "Biwa of the Deep Current", type: "hot", description: "A sustained, flowing melody that mends the whole party's wounds over time." },
    { id: "biwaOfTheReturningTide", name: "Biwa of the Returning Tide", type: "groupHeal", description: "A fuller melody, restoring everyone at your side at once." },
    { id: "taikoOfTheStormsApproach", name: "Taiko of the Storm's Approach", type: "buff", description: "A driving rhythm that strengthens every ally's strikes." },
    { id: "taikoOfTheRagingSurf", name: "Taiko of the Raging Surf", type: "fortify", description: "A surging beat that grants the whole party temporary Hit Points." },
    { id: "shakuhachiOfTheWanderingDead", name: "Shakuhachi of the Wandering Dead", type: "fear", description: "A haunting tone that grips a foe with dread." },
    { id: "shakuhachiOfTheHollowWind", name: "Shakuhachi of the Hollow Wind", type: "accuracyDebuff", description: "An unsettling, off-key note that throws off a foe's aim." }
  ],

  wayYokai: [
    { id: "fireForm", name: "Fire Form", type: "buff", description: "Living flame wreathes your limbs, strengthening every strike." },
    { id: "waterForm", name: "Water Form", type: "lifetap", description: "Your body turns to living water, drawing life from your foe back into you." },
    { id: "earthForm", name: "Earth Form", type: "acBuff", description: "Your skin hardens to living stone, turning aside blows." },
    { id: "windForm", name: "Wind Form", type: "damageDebuff", description: "A scattering gale saps the force from your foe's every strike." },
    { id: "mistForm", name: "Mist Form", type: "guaranteedDodge", description: "Your body dissolves into drifting mist, letting the next blow pass through you entirely." },
    { id: "lightningForm", name: "Lightning Form", type: "burst", description: "Lightning wreathes your limbs for a swift, vicious extra strike." },
    { id: "wardensEye", name: "Warden's Eye", type: "guaranteedHit", description: "Borrows the watcher's own patient focus — your next strike cannot miss." }
  ],

  runeSong: [
    { id: "skaldsLayOfMending", name: "Skald's Lay of Mending", type: "hot", description: "A slow healing verse, sung to a nyckelharpa's droning strings — a steady mending for as long as it plays." },
    { id: "skaldsWarVerse", name: "Skald's War-Verse", type: "buff", description: "A driving battle-verse that strengthens your physical strikes for as long as it plays." },
    { id: "sagaOfVigor", name: "Saga of Vigor", type: "fortify", description: "A rousing saga that grants a reserve of extra Hit Points for as long as it plays." },
    { id: "skaldsRuneHymn", name: "Skald's Rune-Hymn", type: "spellDamageBuff", description: "A resonant rune-hymn that strengthens your magic for as long as it plays." },
    { id: "talharpasDeepDrone", name: "Talharpa's Deep Drone", type: "manaRegen", description: "A slow, meditative drone that steadily restores your mana for as long as it plays." },
    { id: "skaldsCurseVerse", name: "Skald's Curse-Verse", type: "dot", description: "A mournful curse-verse that wears away at your foe for as long as it plays." }
  ],

  riteGriot: [
    { id: "griotsHealingRefrain", name: "Griot's Healing Refrain", type: "hot", description: "A slow healing rhythm, drummed out steadily — a mending that continues for as long as it plays." },
    { id: "griotsWarPraise", name: "Griot's War-Praise", type: "buff", description: "A driving praise-rhythm that strengthens your physical strikes for as long as it plays." },
    { id: "griotsSongOfEndurance", name: "Griot's Song of Endurance", type: "fortify", description: "A rousing song of endurance that grants a reserve of extra Hit Points for as long as it plays." },
    { id: "griotsRhythmOfPower", name: "Griot's Rhythm of Power", type: "spellDamageBuff", description: "A resonant rhythm that strengthens your magic for as long as it plays." },
    { id: "kalimbasDeepPulse", name: "Kalimba's Deep Pulse", type: "manaRegen", description: "A slow, plucked pulse that steadily restores your mana for as long as it plays." },
    { id: "griotsLament", name: "Griot's Lament", type: "dot", description: "A mournful lament that wears away at your foe for as long as it plays." }
  ],

  ancestralFetch: [
    { id: "beithirForm", name: "Beithir Form", type: "burst", description: "A vast, wingless serpent-dragon of the glens, lightning-fast and venomous, striking once with a single devastating bite." },
    { id: "baobhanSithForm", name: "Baobhan Sìth Form", type: "lifetap", description: "A beautiful, deadly fae drains the life from your foe and makes it your own." },
    { id: "cuSidheForm", name: "Cù Sídhe Form", type: "buff", description: "A death-omen hound's silent ferocity floods your limbs, strengthening every strike." },
    { id: "catSithForm", name: "Cat-Sìth Form", type: "guaranteedDodge", description: "A soul-stealing fae cat's uncanny stillness lets the next blow pass you by entirely." },
    { id: "stagForm", name: "Stag Form", type: "acBuff", description: "A phantom Otherworld-stag's antlered bearing turns aside blows that would otherwise land true." },
    { id: "nuckelaveeForm", name: "Nuckelavee Form", type: "damageDebuff", description: "A skinless horse-shaped abomination's withering breath saps the force from your foe's every strike." }
  ],

  wayOnmyoji: [
    { id: "onryosWrath", name: "Shikigami: Onryō's Wrath", type: "companion", description: "A vengeful ghost, bound to your will, answers your call — it will fight at your side for the rest of this dungeon." },
    { id: "yureisVeil", name: "Shikigami: Yūrei's Veil", type: "absorb", description: "A pale, trailing spirit wraps itself around you, blunting the force of the next few blows you take." },
    { id: "nukekubisGrip", name: "Shikigami: Nukekubi's Grip", type: "stun", description: "A detached, flying spirit-head locks your foe in place with sheer dread, unable to act." },
    { id: "gashadokurosEye", name: "Shikigami: Gashadokuro's Eye", type: "guaranteedHit", description: "A vast skeletal spirit's unerring sight shows exactly where your next strike will land." },
    { id: "ubumesGift", name: "Shikigami: Ubume's Gift", type: "manaRefund", description: "A sorrowful spirit's burden, passed briefly into your hands, returns a measure of power to you." },
    { id: "onryosVigil", name: "Shikigami: Onryō's Vigil", type: "autoRevive", description: "The vengeful spirit keeps watch over the party, ready to pull a fallen ally back from the edge." },
    { id: "heikesLament", name: "Heike's Lament", type: "fear", description: "A fragment of the old unfinished song, sung back at your foe — unraveling their nerve entirely." }
  ]
};
