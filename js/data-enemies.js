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
  }

};