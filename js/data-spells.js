/* ============================================================
   DATA-SPELLS.JS
   Named spells for every magic line.
   ============================================================ */

const SPELLS = {
  ancestralAverick: [
    { id: "flametouchedBlade", name: "Flametouched Blade", type: "enchant", description: "Wreathes your weapon in fire for a few rounds, adding burn to every strike." },
    { id: "frostbiteEdge", name: "Frostbite Edge", type: "enchant", description: "Chills your blade to biting cold for a few rounds." },
    { id: "stormedge", name: "Stormedge", type: "enchant", description: "Charges your weapon with crackling energy for a few rounds." },
    { id: "emberweight", name: "Emberweight", type: "enchant", description: "Weighs your strikes with smoldering ember-heat for a few rounds." },
    { id: "thunderbrand", name: "Thunderbrand", type: "enchant", description: "Brands your weapon with a rolling thunderclap for a few rounds." },
    { id: "glacialEdge", name: "Glacial Edge", type: "enchant", description: "Coats your blade in unnatural frost for a few rounds." }
  ],
  ancestralSiuloir: [
    { id: "ancestralMending", name: "Ancestral Mending", type: "heal", description: "Calls on a healer ancestor's blessing to mend your wounds." }
  ],
  ancestralEmyrs: [
    { id: "fireball", name: "Fireball", type: "damage", description: "A burst of raw fire, called directly from the elements." },
    { id: "frostbolt", name: "Frostbolt", type: "damage", description: "A bolt of unnatural cold." },
    { id: "stoneshard", name: "Stoneshard", type: "damage", description: "Earth wrenched violently into a jagged shard." },
    { id: "galeburst", name: "Galeburst", type: "damage", description: "Wind driven to a cutting edge." },
    { id: "tideclaw", name: "Tideclaw", type: "damage", description: "Water given sudden, violent shape." },
    { id: "emberlash", name: "Emberlash", type: "damage", description: "A whip of fire, quick and unpredictable." }
  ],

  runeBlade: [
    { id: "rageRune", name: "Rage Rune", type: "buff", description: "Carves a rune of fury, strengthening your next few strikes." },
    { id: "bloodfuryMark", name: "Bloodfury Mark", type: "buff", description: "A mark that turns battle-heat into raw strength for a few rounds." },
    { id: "warcryRune", name: "Warcry Rune", type: "buff", description: "A rune spoken aloud, sharpening your next few attacks." },
    { id: "battleRuneStrike", name: "Battle-Rune Strike", type: "buff", description: "A rune carved mid-swing, fueling ferocity for a few rounds." },
    { id: "furyrune", name: "Furyrune", type: "buff", description: "A rune that answers battle with more battle." },
    { id: "ironbloodRune", name: "Ironblood Rune", type: "buff", description: "A rune that hardens resolve into raw power." }
  ],
  runeShield: [
    { id: "ironruneGuard", name: "Ironrune Guard", type: "guard", description: "Hardens your stance against harm for a few rounds." },
    { id: "bulwarkMark", name: "Bulwark Mark", type: "guard", description: "A rune meant to hold a shield wall, lent to just you." },
    { id: "stonewallRune", name: "Stonewall Rune", type: "guard", description: "A rune that turns your footing to stone, briefly." },
    { id: "wardRuneRiposte", name: "Ward-Rune Riposte", type: "guard", description: "A defensive rune that steadies you against the next blows." },
    { id: "shieldsongRune", name: "Shieldsong Rune", type: "guard", description: "An old rune sung by shield-bearers before a charge." },
    { id: "deflectionMark", name: "Deflection Mark", type: "guard", description: "A rune that turns harm aside before it lands." }
  ],
  runeVision: [
    { id: "omenmark", name: "Omenmark", type: "debuff", description: "Marks your foe with a rune of ill omen, weakening them for a few rounds." },
    { id: "ravensightRune", name: "Ravensight Rune", type: "debuff", description: "Sees as the raven sees, revealing an opening in your foe's guard." },
    { id: "foreseenOpening", name: "Foreseen Opening", type: "debuff", description: "A glimpse ahead shows exactly where your foe will falter." },
    { id: "seersWarning", name: "Seer's Warning", type: "debuff", description: "An omen-rune unsettles your foe's footing for a few rounds." },
    { id: "fateglimpse", name: "Fateglimpse", type: "debuff", description: "A brief look at how this fight ends, used against them." },
    { id: "threadcutVision", name: "Threadcut Vision", type: "debuff", description: "A vision of a thread best cut now." }
  ],
  runeCurse: [
    { id: "witheringHex", name: "Withering Hex", type: "dot", description: "A rune that saps your foe's strength, festering over a few rounds." },
    { id: "doomrune", name: "Doomrune", type: "dot", description: "A hex marking your foe for lingering misfortune." },
    { id: "blightmark", name: "Blightmark", type: "dot", description: "A rune that spreads like rot over a few rounds." },
    { id: "hexbind", name: "Hexbind", type: "dot", description: "A curse that tangles and wears down a foe over time." },
    { id: "curseweave", name: "Curseweave", type: "dot", description: "Several small hexes, woven into one lingering curse." },
    { id: "illFortuneRune", name: "Ill-Fortune Rune", type: "dot", description: "A rune that turns luck against its target, over and over." }
  ],

  pathWild: [
    { id: "wolfsCall", name: "Wolf's Call", type: "companion", description: "Calls a spectral wolf to fight beside you for the rest of the battle." },
    { id: "stagsCharge", name: "Stag's Charge", type: "companion", description: "Calls a great stag to strike alongside you for the rest of the battle." },
    { id: "talonkin", name: "Talonkin", type: "companion", description: "Calls a taloned hunter to your side for the rest of the battle." },
    { id: "houndbond", name: "Houndbond", type: "companion", description: "Calls a loyal hound to fight at your side for the rest of the battle." },
    { id: "beastclawBond", name: "Beastclaw Bond", type: "companion", description: "Calls a clawed beast companion for the rest of the battle." },
    { id: "wardenOfClaws", name: "Warden of Claws", type: "companion", description: "Calls a fierce guardian beast for the rest of the battle." }
  ],
  pathGrove: [
    { id: "grovesBlessing", name: "Grove's Blessing", type: "heal", description: "The grove's quiet strength restores you." }
  ],
  pathStorm: [
    { id: "lightningLash", name: "Lightning Lash", type: "damage", description: "A crack of lightning arcs to your foe." },
    { id: "thunderclap", name: "Thunderclap", type: "damage", description: "A crack of sound and force together." },
    { id: "squallstrike", name: "Squallstrike", type: "damage", description: "A sudden, violent gust." },
    { id: "frostgale", name: "Frostgale", type: "damage", description: "A cold wind that bites like a blade." },
    { id: "stormcall", name: "Stormcall", type: "damage", description: "A small piece of a much larger storm." },
    { id: "windshear", name: "Windshear", type: "damage", description: "A gust sharp enough to cut." }
  ],
  pathBarrow: [
    { id: "graspOfTheDead", name: "Grasp of the Dead", type: "dot", description: "Unseen hands from below drag at your foe, over and over." },
    { id: "barrowsChill", name: "Barrow's Chill", type: "dot", description: "A grave-chill that saps strength over a few rounds." },
    { id: "bonewhisper", name: "Bonewhisper", type: "dot", description: "A whisper from old bones that lingers and gnaws." },
    { id: "gravehand", name: "Gravehand", type: "dot", description: "A hand that shouldn't move, moving again and again." },
    { id: "shroudtouch", name: "Shroudtouch", type: "dot", description: "A touch cold as burial cloth, slow to fade." },
    { id: "wraithcall", name: "Wraithcall", type: "dot", description: "A restless spirit, called to wear your foe down." }
  ]
};
