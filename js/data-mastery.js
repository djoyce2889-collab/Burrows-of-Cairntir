/* ============================================================
   DATA-MASTERY.JS
   Mastery Points perk system. Player-only (never followers).
   Each skill tracks its own point balance (character.masteryPoints[skillId],
   awarded in character.js's useSkill/discoverSpell) and its own
   picks (character.masteryPicks[skillId][tier]).

   Every skill has exactly 4 tiers, unlocked at 1/2/3/4 cumulative
   points in that skill. Each tier offers exactly 2 named perk
   options; the player picks one per tier, freely swappable at
   any time at no cost. Weapon/armor skills cap at 4 max points
   (tier-ups only); magic skills can reach up to 10 (4 tier-ups +
   up to 6 spells learned).
   ------------------------------------------------------------ */

const MASTERY_TIER_THRESHOLDS = [1, 2, 3, 4];

const MASTERY_PERKS = {

  /* ---------------- DEVERAN ---------------- */

  ancestralAverick: {
    1: [
      { id: "ancestorsEdge", name: "Ancestor's Edge", description: "Your weapon-buff spells (Flametouched Blade, Glacial Edge, Warblood Fury) last 1 extra round." },
      { id: "steadyHand", name: "Steady Hand", description: "Ancestor's Vigor's temporary Hit Points last 1 extra round." }
    ],
    2: [
      { id: "warbloodResilience", name: "Warblood Resilience", description: "Ancestor's Vigor grants noticeably more temporary Hit Points." },
      { id: "fleetbloodInstinct", name: "Fleetblood Instinct", description: "Fleetblood Grace's dodge bonus is stronger while active." }
    ],
    3: [
      { id: "steadfastAncestors", name: "Steadfast Ancestors", description: "Ironblood Ward's defense bonus is stronger while active." },
      { id: "warbloodFuryReborn", name: "Warblood Fury Reborn", description: "Warblood Fury's attack bonus is stronger while active." }
    ],
    4: [
      { id: "undyingBloodline", name: "Undying Bloodline", description: "When a weapon-buff spell would expire, there's a real chance it simply renews itself for free." },
      { id: "ancestralReckoning", name: "Ancestral Reckoning", description: "Your weapon-buff spells occasionally land a second, echoing strike alongside your normal attack." }
    ]
  },

  ancestralSiuloir: {
    1: [
      { id: "lingeringMelody", name: "Lingering Melody", description: "Lay of Mending lasts 1 extra round." },
      { id: "steadyTempo", name: "Steady Tempo", description: "Lute-Song of the Deep Well's mana regen ticks stronger." }
    ],
    2: [
      { id: "warDrumsWeight", name: "War-Drum's Weight", description: "War-Chant's attack bonus is stronger." },
      { id: "resonantHymn", name: "Resonant Hymn", description: "Hymn of Power's spell bonus is stronger." }
    ],
    3: [
      { id: "unbrokenBallad", name: "Unbroken Ballad", description: "Ballad of Vigor grants more temporary Hit Points." },
      { id: "dirgesGrip", name: "Dirge's Grip", description: "Dirge of Ruin hits harder each tick." }
    ],
    4: [
      { id: "endlessRefrain", name: "Endless Refrain", description: "A song has a real chance to keep playing past its normal end." },
      { id: "twinVerse", name: "Twin Verse", description: "You can occasionally sing two effects off one cast." }
    ]
  },

  ancestralEmyrs: {
    1: [
      { id: "steadyWard", name: "Steady Ward", description: "Aegis Ward lasts 1 extra round." },
      { id: "quickenedFlow", name: "Quickened Flow", description: "Manaflow returns more mana." }
    ],
    2: [
      { id: "circleUnbroken", name: "Circle Unbroken", description: "Circle of Aegis absorbs more per hit." },
      { id: "deepSleep", name: "Deep Sleep", description: "Somnusbind lasts 1 extra turn on the rare chance it doesn't fully stun." }
    ],
    3: [
      { id: "shatteringMind", name: "Shattering Mind", description: "Mindshatter hits harder." },
      { id: "cataclysmsReach", name: "Cataclysm's Reach", description: "Arcane Cataclysm hits harder." }
    ],
    4: [
      { id: "wardedTwice", name: "Warded Twice", description: "Aegis Ward has a chance to not consume itself on the hit that would end it." },
      { id: "eldersInsight", name: "Elder's Insight", description: "A small chance any Emyrs cast refunds its own mana cost." }
    ]
  },

  ancestralFetch: {
    1: [
      { id: "sureFooting", name: "Sure Footing", description: "Stag Form's defense is stronger." },
      { id: "silentStalk", name: "Silent Stalk", description: "Cat-Sìth's dodge window is slightly longer." }
    ],
    2: [
      { id: "hungeringBite", name: "Hungering Bite", description: "Beithir Form hits harder." },
      { id: "drainingGrasp", name: "Draining Grasp", description: "Baobhan Sìth's lifesteal is stronger." }
    ],
    3: [
      { id: "feralCunning", name: "Feral Cunning", description: "Cù Sídhe's buff is stronger." },
      { id: "witheringBreath", name: "Withering Breath", description: "Nuckelavee's debuff is stronger." }
    ],
    4: [
      { id: "betweenForms", name: "Between Forms", description: "Switching forms costs no mana once per fight." },
      { id: "oldBloodRising", name: "Old Blood Rising", description: "A chance any form-cast triggers a bonus effect on top of its normal one." }
    ]
  },

  /* ---------------- DRAKVARR ---------------- */

  runeBlade: {
    1: [
      { id: "battleFury", name: "Battle-Fury", description: "Bloodfury Mark lasts 1 extra round." },
      { id: "ironStance", name: "Iron Stance", description: "Ironrune Guard's defense is stronger." }
    ],
    2: [
      { id: "stonewallResolve", name: "Stonewall Resolve", description: "Stonewall Rune grants more temporary Hit Points." },
      { id: "deflectingRune", name: "Deflecting Rune", description: "Deflection Mark absorbs more." }
    ],
    3: [
      { id: "warcrysEdge", name: "Warcry's Edge", description: "Warcry Rune's buff and debuff are both stronger." },
      { id: "furyrunesWrath", name: "Furyrune's Wrath", description: "Furyrune hits harder." }
    ],
    4: [
      { id: "runesRenewed", name: "Runes Renewed", description: "A chance any Rune-Blade buff refreshes itself for free." },
      { id: "berserkersGift", name: "Berserker's Gift", description: "Attacking while below half HP gets a hidden damage boost." }
    ]
  },

  runeVision: {
    1: [
      { id: "clearerSight", name: "Clearer Sight", description: "Foreseen Opening's guarantee also nudges your damage up slightly." },
      { id: "ravensFocus", name: "Raven's Focus", description: "Ravensight Rune does the same for spells." }
    ],
    2: [
      { id: "sharedFate", name: "Shared Fate", description: "Fateglimpse can trigger twice in one fight." },
      { id: "wardedInstinct", name: "Warded Instinct", description: "Seer's Warning triggers automatically once per fight without needing to cast it." }
    ],
    3: [
      { id: "threadcuttersPatience", name: "Threadcutter's Patience", description: "Threadcut Vision lasts 1 extra effect." },
      { id: "omensWeight", name: "Omen's Weight", description: "Omen's End's execute bonus is stronger." }
    ],
    4: [
      { id: "twiceSeen", name: "Twice-Seen", description: "A real chance any guarantee doesn't consume itself." },
      { id: "theLongSight", name: "The Long Sight", description: "Once per fight, see the enemy's next 2 actions instead of 1." }
    ]
  },

  runeCurse: {
    1: [
      { id: "witheringGrip", name: "Withering Grip", description: "Withering Hex ticks harder." },
      { id: "doomrunesWeight", name: "Doomrune's Weight", description: "Doomrune's debuff is stronger." }
    ],
    2: [
      { id: "bindingHex", name: "Binding Hex", description: "Hexbind has a chance to last a 2nd turn." },
      { id: "fortuneReversed", name: "Fortune Reversed", description: "Ill-Fortune Rune's backfire chance is higher." }
    ],
    3: [
      { id: "bloodbondsDepth", name: "Bloodbond's Depth", description: "Bloodbond Hex heals more." },
      { id: "strengthstealsGrasp", name: "Strengthsteal's Grasp", description: "Strengthsteal Rune's steal is stronger both ways." }
    ],
    4: [
      { id: "cursesCompound", name: "Curses Compound", description: "Your curses can now stack instead of only refreshing." },
      { id: "doomEverlasting", name: "Doom Everlasting", description: "A chance any curse becomes permanent, matching Kolgrim's Brand's own effect." }
    ]
  },

  runeSong: {
    1: [
      { id: "skaldsMemory", name: "Skald's Memory", description: "Skald's Lay of Mending lasts 1 extra round." },
      { id: "warVersesWeight", name: "War-Verse's Weight", description: "Skald's War-Verse's buff is stronger." }
    ],
    2: [
      { id: "sagasDepth", name: "Saga's Depth", description: "Saga of Vigor grants more temporary Hit Points." },
      { id: "runeHymnsPower", name: "Rune-Hymn's Power", description: "Skald's Rune-Hymn's spell bonus is stronger." }
    ],
    3: [
      { id: "deepDrone", name: "Deep Drone", description: "Talharpa's Deep Drone regens more mana." },
      { id: "curseVersesGrip", name: "Curse-Verse's Grip", description: "Skald's Curse-Verse ticks harder." }
    ],
    4: [
      { id: "endlessSaga", name: "Endless Saga", description: "A chance a song keeps playing past its normal end." },
      { id: "twinVerseSkald", name: "Twin Verse", description: "Two songs can play at once instead of the usual cap." }
    ]
  },

  /* ---------------- GAELDRIM ---------------- */

  pathWild: {
    1: [
      { id: "loyalWolf", name: "Loyal Wolf", description: "Wolf's Call hits harder." },
      { id: "thornedWard", name: "Thorned Ward", description: "Thornward reflects more." }
    ],
    2: [
      { id: "bloomingVigor", name: "Blooming Vigor", description: "Nature's Fortitude grants more temporary Hit Points." },
      { id: "wildFury", name: "Wild Fury", description: "Nature's Wraith's buff is stronger." }
    ],
    3: [
      { id: "creepingBlight", name: "Creeping Blight", description: "Blightmist ticks harder." },
      { id: "bountysDepth", name: "Bounty's Depth", description: "Nature's Bounty heals more." }
    ],
    4: [
      { id: "packsReturn", name: "Pack's Return", description: "Wolf's Call can be recast once per fight instead of just once total." },
      { id: "oneWithTheWild", name: "One With the Wild", description: "A chance any Path of the Wild cast costs no mana." }
    ]
  },

  pathGrove: {
    1: [
      { id: "grovesGentleHand", name: "Grove's Gentle Hand", description: "Grove's Blessing heals more." },
      { id: "guardingBark", name: "Guarding Bark", description: "Barkskin's guard is stronger." }
    ],
    2: [
      { id: "widerBlessing", name: "Wider Blessing", description: "Grove's Protection heals more." },
      { id: "venomsBite", name: "Venom's Bite", description: "Venomstrike hits harder." }
    ],
    3: [
      { id: "spreadingRot", name: "Spreading Rot", description: "Verdant Blight ticks harder." },
      { id: "witheringRoots", name: "Withering Roots", description: "Withering Grasp's debuff is stronger." }
    ],
    4: [
      { id: "grovesMercy", name: "Grove's Mercy", description: "Heals from this line can push HP briefly above max, on a smaller scale than Bríghid's Second Bloom." },
      { id: "evergreen", name: "Evergreen", description: "A chance any Grove heal doesn't cost mana." }
    ]
  },

  pathStorm: {
    1: [
      { id: "lightningsEdge", name: "Lightning's Edge", description: "Lightning Lash hits harder." },
      { id: "bitterGale", name: "Bitter Gale", description: "Frostgale hits harder." }
    ],
    2: [
      { id: "stormsPatience", name: "Storm's Patience", description: "Stormcall ticks harder." },
      { id: "knockdownGust", name: "Knockdown Gust", description: "Windshear's stun lasts 1 extra turn on the rare chance it doesn't fully land." }
    ],
    3: [
      { id: "wildfiresReach", name: "Wildfire's Reach", description: "Wildfire Bolt hits harder." },
      { id: "ashenWind", name: "Ashen Wind", description: "Ashgale ticks harder." }
    ],
    4: [
      { id: "stormEverlasting", name: "Storm Everlasting", description: "A chance any Storm cast doesn't cost mana." },
      { id: "eyeOfTheStorm", name: "Eye of the Storm", description: "Once per fight, your next Storm cast can't be countered by anything." }
    ]
  },

  pathBarrow: {
    1: [
      { id: "hollowHunger", name: "Hollow Hunger", description: "Hollow Hound hits harder." },
      { id: "deeperHunger", name: "Deeper Hunger", description: "Gravehunger drains more." }
    ],
    2: [
      { id: "graspingDead", name: "Grasping Dead", description: "Grasp of the Dead ticks harder." },
      { id: "boneDeepWhisper", name: "Bone-Deep Whisper", description: "Bonewhisper's fear lasts 1 extra round." }
    ],
    3: [
      { id: "shroudsMercy", name: "Shroud's Mercy", description: "Shroudtouch restores more HP." },
      { id: "wraithsFury", name: "Wraith's Fury", description: "Wraithcall hits harder." }
    ],
    4: [
      { id: "theBarrowRemembers", name: "The Barrow Remembers", description: "Shroudtouch can be used twice per fight instead of once." },
      { id: "undyingGrasp", name: "Undying Grasp", description: "A chance any Barrow curse becomes permanent." }
    ]
  },

  /* ---------------- YORENSHI ---------------- */

  wayTengu: {
    1: [
      { id: "windsEdge", name: "Wind's Edge", description: "Gale-Fist Strike hits harder." },
      { id: "groundedRoot", name: "Grounded Root", description: "Root-Stance's guard is stronger." }
    ],
    2: [
      { id: "talonsFlurry", name: "Talon's Flurry", description: "Crow's Talon hits harder." },
      { id: "featherLight", name: "Feather-Light", description: "Feather-Step's dodge is stronger." }
    ],
    3: [
      { id: "tengusClarity", name: "Tengu's Clarity", description: "Tengu's Eye's guarantee also nudges damage up." },
      { id: "mountainsFall", name: "Mountain's Fall", description: "Mountain-Breaker's execute bonus is stronger." }
    ],
    4: [
      { id: "disciplineUnbroken", name: "Discipline Unbroken", description: "A chance your first attack each fight always crits." },
      { id: "windWalker", name: "Wind Walker", description: "Once per fight, take an extra action." }
    ]
  },

  waySuijin: {
    1: [
      { id: "deepCurrentsFlow", name: "Deep Current's Flow", description: "Biwa of the Deep Current heals more." },
      { id: "stormsApproach", name: "Storm's Approach", description: "Taiko of the Storm's Approach's buff is stronger." }
    ],
    2: [
      { id: "returningTidesDepth", name: "Returning Tide's Depth", description: "Biwa of the Returning Tide heals more." },
      { id: "ragingSurfsHeight", name: "Raging Surf's Height", description: "Taiko of the Raging Surf grants more temporary Hit Points." }
    ],
    3: [
      { id: "wanderingDread", name: "Wandering Dread", description: "Shakuhachi of the Wandering Dead's fear lasts longer." },
      { id: "hollowNote", name: "Hollow Note", description: "Shakuhachi of the Hollow Wind's debuff is stronger." }
    ],
    4: [
      { id: "endlessCurrent", name: "Endless Current", description: "A chance any Suijin heal costs no mana." },
      { id: "twinMelody", name: "Twin Melody", description: "Two songs can play in your loadout instead of the usual cap." }
    ]
  },

  wayYokai: {
    1: [
      { id: "livingFlame", name: "Living Flame", description: "Fire Form's buff is stronger." },
      { id: "flowingWater", name: "Flowing Water", description: "Water Form's lifesteal is stronger." }
    ],
    2: [
      { id: "livingStone", name: "Living Stone", description: "Earth Form's defense is stronger." },
      { id: "scatteringGale", name: "Scattering Gale", description: "Wind Form's debuff is stronger." }
    ],
    3: [
      { id: "driftingMist", name: "Drifting Mist", description: "Mist Form's dodge window is slightly longer." },
      { id: "wreathedLightning", name: "Wreathed Lightning", description: "Lightning Form hits harder." }
    ],
    4: [
      { id: "formless", name: "Formless", description: "Switching forms mid-fight costs no mana." },
      { id: "everyElement", name: "Every Element", description: "A chance a form-cast triggers a second, different form's minor effect too." }
    ]
  },

  wayOnmyoji: {
    1: [
      { id: "vengefulBond", name: "Vengeful Bond", description: "Onryō's Wrath hits harder." },
      { id: "trailingVeil", name: "Trailing Veil", description: "Yūrei's Veil absorbs more." }
    ],
    2: [
      { id: "dreadfulGrip", name: "Dreadful Grip", description: "Nukekubi's Grip has a chance to last a 2nd turn." },
      { id: "unerringSight", name: "Unerring Sight", description: "Gashadokuro's Eye's guarantee also nudges damage up." }
    ],
    3: [
      { id: "sorrowsGift", name: "Sorrow's Gift", description: "Ubume's Gift returns more mana." },
      { id: "vigilantSpirit", name: "Vigilant Spirit", description: "Onryō's Vigil restores more HP on the save." }
    ],
    4: [
      { id: "shikigamiUnbound", name: "Shikigami Unbound", description: "A chance any Onmyōji cast doesn't cost mana." },
      { id: "twiceBound", name: "Twice-Bound", description: "Two Shikigami effects can be active at once instead of the usual one-ward limit." }
    ]
  },

  /* ---------------- VANDIRI ---------------- */

  riteProtection: {
    1: [
      { id: "mercysDepth", name: "Mercy's Depth", description: "Mercy's Touch heals more per trigger." },
      { id: "furysEdge", name: "Fury's Edge", description: "Fury's Answer's buff is stronger." }
    ],
    2: [
      { id: "deeperCurrent", name: "Deeper Current", description: "Deep Current returns more mana." },
      { id: "widerCircle", name: "Wider Circle", description: "Mother's Circle heals more." }
    ],
    3: [
      { id: "undertowsGrip", name: "Undertow's Grip", description: "Undertow's debuff is stronger." },
      { id: "deepsMercy", name: "Deep's Mercy", description: "Ward of the Deep restores even more on the save." }
    ],
    4: [
      { id: "twiceWarded", name: "Twice Warded", description: "A second ward can be active at once." },
      { id: "theDeepAnswers", name: "The Deep Answers", description: "Ward of the Deep can trigger a second time per fight instead of once." }
    ]
  },

  riteUnmaking: {
    1: [
      { id: "vulnerableGrasp", name: "Vulnerable Grasp", description: "Vulnerability Curse's amp is stronger." },
      { id: "blindingGrip", name: "Blinding Grip", description: "Blinding Curse's accuracy debuff is stronger." }
    ],
    2: [
      { id: "cripplingGrasp", name: "Crippling Grasp", description: "Crippling Curse's damage debuff is stronger." },
      { id: "exposingGrip", name: "Exposing Grip", description: "Exposing Curse's defense debuff is stronger." }
    ],
    3: [
      { id: "devouringGalesDepth", name: "Devouring Gale's Depth", description: "Devouring Gale steals more." },
      { id: "silencingGrip", name: "Silencing Grip", description: "Silencing Curse lasts 1 extra turn." }
    ],
    4: [
      { id: "unmakingCompounds", name: "Unmaking Compounds", description: "Your debuffs stack instead of refreshing, like Kwabena's own effect at a smaller scale." },
      { id: "totalUnmaking", name: "Total Unmaking", description: "A chance any Unmaking debuff becomes permanent." }
    ]
  },

  riteThunderWrath: {
    1: [
      { id: "wrathsGrip", name: "Wrath's Grip", description: "Wrath Unbound ticks harder." },
      { id: "judgmentsWeight", name: "Judgment's Weight", description: "Judgment's Weight's debuff is stronger." }
    ],
    2: [
      { id: "embersCall", name: "Ember's Call", description: "Ember-Lash hits harder." },
      { id: "thundersCall", name: "Thunder's Call", description: "Thunder Caller hits harder." }
    ],
    3: [
      { id: "resolvesDepth", name: "Resolve's Depth", description: "Warrior's Resolve heals more." },
      { id: "thunderstrikesFury", name: "Thunderstrike's Fury", description: "Thunderstrike drains more." }
    ],
    4: [
      { id: "unbrokenWrath", name: "Unbroken Wrath", description: "A chance Warrior's Resolve costs no mana." },
      { id: "twinElementals", name: "Twin Elementals", description: "Both Ember-Lash and Thunder Caller can be summoned in the same fight instead of choosing one." }
    ]
  },

  riteGriot: {
    1: [
      { id: "healingRhythm", name: "Healing Rhythm", description: "Griot's Healing Refrain lasts 1 extra round." },
      { id: "warPraisesWeight", name: "War-Praise's Weight", description: "Griot's War-Praise's buff is stronger." }
    ],
    2: [
      { id: "endurancesDepth", name: "Endurance's Depth", description: "Griot's Song of Endurance grants more temporary Hit Points." },
      { id: "rhythmOfPower", name: "Rhythm of Power", description: "Griot's Rhythm of Power's spell bonus is stronger." }
    ],
    3: [
      { id: "deepPulse", name: "Deep Pulse", description: "Kalimba's Deep Pulse regens more mana." },
      { id: "lamentsGrip", name: "Lament's Grip", description: "Griot's Lament ticks harder." }
    ],
    4: [
      { id: "unbrokenRhythm", name: "Unbroken Rhythm", description: "A chance a song keeps playing past its normal end." },
      { id: "twinSong", name: "Twin Song", description: "Two songs can play at once instead of the usual cap." }
    ]
  },

  /* ---------------- WEAPONS ---------------- */

  swords: {
    1: [
      { id: "honedEdge", name: "Honed Edge", description: "Slightly sharper strikes." },
      { id: "balancedGrip", name: "Balanced Grip", description: "Slightly steadier accuracy." }
    ],
    2: [
      { id: "riposteInstinct", name: "Riposte Instinct", description: "A chance to land a small bonus hit right after a successful block/defend." },
      { id: "practicedCut", name: "Practiced Cut", description: "Damage is stronger against already-wounded enemies." }
    ],
    3: [
      { id: "mastersForm", name: "Master's Form", description: "Attack bonus is stronger overall." },
      { id: "precisionStrike", name: "Precision Strike", description: "A real chance to bypass a portion of enemy defense on a normal hit." }
    ],
    4: [
      { id: "blademastersReflex", name: "Blademaster's Reflex", description: "A chance to get a free extra swing." },
      { id: "unyieldingSteel", name: "Unyielding Steel", description: "Your sword attacks can't be fully deflected." }
    ]
  },

  daggers: {
    1: [
      { id: "swiftBlade", name: "Swift Blade", description: "Slightly more accurate strikes." },
      { id: "openingStrike", name: "Opening Strike", description: "Bonus damage against a foe you haven't hit yet this fight." }
    ],
    2: [
      { id: "vitalPrecision", name: "Vital Precision", description: "A chance to also cause a lingering wound on hit." },
      { id: "twinStrike", name: "Twin Strike", description: "A chance to strike a second time in the same attack, each hit smaller." }
    ],
    3: [
      { id: "assassinsFocus", name: "Assassin's Focus", description: "Backstab hits noticeably harder." },
      { id: "shadowStep", name: "Shadow Step", description: "A chance to dodge the enemy's next attack after landing a hit." }
    ],
    4: [
      { id: "killingStroke", name: "Killing Stroke", description: "Finishing blows against badly-wounded enemies hit much harder." },
      { id: "oneWithShadows", name: "One With the Shadows", description: "Backstab's cooldown is 1 round shorter." }
    ]
  },
  axes: {
    1: [
      { id: "heavySwing", name: "Heavy Swing", description: "Slightly harder strikes." },
      { id: "momentum", name: "Momentum", description: "Consecutive hits build a small stacking bonus, a smaller-scale version of Ivarr's Grudge." }
    ],
    2: [
      { id: "sunderingBlow", name: "Sundering Blow", description: "A chance to also weaken the enemy's defense on hit." },
      { id: "recklessPower", name: "Reckless Power", description: "Bigger damage, at a small accuracy cost." }
    ],
    3: [
      { id: "cleavingForce", name: "Cleaving Force", description: "Attack bonus is stronger overall." },
      { id: "brutalFollowThrough", name: "Brutal Follow-Through", description: "Bonus damage against already-wounded enemies." }
    ],
    4: [
      { id: "executionersArc", name: "Executioner's Arc", description: "Finishing blows against badly-wounded enemies hit much harder." },
      { id: "unstoppableMomentum", name: "Unstoppable Momentum", description: "A chance to ignore a stun/fear effect and act anyway." }
    ]
  },

  archery: {
    1: [
      { id: "steadyAim", name: "Steady Aim", description: "Accuracy is stronger." },
      { id: "quickNock", name: "Quick Nock", description: "A chance to fire twice in one turn." }
    ],
    2: [
      { id: "piercingShot", name: "Piercing Shot", description: "A chance to bypass a portion of enemy defense." },
      { id: "rangersFocus", name: "Ranger's Focus", description: "Bonus damage on your first shot each fight." }
    ],
    3: [
      { id: "calledShot", name: "Called Shot", description: "Bigger damage, at a small accuracy tradeoff." },
      { id: "practicedVolley", name: "Practiced Volley", description: "Attack bonus is stronger overall." }
    ],
    4: [
      { id: "perfectLoose", name: "Perfect Loose", description: "A chance any shot can't miss." },
      { id: "rainOfArrows", name: "Rain of Arrows", description: "A chance to hit a bonus time on the same target." }
    ]
  },

  unarmedCombat: {
    1: [
      { id: "ironFists", name: "Iron Fists", description: "Slightly harder strikes." },
      { id: "fluidStance", name: "Fluid Stance", description: "Slightly better dodge." }
    ],
    2: [
      { id: "counterStrike", name: "Counter-Strike", description: "A chance to land a bonus hit right after successfully defending." },
      { id: "focusedChi", name: "Focused Chi", description: "Bonus damage the more consecutive hits you land, a smaller-scale Ivarr's Grudge." }
    ],
    3: [
      { id: "disciplinedForm", name: "Disciplined Form", description: "Attack bonus is stronger overall." },
      { id: "pressurePointStrike", name: "Pressure Point Strike", description: "A chance to briefly stun on a normal hit." }
    ],
    4: [
      { id: "onePerfectStrike", name: "One Perfect Strike", description: "A chance your first attack each fight always crits." },
      { id: "unbrokenFocus", name: "Unbroken Focus", description: "A chance to act again immediately after a stun/fear would normally cost your turn." }
    ]
  },

  /* ---------------- SHIELD ---------------- */

  shields: {
    1: [
      { id: "bracedStance", name: "Braced Stance", description: "Defense bonus is stronger." },
      { id: "quickRecovery", name: "Quick Recovery", description: "Shield Bash's cooldown is 1 round shorter." }
    ],
    2: [
      { id: "punishingBlock", name: "Punishing Block", description: "A chance to counter-damage an enemy that hits your shield." },
      { id: "steadyGuard", name: "Steady Guard", description: "Shield Bash's stun chance is higher." }
    ],
    3: [
      { id: "unbreakableWall", name: "Unbreakable Wall", description: "Defense bonus is stronger overall." },
      { id: "riposte", name: "Riposte", description: "A chance to land a bonus attack right after successfully defending." }
    ],
    4: [
      { id: "aegisBearer", name: "Aegis Bearer", description: "A chance to fully block a hit outright, ignoring it entirely." },
      { id: "bulwarksAnswer", name: "Bulwark's Answer", description: "Shield Bash can be used twice per fight, ignoring its cooldown once." }
    ]
  },

  /* ---------------- ARMOR ---------------- */

  plateArmor: {
    1: [
      { id: "reinforcedPlating", name: "Reinforced Plating", description: "Defense bonus is stronger." },
      { id: "heavyBearing", name: "Heavy Bearing", description: "Small bonus max HP while worn." }
    ],
    2: [
      { id: "unshakeable", name: "Unshakeable", description: "Harder to stun or fear while worn." },
      { id: "weightedGuard", name: "Weighted Guard", description: "Defense bonus is stronger overall." }
    ],
    3: [
      { id: "fortressStance", name: "Fortress Stance", description: "Bigger bonus max HP." },
      { id: "deflectingSteel", name: "Deflecting Steel", description: "A real chance to fully block a hit." }
    ],
    4: [
      { id: "immovable", name: "Immovable", description: "A chance to shrug off a stun/fear entirely." },
      { id: "livingFortress", name: "Living Fortress", description: "A chance any hit against you deals reduced damage regardless of type." }
    ]
  },

  chainArmor: {
    1: [
      { id: "flexibleLinks", name: "Flexible Links", description: "Defense bonus is stronger." },
      { id: "balancedWeight", name: "Balanced Weight", description: "Small dodge bonus while worn." }
    ],
    2: [
      { id: "reactiveMail", name: "Reactive Mail", description: "A chance to counter-damage an attacker." },
      { id: "sturdyChain", name: "Sturdy Chain", description: "Defense bonus is stronger overall." }
    ],
    3: [
      { id: "practicedBearing", name: "Practiced Bearing", description: "Bigger dodge bonus." },
      { id: "layeredProtection", name: "Layered Protection", description: "A real chance to reduce incoming damage further." }
    ],
    4: [
      { id: "chainmailMastery", name: "Chainmail Mastery", description: "A chance to fully block a hit." },
      { id: "unyieldingLinks", name: "Unyielding Links", description: "A chance to shrug off a stun/fear entirely." }
    ]
  },

  leatherArmor: {
    1: [
      { id: "suppleHide", name: "Supple Hide", description: "Dodge bonus is stronger." },
      { id: "quietStep", name: "Quiet Step", description: "Small accuracy bonus on your first attack each fight." }
    ],
    2: [
      { id: "evasiveInstinct", name: "Evasive Instinct", description: "Dodge bonus is stronger overall." },
      { id: "practicedMobility", name: "Practiced Mobility", description: "Small bonus to fleeing successfully." }
    ],
    3: [
      { id: "shadowsGrace", name: "Shadow's Grace", description: "A real chance to avoid a hit outright." },
      { id: "nimbleRecovery", name: "Nimble Recovery", description: "Your cooldowns tick down slightly faster." }
    ],
    4: [
      { id: "untouchable", name: "Untouchable", description: "A chance to dodge any single hit each fight, guaranteed once." },
      { id: "ghostStep", name: "Ghost Step", description: "A chance an enemy's attack simply can't target you that round." }
    ]
  },

  clothArmor: {
    1: [
      { id: "wovenFocus", name: "Woven Focus", description: "Mana bonus is stronger." },
      { id: "lightBearing", name: "Light Bearing", description: "Small dodge bonus while worn." }
    ],
    2: [
      { id: "arcaneLining", name: "Arcane Lining", description: "Mana bonus is stronger overall." },
      { id: "practicedCasting", name: "Practiced Casting", description: "Small spell-damage bonus while worn." }
    ],
    3: [
      { id: "deepReserves", name: "Deep Reserves", description: "Bigger mana bonus." },
      { id: "wardedCloth", name: "Warded Cloth", description: "Small chance to absorb a portion of incoming magic damage." }
    ],
    4: [
      { id: "boundlessFocus", name: "Boundless Focus", description: "A chance any spell costs no mana." },
      { id: "arcaneWard", name: "Arcane Ward", description: "A chance to fully resist a magic attack outright." }
    ]
  }
};

