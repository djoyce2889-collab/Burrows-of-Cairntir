/* ============================================================
   DATA-CHRONICLE.JS
   Character-creation narrative interview. Each answer nudges one
   of 5 hidden stats: spellDamageBonus, healBonus, supportBonus,
   attackBonus (reuses the existing COMBAT_STYLES field), and
   maxHpBonus (new — applied as a flat addition inside
   getHitPoints() in character.js, since no existing field covers
   HP). Values are small flat nudges, summed across all 10
   answers in getChronicleBonuses().
   ------------------------------------------------------------ */

const CHRONICLE_NUDGE = 0.34; // per-answer nudge; needs ~3 consistent answers to round up to a real +1 tier shift
const CHRONICLE_HP_NUDGE = 3; // maxHpBonus uses flat HP points, not a tier-shift fraction like the others

const CHRONICLE_LINEAGES = {
  deveran: [
    { id: "averick", label: "Averick Joss — quiet ones, until the moment they aren't.", stat: "spellDamageBonus" },
    { id: "siuloir", label: "Siuloir MacInnes — the ones who sing the wounded home.", stat: "healBonus" },
    { id: "emyrs", label: "Emyrs MacDonald — wardens, every one, since before the first cairn.", stat: "supportBonus" },
    { id: "alistair", label: "Alistair Fraser — the ones who go strange under a full moon, and won't say why.", stat: "maxHpBonus" }
  ],
  drakvarr: [
    { id: "ivarr", label: "Hold of Ivarr — warriors first, always.", stat: "attackBonus" },
    { id: "sigrun", label: "Hold of Sigrun — seers and scouts.", stat: "spellDamageBonus" },
    { id: "kolgrim", label: "Hold of Kolgrim — the ones outsiders don't ask about.", stat: "supportBonus" }
  ],
  gaeldrim: [
    { id: "fionnbharr", label: "Sept of Fionnbharr — the wild runs in them.", stat: "attackBonus" },
    { id: "brighid", label: "Sept of Bríghid — healers, all the way back.", stat: "healBonus" },
    { id: "neasa", label: "Sept of Neasa — storm-callers.", stat: "spellDamageBonus" },
    { id: "donnacha", label: "Sept of Donnacha — the ones who keep company with what's buried.", stat: "supportBonus" }
  ],
  vandiri: [
    { id: "zuberi", label: "House of Zuberi — guardians, unseen but constant.", stat: "supportBonus" },
    { id: "kwabena", label: "House of Kwabena — the ones who unmake what stands against their people.", stat: "spellDamageBonus" },
    { id: "adaeze", label: "House of Adaeze — thunder given voice.", stat: "attackBonus" }
  ],
  yorenshi: [
    { id: "kurogane", label: "Kurogane-ryū — discipline, honed like a blade.", stat: "attackBonus" },
    { id: "mizuhana", label: "Mizuhana-ryū — the steady hand that holds allies together.", stat: "healBonus" },
    { id: "kitsura", label: "Kitsura-ryū — the ones who change shape, and something else besides.", stat: "spellDamageBonus" },
    { id: "kage", label: "Kage-ryū — the unseen, wards and omens.", stat: "supportBonus" }
  ]
};

const CHRONICLE_LINEAGE_PROMPTS = {
  deveran: "The old wives back home used to look at a bairn's eyes and name the ancestor before the parents did. If they looked at you now, whose blood would they call?",
  drakvarr: "Every hold back home swore your look, your temper, or your hands belonged to one bloodline more than the others. Which did they swear to?",
  gaeldrim: "The septs back home always claimed their own before anyone asked. Which one claimed you?",
  vandiri: "The houses back home could read a child's fate in how they cried, the elders always said. What did they read in you?",
  yorenshi: "Every ryū back home swore a student's true nature shows before their first real fight. What did yours show?"
};

