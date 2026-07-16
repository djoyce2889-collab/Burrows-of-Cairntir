/* ============================================================
   DATA-DUNGEONS.JS
   Dungeon list, all 6 dungeons' room content, and per-room
   scene image lookup.
   ============================================================ */

const DUNGEONS = {
  duncairnKeep: {
    id: "duncairnKeep",
    name: "Duncairn Keep",
    difficulty: "Novice",
    musicSrc: "assets/audio/duncairn-keep.mp3",
    image: "assets/images/duncairn-keep.png",
    description:
      "An abandoned Deveran castle on a fog-bound hill, empty since " +
      "the chief's line died out under circumstances the clans still " +
      "won't speak of plainly. The gates stand open. Nothing living " +
      "has gone in and come back out to say why."
  },
  sunkenLonghall: {
    id: "sunkenLonghall",
    name: "The Sunken Longhall",
    difficulty: "Novice",
    musicSrc: "assets/audio/sunken-longhall.mp3",
    image: "assets/images/sunken-longhall.png",
    description:
      "A Drakvarr hall, half-swallowed by a rising bog, its rafters " +
      "still marked with runes no living shaman will speak aloud. " +
      "Black water laps at the entrance where a war-fleet once " +
      "launched. The runes overhead still glow faintly at night — no " +
      "one left alive to carve new ones, and no one left alive to " +
      "ask why the old ones still burn."
  },
  wychrootGrove: {
    id: "wychrootGrove",
    name: "The Wychroot Grove",
    difficulty: "Novice",
    musicSrc: "assets/audio/wychroot-grove.mp3",
    image: "assets/images/wychroot-grove.png",
    description:
      "A grove gone wrong — roots grown thick around old grave-mounds, " +
      "where the Path of the Barrow is said to still answer, if you " +
      "know how to ask. Sunlight barely reaches the ground here " +
      "anymore. The trees are old enough to remember who's buried " +
      "beneath them, and they haven't forgotten."
  },
  hollowmereCairn: {
    id: "hollowmereCairn",
    name: "The Hollowmere Cairn",
    difficulty: "Adept",
    musicSrc: "assets/audio/hollowmere-cairn.mp3",
    image: "assets/images/hollowmere-cairn.png",
    description:
      "A burial-mound complex out on the moors where several Deveran " +
      "clans' dead lie together. The old ancestral magic here has " +
      "gone wrong, tinged with something wilder and less patient than " +
      "any bloodline gift should be."
  },
  frosthollowVault: {
    id: "frosthollowVault",
    name: "Frosthollow Vault",
    difficulty: "Adept",
    musicSrc: "assets/audio/frosthollow-vault.mp3",
    image: "assets/images/frosthollow-vault.png",
    description:
      "An ice-cave forge-vault where the Drakvarr's greatest " +
      "rune-smiths were buried beside their finest work. The runes " +
      "here run colder and stranger than any spoken aloud in living " +
      "memory — and the smiths seem to still be finishing something."
  },
  hollowVale: {
    id: "hollowVale",
    name: "The Hollow Vale",
    difficulty: "Expert",
    musicSrc: "assets/audio/hollow-vale.mp3",
    image: "assets/images/hollow-vale.png",
    description:
      "A ring of standing stones where the Túath once gathered to " +
      "decide as one. Something answers in their place now, and it " +
      "has no interest in consensus."
  }
};

