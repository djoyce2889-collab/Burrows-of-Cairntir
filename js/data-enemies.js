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
  }
};