const CHRONICLE_QUESTIONS = {

  q1_origin: {
    prompt: "Before the road to Cairntír, you were {race} — {styleFlavor}. What finally pushed you into the dark below?",
    options: [
      { id: "grief", label: "Someone I couldn't save." },
      { id: "debt", label: "I owe more than I can ever pay honestly." },
      { id: "conviction", label: "There's evil in this world, and someone has to put it down." }
    ]
  },

  q2_followup: {
    grief: {
      prompt: "Do you still carry them with you?",
      options: [
        { id: "still_carry", label: "Every day — it's why I fight for the ones still standing.", stat: "supportBonus" },
        { id: "buried_it", label: "I buried them, and buried the fear with them.", stat: "attackBonus" }
      ]
    },
    debt: {
      prompt: "What happens if you never pay it off?",
      options: [
        { id: "keep_going", label: "Then I keep going. There's no version of stopping.", stat: "attackBonus" },
        { id: "someone_pays", label: "Then someone I care about pays it instead. So I don't stop.", stat: "supportBonus" }
      ]
    },
    conviction: {
      prompt: "Is that still true, now that you've seen what's actually down there?",
      options: [
        { id: "more_than_ever", label: "More than ever. If not me, who?", stat: "attackBonus" },
        { id: "wondering", label: "I'm starting to wonder if I'm fighting evil, or just fighting.", stat: "supportBonus" }
      ]
    }
  },

  q3_race: {
    human: {
      prompt: "You're no different from anyone else down there — no claws, no scales, no magic in your blood. Does that ever worry you?",
      options: [
        { id: "worry_yes", label: "It should. I try not to think about it.", stat: "maxHpBonus" },
        { id: "made_peace", label: "Everyone I've buried had an advantage I don't. I've made peace with the odds.", stat: "attackBonus" }
      ]
    },
    wulver: {
      prompt: "The wolf under your skin — does it serve you, or do you serve it?",
      options: [
        { id: "short_leash", label: "I keep it on a short leash. Barely.", stat: "attackBonus" },
        { id: "kept_alive", label: "It's kept me alive more than it's cost me. I don't fight it anymore.", stat: "maxHpBonus" }
      ]
    },
    sidhe: {
      prompt: "You don't fully belong to this world. Does that make it easier to risk it, or harder?",
      options: [
        { id: "easier", label: "Easier. I've never felt at home here anyway.", stat: "spellDamageBonus" },
        { id: "harder", label: "Harder. I'm still trying to earn a place in it.", stat: "supportBonus" }
      ]
    },
    leopardkin: {
      prompt: "Your people hunt alone, mostly. What made you decide to fight alongside others instead?",
      options: [
        { id: "hard_way", label: "I learned the hard way what alone gets you.", stat: "supportBonus" },
        { id: "no_reason_yet", label: "I haven't decided that. I just haven't found a reason to leave yet.", stat: "attackBonus" }
      ]
    },
    giant: {
      prompt: "You've spent your whole life being the biggest thing in the room. What happens the day you're not?",
      options: [
        { id: "toughest", label: "Then I'll be the toughest thing in the room instead.", stat: "maxHpBonus" },
        { id: "dont_think", label: "I try not to think that far ahead.", stat: "attackBonus" }
      ]
    },
    dragonkin: {
      prompt: "You have no clan behind you — only your own kind, scattered and few. Who do you actually fight for?",
      options: [
        { id: "myself", label: "Myself. I stopped waiting for anyone else to matter.", stat: "spellDamageBonus" },
        { id: "whoevers_beside", label: "Whoever's standing next to me when it counts.", stat: "supportBonus" }
      ]
    },
    alfar: {
      prompt: "Your people are known for patience, not for charging into the dark. What made you the exception?",
      options: [
        { id: "tired_waiting", label: "I got tired of watching and waiting.", stat: "attackBonus" },
        { id: "patient_finisher", label: "Someone has to be patient enough to actually finish what we start.", stat: "healBonus" }
      ]
    },
    dwarf: {
      prompt: "Your people build things meant to outlast them. What are you building, down here?",
      options: [
        { id: "just_survive", label: "Nothing. I'm just trying to survive it.", stat: "maxHpBonus" },
        { id: "a_name", label: "A name worth carving somewhere.", stat: "spellDamageBonus" }
      ]
    }
  },

  q4_weaponSkill: {
    prompt: "In the dark, your hand always finds {weaponSkillName} first, before anything else. Why that, over everything else you know?",
    options: [
      { id: "ends_quickly", label: "Because it ends things quickly.", stat: "attackBonus" },
      { id: "kept_standing", label: "Because it's kept me standing this long.", stat: "maxHpBonus" },
      { id: "trust_it_more", label: "Because I trust it more than I trust myself.", stat: "supportBonus" }
    ],
    // used when equippedWeaponSkill is unarmedCombat with no real weapon trained,
    // i.e. a pure caster/healer/bard build
    noSkillFallback: { id: "no_weapon", label: "I don't. My magic is the only weapon I need.", stat: "spellDamageBonus" }
  },

  q5_magicSkill: {
    prompt: "{magicSkillName}'s power runs through you now. When you call on it, what does it actually feel like?",
    options: [
      { id: "sharp_weapon", label: "Like a weapon. Sharp, and eager to be used.", stat: "spellDamageBonus" },
      { id: "steadying_hand", label: "Like a hand steadying someone who's falling.", stat: "healBonus" },
      { id: "cant_take_back", label: "Something I can't take back once it's done.", stat: "supportBonus" }
    ],
    // used when the character trained no Magic-category skill at all
    noSkillFallback: { id: "no_magic", label: "I don't need it. My own strength has never let me down.", stat: "attackBonus" }
  },

  q6_combatStyle: {
    single: {
      prompt: "One weapon, no shield, nothing to hide behind. Is that confidence, or just what you're used to?",
      options: [
        { id: "confidence", label: "Confidence. I don't need more than this.", stat: "attackBonus" },
        { id: "habit", label: "Habit. I've just never had anything else to rely on.", stat: "maxHpBonus" }
      ]
    },
    dual: {
      prompt: "Two blades, twice the risk. Why not just carry one, like everyone else?",
      options: [
        { id: "end_it_fast", label: "Because ending it fast matters more than ending it safely.", stat: "attackBonus" },
        { id: "never_trusted_one", label: "Because I've never trusted just one thing to get me through.", stat: "maxHpBonus" }
      ]
    },
    swordShield: {
      prompt: "You'd rather take the blow than watch someone else take it.",
      options: [
        { id: "every_time", label: "Every time. That's what the shield is for.", stat: "maxHpBonus" },
        { id: "dont_like_it", label: "Someone has to. Doesn't mean I like it.", stat: "supportBonus" }
      ]
    },
    axeShield: {
      prompt: "Heavier blade, same shield. Why the extra weight?",
      options: [
        { id: "want_it_to_matter", label: "Because when it lands, I want it to matter.", stat: "attackBonus" },
        { id: "end_not_survive", label: "Because I'd rather end a fight than survive a long one.", stat: "attackBonus" }
      ]
    },
    caster: {
      prompt: "Your magic is your weapon. Do you ever wish you had steel to fall back on?",
      options: [
        { id: "never_steel_runs_out", label: "Never. Steel runs out. This doesn't.", stat: "spellDamageBonus" },
        { id: "sometimes_hit_something", label: "Sometimes. There are nights I wish I could just hit something.", stat: "attackBonus" }
      ]
    },
    healer: {
      prompt: "You spend the fight keeping others standing instead of striking. Does that ever frustrate you?",
      options: [
        { id: "still_won", label: "No. A fight I win by keeping everyone alive is still a fight I won.", stat: "healBonus" },
        { id: "not_just_to_watch", label: "Sometimes. I didn't come down here just to watch other people fight my battles.", stat: "supportBonus" }
      ]
    },
    bard: {
      prompt: "Your voice and your presence carry the fight as much as any blade. Do the others know how much they lean on you?",
      options: [
        { id: "dont_think_so", label: "I don't think they do. I've made my peace with that.", stat: "supportBonus" },
        { id: "remind_them", label: "I remind them, when I need to.", stat: "healBonus" }
      ]
    },
    archer: {
      prompt: "You keep your distance. Is that caution, or something else?",
      options: [
        { id: "caution", label: "Caution. The ones who charge in first are usually the ones who don't walk out.", stat: "attackBonus" },
        { id: "something_else", label: "Something else. I've never liked getting close to what I'm about to kill.", stat: "spellDamageBonus" }
      ]
    }
  },

  q7_trait: {
    keenSenses: { prompt: "Keen Senses. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: trained until nothing could surprise me.", stat: "attackBonus" },
        { id: "survived", label: "Survived it: after the one time I didn't see it coming.", stat: "maxHpBonus" }
      ] },
    thickHide: { prompt: "Thick Hide. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: built myself to take a beating and keep moving.", stat: "maxHpBonus" },
        { id: "survived", label: "Survived it: my body just refused to break again.", stat: "attackBonus" }
      ] },
    predatorInstinct: { prompt: "Predator's Instinct. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I learned to finish things before they turn on me.", stat: "attackBonus" },
        { id: "survived", label: "Survived it: I know exactly what dying looks like — I've been that close.", stat: "maxHpBonus" }
      ] },
    faeCunning: { prompt: "Fae Cunning. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I learned exactly what people need to hear.", stat: "supportBonus" },
        { id: "survived", label: "Survived it: talking fast is the only reason I'm still here.", stat: "healBonus" }
      ] },
    adaptable: { prompt: "Adaptable. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I've had to become someone new more than once.", stat: "supportBonus" },
        { id: "survived", label: "Survived it: standing still was never something I could afford.", stat: "spellDamageBonus" }
      ] },
    ironWill: { prompt: "Iron Will. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I decided fear doesn't get to choose for me.", stat: "maxHpBonus" },
        { id: "survived", label: "Survived it: something broke in me once, and what grew back is steadier.", stat: "supportBonus" }
      ] },
    honeyedTongue: { prompt: "Honeyed Tongue. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I learned exactly what people need to hear.", stat: "supportBonus" },
        { id: "survived", label: "Survived it: I learned to talk my way out of things that should've killed me.", stat: "healBonus" }
      ] },
    surefooted: { prompt: "Sure-Footed. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I trained until the ground stopped being able to surprise me.", stat: "attackBonus" },
        { id: "survived", label: "Survived it: I've fallen from worse than any cliff.", stat: "maxHpBonus" }
      ] },
    nightsight: { prompt: "Nightsight. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I taught myself to see what others walk past.", stat: "spellDamageBonus" },
        { id: "survived", label: "Survived it: the dark stopped being something I'm afraid of.", stat: "supportBonus" }
      ] },
    beastkinship: { prompt: "Kinship with Beasts. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I learned to listen before I learned to fight.", stat: "healBonus" },
        { id: "survived", label: "Survived it: an animal trusted me once, when no person would.", stat: "supportBonus" }
      ] },
    quickfooted: { prompt: "Quickfooted. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I trained to never be where the blow lands.", stat: "attackBonus" },
        { id: "survived", label: "Survived it: I've had to outrun more than I've had to outfight.", stat: "maxHpBonus" }
      ] },
    deepWell: { prompt: "Deep Well. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I pushed my own limits until they moved.", stat: "spellDamageBonus" },
        { id: "survived", label: "Survived it: I drew on more than I had left, and it answered anyway.", stat: "healBonus" }
      ] },
    weightedStrike: { prompt: "Weighted Strike. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: I trained until it stopped costing me anything extra.", stat: "attackBonus" },
        { id: "survived", label: "Survived it: I hit harder because I've had to, more than once.", stat: "maxHpBonus" }
      ] },
    arcaneGift: { prompt: "Arcane Gift. That's not something you get by accident — it's something you had to earn, or survive. Which was it?",
      options: [
        { id: "earned", label: "Earned it: years of pushing further than I should have.", stat: "spellDamageBonus" },
        { id: "survived", label: "Survived it: something changed in me, the first time I almost didn't make it back.", stat: "supportBonus" }
      ] }
  },

  q9_fear: {
    prompt: "Cairntír doesn't forgive the unready. What do you fear most, going down there?",
    options: [
      { id: "not_strong_enough", label: "That I won't be strong enough when it matters — and someone else pays for it.", stat: "healBonus" },
      { id: "become_dangerous", label: "That I'll become exactly as dangerous as I need to be, and never find my way back from it.", stat: "attackBonus" },
      { id: "survive_and_carry", label: "That I'll survive it, and still have to live with everything it costs me.", stat: "maxHpBonus" }
    ]
  },

  q10_wildcard: {
    prompt: "The night before you descend, you dream. A door. A voice you don't recognize says three things — you remember only one clearly.",
    // stat mapping shuffled per playthrough by shuffleWildcardStatMap() below — NOT fixed like every other question
    options: [
      { id: "guard", label: "Guard what you love." },
      { id: "strike", label: "Strike first. Always." },
      { id: "dont_know", label: "I don't really know myself yet." }
    ]
  }
};

