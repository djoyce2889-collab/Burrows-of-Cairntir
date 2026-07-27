/* ============================================================
   DATA-DUNGEONS.JS
   Dungeon list, all 7 dungeons' room content, and per-room
   scene image lookup.
   ============================================================ */

const DUNGEONS = {
  duncairnKeep: {
    id: "duncairnKeep",
    name: "Duncairn Keep",
    difficulty: "Novice",
    musicSrc: "assets/audio/duncairn-keep.mp3",
    hotspotColor: "#c0392b",
    mapHotspot: { top: "50%", left: "20%" },
    culture: "deveran",
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
    hotspotColor: "#2980b9",
    mapHotspot: { top: "85%", left: "15%" },
    culture: "drakvarr",
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
    hotspotColor: "#27ae60",
    mapHotspot: { top: "28%", left: "22%" },
    culture: "gaeldrim",
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
    hotspotColor: "#e67e22",
    mapHotspot: { top: "58%", left: "75%" },
    culture: "deveran",
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
    hotspotColor: "#1abc9c",
    mapHotspot: { top: "50%", left: "78%" },
    culture: "drakvarr",
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
    hotspotColor: "#8e44ad",
    mapHotspot: { top: "50%", left: "80%" },
    culture: "gaeldrim",
    image: "assets/images/hollow-vale.png",
    description:
      "A ring of standing stones where the Túath once gathered to " +
      "decide as one. Something answers in their place now, and it " +
      "has no interest in consensus."
  },
  blackforgeDeep: {
    id: "blackforgeDeep",
    name: "The Blackforge Deep",
    difficulty: "Expert",
    musicSrc: "assets/audio/blackforge-deep-theme.mp3",
    hotspotColor: "#7f8c8d",
    mapHotspot: { top: "50%", left: "50%" },
    culture: "drakvarr",
    image: "assets/images/blackforge-deep.png",
    description:
      "An ancient dwarven stronghold, overrun from below by something " +
      "wearing the shape of its own kin."
  },
  fomorianDepths: {
    id: "fomorianDepths",
    name: "The Fomorian Depths",
    difficulty: "Adept",
    musicSrc: "assets/audio/fomorian-depths-theme.mp3",
    hotspotColor: "#16a085",
    mapHotspot: { top: "72%", left: "16%" },
    culture: "gaeldrim",
    image: "assets/images/fomorian-depths.png",
    description:
      "A sea-cave older than the Tuatha Dé Danann themselves, home to " +
      "something that came before even the old gods — and never fully " +
      "left."
  },
  cailleachsReach: {
    id: "cailleachsReach",
    name: "Cailleach's Reach",
    difficulty: "Expert",
    musicSrc: "assets/audio/cailleachs-reach-theme.mp3",
    hotspotColor: "#3498db",
    mapHotspot: { top: "12%", left: "55%" },
    culture: "deveran",
    image: "assets/images/cailleachs-reach.png",
    description:
      "A storm-lashed Highland peak, older than any Deveran clan, home " +
      "to the winter goddess herself — and the mountain remembers her " +
      "far better than it remembers you."
  },
  restlessBaobab: {
    id: "restlessBaobab",
    name: "The Restless Baobab",
    difficulty: "Novice",
    musicSrc: "assets/audio/restless-baobab-theme.mp3",
    hotspotColor: "#2ecc71",
    mapHotspot: { top: "25%", left: "30%" },
    enemyCastableTypes: ["doubleDrain", "powerSteal"],
    culture: "vandiri",
    image: "assets/images/restless-baobab.png",
    description:
      "A tropical grove of ancient baobab trees, once tended in " +
      "quiet reverence — the ancestors who watched over it have " +
      "grown resentful of the living, and no longer watch kindly."
  },
  dragonShrine: {
    id: "dragonShrine",
    name: "Dragon's Shrine",
    difficulty: "Novice",
    musicSrc: "assets/audio/dragon-shrine.mp3",
    mapHotspot: { top: "62%", left: "50%" },
    culture: "yorenshi",
    hotspotColor: "#d4a574",
    image: "assets/images/dragon-shrine.png",
    description:
      "An ancient island shrine, mist-wrapped and timeless, " +
      "devoted to a dragon older than any Yorenshi name — " +
      "and the dragon has not forgotten its worshippers."
  },

  theForsakenManor: {
    id: "theForsakenManor",
    name: "The Forsaken Manor",
    difficulty: "Adept",
    musicSrc: "assets/audio/forsaken-manor.mp3",
    mapHotspot: { top: "32%", left: "25%" },
    culture: "yorenshi",
    hotspotColor: "#8b7355",
    image: "assets/images/forsaken-manor.png",
    description:
      "An isolated manor hidden deep in mountain valleys, " +
      "where a corrupted Daimyo's will still commands the halls — " +
      "and the spirits trapped within have forgotten what freedom feels like."
  },

  drownedShrine: {
    id: "drownedShrine",
    name: "The Drowned Shrine",
    difficulty: "Expert",
    musicSrc: "assets/audio/drowned-shrine-theme.mp3",
    hotspotColor: "#5dade2",
    mapHotspot: { top: "50%", left: "85%" },
    culture: "vandiri",
    enemyCastableTypes: ["doubleDrain", "powerSteal"],
    image: "assets/images/drowned-shrine.png",
    description:
      "A riverside shrine once devoted to the old water-spirits, " +
      "now flooded and turned hostile — whatever protected this " +
      "place has forgotten how to do anything but guard it against " +
      "everyone."

  
  },
  emberScarredOutcrop: {
    id: "emberScarredOutcrop",
    name: "The Ember-Scarred Outcrop",
    difficulty: "Adept",
    musicSrc: "assets/audio/ember-scarred-outcrop-theme.mp3",
    mapHotspot: { top: "50%", left: "26%" },
    culture: "vandiri",
    enemyCastableTypes: ["doubleDrain", "powerSteal"],
    hotspotColor: "#d35400",
    image: "assets/images/ember-scarred-outcrop.png",
    description:
      "A shrine of righteous fire and judgment, burned and left " +
      "smoldering — whatever justice this place once served, it " +
      "no longer distinguishes the guilty from anyone else who " +
      "wanders in."
  },
  crowWindDojo: {
    id: "crowWindDojo",
    name: "The Crow-Wind Dojo",
    culture: "yorenshi",
    difficulty: "Expert",
    description: "A mountain dojo where an unnatural wind has spent years twisting its once-disciplined guardian spirits into something feral and territorial.",
    image: "assets/images/crow-wind-dojo.png",
    musicSrc: "assets/audio/crow-wind-dojo.mp3",
    mapHotspot: { top: "40%", left: "80%" },
    hotspotColor: "#8a6fb0"
  },
  sunderedThrone: {
    id: "sunderedThrone",
    name: "The Sundered Throne",
    difficulty: "Master",
    musicSrc: "assets/audio/sundered-throne-theme.mp3",
    hotspotColor: "#3498db",
    mapHotspot: { top: "8%", left: "58%" },
    culture: "deveran",
    image: "assets/images/sundered-throne.png",
    description:
      "Deeper than Cailleach's Reach ever led lies the first hall the clans ever raised — " +
      "and the throne of the ancestor every Deveran still claims blood from. Only Averick's " +
      "name got carved into the old songs. Someone else was standing right beside him when they carved it."
  },
  widowsHollow: {
    id: "widowsHollow",
    name: "The Widow's Hollow",
    difficulty: "Master",
    musicSrc: "assets/audio/widows-hollow-theme.mp3",
    hotspotColor: "#8e44ad",
    mapHotspot: { top: "52%", left: "22%" },
    culture: "gaeldrim",
    image: "assets/images/widows-hollow.png",
    description:
      "Past the last marked grave, an overgrown hollow waits — mist-choked, far older than any headstone above ever admitted. " +
      "A bride forced into a marriage that killed her has been mourning down here ever since, and everyone who was ever " +
      "complicit in it seems to be mourning right alongside her."
  },
  sigrunsThreshold: {
    id: "sigrunsThreshold",
    name: "Sigrun's Threshold",
    difficulty: "Master",
    musicSrc: "assets/audio/sigruns-threshold-theme.mp3",
    hotspotColor: "#5dade2",
    mapHotspot: { top: "18%", left: "70%" },
    culture: "drakvarr",
    image: "assets/images/sigruns-threshold.png",
    description:
      "Deep beneath the hold, the barrow grows thin enough to touch the edge of something far greater. " +
      "A Valkyrie keeps her ancient watch here, and the legendary dead she's gathered over centuries " +
      "test anyone bold enough to reach her — mortal, fae, living, or something else entirely."
  },
  oldSpiritGrove: {
    id: "oldSpiritGrove",
    name: "The Old Spirit-Grove",
    difficulty: "Master",
    musicSrc: "assets/audio/old-spirit-grove-theme.mp3",
    hotspotColor: "#d4a017",
    mapHotspot: { top: "65%", left: "45%" },
    culture: "vandiri",
    image: "assets/images/old-spirit-grove.png",
    description:
      "Deep in the bush where no path leads, the first spirit-society still keeps its old grove — " +
      "the very source the Leopard-kin themselves claim descent from. Nothing here is hostile by nature. " +
      "Everything here is testing whether you're worthy to know what's left of the old ways."
  },
  orochisValley: {
    id: "orochisValley",
    name: "Yamata-no-Orochi's Valley",
    difficulty: "Master",
    musicSrc: "assets/audio/orochis-valley-theme.mp3",
    hotspotColor: "#c0392b",
    mapHotspot: { top: "30%", left: "88%" },
    culture: "yorenshi",
    image: "assets/images/orochis-valley.png",
    description:
      "Along the Hii River, in the valley of ancient Izumo, an eight-headed serpent has demanded a sacrifice " +
      "every season for as long as anyone can remember. The valley remembers everyone it's ever taken."
  },
  gordonsDue: {
    id: "gordonsDue",
    name: "Gordon's Due",
    difficulty: "Master",
    musicSrc: "assets/audio/gordons-due-theme.mp3",
    hotspotColor: "#e67e22",
    mapHotspot: { top: "45%", left: "35%" },
    culture: "deveran",
    image: "assets/images/gordons-due.png",
    description:
      "Generations ago, Clan Gordon was exiled for backing the wrong claim to Duncairn's throne — and with it, " +
      "cut off from their promised share of the founding hoard. Their patience has finally run out, and they've " +
      "come to take back what they've always believed was theirs."
  },
  wolfCoatsCurse: {
    id: "wolfCoatsCurse",
    name: "The Wolf-Coat's Curse",
    difficulty: "Master",
    musicSrc: "assets/audio/wolf-coats-curse-theme.mp3",
    hotspotColor: "#7f8c8d",
    mapHotspot: { top: "35%", left: "60%" },
    culture: "drakvarr",
    image: "assets/images/wolf-coats-curse.png",
    description:
      "Generations ago, a warband of wolf-coat warriors pushed the old ritual too far, too many times, chasing " +
      "the battle-madness until the wolf never let go again. They never stopped fighting. They just stopped " +
      "being entirely themselves."
  },
  unseelieCourt: {
    id: "unseelieCourt",
    name: "The Unseelie Court",
    difficulty: "Master",
    musicSrc: "assets/audio/unseelie-court-theme.mp3",
    hotspotColor: "#6c3483",
    mapHotspot: { top: "55%", left: "70%" },
    culture: "gaeldrim",
    image: "assets/images/unseelie-court.png",
    description:
      "The Sídhe strike bargains as easily as they break them — but even among their own kind, one court has " +
      "abandoned fairness entirely, keeping only the cruelty. What was once merely uncanny has become something " +
      "genuinely dangerous."
  },
  hollowFaced: {
    id: "hollowFaced",
    name: "The Hollow-Faced",
    difficulty: "Master",
    musicSrc: "assets/audio/hollow-faced-theme.mp3",
    hotspotColor: "#8e6b3a",
    mapHotspot: { top: "60%", left: "30%" },
    culture: "vandiri",
    image: "assets/images/hollow-faced.png",
    description:
      "The village looks ordinary enough from the road — familiar faces, familiar routines. But something has " +
      "been moving through it for years, unnoticed, claiming a few more of its people every season."
  },
  diyusJudgment: {
    id: "diyusJudgment",
    name: "Diyu's Judgment",
    difficulty: "Master",
    musicSrc: "assets/audio/diyus-judgment-theme.mp3",
    hotspotColor: "#a93226",
    mapHotspot: { top: "75%", left: "85%" },
    culture: "yorenshi",
    image: "assets/images/diyus-judgment.png",
    description:
      "Somewhere the ground gives way entirely, and the path down leads somewhere no living soul is meant to " +
      "walk. Diyu keeps its own ledger, and Yanluo Wang has never once made an exception for the living."
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
        text: "Weeds have split the flagstones of the courtyard, and a dry well sits crooked near the far wall. The great doors to the hall stand ahead, banded in iron gone the color of old blood.",
        choices: [
          { label: "Cross to the hall doors", type: "goto", target: "greatHallDoors" },
          { label: "Search the old well (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "wellFind", failureTarget: "houndAmbush" }
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
          { label: "Fight", type: "combat", enemyId: "restlessGuardsman", target: "greatHall" },
          {
            label: "Try to reason with him (Persuasion)",
            type: "persuade",
            skillId: "ancestralAverick",
            spellId: "warbloodFury",
            enemyId: "restlessGuardsman",
            target: "greatHall",
            failDialogue: [
              "\"The post,\" he mutters, \"is not yours to relieve.\"",
              "\"I know no colors of yours,\" he says. \"Stand down, or be stood down.\"",
              "\"The war does not end,\" he says, \"because you say it does.\""
            ],
            finalFailDialogue: "His eyes never truly settle on you — only on a battle that never left him."
          }
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
          { label: "Study the technique (Line of Averick)", type: "discover", skillId: "ancestralAverick", spellId: "warbloodFury", target: "diningHall" },
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
        text: "Most of the books have rotted to pulp, but one journal, sealed in wax, has survived — a wizard's notes, still legible.",
        choices: [
          { label: "Study the notes (Line of Emyrs)", type: "discover", skillId: "ancestralEmyrs", spellId: "mindshatter", target: "bannerHall" },
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
        text: "The entry hall is waterlogged and dim. Driftwood and old fishing nets have washed in with the tide. Something shifts beneath the water near the far wall.",
        choices: [
          { label: "Cross the hall", type: "goto", target: "greatRoomDoors" },
          { label: "Search the driftwood (Survival)", type: "check", skillId: "survival", difficulty: "Novice", successTarget: "driftwoodFind", failureTarget: "wightAmbush" }
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
          { label: "Fight", type: "combat", enemyId: "drownedShieldman", target: "greatRoom" },
          {
            label: "Invoke the old oaths of the hall (Persuasion)",
            type: "persuade",
            skillId: "runeVision",
            spellId: "foreseenOpening",
            enemyId: "drownedShieldman",
            target: "greatRoom",
            failDialogue: [
              "The shieldman's rotted jaw works soundlessly, but the shield does not lower.",
              "Something in the ruined eyes almost seems to recognize the old words — almost.",
              "The shield rises higher instead, as if the oath itself offends him now."
            ],
            finalFailDialogue: "Whatever oath once bound him, it has long since drowned with everything else."
          }
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
        text: "The shaman's alcove is dry, somehow, untouched by the flood. Carved tablets line the walls — one still legible.",
        choices: [
          { label: "Study the tablet (Runes of the Blade)", type: "discover", skillId: "runeBlade", spellId: "bloodfuryMark", target: "corridor" },
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
          { label: "Fight", type: "combat", enemyId: "mossHound", target: "clearingDoors" },
          {
            label: "Try to calm it, kin to kin (Persuasion)",
            type: "persuade",
            skillId: "pathWild",
            spellId: "wolfsCall",
            enemyId: "mossHound",
            target: "clearingDoors",
            failDialogue: [
              "The hound's hollow eyes fix on you, and whatever once answered to a gentle hand is long gone from them.",
              "It circles instead of settling, moss-thick fur rising along its spine.",
              "The old bond you're reaching for was buried with it, and stays buried."
            ],
            finalFailDialogue: "Whatever kinship the grove once granted it has long since rotted away with the rest."
          }
        ]
      },
      clearingDoors: {
        text: "The trees open onto a wide clearing, thick with grave-mounds. A rootbound husk stands motionless among them, until it isn't.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "rootboundHusk", target: "clearing" }
        ]
      },
      clearing: {
        text: "The clearing is ringed with old carved stones, half-swallowed by moss. One stone bears markings still readable, if you look closely.",
        choices: [
          { label: "Read the marked stone", type: "goto", target: "markedStone" },
          { label: "Move deeper into the grove", type: "goto", target: "deeperPath" }
        ]
      },
      markedStone: {
        text: "The marking is old druidic knotwork, half a spell captured in stone.",
        choices: [
          { label: "Learn what remains (Path of the Wild)", type: "discover", skillId: "pathWild", spellId: "thornward", target: "deeperPath" },
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
        text: "A path winds between the mounds toward the central cairn. Wisps of colored light drift along the ground here, unnaturally bright.",
        choices: [
          { label: "Continue toward the central cairn", type: "goto", target: "wraithEncounter" },
          { label: "Follow the light-wisps (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "wispFind", failureTarget: "wraithEncounter" }
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
          { label: "Fight", type: "combat", enemyId: "emberTouchedWraith", target: "cairnEntrance" },
          {
            label: "Speak the old bloodline names (Persuasion)",
            type: "persuade",
            skillId: "ancestralSiuloir",
            spellId: "layOfMending",
            enemyId: "emberTouchedWraith",
            target: "cairnEntrance",
            failDialogue: [
              "The flame flares brighter at the names, but no recognition follows.",
              "\"Blood,\" it seems to hiss, without a mouth to shape the word properly.",
              "Whatever clan once claimed it has been burned out of whatever it is now."
            ],
            finalFailDialogue: "The names mean nothing to it anymore — only the fire remains, and the fire does not listen."
          }
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
        text: "The side-cairn holds old grave goods, mostly ruined — except for one scrap of ancestral writing, still whole.",
        choices: [
          { label: "Study the writing (Line of Averick)", type: "discover", skillId: "ancestralAverick", spellId: "glacialEdge", target: "innerCairn" },
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
          { label: "Study the notes (Line of Emyrs)", type: "discover", skillId: "ancestralEmyrs", spellId: "arcaneCataclysm", target: "converge" }
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
          { label: "Move quietly around it (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "innerPath", failureTarget: "warriorAmbush" },
          {
            label: "Speak the old rune-oaths of battle (Persuasion)",
            type: "persuade",
            skillId: "runeBlade",
            spellId: "bloodfuryMark",
            enemyId: "frostboundWarrior",
            target: "innerPath",
            failDialogue: [
              "The ice over its armor cracks, but the warrior does not stir from its stance.",
              "Frost-blue eyes turn toward you, unreadable, and do not soften.",
              "Whatever oath once bound it to a shield-wall, it answers to something colder now."
            ],
            finalFailDialogue: "The runes it once carved for others mean nothing to it now — only stillness, and the cold."
          }
        ]
      },
      warriorAmbush: {
        text: "Ice cracks as it turns toward you before you can slip past.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "frostboundWarrior", target: "innerPath" }
        ]
      },
      innerPath: {
        text: "The passage narrows, walls veined with frozen rune-light. A side alcove looks less disturbed than the rest of the tunnel.",
        choices: [
          { label: "Continue deeper", type: "goto", target: "shamanEncounter" },
          { label: "Check the alcove (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "alcoveFind", failureTarget: "shamanEncounter" }
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
        text: "The side passage ends in a small shrine, one rune-tablet still legible beneath the frost.",
        choices: [
          { label: "Study the tablet (Runes of the Blade)", type: "discover", skillId: "runeBlade", spellId: "stonewallRune", target: "forgeHall" },
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
          { label: "Study the tablet (Runes of the Curse)", type: "discover", skillId: "runeCurse", spellId: "doomrune", target: "converge" }
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
        text: "Closer to the ring, the grass gives way to bare, cracked earth. A faint green-white light pulses from the center of the stone circle. A smaller cluster of stones stands off to one side.",
        choices: [
          { label: "Move toward the smaller cluster", type: "goto", target: "smallCluster" },
          { label: "Head straight for the ring", type: "goto", target: "voiceEncounter" }
        ]
      },
      smallCluster: {
        text: "The smaller stones are older, their knotwork worn nearly smooth — except for one line, still sharp.",
        choices: [
          { label: "Read the line (Path of the Barrow)", type: "discover", skillId: "pathBarrow", spellId: "bonewhisper", target: "voiceEncounter" },
          { label: "Leave it and continue", type: "goto", target: "voiceEncounter" }
        ]
      },
      voiceEncounter: {
        text: "One of the standing stones speaks — or something speaking through it — as you draw near, and the air itself seems to answer.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "stoneboundVoice", target: "ringApproach" },
          {
            label: "Speak as one seeking consensus (Persuasion)",
            type: "persuade",
            skillId: "pathStorm",
            spellId: "lightningLash",
            enemyId: "stoneboundVoice",
            target: "ringApproach",
            failDialogue: [
              "The voice answers, but not in words — only a pressure, weighing your claim and finding it wanting.",
              "\"Consensus,\" it echoes, hollow, \"was the first thing lost here.\"",
              "The stone falls silent again, as if the very idea of agreement offends it now."
            ],
            finalFailDialogue: "Whatever process once bound the Túath together, this voice has long since outgrown the need for it."
          }
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
          { label: "Study the pattern (Path of the Storm)", type: "discover", skillId: "pathStorm", spellId: "wildfireBolt", target: "remnantFight" }
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
  },

  blackforgeDeep: {
    startRoomId: "hallEntrance",
    rooms: {
      hallEntrance: {
        text: "The cracked stone doors of the ancient dwarven hold lie torn from their hinges. Ash-blackened runes flank the threshold, and a sickly pale-green light bleeds out from the dark within.",
        choices: [{ type: "goto", label: "Enter the hold", target: "outerForge" }]
      },
      outerForge: {
        text: "The outer forge is cold and abandoned, furnaces long since gone dead. Tools lie scattered where they were dropped, mid-work, and never picked up again.",
        choices: [{ type: "goto", label: "Move deeper", target: "reaverAmbush" }]
      },
      reaverAmbush: {
        text: "Something moves among the dead tools and cold ash — a corrupted dwarf warrior, ashen grey and eyes glowing sickly green, turning toward you with a notched axe already raised.",
        choices: [
          { type: "combat", label: "Fight the Reaver", enemyId: "duergarReaver", target: "forgeChestLoot" },
          {
            type: "persuade",
            label: "Call out to the kin buried beneath the corruption (Persuasion)",
            skillId: "runeCurse",
            spellId: "witheringHex",
            enemyId: "duergarReaver",
            target: "forgeChestLoot",
            failDialogue: [
              "The sickly green eyes flicker at the words, but the axe does not lower.",
              "Whatever dwarf it once was does not answer — only the hunger does.",
              "The corruption has gone too deep for kinship to reach whatever remains."
            ],
            finalFailDialogue: "Whoever it once was is gone — only the Blackforge's hunger wears its shape now."
          }
        ]
      },
      forgeChestLoot: {
        text: "A dwarven strongbox lies forced open, ore and old coin spilled across the stone floor, untouched since whatever happened here.",
        loot: ["Old Ore", "Old Ore"],
        choices: [
          { type: "check", label: "Search for anything else hidden nearby", skillId: "survival", difficulty: "Expert", successTarget: "toolCache", failureTarget: "innerHalls" },
          { type: "goto", label: "Move on", target: "innerHalls" }
        ]
      },
      toolCache: {
        text: "Behind a collapse of fallen beams and broken equipment, a cache of good ore sits half-buried, waiting to be claimed.",
        loot: ["Old Ore"],
        choices: [{ type: "goto", label: "Continue", target: "innerHalls" }]
      },
      innerHalls: {
        text: "The corridor stretches on, rune-carved walls once warm with light now dark and cold. Faint sickly green light pulses somewhere ahead.",
        choices: [{ type: "goto", label: "Press onward", target: "deepWardenFight" }]
      },
      deepWardenFight: {
        text: "A hulking shape steps from the shadows — a Duergar Deep-Warden, armor fused with dark stone, a massive stone-headed maul already swinging toward you.",
        choices: [{ type: "combat", label: "Fight the Deep-Warden", enemyId: "duergarDeepWarden", target: "sideVault" }]
      },
      sideVault: {
        text: "This side vault has escaped the corruption entirely. Old dwarven records sit undisturbed on their shelves, and for a moment, the light here is warm again.",
        choices: [
          { type: "learnSkill", label: "Study the old smithing records", skillId: "smithing", target: "throneApproach" },
          { type: "goto", label: "Move on", target: "throneApproach" }
        ]
      },
      throneApproach: {
        text: "A grand processional hall stretches ahead, once-proud banners now torn and blackened. Sickly green light pools thick at the far end, where the throne room waits.",
        choices: [{ type: "goto", label: "Continue", target: "bloodShamanEncounter" }]
      },
      bloodShamanEncounter: {
        text: "A gaunt figure kneels amid crude blood-dark runes, hands wreathed in corrupted magic — a Duergar Blood-Shaman, and it has already sensed you.",
        choices: [{ type: "combat", label: "Fight the Blood-Shaman", enemyId: "duergarBloodShaman", target: "archiveHall" }]
      },
      archiveHall: {
        text: "Rows of stone tablets and scattered scrolls fill this runic archive. One tablet still glows faintly, its old magic somehow not yet extinguished.",
        choices: [
          { type: "discover", label: "Study the glowing tablet", skillId: "runeBlade", spellId: "bloodfuryMark", target: "fork" },
          { type: "goto", label: "Leave it be", target: "fork" }
        ]
      },
      fork: {
        text: "The hall splits ahead: one passage drops steeply toward old mineshafts, the other leads toward a deep, echoing well chamber.",
        choices: [
          { type: "goto", label: "Descend into the mineshafts", target: "minesFight" },
          { type: "goto", label: "Head toward the well chamber", target: "wellStudy" }
        ]
      },
      minesFight: {
        text: "The mineshaft passage isn't empty — a lean, feral shape uncoils from the dark, twin jagged blades already in hand. A Duergar Ashblade, fast and hungry.",
        choices: [{ type: "combat", label: "Fight the Ashblade", enemyId: "duergarAshblade", target: "converge" }]
      },
      wellStudy: {
        text: "Sickly green light rises steadily from somewhere far below the water's surface, filling the well chamber with a cold, unnatural glow.",
        choices: [{ type: "goto", label: "Press on", target: "converge" }]
      },
      converge: {
        text: "Both passages meet at the top of a final descending stair. The air grows colder with every step down, and the green light pulses steadily below.",
        choices: [{ type: "goto", label: "Descend", target: "preBoss" }]
      },
      preBoss: {
        text: "At the bottom of the stair, a massive sealed door waits, marked with corrupted runes. Beyond it, something rhythmic echoes — like a hammer, striking again and again.",
        choices: [
          { type: "check", label: "Time your approach carefully", skillId: "stealth", difficulty: "Expert", successTarget: "bossDoor", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "The hammering stops. Something has noticed you waiting here — another Duergar, closing fast before you can reach the door.",
        choices: [{ type: "combat", label: "Fight", enemyId: "duergarReaver", target: "bossDoor" }]
      },
      bossDoor: {
        text: "The great door stands ajar, corrupted craftsmanship twisted and wrong. Intense sickly green light spills out from whatever lies beyond.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The throne room is vast and lightless but for that sickly glow. On a throne of fused stone and dark iron sits the Ashen Sovereign, crown fused into ashen flesh, eyes blazing with corrupted light.",
        choices: [{ type: "combat", label: "Face the Ashen Sovereign", enemyId: "ashenSovereign", target: "epilogue" }]
      },
      epilogue: {
        text: "The green glow fades from the throne room at last, and something like ordinary torchlight begins, slowly, to return. The Blackforge Deep is quiet again — not healed, but no longer hungry.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },

  fomorianDepths: {
    startRoomId: "shoreEntrance",
    rooms: {
      shoreEntrance: {
        text: "A storm-battered shoreline stretches before you, black waves crashing against jagged rock. A sea-cave mouth yawns open ahead, faint unnatural light glimmering somewhere deep within.",
        choices: [{ type: "goto", label: "Enter the cave", target: "tidalCave" }]
      },
      tidalCave: {
        text: "The cave is damp and briny, tide pools glinting faintly in the near-dark. Something shifts further in.",
        choices: [{ type: "goto", label: "Press onward", target: "raiderAmbush" }]
      },
      raiderAmbush: {
        text: "A misshapen shape rises from the shallows — a Fomorian Raider, one clouded eye fixed on you, a crude weapon already raised.",
        choices: [{ type: "combat", label: "Fight the Raider", enemyId: "fomorianRaider", target: "wreckageLoot" }]
      },
      wreckageLoot: {
        text: "A shattered ship's hull lies driven deep into the cave, old cargo scattered among the rocks.",
        loot: ["Old Ore"],
        choices: [
          { type: "check", label: "Search the wreckage further (Survival)", skillId: "survival", difficulty: "Adept", successTarget: "driftwoodCache", failureTarget: "deeperCave" },
          { type: "goto", label: "Move on", target: "deeperCave" }
        ]
      },
      driftwoodCache: {
        text: "Behind a tangle of storm-driven driftwood, a small cache sits half-buried.",
        loot: ["Hide"],
        choices: [{ type: "goto", label: "Continue", target: "deeperCave" }]
      },
      deeperCave: {
        text: "The cave narrows and descends, salt-crusted stone pressing close. Something heavy moves ahead.",
        choices: [{ type: "goto", label: "Press onward", target: "bruteFight" }]
      },
      bruteFight: {
        text: "A hulking shape blocks the passage — a Fomorian Brute, thick barnacle-crusted hide, ready to crush anything in its path.",
        choices: [
          { type: "combat", label: "Fight the Brute", enemyId: "fomorianBrute", target: "sideGrotto" },
          {
            type: "persuade",
            label: "Invoke the old dread it must still remember (Persuasion)",
            skillId: "pathBarrow",
            spellId: "bonewhisper",
            target: "sideGrotto",
            failDialogue: [
              "It only roars, uncomprehending, and swings anyway.",
              "Whatever dread it once answered to, it answers to nothing now but hunger.",
              "The old words mean nothing here — this thing was old before words were."
            ],
            finalFailDialogue: "Whatever came before the gods does not fear what came after them."
          }
        ]
      },
      sideGrotto: {
        text: "A quiet grotto, untouched by the storm above. Something ancient is carved into the wet stone here.",
        choices: [
          { type: "discover", label: "Study the carving (Path of the Grove)", skillId: "pathGrove", spellId: "venomstrike", target: "blightHall" },
          { type: "goto", label: "Leave it and move on", target: "blightHall" }
        ]
      },
      blightHall: {
        text: "A wide hall opens ahead, the water itself sick and discolored, faintly glowing where it shouldn't.",
        choices: [{ type: "goto", label: "Continue", target: "casterEncounter" }]
      },
      casterEncounter: {
        text: "A gaunt shape rises from the glowing water — a Fomorian Blight-Caster, hands already wreathing themselves in sickly light.",
        choices: [{ type: "combat", label: "Fight the Blight-Caster", enemyId: "fomorianBlightCaster", target: "bonePileChamber" }]
      },
      bonePileChamber: {
        text: "A chamber choked with old bones, both human and unmistakably not, piled high against the walls.",
        loot: ["Grave Essence"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The passage splits ahead: one way toward eerily still tide-pools, the other into a low, flooded tunnel.",
        choices: [
          { type: "goto", label: "Follow the tide-pools", target: "tidepoolPath" },
          { type: "goto", label: "Wade into the flooded tunnel", target: "sunkenPassage" }
        ]
      },
      tidepoolPath: {
        text: "The tide-pools sit unnervingly still, the water's surface faintly reflective in the dim light.",
        choices: [{ type: "goto", label: "Continue", target: "converge" }]
      },
      sunkenPassage: {
        text: "The tunnel is half-flooded, water reaching your knees, the ceiling pressing low. Something moves fast beneath the surface.",
        choices: [{ type: "combat", label: "Fight what surfaces", enemyId: "fomorianSkulker", target: "converge" }]
      },
      converge: {
        text: "Both paths meet at the top of a final descending stair, the water below growing stranger and darker.",
        choices: [{ type: "goto", label: "Descend", target: "preBoss" }]
      },
      preBoss: {
        text: "At the bottom of the stair, a vast dark threshold opens before you. Something massive stirs just beyond the edge of sight.",
        choices: [
          { type: "check", label: "Move carefully and unseen (Stealth)", skillId: "stealth", difficulty: "Adept", successTarget: "bossDoor", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "Something has noticed you in the dark — another Fomorian Raider, closing fast before you can reach the threshold.",
        choices: [{ type: "combat", label: "Fight", enemyId: "fomorianRaider", target: "bossDoor" }]
      },
      bossDoor: {
        text: "A colossal sea-cave opens before you, black water lapping at a throne of coral and bleached bone, an intense sickly light glowing from within.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The chamber is vast, lightless but for that sickly glow. Upon the throne sits Balor, a single vast eye beneath a heavy lid slowly beginning to rise.",
        choices: [{ type: "combat", label: "Face Balor", enemyId: "balor", target: "epilogue" }]
      },
      epilogue: {
        text: "The great eye closes for the last time, and the sickly glow fades from the cavern. Somewhere far above, ordinary daylight finally finds its way down. The Fomorian Depths are still again — older than the gods, and now, at last, quiet.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },

  cailleachsReach: {
    startRoomId: "mountainPassEntrance",
    rooms: {
      mountainPassEntrance: {
        text: "A storm-lashed mountain pass stretches before you, ancient standing stones half-buried in driving snow, wind howling between two towering peaks.",
        choices: [{ type: "goto", label: "Press onward", target: "windsweptTrail" }]
      },
      windsweptTrail: {
        text: "The trail narrows, clinging to a steep cliffside. Snow drives sideways in the wind, and the drop below is lost in swirling white.",
        choices: [{ type: "goto", label: "Continue", target: "reiverAmbush" }]
      },
      reiverAmbush: {
        text: "A shape lurches out of the blowing snow — a Highland raider, eyes clouded storm-white, moving like something no longer entirely in control of itself.",
        choices: [{ type: "combat", label: "Fight the Reiver", enemyId: "stormTouchedReiver", target: "cairnLoot" }]
      },
      cairnLoot: {
        text: "An old stone cairn sits half-collapsed on the mountainside, weathered grave goods wedged among the fallen stones.",
        loot: ["Old Ore"],
        choices: [
          { type: "check", label: "Search further (Survival)", skillId: "survival", difficulty: "Expert", successTarget: "hiddenNiche", failureTarget: "risingPath" },
          { type: "goto", label: "Move on", target: "risingPath" }
        ]
      },
      hiddenNiche: {
        text: "A small niche is carved into the mountainside here, sheltered from the worst of the wind — easy to miss unless you're looking for it.",
        loot: ["Hide"],
        choices: [{ type: "goto", label: "Continue", target: "risingPath" }]
      },
      risingPath: {
        text: "The trail climbs steeply now, the air growing thinner and colder with every step. Storm clouds press close overhead.",
        choices: [{ type: "goto", label: "Press onward", target: "wightEncounter" }]
      },
      wightEncounter: {
        text: "Something pale and frost-rimed stands motionless ahead — a traveler who froze on this mountain long ago, and never quite lay down.",
        choices: [{ type: "combat", label: "Fight the Frost-Wight", enemyId: "frostWightOfTheReach", target: "shelteredHollow" }]
      },
      shelteredHollow: {
        text: "A hollow is carved into the rock here, ancient carvings just visible beneath a crust of frost.",
        choices: [
          { type: "discover", label: "Study the carving (Line of Siuloir)", skillId: "ancestralSiuloir", spellId: "warChant", target: "stormRidge" },
          { type: "goto", label: "Leave it and move on", target: "stormRidge" }
        ]
      },
      stormRidge: {
        text: "An exposed ridge stretches ahead, lightning flickering somewhere above the clouds. The wind here is enough to knock you off balance.",
        choices: [{ type: "goto", label: "Press onward", target: "handmaidenFight" }]
      },
      handmaidenFight: {
        text: "A gaunt figure steps from the blowing snow, hands already wreathed in swirling ice — one of the Cailleach's own, sent to bar your way.",
        choices: [
          { type: "combat", label: "Fight the Handmaiden", enemyId: "cailleachsHandmaiden", target: "boneCairn" },
          {
            type: "persuade",
            label: "Invoke old reverence for the Cailleach (Persuasion)",
            skillId: "ancestralEmyrs",
            spellId: "aegisWard",
            target: "boneCairn",
            enemyId: "cailleachsHandmaiden",
            failDialogue: [
              "The Handmaiden's eyes don't waver — reverence means nothing to something that already serves.",
              "\"She does not need your worship,\" the Handmaiden says. \"Only your passage stopped.\"",
              "The old words fall away into the wind, unheard, or unheeded."
            ],
            finalFailDialogue: "Whatever devotion once moved the clans to honor her, it means nothing here."
          }
        ]
      },
      boneCairn: {
        text: "A grim cairn of old bones rises from the snow, both animal and unmistakably not.",
        loot: ["Grave Essence"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The path splits ahead: one way along a narrow, icy ledge, the other into a dark cave mouth.",
        choices: [
          { type: "goto", label: "Take the icy ledge", target: "icyLedge" },
          { type: "goto", label: "Enter the cave", target: "hiddenCave" }
        ]
      },
      icyLedge: {
        text: "The ledge is glazed thick with ice, the drop below vanishing into cloud. Every step here has to be careful.",
        choices: [{ type: "goto", label: "Continue", target: "converge" }]
      },
      hiddenCave: {
        text: "The cave is oddly still, dry despite the storm raging outside. Something waits in the dark ahead.",
        choices: [{ type: "goto", label: "Press onward", target: "stalkerFight" }]
      },
      stalkerFight: {
        text: "A shape detaches itself from the rock — a creature with hide like weathered stone, immense and immovable, blocking the way forward.",
        choices: [{ type: "combat", label: "Fight the Stalker", enemyId: "boulderHideStalker", target: "converge" }]
      },
      converge: {
        text: "Both paths meet at the base of a final summit, wrapped entirely in storm. Whatever waits above, this is the only way to it.",
        choices: [{ type: "goto", label: "Ascend", target: "preBoss" }]
      },
      preBoss: {
        text: "The wind screams at the base of the peak. Something ancient and immense stirs at the summit above, barely visible through the blizzard.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Expert", successTarget: "bossDoor", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A second raider emerges from the storm, clouded eyes fixed on you, closing the distance before you can reach the summit.",
        choices: [{ type: "combat", label: "Fight", enemyId: "stormTouchedReiver", target: "bossDoor" }]
      },
      bossDoor: {
        text: "The summit opens before you — a ring of ancient standing stones half-swallowed by ice and low cloud, the air crackling with unnatural cold.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "This is the storm's true heart. Amid the ring of stones stands something ancient beyond reckoning — the Cailleach herself, weathered and primordial, wrapped in winter and cloud.",
        choices: [{ type: "combat", label: "Face the Cailleach", enemyId: "theCailleach", target: "epilogue" }]
      },
      epilogue: {
        text: "The storm finally breaks. Pale winter sunlight filters through the parting clouds, and for the first time, the mountain feels merely cold — not alive with something older than the world.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },

  restlessBaobab: {
    startRoomId: "groveEntrance",
    rooms: {
      groveEntrance: {
        text: "A misty, humid entrance to an ancient baobab grove opens before you. Massive gnarled trunks loom overhead, their canopy swallowing most of the light.",
        choices: [{ type: "goto", label: "Enter the grove", target: "innerPath" }]
      },
      innerPath: {
        text: "The path winds deeper between huge trunks, the air thick and still. The canopy thickens overhead, and the light grows dimmer with every step.",
        choices: [{ type: "goto", label: "Continue", target: "ancestorAmbush" }]
      },
      ancestorAmbush: {
        text: "A gaunt, translucent shape rises from among the roots — an ancestral spirit, old markings faintly visible, its hollow eyes fixed on you with something like resentment.",
        choices: [{ type: "combat", label: "Fight the Ancestor", enemyId: "restlessAncestor", target: "rootHollow" }]
      },
      rootHollow: {
        text: "A hollow is carved into the base of a massive trunk, old offerings scattered inside, faint green light glowing from somewhere deep within the wood.",
        loot: ["Grave Essence"],
        choices: [
          { type: "check", label: "Search further (Survival)", skillId: "survival", difficulty: "Novice", successTarget: "hiddenGrove", failureTarget: "deeperGrove" },
          { type: "goto", label: "Move on", target: "deeperGrove" }
        ]
      },
      hiddenGrove: {
        text: "A smaller grove sits tucked out of sight here, dappled light filtering through, something useful left half-hidden among the roots.",
        loot: ["Old Ore"],
        choices: [{ type: "goto", label: "Continue", target: "deeperGrove" }]
      },
      deeperGrove: {
        text: "The trees grow denser now, the canopy nearly blotting out the sky. Light barely reaches the humid ground below.",
        choices: [{ type: "goto", label: "Press onward", target: "guardianEncounter" }]
      },
      guardianEncounter: {
        text: "A hulking shape detaches itself from the bark — a guardian spirit, roots and branches fused into its massive form, blocking the way forward.",
        choices: [{ type: "combat", label: "Fight the Guardian", enemyId: "baobabGuardian", target: "whisperingClearing" }]
      },
      whisperingClearing: {
        text: "A quiet clearing opens ahead. The air itself seems to murmur here, faint and wordless, though there's no wind to explain it.",
        choices: [
          { type: "discover", label: "Listen closely (Rite of Protection)", skillId: "riteProtection", spellId: "mercysTouch", target: "boneScatter" },
          { type: "goto", label: "Move on quickly", target: "boneScatter" }
        ]
      },
      boneScatter: {
        text: "Old bones lie scattered beneath a great tree — past visitors who never found their way back out of this grove.",
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The path splits around a massive fallen trunk, moss and vines overtaking the wood. Mist drifts across both directions equally.",
        choices: [
          { type: "goto", label: "Take the shadowed hollow", target: "shadowedHollow" },
          { type: "goto", label: "Push into the misty thicket", target: "mistyThicket" }
        ]
      },
      shadowedHollow: {
        text: "A dark hollow path opens between close-growing trunks, barely any light finding its way through the canopy above.",
        choices: [{ type: "combat", label: "Fight what stalks you", enemyId: "boneAdornedStalker", target: "converge" }]
      },
      mistyThicket: {
        text: "A thicket ahead is choked with low, drifting mist, roots and undergrowth tangled thick underfoot.",
        choices: [{ type: "combat", label: "Fight the spirit within", enemyId: "whisperingSpirit", target: "converge" }]
      },
      converge: {
        text: "Both paths meet before a final, impossibly massive and ancient tree, its trunk wide enough to hollow out a room.",
        choices: [{ type: "goto", label: "Approach", target: "preBoss" }]
      },
      preBoss: {
        text: "The oldest baobab in the grove looms directly ahead, its hollow trunk pulsing faintly with green light. Something vast stirs within.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Novice", successTarget: "bossDoor", failureTarget: "extraFight" },
          { type: "goto", label: "Approach directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "Another ancestral spirit rises from the roots nearby, hollow eyes fixed on you, closing the distance before you can reach the great tree.",
        choices: [{ type: "combat", label: "Fight", enemyId: "restlessAncestor", target: "bossDoor" }]
      },
      bossDoor: {
        text: "A hollow opening leads into the heart of the great ancient tree, green light glowing steadily from somewhere deep inside.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The hollow core of the great tree opens around you. Old carvings line the walls, and at the center, something vast and ancient stirs — the Forgotten Elder, resentment given form.",
        choices: [{ type: "combat", label: "Face the Forgotten Elder", enemyId: "theForgottenElder", target: "epilogue" }]
      },
      epilogue: {
        text: "The green light finally fades from the hollow tree-core. Warm daylight filters gently through the canopy above, and for the first time, the grove feels merely old — not restless.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },

  drownedShrine: {
    startRoomId: "shrineApproach",
    rooms: {
      shrineApproach: {
        text: "A flooded riverside path leads toward a half-submerged stone shrine, ancient carved pillars rising from murky water.",
        choices: [{ type: "goto", label: "Approach the shrine", target: "floodedSteps" }]
      },
      floodedSteps: {
        text: "Ancient stone steps disappear into still, dark water, moss thick along the worn carvings.",
        choices: [{ type: "goto", label: "Descend", target: "guardianAmbush" }]
      },
      guardianAmbush: {
        text: "A gaunt, waterlogged shape rises from the shallows — a drowned guardian, old ceremonial cloth clinging to its form, cowrie shells glinting faintly.",
        choices: [{ type: "combat", label: "Fight the Guardian", enemyId: "drownedGuardian", target: "submergedOffering" }]
      },
      submergedOffering: {
        text: "Old offerings rest undisturbed beneath the shallow, clear water, exactly as they were left.",
        loot: ["Grave Essence"],
        choices: [
          { type: "check", label: "Search further (Survival)", skillId: "survival", difficulty: "Novice", successTarget: "hiddenAlcove", failureTarget: "deeperWaters" },
          { type: "goto", label: "Move on", target: "deeperWaters" }
        ]
      },
      hiddenAlcove: {
        text: "A dry alcove sits tucked above the waterline, something useful left half-hidden in the shadows.",
        loot: ["Old Ore"],
        choices: [
          { type: "discover", label: "Study the carvings (Rite of Protection)", skillId: "riteProtection", spellId: "mercysTouch", target: "deeperWaters" },
          { type: "goto", label: "Leave it and move on", target: "deeperWaters" }
        ]
      },
      deeperWaters: {
        text: "The passage deepens, water rising past the knee, a gentle current pulling steadily at your legs.",
        choices: [{ type: "goto", label: "Press onward", target: "wardenEncounter" }]
      },
      wardenEncounter: {
        text: "A hulking shape blocks the flooded passage — a river warden, hide slick and stone-like, immovable as the shrine itself.",
        choices: [{ type: "combat", label: "Fight the Warden", enemyId: "riverWarden", target: "stillPool" }]
      },
      stillPool: {
        text: "A pool of water sits unnervingly still ahead, its surface reflecting nothing back at all.",
        choices: [{ type: "goto", label: "Continue", target: "driftwoodPile" }]
      },
      driftwoodPile: {
        text: "Driftwood and old debris are piled against a crumbling wall, tangled with river reeds.",
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The flooded passage splits around a fallen carved pillar, water rippling gently in both directions.",
        choices: [
          { type: "goto", label: "Take the sunken hall", target: "sunkenHall" },
          { type: "goto", label: "Follow the rising current", target: "risingCurrent" }
        ]
      },
      sunkenHall: {
        text: "A half-collapsed hall opens ahead, water reaching your waist, old carvings just visible along the submerged walls.",
        choices: [{ type: "goto", label: "Continue", target: "converge" }]
      },
      risingCurrent: {
        text: "A narrow side channel carries a surprisingly strong current for such an enclosed space.",
        choices: [{ type: "combat", label: "Fight what surfaces", enemyId: "undertowSpirit", target: "converge" }]
      },
      converge: {
        text: "Both flooded paths meet before the entrance to the shrine's inner sanctum, the water ahead glowing faintly pale-blue.",
        choices: [{ type: "goto", label: "Approach", target: "preBoss" }]
      },
      preBoss: {
        text: "The sanctum entrance looms ahead, water glowing steadily now. Something vast stirs beneath the surface.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Novice", successTarget: "bossDoor", failureTarget: "extraFight" },
          { type: "goto", label: "Approach directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "Another drowned guardian rises from the water nearby, closing the distance before you can reach the sanctum.",
        choices: [{ type: "combat", label: "Fight", enemyId: "drownedGuardian", target: "bossDoor" }]
      },
      bossDoor: {
        text: "The flooded threshold of the inner sanctum opens before you, pale-blue light glowing steadily from the water beyond.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The heart of the sanctum opens around you — a vast flooded chamber, and at its center, something ancient and vast stirs. The Tide-Mother has been waiting.",
        choices: [{ type: "combat", label: "Face the Tide-Mother", enemyId: "theTideMother", target: "epilogue" }]
      },
      epilogue: {
        text: "The pale-blue glow finally fades from the water. Ordinary daylight filters gently down, and for the first time, the shrine feels merely old — not restless.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },

  theForsakenManor: {
    startRoomId: "mazeEntrance",
    rooms: {
      mazeEntrance: {
        text: "Mist clings to the manor's outer walls, swallowing sound. An entrance appears — a narrow passage leading deeper into shadow. The air feels wrong here, thick with watching presence.",
        choices: [
          { label: "Enter the maze", type: "goto", target: "mazeCorridorOne" }
        ]
      },

      mazeCorridorOne: {
        text: "Twisting corridors stretch in multiple directions, their geometry refusing to follow any logical pattern. Mist obscures the way ahead. The walls seem to shift when you're not looking.",
        choices: [
          { label: "Take the left passage", type: "goto", target: "mazeLeft" },
          { label: "Take the right passage", type: "goto", target: "mazeRight" },
          { label: "Push forward", type: "goto", target: "mazeStraight" }
        ]
      },

      mazeLeft: {
        text: "The left corridor narrows, walls closing in. A servant spirit drifts toward you, eyes vacant and wrong.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "enthralledAttendant", target: "mazeMeeting" }
        ]
      },

      mazeRight: {
        text: "The right passage opens into a wider space. Something shifts in the shadows — a form that's never quite solid.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "yokaiSpirit", target: "mazeMeeting" }
        ]
      },

      mazeStraight: {
        text: "The forward path leads to a dead end. Only by retracing your steps can you escape.",
        choices: [
          { label: "Return to the fork", type: "goto", target: "mazeCorridorOne" }
        ]
      },

      mazeMeeting: {
        text: "Both paths converge in a circular chamber. At its center, a stone well reaches down into darkness. A narrow doorway opposite suggests the maze continues deeper.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Continue deeper", type: "goto", target: "deeperCorridor" }
        ]
      },

      deeperCorridor: {
        text: "The maze tightens around you. A warrior spirit materializes, still bearing the weight of duty and damnation.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "enthralledSamurai", target: "mazeExit" }
        ]
      },

      mazeExit: {
        text: "The maze suddenly opens. Stone archways form a tunnel ahead, and you glimpse the manor's grand hall beyond — vast, empty, and wrong.",
        choices: [
          { label: "Enter the manor proper", type: "goto", target: "castleHall" }
        ]
      },

      castleHall: {
        text: "A grand hall stretches before you, its high ceilings lost in shadow. Carved pillars support the weight of centuries. Moonlight filters through broken screens. Two passages branch ahead.",
        choices: [
          { label: "Take the left corridor", type: "goto", target: "servantQuarters" },
          { label: "Take the right corridor", type: "goto", target: "throneApproach" }
        ]
      },

      servantQuarters: {
        text: "Cramped servant rooms line both sides of the corridor. In one alcove, old scrolls remain on a shelf, their ink barely visible.",
        loot: ["Old Ore"],
        choices: [
          { label: "Study the scrolls (Way of Tengu)", type: "discover", skillId: "wayTengu", spellId: "galeStrike", target: "mainHall" },
          { label: "Leave them and continue", type: "goto", target: "mainHall" }
        ]
      },

      mainHall: {
        text: "You emerge into the manor's central chamber. A servant spirit drifts past, unseeing. Three paths branch deeper into the estate.",
        choices: [
          { label: "Go left", type: "goto", target: "leftWing" },
          { label: "Go right", type: "goto", target: "rightWing" },
          { label: "Go straight ahead", type: "goto", target: "throneApproach" }
        ]
      },

      leftWing: {
        text: "The left wing is pristine, frozen in time. A guardian spirit stands at its center, its form twisted by the Daimyo's will — loyal even in corruption.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "corruptedGuardian", target: "throneApproach" }
        ]
      },

      rightWing: {
        text: "The right wing smells of incense and decay. A servant maid manifests from the shadows, trapped in endless service.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "enthralledMaid", target: "innerSanctum" }
        ]
      },

      innerSanctum: {
        text: "A private chamber, the Daimyo's own space. Scrolls and artifacts line shelves. One scroll bears markings of deep significance.",
        loot: ["Old Ore"],
        choices: [
          { label: "Study the scroll (Way of the Elements)", type: "discover", skillId: "wayYokai", spellId: "fireForm", target: "throneApproach" },
          { label: "Leave it and press on", type: "goto", target: "throneApproach" }
        ]
      },

      throneApproach: {
        text: "All paths lead to a vast hall dominated by a raised platform. A throne sits empty, but the presence it commands fills the space. Shadows gather at its base.",
        choices: [
          { label: "Ascend to the throne", type: "goto", target: "preBoss" }
        ]
      },

      preBoss: {
        text: "At the throne's summit, the air itself seems to resist. The Daimyo's form takes shape — translucent, terrible, watching with eyes that haven't blinked in centuries.",
        choices: [
          { label: "Approach carefully (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "bossRoom", failureTarget: "bossRoom" }
        ]
      },

      bossRoom: {
        text: "The Corrupted Daimyo rises fully, wreathed in spectral darkness. This was once a lord of honor. Now he is only hunger and command.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theCorruptedDaimyo", target: "epilogue" }
        ]
      },

      epilogue: {
        text: "The Daimyo falls. His form dissolves like smoke. The manor shudders. The walls lose their tension. The spirits trapped here feel the weight lift — finally, they are free.",
        choices: [
          { label: "Return to Homebase", type: "end" }
        ]
      }
    }
  },

  dragonShrine: {
    startRoomId: "shrineApproach",
    rooms: {
      shrineApproach: {
        text: "Mist clings thick to the approach of an ancient shrine, its stone markers overgrown with moss and age. A great torii gate stands ahead, painted red and gold, weathered but watchful. The air itself feels warmer here, faintly touched with smoke.",
        choices: [
          { label: "Approach the gate", type: "goto", target: "outerGates" }
        ]
      },

      outerGates: {
        text: "The torii towers above you, its paint faded but its purpose undiminished. Stone statues flank the entry --- lesser dragons, their eyes somehow aware. A stone guardian blocks the way, moss-thick but alert.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "youngDragon", target: "pillarCourt" },
          { label: "Try to slip past quietly (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "pillarCourt", failureTarget: "guardianAmbush" }
        ]
      },

      guardianAmbush: {
        text: "The stone sentinel stirs before you can pass, ancient magic grinding its limbs into motion.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "youngDragon", target: "pillarCourt" }
        ]
      },

      pillarCourt: {
        text: "A courtyard opens beyond the gate, ringed with carved pillars, each bearing a dragon in a different pose. At the courtyard's center, a shrine bell hangs from a wooden frame, untouched for years. A side path leads toward what looks like a treasure house.",
        choices: [
          { label: "Enter the main shrine", type: "goto", target: "shrineInterior" },
          { label: "Search the treasure house (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "treasureHouse", failureTarget: "shrineInterior" }
        ]
      },

      treasureHouse: {
        text: "Dust-laden shelves hold old offerings --- coins, bolts of silk, jade. One scroll remains legible.",
        loot: ["Old Ore", "Old Ore"],
        choices: [
          { label: "Study the scroll (Way of Tengu)", type: "discover", skillId: "wayTengu", spellId: "galeStrike", target: "shrineInterior" },
          { label: "Leave it and continue", type: "goto", target: "shrineInterior" }
        ]
      },

      shrineInterior: {
        text: "The main shrine hall opens before you, its ceiling lost in shadow and smoke. A great statue of a dragon dominates the far wall, carved with terrible artistry, its expression both benevolent and hungry. Two paths branch from here --- one leading left toward smaller chambers, the other right toward ritual grounds.",
        choices: [
          { label: "Take the left path", type: "goto", target: "leftWing" },
          { label: "Take the right path", type: "goto", target: "rightWing" }
        ]
      },

      leftWing: {
        text: "Smaller chambers line this passage, each holding a shrine within the shrine. Incense hangs thick in the air. A priestess in robes blocks the way ahead, her eyes bright with conviction.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "dragonCultPriest", target: "innerChapel" },
          { label: "Appeal to her faith (Persuasion)", type: "persuade", skillId: "wayYokai", spellId: "fireForm", enemyId: "dragonCultPriest", target: "innerChapel", failDialogue: ["She smiles sadly.", "The dragon has already chosen her.", "No appeal will reach what she has become."], finalFailDialogue: "Her faith is absolute. Nothing you say matters." }
        ]
      },

      innerChapel: {
        text: "A smaller shrine, intimate and heavy with devotion. Offerings cover every surface. A single tablet catches your eye, carved with archaic Yorenshi script.",
        loot: ["Grave Essence"],
        choices: [
          { label: "Study the tablet (Way of Suijin)", type: "discover", skillId: "waySuijin", spellId: "biwaOfTheDeepCurrent", target: "rightWing" },
          { label: "Leave it and continue", type: "goto", target: "rightWing" }
        ]
      },

      rightWing: {
        text: "The ritual grounds stretch before you, a broad open space marked with circles and runes for ceremonies long since abandoned. The air grows hotter. A wyvern stands motionless in the center, eyes fixed and predatory.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "wyvern", target: "ceremonyHall" }
        ]
      },

      ceremonyHall: {
        text: "The ritual grounds open into a vast circular chamber, its floor painted with an enormous dragon mandala. At its center, a stone basin holds ash and what might once have been incense. Two new passages lead onward.",
        choices: [
          { label: "Follow the ascending path", type: "goto", target: "ascendingPath" },
          { label: "Descend into the lower shrine", type: "goto", target: "lowerShrine" }
        ]
      },

      ascendingPath: {
        text: "Stone steps climb steeply, spiraling upward along the shrine's inner wall. Murals of dragons in flight cover the walls, each gesture more reverent than the last. The air grows almost unbearably warm.",
        choices: [
          { label: "Continue climbing (Survival)", type: "check", skillId: "survival", difficulty: "Adept", successTarget: "upperSanctum", failureTarget: "spiralFight" }
        ]
      },

      spiralFight: {
        text: "Exhaustion makes you stumble. A fire drake rises from an alcove you didn't see, blocking the climb.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "fireDrake", target: "upperSanctum" }
        ]
      },

      upperSanctum: {
        text: "You reach a high chamber, the shrine's beating heart. An eternal flame burns in an ornate brazier at the center.",
        choices: [
          { label: "Continue toward the inner sanctum", type: "goto", target: "innerSanctumDoor" }
        ]
      },

      lowerShrine: {
        text: "Steps descend into older darkness, where the original shrine still stands --- a simple stone altar, marked with age beyond measure. A young dragon coils nearby, guardian of forgotten rites.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "youngDragon", target: "ancientOfferings" }
        ]
      },

      ancientOfferings: {
        text: "The altar holds treasures from centuries of worship --- some jade, some bone, some things that defy naming.",
        loot: ["Old Ore"],
        choices: [
          { label: "Study the ancient artifacts (Way of the Elements)", type: "discover", skillId: "wayYokai", spellId: "fireForm", target: "innerSanctumDoor" },
          { label: "Head for the inner sanctum", type: "goto", target: "innerSanctumDoor" }
        ]
      },

      innerSanctumDoor: {
        text: "Both paths converge at a final set of doors, ornate and carved with a single enormous dragon wrapping around both panels. The doors are cold to the touch.",
        choices: [
          { label: "Open the doors", type: "goto", target: "preBoss" }
        ]
      },

      preBoss: {
        text: "The innermost chamber waits beyond. You can hear it breathing --- long, slow, patient breaths like wind through a canyon. The dragon-shrine keeper stands motionless at the threshold, wreathed in sacred flame.",
        choices: [
          { label: "Approach carefully (Stealth)", type: "check", skillId: "stealth", difficulty: "Adept", successTarget: "bossRoom", failureTarget: "bossRoom" }
        ]
      },

      bossRoom: {
        text: "The Dragon-Shrine Keeper rises before you, wreathed in sacred flame, the dragon's will made manifest in mortal form. This is what devotion becomes.",
        choices: [
          { label: "Fight", type: "combat", enemyId: "theDragonShrineKeeper", target: "epilogue" }
        ]
      },

      epilogue: {
  text: "The keeper falls, and the sacred flame dies with them. The shrine shudders. Whatever bound the dragon's will to this place has broken. The shrine is empty now, just old stone and older memories.",
  choices: [
    { label: "Return to Homebase", type: "end" }
  ]
}
    }
  },

  emberScarredOutcrop: {
    startRoomId: "outcropApproach",
    rooms: {
      outcropApproach: {
        text: "A dry, sun-baked rocky outcrop juts up from open savanna grassland, the ground cracked and parched, waves of heat visibly rising in the distance.",
        choices: [{ type: "goto", label: "Climb toward the outcrop", target: "blackenedPath" }]
      },
      blackenedPath: {
        text: "A narrow path winds up the scorched rock face, blackened stone underfoot, embers glowing faintly in the cracks along the way.",
        choices: [{ type: "combat", label: "Fight the Sentinel", enemyId: "scorchedSentinel", target: "ashStrewnLedge" }]
      },
      ashStrewnLedge: {
        text: "A wide stone ledge is layered with old ash, something useful half-buried within the drifts.",
        loot: ["Old Ore"],
        choices: [
          { type: "check", label: "Search further (Survival)", skillId: "survival", difficulty: "Novice", successTarget: "hiddenCache", failureTarget: "smolderingPassage" },
          { type: "goto", label: "Move on", target: "smolderingPassage" }
        ]
      },
      hiddenCache: {
        text: "A small cache is tucked into a scorched crevice, shielded from the worst of the outcrop's heat.",
        loot: ["Grave Essence"],
        choices: [{ type: "goto", label: "Continue", target: "smolderingPassage" }]
      },
      smolderingPassage: {
        text: "The rock passage narrows, faint smoke curling from fissures in the stone. The heat grows more intense with every step.",
        choices: [{ type: "goto", label: "Press onward", target: "emberField" }]
      },
      emberField: {
        text: "A wide stretch of cracked stone opens ahead, scattered embers glowing faintly across the ground like dying stars.",
        choices: [{ type: "combat", label: "Fight the Ember-Wraith", enemyId: "emberWraith", target: "scorchedShrine" }]
      },
      scorchedShrine: {
        text: "The remains of a small shrine stand blackened and scorched, old carvings still faintly visible beneath the char.",
        choices: [
          { type: "discover", label: "Study the carvings (Rite of the Thunder-Wrath)", skillId: "riteThunderWrath", spellId: "judgmentsWeight", target: "fork" },
          { type: "goto", label: "Leave it and move on", target: "fork" }
        ]
      },
      fork: {
        text: "The path splits around a jagged, fire-scarred boulder, both directions equally scorched.",
        choices: [
          { type: "goto", label: "Take the cracked ravine", target: "crackedRavine" },
          { type: "goto", label: "Climb the high ledge", target: "highLedge" }
        ]
      },
      crackedRavine: {
        text: "A narrow ravine cuts through the scorched rock, deep fissures glowing faintly with trapped heat below.",
        choices: [{ type: "combat", label: "Fight the Judge", enemyId: "ashBoundJudge", target: "converge" }]
      },
      highLedge: {
        text: "An exposed ledge sits high on the outcrop, wind carrying faint ash across the open air. The ground far below wavers with heat.",
        choices: [{ type: "combat", label: "Fight the Golem", enemyId: "crackedGolem", target: "converge" }]
      },
      converge: {
        text: "Both scorched paths meet before a final rise, the embers glowing more intensely ahead where the rock climbs toward the summit.",
        choices: [{ type: "goto", label: "Ascend", target: "preBoss" }]
      },
      preBoss: {
        text: "The summit looms ahead, heat shimmering intensely off the blackened stone. Something vast stirs within the glow.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Novice", successTarget: "bossDoor", failureTarget: "extraFight" },
          { type: "goto", label: "Approach directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "Another scorched sentinel rises from the cracked stone, closing the distance before you can reach the summit.",
        choices: [{ type: "combat", label: "Fight", enemyId: "scorchedSentinel", target: "bossDoor" }]
      },
      bossDoor: {
        text: "The entrance to the summit shrine stands before you, blackened stone glowing at the edges with trapped ember-light.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The heart of the summit shrine opens around you, cracked walls glowing with deep ember-light — and within it, the Unyielding Flame still burns.",
        choices: [{ type: "combat", label: "Face the Unyielding Flame", enemyId: "theUnyieldingFlame", target: "epilogue" }]
      },
      epilogue: {
        text: "The ember-glow finally dims and cools. Ordinary daylight settles gently over the blackened stone, and for the first time, the outcrop feels merely old — not smoldering.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },

  crowWindDojo: {
    startRoomId: "gateApproach",
    rooms: {
      gateApproach: {
        text: "A weathered torii gate marks the start of the climb, stone steps vanishing upward into drifting mist. The wind here is wrong — not cold exactly, but unsettled, gusting in directions that don't match the slope of the mountain. Somewhere above, faint and distant, you hear something that might be a crow.",
        choices: [{ type: "goto", label: "Climb the steps", target: "trainingYard" }]
      },
      trainingYard: {
        text: "An outer courtyard, packed dirt worn smooth by generations of disciplined drilling. The wooden practice posts stand crooked now, some snapped clean through. Whatever trained here once kept better order than this.",
        choices: [{ type: "combat", label: "Fight", enemyId: "karasuTenguScout", target: "weaponsCorridor" }]
      },
      weaponsCorridor: {
        text: "Racks of old practice weapons line this narrow hall — bokken, naginata, worn training staves. Dust hangs undisturbed in the amber light, except where something has clearly passed through recently, and left the weapons rattling faintly in their brackets.",
        loot: ["Old Ore"],
        choices: [{ type: "goto", label: "Continue", target: "kodamaGrove" }]
      },
      kodamaGrove: {
        text: "An inner garden where the dojo's oldest support beams have grown wild, bark and living wood fused into the structure itself. The knots in the wood glow faintly, and you get the distinct, uncomfortable sense that the grove is aware of you standing in it.",
        choices: [{ type: "combat", label: "Fight", enemyId: "kodamaSentinel", target: "meditationHall" }]
      },
      meditationHall: {
        text: "A quiet tatami-floored hall, worn cushions still arranged in a circle from whoever meditated here last. A single shaft of dusk light falls through a torn paper screen. For a moment, despite everything, the wind outside seems to still — and something ancient, wordless, and grounded settles into you.",
        choices: [
          { type: "discover", label: "Study the stance (Way of Tengu)", skillId: "wayTengu", spellId: "rootStanceDiscipline", target: "fork" },
          { type: "goto", label: "Leave it and press on", target: "fork" }
        ]
      },
      fork: {
        text: "The corridor splits ahead — one path climbing toward the open cliffs, wind audible even from here; the other leading deeper into shadowed halls where the wind, strangely, cannot seem to reach at all.",
        choices: [
          { type: "goto", label: "Take the cliffside path", target: "ropeBridgePath" },
          { type: "goto", label: "Take the inner path", target: "konohaShrine" }
        ]
      },
      ropeBridgePath: {
        text: "A narrow rope-and-plank bridge stretches across a misty ravine, prayer flags snapping wildly along its length. The wind here is relentless, but you notice — with growing unease — that it seems to move around you rather than through you, as if deciding whether to let you cross.",
        choices: [
          { type: "discover", label: "Practice the footing (Way of Tengu)", skillId: "wayTengu", spellId: "featherStep", target: "converge" },
          { type: "goto", label: "Cross carefully", target: "converge" }
        ]
      },
      konohaShrine: {
        text: "A small garden shrine, its stone lantern half-buried beneath a drift of leaves that never seem to stop falling. The leaves stir without any wind you can feel, circling something — or someone — you can't quite see yet.",
        choices: [{ type: "combat", label: "Fight", enemyId: "konohaTenguAdept", target: "converge" }]
      },
      converge: {
        text: "The two paths reunite in a wider hallway, lanterns flickering unevenly along the walls. Whatever's wrong with the wind out here seems to have found its way inside too.",
        choices: [{ type: "goto", label: "Continue", target: "armory" }]
      },
      armory: {
        text: "Racks of mounted blades and folded armor line this room, and at its center, a scroll glows faintly on a weapon stand — untouched by the same wrongness that's crept into everything else here.",
        choices: [
          { type: "discover", label: "Study the scroll (Way of Tengu)", skillId: "wayTengu", spellId: "crowsTalon", target: "discipleHall" },
          { type: "goto", label: "Leave it and press on", target: "discipleHall" }
        ]
      },
      discipleHall: {
        text: "A wide sparring hall beneath a high raftered ceiling, training dummies still lined along the walls. This was once where the dojo's finest trained — and it seems something here still remembers that, and doesn't take kindly to spectators.",
        choices: [{ type: "combat", label: "Fight", enemyId: "bladeWingTengu", target: "lookoutPoint" }]
      },
      lookoutPoint: {
        text: "A cliffside overlook near the summit, clouds and distant peaks spread out below. The wind is strongest here, and for the first time it doesn't feel random — it feels like it's watching, the way the air seems to hold its breath around you.",
        choices: [
          { type: "discover", label: "Watch the wind (Way of Tengu)", skillId: "wayTengu", spellId: "tengusEye", target: "guardianRoom" },
          { type: "goto", label: "Move on", target: "guardianRoom" }
        ]
      },
      guardianRoom: {
        text: "A narrow passage carved straight into the mountainside, lined with ancient horned guardian statues. Their carved eyes glow faintly — steady once, you suspect, but flickering now, like a ward slowly failing.",
        choices: [{ type: "combat", label: "Fight", enemyId: "oniTouchedGuardian", target: "preBoss" }]
      },
      preBoss: {
        text: "Worn stone steps climb toward the summit through thickening mist. The wind carries something like crow-calls now, though no crow you've ever heard sounded quite like that. Whatever waits above, it knows you're coming.",
        choices: [
          { type: "goto", label: "Face one more challenger", target: "extraFight" },
          { type: "goto", label: "Press on to the summit", target: "bossDoor" }
        ]
      },
      extraFight: {
        text: "A narrow, wind-whipped ledge just below the summit — exposed, precarious, and occupied. Someone, or something, has been waiting here a long time for someone to finally climb this far.",
        choices: [{ type: "combat", label: "Fight", enemyId: "bladeWingTengu", target: "bossDoor" }]
      },
      bossDoor: {
        text: "Massive weathered doors mark the summit shrine's entrance, feather and wind motifs carved deep into the frame. Golden light leaks from the seams, and beyond it, the wind isn't gusting anymore — it's breathing.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "A grand summit chamber, open to the sky, torn paper screens snapping in a wind that no longer feels like weather at all. At the far end, wreathed in amber light, something ancient — and now, unmistakably, dangerous — waits for you.",
        choices: [{ type: "combat", label: "Fight the Daitengu", enemyId: "daitengu", target: "preEpilogue" }]
      },
      preEpilogue: {
        text: "The Daitengu falls still, and with it, the wind. In the sudden quiet, you catch the last of its technique before it fades entirely.",
        choices: [
          { type: "discover", label: "Learn Mountain-Breaker (Way of Tengu)", skillId: "wayTengu", spellId: "mountainBreaker", target: "epilogue" }
        ]
      },
      epilogue: {
        text: "Dawn breaks clear over the mountain, the mist finally dispersing, the wind at last settling into something ordinary. Feathers drift down over the quiet dojo grounds, and for the first time since you arrived, the silence feels earned rather than watchful.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  sunderedThrone: {
    startRoomId: "throneHallEntrance",
    rooms: {
      throneHallEntrance: {
        text: "The stair ends in a hall older than any Deveran clan still standing — the very first hall, raised before the clans had names to give themselves. The air is still. Nothing here has moved in a very long time.",
        choices: [{ type: "goto", label: "Enter", target: "longCorridor" }]
      },
      longCorridor: {
        text: "A long corridor stretches ahead, old banners rotted to threads along the walls. Somewhere further in, something shuffles — patient, unhurried, in no rush at all.",
        choices: [{ type: "goto", label: "Continue", target: "stewardFight" }]
      },
      stewardFight: {
        text: "A figure straightens from where it was tending an empty hearth — the hall's old steward, hands still moving through duties no one has needed in centuries.",
        choices: [{ type: "combat", label: "Fight the Patient Steward", enemyId: "patientSteward", target: "corridorLoot" }]
      },
      corridorLoot: {
        text: "A side alcove holds what's left of the hall's old stores, mostly rot and rust — but something is still worth taking.",
        loot: ["Grave Essence"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The corridor splits ahead: one way leads through a collapsed nave, the other through what were once the hall's kitchens.",
        choices: [
          { type: "goto", label: "Through the collapsed nave", target: "collapsedNave" },
          { type: "goto", label: "Through the old kitchens", target: "oldKitchens" }
        ]
      },
      collapsedNave: {
        text: "Fallen stone chokes the old nave. Something moves beneath the rubble, scratching at its own chest, over and over.",
        choices: [{ type: "combat", label: "Fight the Unclaimed Blood", enemyId: "unclaimedBlood", target: "convergeHall" }]
      },
      oldKitchens: {
        text: "Cracked plates are still stacked here, laid for a meal that was never served. A figure stands at the head of the table, waiting.",
        choices: [{ type: "combat", label: "Fight the Waiting Wife", enemyId: "waitingWife", target: "convergeHall" }]
      },
      convergeHall: {
        text: "Both paths open into a wider hall, its walls lined with faded clan-marks — dozens of them, going back further than any living clan can trace.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "One mark near the floor is worn nearly smooth, touched by countless hands before yours. Something of the old vitality still lingers in the stone.",
        choices: [
          { type: "discover", label: "Rest your hand on the mark (Line of Averick)", skillId: "ancestralAverick", spellId: "ancestorsVigor", target: "deeperHall" },
          { type: "goto", label: "Move on", target: "deeperHall" }
        ]
      },
      deeperHall: {
        text: "The hall narrows and descends further still. The air grows colder, and the old banners give way to bare stone.",
        choices: [{ type: "goto", label: "Press onward", target: "corpseFight" }]
      },
      corpseFight: {
        text: "A voice answers from the dark ahead before you've said a word — it heard a name spoken somewhere far above, and it's still listening for its own.",
        choices: [{ type: "combat", label: "Fight the Answering Corpse", enemyId: "answeringCorpse", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow passage runs alongside a guardpost up ahead — a way to slip past unseen, if you're careful.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A figure snaps to attention at your approach, still holding a post he was told to hold until relieved — a very long time ago.",
        choices: [{ type: "combat", label: "Fight the Long Watch", enemyId: "theLongWatch", target: "preBoss" }]
      },
      preBoss: {
        text: "Ahead, the corridor opens onto a final set of doors, carved with a crest half-worn away — a name that isn't quite Averick's, though it's clearly kin to it.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The throne room opens before you. Seated upon it, patient beyond all reckoning, is the hall's true keeper — kin to Averick in blood, if not in memory.",
        choices: [{ type: "combat", label: "Face Doran Joss", enemyId: "doranJoss", target: "epilogue" }]
      },
      epilogue: {
        text: "The throne finally sits empty. Whatever kept Doran Joss standing all these centuries has gone quiet at last — and somewhere, unheard by anyone still living, the old songs finally have a second name to carry.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  widowsHollow: {
    startRoomId: "hollowEntrance",
    rooms: {
      hollowEntrance: {
        text: "Past the last marked grave, the hollow opens before you — overgrown, mist-choked, and far older than any headstone above ever admitted. Something has been mourning down here for a very long time.",
        choices: [{ type: "goto", label: "Enter", target: "mistPath" }]
      },
      mistPath: {
        text: "A path winds through drifting mist and broken headstones. Something moves ahead, patient and unhurried.",
        choices: [{ type: "goto", label: "Continue", target: "officiantFight" }]
      },
      officiantFight: {
        text: "A robed figure stands rigid amid the stones, still murmuring the words of a rite that was never meant to be finished.",
        choices: [{ type: "combat", label: "Fight the Officiant", enemyId: "theOfficiant", target: "mistLoot" }]
      },
      mistLoot: {
        text: "A cluster of pale grave-flowers grows undisturbed here — and something else worth taking, half-buried beneath them.",
        loot: ["Hide"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The mist thins into two paths ahead — one toward a ruined chapel, the other into a quiet, overgrown glen.",
        choices: [
          { type: "goto", label: "Toward the ruined chapel", target: "oldChapel" },
          { type: "goto", label: "Into the quiet glen", target: "suitorsGlen" }
        ]
      },
      oldChapel: {
        text: "Fallen stone and creeping ivy choke what's left of a small chapel. A pale, hollow-eyed figure waits inside, beautiful and terribly still.",
        choices: [{ type: "combat", label: "Fight the Latest Bloom", enemyId: "theLatestBloom", target: "convergeHollow" }]
      },
      suitorsGlen: {
        text: "A quiet glen, strangely untouched by the decay around it. A gaunt figure stands here, forever reaching toward someone who isn't there.",
        choices: [{ type: "combat", label: "Fight the Lost Suitor", enemyId: "theLostSuitor", target: "convergeHollow" }]
      },
      convergeHollow: {
        text: "Both paths lead back to a wide clearing at the hollow's heart, ringed with old standing stones bent under centuries of moss.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "One of the stones bears carvings gone soft with age — old Gaeldrim wardcraft, still faintly humming beneath the moss.",
        choices: [
          { type: "discover", label: "Study the carving (Path of the Grove)", skillId: "pathGrove", spellId: "witheringGrasp", target: "deeperHollow" },
          { type: "goto", label: "Move on", target: "deeperHollow" }
        ]
      },
      deeperHollow: {
        text: "The clearing narrows into a sunken path, headstones giving way to bare earth and root.",
        choices: [{ type: "goto", label: "Press onward", target: "gravWardenFight" }]
      },
      gravWardenFight: {
        text: "A weathered figure kneels at an unmarked grave-mound, tending it with slow, resigned care.",
        choices: [{ type: "combat", label: "Fight the Grave-Warden", enemyId: "theGraveWarden", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow deer-track skirts the edge of a watchpost up ahead — a way past, if you tread carefully.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A pale figure startles at your approach, guilt written plainly across a face that never found peace.",
        choices: [{ type: "combat", label: "Fight the Silent Watcher", enemyId: "theSilentWatcher", target: "preBoss" }]
      },
      preBoss: {
        text: "Ahead, the mist thickens around a ring of old, leaning stones — and beyond them, something achingly beautiful waits in white.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The Widow stands at the hollow's very heart, mourning-gown trailing into the mist, more sorrow than menace in her eyes — until she looks up.",
        choices: [{ type: "combat", label: "Face the Widow", enemyId: "theWidow", target: "epilogue" }]
      },
      epilogue: {
        text: "The mist finally lifts from the hollow, and for the first time in longer than anyone can say, the old stones stand in ordinary silence.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  sigrunsThreshold: {
    startRoomId: "thresholdEntrance",
    rooms: {
      thresholdEntrance: {
        text: "The barrow walls thin to almost nothing here, the stone giving way to something that isn't quite stone at all. A cold wind moves through the seam, carrying the sound of distant, endless battle.",
        choices: [{ type: "goto", label: "Step through", target: "hallApproach" }]
      },
      hallApproach: {
        text: "The approach widens into a hall lit by a light with no visible source. A figure blocks the way, shield raised, eager rather than hostile.",
        choices: [{ type: "goto", label: "Continue", target: "shieldSplitterFight" }]
      },
      shieldSplitterFight: {
        text: "\"Let's see if yours holds better than mine did,\" the warrior says, and doesn't wait for an answer.",
        choices: [{ type: "combat", label: "Fight the Shield-Splitter", enemyId: "theShieldSplitter", target: "approachLoot" }]
      },
      approachLoot: {
        text: "A weapon-rack stands along the wall, old but well-tended — the einherjar clearly still take pride in their gear.",
        loot: ["Old Ore"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The hall splits ahead — one path crosses a frozen strait that shouldn't exist this deep underground, the other circles a ring of oath-stones.",
        choices: [
          { type: "goto", label: "Cross the frozen strait", target: "frozenStrait" },
          { type: "goto", label: "Enter the oath-stone circle", target: "oathStoneCircle" }
        ]
      },
      frozenStrait: {
        text: "An impossible frozen strait stretches out ahead, wind howling across the ice. A lone figure stands at its center, watching you approach without a trace of surprise.",
        choices: [{ type: "combat", label: "Fight the Frost-Walker", enemyId: "theFrostWalker", target: "convergeHall" }]
      },
      oathStoneCircle: {
        text: "Ancient stones ring a quiet space, each carved with a vow long since fulfilled. A warrior kneels at the center, rising slowly as you enter.",
        choices: [{ type: "combat", label: "Fight the Oath-Keeper", enemyId: "theOathKeeper", target: "convergeHall" }]
      },
      convergeHall: {
        text: "Both paths lead back into a single grand hall, its walls carved with names in a script older than any living tongue.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "One rune near the base of the wall catches your eye — still faintly glowing, as though it's been waiting for someone to actually look.",
        choices: [
          { type: "discover", label: "Study the rune (Rune-Vision)", skillId: "runeVision", spellId: "seersWarning", target: "deeperHall" },
          { type: "goto", label: "Move on", target: "deeperHall" }
        ]
      },
      deeperHall: {
        text: "The hall narrows toward its heart, the sound of distant battle growing steadily louder.",
        choices: [{ type: "goto", label: "Press onward", target: "unyieldingFight" }]
      },
      unyieldingFight: {
        text: "A lone warrior stands in the passage, unarmored, unbothered, having clearly done this many times before.",
        choices: [{ type: "combat", label: "Fight the Unyielding", enemyId: "theUnyielding", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow side-passage skirts a warrior standing watch ahead — a way past, if you're quick and quiet about it.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A warrior with a blade in each hand turns to face you, grinning like this is the first real challenge he's had in a very long time.",
        choices: [{ type: "combat", label: "Fight the Twin-Blade", enemyId: "theTwinBlade", target: "preBoss" }]
      },
      preBoss: {
        text: "Ahead, the hall opens onto a vast threshold, wings of light and shadow visible just beyond it, a single figure waiting at its center.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "Sigrun stands at the threshold itself, spear in hand, regarding you with neither malice nor mercy — only the ancient, patient question of whether you're actually worthy.",
        choices: [{ type: "combat", label: "Face Sigrun", enemyId: "sigrun", target: "epilogue" }]
      },
      epilogue: {
        text: "Sigrun lowers her spear at last, something like respect in her ancient eyes. The seam between worlds settles quiet behind you as you make your way back — and somewhere far beyond it, the endless battle plays on without you.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  oldSpiritGrove: {
    startRoomId: "groveEntrance",
    rooms: {
      groveEntrance: {
        text: "The bush thickens until no path remains at all, only a feeling that something ahead is watching, and has been for some time.",
        choices: [{ type: "goto", label: "Press onward", target: "grovePath" }]
      },
      grovePath: {
        text: "The undergrowth parts into a winding trail. Something moves alongside you, unseen, matching your pace exactly.",
        choices: [{ type: "goto", label: "Continue", target: "groveBoundFight" }]
      },
      groveBoundFight: {
        text: "A shape steps into view — neither fully leopard nor fully person, caught somewhere between the two, watching to see what you'll do.",
        choices: [{ type: "combat", label: "Fight the Grove-Bound", enemyId: "theGroveBound", target: "pathLoot" }]
      },
      pathLoot: {
        text: "A cluster of old, carefully-placed stones marks a small cache — left here deliberately, long ago, for someone worthy of finding it.",
        loot: ["Hide"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The trail splits ahead — one way winds through a dense thicket, the other along a quiet, sunlit clearing.",
        choices: [
          { type: "goto", label: "Through the thicket", target: "denseThicket" },
          { type: "goto", label: "Along the clearing", target: "sunlitClearing" }
        ]
      },
      denseThicket: {
        text: "Something young and restless crashes through the undergrowth ahead, still learning the shape it's been given.",
        choices: [{ type: "combat", label: "Fight the Unshaped Cub", enemyId: "theUnshapedCub", target: "convergeGrove" }]
      },
      sunlitClearing: {
        text: "A quiet clearing opens ahead, sunlight breaking through the canopy. A solitary figure watches you approach without moving.",
        choices: [{ type: "combat", label: "Fight the Silent Stalker", enemyId: "theSilentStalker", target: "convergeGrove" }]
      },
      convergeGrove: {
        text: "Both paths lead into a wide clearing at the grove's heart, old carved totems standing watch in a loose circle.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "One totem bears a symbol you recognize — an old protective rite, still humming faintly with old power.",
        choices: [
          { type: "discover", label: "Study the totem (Rite of Protection)", skillId: "riteProtection", spellId: "furysAnswer", target: "deeperGrove" },
          { type: "goto", label: "Move on", target: "deeperGrove" }
        ]
      },
      deeperGrove: {
        text: "The grove narrows into older, denser growth, the light dimming as you press further in.",
        choices: [{ type: "goto", label: "Press onward", target: "elderTrackerFight" }]
      },
      elderTrackerFight: {
        text: "An ancient figure steps from the shadow of the trees, weighing you with a long, unhurried gaze.",
        choices: [{ type: "combat", label: "Fight the Elder Tracker", enemyId: "theElderTracker", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow game-trail skirts a watchful presence up ahead — a way past, if you move with real care.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A warden steps into view, bound by old rites to guard what lies ahead from anyone who hasn't proven themselves.",
        choices: [{ type: "combat", label: "Fight the Rite-Warden", enemyId: "theRiteWarden", target: "preBoss" }]
      },
      preBoss: {
        text: "Ahead, the trees open onto the oldest part of the grove, a stillness settling over everything, as though the whole bush is holding its breath.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The First Leopard waits at the grove's very heart, ancient beyond reckoning, watching you with neither hostility nor welcome — only the old, patient question of whether you belong here at all.",
        choices: [{ type: "combat", label: "Face the First Leopard", enemyId: "theFirstLeopard", target: "epilogue" }]
      },
      epilogue: {
        text: "The First Leopard settles at last, something like acceptance in its ancient gaze. The grove grows quiet behind you as you make your way back — the old ways still resting undisturbed, just a little less alone than before.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  orochisValley: {
    startRoomId: "valleyEntrance",
    rooms: {
      valleyEntrance: {
        text: "The Hii River winds through a quiet valley that doesn't feel quiet at all. Something ancient has claimed this place, season after season, for longer than anyone living can say.",
        choices: [{ type: "goto", label: "Follow the river", target: "riverPath" }]
      },
      riverPath: {
        text: "The path hugs the riverbank, the water strangely still. A figure stumbles into view ahead, no longer quite themselves.",
        choices: [{ type: "goto", label: "Continue", target: "riverCursedFight" }]
      },
      riverCursedFight: {
        text: "A villager, hollowed out by years of living beside the valley's terror, lunges before you can even speak.",
        choices: [{ type: "combat", label: "Fight the River-Cursed", enemyId: "theRiverCursed", target: "riverLoot" }]
      },
      riverLoot: {
        text: "An old offering shrine sits half-collapsed by the water, most of its tributes long since rotted — but something remains worth taking.",
        loot: ["Old Ore"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The valley splits ahead — one path climbs toward an old shrine, the other cuts through dense forest along the water's edge.",
        choices: [
          { type: "goto", label: "Toward the old shrine", target: "oldShrine" },
          { type: "goto", label: "Along the forested bank", target: "forestedBank" }
        ]
      },
      oldShrine: {
        text: "A crumbling shrine stands overgrown with moss. A gaunt figure kneels before it, still tending an offering no one has asked for in years.",
        choices: [{ type: "combat", label: "Fight the Bone-Littered Servant", enemyId: "theBoneLitteredServant", target: "convergeValley" }]
      },
      forestedBank: {
        text: "Something moves through the trees along the water — an animal shape, but wrong in ways that are hard to place until it's too late.",
        choices: [{ type: "combat", label: "Fight the Twisted Stag", enemyId: "theTwistedStag", target: "convergeValley" }]
      },
      convergeValley: {
        text: "Both paths lead to a wide bend in the river, the water darker here, and colder than it has any right to be.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "Something glints beneath the shallows — an old technique, carried down through generations who lived beside this water and learned to respect it.",
        choices: [
          { type: "discover", label: "Study the technique (Way of Suijin)", skillId: "waySuijin", spellId: "shakuhachiOfTheHollowWind", target: "deeperValley" },
          { type: "goto", label: "Move on", target: "deeperValley" }
        ]
      },
      deeperValley: {
        text: "The river narrows toward a gorge, the water growing louder, the air thick with something that isn't quite mist.",
        choices: [{ type: "goto", label: "Press onward", target: "drownedWatcherFight" }]
      },
      drownedWatcherFight: {
        text: "Something rises from the shallows, half-submerged, watching you with eyes that never quite blink.",
        choices: [{ type: "combat", label: "Fight the Drowned Watcher", enemyId: "theDrownedWatcher", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow ledge skirts the gorge above a lone figure standing sentry below — a way past, if you move quietly.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A warrior turns at your approach, armor rusted, stance still disciplined despite everything the years have done to him.",
        choices: [{ type: "combat", label: "Fight the Broken Guard", enemyId: "theBrokenGuard", target: "preBoss" }]
      },
      preBoss: {
        text: "The gorge opens onto a wide basin, the river pooling deep and black at its center. The air itself feels like it's holding its breath.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The water breaks apart as eight heads rise at once, ancient and monstrous, Yamata-no-Orochi finally showing itself in full. Your followers brace alongside you.",
        choices: [{ type: "combat", label: "Face Yamata-no-Orochi", enemyId: "yamataNoOrochi", target: "epilogue" }]
      },
      epilogue: {
        text: "The serpent finally falls still, the basin's water running clear for the first time in longer than anyone can remember. The valley is quiet now — genuinely quiet, not just waiting.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  gordonsDue: {
    startRoomId: "vaultApproach",
    rooms: {
      vaultApproach: {
        text: "An old, half-forgotten path leads toward the founding vault — and you're not the only one who's found it. Fresh tracks mark the ground ahead, moving fast.",
        choices: [{ type: "goto", label: "Follow the tracks", target: "outerPath" }]
      },
      outerPath: {
        text: "A figure crouches at a bend in the path, scouting ahead of the rest — young, quick, and clearly not expecting company.",
        choices: [{ type: "goto", label: "Continue", target: "scoutFight" }]
      },
      scoutFight: {
        text: "The scout spots you and doesn't hesitate. \"Another one after Gordon's Due? You'll have to get past me first.\"",
        choices: [{ type: "combat", label: "Fight the Vanguard Scout", enemyId: "vanguardScout", target: "pathLoot" }]
      },
      pathLoot: {
        text: "A supply cache left behind by the advancing party — clearly they came prepared for a real push.",
        loot: ["Old Ore"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The path splits ahead — one way climbs a steep ridge, the other cuts through an old collapsed passage.",
        choices: [
          { type: "goto", label: "Climb the ridge", target: "steepRidge" },
          { type: "goto", label: "Through the collapsed passage", target: "collapsedPassage" }
        ]
      },
      steepRidge: {
        text: "A weathered warrior holds the high ground, watching your approach with the calm of someone who's fought for far longer than you've been alive.",
        choices: [{ type: "combat", label: "Fight the Old Blade", enemyId: "theOldBlade", target: "convergeVault" }]
      },
      collapsedPassage: {
        text: "A young man paces impatiently in the narrow passage, clearly eager to prove himself worthy of what he insists is already his birthright.",
        choices: [{ type: "combat", label: "Fight the Reckless Heir", enemyId: "theRecklessHeir", target: "convergeVault" }]
      },
      convergeVault: {
        text: "Both paths converge at the mouth of the old vault itself, sealed doors carved with a crest half-familiar and half-strange to you.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "A worn inscription beside the doors catches your eye — an old technique, preserved here since the founding era.",
        choices: [
          { type: "discover", label: "Study the inscription (Line of Emyrs)", skillId: "ancestralEmyrs", spellId: "manaflow", target: "deeperVault" },
          { type: "goto", label: "Move on", target: "deeperVault" }
        ]
      },
      deeperVault: {
        text: "Beyond the doors, the vault's outer chamber stretches ahead, torches already lit — someone's clearly made themselves at home.",
        choices: [{ type: "goto", label: "Press onward", target: "tacticianFight" }]
      },
      tacticianFight: {
        text: "A sharp-eyed figure studies a hand-drawn map of the vault, glancing up with obvious irritation at your arrival. \"You're early. That's inconvenient.\"",
        choices: [{ type: "combat", label: "Fight the Clan Tactician", enemyId: "theClanTactician", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow side-corridor skirts a lone sentry guarding the way ahead — a chance to slip past, if you're careful.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A guard steps into the corridor, sword already drawn. \"Sworn to see this through. Nothing personal.\"",
        choices: [{ type: "combat", label: "Fight the Oath-Bound Guard", enemyId: "theOathBoundGuard", target: "preBoss" }]
      },
      preBoss: {
        text: "Ahead, the vault's innermost chamber waits, firelight flickering across old gold — and a single figure standing before it, waiting for you.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "Malcolm Gordon turns to face you, unhurried. \"My clan paid for this with generations of exile. I won't watch a stranger walk out with it instead.\"",
        choices: [{ type: "combat", label: "Face Malcolm Gordon", enemyId: "malcolmGordon", target: "epilogue" }]
      },
      epilogue: {
        text: "Malcolm Gordon finally yields, more weary than defeated. \"Take it, then. Just... know what it cost us to want it this badly.\" The vault falls silent behind you as you leave.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  wolfCoatsCurse: {
    startRoomId: "curseEntrance",
    rooms: {
      curseEntrance: {
        text: "The old warband's camp lies abandoned and overgrown, long-cold fire pits scattered among the trees. Overhead, the moon hangs full and heavy — and somewhere close, something moves that shouldn't still be moving after all these years.",
        choices: [{ type: "goto", label: "Press onward", target: "campPath" }]
      },
      campPath: {
        text: "Claw marks score deep into the bark of every tree along the path, pale in the full moon's light. Something large shifts in the undergrowth ahead, watching before it decides to attack.",
        choices: [{ type: "goto", label: "Continue", target: "firstTurnedFight" }]
      },
      firstTurnedFight: {
        text: "A wolf-beast steps into view, and for one unsettling moment, something almost aware flickers behind its eyes before vanishing entirely.",
        choices: [{ type: "combat", label: "Fight the First-Turned", enemyId: "theFirstTurned", target: "campLoot" }]
      },
      campLoot: {
        text: "An old weapon rack, mostly rotted, still holds a few things worth salvaging among the ruin.",
        loot: ["Hide"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The path splits ahead — one way leads toward a ruined longhouse, the other into a dense, unnervingly quiet thicket.",
        choices: [
          { type: "goto", label: "Toward the longhouse", target: "ruinedLonghouse" },
          { type: "goto", label: "Into the thicket", target: "quietThicket" }
        ]
      },
      ruinedLonghouse: {
        text: "The longhouse has collapsed in on itself, timbers rotted through, moonlight pouring through the broken roof. A massive wolf-beast paces within, scarred and enormous, any trace of the man long gone.",
        choices: [{ type: "combat", label: "Fight the Howling Thane", enemyId: "theHowlingThane", target: "convergeCurse" }]
      },
      quietThicket: {
        text: "The thicket is dead silent, unnaturally so. Something moves through it low and fast, hunting the way it always has now.",
        choices: [{ type: "combat", label: "Fight the Pack-Bound", enemyId: "thePackBound", target: "convergeCurse" }]
      },
      convergeCurse: {
        text: "Both paths lead to a wide clearing, bones scattered across the ground under the full moon's light — some old, some far too recent.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "A rune is carved deep into a nearby standing stone, half-covered in claw marks, as though something tried to destroy it and failed.",
        choices: [
          { type: "discover", label: "Study the rune (Rune-Blade)", skillId: "runeBlade", spellId: "bloodfuryMark", target: "deeperCurse" },
          { type: "goto", label: "Move on", target: "deeperCurse" }
        ]
      },
      deeperCurse: {
        text: "The clearing narrows into a den, the smell of old blood thick in the air, the ground littered with the remains of things that came before you.",
        choices: [{ type: "goto", label: "Press onward", target: "bloodmuzzleFight" }]
      },
      bloodmuzzleFight: {
        text: "Something lean and starved lunges from the shadows, driven by hunger alone, no memory of battle left in it at all.",
        choices: [{ type: "combat", label: "Fight the Bloodmuzzle", enemyId: "theBloodmuzzle", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow game-trail skirts a massive shape lying in wait ahead — a chance to slip past, if you're quiet.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "An enormous, aging wolf-beast rises to meet you, still holding its post out of some instinct that was once loyalty, long after anyone remembers what it was guarding.",
        choices: [{ type: "combat", label: "Fight the Last Watcher", enemyId: "theLastWatcher", target: "preBoss" }]
      },
      preBoss: {
        text: "The den opens into a wide cavern, old and deep, moonlight spilling through a fissure in the rock above. The air is thick with the weight of something that has been here far longer than anything else in this warband's ruin.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "Full moonlight cuts through the cavern's opening as Ulfrik rises to meet you — the largest, oldest, most far-gone of them all. The very first to don the pelt, centuries ago, and the one who dragged every one of his loyal warriors down with him.",
        choices: [{ type: "combat", label: "Face Ulfrik the First-Skinned", enemyId: "ulfrikTheFirstSkinned", target: "epilogue" }]
      },
      epilogue: {
        text: "Ulfrik falls still at last, the curse finally spent. For a moment, just before the end, something almost human passes through his eyes — recognition, maybe, or relief. Then it's gone, and so is he.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  unseelieCourt: {
    startRoomId: "courtEntrance",
    rooms: {
      courtEntrance: {
        text: "The old fae paths here have gone wrong, twisted somewhere along the way. The air itself feels watched, appraised, found wanting.",
        choices: [{ type: "goto", label: "Enter", target: "courtPath" }]
      },
      courtPath: {
        text: "Thorned vines coil along every branch overhead, and something moves between them, unhurried, clearly enjoying making you wait.",
        choices: [{ type: "goto", label: "Continue", target: "heraldFight" }]
      },
      heraldFight: {
        text: "A figure descends with theatrical grace, announcing your arrival to no one at all, delighting in the ceremony of it regardless.",
        choices: [{ type: "combat", label: "Fight the Thorned Herald", enemyId: "theThornedHerald", target: "pathLoot" }]
      },
      pathLoot: {
        text: "A cache of old, glittering trinkets sits abandoned beneath a hollow root — something worth taking, if you don't mind wondering what it once cost someone else.",
        loot: ["Grave Essence"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The path splits ahead — one way winds toward a ring of blackened standing stones, the other through a grove gone entirely silent.",
        choices: [
          { type: "goto", label: "Toward the standing stones", target: "blackenedStones" },
          { type: "goto", label: "Through the silent grove", target: "silentGrove" }
        ]
      },
      blackenedStones: {
        text: "The stones here are scorched black, arranged with cruel precision. A figure in disciplined, dark armor stands watch, utterly without mercy.",
        choices: [{ type: "combat", label: "Fight the Hollow Knight", enemyId: "theHollowKnight", target: "convergeCourt" }]
      },
      silentGrove: {
        text: "Something sings, faint and beautiful, from somewhere in the trees — and every instinct tells you not to listen too closely.",
        choices: [{ type: "combat", label: "Fight the Withered Muse", enemyId: "theWitheredMuse", target: "convergeCourt" }]
      },
      convergeCourt: {
        text: "Both paths open onto a wide clearing, old fae banners hanging in tatters, once beautiful, now simply wrong.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "A carving here shows what this court once was, before whatever happened to it — a fragment of the old grace still lingers, if you know where to look.",
        choices: [
          { type: "discover", label: "Study the carving (Path of the Storm)", skillId: "pathStorm", spellId: "lightningLash", target: "deeperCourt" },
          { type: "goto", label: "Move on", target: "deeperCourt" }
        ]
      },
      deeperCourt: {
        text: "The path narrows toward the court's true heart, the air growing colder and stranger with every step.",
        choices: [{ type: "goto", label: "Press onward", target: "bargainBreakerFight" }]
      },
      bargainBreakerFight: {
        text: "A figure smiles, all teeth and delight, already savoring the bargain she has no intention of keeping.",
        choices: [{ type: "combat", label: "Fight the Bargain-Breaker", enemyId: "theBargainBreaker", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow path skirts something watching from the shadows ahead — a chance to slip by, if you're careful.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A figure in an ash-grey crown steps forward, once nobility, now something far crueler than that title ever implied.",
        choices: [{ type: "combat", label: "Fight the Ash-Crowned", enemyId: "theAshCrowned", target: "preBoss" }]
      },
      preBoss: {
        text: "Ahead, the court's true heart opens before you — a throne of thorn and shadow, and upon it, something more beautiful and more terrible than anything you've faced yet.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The Unseelie Queen rises from her throne, cold and radiant, everything the old stories ever warned about the Sídhe taken to its darkest possible extreme.",
        choices: [{ type: "combat", label: "Face the Unseelie Queen", enemyId: "theUnseelieQueen", target: "epilogue" }]
      },
      epilogue: {
        text: "The Queen falls still at last, her court's cruel light finally fading. Whatever this place once was before it went wrong, it feels, for the first time in a very long while, like it might remember.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  hollowFaced: {
    startRoomId: "villageEntrance",
    rooms: {
      villageEntrance: {
        text: "The village looks perfectly ordinary from the road — smoke rising from chimneys, voices carrying faintly on the wind. Nothing here should feel wrong. It does anyway.",
        choices: [{ type: "goto", label: "Enter the village", target: "villagePath" }]
      },
      villagePath: {
        text: "A familiar face turns toward you a moment too slowly, smiles a moment too widely, and doesn't stop smiling once you've noticed.",
        choices: [{ type: "goto", label: "Continue", target: "elderFight" }]
      },
      elderFight: {
        text: "The village's most trusted elder greets you warmly, hollow behind the eyes in a way no one else here has ever thought to question.",
        choices: [{ type: "combat", label: "Fight the Smiling Elder", enemyId: "theSmilingElder", target: "pathLoot" }]
      },
      pathLoot: {
        text: "An unattended stall holds a few small goods, untouched despite sitting out in plain view all day.",
        loot: ["Hide"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The path splits ahead — one way toward the village's quiet row of homes, the other toward the birthing-house at its edge.",
        choices: [
          { type: "goto", label: "Toward the quiet homes", target: "quietRow" },
          { type: "goto", label: "Toward the birthing-house", target: "birthingHouse" }
        ]
      },
      quietRow: {
        text: "A neighbor stands in a doorway, utterly unremarkable, watching you pass with an attention that doesn't match how forgettable she's always seemed.",
        choices: [{ type: "combat", label: "Fight the Quiet Neighbor", enemyId: "theQuietNeighbor", target: "convergeVillage" }]
      },
      birthingHouse: {
        text: "The midwife looks up from her work, present as always, knowing far more than anyone's ever thought to ask how.",
        choices: [{ type: "combat", label: "Fight the Watchful Midwife", enemyId: "theWatchfulMidwife", target: "convergeVillage" }]
      },
      convergeVillage: {
        text: "Both paths lead to the village square, quiet at this hour, every face you pass a little too still.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "A mark is scratched faintly into a well's stone rim — a ward, old and half-forgotten, meant to catch exactly this kind of thing.",
        choices: [
          { type: "discover", label: "Study the ward (Rite of Unmaking)", skillId: "riteUnmaking", spellId: "vulnerabilityCurse", target: "deeperVillage" },
          { type: "goto", label: "Move on", target: "deeperVillage" }
        ]
      },
      deeperVillage: {
        text: "The square gives way to a narrower lane, the ordinary sounds of the village fading the further you go.",
        choices: [{ type: "goto", label: "Press onward", target: "fireflyFight" }]
      },
      fireflyFight: {
        text: "Something small and glowing darts past your face, then lands, then isn't small at all anymore.",
        choices: [{ type: "combat", label: "Fight the Firefly-Touched", enemyId: "theFireflyTouched", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow alley skirts a house where someone stands motionless at the window — a chance to slip past unseen, if you're careful.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "A grieving mother turns from an empty doorway, tears that have never once looked real to anyone who dared look closely.",
        choices: [{ type: "combat", label: "Fight the Grieving Mother", enemyId: "theGrievingMother", target: "preBoss" }]
      },
      preBoss: {
        text: "The lane ends at a modest house, unremarkable in every way — except that every path through this village, somehow, has always led here.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "The Witch of the Hollow looks up from her work, entirely unbothered. She has had a very long time to get used to being underestimated.",
        choices: [{ type: "combat", label: "Face the Witch of the Hollow", enemyId: "theWitchOfTheHollow", target: "epilogue" }]
      },
      epilogue: {
        text: "The Witch falls still, and across the village, faces that were a moment too still finally look like themselves again. No one will ever quite know how to explain what just happened here — only that something, finally, has stopped.",
        choices: [{ type: "end", label: "Return to Homebase" }]
      }
    }
  },
  diyusJudgment: {
    startRoomId: "diyuEntrance",
    rooms: {
      diyuEntrance: {
        text: "The ground gives way entirely, the path down sloping into a place no living soul is meant to walk. The air itself feels judged, weighed, and found wanting before you've taken a single step.",
        choices: [{ type: "goto", label: "Descend", target: "diyuPath" }]
      },
      diyuPath: {
        text: "A massive shape blocks the passage ahead, entirely bovine in form, standing at rigid attention like it's done this a thousand times before.",
        choices: [{ type: "goto", label: "Continue", target: "niutouFight" }]
      },
      niutouFight: {
        text: "Niutou lowers his head, unhurried and utterly without malice — this is simply his duty, and you are simply in the way of it.",
        choices: [{ type: "combat", label: "Fight Niutou, the Ox Guardian", enemyId: "niutouTheOxGuardian", target: "pathLoot" }]
      },
      pathLoot: {
        text: "A small offering-shrine sits along the path, coins and trinkets left by souls long since processed and moved on.",
        loot: ["Grave Essence"],
        choices: [{ type: "goto", label: "Continue", target: "fork" }]
      },
      fork: {
        text: "The path splits ahead — one way winds past a field of chained, wailing spirits, the other through a hall of endless empty banquet tables.",
        choices: [
          { type: "goto", label: "Past the chained spirits", target: "chainedField" },
          { type: "goto", label: "Through the banquet hall", target: "banquetHall" }
        ]
      },
      chainedField: {
        text: "A spirit strains against old chains, condemned for a transgression long since forgotten by everyone but Diyu's own ledgers.",
        choices: [{ type: "combat", label: "Fight the Chain-Bound Soul", enemyId: "theChainBoundSoul", target: "convergeDiyu" }]
      },
      banquetHall: {
        text: "Endless tables stretch out, laden with food that turns to ash the instant it's touched. Something gaunt and desperate lunges from beneath one of them.",
        choices: [{ type: "combat", label: "Fight the Hungry Ghost", enemyId: "theHungryGhost", target: "convergeDiyu" }]
      },
      convergeDiyu: {
        text: "Both paths lead to a wide judgment hall, its walls lined with ledgers stretching further than any eye could read.",
        choices: [{ type: "goto", label: "Continue", target: "discoverRoom" }]
      },
      discoverRoom: {
        text: "One page of an open ledger catches your eye, an old technique recorded in its margins, left by someone who passed this way long before you.",
        choices: [
          { type: "discover", label: "Study the ledger (Way of Onmyōji)", skillId: "wayOnmyoji", spellId: "ubumesGift", target: "deeperDiyu" },
          { type: "goto", label: "Move on", target: "deeperDiyu" }
        ]
      },
      deeperDiyu: {
        text: "The hall narrows into a colder passage, the ledgers giving way to bare stone, the weight of judgment growing heavier with every step.",
        choices: [{ type: "goto", label: "Press onward", target: "corpseFight" }]
      },
      corpseFight: {
        text: "Something rigid and upright hops stiffly into the passage ahead, arms outstretched, hunting by scent alone.",
        choices: [{ type: "combat", label: "Fight the Hopping Corpse", enemyId: "theHoppingCorpse", target: "vigilCheck" }]
      },
      vigilCheck: {
        text: "A narrow side-passage skirts a massive horse-formed guardian standing watch ahead — a chance to slip by, if you're careful.",
        choices: [
          { type: "check", label: "Move carefully (Stealth)", skillId: "stealth", difficulty: "Master", successTarget: "preBoss", failureTarget: "extraFight" },
          { type: "goto", label: "Push through directly", target: "extraFight" }
        ]
      },
      extraFight: {
        text: "Mamian steps forward to block the way, unhurried and dutiful as ever, entirely unmoved by your intrusion.",
        choices: [{ type: "combat", label: "Fight Mamian, the Horse Guardian", enemyId: "mamianTheHorseGuardian", target: "preBoss" }]
      },
      preBoss: {
        text: "Ahead, the passage opens onto a vast judgment throne room, ledgers stacked to the ceiling, and upon the throne, something absolute and unmoved by anything the living have ever pleaded.",
        choices: [{ type: "goto", label: "Enter", target: "bossRoom" }]
      },
      bossRoom: {
        text: "Yanluo Wang looks up from his ledger, entirely unsurprised. He has judged every soul that has ever crossed into Diyu, and he sees no reason to make an exception for you.",
        choices: [{ type: "combat", label: "Face Yanluo Wang, King of Diyu", enemyId: "yanluoWang", target: "epilogue" }]
      },
      epilogue: {
        text: "Yanluo Wang finally sets down his ledger, something almost like respect in his ancient, unmoved gaze. The path back to the living world opens before you — a rare mercy, and one he makes very clear will not be extended twice.",
        choices: [{ type: "end", label: "Return to Homebase" }]
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
// on purpose. Any room ID NOT listed here simply falls back to
// the dungeon's original single image — see getRoomImage() in
// main.js — so nothing breaks if a room is ever added without
// updating this table.
// ----------------------------------------------------------
const ROOM_IMAGES = {
  duncairnKeep: {
    gateway: "assets/images/duncairn-keep/gateway.png",
    courtyard: "assets/images/duncairn-keep/courtyard.png",
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
  },
  blackforgeDeep: {
    hallEntrance: "assets/images/blackforge-deep/hall-entrance.png",
    outerForge: "assets/images/blackforge-deep/outer-forge.png",
    forgeChestLoot: "assets/images/blackforge-deep/forge-chest-loot.png",
    toolCache: "assets/images/blackforge-deep/tool-cache.png",
    innerHalls: "assets/images/blackforge-deep/inner-halls.png",
    sideVault: "assets/images/blackforge-deep/side-vault.png",
    throneApproach: "assets/images/blackforge-deep/throne-approach.png",
    archiveHall: "assets/images/blackforge-deep/archive-hall.png",
    fork: "assets/images/blackforge-deep/fork.png",
    wellStudy: "assets/images/blackforge-deep/well-study.png",
    converge: "assets/images/blackforge-deep/converge.png",
    preBoss: "assets/images/blackforge-deep/pre-boss.png",
    bossDoor: "assets/images/blackforge-deep/boss-door.png",
    bossRoom: "assets/images/blackforge-deep/boss-room.png",
    epilogue: "assets/images/blackforge-deep/epilogue.png"
  },
  fomorianDepths: {
    shoreEntrance: "assets/images/fomorian-depths/shore-entrance.png",
    tidalCave: "assets/images/fomorian-depths/tidal-cave.png",
    raiderAmbush: "assets/images/fomorian-depths/tidal-cave.png",
    wreckageLoot: "assets/images/fomorian-depths/wreckage-loot.png",
    driftwoodCache: "assets/images/fomorian-depths/driftwood-cache.png",
    deeperCave: "assets/images/fomorian-depths/deeper-cave.png",
    bruteFight: "assets/images/fomorian-depths/deeper-cave.png",
    sideGrotto: "assets/images/fomorian-depths/side-grotto.png",
    blightHall: "assets/images/fomorian-depths/blight-hall.png",
    casterEncounter: "assets/images/fomorian-depths/blight-hall.png",
    bonePileChamber: "assets/images/fomorian-depths/bone-pile-chamber.png",
    fork: "assets/images/fomorian-depths/fork.png",
    tidepoolPath: "assets/images/fomorian-depths/tidepool-path.png",
    sunkenPassage: "assets/images/fomorian-depths/sunken-passage.png",
    converge: "assets/images/fomorian-depths/converge.png",
    preBoss: "assets/images/fomorian-depths/pre-boss.png",
    extraFight: "assets/images/fomorian-depths/pre-boss.png",
    bossDoor: "assets/images/fomorian-depths/boss-door.png",
    bossRoom: "assets/images/fomorian-depths/boss-room.png",
    epilogue: "assets/images/fomorian-depths/epilogue.png"
  },
  cailleachsReach: {
    mountainPassEntrance: "assets/images/cailleachs-reach/mountain-pass-entrance.png",
    windsweptTrail: "assets/images/cailleachs-reach/windswept-trail.png",
    reiverAmbush: "assets/images/cailleachs-reach/windswept-trail.png",
    cairnLoot: "assets/images/cailleachs-reach/cairn-loot.png",
    hiddenNiche: "assets/images/cailleachs-reach/hidden-niche.png",
    risingPath: "assets/images/cailleachs-reach/rising-path.png",
    wightEncounter: "assets/images/cailleachs-reach/rising-path.png",
    shelteredHollow: "assets/images/cailleachs-reach/sheltered-hollow.png",
    stormRidge: "assets/images/cailleachs-reach/storm-ridge.png",
    handmaidenFight: "assets/images/cailleachs-reach/storm-ridge.png",
    boneCairn: "assets/images/cailleachs-reach/bone-cairn.png",
    fork: "assets/images/cailleachs-reach/fork.png",
    icyLedge: "assets/images/cailleachs-reach/icy-ledge.png",
    hiddenCave: "assets/images/cailleachs-reach/hidden-cave.png",
    stalkerFight: "assets/images/cailleachs-reach/hidden-cave.png",
    converge: "assets/images/cailleachs-reach/converge.png",
    preBoss: "assets/images/cailleachs-reach/pre-boss.png",
    extraFight: "assets/images/cailleachs-reach/pre-boss.png",
    bossDoor: "assets/images/cailleachs-reach/boss-door.png",
    bossRoom: "assets/images/cailleachs-reach/boss-room.png",
    epilogue: "assets/images/cailleachs-reach/epilogue.png"
  },
  restlessBaobab: {
    groveEntrance: "assets/images/restless-baobab/grove-entrance.png",
    innerPath: "assets/images/restless-baobab/inner-path.png",
    ancestorAmbush: "assets/images/restless-baobab/inner-path.png",
    rootHollow: "assets/images/restless-baobab/root-hollow.png",
    hiddenGrove: "assets/images/restless-baobab/hidden-grove.png",
    deeperGrove: "assets/images/restless-baobab/deeper-grove.png",
    guardianEncounter: "assets/images/restless-baobab/deeper-grove.png",
    whisperingClearing: "assets/images/restless-baobab/whispering-clearing.png",
    boneScatter: "assets/images/restless-baobab/bone-scatter.png",
    fork: "assets/images/restless-baobab/fork.png",
    shadowedHollow: "assets/images/restless-baobab/shadowed-hollow.png",
    mistyThicket: "assets/images/restless-baobab/misty-thicket.png",
    converge: "assets/images/restless-baobab/converge.png",
    preBoss: "assets/images/restless-baobab/pre-boss.png",
    extraFight: "assets/images/restless-baobab/pre-boss.png",
    bossDoor: "assets/images/restless-baobab/boss-door.png",
    bossRoom: "assets/images/restless-baobab/boss-room.png",
    epilogue: "assets/images/restless-baobab/epilogue.png"
  },
  drownedShrine: {
    shrineApproach: "assets/images/drowned-shrine/shrine-approach.png",
    floodedSteps: "assets/images/drowned-shrine/flooded-steps.png",
    guardianAmbush: "assets/images/drowned-shrine/flooded-steps.png",
    submergedOffering: "assets/images/drowned-shrine/submerged-offering.png",
    hiddenAlcove: "assets/images/drowned-shrine/hidden-alcove.png",
    deeperWaters: "assets/images/drowned-shrine/deeper-waters.png",
    wardenEncounter: "assets/images/drowned-shrine/deeper-waters.png",
    stillPool: "assets/images/drowned-shrine/still-pool.png",
    driftwoodPile: "assets/images/drowned-shrine/driftwood-pile.png",
    fork: "assets/images/drowned-shrine/fork.png",
    sunkenHall: "assets/images/drowned-shrine/sunken-hall.png",
    risingCurrent: "assets/images/drowned-shrine/rising-current.png",
    converge: "assets/images/drowned-shrine/converge.png",
    preBoss: "assets/images/drowned-shrine/pre-boss.png",
    extraFight: "assets/images/drowned-shrine/pre-boss.png",
    bossDoor: "assets/images/drowned-shrine/boss-door.png",
    bossRoom: "assets/images/drowned-shrine/boss-room.png",
    epilogue: "assets/images/drowned-shrine/epilogue.png"
  },
  theForsakenManor: {
    mazeEntrance: "assets/images/forsaken-manor/maze-entrance.png",
    mazeCorridorOne: "assets/images/forsaken-manor/maze-corridor-one.png",
    mazeLeft: "assets/images/forsaken-manor/maze-left.png",
    mazeRight: "assets/images/forsaken-manor/maze-right.png",
    mazeStraight: "assets/images/forsaken-manor/maze-straight.png",
    mazeMeeting: "assets/images/forsaken-manor/maze-meeting.png",
    deeperCorridor: "assets/images/forsaken-manor/deeper-corridor.png",
    mazeExit: "assets/images/forsaken-manor/maze-exit.png",
    castleHall: "assets/images/forsaken-manor/castle-hall.png",
    servantQuarters: "assets/images/forsaken-manor/servant-quarters.png",
    mainHall: "assets/images/forsaken-manor/main-hall.png",
    leftWing: "assets/images/forsaken-manor/left-wing.png",
    rightWing: "assets/images/forsaken-manor/right-wing.png",
    innerSanctum: "assets/images/forsaken-manor/inner-sanctum.png",
    throneApproach: "assets/images/forsaken-manor/throne-approach.png",
    preBoss: "assets/images/forsaken-manor/pre-boss.png",
    bossRoom: "assets/images/forsaken-manor/boss-room.png",
    epilogue: "assets/images/forsaken-manor/epilogue.png"
  },

  dragonShrine: {
    shrineApproach: "assets/images/dragon-shrine/shrine-approach.png",
    outerGates: "assets/images/dragon-shrine/outer-gates.png",
    guardianAmbush: "assets/images/dragon-shrine/outer-gates.png",
    pillarCourt: "assets/images/dragon-shrine/pillar-court.png",
    treasureHouse: "assets/images/dragon-shrine/treasure-house.png",
    shrineInterior: "assets/images/dragon-shrine/shrine-interior.png",
    leftWing: "assets/images/dragon-shrine/left-wing.png",
    innerChapel: "assets/images/dragon-shrine/inner-chapel.png",
    rightWing: "assets/images/dragon-shrine/right-wing.png",
    ceremonyHall: "assets/images/dragon-shrine/ceremony-hall.png",
    ascendingPath: "assets/images/dragon-shrine/ascending-path.png",
    spiralFight: "assets/images/dragon-shrine/ascending-path.png",
    upperSanctum: "assets/images/dragon-shrine/upper-sanctum.png",
    lowerShrine: "assets/images/dragon-shrine/lower-shrine.png",
    ancientOfferings: "assets/images/dragon-shrine/ancient-offerings.png",
    innerSanctumDoor: "assets/images/dragon-shrine/inner-sanctum-door.png",
    preBoss: "assets/images/dragon-shrine/pre-boss.png",
    bossRoom: "assets/images/dragon-shrine/boss-room.png",
    epilogue: "assets/images/dragon-shrine/epilogue.png"
  },

  emberScarredOutcrop: {
    outcropApproach: "assets/images/ember-scarred-outcrop/outcrop-approach.png",
    blackenedPath: "assets/images/ember-scarred-outcrop/blackened-path.png",
    ashStrewnLedge: "assets/images/ember-scarred-outcrop/ash-strewn-ledge.png",
    hiddenCache: "assets/images/ember-scarred-outcrop/hidden-cache.png",
    smolderingPassage: "assets/images/ember-scarred-outcrop/smoldering-passage.png",
    emberField: "assets/images/ember-scarred-outcrop/ember-field.png",
    scorchedShrine: "assets/images/ember-scarred-outcrop/scorched-shrine.png",
    fork: "assets/images/ember-scarred-outcrop/fork.png",
    crackedRavine: "assets/images/ember-scarred-outcrop/cracked-ravine.png",
    highLedge: "assets/images/ember-scarred-outcrop/high-ledge.png",
    converge: "assets/images/ember-scarred-outcrop/converge.png",
    preBoss: "assets/images/ember-scarred-outcrop/pre-boss.png",
    extraFight: "assets/images/ember-scarred-outcrop/pre-boss.png",
    bossDoor: "assets/images/ember-scarred-outcrop/boss-door.png",
    bossRoom: "assets/images/ember-scarred-outcrop/boss-room.png",
    epilogue: "assets/images/ember-scarred-outcrop/epilogue.png"
  },

  crowWindDojo: {
    gateApproach: "assets/images/crow-wind-dojo/gate-approach.png",
    trainingYard: "assets/images/crow-wind-dojo/training-yard.png",
    weaponsCorridor: "assets/images/crow-wind-dojo/weapons-corridor.png",
    kodamaGrove: "assets/images/crow-wind-dojo/kodama-grove.png",
    meditationHall: "assets/images/crow-wind-dojo/meditation-hall.png",
    fork: "assets/images/crow-wind-dojo/fork.png",
    ropeBridgePath: "assets/images/crow-wind-dojo/rope-bridge-path.png",
    konohaShrine: "assets/images/crow-wind-dojo/konoha-shrine.png",
    converge: "assets/images/crow-wind-dojo/converge.png",
    armory: "assets/images/crow-wind-dojo/armory.png",
    discipleHall: "assets/images/crow-wind-dojo/disciple-hall.png",
    lookoutPoint: "assets/images/crow-wind-dojo/lookout-point.png",
    guardianRoom: "assets/images/crow-wind-dojo/guardian-room.png",
    preBoss: "assets/images/crow-wind-dojo/pre-boss.png",
    extraFight: "assets/images/crow-wind-dojo/extra-fight.png",
    bossDoor: "assets/images/crow-wind-dojo/boss-door.png",
    bossRoom: "assets/images/crow-wind-dojo/boss-room.png",
    preEpilogue: "assets/images/crow-wind-dojo/boss-room.png",
    epilogue: "assets/images/crow-wind-dojo/epilogue.png"
  },
  sunderedThrone: {
    throneHallEntrance: "assets/images/sundered-throne/throne-hall-entrance.png",
    longCorridor: "assets/images/sundered-throne/long-corridor.png",
    stewardFight: "assets/images/sundered-throne/long-corridor.png",
    corridorLoot: "assets/images/sundered-throne/corridor-loot.png",
    fork: "assets/images/sundered-throne/fork.png",
    collapsedNave: "assets/images/sundered-throne/collapsed-nave.png",
    oldKitchens: "assets/images/sundered-throne/old-kitchens.png",
    convergeHall: "assets/images/sundered-throne/converge-hall.png",
    discoverRoom: "assets/images/sundered-throne/discover-room.png",
    deeperHall: "assets/images/sundered-throne/deeper-hall.png",
    corpseFight: "assets/images/sundered-throne/deeper-hall.png",
    vigilCheck: "assets/images/sundered-throne/vigil-check.png",
    extraFight: "assets/images/sundered-throne/vigil-check.png",
    preBoss: "assets/images/sundered-throne/pre-boss.png",
    bossRoom: "assets/images/sundered-throne/boss-room.png",
    epilogue: "assets/images/sundered-throne/epilogue.png"
  },
  widowsHollow: {
    hollowEntrance: "assets/images/widows-hollow/hollow-entrance.png",
    mistPath: "assets/images/widows-hollow/mist-path.png",
    officiantFight: "assets/images/widows-hollow/mist-path.png",
    mistLoot: "assets/images/widows-hollow/mist-loot.png",
    fork: "assets/images/widows-hollow/fork.png",
    oldChapel: "assets/images/widows-hollow/old-chapel.png",
    suitorsGlen: "assets/images/widows-hollow/suitors-glen.png",
    convergeHollow: "assets/images/widows-hollow/converge-hollow.png",
    discoverRoom: "assets/images/widows-hollow/discover-room.png",
    deeperHollow: "assets/images/widows-hollow/deeper-hollow.png",
    gravWardenFight: "assets/images/widows-hollow/deeper-hollow.png",
    vigilCheck: "assets/images/widows-hollow/vigil-check.png",
    extraFight: "assets/images/widows-hollow/vigil-check.png",
    preBoss: "assets/images/widows-hollow/pre-boss.png",
    bossRoom: "assets/images/widows-hollow/boss-room.png",
    epilogue: "assets/images/widows-hollow/epilogue.png"
  },
  sigrunsThreshold: {
    thresholdEntrance: "assets/images/sigruns-threshold/threshold-entrance.png",
    hallApproach: "assets/images/sigruns-threshold/hall-approach.png",
    shieldSplitterFight: "assets/images/sigruns-threshold/hall-approach.png",
    approachLoot: "assets/images/sigruns-threshold/approach-loot.png",
    fork: "assets/images/sigruns-threshold/fork.png",
    frozenStrait: "assets/images/sigruns-threshold/frozen-strait.png",
    oathStoneCircle: "assets/images/sigruns-threshold/oath-stone-circle.png",
    convergeHall: "assets/images/sigruns-threshold/converge-hall.png",
    discoverRoom: "assets/images/sigruns-threshold/discover-room.png",
    deeperHall: "assets/images/sigruns-threshold/deeper-hall.png",
    unyieldingFight: "assets/images/sigruns-threshold/deeper-hall.png",
    vigilCheck: "assets/images/sigruns-threshold/vigil-check.png",
    extraFight: "assets/images/sigruns-threshold/vigil-check.png",
    preBoss: "assets/images/sigruns-threshold/pre-boss.png",
    bossRoom: "assets/images/sigruns-threshold/boss-room.png",
    epilogue: "assets/images/sigruns-threshold/epilogue.png"
  },
  oldSpiritGrove: {
    groveEntrance: "assets/images/old-spirit-grove/grove-entrance.png",
    grovePath: "assets/images/old-spirit-grove/grove-path.png",
    groveBoundFight: "assets/images/old-spirit-grove/grove-path.png",
    pathLoot: "assets/images/old-spirit-grove/path-loot.png",
    fork: "assets/images/old-spirit-grove/fork.png",
    denseThicket: "assets/images/old-spirit-grove/dense-thicket.png",
    sunlitClearing: "assets/images/old-spirit-grove/sunlit-clearing.png",
    convergeGrove: "assets/images/old-spirit-grove/converge-grove.png",
    discoverRoom: "assets/images/old-spirit-grove/discover-room.png",
    deeperGrove: "assets/images/old-spirit-grove/deeper-grove.png",
    elderTrackerFight: "assets/images/old-spirit-grove/deeper-grove.png",
    vigilCheck: "assets/images/old-spirit-grove/vigil-check.png",
    extraFight: "assets/images/old-spirit-grove/vigil-check.png",
    preBoss: "assets/images/old-spirit-grove/pre-boss.png",
    bossRoom: "assets/images/old-spirit-grove/boss-room.png",
    epilogue: "assets/images/old-spirit-grove/epilogue.png"
  },
  orochisValley: {
    valleyEntrance: "assets/images/orochis-valley/valley-entrance.png",
    riverPath: "assets/images/orochis-valley/river-path.png",
    riverCursedFight: "assets/images/orochis-valley/river-path.png",
    riverLoot: "assets/images/orochis-valley/river-loot.png",
    fork: "assets/images/orochis-valley/fork.png",
    oldShrine: "assets/images/orochis-valley/old-shrine.png",
    forestedBank: "assets/images/orochis-valley/forested-bank.png",
    convergeValley: "assets/images/orochis-valley/converge-valley.png",
    discoverRoom: "assets/images/orochis-valley/discover-room.png",
    deeperValley: "assets/images/orochis-valley/deeper-valley.png",
    drownedWatcherFight: "assets/images/orochis-valley/deeper-valley.png",
    vigilCheck: "assets/images/orochis-valley/vigil-check.png",
    extraFight: "assets/images/orochis-valley/vigil-check.png",
    preBoss: "assets/images/orochis-valley/pre-boss.png",
    bossRoom: "assets/images/orochis-valley/boss-room.png",
    epilogue: "assets/images/orochis-valley/epilogue.png"
  },
  gordonsDue: {
    vaultApproach: "assets/images/gordons-due/vault-approach.png",
    outerPath: "assets/images/gordons-due/outer-path.png",
    scoutFight: "assets/images/gordons-due/outer-path.png",
    pathLoot: "assets/images/gordons-due/path-loot.png",
    fork: "assets/images/gordons-due/fork.png",
    steepRidge: "assets/images/gordons-due/steep-ridge.png",
    collapsedPassage: "assets/images/gordons-due/collapsed-passage.png",
    convergeVault: "assets/images/gordons-due/converge-vault.png",
    discoverRoom: "assets/images/gordons-due/discover-room.png",
    deeperVault: "assets/images/gordons-due/deeper-vault.png",
    tacticianFight: "assets/images/gordons-due/deeper-vault.png",
    vigilCheck: "assets/images/gordons-due/vigil-check.png",
    extraFight: "assets/images/gordons-due/vigil-check.png",
    preBoss: "assets/images/gordons-due/pre-boss.png",
    bossRoom: "assets/images/gordons-due/boss-room.png",
    epilogue: "assets/images/gordons-due/epilogue.png"
  },
  wolfCoatsCurse: {
    curseEntrance: "assets/images/wolf-coats-curse/curse-entrance.png",
    campPath: "assets/images/wolf-coats-curse/camp-path.png",
    firstTurnedFight: "assets/images/wolf-coats-curse/camp-path.png",
    campLoot: "assets/images/wolf-coats-curse/camp-loot.png",
    fork: "assets/images/wolf-coats-curse/fork.png",
    ruinedLonghouse: "assets/images/wolf-coats-curse/ruined-longhouse.png",
    quietThicket: "assets/images/wolf-coats-curse/quiet-thicket.png",
    convergeCurse: "assets/images/wolf-coats-curse/converge-curse.png",
    discoverRoom: "assets/images/wolf-coats-curse/discover-room.png",
    deeperCurse: "assets/images/wolf-coats-curse/deeper-curse.png",
    bloodmuzzleFight: "assets/images/wolf-coats-curse/deeper-curse.png",
    vigilCheck: "assets/images/wolf-coats-curse/vigil-check.png",
    extraFight: "assets/images/wolf-coats-curse/vigil-check.png",
    preBoss: "assets/images/wolf-coats-curse/pre-boss.png",
    bossRoom: "assets/images/wolf-coats-curse/boss-room.png",
    epilogue: "assets/images/wolf-coats-curse/epilogue.png"
  },
  unseelieCourt: {
    courtEntrance: "assets/images/unseelie-court/court-entrance.png",
    courtPath: "assets/images/unseelie-court/court-path.png",
    heraldFight: "assets/images/unseelie-court/court-path.png",
    pathLoot: "assets/images/unseelie-court/path-loot.png",
    fork: "assets/images/unseelie-court/fork.png",
    blackenedStones: "assets/images/unseelie-court/blackened-stones.png",
    silentGrove: "assets/images/unseelie-court/silent-grove.png",
    convergeCourt: "assets/images/unseelie-court/converge-court.png",
    discoverRoom: "assets/images/unseelie-court/discover-room.png",
    deeperCourt: "assets/images/unseelie-court/deeper-court.png",
    bargainBreakerFight: "assets/images/unseelie-court/deeper-court.png",
    vigilCheck: "assets/images/unseelie-court/vigil-check.png",
    extraFight: "assets/images/unseelie-court/vigil-check.png",
    preBoss: "assets/images/unseelie-court/pre-boss.png",
    bossRoom: "assets/images/unseelie-court/boss-room.png",
    epilogue: "assets/images/unseelie-court/epilogue.png"
  },
  hollowFaced: {
    villageEntrance: "assets/images/hollow-faced/village-entrance.png",
    villagePath: "assets/images/hollow-faced/village-path.png",
    elderFight: "assets/images/hollow-faced/village-path.png",
    pathLoot: "assets/images/hollow-faced/path-loot.png",
    fork: "assets/images/hollow-faced/fork.png",
    quietRow: "assets/images/hollow-faced/quiet-row.png",
    birthingHouse: "assets/images/hollow-faced/birthing-house.png",
    convergeVillage: "assets/images/hollow-faced/converge-village.png",
    discoverRoom: "assets/images/hollow-faced/discover-room.png",
    deeperVillage: "assets/images/hollow-faced/deeper-village.png",
    fireflyFight: "assets/images/hollow-faced/deeper-village.png",
    vigilCheck: "assets/images/hollow-faced/vigil-check.png",
    extraFight: "assets/images/hollow-faced/vigil-check.png",
    preBoss: "assets/images/hollow-faced/pre-boss.png",
    bossRoom: "assets/images/hollow-faced/boss-room.png",
    epilogue: "assets/images/hollow-faced/epilogue.png"
  },
  diyusJudgment: {
    diyuEntrance: "assets/images/diyus-judgment/diyu-entrance.png",
    diyuPath: "assets/images/diyus-judgment/diyu-path.png",
    niutouFight: "assets/images/diyus-judgment/diyu-path.png",
    pathLoot: "assets/images/diyus-judgment/path-loot.png",
    fork: "assets/images/diyus-judgment/fork.png",
    chainedField: "assets/images/diyus-judgment/chained-field.png",
    banquetHall: "assets/images/diyus-judgment/banquet-hall.png",
    convergeDiyu: "assets/images/diyus-judgment/converge-diyu.png",
    discoverRoom: "assets/images/diyus-judgment/discover-room.png",
    deeperDiyu: "assets/images/diyus-judgment/deeper-diyu.png",
    corpseFight: "assets/images/diyus-judgment/deeper-diyu.png",
    vigilCheck: "assets/images/diyus-judgment/vigil-check.png",
    extraFight: "assets/images/diyus-judgment/vigil-check.png",
    preBoss: "assets/images/diyus-judgment/pre-boss.png",
    bossRoom: "assets/images/diyus-judgment/boss-room.png",
    epilogue: "assets/images/diyus-judgment/epilogue.png"
  }
};

function getRoomImage(dungeonId, roomId) {
  const dungeonMap = ROOM_IMAGES[dungeonId];
  if (dungeonMap && dungeonMap[roomId]) {
    return dungeonMap[roomId];
  }
  return DUNGEONS[dungeonId] ? DUNGEONS[dungeonId].image : null;
}