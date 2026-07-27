/* ============================================================
   DATA-ENEMIES.JS
   All 24 enemies across the 6 dungeons.
   ============================================================ */

const ENEMIES = {
  restlessGuardsman: {
    id: "restlessGuardsman",
    name: "Restless Guardsman",
    description: "A Deveran man-at-arms in tarnished mail, still walking his old post at the gate long after anyone told him to stop.",
    image: "assets/images/enemies/restless-guardsman.png",
    hitPoints: 22,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "wolf",
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
    soundCategory: "spectral",
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
    soundCategory: "zombie",
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
    soundCategory: "spectral",
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
    soundCategory: "zombie",
    lootTable: ["Old Ore"]
  },
  chiefsShade: {
    id: "chiefsShade",
    name: "The Chief's Shade",
    description: "Wearing the shape of a Deveran chief, its ancestral magic curdled into something that answers to no bloodline at all.",
    image: "assets/images/enemies/chiefs-shade.png",
    deathImage: "assets/images/deaths/chiefs-shade-death.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
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
    soundCategory: "zombie",
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
    soundCategory: "zombie",
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
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  tidewrackedDraugr: {
    id: "tidewrackedDraugr",
    name: "Tidewracked Draugr",
    description: "Once the hall's own chieftain, now something the tide never quite finished taking.",
    image: "assets/images/enemies/tidewracked-draugr.png",
    deathImage: "assets/images/deaths/tidewracked-draugr-death.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "zombie",
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
    soundCategory: "zombie",
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
    soundCategory: "physical",
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
    soundCategory: "zombie",
    lootTable: ["Hide"]
  },
  theBarrowKeeper: {
    id: "theBarrowKeeper",
    name: "The Barrow Keeper",
    description: "Once a druid who tended these grave-mounds, now something the mounds tend in return.",
    image: "assets/images/enemies/the-barrow-keeper.png",
    deathImage: "assets/images/deaths/barrow-keeper-death.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "zombie",
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
    soundCategory: "stone",
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
    soundCategory: "fire",
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
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theUnnamedAncestor: {
    id: "theUnnamedAncestor",
    name: "The Unnamed Ancestor",
    description: "Whatever bloodline this once belonged to, no living clan will claim it now.",
    image: "assets/images/enemies/the-unnamed-ancestor.png",
    deathImage: "assets/images/deaths/unnamed-ancestor-death.png",
    hitPoints: 50,
    attackType: "magic",
    threatTier: "Expert",
    soundCategory: "fire",
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
    soundCategory: "ice",
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
    soundCategory: "ice",
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
    soundCategory: "stone",
    lootTable: ["Old Ore"]
  },
  theFrozenSmith: {
    id: "theFrozenSmith",
    name: "The Frozen Smith",
    description: "The vault's greatest rune-smith, still at their anvil, still not quite finished with whatever they were making.",
    image: "assets/images/enemies/the-frozen-smith.png",
    deathImage: "assets/images/deaths/frozen-smith-death.png",
    hitPoints: 52,
    attackType: "magic",
    threatTier: "Expert",
    soundCategory: "ice",
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
    soundCategory: "physical",
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
    soundCategory: "spectral",
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
    soundCategory: "spectral",
    lootTable: ["Hide"]
  },
  theConsensus: {
    id: "theConsensus",
    name: "The Consensus",
    description: "Not one voice but many, fused together into something that no longer needs to agree with anyone.",
    image: "assets/images/enemies/the-consensus.png",
    deathImage: "assets/images/deaths/the-consensus-death.png",
    hitPoints: 60,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Vale Sigil", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  duergarReaver: {
    id: "duergarReaver",
    name: "Duergar Reaver",
    description: "A corrupted dwarf warrior, ashen grey and hollow-eyed, wielding a notched axe with a hunger no ore ever satisfied.",
    image: "assets/images/enemies/duergar-reaver.png",
    hitPoints: 30,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  duergarDeepWarden: {
    id: "duergarDeepWarden",
    name: "Duergar Deep-Warden",
    description: "A hulking sentinel, armor fused with dark stone, standing guard over halls that no longer need guarding.",
    image: "assets/images/enemies/duergar-deep-warden.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "stone",
    lootTable: ["Old Ore", "Old Ore"]
  },
  duergarBloodShaman: {
    id: "duergarBloodShaman",
    name: "Duergar Blood-Shaman",
    description: "A gaunt figure marked with crude blood-dark runes, hands wreathed in a corrupted echo of what dwarven magic once was.",
    image: "assets/images/enemies/duergar-blood-shaman.png",
    hitPoints: 28,
    attackType: "magic",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Grave Essence"]
  },
  duergarAshblade: {
    id: "duergarAshblade",
    name: "Duergar Ashblade",
    description: "A lean, feral raider, twin jagged blades always moving, faster than anything wearing dwarven steel has any right to be.",
    image: "assets/images/enemies/duergar-ashblade.png",
    hitPoints: 26,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  ashenSovereign: {
    id: "ashenSovereign",
    name: "The Ashen Sovereign",
    description: "Once a dwarven king, now a crown fused into ashen flesh, wielding a rune-corrupted warhammer atop a throne of fused stone and dark iron.",
    image: "assets/images/enemies/ashen-sovereign.png",
    deathImage: "assets/images/deaths/ashen-sovereign-death.png",
    hitPoints: 60,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "stone",
    lootTable: ["Sovereign's Crown Shard", "Grave Essence", "Grave Essence"]
  },

  fomorianRaider: {
    id: "fomorianRaider",
    name: "Fomorian Raider",
    description: "A misshapen sea-raider, one clouded eye and a single crude weapon, barnacles crusted along its hide.",
    image: "assets/images/enemies/fomorian-raider.png",
    hitPoints: 26,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  fomorianBrute: {
    id: "fomorianBrute",
    name: "Fomorian Brute",
    description: "A hulking, misshapen thing, thick barnacle-crusted hide turning aside all but the surest blows.",
    image: "assets/images/enemies/fomorian-brute.png",
    hitPoints: 34,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Hide", "Hide"]
  },
  fomorianBlightCaster: {
    id: "fomorianBlightCaster",
    name: "Fomorian Blight-Caster",
    description: "A gaunt sea-witch trailing kelp, hands wreathed in a sickly light that shouldn't glow at all.",
    image: "assets/images/enemies/fomorian-blight-caster.png",
    hitPoints: 24,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Grave Essence"]
  },
  fomorianSkulker: {
    id: "fomorianSkulker",
    name: "Fomorian Skulker",
    description: "Lean and eel-quick, dark wet hide glistening, closing the distance before you're ready for it.",
    image: "assets/images/enemies/fomorian-skulker.png",
    hitPoints: 22,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  balor: {
    id: "balor",
    name: "Balor",
    description: "A towering Fomorian king, a single vast eye beneath a heavy lid — the old tales say it kills whatever it looks upon.",
    image: "assets/images/enemies/balor.png",
    deathImage: "assets/images/deaths/balor-death.png",
    hitPoints: 60,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Balor's Eye Shard", "Grave Essence", "Grave Essence"]
  },

  stormTouchedReiver: {
    id: "stormTouchedReiver",
    name: "Storm-Touched Reiver",
    description: "A Highland raider, eyes clouded storm-white, moving like something no longer entirely in control of itself.",
    image: "assets/images/enemies/storm-touched-reiver.png",
    hitPoints: 34,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  frostWightOfTheReach: {
    id: "frostWightOfTheReach",
    name: "Frost-Wight of the Reach",
    description: "A traveler who froze on this mountain long ago, and never quite lay down.",
    image: "assets/images/enemies/frost-wight-of-the-reach.png",
    hitPoints: 32,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "zombie",
    lootTable: ["Grave Essence"]
  },
  cailleachsHandmaiden: {
    id: "cailleachsHandmaiden",
    name: "Cailleach's Handmaiden",
    description: "A gaunt, ancient-looking woman wrapped in ragged winter furs, hands wreathed in swirling ice and storm magic.",
    image: "assets/images/enemies/cailleachs-handmaiden.png",
    hitPoints: 30,
    attackType: "magic",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Grave Essence", "Grave Essence"]
  },
  boulderHideStalker: {
    id: "boulderHideStalker",
    name: "Boulder-Hide Stalker",
    description: "A hulking creature with hide like weathered mountain stone, moss and ice clinging to its rocky form.",
    image: "assets/images/enemies/boulder-hide-stalker.png",
    hitPoints: 44,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "stone",
    lootTable: ["Old Ore", "Old Ore"]
  },
  theCailleach: {
    id: "theCailleach",
    name: "The Cailleach",
    description: "An ancient, towering hag-goddess wrapped in storm clouds and winter itself, primordial beyond any of the world's younger peoples.",
    image: "assets/images/enemies/the-cailleach.png",
    deathImage: "assets/images/deaths/cailleach-death.png",
    hitPoints: 65,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Cailleach's Frost Sigil", "Grave Essence", "Grave Essence"]
  },

  restlessAncestor: {
    id: "restlessAncestor",
    name: "Restless Ancestor",
    description: "A gaunt, translucent spirit wrapped in tattered ceremonial cloth, old markings faintly visible, its hollow eyes fixed with resentment.",
    image: "assets/images/enemies/restless-ancestor.png",
    hitPoints: 22,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  baobabGuardian: {
    id: "baobabGuardian",
    name: "Baobab Guardian",
    description: "A hulking guardian spirit, bark-skinned and rooted, wrapped in raffia and woven grass, carved ancestral masks fused into its shoulders.",
    image: "assets/images/enemies/baobab-guardian.png",
    hitPoints: 30,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "stone",
    lootTable: ["Old Ore"]
  },
  whisperingSpirit: {
    id: "whisperingSpirit",
    name: "Whispering Spirit",
    description: "A gaunt spirit wreathed in faint green mist, wrapped in faded ceremonial cloth, hands raised and glowing with unsettling magic.",
    image: "assets/images/enemies/whispering-spirit.png",
    hitPoints: 20,
    attackType: "magic",
    threatTier: "Novice",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  boneAdornedStalker: {
    id: "boneAdornedStalker",
    name: "Bone-Adorned Stalker",
    description: "A lean, fast spirit-creature adorned with old bones and cowrie shells, ceremonial markings visible across bare skin.",
    image: "assets/images/enemies/bone-adorned-stalker.png",
    hitPoints: 18,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theForgottenElder: {
    id: "theForgottenElder",
    name: "The Forgotten Elder",
    description: "A towering ancestral spirit, wrapped in decayed ceremonial cloth and layered regalia, an ancestral mask fused to its face, cracks of green light across its form.",
    image: "assets/images/enemies/the-forgotten-elder.png",
    deathImage: "assets/images/deaths/forgotten-elder-death.png",
    hitPoints: 45,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Root of Remembrance", "Grave Essence", "Grave Essence"]
  },

  drownedGuardian: {
    id: "drownedGuardian",
    name: "Drowned Guardian",
    description: "A gaunt, waterlogged spirit, wrapped in decayed ceremonial cloth and river reeds, cowrie shells embedded in its skin.",
    image: "assets/images/enemies/drowned-guardian.png",
    hitPoints: 24,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  riverWarden: {
    id: "riverWarden",
    name: "River Warden",
    description: "A hulking guardian spirit, hide slick and stone-like, ceremonial carved regalia fused into its shoulders.",
    image: "assets/images/enemies/river-warden.png",
    hitPoints: 32,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "stone",
    lootTable: ["Old Ore"]
  },
  undertowSpirit: {
    id: "undertowSpirit",
    name: "Undertow Spirit",
    description: "A lean, fast water-spirit, form shifting like flowing current, cowrie shells and carved charms trailing from its limbs.",
    image: "assets/images/enemies/undertow-spirit.png",
    hitPoints: 20,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  stagnantHorror: {
    id: "stagnantHorror",
    name: "Stagnant Horror",
    description: "A gaunt, waterlogged spirit wreathed in faint pale-blue mist, hands raised and glowing with unsettling magic.",
    image: "assets/images/enemies/stagnant-horror.png",
    hitPoints: 22,
    attackType: "magic",
    threatTier: "Novice",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theTideMother: {
    id: "theTideMother",
    name: "The Tide-Mother",
    description: "A towering ancient water-spirit, form composed of flowing water and coral, layered ceremonial regalia draped across her form, an intense pale-blue glow radiating from within.",
    image: "assets/images/enemies/the-tide-mother.png",
    deathImage: "assets/images/deaths/tide-mother-death.png",
    hitPoints: 48,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Tide-Mother's Pearl", "Grave Essence", "Grave Essence"]
  },

  arenaMinotaur: {
    id: "arenaMinotaur",
    name: "Minotaur",
    description: "A hulking bull-headed brute, powerful and muscular, hardened by countless bouts in the arena.",
    image: "assets/images/enemies/arena-minotaur.png",
    hitPoints: 34,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  arenaWyvern: {
    id: "arenaWyvern",
    name: "Wyvern",
    description: "A lean, two-legged wyvern, leathery wings half-spread, fast and vicious in close quarters.",
    image: "assets/images/enemies/arena-wyvern.png",
    hitPoints: 26,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  arenaDirewolf: {
    id: "arenaDirewolf",
    name: "Direwolf",
    description: "An oversized, powerfully built wolf, bristling with raw aggression, built for a real fight.",
    image: "assets/images/enemies/arena-direwolf.png",
    hitPoints: 28,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  arenaTroll: {
    id: "arenaTroll",
    name: "Troll",
    description: "A hulking, warty troll, thick hide already scarring and healing visibly before your eyes.",
    image: "assets/images/enemies/arena-troll.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Old Ore", "Old Ore"]
  },
  arenaBasilisk: {
    id: "arenaBasilisk",
    name: "Basilisk",
    description: "A large serpentine creature, scales dark and glistening, coiled and ready to strike.",
    image: "assets/images/enemies/arena-basilisk.png",
    hitPoints: 24,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Grave Essence"]
  },

  scorchedSentinel: {
    id: "scorchedSentinel",
    name: "Scorched Sentinel",
    description: "A gaunt, blackened guardian spirit, form charred and cracked like burnt wood, faint embers glowing through fissures in its skin.",
    image: "assets/images/enemies/scorched-sentinel.png",
    hitPoints: 24,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  emberWraith: {
    id: "emberWraith",
    name: "Ember-Wraith",
    description: "A lean, fast spirit wreathed in drifting embers and smoke, form shifting and flickering like dying flame.",
    image: "assets/images/enemies/ember-wraith.png",
    hitPoints: 20,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  ashBoundJudge: {
    id: "ashBoundJudge",
    name: "Ash-Bound Judge",
    description: "A gaunt, imposing spirit wrapped in ash-grey ceremonial cloth, hands wreathed in smoldering magic, an air of stern judgment about it.",
    image: "assets/images/enemies/ash-bound-judge.png",
    hitPoints: 22,
    attackType: "magic",
    threatTier: "Novice",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  crackedGolem: {
    id: "crackedGolem",
    name: "Cracked Golem",
    description: "A hulking guardian construct made of scorched, cracked stone, embers glowing deep within its fissures.",
    image: "assets/images/enemies/cracked-golem.png",
    hitPoints: 32,
    attackType: "physical",
    threatTier: "Novice",
    soundCategory: "stone",
    lootTable: ["Old Ore"]
  },
theUnyieldingFlame: {
    id: "theUnyieldingFlame",
    name: "The Unyielding Flame",
    description: "A towering ancient spirit composed of living ember and blackened stone, ceremonial regalia scorched but intact, an intense fiery glow radiating from deep cracks across its form.",
    image: "assets/images/enemies/the-unyielding-flame.png",
    deathImage: "assets/images/deaths/unyielding-flame-death.png",
    hitPoints: 46,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Unyielding Ember", "Grave Essence", "Grave Essence"]
  },

  youngDragon: {
    id: "youngDragon",
    name: "Young Dragon",
    description: "A young dragon, massive and terrifying, scales in deep crimsons and golds, eyes glowing with hunger and ancient intelligence.",
    image: "assets/images/enemies/young-dragon.png",
    hitPoints: 38,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "fire",
    lootTable: ["Old Ore", "Grave Essence"]
  },

  wyvern: {
    id: "wyvern",
    name: "Wyvern",
    description: "A two-legged draconic creature, wings half-spread and ready, serpentine tail coiled, smaller than a true dragon but no less dangerous.",
    image: "assets/images/enemies/wyvern.png",
    hitPoints: 32,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "physical",
    lootTable: ["Old Ore", "Hide"]
  },

  fireDrake: {
    id: "fireDrake",
    name: "Fire Drake",
    description: "A dragon specialized in flame, scaled body in deep crimsons and golds, wisps of smoke and embers trailing from nostrils, predatory and terrible.",
    image: "assets/images/enemies/fire-drake.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "fire",
    lootTable: ["Grave Essence", "Old Ore"]
  },

  dragonCultPriest: {
    id: "dragonCultPriest",
    name: "Dragon Cult Priest",
    description: "A robed shrine keeper marked with dragon sigils, their eyes clouded with reverence and flame-touched magic.",
    image: "assets/images/enemies/dragon-cult-priest.png",
    hitPoints: 28,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Grave Essence", "Old Ore"]
  },

  theDragonShrineKeeper: {
    id: "theDragonShrineKeeper",
    name: "The Dragon-Shrine Keeper",
    description: "Once a devoted priest, now something far stranger --- the dragon's will made flesh, wreathed in sacred flame and elder magic.",
    image: "assets/images/enemies/the-dragon-shrine-keeper.png",
    deathImage: "assets/images/deaths/dragon-shrine-keeper-death.png",
    hitPoints: 45,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "fire",
    lootTable: ["Dragon-Keeper's Sigil", "Grave Essence", "Grave Essence"]
  },

  enthralledMaid: {
    id: "enthralledMaid",
    name: "Enthralled Maid",
    description: "A servant spirit twisted by the Daimyo's corruption, moving with jerking, unnatural motions, eyes hollow and vacant.",
    image: "assets/images/enemies/enthralled-maid.png",
    hitPoints: 24,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },

  enthralledSamurai: {
    id: "enthralledSamurai",
    name: "Enthralled Samurai",
    description: "A warrior spirit enslaved to the Daimyo's will, still bearing the ghost of armor and blade, moving with precise but soulless discipline.",
    image: "assets/images/enemies/enthralled-samurai.png",
    hitPoints: 32,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Old Ore", "Grave Essence"]
  },

  enthralledAttendant: {
    id: "enthralledAttendant",
    name: "Enthralled Attendant",
    description: "A twisted servant spirit, bound to endless servitude within these halls, its form barely holding human shape.",
    image: "assets/images/enemies/enthralled-attendant.png",
    hitPoints: 22,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },

  yokaiSpirit: {
    id: "yokaiSpirit",
    name: "Yokai Spirit",
    description: "A shapeshifting creature of the manor, manifesting between forms, drawn to the corruption that fills these halls.",
    image: "assets/images/enemies/yokai-spirit.png",
    hitPoints: 28,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },

  corruptedGuardian: {
    id: "corruptedGuardian",
    name: "Corrupted Guardian",
    description: "A powerful spirit bound to protect the manor's inner sanctum, its form shifted and twisted by the Daimyo's dark will.",
    image: "assets/images/enemies/corrupted-guardian.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Old Ore", "Grave Essence"]
  },

  theCorruptedDaimyo: {
    id: "theCorruptedDaimyo",
    name: "The Corrupted Daimyo",
    description: "Once a noble lord, now a twisted shade of himself --- wreathed in spectral darkness, commanding the very manor as an extension of his corrupted will.",
    image: "assets/images/enemies/the-corrupted-daimyo.png",
    deathImage: "assets/images/deaths/corrupted-daimyo-death.png",
    hitPoints: 48,
    attackType: "magic",
    threatTier: "Adept",
    soundCategory: "spectral",
    lootTable: ["Daimyo's Seal", "Grave Essence", "Grave Essence"]
  },

  karasuTenguScout: {
    id: "karasuTenguScout",
    name: "Karasu-Tengu Scout",
    description: "A crow-tengu once tasked with watching the mountain paths, its patient discipline curdled into something sharp and paranoid by the wind that shouldn't blow the way it does.",
    image: "assets/images/enemies/karasu-tengu-scout.png",
    hitPoints: 26,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },

  kodamaSentinel: {
    id: "kodamaSentinel",
    name: "Kodama Sentinel",
    description: "A tree spirit fused into the dojo's oldest beams, its slow patient growth turned hungry and wrong, reaching for anything that moves.",
    image: "assets/images/enemies/kodama-sentinel.png",
    hitPoints: 32,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },

  konohaTenguAdept: {
    id: "konohaTenguAdept",
    name: "Konoha-Tengu Adept",
    description: "A leaf-winged tengu whose wind-craft was once precise and gentle, now thrown into fits of discordant, unpredictable gusts.",
    image: "assets/images/enemies/konoha-tengu-adept.png",
    hitPoints: 30,
    attackType: "magic",
    threatTier: "Expert",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },

  bladeWingTengu: {
    id: "bladeWingTengu",
    name: "Blade-Wing Tengu",
    description: "Once the dojo's finest warrior-caste tengu, its trained discipline replaced by a restless, territorial fury it can no longer master.",
    image: "assets/images/enemies/blade-wing-tengu.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Expert",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },

  oniTouchedGuardian: {
    id: "oniTouchedGuardian",
    name: "Oni-Touched Guardian",
    description: "A living stone guardian that has stood watch over this mountain for centuries, its ancient purpose warped by the wrongness now soaked into the rock itself.",
    image: "assets/images/enemies/oni-touched-guardian.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Expert",
    soundCategory: "stone",
    lootTable: ["Old Ore", "Old Ore"]
  },

  daitengu: {
    id: "daitengu",
    name: "The Daitengu",
    description: "Once a wise and controlled master, the Great Tengu has been worn down by years of the mountain's unnatural wind — no longer a teacher, but something closer to a cornered, dangerous thing defending the last place it has left.",
    image: "assets/images/enemies/daitengu.png",
    deathImage: "assets/images/deaths/daitengu-death.png",
    hitPoints: 62,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Sōjōbō's Feather", "Grave Essence", "Grave Essence"]
  },

  theOfficiant: {
    id: "theOfficiant",
    name: "The Officiant",
    description: "Bound to the hollow by the same old rite he once performed, unable to leave the vows he sealed with his own hand.",
    image: "assets/images/enemies/the-officiant.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Hide", "Grave Essence"]
  },
  theLostSuitor: {
    id: "theLostSuitor",
    name: "The Lost Suitor",
    description: "Forever caught reaching for someone he lost long before the hollow ever claimed her.",
    image: "assets/images/enemies/the-lost-suitor.png",
    hitPoints: 38,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Hide"]
  },
  theLatestBloom: {
    id: "theLatestBloom",
    name: "The Latest Bloom",
    description: "Drawn in by the Widow's thrall, beautiful and hollow-eyed, luring without ever knowing what she's become.",
    image: "assets/images/enemies/the-latest-bloom.png",
    hitPoints: 34,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theGraveWarden: {
    id: "theGraveWarden",
    name: "The Grave-Warden",
    description: "Bound by an old bargain to tend a grave-mound he never once chose to guard.",
    image: "assets/images/enemies/the-grave-warden.png",
    hitPoints: 44,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Hide", "Hide"]
  },
  theSilentWatcher: {
    id: "theSilentWatcher",
    name: "The Silent Watcher",
    description: "Haunted by what they once saw and never spoke of — unable to leave the hollow either, all these years later.",
    image: "assets/images/enemies/the-silent-watcher.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theWidow: {
    id: "theWidow",
    name: "The Widow",
    description: "A bride forced into a marriage that killed her, beautiful and terrible in equal measure — forever mourning what was done to her, and forever making others pay the price of it.",
    image: "assets/images/enemies/the-widow.png",
    deathImage: "assets/images/deaths/the-widow-death.png",
    hitPoints: 85,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Widow's Red Thorn", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  theShieldSplitter: {
    id: "theShieldSplitter",
    name: "The Shield-Splitter",
    description: "Broke a hundred shields in his final battle before his own finally failed him. Eager to see if yours holds.",
    image: "assets/images/enemies/the-shield-splitter.png",
    hitPoints: 44,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore", "Old Ore"]
  },
  theUnyielding: {
    id: "theUnyielding",
    name: "The Unyielding",
    description: "Stood alone against a war-band that should have ended him ten times over, and refused every one of them.",
    image: "assets/images/enemies/the-unyielding.png",
    hitPoints: 46,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  theOathKeeper: {
    id: "theOathKeeper",
    name: "The Oath-Keeper",
    description: "Died holding a vow no living soul remembered but him. Still proud it was kept.",
    image: "assets/images/enemies/the-oath-keeper.png",
    hitPoints: 38,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Grave Essence"]
  },
  theTwinBlade: {
    id: "theTwinBlade",
    name: "The Twin-Blade",
    description: "Fought with a blade in each hand until both arms finally gave out beneath him.",
    image: "assets/images/enemies/the-twin-blade.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore", "Hide"]
  },
  theFrostWalker: {
    id: "theFrostWalker",
    name: "The Frost-Walker",
    description: "Crossed an impossible frozen strait to reach the battle in time. Won't be late again.",
    image: "assets/images/enemies/the-frost-walker.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Grave Essence"]
  },
  sigrun: {
    id: "sigrun",
    name: "Sigrun",
    description: "The Valkyrie who still watches this thin, ancient seam between worlds. She doesn't care what you are — mortal, fae, living, or something else entirely. She only cares whether you're worthy.",
    image: "assets/images/enemies/sigrun.png",
    deathImage: "assets/images/deaths/sigrun-death.png",
    hitPoints: 85,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Sigrun's Chosen Feather", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  theGroveBound: {
    id: "theGroveBound",
    name: "The Grove-Bound",
    description: "A guardian caught mid-change for longer than anyone can remember, neither fully leopard nor fully person.",
    image: "assets/images/enemies/the-grove-bound.png",
    hitPoints: 42,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide", "Hide"]
  },
  theElderTracker: {
    id: "theElderTracker",
    name: "The Elder Tracker",
    description: "The oldest living link to the first spirit-society, testing whether you move through the grove with respect or arrogance.",
    image: "assets/images/enemies/the-elder-tracker.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theUnshapedCub: {
    id: "theUnshapedCub",
    name: "The Unshaped Cub",
    description: "Young, restless, still learning to control the change — dangerous precisely because it hasn't learned restraint yet.",
    image: "assets/images/enemies/the-unshaped-cub.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theRiteWarden: {
    id: "theRiteWarden",
    name: "The Rite-Warden",
    description: "Bound to guard the grove's oldest protective rites, unwilling to let anyone pass who hasn't proven they'd protect it too.",
    image: "assets/images/enemies/the-rite-warden.png",
    hitPoints: 44,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Grave Essence"]
  },
  theSilentStalker: {
    id: "theSilentStalker",
    name: "The Silent Stalker",
    description: "Says nothing, tests nothing but pure skill — simply hunts anyone who enters uninvited.",
    image: "assets/images/enemies/the-silent-stalker.png",
    hitPoints: 38,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theFirstLeopard: {
    id: "theFirstLeopard",
    name: "The First Leopard",
    description: "The ancestral guardian spirit the entire bloodline traces back to. Not evil, not even truly hostile — just ancient, watchful, and unwilling to let the old grove's location fall into unworthy hands.",
    image: "assets/images/enemies/the-first-leopard.png",
    deathImage: "assets/images/deaths/the-first-leopard-death.png",
    hitPoints: 85,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["First Leopard's Claw", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  theRiverCursed: {
    id: "theRiverCursed",
    name: "The River-Cursed",
    description: "A villager driven mad by years of living beside the serpent's terror, no longer entirely themselves.",
    image: "assets/images/enemies/the-river-cursed.png",
    hitPoints: 38,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theBoneLitteredServant: {
    id: "theBoneLitteredServant",
    name: "The Bone-Littered Servant",
    description: "Once forced to help prepare each year's sacrifice for the serpent, hollowed out by the role long ago.",
    image: "assets/images/enemies/the-bone-littered-servant.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Hide", "Grave Essence"]
  },
  theTwistedStag: {
    id: "theTwistedStag",
    name: "The Twisted Stag",
    description: "Wildlife along the valley warped by the serpent's corrupting presence, feral and wrong.",
    image: "assets/images/enemies/the-twisted-stag.png",
    hitPoints: 44,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide", "Hide"]
  },
  theDrownedWatcher: {
    id: "theDrownedWatcher",
    name: "The Drowned Watcher",
    description: "Something that went into the river years ago and never quite came back out right.",
    image: "assets/images/enemies/the-drowned-watcher.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theBrokenGuard: {
    id: "theBrokenGuard",
    name: "The Broken Guard",
    description: "Once one of Izumo's own warriors, sent to stand against the serpent years ago. Never came back the way he left.",
    image: "assets/images/enemies/the-broken-guard.png",
    hitPoints: 42,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Old Ore"]
  },
  yamataNoOrochi: {
    id: "yamataNoOrochi",
    name: "Yamata-no-Orochi",
    description: "The eight-headed, eight-tailed serpent that has terrorized this valley for years, demanding a sacrifice each season. Something ancient, monstrous, and utterly without mercy.",
    image: "assets/images/enemies/yamata-no-orochi.png",
    deathImage: "assets/images/deaths/yamata-no-orochi-death.png",
    hitPoints: 85,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Kusanagi's Fang", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  vanguardScout: {
    id: "vanguardScout",
    name: "The Vanguard Scout",
    description: "Young and fast, first of Clan Gordon to reach the old vault's outer paths, testing whoever else has come looking.",
    image: "assets/images/enemies/vanguard-scout.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theOldBlade: {
    id: "theOldBlade",
    name: "The Old Blade",
    description: "A veteran of Clan Gordon who still remembers the exile firsthand, fighting for a grievance most of the clan only knows secondhand.",
    image: "assets/images/enemies/the-old-blade.png",
    hitPoints: 42,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  theRecklessHeir: {
    id: "theRecklessHeir",
    name: "The Reckless Heir",
    description: "Impatient to reclaim what he's been told his whole life should already be his.",
    image: "assets/images/enemies/the-reckless-heir.png",
    hitPoints: 38,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore", "Hide"]
  },
  theClanTactician: {
    id: "theClanTactician",
    name: "The Clan Tactician",
    description: "Sharp and calculating, using position and timing rather than raw strength to press Clan Gordon's claim.",
    image: "assets/images/enemies/the-clan-tactician.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Grave Essence"]
  },
  theOathBoundGuard: {
    id: "theOathBoundGuard",
    name: "The Oath-Bound Guard",
    description: "Sworn to see Clan Gordon's claim through no matter the cost — the most dangerous of them by far.",
    image: "assets/images/enemies/the-oath-bound-guard.png",
    hitPoints: 46,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore", "Old Ore"]
  },
  malcolmGordon: {
    id: "malcolmGordon",
    name: "Malcolm Gordon",
    description: "Chief of Clan Gordon, leading the reclamation himself. Not cruel, not evil — utterly convinced his people are owed this, and unwilling to let a stranger walk away with it instead.",
    image: "assets/images/enemies/malcolm-gordon.png",
    deathImage: "assets/images/deaths/malcolm-gordon-death.png",
    hitPoints: 85,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Gordon's Due Coin", "Old Ore", "Old Ore", "Old Ore"]
  },

  theFirstTurned: {
    id: "theFirstTurned",
    name: "The First-Turned",
    description: "The most recently lost of the warband, fully wolf in body, but something behind its eyes still flickers with a man's memory before it's gone again.",
    image: "assets/images/enemies/the-first-turned.png",
    hitPoints: 38,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theHowlingThane: {
    id: "theHowlingThane",
    name: "The Howling Thane",
    description: "Once a proud warrior, now an enormous scarred wolf-beast given entirely to rage — any trace of the man long since burned out of it.",
    image: "assets/images/enemies/the-howling-thane.png",
    hitPoints: 44,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide", "Old Ore"]
  },
  thePackBound: {
    id: "thePackBound",
    name: "The Pack-Bound",
    description: "Moves and hunts like it's always known nothing else — a true wolf now in every way that matters.",
    image: "assets/images/enemies/the-pack-bound.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theBloodmuzzle: {
    id: "theBloodmuzzle",
    name: "The Bloodmuzzle",
    description: "The furthest gone of the warband — doesn't fight so much as feed, driven by hunger rather than any memory of battle at all.",
    image: "assets/images/enemies/the-bloodmuzzle.png",
    hitPoints: 36,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide", "Grave Essence"]
  },
  theLastWatcher: {
    id: "theLastWatcher",
    name: "The Last Watcher",
    description: "A massive, aging wolf-beast, still positioned at its post out of some instinct that was once loyalty, guarding its chieftain the only way it still knows how.",
    image: "assets/images/enemies/the-last-watcher.png",
    hitPoints: 42,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  ulfrikTheFirstSkinned: {
    id: "ulfrikTheFirstSkinned",
    name: "Ulfrik the First-Skinned",
    description: "The very first to don the pelt, centuries ago, now the largest and most terrible wolf-beast of them all. Nothing human left in him at all — just the first domino that dragged his whole warband down with him.",
    image: "assets/images/enemies/ulfrik-the-first-skinned.png",
    deathImage: "assets/images/deaths/ulfrik-the-first-skinned-death.png",
    hitPoints: 85,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Ulfrik's Broken Fang", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  theAshCrowned: {
    id: "theAshCrowned",
    name: "The Ash-Crowned",
    description: "Once nobility of the Seelie court, corrupted first and hardest, now leading by cruelty rather than grace.",
    image: "assets/images/enemies/the-ash-crowned.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theBargainBreaker: {
    id: "theBargainBreaker",
    name: "The Bargain-Breaker",
    description: "Keeps bargains only as long as it suits her, and delights in the exact moment she doesn't have to anymore.",
    image: "assets/images/enemies/the-bargain-breaker.png",
    hitPoints: 38,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theThornedHerald: {
    id: "theThornedHerald",
    name: "The Thorned Herald",
    description: "Announces the court's will with a twisted, ceremonial cruelty, relishing every word of it.",
    image: "assets/images/enemies/the-thorned-herald.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theHollowKnight: {
    id: "theHollowKnight",
    name: "The Hollow Knight",
    description: "Armored and disciplined as any noble guard once was, utterly without mercy now.",
    image: "assets/images/enemies/the-hollow-knight.png",
    hitPoints: 46,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore", "Hide"]
  },
  theWitheredMuse: {
    id: "theWitheredMuse",
    name: "The Withered Muse",
    description: "Once bound to inspire and charm, now corrupts anyone who listens too long.",
    image: "assets/images/enemies/the-withered-muse.png",
    hitPoints: 34,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theUnseelieQueen: {
    id: "theUnseelieQueen",
    name: "The Unseelie Queen",
    description: "More terrible and more beautiful than any of her subjects, embodying everything the old stories warn about the Sídhe — taken to its darkest possible extreme.",
    image: "assets/images/enemies/the-unseelie-queen.png",
    deathImage: "assets/images/deaths/the-unseelie-queen-death.png",
    hitPoints: 85,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Unseelie Crown Shard", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  theSmilingElder: {
    id: "theSmilingElder",
    name: "The Smiling Elder",
    description: "The village's most trusted figure, enthralled by the Witch of the Hollow longer than anyone realizes.",
    image: "assets/images/enemies/the-smiling-elder.png",
    hitPoints: 38,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theWatchfulMidwife: {
    id: "theWatchfulMidwife",
    name: "The Watchful Midwife",
    description: "Present at every birth in the village, enthralled in a way that's let her go unnoticed for years.",
    image: "assets/images/enemies/the-watchful-midwife.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theQuietNeighbor: {
    id: "theQuietNeighbor",
    name: "The Quiet Neighbor",
    description: "Utterly unremarkable, which is exactly why her enthrallment was never caught.",
    image: "assets/images/enemies/the-quiet-neighbor.png",
    hitPoints: 40,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Hide"]
  },
  theFireflyTouched: {
    id: "theFireflyTouched",
    name: "The Firefly-Touched",
    description: "Caught mid-transformation, the one moment the Witch's hold actually shows itself.",
    image: "assets/images/enemies/the-firefly-touched.png",
    hitPoints: 34,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theGrievingMother: {
    id: "theGrievingMother",
    name: "The Grieving Mother",
    description: "Enthralled in the cruelest way of all — her grief no longer entirely her own.",
    image: "assets/images/enemies/the-grieving-mother.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theWitchOfTheHollow: {
    id: "theWitchOfTheHollow",
    name: "The Witch of the Hollow",
    description: "Not enthralled — the one doing the enthralling. She has moved through this village unnoticed for years, slowly claiming more of it for her own purposes.",
    image: "assets/images/enemies/the-witch-of-the-hollow.png",
    deathImage: "assets/images/deaths/the-witch-of-the-hollow-death.png",
    hitPoints: 85,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Witch's Hollow Charm", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  niutouTheOxGuardian: {
    id: "niutouTheOxGuardian",
    name: "Niutou, the Ox Guardian",
    description: "A genuine ox-formed guardian of the underworld, one of the two traditional escorts who lead the dead into Diyu.",
    image: "assets/images/enemies/niutou-the-ox-guardian.png",
    hitPoints: 44,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  mamianTheHorseGuardian: {
    id: "mamianTheHorseGuardian",
    name: "Mamian, the Horse Guardian",
    description: "A genuine horse-formed guardian of the underworld, paired with Niutou since time immemorial in escorting the dead into Diyu.",
    image: "assets/images/enemies/mamian-the-horse-guardian.png",
    hitPoints: 42,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "physical",
    lootTable: ["Old Ore"]
  },
  theHoppingCorpse: {
    id: "theHoppingCorpse",
    name: "The Hopping Corpse",
    description: "A jiangshi — rigid, reanimated, arms outstretched, hunting the living by scent and sound alone.",
    image: "assets/images/enemies/the-hopping-corpse.png",
    hitPoints: 38,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "zombie",
    lootTable: ["Grave Essence"]
  },
  theHungryGhost: {
    id: "theHungryGhost",
    name: "The Hungry Ghost",
    description: "An è guǐ — a soul condemned to eternal starvation, tragic and dangerous in equal measure.",
    image: "assets/images/enemies/the-hungry-ghost.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  theChainBoundSoul: {
    id: "theChainBoundSoul",
    name: "The Chain-Bound Soul",
    description: "A spirit condemned for a specific transgression, still bearing the weight of its underworld punishment.",
    image: "assets/images/enemies/the-chain-bound-soul.png",
    hitPoints: 40,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Grave Essence"]
  },
  yanluoWang: {
    id: "yanluoWang",
    name: "Yanluo Wang, King of Diyu",
    description: "The judge of the dead himself, absolute and unmoved, utterly convinced you do not belong among the souls he presides over.",
    image: "assets/images/enemies/yanluo-wang.png",
    deathImage: "assets/images/deaths/yanluo-wang-death.png",
    hitPoints: 85,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "spectral",
    lootTable: ["Yanluo's Seal of Judgment", "Grave Essence", "Grave Essence", "Grave Essence"]
  },

  patientSteward: {
    id: "patientSteward",
    name: "The Patient Steward",
    description: "Kept the hall for a family that stopped needing it kept generations ago. His hands still work. Everything else about him stopped a long time back.",
    image: "assets/images/enemies/patient-steward.png",
    hitPoints: 44,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "zombie",
    lootTable: ["Old Ore", "Grave Essence"]
  },
  answeringCorpse: {
    id: "answeringCorpse",
    name: "The Answering Corpse",
    description: "It only rises when it hears an ancestor's name spoken aloud. It's heard Averick's a thousand times. It's still waiting to hear its own.",
    image: "assets/images/enemies/answering-corpse.png",
    hitPoints: 38,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "zombie",
    lootTable: ["Grave Essence", "Grave Essence"]
  },
  unclaimedBlood: {
    id: "unclaimedBlood",
    name: "The Unclaimed Blood",
    description: "Wears a clan-mark carved raw into rotted flesh, over and over, like it's trying to remember whose it actually was.",
    image: "assets/images/enemies/unclaimed-blood.png",
    hitPoints: 42,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "zombie",
    lootTable: ["Old Ore"]
  },
  waitingWife: {
    id: "waitingWife",
    name: "The Waiting Wife",
    description: "Still sets a place at the table with hands that have long since stopped being hands. Won't stop until someone sits down.",
    image: "assets/images/enemies/waiting-wife.png",
    hitPoints: 36,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "zombie",
    lootTable: ["Grave Essence"]
  },
  theLongWatch: {
    id: "theLongWatch",
    name: "The Long Watch",
    description: "Was told to guard the throne until his brother returned to claim it. His body gave out on that promise a long time ago. He didn't.",
    image: "assets/images/enemies/the-long-watch.png",
    hitPoints: 46,
    attackType: "physical",
    threatTier: "Master",
    soundCategory: "zombie",
    lootTable: ["Old Ore", "Old Ore"]
  },
  doranJoss: {
    id: "doranJoss",
    name: "Doran Joss",
    description: "Averick's own blood-brother, born the same night, same blood, same gift — but it was Averick's name the old songs kept. His body has been dead for centuries. He simply never agreed to lie down.",
    image: "assets/images/enemies/doran-joss.png",
    deathImage: "assets/images/deaths/doran-joss-death.png",
    hitPoints: 85,
    attackType: "magic",
    threatTier: "Master",
    soundCategory: "zombie",
    lootTable: ["Doran's Unspoken Crown", "Grave Essence", "Grave Essence", "Grave Essence"]
  }

};