const CHRONICLE_SUMMARY_LEAD = {
  spellDamageBonus: "You go into the dark trusting your power to strike, before anything else.",
  healBonus: "You go into the dark trusting your hands to mend, before anything else.",
  supportBonus: "You go into the dark trusting your voice and your wits, before anything else.",
  attackBonus: "You go into the dark trusting steel and your own two hands, before anything else.",
  maxHpBonus: "You go into the dark trusting that you'll simply endure, whatever comes."
};

const CHRONICLE_SUMMARY_SECOND = {
  spellDamageBonus: "and a sharpness in your magic that hasn't gone unnoticed.",
  healBonus: "and a steadiness others have already learned to lean on.",
  supportBonus: "and a quiet certainty that words and wards matter as much as blows.",
  attackBonus: "and a willingness to meet whatever comes head-on.",
  maxHpBonus: "and a stubborn refusal to go down easy."
};

function getChronicleSummaryText(bonuses) {
  const entries = Object.keys(bonuses)
    .map((stat) => ({ stat: stat, value: bonuses[stat] }))
    .sort((a, b) => b.value - a.value);

  if (!entries[0] || entries[0].value <= 0) {
    return "You go into the dark still finding out who you are down there.";
  }

  const lead = CHRONICLE_SUMMARY_LEAD[entries[0].stat];
  if (entries[1] && entries[1].value > 0 && entries[1].stat !== entries[0].stat) {
    return `${lead} ${CHRONICLE_SUMMARY_SECOND[entries[1].stat]}`;
  }
  return lead;
}

function shuffleWildcardStatMap() {
  const stats = ["spellDamageBonus", "healBonus", "supportBonus", "attackBonus", "maxHpBonus"];
  const shuffled = [...stats].sort(() => Math.random() - 0.5);
  return {
    guard: shuffled[0],
    strike: shuffled[1],
    dont_know: shuffled[2]
  };
}

/**
 * Sums every recorded Chronicle answer into a flat bonus object.
 * chronicleAnswers is an array of { questionId, optionId, stat } —
 * built up during the creation-flow wizard in main.js.
 * Returns { spellDamageBonus, healBonus, supportBonus, attackBonus, maxHpBonus }.
 */
function getChronicleBonuses(chronicleAnswers) {
  const totals = { spellDamageBonus: 0, healBonus: 0, supportBonus: 0, attackBonus: 0, maxHpBonus: 0 };
  (chronicleAnswers || []).forEach((answer) => {
    if (!answer.stat || totals[answer.stat] === undefined) return;
    totals[answer.stat] += answer.stat === "maxHpBonus" ? CHRONICLE_HP_NUDGE : CHRONICLE_NUDGE;
  });
  return totals;
}