/**
 * Returns the highest tier (1-4) a given skill has unlocked,
 * based on its current Mastery Points total, or 0 if none.
 */
function getUnlockedMasteryTier(points) {
  let unlocked = 0;
  MASTERY_TIER_THRESHOLDS.forEach((threshold, idx) => {
    if (points >= threshold) unlocked = idx + 1;
  });
  return unlocked;
}

/**
 * Returns the actual perk object the player has picked for a
 * given skill+tier (or null if unpicked), reading from
 * character.masteryPicks via the getMasteryPick helper in
 * character.js.
 */
function getChosenPerk(character, skillId, tier) {
  const optionId = getMasteryPick(character, skillId, tier);
  if (!optionId) return null;
  const tierOptions = (MASTERY_PERKS[skillId] && MASTERY_PERKS[skillId][tier]) || [];
  return tierOptions.find((p) => p.id === optionId) || null;
}

/**
 * True if the player has picked the given perk (by id) for the
 * given skill, regardless of tier — used by combat.js to check
 * "does the player have this specific perk active" without
 * needing to know which tier it lives at.
 */
function hasChosenPerk(character, skillId, perkId) {
  if (!character.masteryPicks || !character.masteryPicks[skillId]) return false;
  return Object.values(character.masteryPicks[skillId]).includes(perkId);
}