const DUNGEON_CONTENT = {
  duncairnKeep: {
    startRoomId: "gateway",
    rooms: {
      gateway: {
        text: "The gates of Duncairn Keep stand open, rusted from disuse rather than force. Fog pools around the threshold like it's reluctant to follow you in. Somewhere above, a banner snaps in wind you can't feel down here.",
        choices: [
          { label: "Step through the gate", type: "goto", target: "courtyard" }
        ]
      },
      courtyard: {
        text: "Weeds have split the flagstones of the courtyard, and a dry well sits crooked near the far wall. The great doors to the hall stand ahead, banded in iron gone the color of old blood. A rusted side-chest lies half-buried near the wall, its lock long seized.",
        choices: [
          { label: "Cross to the hall doors", type: "goto", target: "greatHallDoors" },
          { label: "Search the old well (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "wellFind", failureTarget: "houndAmbush" },
          { label: "Pick the lock on the side-chest (Lockpicking)", type: "check", skillId: "lockpicking", difficulty: "Novice", successTarget: "sideChestLoot", failureTarget: "greatHallDoors" }
        ]
      },
      sideChestLoot: {
        text: "The old lock finally gives way. Inside, wedged among rotted cloth, you find a scrap of good ore someone hid long before the keep fell silent.",
        loot: ["Old Ore"],
        choices: [
          { label: "Head to the hall doors", type: "goto", target: "greatHallDoors" }
        ]
      },
      wellFind: {
        text: "The well is dry, but wedged in its cracked stones you find a scrap of old ore, worn smooth by whoever hid it there.",
        loot: ["Old Ore"],
        choices: [
          { label: "Head to the hall doors", type: "goto", target: "greatHallDoors" }
        ]
      },
      houndAmbush: {
        text: "Something moves at the mouth of the well before you can look twice — a hound long dead, its collar still bearing a clan crest, lunges from the dark.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "graveBoundHound", target: "greatHallDoors" }
        ]
      },
      greatHallDoors: {
        text: "The iron-banded doors groan against years of rust. Beyond them, faint torchlight flickers where no living hand should be tending a flame.",
        choices: [
          { label: "Push the doors open", type: "goto", target: "greatHallFight" }
        ]
      },
      greatHallFight: {
        text: "A guardsman in tarnished mail turns at the sound of the doors — too slowly, too stiffly, his eyes fixed on a war that ended long ago.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "restlessGuardsman", target: "greatHall" }
        ]
      },
      greatHall: {
        text: "The Great Hall opens around you, its long table still set for a feast no one came to eat. Dust lies thick over silver gone black with age. A side door leads to what might once have been an armory.",
        choices: [
          { label: "Move deeper into the keep", type: "goto", target: "diningHall" },
          { label: "Search the old armory (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "armory", failureTarget: "diningHall" }
        ]
      },
      armory: {
        text: "Racks of rusted weapons line the armory walls. Wedged behind a fallen shield, a scrap of old writing — a bloodline technique, half-remembered.",
        choices: [
          { label: "Study the technique (Line of Averick)", type: "discover", skillId: "ancestralAverick", spellId: "stormedge", target: "diningHall" },
          { label: "Leave it and move on", type: "goto", target: "diningHall" }
        ]
      },
      diningHall: {
        text: "A side room off the hall, chairs overturned, as if the last meal ended badly. A door to the north leads toward what look like the keep's private chambers. A smaller door leads to what was once a library.",
        choices: [
          { label: "Continue north", type: "goto", target: "bannerHall" },
          { label: "Search the library (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "library", failureTarget: "bannerHall" }
        ]
      },
      library: {
        text: "Most of the books have rotted to pulp, but one journal, sealed in wax, has survived — a wizard's notes, still legible. Tucked on a lower shelf, a battered lockpick's manual has somehow stayed dry.",
        choices: [
          { label: "Study the notes (Line of Emyrs)", type: "discover", skillId: "ancestralEmyrs", spellId: "frostbolt", target: "bannerHall" },
          { label: "Study the lockpick's manual (Learn Lockpicking)", type: "learnSkill", skillId: "lockpicking", target: "bannerHall" },
          { label: "Leave it and move on", type: "goto", target: "bannerHall" }
        ]
      },
      bannerHall: {
        text: "Deveran clan banners hang in tatters along this corridor, each stitched with a different clan mark — none of them the chief's own.",
        choices: [
          { label: "Search among the banners (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "bannerLoot", failureTarget: "corridor" },
          { label: "Move on", type: "goto", target: "corridor" }
        ]
      },
      bannerLoot: {
        text: "Behind one banner, you find a pouch someone hid and never came back for.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Continue", type: "goto", target: "corridor" }
        ]
      },
      corridor: {
        text: "A narrow corridor slopes down on one side toward cold, damp air, and climbs on the other toward a stairwell of pale stone. A second hound blocks the way up, hackles raised over a collar it no longer needs.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "graveBoundHound", target: "stairwell" }
        ]
      },
      stairwell: {
        text: "The stairwell forks: one flight climbs toward what was once the chief's solar, the other descends toward the keep's crypts.",
        choices: [
          { label: "Climb to the solar", type: "goto", target: "solarRoom" },
          { label: "Descend to the crypts", type: "goto", target: "cryptEntrance" }
        ]
      },
      solarRoom: {
        text: "The solar is a ruin of fine furniture and rot. Something pale drifts near the shattered window, humming a tune with no tune to it.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "hollowRetainer", target: "solarAftermath" }
        ]
      },
      solarAftermath: {
        text: "Beneath the wreckage of a writing desk, you find a bundle of grave-warm essence, still faintly glowing.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Descend toward the chief's door", type: "goto", target: "chiefsDoor" }
        ]
      },
      cryptEntrance: {
        text: "The crypt entrance is close and dark, lined with alcoves. Something with too many teeth is curled in the nearest one, not quite sleeping.",
        choices: [
          { label: "Slip past quietly (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "cryptPast", failureTarget: "cryptFight" }
        ]
      },
      cryptFight: {
        text: "It wakes before you're halfway past — a steward, once, his hands blackened with rot, rising to bar your way.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rotHandedSteward", target: "cryptPast" }
        ]
      },
      cryptPast: {
        text: "Past the alcoves, an old strongbox sits half-buried in rubble, its lock long since rusted through.",
        loot: ["Old Ore", "Grave Essence"],
        choices: [
          { label: "Climb back toward the chief's door", type: "goto", target: "chiefsDoor" }
        ]
      },
      chiefsDoor: {
        text: "Both paths end here, at a door carved with the same crest that flew over every banner in this keep — whole, unmarked, and very cold to the touch.",
        choices: [
          { label: "Open the door", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Inside, something wearing the shape of a Deveran chief turns from an empty throne. Its ancestral magic has curdled into something that answers to no line at all.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "chiefsShade", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Shade dissolves into the dust it should have become years ago. Duncairn Keep is silent again — properly, finally silent — and whatever kept its gates from rusting shut seems to have gone with it.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  sunkenLonghall: {
    startRoomId: "shoreline",
    rooms: {
      shoreline: {
        text: "Black bog-water laps at a half-sunken longhall, its roof-runes still glowing faint blue beneath a crust of algae. The entrance is a dark gap where the doors used to be.",
        choices: [
          { label: "Wade toward the entrance", type: "goto", target: "entryHall" }
        ]
      },
      entryHall: {
        text: "The entry hall is waterlogged and dim. Driftwood and old fishing nets have washed in with the tide. Something shifts beneath the water near the far wall. A sealed chest, lashed shut with corroded chain, sits half-submerged near the entrance.",
        choices: [
          { label: "Cross the hall", type: "goto", target: "greatRoomDoors" },
          { label: "Search the driftwood (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "driftwoodFind", failureTarget: "wightAmbush" },
          { label: "Pick the chain-lock on the chest (Lockpicking)", type: "check", skillId: "lockpicking", difficulty: "Novice", successTarget: "chestFind", failureTarget: "greatRoomDoors" }
        ]
      },
      chestFind: {
        text: "The corroded chain finally snaps. Inside, dry despite the flood, a scrap of good hide waits untouched.",
        loot: ["Hide"],
        choices: [
          { label: "Continue to the doors", type: "goto", target: "greatRoomDoors" }
        ]
      },
      driftwoodFind: {
        text: "Tangled in the driftwood, a scrap of good hide, still usable.",
        loot: ["Hide"],
        choices: [
          { label: "Continue to the doors", type: "goto", target: "greatRoomDoors" }
        ]
      },
      wightAmbush: {
        text: "The shifting shape rises from the black water — a bog wight, weed-wrapped and slow, but closing fast.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "bogWight", target: "greatRoomDoors" }
        ]
      },
      greatRoomDoors: {
        text: "The doors to the great room hang half-open, rune-carved rafters visible beyond, still faintly glowing.",
        choices: [
          { label: "Push through", type: "goto", target: "shieldmanFight" }
        ]
      },
      shieldmanFight: {
        text: "A drowned shieldman turns at the sound, shield raised, rot-green and slow but still remembering how to fight.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "drownedShieldman", target: "greatRoom" }
        ]
      },
      greatRoom: {
        text: "The great room's long table is warped from the water, but the rune-carved rafters above still burn faint blue. A side chamber holds what looks like the shaman's own alcove.",
        choices: [
          { label: "Move toward the rune archive", type: "goto", target: "runeArchive" },
          { label: "Move deeper into the hall", type: "goto", target: "corridor" }
        ]
      },
      runeArchive: {
        text: "The shaman's alcove is dry, somehow, untouched by the flood. Carved tablets line the walls — one still legible. Nearby, a waterlogged journal holds a shipwrecked sailor's notes on surviving the bog.",
        choices: [
          { label: "Study the tablet (Runes of the Blade)", type: "discover", skillId: "runeBlade", spellId: "bloodfuryMark", target: "corridor" },
          { label: "Study the sailor's notes (Learn Survival)", type: "learnSkill", skillId: "survival", target: "corridor" },
          { label: "Leave it and move on", type: "goto", target: "corridor" }
        ]
      },
      corridor: {
        text: "A flooded corridor leads deeper into the hall. A rune-haunted thrall drifts into view, glowing marks faint under drowned skin.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "runehauntedThrall", target: "fork" }
        ]
      },
      fork: {
        text: "The corridor splits: one way climbs toward drier ground and a second archive, the other descends toward what feels like the hall's oldest chamber.",
        choices: [
          { label: "Climb toward the second archive", type: "goto", target: "secondArchive" },
          { label: "Descend toward the old chamber", type: "goto", target: "oldChamberFight" }
        ]
      },
      secondArchive: {
        text: "A second set of tablets, less water-damaged than the first. One still reads clearly.",
        choices: [
          { label: "Study the tablet (Runes of the Vision)", type: "discover", skillId: "runeVision", spellId: "ravensightRune", target: "converge" }
        ]
      },
      oldChamberFight: {
        text: "The old chamber holds another drowned shieldman, standing guard over nothing in particular anymore.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "drownedShieldman", target: "converge" }
        ]
      },
      converge: {
        text: "Both paths lead to the same flooded stairwell, descending toward a chamber where the water runs strangely still.",
        choices: [
          { label: "Descend", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "The still water hides something moving just beneath the surface. You could try to slip past quietly, or simply wade through and take what comes.",
        choices: [
          { label: "Slip past quietly (Stealth)", type: "check", skillId: "stealth", difficulty: "Novice", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "Whatever was beneath the water rises before you can pass — a bog wight, hungrier than the last.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "bogWight", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "A final door, carved with a ship's prow, stands at the end of the flooded hall — cold, and strangely dry to the touch.",
        choices: [
          { label: "Open the door", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Inside, a figure rises from a throne of driftwood and rope — the hall's own chieftain, tidewracked, still holding the shape of command.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "tidewrackedDraugr", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Draugr collapses into black water and weed, and the rune-light overhead finally, quietly, goes out. The Sunken Longhall is just a ruin now.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  wychrootGrove: {
    startRoomId: "groveEdge",
    rooms: {
      groveEdge: {
        text: "The tree line swallows the light almost immediately. Roots as thick as your waist have grown up and over old grave-mounds, and the air smells of wet earth and something older.",
        choices: [
          { label: "Step into the grove", type: "goto", target: "innerPath" }
        ]
      },
      innerPath: {
        text: "The path narrows between close-grown trees. Something rustles in the underbrush — could be nothing, could be a mossbound hound.",
        choices: [
          { label: "Push forward carefully", type: "goto", target: "clearingDoors" },
          { label: "Search the underbrush (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "underbrushFind", failureTarget: "houndAmbush" }
        ]
      },
      underbrushFind: {
        text: "Tangled in a thornbush, a scrap of hide from some animal that didn't get away in time.",
        loot: ["Hide"],
        choices: [
          { label: "Continue on", type: "goto", target: "clearingDoors" }
        ]
      },
      houndAmbush: {
        text: "The rustling was a moss-grown hound after all — dead a long time, moving like it still remembers the hunt.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "mossHound", target: "clearingDoors" }
        ]
      },
      clearingDoors: {
        text: "The trees open onto a wide clearing, thick with grave-mounds. A rootbound husk stands motionless among them, until it isn't.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rootboundHusk", target: "clearing" }
        ]
      },
      clearing: {
        text: "The clearing is ringed with old carved stones, half-swallowed by moss. One stone bears markings still readable, if you look closely. Half-buried at the base of a mound, an iron-bound chest sits shut behind a rusted lock.",
        choices: [
          { label: "Read the marked stone", type: "goto", target: "markedStone" },
          { label: "Move deeper into the grove", type: "goto", target: "deeperPath" },
          { label: "Pick the lock on the buried chest (Lockpicking)", type: "check", skillId: "lockpicking", difficulty: "Novice", successTarget: "clearingChestLoot", failureTarget: "deeperPath" }
        ]
      },
      clearingChestLoot: {
        text: "The lock gives with a final grinding crack. Inside, a bundle of grave-warm essence pulses faintly in the dark.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Move deeper into the grove", type: "goto", target: "deeperPath" }
        ]
      },
      markedStone: {
        text: "The marking is old druidic knotwork, half a spell captured in stone. Beside it, scratched into a flatter rock, is a druid's guide to moving unseen through undergrowth.",
        choices: [
          { label: "Learn what remains (Path of the Wild)", type: "discover", skillId: "pathWild", spellId: "stagsCharge", target: "deeperPath" },
          { label: "Study the druid's guide (Learn Stealth)", type: "learnSkill", skillId: "stealth", target: "deeperPath" },
          { label: "Leave it and move on", type: "goto", target: "deeperPath" }
        ]
      },
      deeperPath: {
        text: "The trees grow closer together here, roots interlocking overhead like a second canopy. A whispering briar blocks the way, thorns twitching toward you.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "whisperingBriar", target: "fork" }
        ]
      },
      fork: {
        text: "The path splits around a fallen, hollowed tree: one way circles left through thicker growth, the other cuts right past a second ring of stones.",
        choices: [
          { label: "Circle left", type: "goto", target: "leftPathFight" },
          { label: "Cut right, past the stones", type: "goto", target: "rightPathStudy" }
        ]
      },
      leftPathFight: {
        text: "Thicker growth means another rootbound husk, roused by your footsteps.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rootboundHusk", target: "converge" }
        ]
      },
      rightPathStudy: {
        text: "The second ring of stones is better preserved than the first, its knotwork still sharp.",
        choices: [
          { label: "Study the knotwork (Path of the Storm)", type: "discover", skillId: "pathStorm", spellId: "frostgale", target: "converge" }
        ]
      },
      converge: {
        text: "Both paths lead to the same place: a wide grave-mound, larger than the rest, roots grown thick and deliberate around its edges.",
        choices: [
          { label: "Approach the great mound", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "Something moves at the base of the mound — not quite hidden, not quite waiting either. You could try to slip past, or simply meet it head-on.",
        choices: [
          { label: "Slip past quietly (Stealth)", type: "check", skillId: "stealth", difficulty: "Novice", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "It notices you before you can pass — another whispering briar, thorns already moving.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "whisperingBriar", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "A gap opens in the roots at the mound's base, dark and close, leading down into the earth itself.",
        choices: [
          { label: "Descend into the mound", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Inside, a figure kneels among the roots — once a druid, tending these graves, now something the graves tend in return.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theBarrowKeeper", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Keeper dissolves into loam and root, and the grove, for the first time, feels merely old rather than watching. The Wychroot Grove is quiet.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  hollowmereCairn: {
    startRoomId: "moorEdge",
    rooms: {
      moorEdge: {
        text: "The moor stretches out under a bruised sky, heather thick between scattered burial mounds. Faint elemental light — red, then blue — leaks from cracks in the largest cairn ahead.",
        choices: [
          { label: "Cross the moor toward the largest cairn", type: "goto", target: "outerMounds" }
        ]
      },
      outerMounds: {
        text: "Smaller mounds ring the largest one, each marked with a different clan sign. A cairn-born sentinel stands among them, stone shifting as you approach.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "cairnbornSentinel", target: "moundPath" },
          { label: "Try to slip past unseen (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "moundPath", failureTarget: "sentinelAmbush" }
        ]
      },
      sentinelAmbush: {
        text: "It notices you halfway past, stone grinding as it turns to intercept.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "cairnbornSentinel", target: "moundPath" }
        ]
      },
      moundPath: {
        text: "A path winds between the mounds toward the central cairn. Wisps of colored light drift along the ground here, unnaturally bright. Half-hidden among the heather, a small grave-chest sits behind a rusted lock.",
        choices: [
          { label: "Continue toward the central cairn", type: "goto", target: "wraithEncounter" },
          { label: "Follow the light-wisps (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "wispFind", failureTarget: "wraithEncounter" },
          { label: "Pick the lock on the grave-chest (Lockpicking)", type: "check", skillId: "lockpicking", difficulty: "Adept", successTarget: "moundChestLoot", failureTarget: "wraithEncounter" }
        ]
      },
      moundChestLoot: {
        text: "The old lock breaks free at last. Inside, a scrap of good ore rests among scattered clan tokens.",
        loot: ["Old Ore"],
        choices: [
          { label: "Continue toward the central cairn", type: "goto", target: "wraithEncounter" }
        ]
      },
      wispFind: {
        text: "The wisps lead to a half-buried cache, old ore still good beneath the dirt.",
        loot: ["Old Ore"],
        choices: [
          { label: "Continue toward the central cairn", type: "goto", target: "wraithEncounter" }
        ]
      },
      wraithEncounter: {
        text: "An ember-touched wraith drifts across the path, wreathed in fire that shouldn't still be burning after all this time.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "emberTouchedWraith", target: "cairnEntrance" }
        ]
      },
      cairnEntrance: {
        text: "The central cairn's entrance is a dark gap between leaning stones, elemental light pulsing faintly from within. A smaller side-cairn nearby looks less disturbed.",
        choices: [
          { label: "Enter the central cairn", type: "goto", target: "innerCairn" },
          { label: "Check the smaller side-cairn first", type: "goto", target: "sideCairn" }
        ]
      },
      sideCairn: {
        text: "The side-cairn holds old grave goods, mostly ruined — except for one scrap of ancestral writing, still whole, and a clan-speaker's notes on winning over a hostile crowd.",
        choices: [
          { label: "Study the writing (Line of Averick)", type: "discover", skillId: "ancestralAverick", spellId: "frostbiteEdge", target: "innerCairn" },
          { label: "Study the speaker's notes (Learn Persuasion)", type: "learnSkill", skillId: "persuasion", target: "innerCairn" },
          { label: "Leave it and enter the central cairn", type: "goto", target: "innerCairn" }
        ]
      },
      innerCairn: {
        text: "Inside, the passage narrows, walls lined with old clan markings that pulse faintly in time with the light ahead. A kinless shade drifts into view, belonging to no mark you recognize.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "kinlessShade", target: "deepPassage" }
        ]
      },
      deepPassage: {
        text: "The passage splits: one way leads toward a chamber that smells of old fire, the other toward one that hums faintly with something else.",
        choices: [
          { label: "Take the fire-scented passage", type: "goto", target: "fireChamberFight" },
          { label: "Take the humming passage", type: "goto", target: "hummingChamberStudy" }
        ]
      },
      fireChamberFight: {
        text: "The fire-scented chamber holds another ember-touched wraith, flames guttering strangely around it.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "emberTouchedWraith", target: "converge" }
        ]
      },
      hummingChamberStudy: {
        text: "The humming chamber holds a wizard's cache, one page of notes still intact despite everything.",
        choices: [
          { label: "Study the notes (Line of Emyrs)", type: "discover", skillId: "ancestralEmyrs", spellId: "stoneshard", target: "converge" }
        ]
      },
      converge: {
        text: "Both passages open onto the same final chamber — the heart of the cairn, where the light is brightest and the air feels thin.",
        choices: [
          { label: "Approach the heart of the cairn", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "Something waits at the threshold, barely visible in the shifting light. You could try to read the moment and move carefully, or simply push through.",
        choices: [
          { label: "Read the moment carefully (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "It resolves into a kinless shade, faster than the last, already closing.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "kinlessShade", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "The final chamber's entrance is a ring of stones, light pulsing between them like something breathing.",
        choices: [
          { label: "Step through the ring", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "At the center, a figure made of shifting, colored fire turns toward you — an ancestor no clan will claim, its gift long since curdled into something else.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theUnnamedAncestor", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Ancestor scatters into embers and goes dark. The Hollowmere Cairn's light fades with it, leaving only ordinary moor and ordinary stone.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  frosthollowVault: {
    startRoomId: "glacierEntrance",
    rooms: {
      glacierEntrance: {
        text: "The entrance is a dark gap in the ice, jagged icicles hanging like teeth. Faint blue rune-light glows somewhere deep inside.",
        choices: [
          { label: "Step into the vault", type: "goto", target: "outerIce" }
        ]
      },
      outerIce: {
        text: "The outer chamber is thick with frost, old forge-tools half-buried in snowdrift. A frostbound warrior stands motionless nearby, ice thick over old armor.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "frostboundWarrior", target: "innerPath" },
          { label: "Move quietly around it (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "innerPath", failureTarget: "warriorAmbush" }
        ]
      },
      warriorAmbush: {
        text: "Ice cracks as it turns toward you before you can slip past.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "frostboundWarrior", target: "innerPath" }
        ]
      },
      innerPath: {
        text: "The passage narrows, walls veined with frozen rune-light. A side alcove looks less disturbed than the rest of the tunnel. A frozen strongbox sits wedged in the ice nearby, its lock rimed over.",
        choices: [
          { label: "Continue deeper", type: "goto", target: "shamanEncounter" },
          { label: "Check the alcove (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "alcoveFind", failureTarget: "shamanEncounter" },
          { label: "Pick the frozen strongbox's lock (Lockpicking)", type: "check", skillId: "lockpicking", difficulty: "Adept", successTarget: "strongboxLoot", failureTarget: "shamanEncounter" }
        ]
      },
      strongboxLoot: {
        text: "The frozen lock finally cracks and gives way. Inside, a scrap of good ore sits untouched by the cold.",
        loot: ["Old Ore"],
        choices: [
          { label: "Continue deeper", type: "goto", target: "shamanEncounter" }
        ]
      },
      alcoveFind: {
        text: "The alcove holds a cache of good ore, untouched by frost.",
        loot: ["Old Ore"],
        choices: [
          { label: "Continue deeper", type: "goto", target: "shamanEncounter" }
        ]
      },
      shamanEncounter: {
        text: "An icebound shaman stands mid-ritual, frozen at the exact moment it never finished casting — until it does.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "iceboundShaman", target: "forgeHallDoors" }
        ]
      },
      forgeHallDoors: {
        text: "Wide doors, rimed in frost, lead into what must be the forge hall proper. A smaller passage branches off to one side.",
        choices: [
          { label: "Enter the forge hall", type: "goto", target: "forgeHall" },
          { label: "Take the side passage first", type: "goto", target: "sidePassageStudy" }
        ]
      },
      sidePassageStudy: {
        text: "The side passage ends in a small shrine, one rune-tablet still legible beneath the frost. Beside it, a smith's journal holds hard-won notes on surviving the vault's endless cold.",
        choices: [
          { label: "Study the tablet (Runes of the Shield)", type: "discover", skillId: "runeShield", spellId: "stonewallRune", target: "forgeHall" },
          { label: "Study the smith's journal (Learn Survival)", type: "learnSkill", skillId: "survival", target: "forgeHall" },
          { label: "Leave it and enter the forge hall", type: "goto", target: "forgeHall" }
        ]
      },
      forgeHall: {
        text: "The forge hall is vast and frozen mid-work — half-finished blades still clamped in ice, tools scattered where they were dropped. A rime-forged golem stands guard over the anvil.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rimeforgedGolem", target: "fork" }
        ]
      },
      fork: {
        text: "Beyond the forge, the vault splits: one passage climbs toward what looks like a rune-archive, the other descends toward colder, darker air.",
        choices: [
          { label: "Climb toward the archive", type: "goto", target: "archiveStudy" },
          { label: "Descend into the cold", type: "goto", target: "coldPassageFight" }
        ]
      },
      archiveStudy: {
        text: "The archive holds rows of frozen tablets. One, cracked but readable, catches your eye.",
        choices: [
          { label: "Study the tablet (Runes of the Curse)", type: "discover", skillId: "runeCurse", spellId: "blightmark", target: "converge" }
        ]
      },
      coldPassageFight: {
        text: "The cold passage holds another frostbound warrior, patient and slow but no less dangerous for it.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "frostboundWarrior", target: "converge" }
        ]
      },
      converge: {
        text: "Both paths end at a final ice-sealed door, faint blue light pulsing steadily from beyond it.",
        choices: [
          { label: "Approach the door", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "Something is working just beyond the door — you can hear the faint ring of a hammer, over and over. You could try to time your approach, or simply enter.",
        choices: [
          { label: "Time your approach (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "The hammering stops the moment you're spotted — a rime-forged golem, roused and ready.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rimeforgedGolem", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "The ice-sealed door gives way easily, colder air pouring out from whatever lies beyond.",
        choices: [
          { label: "Enter", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "At the anvil, a figure still works — the vault's greatest rune-smith, frozen mid-strike on a piece that was never quite finished, and never will be.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theFrozenSmith", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Smith's hammer falls still at last, and the blue rune-light fades from the walls. Frosthollow Vault is only ice now, and silence.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  hollowVale: {
    startRoomId: "valeEdge",
    rooms: {
      valeEdge: {
        text: "The vale opens wide and empty under a darkening sky, a great ring of standing stones visible at its center, carved with druidic knotwork. Long shadows stretch toward you across the grass.",
        choices: [
          { label: "Cross the vale toward the stones", type: "goto", target: "outerRing" }
        ]
      },
      outerRing: {
        text: "A thornwoven stalker moves at the edge of your vision, thorns woven through what was once a Gaeldrim cloak.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "thornwovenStalker", target: "innerVale" },
          { label: "Try to avoid it (Stealth)", type: "check", skillId: "stealth", difficulty: "Expert", successTarget: "innerVale", failureTarget: "stalkerAmbush" }
        ]
      },
      stalkerAmbush: {
        text: "It catches your movement before you can pass unseen.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "thornwovenStalker", target: "innerVale" }
        ]
      },
      innerVale: {
        text: "Closer to the ring, the grass gives way to bare, cracked earth. A faint green-white light pulses from the center of the stone circle. A smaller cluster of stones stands off to one side. Half-buried nearby, an old offering-chest sits behind a corroded lock.",
        choices: [
          { label: "Move toward the smaller cluster", type: "goto", target: "smallCluster" },
          { label: "Head straight for the ring", type: "goto", target: "voiceEncounter" },
          { label: "Pick the lock on the offering-chest (Lockpicking)", type: "check", skillId: "lockpicking", difficulty: "Expert", successTarget: "offeringChestLoot", failureTarget: "voiceEncounter" }
        ]
      },
      offeringChestLoot: {
        text: "The ancient lock breaks apart in your hands. Inside, a bundle of grave-warm essence still pulses faintly, undisturbed for generations.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Head straight for the ring", type: "goto", target: "voiceEncounter" }
        ]
      },
      smallCluster: {
        text: "The smaller stones are older, their knotwork worn nearly smooth — except for one line, still sharp. Scratched beneath it, almost hidden, a seer's notes on picking apart a stubborn lock.",
        choices: [
          { label: "Read the line (Path of the Barrow)", type: "discover", skillId: "pathBarrow", spellId: "bonewhisper", target: "voiceEncounter" },
          { label: "Read the seer's notes (Learn Lockpicking)", type: "learnSkill", skillId: "lockpicking", target: "voiceEncounter" },
          { label: "Leave it and continue", type: "goto", target: "voiceEncounter" }
        ]
      },
      voiceEncounter: {
        text: "One of the standing stones speaks — or something speaking through it — as you draw near, and the air itself seems to answer.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "stoneboundVoice", target: "ringApproach" }
        ]
      },
      ringApproach: {
        text: "The great ring is close now, tuath remnants visible standing motionless between the stones, still arranged as if for a gathering. One side of the ring holds a lone standing stone, apart from the rest.",
        choices: [
          { label: "Approach the lone stone", type: "goto", target: "loneStoneStudy" },
          { label: "Move straight through the gathering", type: "goto", target: "remnantFight" }
        ]
      },
      loneStoneStudy: {
        text: "The lone stone's carving is different from the rest — a storm-pattern, still humming faintly with old weather.",
        choices: [
          { label: "Study the pattern (Path of the Storm)", type: "discover", skillId: "pathStorm", spellId: "thunderclap", target: "remnantFight" }
        ]
      },
      remnantFight: {
        text: "The gathered dead stir as you pass between them — a Túath remnant, still standing in the circle it died arguing in.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "tuathRemnant", target: "innerRing" }
        ]
      },
      innerRing: {
        text: "Inside the great ring, the ground is cracked open at the very center, green-white light pulsing up from beneath. The air hums with something that isn't quite sound.",
        choices: [
          { label: "Approach the crack in the earth", type: "goto", target: "preBoss" }
        ]
      },
      preBoss: {
        text: "The light pulses faster the closer you get, and for a moment it feels almost like being watched by many eyes at once. You could try to steady yourself and time your approach, or simply step forward.",
        choices: [
          { label: "Steady yourself and approach carefully (Survival)", type: "check", skillId: "survival", difficulty: "Expert", successTarget: "bossDoor", failureTarget: "extraFight" }
        ]
      },
      extraFight: {
        text: "The ground itself seems to resist you — another thornwoven stalker, faster than the last, rising from the cracked earth.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "thornwovenStalker", target: "bossDoor" }
        ]
      },
      bossDoor: {
        text: "The crack in the earth widens just enough to step through, green-white light washing over everything.",
        choices: [
          { label: "Step down into the light", type: "goto", target: "bossRoom" }
        ]
      },
      bossRoom: {
        text: "Below, the light resolves into something that was once many voices and is now only one — the Túath's old consensus, fused into a single, unyielding will.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theConsensus", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "The Consensus scatters into a hundred fading voices, and then into none at all. The Hollow Vale is silent, and for the first time in a very long while, actually empty.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  }
};

// ----------------------------------------------------------
// PER-ROOM SCENE IMAGES
// Maps each dungeon's individual room IDs to their own scene
// image, so the viewport changes as you move through a dungeon
// instead of showing one shared image for the whole thing.
// Rooms that share a physical location (e.g. a fight that
// happens right where you already are) point to the same image
// on purpose. New bonus rooms (lockpicked chests, skill-learning
// finds) reuse the image of the room they branch from, since
// they're the same physical space. Any room ID NOT listed here
// simply falls back to the dungeon's original single image —
// see getRoomImage() in main.js — so nothing breaks if a room
// is ever added without updating this table.
// ----------------------------------------------------------
const ROOM_IMAGES = {
  duncairnKeep: {
    gateway: "assets/images/duncairn-keep/gateway.png",
    courtyard: "assets/images/duncairn-keep/courtyard.png",
    sideChestLoot: "assets/images/duncairn-keep/courtyard.png",
    wellFind: "assets/images/duncairn-keep/courtyard.png",
    houndAmbush: "assets/images/duncairn-keep/courtyard.png",
    greatHallDoors: "assets/images/duncairn-keep/great-hall-doors.png",
    greatHallFight: "assets/images/duncairn-keep/great-hall-doors.png",
    greatHall: "assets/images/duncairn-keep/great-hall.png",
    armory: "assets/images/duncairn-keep/armory.png",
    diningHall: "assets/images/duncairn-keep/dining-hall.png",
    library: "assets/images/duncairn-keep/library.png",
    bannerHall: "assets/images/duncairn-keep/banner-hall.png",
    bannerLoot: "assets/images/duncairn-keep/banner-hall.png",
    corridor: "assets/images/duncairn-keep/corridor.png",
    stairwell: "assets/images/duncairn-keep/stairwell.png",
    solarRoom: "assets/images/duncairn-keep/solar-room.png",
    solarAftermath: "assets/images/duncairn-keep/solar-room.png",
    cryptEntrance: "assets/images/duncairn-keep/crypt.png",
    cryptFight: "assets/images/duncairn-keep/crypt.png",
    cryptPast: "assets/images/duncairn-keep/crypt.png",
    chiefsDoor: "assets/images/duncairn-keep/chiefs-door.png",
    bossRoom: "assets/images/duncairn-keep/boss-room.png",
    epilogue: "assets/images/duncairn-keep/boss-room.png"
  },
  sunkenLonghall: {
    shoreline: "assets/images/sunken-longhall/shoreline.png",
    entryHall: "assets/images/sunken-longhall/entry-hall.png",
    chestFind: "assets/images/sunken-longhall/entry-hall.png",
    driftwoodFind: "assets/images/sunken-longhall/entry-hall.png",
    wightAmbush: "assets/images/sunken-longhall/entry-hall.png",
    greatRoomDoors: "assets/images/sunken-longhall/great-room-doors.png",
    shieldmanFight: "assets/images/sunken-longhall/great-room-doors.png",
    greatRoom: "assets/images/sunken-longhall/great-room.png",
    runeArchive: "assets/images/sunken-longhall/rune-archive.png",
    corridor: "assets/images/sunken-longhall/corridor.png",
    fork: "assets/images/sunken-longhall/fork.png",
    secondArchive: "assets/images/sunken-longhall/second-archive.png",
    oldChamberFight: "assets/images/sunken-longhall/old-chamber.png",
    converge: "assets/images/sunken-longhall/flooded-stairwell.png",
    preBoss: "assets/images/sunken-longhall/flooded-stairwell.png",
    extraFight: "assets/images/sunken-longhall/flooded-stairwell.png",
    bossDoor: "assets/images/sunken-longhall/boss-door.png",
    bossRoom: "assets/images/sunken-longhall/boss-room.png",
    epilogue: "assets/images/sunken-longhall/boss-room.png"
  },
  wychrootGrove: {
    groveEdge: "assets/images/wychroot-grove/grove-edge.png",
    innerPath: "assets/images/wychroot-grove/inner-path.png",
    underbrushFind: "assets/images/wychroot-grove/inner-path.png",
    houndAmbush: "assets/images/wychroot-grove/inner-path.png",
    clearingDoors: "assets/images/wychroot-grove/clearing.png",
    clearing: "assets/images/wychroot-grove/clearing.png",
    clearingChestLoot: "assets/images/wychroot-grove/clearing.png",
    markedStone: "assets/images/wychroot-grove/marked-stone.png",
    deeperPath: "assets/images/wychroot-grove/deeper-path.png",
    fork: "assets/images/wychroot-grove/fork.png",
    leftPathFight: "assets/images/wychroot-grove/left-path.png",
    rightPathStudy: "assets/images/wychroot-grove/right-path-stones.png",
    converge: "assets/images/wychroot-grove/converge.png",
    preBoss: "assets/images/wychroot-grove/converge.png",
    extraFight: "assets/images/wychroot-grove/converge.png",
    bossDoor: "assets/images/wychroot-grove/boss-door.png",
    bossRoom: "assets/images/wychroot-grove/boss-room.png",
    epilogue: "assets/images/wychroot-grove/boss-room.png"
  },
  hollowmereCairn: {
    moorEdge: "assets/images/hollowmere-cairn/moor-edge.png",
    outerMounds: "assets/images/hollowmere-cairn/outer-mounds.png",
    sentinelAmbush: "assets/images/hollowmere-cairn/outer-mounds.png",
    moundPath: "assets/images/hollowmere-cairn/mound-path.png",
    moundChestLoot: "assets/images/hollowmere-cairn/mound-path.png",
    wispFind: "assets/images/hollowmere-cairn/mound-path.png",
    wraithEncounter: "assets/images/hollowmere-cairn/wraith-encounter.png",
    cairnEntrance: "assets/images/hollowmere-cairn/cairn-entrance.png",
    sideCairn: "assets/images/hollowmere-cairn/side-cairn.png",
    innerCairn: "assets/images/hollowmere-cairn/inner-cairn.png",
    deepPassage: "assets/images/hollowmere-cairn/deep-passage.png",
    fireChamberFight: "assets/images/hollowmere-cairn/fire-chamber.png",
    hummingChamberStudy: "assets/images/hollowmere-cairn/humming-chamber.png",
    converge: "assets/images/hollowmere-cairn/converge.png",
    preBoss: "assets/images/hollowmere-cairn/pre-boss.png",
    extraFight: "assets/images/hollowmere-cairn/pre-boss.png",
    bossDoor: "assets/images/hollowmere-cairn/boss-door.png",
    bossRoom: "assets/images/hollowmere-cairn/boss-room.png",
    epilogue: "assets/images/hollowmere-cairn/boss-room.png"
  },
  frosthollowVault: {
    glacierEntrance: "assets/images/frosthollow-vault/glacier-entrance.png",
    outerIce: "assets/images/frosthollow-vault/outer-ice.png",
    warriorAmbush: "assets/images/frosthollow-vault/outer-ice.png",
    innerPath: "assets/images/frosthollow-vault/inner-path.png",
    strongboxLoot: "assets/images/frosthollow-vault/inner-path.png",
    alcoveFind: "assets/images/frosthollow-vault/inner-path.png",
    shamanEncounter: "assets/images/frosthollow-vault/shaman-encounter.png",
    forgeHallDoors: "assets/images/frosthollow-vault/forge-hall-doors.png",
    sidePassageStudy: "assets/images/frosthollow-vault/side-passage-shrine.png",
    forgeHall: "assets/images/frosthollow-vault/forge-hall.png",
    fork: "assets/images/frosthollow-vault/fork.png",
    archiveStudy: "assets/images/frosthollow-vault/archive.png",
    coldPassageFight: "assets/images/frosthollow-vault/cold-passage.png",
    converge: "assets/images/frosthollow-vault/converge.png",
    preBoss: "assets/images/frosthollow-vault/pre-boss.png",
    extraFight: "assets/images/frosthollow-vault/pre-boss.png",
    bossDoor: "assets/images/frosthollow-vault/pre-boss.png",
    bossRoom: "assets/images/frosthollow-vault/boss-room.png",
    epilogue: "assets/images/frosthollow-vault/boss-room.png"
  },
  hollowVale: {
    valeEdge: "assets/images/hollow-vale/vale-edge.png",
    outerRing: "assets/images/hollow-vale/outer-ring.png",
    stalkerAmbush: "assets/images/hollow-vale/outer-ring.png",
    innerVale: "assets/images/hollow-vale/inner-vale.png",
    offeringChestLoot: "assets/images/hollow-vale/inner-vale.png",
    smallCluster: "assets/images/hollow-vale/small-cluster.png",
    voiceEncounter: "assets/images/hollow-vale/voice-encounter.png",
    ringApproach: "assets/images/hollow-vale/ring-approach.png",
    loneStoneStudy: "assets/images/hollow-vale/lone-stone.png",
    remnantFight: "assets/images/hollow-vale/remnant-gathering.png",
    innerRing: "assets/images/hollow-vale/inner-ring.png",
    preBoss: "assets/images/hollow-vale/pre-boss.png",
    extraFight: "assets/images/hollow-vale/pre-boss.png",
    bossDoor: "assets/images/hollow-vale/boss-door.png",
    bossRoom: "assets/images/hollow-vale/boss-room.png",
    epilogue: "assets/images/hollow-vale/boss-room.png"
  }
};

function getRoomImage(dungeonId, roomId) {
  const dungeonMap = ROOM_IMAGES[dungeonId];
  if (dungeonMap && dungeonMap[roomId]) {
    return dungeonMap[roomId];
  }
  return DUNGEONS[dungeonId] ? DUNGEONS[dungeonId].image : null;
}
