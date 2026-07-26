/* ============================================================
   MAIN.JS
   ============================================================ */

const SAVE_KEY = "burrowsOfCairntirSave";

const MAX_SAVE_SLOTS = 5;
let currentSaveSlot = null;

const creationState = {
  mode: "player",
  name: "",
  race: null,
  culture: null,
  skills: [],
  traits: [],
  combatStyle: "single",
  portraitImage: null,
  startingSpellIds: [],
  chronicleIndex: 0,
  chronicleAnswers: [],
  chronicleQ1Answer: null,
  chronicleWildcardMap: null
};

const CREATION_STEP_SCREENS = [
  "screen-creation-step1",
  "screen-creation-step3b",
  "screen-creation-step3",
  "screen-creation-step4",
  "screen-creation-step5",
  "screen-creation-chronicle",
  "screen-creation-review"
];

const RACE_TO_CULTURE = {
  alfar: "drakvarr",
  dwarf: "drakvarr",
  wulver: "deveran",
  sidhe: "gaeldrim",
  leopardkin: "vandiri",
  dragonkin: "yorenshi"
};

let selectedDungeonId = null;
let currentDungeonRoomId = null;
let combatReturnRoomId = null;
let selectedDifficulty = "normal";
let craftingCategory = "weapon";
let craftingEnchantSlotPending = null;
let selectedGiveItemName = null;
let voiceEnabled = true;
let musicEnabled = true;
let cachedVoice = null;

const SPECTRAL_COMPANION_IMAGE = "assets/images/effects/spectral-companion.png";
const ATTACK_MISS_SFX = "assets/audio/sfx/attack-miss.mp3";
const HEAL_CAST_SFX = "assets/audio/sfx/heal-cast.mp3";
const ARENA_CROWD_HIT_SFX = "assets/audio/sfx/arena-crowd-hit.mp3";
const ARENA_CROWD_BOO_SFX = "assets/audio/sfx/arena-crowd-boo.mp3";
const ARENA_CROWD_VICTORY_SFX = "assets/audio/sfx/arena-crowd-victory.mp3";
const ARENA_CROWD_AMBIENCE_SRC = "assets/audio/sfx/arena-crowd-ambience.mp3";

let musicVolume = 0.18;

const MAIN_THEME_SRC = "assets/audio/main-theme.mp3";
const TRAINING_GROUNDS_MUSIC_SRC = "assets/audio/training-grounds-theme.mp3";
const gameMusic = new Audio();
gameMusic.loop = true;
gameMusic.volume = musicVolume;

const MUSIC_DUCK_MULTIPLIER = 0.03;

function duckMusicForNarration() {
  gameMusic.volume = musicVolume * MUSIC_DUCK_MULTIPLIER;
}

function restoreMusicVolume() {
  gameMusic.volume = musicVolume;
}

function playMusic(src) {
  if (!src || !musicEnabled) return;
  try {
    if (gameMusic.getAttribute("src") !== src) {
      gameMusic.src = src;
    }
    gameMusic.play().catch(() => {});
  } catch (e) {}
}

const activeSfxInstances = [];

function playSfx(path) {
  if (!path) return;
  try {
    const sfx = new Audio(path);
    sfx.volume = 0.6;
    activeSfxInstances.push(sfx);
    sfx.addEventListener("ended", () => {
      const idx = activeSfxInstances.indexOf(sfx);
      if (idx !== -1) activeSfxInstances.splice(idx, 1);
    });
    sfx.play().catch(() => {});
  } catch (e) {}
}

function stopAllSfx() {
  activeSfxInstances.forEach((sfx) => {
    try {
      sfx.pause();
      sfx.currentTime = 0;
    } catch (e) {}
  });
  activeSfxInstances.length = 0;
}

function playWeaponSfx(skillId) {
  if (skillId === "swords" || skillId === "axes") {
    playSfx("assets/audio/sfx/weapon-slash.mp3");
  }
}

function getElementalAttackSfxPath(spellName) {
  const elementalAttackSfxMap = {
    "Fire Form": "assets/audio/sfx/element-attack-fire.mp3",
    "Earth Form": "assets/audio/sfx/element-attack-earth.mp3",
    "Wind Form": "assets/audio/sfx/element-attack-wind.mp3",
    "Mist Form": "assets/audio/sfx/element-attack-mist.mp3",
    "Beithir Form": "assets/audio/sfx/fetch-attack-beithir.mp3",
    "Cù Sídhe Form": "assets/audio/sfx/fetch-attack-cu-sidhe.mp3",
    "Stag Form": "assets/audio/sfx/fetch-attack-stag.mp3",
    "Nuckelavee Form": "assets/audio/sfx/fetch-attack-nuckelavee.mp3"
  };
  return elementalAttackSfxMap[spellName] || null;
}

function getHitFlashClass(entry) {
  if (["heal", "hot", "groupHeal"].includes(entry.spellType)) return "heal-flash";
  if (entry.actor === "follower" && entry.action === "heal") return "heal-flash";

  const name = (entry.spellName || "").toLowerCase();
  if (/fire|flame|ember|burn|blaze/.test(name)) return "hit-flash-fire";
  if (/frost|ice|chill|freeze|winter/.test(name)) return "hit-flash-ice";
  if (/storm|thunder|lightning|spark|bolt|shock/.test(name)) return "hit-flash-lightning";
  if (/poison|venom|toxin|blight|rot/.test(name)) return "hit-flash-poison";

  if (entry.hit && !entry.spellName && entry.actor === "player") {
    const enchantFlash = getWeaponEnchantHitFlashClass();
    if (enchantFlash) return enchantFlash;
  }

  if (entry.hit && !entry.spellName) return "hit-flash-physical";

  return null;
}

function getSpellSfxPath(spellName) {
  if (!spellName) return null;
  const text = spellName.toLowerCase();
  if (/fire|flame|ember|burn|blaze/.test(text)) return "assets/audio/sfx/fire-cast.mp3";
  if (/frost|ice|chill|freeze|winter/.test(text)) return "assets/audio/sfx/frost-cast.mp3";
  if (/storm|thunder|lightning|spark|bolt|shock/.test(text)) return "assets/audio/sfx/lightning-cast.mp3";
  return null;
}

function getGenericSpellTypeSfxPath(spellType) {
  const typeSfxMap = {
    damage: "assets/audio/sfx/generic-damage-cast.mp3",
    buff: "assets/audio/sfx/generic-buff-cast.mp3",
    debuff: "assets/audio/sfx/generic-debuff-cast.mp3",
    lifetap: "assets/audio/sfx/generic-lifetap-cast.mp3",
    fortify: "assets/audio/sfx/generic-fortify-cast.mp3",
    guard: "assets/audio/sfx/generic-guard-cast.mp3",
    burst: "assets/audio/sfx/generic-burst-cast.mp3",
    execute: "assets/audio/sfx/generic-execute-cast.mp3",
    dot: "assets/audio/sfx/generic-dot-cast.mp3",
    spellDamageBuff: "assets/audio/sfx/generic-spelldamagebuff-cast.mp3",
    acBuff: "assets/audio/sfx/generic-acbuff-cast.mp3",
    dodgeBuff: "assets/audio/sfx/generic-dodgebuff-cast.mp3",
    defenseDebuff: "assets/audio/sfx/generic-defensedebuff-cast.mp3",
    accuracyDebuff: "assets/audio/sfx/generic-accuracydebuff-cast.mp3",
    damageAmpDebuff: "assets/audio/sfx/generic-damageampdebuff-cast.mp3",
    spellLock: "assets/audio/sfx/generic-spelllock-cast.mp3",
    stun: "assets/audio/sfx/generic-stun-cast.mp3",
    fear: "assets/audio/sfx/generic-fear-cast.mp3",
    guaranteedHit: "assets/audio/sfx/generic-guaranteedhit-cast.mp3",
    guaranteedSpellHit: "assets/audio/sfx/generic-guaranteedspellhit-cast.mp3",
    guaranteedDodge: "assets/audio/sfx/generic-guaranteeddodge-cast.mp3",
    guaranteedStun: "assets/audio/sfx/generic-guaranteedstun-cast.mp3",
    guaranteedFollowerAction: "assets/audio/sfx/generic-guaranteedfolloweraction-cast.mp3",
    manaRefund: "assets/audio/sfx/generic-manarefund-cast.mp3",
    absorb: "assets/audio/sfx/generic-absorb-cast.mp3",
    groupAbsorb: "assets/audio/sfx/generic-groupabsorb-cast.mp3",
    resurrect: "assets/audio/sfx/generic-resurrect-cast.mp3",
    autoRevive: "assets/audio/sfx/generic-autorevive-cast.mp3",
    thornward: "assets/audio/sfx/generic-thornward-cast.mp3",
    companion: "assets/audio/sfx/generic-companion-cast.mp3",
    cooldownBuff: "assets/audio/sfx/generic-cooldownbuff-cast.mp3",
    curseBack: "assets/audio/sfx/generic-curseback-cast.mp3",
    buffAndDebuff: "assets/audio/sfx/generic-buffanddebuff-cast.mp3",
    undeadSlayer: "assets/audio/sfx/generic-undeadslayer-cast.mp3",
    powerSteal: "assets/audio/sfx/generic-powersteal-cast.mp3",
    doubleDrain: "assets/audio/sfx/generic-doubledrain-cast.mp3"
  };
  return typeSfxMap[spellType] || null;
}

function getSpellSfxPathWithType(spellName, spellType) {
  return getSpellSfxPath(spellName) || getGenericSpellTypeSfxPath(spellType);
}

function getYokaiTransformSfxPath(spellName) {
  const yokaiSfxMap = {
    "Fire Form": "assets/audio/sfx/element-transform-fire.mp3",
    "Water Form": "assets/audio/sfx/element-transform-water.mp3",
    "Earth Form": "assets/audio/sfx/element-transform-earth.mp3",
    "Wind Form": "assets/audio/sfx/element-transform-wind.mp3",
    "Mist Form": "assets/audio/sfx/element-transform-mist.mp3",
    "Lightning Form": "assets/audio/sfx/element-transform-lightning.mp3"
  };
  return yokaiSfxMap[spellName] || null;
}

function getFetchTransformSfxPath(spellName) {
  const fetchSfxMap = {
    "Beithir Form": "assets/audio/sfx/fetch-transform-beithir.mp3",
    "Baobhan Sìth Form": "assets/audio/sfx/fetch-transform-baobhan-sith.mp3",
    "Cù Sídhe Form": "assets/audio/sfx/fetch-transform-cu-sidhe.mp3",
    "Cat-Sìth Form": "assets/audio/sfx/fetch-transform-cat-sith.mp3",
    "Stag Form": "assets/audio/sfx/fetch-transform-stag.mp3",
    "Nuckelavee Form": "assets/audio/sfx/fetch-transform-nuckelavee.mp3"
  };
  return fetchSfxMap[spellName] || null;
}

function getSongSfxPath(spellName) {
  const songSfxMap = {
    "Lay of Mending": "assets/audio/sfx/song-lay-of-mending.mp3",
    "War-Chant": "assets/audio/sfx/song-war-chant.mp3",
    "Ballad of Vigor": "assets/audio/sfx/song-ballad-of-vigor.mp3",
    "Hymn of Power": "assets/audio/sfx/song-hymn-of-power.mp3",
    "Lute-Song of the Deep Well": "assets/audio/sfx/song-lute-deep-well.mp3",
    "Dirge of Ruin": "assets/audio/sfx/song-dirge-of-ruin.mp3",
    "Biwa of the Deep Current": "assets/audio/sfx/song-biwa-deep-current.mp3",
    "Biwa of the Returning Tide": "assets/audio/sfx/song-biwa-returning-tide.mp3",
    "Taiko of the Storm's Approach": "assets/audio/sfx/song-taiko-storms-approach.mp3",
    "Taiko of the Raging Surf": "assets/audio/sfx/song-taiko-raging-surf.mp3",
    "Shakuhachi of the Wandering Dead": "assets/audio/sfx/song-shakuhachi-wandering-dead.mp3",
    "Shakuhachi of the Hollow Wind": "assets/audio/sfx/song-shakuhachi-hollow-wind.mp3",
    "Skald's Lay of Mending": "assets/audio/sfx/song-skalds-lay-of-mending.mp3",
    "Skald's War-Verse": "assets/audio/sfx/song-skalds-war-verse.mp3",
    "Saga of Vigor": "assets/audio/sfx/song-saga-of-vigor.mp3",
    "Skald's Rune-Hymn": "assets/audio/sfx/song-skalds-rune-hymn.mp3",
    "Talharpa's Deep Drone": "assets/audio/sfx/song-talharpas-deep-drone.mp3",
    "Skald's Curse-Verse": "assets/audio/sfx/song-skalds-curse-verse.mp3",
    "Griot's Healing Refrain": "assets/audio/sfx/song-griots-healing-refrain.mp3",
    "Griot's War-Praise": "assets/audio/sfx/song-griots-war-praise.mp3",
    "Griot's Song of Endurance": "assets/audio/sfx/song-griots-song-of-endurance.mp3",
    "Griot's Rhythm of Power": "assets/audio/sfx/song-griots-rhythm-of-power.mp3",
    "Kalimba's Deep Pulse": "assets/audio/sfx/song-kalimbas-deep-pulse.mp3",
    "Griot's Lament": "assets/audio/sfx/song-griots-lament.mp3"
  };
  return songSfxMap[spellName] || null;
}

function getEnemySoundCategory(enemyId) {
  const enemyTemplate = ENEMIES[enemyId];
  return (enemyTemplate && enemyTemplate.soundCategory) || "physical";
}

function getEnemyHitSfxPath(enemyId) {
  return `assets/audio/sfx/hit-${getEnemySoundCategory(enemyId)}.mp3`;
}

function getEnemyDeathSfxPath(enemyId) {
  return `assets/audio/sfx/death-${getEnemySoundCategory(enemyId)}.mp3`;
}

function getPreferredVoice() {
  if (cachedVoice) return cachedVoice;
  if (!("speechSynthesis" in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const englishVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));
  const pool = englishVoices.length ? englishVoices : voices;

  const ryanVoice = pool.find((v) => /ryan/i.test(v.name));
  const ukVoice = pool.find((v) => v.lang && v.lang.toLowerCase() === "en-gb");
  const naturalVoice = pool.find((v) => /natural/i.test(v.name));

  cachedVoice = ryanVoice || ukVoice || naturalVoice || pool[0];
  return cachedVoice;
}

const narrationAudio = new Audio();
let narrationRequestId = 0;

narrationAudio.addEventListener("ended", restoreMusicVolume);
narrationAudio.addEventListener("pause", restoreMusicVolume);

function stopAllNarration() {
  narrationRequestId += 1;
  try {
    narrationAudio.pause();
    narrationAudio.currentTime = 0;
  } catch (e) {}
  if ("speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
  restoreMusicVolume();
}

function speak(text) {
  return;
  if (!voiceEnabled || !text) return;
  if (!("speechSynthesis" in window)) return;

  const plainText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plainText) return;

  try {
    narrationAudio.pause();
  } catch (e) {}

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(plainText);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = duckMusicForNarration;
    utterance.onend = restoreMusicVolume;
    utterance.onerror = restoreMusicVolume;
    const voice = getPreferredVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  } catch (e) {}
}

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
  };
}

function toKebabCase(str) {
  return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function getNarrationAudioPath(dungeonId, roomId) {
  const imagePath = getRoomImage(dungeonId, roomId);
  if (imagePath) {
    return imagePath.replace("assets/images/", "assets/audio/narration/").replace(/\.png$/, ".mp3");
  }
  return `assets/audio/narration/${toKebabCase(dungeonId)}/${toKebabCase(roomId)}.mp3`;
}

function checkAudioExists(path) {
  return new Promise((resolve) => {
    const testAudio = new Audio();
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };
    testAudio.addEventListener("canplaythrough", () => finish(true), { once: true });
    testAudio.addEventListener("error", () => finish(false), { once: true });
    testAudio.src = path;
    testAudio.load();
    setTimeout(() => finish(false), 4000);
  });
}

function playRoomNarration(dungeonId, roomId, fallbackText) {
  return;
  if (!voiceEnabled) return;

  stopAllNarration();
  const thisRequestId = narrationRequestId;

  const path = getNarrationAudioPath(dungeonId, roomId);

  checkAudioExists(path).then((exists) => {
    if (thisRequestId !== narrationRequestId) return;
    if (!voiceEnabled) return;

    if (exists) {
  try {
    narrationAudio.src = path;
    narrationAudio.volume = 1;
    duckMusicForNarration();
    narrationAudio.play().catch(() => {
      restoreMusicVolume();
      if (thisRequestId === narrationRequestId) speak(fallbackText);
    });
  } catch (e) {
    restoreMusicVolume();
    speak(fallbackText);
  }
} else {
  speak(fallbackText);
}
  });
}

/**
 * ------------------------------------------------------------
 * SAVE / LOAD SYSTEM
 * Persists to localStorage so beta testers keep their progress
 * across visits, without needing any backend. Saves everything
 * needed to resume: player character, followers, inventory,
 * settings, and (when outside combat) the exact room they're
 * in. Deliberately does NOT persist mid-combat state (spell
 * effects, round log, etc.) — restoring a live fight safely is
 * too risky, so if someone leaves mid-battle, on return they
 * resume at the room that led into that fight instead, with
 * everything else fully intact.
 * ------------------------------------------------------------
 */
function getSaveKey(slot) {
  return `burrowsOfCairntirSave_${slot}`;
}

function getAllSaveSummaries() {
  const summaries = [];
  for (let slot = 1; slot <= MAX_SAVE_SLOTS; slot++) {
    try {
      const raw = localStorage.getItem(getSaveKey(slot));
      if (!raw) continue;
      const data = JSON.parse(raw);
      if (data && data.playerCharacter) {
        summaries.push({
          slot: slot,
          name: data.playerCharacter.name,
          raceId: data.playerCharacter.raceId,
          portraitImage: data.playerCharacter.portraitImage
        });
      }
    } catch (e) {}
  }
  return summaries;
}

function saveGameState() {
  if (!playerCharacter || !currentSaveSlot) return;
  try {
    const saveData = {
      playerCharacter: playerCharacter,
      followers: followers,
      selectedDifficulty: selectedDifficulty,
      selectedDungeonId: currentCombat ? null : selectedDungeonId,
      currentDungeonRoomId: currentCombat ? null : currentDungeonRoomId,
      voiceEnabled: voiceEnabled,
      musicEnabled: musicEnabled,
      musicVolume: musicVolume
    };
    localStorage.setItem(getSaveKey(currentSaveSlot), JSON.stringify(saveData));
  } catch (e) {}
}

function loadGameStateFromSlot(slot) {
  try {
    const raw = localStorage.getItem(getSaveKey(slot));
    if (!raw) return false;

    const saveData = JSON.parse(raw);
    if (!saveData || !saveData.playerCharacter) return false;

    playerCharacter = saveData.playerCharacter;
    followers = saveData.followers || [];
    selectedDifficulty = saveData.selectedDifficulty || "normal";
    selectedDungeonId = saveData.selectedDungeonId || null;
    currentDungeonRoomId = saveData.currentDungeonRoomId || null;
    voiceEnabled = saveData.voiceEnabled !== undefined ? saveData.voiceEnabled : true;
    musicEnabled = saveData.musicEnabled !== undefined ? saveData.musicEnabled : true;
    musicVolume = saveData.musicVolume !== undefined ? saveData.musicVolume : 0.18;
    gameMusic.volume = musicVolume;
    currentSaveSlot = slot;

    return true;
  } catch (e) {
    return false;
  }
}

function clearGameStateSlot(slot) {
  try {
    localStorage.removeItem(getSaveKey(slot));
  } catch (e) {}
}

function syncToggleIcons() {
  document.getElementById("btn-toggle-voice").textContent = voiceEnabled ? "\uD83D\uDDE3" : "\uD83D\uDEAB";
  document.getElementById("btn-toggle-music").textContent = musicEnabled ? "\uD83D\uDD0A" : "\uD83D\uDD07";
}

function goToChooseHeroScreen() {
  showScreen("screen-choose-hero");
  renderChooseHeroScreen();
}

function renderChooseHeroScreen() {
  const list = document.getElementById("choose-hero-list");
  list.innerHTML = "";
  const summaries = getAllSaveSummaries();

  summaries.forEach((summary) => {
    const race = RACES[summary.raceId];
    const portraitSrc = summary.portraitImage || (race ? race.image : null);
    const card = document.createElement("div");
    card.className = "cc-card";
    card.innerHTML = `
      ${portraitSrc ? `<img src="${portraitSrc}" class="cc-portrait-thumb" alt="${summary.name}" />` : ""}
      <div class="cc-card-name">${summary.name}</div>
      <div class="cc-card-desc">${race ? race.name : ""}</div>
    `;

    const continueBtn = document.createElement("button");
    continueBtn.className = "follower-remove-btn";
    continueBtn.textContent = "Continue";
    continueBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      continueHeroFromSlot(summary.slot);
    });
    card.appendChild(continueBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "follower-remove-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const confirmed = window.confirm(`Delete ${summary.name}? This cannot be undone.`);
      if (!confirmed) return;
      clearGameStateSlot(summary.slot);
      renderChooseHeroScreen();
    });
    card.appendChild(deleteBtn);

    list.appendChild(card);
  });

  const startNewBtn = document.getElementById("btn-start-new-hero");
  const atLimit = summaries.length >= MAX_SAVE_SLOTS;
  startNewBtn.disabled = atLimit;
  startNewBtn.style.display = atLimit ? "none" : "block";
}

function continueHeroFromSlot(slot) {
  if (!loadGameStateFromSlot(slot)) return;
  syncToggleIcons();
  if (!musicEnabled) {
    gameMusic.pause();
  }
  if (selectedDungeonId && currentDungeonRoomId && DUNGEON_CONTENT[selectedDungeonId]) {
    playMusic(DUNGEONS[selectedDungeonId].musicSrc);
    renderDungeonRoom(currentDungeonRoomId);
  } else {
    goToHomebaseScreen();
  }
}

function beginNewHeroCreation() {
  playMusic(MAIN_THEME_SRC);
  showScreen("screen-title");
}

function confirmDifficultyAndStartCreation() {
  const usedSlots = getAllSaveSummaries().map((s) => s.slot);
  let freeSlot = null;
  for (let slot = 1; slot <= MAX_SAVE_SLOTS; slot++) {
    if (!usedSlots.includes(slot)) {
      freeSlot = slot;
      break;
    }
  }
  if (freeSlot === null) return;

  currentSaveSlot = freeSlot;
  playMusic(MAIN_THEME_SRC);
  resetCreationState("player");
  goToCreationStep(0);
}

function deleteCurrentHero() {
  if (!currentSaveSlot) return;
  const heroName = playerCharacter ? playerCharacter.name : "this hero";
  const confirmed = window.confirm(`Delete ${heroName}? This cannot be undone.`);
  if (!confirmed) return;

  clearGameStateSlot(currentSaveSlot);
  currentSaveSlot = null;
  playerCharacter = null;
  followers = [];
  currentCombat = null;
  selectedDungeonId = null;
  currentDungeonRoomId = null;
  selectedDifficulty = "normal";

  const remaining = getAllSaveSummaries();
  if (remaining.length > 0) {
    goToChooseHeroScreen();
  } else {
    showScreen("screen-title");
  }
}

function setGameViewportImage(src, altText, glow, shake, flash, roomFade) {
  const img = document.getElementById("game-viewport-img");
  const placeholder = document.getElementById("game-viewport-placeholder");
  if (src) {
    img.classList.add("fading-out");
    setTimeout(() => {
      img.src = src;
      img.alt = altText || "";
      img.style.display = "block";
      placeholder.style.display = "none";
      img.classList.remove("fading-out");
    }, 120);
  } else {
    img.style.display = "none";
    placeholder.style.display = "flex";
  }

  img.classList.toggle("companion-glow", !!glow);

  img.classList.remove("hit-shake");
  if (shake) {
    void img.offsetWidth;
    img.classList.add("hit-shake");
  }

  img.classList.remove("spell-flash");
  if (flash) {
    void img.offsetWidth;
    img.classList.add("spell-flash");
  }

  img.classList.remove("room-fade");
  if (roomFade) {
    void img.offsetWidth;
    img.classList.add("room-fade");
  }

  img.classList.remove("victory-pulse");
  img.classList.remove("defeat-fade");
}

function applyAmbientGlows(isEnemyPortrait) {
  const img = document.getElementById("game-viewport-img");
  img.classList.remove(
    "enchant-glow-flame", "enchant-glow-frost", "enchant-glow-storm",
    "enchant-glow-ward", "enchant-glow-curse", "enchant-glow-vision",
    "spectral-glow", "averick-glow"
  );

  if (isEnemyPortrait) {
    const spectralClass = getEnemyAmbientGlowClass();
    if (spectralClass) img.classList.add(spectralClass);
  } else {
    const enchantClass = getEnchantGlowClass();
    if (enchantClass) img.classList.add(enchantClass);

    const averickClass = getAverickGlowClass();
    if (averickClass) img.classList.add(averickClass);
  }
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
  window.scrollTo(0, 0);
}

function getElementFlashClass(spellName, spellType) {
  if (["heal", "hot", "groupHeal"].includes(spellType)) return "element-flash-heal";
  const name = (spellName || "").toLowerCase();
  if (/fire|flame|ember|burn|blaze/.test(name)) return "element-flash-fire";
  if (/frost|ice|chill|freeze|winter/.test(name)) return "element-flash-ice";
  if (/storm|thunder|lightning|spark|bolt|shock/.test(name)) return "element-flash-lightning";
  if (/poison|venom|toxin|blight|rot/.test(name)) return "element-flash-poison";
  return null;
}

const WEAPON_ENCHANT_TYPE_KEY = {
  flame: "fire",
  frost: "ice",
  storm: "lightning",
  curse: "poison"
};

function getWeaponEnchantFlashClass() {
  if (!playerCharacter.weaponEnchantment) return null;
  const key = WEAPON_ENCHANT_TYPE_KEY[playerCharacter.weaponEnchantment.type];
  return key ? `element-flash-${key}` : null;
}

function getWeaponEnchantHitFlashClass() {
  if (!playerCharacter.weaponEnchantment) return null;
  const key = WEAPON_ENCHANT_TYPE_KEY[playerCharacter.weaponEnchantment.type];
  return key ? `hit-flash-enchant-${key}` : null;
}

function addChoiceButton(container, label, onClick, disabled, backgroundImage) {
  const btn = document.createElement("button");
  btn.className = "choice-button";
  if (backgroundImage) {
    btn.classList.add("has-bg-image");
    btn.innerHTML = `
      <span class="choice-button-label">${label}</span>
      <span class="choice-button-image" style="background-image: url('${backgroundImage}')"></span>
    `;
  } else {
    btn.textContent = label;
    btn.style.color = "#ffffff";
    btn.style.textShadow = "0 0 2px rgba(0, 0, 0, 1), 0 0 4px rgba(0, 0, 0, 1), 0 0 6px rgba(0, 0, 0, 1), 0 0 8px rgba(0, 0, 0, 1)";
  }
  if (disabled) {
    btn.disabled = true;
  } else {
    btn.addEventListener("click", onClick);
  }
  container.appendChild(btn);
}

function renderDifficultyGrid() {
  const grid = document.getElementById("difficulty-grid");
  grid.innerHTML = "";
  Object.values(DIFFICULTY_SETTINGS).forEach((diff) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    if (selectedDifficulty === diff.id) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${diff.name}</div>
      <div class="cc-card-desc">${diff.description}</div>
    `;
    card.addEventListener("click", () => {
      selectedDifficulty = diff.id;
      renderDifficultyGrid();
      saveGameState();
    });
    grid.appendChild(card);
  });
}

function renderCombatStyleGrid() {
  const grid = document.getElementById("cc-combatstyle-grid");
  grid.innerHTML = "";
  Object.values(COMBAT_STYLES).forEach((style) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    if (creationState.combatStyle === style.id) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${style.name}</div>
      <div class="cc-card-desc">${style.description}</div>
      <div class="cc-card-image" style="background-image: url('${getCombatStyleImagePath(style.id)}')"></div>
    `;
    card.addEventListener("click", () => {
      creationState.combatStyle = style.id;
      renderCombatStyleGrid();
    });
    grid.appendChild(card);
  });
}

function goToCreationStep(index) {
  showScreen(CREATION_STEP_SCREENS[index]);
  if (CREATION_STEP_SCREENS[index] === "screen-creation-chronicle") {
    creationState.chronicleIndex = 0;
    creationState.chronicleAnswers = [];
    creationState.chronicleQ1Answer = null;
    creationState.chronicleWildcardMap = shuffleWildcardStatMap();
    renderChronicleStep();
  }
  if (CREATION_STEP_SCREENS[index] === "screen-creation-review") {
    renderReviewScreen();
  }
}

const CHRONICLE_STEP_ORDER = [
  "q1_origin", "q2_followup", "q3_race", "q4_weaponSkill", "q5_magicSkill",
  "q6_combatStyle", "q7_trait", "q8_lineage", "q9_fear", "q10_wildcard"
];

function getChronicleWeaponSkillId() {
  return creationState.skills.find((id) => SKILLS[id] && SKILLS[id].category === "Weapon") || null;
}

function getChronicleMagicSkillId() {
  return creationState.skills.find((id) => SKILLS[id] && SKILLS[id].category === "Magic") || null;
}

function getChronicleStatTotalsSoFar() {
  const totals = { spellDamageBonus: 0, healBonus: 0, supportBonus: 0, attackBonus: 0, maxHpBonus: 0 };
  creationState.chronicleAnswers.forEach((a) => {
    if (a.stat && totals[a.stat] !== undefined) totals[a.stat] += 1;
  });
  return totals;
}

function getChronicleTraitToAsk() {
  const eligible = creationState.traits.filter((id) => CHRONICLE_QUESTIONS.q7_trait[id]);
  if (eligible.length === 0) return null;
  const totals = getChronicleStatTotalsSoFar();
  let leadStat = null;
  let leadValue = 0;
  Object.keys(totals).forEach((stat) => {
    if (totals[stat] > leadValue) {
      leadValue = totals[stat];
      leadStat = stat;
    }
  });
  if (leadStat) {
    const match = eligible.find((id) =>
      CHRONICLE_QUESTIONS.q7_trait[id].options.some((opt) => opt.stat === leadStat)
    );
    if (match) return match;
  }
  return eligible[0];
}

function getChronicleMostPickedCulture() {
  const counts = {};
  (creationState.startingSpellIds || []).forEach((spellId) => {
    const skillId = getSkillIdForSpellId(spellId);
    const skill = skillId && SKILLS[skillId];
    if (skill && skill.cultureLocked) {
      counts[skill.cultureLocked] = (counts[skill.cultureLocked] || 0) + 1;
    }
  });
  let best = creationState.culture;
  let bestCount = 0;
  Object.keys(counts).forEach((cultureId) => {
    if (counts[cultureId] > bestCount) {
      bestCount = counts[cultureId];
      best = cultureId;
    }
  });
  return best;
}

function recordChronicleAnswer(questionId, optionId, stat) {
  creationState.chronicleAnswers.push({ questionId: questionId, optionId: optionId, stat: stat || null });
}

function advanceChronicle() {
  creationState.chronicleIndex++;
  if (creationState.chronicleIndex >= CHRONICLE_STEP_ORDER.length) {
    creationState.chronicleBonuses = getChronicleBonuses(creationState.chronicleAnswers);
    renderChronicleSummary();
    return;
  }
  renderChronicleStep();
}

function renderChronicleSummary() {
  const storyEl = document.getElementById("chronicle-story-text");
  const choicesEl = document.getElementById("chronicle-choices");
  storyEl.textContent = getChronicleSummaryText(creationState.chronicleBonuses);
  choicesEl.innerHTML = "";
  addChoiceButton(choicesEl, "Set out", () => {
    goToCreationStep(CREATION_STEP_SCREENS.indexOf("screen-creation-review"));
  });
}

function renderChronicleStep() {
  const storyEl = document.getElementById("chronicle-story-text");
  const choicesEl = document.getElementById("chronicle-choices");
  choicesEl.innerHTML = "";

  const stepKey = CHRONICLE_STEP_ORDER[creationState.chronicleIndex];
  let prompt = "";
  let options = [];

  if (stepKey === "q1_origin") {
    const race = RACES[creationState.race];
    const style = COMBAT_STYLES[creationState.combatStyle];
    prompt = CHRONICLE_QUESTIONS.q1_origin.prompt
      .replace("{race}", race ? race.name : "someone")
      .replace("{styleFlavor}", style ? style.description.toLowerCase() : "someone who gets by");
    options = CHRONICLE_QUESTIONS.q1_origin.options;
  } else if (stepKey === "q2_followup") {
    const branch = CHRONICLE_QUESTIONS.q2_followup[creationState.chronicleQ1Answer];
    prompt = branch.prompt;
    options = branch.options;
  } else if (stepKey === "q3_race") {
    const branch = CHRONICLE_QUESTIONS.q3_race[creationState.race];
    if (!branch) { advanceChronicle(); return; }
    prompt = branch.prompt;
    options = branch.options;
  } else if (stepKey === "q4_weaponSkill") {
    const weaponId = getChronicleWeaponSkillId();
    if (!weaponId) {
      const fb = CHRONICLE_QUESTIONS.q4_weaponSkill.noSkillFallback;
      recordChronicleAnswer(stepKey, fb.id, fb.stat);
      advanceChronicle();
      return;
    }
    prompt = CHRONICLE_QUESTIONS.q4_weaponSkill.prompt.replace("{weaponSkillName}", SKILLS[weaponId].name);
    options = CHRONICLE_QUESTIONS.q4_weaponSkill.options;
  } else if (stepKey === "q5_magicSkill") {
    const magicId = getChronicleMagicSkillId();
    if (!magicId) {
      const fb = CHRONICLE_QUESTIONS.q5_magicSkill.noSkillFallback;
      recordChronicleAnswer(stepKey, fb.id, fb.stat);
      advanceChronicle();
      return;
    }
    prompt = CHRONICLE_QUESTIONS.q5_magicSkill.prompt.replace("{magicSkillName}", SKILLS[magicId].name);
    options = CHRONICLE_QUESTIONS.q5_magicSkill.options;
  } else if (stepKey === "q6_combatStyle") {
    const branch = CHRONICLE_QUESTIONS.q6_combatStyle[creationState.combatStyle];
    if (!branch) { advanceChronicle(); return; }
    prompt = branch.prompt;
    options = branch.options;
  } else if (stepKey === "q7_trait") {
    const traitId = getChronicleTraitToAsk();
    if (!traitId) { advanceChronicle(); return; }
    const branch = CHRONICLE_QUESTIONS.q7_trait[traitId];
    prompt = branch.prompt;
    options = branch.options;
  } else if (stepKey === "q8_lineage") {
    const cultureId = getChronicleMostPickedCulture();
    if (!cultureId || !CHRONICLE_LINEAGES[cultureId]) { advanceChronicle(); return; }
    prompt = CHRONICLE_LINEAGE_PROMPTS[cultureId];
    options = CHRONICLE_LINEAGES[cultureId];
  } else if (stepKey === "q9_fear") {
    prompt = CHRONICLE_QUESTIONS.q9_fear.prompt;
    options = CHRONICLE_QUESTIONS.q9_fear.options;
  } else if (stepKey === "q10_wildcard") {
    prompt = CHRONICLE_QUESTIONS.q10_wildcard.prompt;
    options = CHRONICLE_QUESTIONS.q10_wildcard.options;
  }

  storyEl.textContent = prompt;

  options.forEach((opt) => {
    addChoiceButton(choicesEl, opt.label, () => {
      let stat = opt.stat;
      if (stepKey === "q10_wildcard") {
        stat = creationState.chronicleWildcardMap[opt.id];
      }
      recordChronicleAnswer(stepKey, opt.id, stat);
      if (stepKey === "q1_origin") {
        creationState.chronicleQ1Answer = opt.id;
      }
      advanceChronicle();
    });
  });
}

function resetCreationState(mode) {
  creationState.mode = mode;
  creationState.name = "";
  creationState.race = null;
  creationState.culture = null;
  creationState.skills = [];
  creationState.traits = [];
  creationState.combatStyle = "single";
  creationState.portraitImage = null;
  creationState.startingSpellIds = [];
  document.getElementById("cc-name").value = "";
  document.getElementById("cc-error-step1").textContent = "";
  document.getElementById("cc-error-step3").textContent = "";
  document.getElementById("cc-error-step4").textContent = "";

  renderRaceGrid();
  renderPortraitGrid();
  renderSkillGrid();
  renderStartingSpellsGrid();
  renderTraitGrid();
  renderCombatStyleGrid();
}

function renderRaceGrid() {
  const grid = document.getElementById("cc-race-grid");
  grid.innerHTML = "";

  Object.values(RACES).forEach((race) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    if (creationState.race === race.id) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${race.name}</div>
      <div class="cc-card-desc"><em>${race.origin}</em></div>
      <div class="cc-card-desc">${race.description}</div>
    `;
    card.addEventListener("click", () => {
      if (creationState.race === race.id) return;
      creationState.race = race.id;
      creationState.culture = RACE_TO_CULTURE[race.id] || null;
      creationState.portraitImage = null;
      document.querySelectorAll("#cc-race-grid .cc-card").forEach((c) => {
        c.classList.toggle("selected", c === card);
      });
      renderPortraitGrid();
    });
    grid.appendChild(card);
  });
}

const SKIN_TONE_RACES = ["human", "alfar", "dwarf"];
const SKIN_TONES = [
  { slug: "" },
  { slug: "-tan" },
  { slug: "-brown" }
];

/**
 * Portrait choices are archetype-based (Sword & Shield, Archer,
 * Spellcaster, etc.), shown as race-specific full-set combos —
 * your existing full-set art is the "Fair" tone by default, with
 * Tan/Brown added alongside for skin-tone-eligible races. Any
 * combo you haven't generated yet just quietly doesn't appear
 * (handled by the existing image-existence check). No tone
 * wording ever shows on screen.
 */
const GENDERLESS_RACES = ["dragonkin"];

function buildPortraitOptions(raceId) {
  const options = [];

  if (GENDERLESS_RACES.includes(raceId)) {
    ARCHETYPES.forEach((arch) => {
      options.push({
        path: `assets/images/characters/full-set/${raceId}-${arch.fileSlug}.png`,
        label: arch.name
      });
    });
    return options;
  }

  const tones = SKIN_TONE_RACES.includes(raceId) ? SKIN_TONES : [{ slug: "" }];

  ARCHETYPES.forEach((arch) => {
    tones.forEach((tone) => {
      options.push({
        path: `assets/images/characters/full-set/${raceId}${tone.slug}-male-${arch.fileSlug}.png`,
        label: `${arch.name} (Male)`
      });
      options.push({
        path: `assets/images/characters/full-set/${raceId}${tone.slug}-female-${arch.fileSlug}.png`,
        label: `${arch.name} (Female)`
      });
    });
  });

  return options;
}

function checkImageExists(path) {
  return new Promise((resolve) => {
    const testImg = new Image();
    testImg.onload = () => resolve(true);
    testImg.onerror = () => resolve(false);
    testImg.src = path;
  });
}

async function runWithConcurrencyLimit(taskFns, limit) {
  const results = new Array(taskFns.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < taskFns.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await taskFns[current]();
    }
  }

  const workerCount = Math.min(limit, taskFns.length);
  const workers = [];
  for (let i = 0; i < workerCount; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);
  return results;
}

const IMAGE_CHECK_CONCURRENCY = 4;
const portraitOptionsCache = {};

async function getValidPortraitOptions(raceId) {
  if (portraitOptionsCache[raceId]) return portraitOptionsCache[raceId];

  const candidates = buildPortraitOptions(raceId);
  const taskFns = candidates.map((opt) => async () => ((await checkImageExists(opt.path)) ? opt : null));
  const results = await runWithConcurrencyLimit(taskFns, IMAGE_CHECK_CONCURRENCY);
  const valid = results.filter(Boolean);
  portraitOptionsCache[raceId] = valid;
  return valid;
}

async function prewarmAllPortraitCaches() {
  for (const raceId of Object.keys(RACES)) {
    await getValidPortraitOptions(raceId);
  }
}

async function renderPortraitGrid() {
  const grid = document.getElementById("cc-portrait-grid");
  grid.innerHTML = "";

  if (!creationState.race) return;

  const validOptions = await getValidPortraitOptions(creationState.race);

  validOptions.forEach((opt) => {
    const card = document.createElement("div");
    card.className = "cc-portrait-card";
    card.dataset.portraitPath = opt.path;
    if (creationState.portraitImage === opt.path) card.classList.add("selected");
    card.innerHTML = `
      <img src="${opt.path}" class="cc-portrait-thumb" alt="${opt.label}" />
      <div class="cc-card-desc">${opt.label}</div>
    `;
    card.addEventListener("click", () => {
      selectPortrait(opt.path);
    });
    grid.appendChild(card);
  });
}

function selectPortrait(path) {
  creationState.portraitImage = path;
  document.querySelectorAll("#cc-portrait-grid .cc-portrait-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.portraitPath === path);
  });
}

function renderSkillGrid() {
  const container = document.getElementById("cc-skill-grid");
  const countLabel = document.getElementById("cc-skill-count");
  container.innerHTML = "";

  const availableSkills = Object.values(SKILLS).filter((s) => s.category !== "Magic");

  const nonMagicChosenCount = creationState.skills.filter((id) => SKILLS[id].category !== "Magic").length;
  const atLimit = nonMagicChosenCount >= MAX_STARTING_SKILLS;
  countLabel.textContent = `Chosen ${nonMagicChosenCount} / ${MAX_STARTING_SKILLS}`;
  countLabel.classList.toggle("limit-reached", atLimit);

  function buildSkillCard(skill) {
    const card = document.createElement("div");
    const isSelected = creationState.skills.includes(skill.id);
    card.className = "cc-card";
    if (isSelected) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${skill.name}</div>
      <div class="cc-card-desc">${skill.description}</div>
      <div class="cc-card-image" style="background-image: url('${getSkillImagePath(skill.id)}')"></div>
    `;
    card.addEventListener("click", () => {
      const currentlySelected = creationState.skills.includes(skill.id);
      const currentlyAtLimit = creationState.skills.filter((id) => SKILLS[id].category !== "Magic").length >= MAX_STARTING_SKILLS;
      if (currentlySelected) {
        creationState.skills = creationState.skills.filter((id) => id !== skill.id);
      } else if (!currentlyAtLimit) {
        creationState.skills.push(skill.id);
      } else {
        return;
      }
      const newCount = creationState.skills.filter((id) => SKILLS[id].category !== "Magic").length;
      const newAtLimit = newCount >= MAX_STARTING_SKILLS;
      countLabel.textContent = `Chosen ${newCount} / ${MAX_STARTING_SKILLS}`;
      countLabel.classList.toggle("limit-reached", newAtLimit);
      document.querySelectorAll("#cc-skill-grid .cc-card").forEach((c) => {
        c.classList.toggle("selected", c === card ? !currentlySelected : c.classList.contains("selected"));
      });
    });
    return card;
  }

  SKILL_CATEGORY_ORDER.forEach((categoryName) => {
    if (categoryName === "Magic") return;
    const skillsInCategory = availableSkills.filter((s) => s.category === categoryName);
    if (skillsInCategory.length === 0) return;

    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = categoryName;
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "cc-grid";
    skillsInCategory.forEach((skill) => {
      grid.appendChild(buildSkillCard(skill));
    });
    container.appendChild(grid);
  });
}

/**
 * Adds or removes derived magic skill IDs on creationState.skills
 * to match whatever magic lines are currently represented among
 * the chosen starting spells — magic skills are never picked
 * directly anymore, only implied by which spells you've chosen.
 * Non-magic skills already chosen are left untouched.
 */
function syncDerivedMagicSkills() {
  const impliedSkillIds = new Set();
  creationState.startingSpellIds.forEach((spellId) => {
    const skillId = getSkillIdForSpellId(spellId);
    if (skillId) impliedSkillIds.add(skillId);
  });

  creationState.skills = creationState.skills.filter((id) => {
    const isMagic = SKILLS[id] && SKILLS[id].category === "Magic";
    return !isMagic || impliedSkillIds.has(id);
  });

  impliedSkillIds.forEach((id) => {
    if (!creationState.skills.includes(id)) {
      creationState.skills.push(id);
    }
  });
}

/**
 * Shows every spell across all three cultures' magic lines,
 * with a short description of each culture's magic system up
 * top, so the player can browse and mix-and-match up to 4
 * starting spells with full context — before ever having to
 * pick a magic skill directly. Picking a spell automatically
 * grants its underlying skill line via syncDerivedMagicSkills().
 */
let spellsViewCultureId = null;

function renderStartingSpellsGrid() {
  const container = document.getElementById("cc-spell-grid");
  const countLabel = document.getElementById("cc-spell-count");
  container.innerHTML = "";

  const atLimit = creationState.startingSpellIds.length >= 4;
  countLabel.textContent = `Chosen ${creationState.startingSpellIds.length} / 4`;
  countLabel.classList.toggle("limit-reached", atLimit);

  if (!spellsViewCultureId || !CULTURES[spellsViewCultureId]) {
    spellsViewCultureId = Object.keys(CULTURES)[0];
  }

  const cultureTabsRow = document.createElement("div");
  cultureTabsRow.className = "cc-grid";
  cultureTabsRow.style.marginBottom = "18px";
  Object.values(CULTURES).forEach((culture) => {
    const tabCard = document.createElement("div");
    tabCard.className = "cc-card";
    if (spellsViewCultureId === culture.id) tabCard.classList.add("selected");
    tabCard.style.setProperty("--card-accent", culture.accentColor);
    tabCard.innerHTML = `
      <div class="cc-card-name">${culture.name}</div>
      <div class="cc-card-desc"><em>Click to explore</em></div>
      <div class="cc-card-image" style="background-image: url('../assets/images/cultures/${culture.id}-icon.png')"></div>
    `;
    tabCard.addEventListener("click", () => {
      spellsViewCultureId = culture.id;
      renderStartingSpellsGrid();
    });
    cultureTabsRow.appendChild(tabCard);
  });
  container.appendChild(cultureTabsRow);

  const culture = CULTURES[spellsViewCultureId];

  const cultureHeading = document.createElement("div");
  cultureHeading.className = "cc-category-heading";
  cultureHeading.textContent = `${culture.name} — ${culture.magicName}`;
  container.appendChild(cultureHeading);

  const cultureDesc = document.createElement("div");
  cultureDesc.className = "cc-card-desc";
  cultureDesc.style.marginBottom = "14px";
  cultureDesc.textContent = culture.magicDescription;
  container.appendChild(cultureDesc);

  culture.magicSkillIds.forEach((skillId) => {
    const skill = SKILLS[skillId];
    const allSpells = SPELLS[skillId] || [];
    if (!skill || allSpells.length === 0) return;

   const subHeading = document.createElement("div");
   subHeading.className = "cc-culture-subheading";
   subHeading.style.setProperty("--card-accent", culture.accentColor);
   subHeading.style.color = "#ffffff !important";
   subHeading.innerHTML = `<span style="color: #ffffff !important;">${skill.name}</span>`;
   container.appendChild(subHeading);

    const lineDesc = document.createElement("div");
    lineDesc.className = "cc-card-desc";
    lineDesc.style.marginBottom = "10px";
    lineDesc.textContent = skill.description;
    container.appendChild(lineDesc);

    const grid = document.createElement("div");
    grid.className = "cc-grid";

    allSpells.forEach((spell) => {
      const isSelected = creationState.startingSpellIds.includes(spell.id);
      const card = document.createElement("div");
      card.className = "cc-card";
      if (isSelected) card.classList.add("selected");
      card.style.setProperty("--card-accent", culture.accentColor);
      card.innerHTML = `
        <div class="cc-card-name">${spell.name}</div>
        <div class="cc-card-desc">${spell.description}</div>
        <div class="cc-card-image" style="background-image: url('../assets/images/spells/${culture.id}/${spell.id}.png')"></div>
      `;
      card.addEventListener("click", () => {
        if (isSelected) {
          creationState.startingSpellIds = creationState.startingSpellIds.filter((id) => id !== spell.id);
        } else if (!atLimit) {
          creationState.startingSpellIds.push(spell.id);
        }
        syncDerivedMagicSkills();
        renderStartingSpellsGrid();
        renderSkillGrid();
      });
      grid.appendChild(card);
    });

    container.appendChild(grid);
  });
}

function renderTraitGrid() {
  const grid = document.getElementById("cc-trait-grid");
  const countLabel = document.getElementById("cc-trait-count");
  grid.innerHTML = "";

  const atLimit = creationState.traits.length >= TRAIT_SELECTION_MAX;
  countLabel.textContent = `Chosen ${creationState.traits.length} / ${TRAIT_SELECTION_MAX} (minimum ${TRAIT_SELECTION_MIN})`;
  countLabel.classList.toggle("limit-reached", atLimit);

  Object.values(TRAITS).forEach((trait) => {
    const card = document.createElement("div");
    const isSelected = creationState.traits.includes(trait.id);
    card.className = "cc-card";
    if (isSelected) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${trait.name}</div>
      <div class="cc-card-desc">${trait.description}</div>
      <div class="cc-card-image" style="background-image: url('${getTraitImagePath(trait.id)}')"></div>
    `;

    card.addEventListener("click", () => {
      const currentlySelected = creationState.traits.includes(trait.id);
      const currentlyAtLimit = creationState.traits.length >= TRAIT_SELECTION_MAX;
      if (currentlySelected) {
        creationState.traits = creationState.traits.filter((id) => id !== trait.id);
      } else if (!currentlyAtLimit) {
        creationState.traits.push(trait.id);
      } else {
        return;
      }
      const newAtLimit = creationState.traits.length >= TRAIT_SELECTION_MAX;
      countLabel.textContent = `Chosen ${creationState.traits.length} / ${TRAIT_SELECTION_MAX} (minimum ${TRAIT_SELECTION_MIN})`;
      countLabel.classList.toggle("limit-reached", newAtLimit);
      card.classList.toggle("selected", !currentlySelected);
    });

    grid.appendChild(card);
  });
}

function renderReviewScreen() {
  const container = document.getElementById("review-summary");
  container.innerHTML = "";

  const race = RACES[creationState.race];
  const culture = CULTURES[creationState.culture];
  const style = COMBAT_STYLES[creationState.combatStyle];
  const skillNames = creationState.skills.map((id) => SKILLS[id].name).join(", ") || "None";
  const traitNames = creationState.traits.map((id) => TRAITS[id].name).join(", ") || "None";

  const card = document.createElement("div");
  card.className = "cc-card";
  card.innerHTML = `
    ${creationState.portraitImage ? `<img src="${creationState.portraitImage}" class="cc-portrait-thumb" alt="Portrait" />` : ""}
    <div class="cc-card-name">${creationState.name}</div>
    <div class="cc-card-desc">${race ? race.name : ""}${culture ? ` of the ${culture.name}` : ""}</div>
    <div class="cc-card-desc">Skills: ${skillNames}</div>
    <div class="cc-card-desc">Traits: ${traitNames}</div>
    <div class="cc-card-desc">Combat Style: ${style ? style.name : ""}</div>
  `;
  container.appendChild(card);
}

function attemptConfirmCharacter() {
  const newCharacter = createCharacter(
    creationState.name,
    creationState.race,
    creationState.culture,
    creationState.skills,
    creationState.traits,
    creationState.combatStyle,
    creationState.portraitImage,
    creationState.startingSpellIds,
    creationState.chronicleBonuses
  );

  if (creationState.mode === "player") {
    playerCharacter = newCharacter;
  } else {
    followers.push(newCharacter);
  }

  saveGameState();
  goToPartyScreen();
}

function goToPartyScreen() {
  showScreen("screen-party");
  renderPartyScreen();
}

function renderPartyScreen() {
  const list = document.getElementById("cc-follower-list");
  const statusEl = document.getElementById("cc-follower-status");
  const addBtn = document.getElementById("btn-add-follower");
  list.innerHTML = "";

  followers.forEach((follower, index) => {
    const race = RACES[follower.raceId];
    const culture = CULTURES[follower.cultureId];
    const skillNames = Object.keys(follower.skills).map((id) => SKILLS[id].name).join(", ");
    const traitNames = follower.traits.map((id) => TRAITS[id].name).join(", ");

    const isActive = follower.active !== false;

    const card = document.createElement("div");
    card.className = "cc-card";
    if (culture) card.style.setProperty("--card-accent", culture.accentColor);
    card.innerHTML = `
      <div class="cc-card-name">${follower.name}</div>
      <div class="cc-card-desc">${race.name}${culture ? ` of the ${culture.name}` : ""}</div>
      <div class="cc-card-desc">Skills: ${skillNames}</div>
      <div class="cc-card-desc">Traits: ${traitNames}</div>
      <div class="cc-card-desc"><em>${isActive ? "Traveling with you" : "Left at Homebase"}</em></div>
    `;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "follower-remove-btn";
    toggleBtn.textContent = isActive ? "Leave at Homebase" : "Bring Along";
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      follower.active = !isActive;
      renderPartyScreen();
      saveGameState();
    });
    card.appendChild(toggleBtn);

    const teachBtn = document.createElement("button");
    teachBtn.className = "follower-remove-btn";
    teachBtn.textContent = "Teach a Skill";
    teachBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      goToTeachSkillScreen(index);
    });
    card.appendChild(teachBtn);

    const teachSpellBtn = document.createElement("button");
    teachSpellBtn.className = "follower-remove-btn";
    teachSpellBtn.textContent = "Teach a Spell";
    teachSpellBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      goToTeachSpellScreen(index);
    });
    card.appendChild(teachSpellBtn);

    const hasMagicSkill = Object.keys(follower.skills).some(
      (id) => SKILLS[id] && SKILLS[id].category === "Magic"
    );
    if (hasMagicSkill) {
      const spellsBtn = document.createElement("button");
      spellsBtn.className = "follower-remove-btn";
      spellsBtn.textContent = "Manage Spells";
      spellsBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        goToManageSpellsScreen(follower, true);
      });
      card.appendChild(spellsBtn);
    }

    const removeBtn = document.createElement("button");
    removeBtn.className = "follower-remove-btn";
    removeBtn.textContent = "Disband";
    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const confirmed = window.confirm(`Disband ${follower.name}? This cannot be undone.`);
      if (!confirmed) return;
      followers.splice(index, 1);
      renderPartyScreen();
      saveGameState();
    });
    card.appendChild(removeBtn);

    list.appendChild(card);
  });

  const atLimit = followers.length >= MAX_FOLLOWERS;
  statusEl.textContent = atLimit
    ? `Your party is full (${followers.length} / ${MAX_FOLLOWERS}).`
    : `Followers: ${followers.length} / ${MAX_FOLLOWERS}`;
  addBtn.disabled = atLimit;
  addBtn.style.display = atLimit ? "none" : "block";
}

function goToHomebaseScreen() {
  showScreen("screen-homebase");
  playMusic(MAIN_THEME_SRC);

  resetDungeonCompanionState();

  if (playerCharacter) {
    playerCharacter.currentHP = getHitPoints(playerCharacter);
    refillMana(playerCharacter);
  }
  followers.forEach((follower) => {
    follower.currentHP = getHitPoints(follower);
    refillMana(follower);
  });

  selectedDungeonId = null;
  currentDungeonRoomId = null;
  saveGameState();
}

function getNextTierInfo(timesUsed) {
  for (let i = 0; i < SKILL_TIERS.length; i++) {
    if (timesUsed < SKILL_TIERS[i].min) {
      return { tierName: SKILL_TIERS[i].name, usesNeeded: SKILL_TIERS[i].min - timesUsed };
    }
  }
  return null;
}

function goToSkillsScreen() {
  showScreen("screen-skills");
  renderSkillsScreen();
}

function goToMasteryScreen() {
  showScreen("screen-mastery");
  renderMasteryScreen();
}

function renderMasteryScreen() {
  const list = document.getElementById("mastery-list");
  list.innerHTML = "";

  const trainedSkillIds = Object.keys(playerCharacter.skills).filter((id) => MASTERY_PERKS[id]);

  if (trainedSkillIds.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cc-skill-count";
    empty.textContent = "Nothing trained yet worth mastering.";
    list.appendChild(empty);
    return;
  }

  trainedSkillIds.forEach((skillId) => {
    const points = getMasteryPoints(playerCharacter, skillId);
    const unlockedTier = getUnlockedMasteryTier(points);
    const skillName = SKILLS[skillId] ? SKILLS[skillId].name : skillId;

    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = `${skillName} — ${points} Mastery Point${points === 1 ? "" : "s"}`;
    list.appendChild(heading);

    if (unlockedTier === 0) {
      const locked = document.createElement("div");
      locked.className = "cc-skill-count";
      locked.textContent = "Earn your first Mastery Point (a tier-up, or a new spell learned) to unlock Tier 1.";
      list.appendChild(locked);
      return;
    }

    for (let tier = 1; tier <= unlockedTier; tier++) {
      const tierLabel = document.createElement("div");
      tierLabel.className = "cc-skill-count";
      tierLabel.textContent = `Tier ${tier}`;
      list.appendChild(tierLabel);

      const grid = document.createElement("div");
      grid.className = "cc-grid";

      MASTERY_PERKS[skillId][tier].forEach((perk) => {
        const isChosen = getMasteryPick(playerCharacter, skillId, tier) === perk.id;
        const card = document.createElement("div");
        card.className = "cc-card" + (isChosen ? " selected" : "");
        card.innerHTML = `
          <div class="cc-card-name">${perk.name}</div>
          <div class="cc-card-desc">${perk.description}</div>
        `;
        card.addEventListener("click", () => {
          setMasteryPick(playerCharacter, skillId, tier, perk.id);
          saveGameState();
          renderMasteryScreen();
        });
        grid.appendChild(card);
      });

      list.appendChild(grid);
    }
  });
}

function renderSkillsScreen() {
  const list = document.getElementById("skills-list");
  list.innerHTML = "";

  const partyMembers = [playerCharacter, ...followers];

  partyMembers.forEach((member) => {
    if (!member) return;

    const memberHeading = document.createElement("div");
    memberHeading.className = "cc-category-heading";
    memberHeading.textContent = member.name;
    list.appendChild(memberHeading);

    const trainedSkillIds = Object.keys(member.skills);

    if (trainedSkillIds.length === 0) {
      const empty = document.createElement("div");
      empty.className = "cc-skill-count";
      empty.textContent = "No skills trained yet.";
      list.appendChild(empty);
      return;
    }

    SKILL_CATEGORY_ORDER.forEach((categoryName) => {
      const idsInCategory = trainedSkillIds.filter(
        (id) => SKILLS[id] && SKILLS[id].category === categoryName
      );
      if (idsInCategory.length === 0) return;

      const catLabel = document.createElement("div");
      catLabel.className = "cc-skill-count";
      catLabel.textContent = categoryName;
      list.appendChild(catLabel);

      const grid = document.createElement("div");
      grid.className = "cc-grid";

      idsInCategory.forEach((skillId) => {
        const timesUsed = member.skills[skillId].timesUsed;
        const tier = getCharacterSkillTier(member, skillId);
        const nextTier = getNextTierInfo(timesUsed);

        const card = document.createElement("div");
        card.className = "cc-card";
        card.innerHTML = `
          <div class="cc-card-name">${SKILLS[skillId].name}</div>
          <div class="cc-card-desc"><em>${tier.name}</em> &middot; used ${timesUsed} times</div>
          <div class="cc-card-desc">${nextTier ? `${nextTier.usesNeeded} more uses to reach ${nextTier.tierName}` : "Already at Master."}</div>
          <div class="cc-card-image" style="background-image: url('${getSkillImagePath(skillId)}')"></div>
        `;
        grid.appendChild(card);
      });

      list.appendChild(grid);
    });
  });
}

function goToInventoryScreen() {
  showScreen("screen-inventory");
  renderInventoryScreen();
}

function getOwnedItemsForSkill(skillId) {
  return playerCharacter.inventory.filter((item) => getItemRequiredSkill(item) === skillId);
}

function buildWeaponOrArmorCard(skillId, itemName, isArmor) {
  const card = document.createElement("div");
  card.className = "cc-card";

  const equippedSkillField = isArmor ? "equippedArmorSkill" : "equippedWeaponSkill";
  const equippedItemField = isArmor ? "equippedArmorItemName" : "equippedWeaponItemName";

  const isSelected = itemName
    ? playerCharacter[equippedItemField] === itemName
    : (playerCharacter[equippedSkillField] === skillId && !playerCharacter[equippedItemField]);

  if (isSelected) card.classList.add("selected");
  const itemImage = itemName ? getItemImagePath(itemName) : null;
  card.innerHTML = `
    <div class="cc-card-name">${itemName || SKILLS[skillId].name}</div>
    <div class="cc-card-desc">${isSelected ? "Equipped" : (itemName ? "Click to equip" : "No item — click to use this skill")}</div>
    ${itemImage ? `<div class="cc-card-image" style="background-image: url('${itemImage}')"></div>` : ""}
  `;
  card.addEventListener("click", () => {
    if (isArmor) {
      setEquippedArmor(playerCharacter, skillId);
      playerCharacter.equippedArmorItemName = itemName || null;
    } else {
      setEquippedWeapon(playerCharacter, skillId);
      playerCharacter.equippedWeaponItemName = itemName || null;
    }
    renderEquipSection();
    saveGameState();
  });
  return card;
}

const ARMOR_SLOTS = ["head", "chest", "legs", "gloves", "boots"];
const ARMOR_SLOT_FIELD_NAMES = {
  head: { skill: "equippedHeadSkill", item: "equippedHeadItemName" },
  chest: { skill: "equippedChestSkill", item: "equippedChestItemName" },
  legs: { skill: "equippedLegsSkill", item: "equippedLegsItemName" },
  gloves: { skill: "equippedGlovesSkill", item: "equippedGlovesItemName" },
  boots: { skill: "equippedBootsSkill", item: "equippedBootsItemName" }
};

function getOwnedItemsForSlot(slotName) {
  return playerCharacter.inventory.filter((item) =>
    Object.values(CRAFTING_RECIPES).some((r) => r.slot === slotName && item.startsWith(`${r.name} (`))
  );
}

function buildArmorSlotCard(slotName, itemName) {
  const fields = ARMOR_SLOT_FIELD_NAMES[slotName];
  const recipe = Object.values(CRAFTING_RECIPES).find(
    (r) => r.slot === slotName && itemName.startsWith(`${r.name} (`)
  );
  const isEquipped = playerCharacter[fields.item] === itemName;
  const card = document.createElement("div");
  card.className = "cc-card";
  if (isEquipped) card.classList.add("selected");
  const itemImage = getItemImagePath(itemName);
  card.innerHTML = `
    <div class="cc-card-name">${itemName}</div>
    <div class="cc-card-desc">${isEquipped ? "Equipped" : "Click to equip"}</div>
    ${itemImage ? `<div class="cc-card-image" style="background-image: url('${itemImage}')"></div>` : ""}
  `;
  card.addEventListener("click", () => {
    if (!recipe) return;
    if (!playerCharacter.skills[recipe.linkedSkill]) {
      playerCharacter.skills[recipe.linkedSkill] = { timesUsed: 0 };
    }
    playerCharacter[fields.skill] = recipe.linkedSkill;
    playerCharacter[fields.item] = itemName;
    renderEquipSection();
    saveGameState();
  });
  return card;
}

function renderArmorSlotSection(slotName) {
  const grid = document.getElementById(`equip-${slotName}-grid`);
  grid.innerHTML = "";
  const ownedItems = getOwnedItemsForSlot(slotName);
  if (ownedItems.length === 0) {
    grid.innerHTML = '<div class="cc-skill-count">No items for this slot yet.</div>';
  } else {
    ownedItems.forEach((itemName) => {
      grid.appendChild(buildArmorSlotCard(slotName, itemName));
    });
  }
}

function renderEquipSection() {
  const weaponGrid = document.getElementById("equip-weapon-grid");
  weaponGrid.innerHTML = "";

  const trainedWeaponIds = Object.keys(playerCharacter.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Weapon"
  );
  if (!trainedWeaponIds.includes("unarmedCombat")) {
    trainedWeaponIds.push("unarmedCombat");
  }
  trainedWeaponIds.forEach((skillId) => {
    const ownedItems = getOwnedItemsForSkill(skillId);
    if (ownedItems.length === 0) {
      weaponGrid.appendChild(buildWeaponOrArmorCard(skillId, null, false));
    } else {
      ownedItems.forEach((itemName) => {
        weaponGrid.appendChild(buildWeaponOrArmorCard(skillId, itemName, false));
      });
    }
  });

  ARMOR_SLOTS.forEach((slotName) => renderArmorSlotSection(slotName));

  renderShieldOffhandSections();
}

/**
 * Shield and Offhand equip sections only appear when your
 * chosen combat style actually needs them (Sword/Axe & Shield
 * need a Shield; Dual Wielding needs a second weapon skill).
 * Both must be crafted/trained and then equipped here before
 * their combat style bonus (checked in getPlayerCombatStyleBonus
 * in combat.js) actually applies.
 */
const RING_ITEMS = ["Chief's Signet", "Draugr Rune-Ring"];
const AMULET_ITEMS = [
  "Sovereign's Crown Shard", "Balor's Eye Shard", "Barrow Sigil",
  "Ancestor's Ember", "Frostforged Rune", "Vale Sigil"
];

const TROPHY_DESCRIPTIONS = {
  "Chief's Signet": "A chief's authority lingers in the band — strengthens your resistance to magical harm.",
  "Draugr Rune-Ring": "A dead chieftain's grip still remembers battle — strengthens your physical strikes.",
  "Sovereign's Crown Shard": "A fragment of a king's unshakeable defense — hardens your bearing against harm.",
  "Balor's Eye Shard": "A sliver of the eye that never missed — sharpens your aim.",
  "Barrow Sigil": "A grave-keeper's endurance, pressed into stone — strengthens your vitality.",
  "Ancestor's Ember": "A fire that never quite went out — strengthens your magic.",
  "Frostforged Rune": "A master smith's own touch, one last time — improves your crafting and enchanting.",
  "Vale Sigil": "A fragment of a fused, unified voice — strengthens your ability to persuade."
};

/**
 * Ring and Amulet sections only appear once you actually own a
 * matching boss trophy — clicking one toggles it equipped/
 * unequipped. Unlike Shield/Offhand, these aren't gated by
 * combat style, since any character can wear jewelry.
 */
function renderRingAmuletSections() {
  const ringSection = document.getElementById("equip-ring-section");
  const amuletSection = document.getElementById("equip-amulet-section");
  const ringGrid = document.getElementById("equip-ring-grid");
  const amuletGrid = document.getElementById("equip-amulet-grid");
  ringGrid.innerHTML = "";
  amuletGrid.innerHTML = "";

  const ownedRings = RING_ITEMS.filter((name) => playerCharacter.inventory.includes(name));
  const ownedAmulets = AMULET_ITEMS.filter((name) => playerCharacter.inventory.includes(name));

  ringSection.style.display = ownedRings.length > 0 ? "block" : "none";
  amuletSection.style.display = ownedAmulets.length > 0 ? "block" : "none";

  ownedRings.forEach((name) => {
    const isEquipped = playerCharacter.equippedRing === name;
    const card = document.createElement("div");
    card.className = "cc-card";
    if (isEquipped) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${name}</div>
      <div class="cc-card-desc">${TROPHY_DESCRIPTIONS[name] || ""}</div>
      <div class="cc-card-desc"><em>${isEquipped ? "Equipped" : "Not equipped"}</em></div>
    `;
    card.addEventListener("click", () => {
      playerCharacter.equippedRing = isEquipped ? null : name;
      renderEquipSection();
      saveGameState();
    });
    ringGrid.appendChild(card);
  });

  ownedAmulets.forEach((name) => {
    const isEquipped = playerCharacter.equippedAmulet === name;
    const card = document.createElement("div");
    card.className = "cc-card";
    if (isEquipped) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${name}</div>
      <div class="cc-card-desc">${TROPHY_DESCRIPTIONS[name] || ""}</div>
      <div class="cc-card-desc"><em>${isEquipped ? "Equipped" : "Not equipped"}</em></div>
    `;
    card.addEventListener("click", () => {
      playerCharacter.equippedAmulet = isEquipped ? null : name;
      renderEquipSection();
      saveGameState();
    });
    amuletGrid.appendChild(card);
  });
}

function renderShieldOffhandSections() {
  const shieldSection = document.getElementById("equip-shield-section");
  const offhandSection = document.getElementById("equip-offhand-section");
  const shieldGrid = document.getElementById("equip-shield-grid");
  const offhandGrid = document.getElementById("equip-offhand-grid");
  shieldGrid.innerHTML = "";
  offhandGrid.innerHTML = "";

  const needsShield = playerCharacter.combatStyle === "swordShield" || playerCharacter.combatStyle === "axeShield";
  const needsOffhand = playerCharacter.combatStyle === "dual";

  shieldSection.style.display = needsShield ? "block" : "none";
  offhandSection.style.display = needsOffhand ? "block" : "none";

  if (needsShield) {
    const hasShieldItem = playerCharacter.inventory.some((item) => item.startsWith("Shield ("));
    if (!hasShieldItem) {
      shieldGrid.innerHTML = '<div class="cc-skill-count">Craft a Shield at the forge to equip one.</div>';
    } else {
      const card = document.createElement("div");
      card.className = "cc-card";
      if (playerCharacter.equippedShield) card.classList.add("selected");
      card.innerHTML = `
        <div class="cc-card-name">Shield</div>
        <div class="cc-card-desc">${playerCharacter.equippedShield ? "Equipped" : "Not equipped"}</div>
      `;
      card.addEventListener("click", () => {
        playerCharacter.equippedShield = !playerCharacter.equippedShield;
        renderEquipSection();
        saveGameState();
      });
      shieldGrid.appendChild(card);
    }
  }

  if (needsOffhand) {
    const trainedWeaponIds = Object.keys(playerCharacter.skills).filter(
      (id) => SKILLS[id] && SKILLS[id].category === "Weapon" && id !== playerCharacter.equippedWeaponSkill
    );
    if (trainedWeaponIds.length === 0) {
      offhandGrid.innerHTML = '<div class="cc-skill-count">Train a second weapon skill to dual-wield.</div>';
    } else {
      trainedWeaponIds.forEach((skillId) => {
        const card = document.createElement("div");
        card.className = "cc-card";
        if (playerCharacter.equippedOffhandSkill === skillId) card.classList.add("selected");
        card.innerHTML = `<div class="cc-card-name">${SKILLS[skillId].name}</div>`;
        card.addEventListener("click", () => {
          playerCharacter.equippedOffhandSkill =
            playerCharacter.equippedOffhandSkill === skillId ? null : skillId;
          renderEquipSection();
          saveGameState();
        });
        offhandGrid.appendChild(card);
      });
    }
  }
}

/**
 * Shield and Offhand equip sections only appear when your
 * chosen combat style actually needs them (Sword/Axe & Shield
 * need a Shield; Dual Wielding needs a second weapon skill).
 */
function renderShieldOffhandSections() {
  const shieldSection = document.getElementById("equip-shield-section");
  const offhandSection = document.getElementById("equip-offhand-section");
  const shieldGrid = document.getElementById("equip-shield-grid");
  const offhandGrid = document.getElementById("equip-offhand-grid");
  shieldGrid.innerHTML = "";
  offhandGrid.innerHTML = "";

  const needsShield = playerCharacter.combatStyle === "swordShield" || playerCharacter.combatStyle === "axeShield";
  const needsOffhand = playerCharacter.combatStyle === "dual";

  shieldSection.style.display = needsShield ? "block" : "none";
  offhandSection.style.display = needsOffhand ? "block" : "none";

  if (needsShield) {
    const hasShieldItem = playerCharacter.inventory.some((item) => item.startsWith("Shield ("));
    if (!hasShieldItem) {
      shieldGrid.innerHTML = '<div class="cc-skill-count">Craft a Shield at the forge to equip one.</div>';
    } else {
      const card = document.createElement("div");
      card.className = "cc-card";
      if (playerCharacter.equippedShield) card.classList.add("selected");
      card.innerHTML = `
        <div class="cc-card-name">Shield</div>
        <div class="cc-card-desc">${playerCharacter.equippedShield ? "Equipped" : "Not equipped"}</div>
        <div class="cc-card-image" style="background-image: url('assets/images/items/shield.png')"></div>
      `;
      card.addEventListener("click", () => {
        playerCharacter.equippedShield = !playerCharacter.equippedShield;
        renderEquipSection();
        saveGameState();
      });
      shieldGrid.appendChild(card);
    }
  }

  if (needsOffhand) {
    const trainedWeaponIds = Object.keys(playerCharacter.skills).filter(
      (id) => SKILLS[id] && SKILLS[id].category === "Weapon" && id !== playerCharacter.equippedWeaponSkill
    );
    if (trainedWeaponIds.length === 0) {
      offhandGrid.innerHTML = '<div class="cc-skill-count">Train a second weapon skill to dual-wield.</div>';
    } else {
      trainedWeaponIds.forEach((skillId) => {
        const card = document.createElement("div");
        card.className = "cc-card";
        if (playerCharacter.equippedOffhandSkill === skillId) card.classList.add("selected");
        card.innerHTML = `<div class="cc-card-name">${SKILLS[skillId].name}</div>`;
        card.addEventListener("click", () => {
          playerCharacter.equippedOffhandSkill =
            playerCharacter.equippedOffhandSkill === skillId ? null : skillId;
          renderEquipSection();
          saveGameState();
        });
        offhandGrid.appendChild(card);
      });
    }
  }
}

function renderInventoryScreen() {
  renderEquipSection();

  const list = document.getElementById("inventory-list");
  list.innerHTML = "";

  const inventory = playerCharacter.inventory || [];

  if (inventory.length === 0 && !playerCharacter.weaponEnchantment && !playerCharacter.armorEnchantment) {
    const empty = document.createElement("div");
    empty.className = "cc-skill-count";
    empty.textContent = "Your pack is empty.";
    list.appendChild(empty);
    return;
  }

  const knownMaterials = ["Old Ore", "Hide", "Grave Essence"];
  const materialCounts = {};
  const equipmentCounts = {};

  inventory.forEach((itemName) => {
    if (knownMaterials.includes(itemName)) {
      materialCounts[itemName] = (materialCounts[itemName] || 0) + 1;
      return;
    }
    const requiredSkill = getItemRequiredSkill(itemName);
    const isWeaponOrArmor = requiredSkill && SKILLS[requiredSkill] &&
      (SKILLS[requiredSkill].category === "Weapon" || SKILLS[requiredSkill].category === "Armor");
    if (isWeaponOrArmor) return;
    equipmentCounts[itemName] = (equipmentCounts[itemName] || 0) + 1;
  });

  if (Object.keys(materialCounts).length > 0) {
    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = "Materials";
    list.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "cc-grid";
    Object.keys(materialCounts).forEach((name) => {
      const card = document.createElement("div");
      card.className = "cc-card";
      card.innerHTML = `
        <div class="cc-card-name">${name}</div>
        <div class="cc-card-desc">Quantity: ${materialCounts[name]}</div>
      `;
      grid.appendChild(card);
    });
    list.appendChild(grid);
  }

  if (Object.keys(equipmentCounts).length > 0) {
    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = "Weapons & Armor";
    list.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "cc-grid";
    Object.keys(equipmentCounts).forEach((name) => {
      const count = equipmentCounts[name];
      const requiredSkill = getItemRequiredSkill(name);
      const card = document.createElement("div");
      card.className = "cc-card";
      let isEquipped = false;
      if (requiredSkill) {
        if (SKILLS[requiredSkill].category === "Weapon") {
          isEquipped = playerCharacter.equippedWeaponItemName
            ? playerCharacter.equippedWeaponItemName === name
            : playerCharacter.equippedWeaponSkill === requiredSkill;
        } else if (SKILLS[requiredSkill].category === "Armor") {
          isEquipped = playerCharacter.equippedArmorItemName
            ? playerCharacter.equippedArmorItemName === name
            : playerCharacter.equippedArmorSkill === requiredSkill;
        }
      }
      if (isEquipped) card.classList.add("selected");
      const statusText = isEquipped
        ? "Equipped"
        : (count > 1 ? `Quantity: ${count}` : "Carried");
      const itemImage = getItemImagePath(name);
      card.innerHTML = `
        <div class="cc-card-name">${name}</div>
        <div class="cc-card-desc">${statusText}</div>
        ${itemImage ? `<div class="cc-card-image" style="background-image: url('${itemImage}')"></div>` : ""}
      `;
      if (requiredSkill) {
        card.addEventListener("click", () => {
          if (!playerCharacter.skills[requiredSkill]) {
            playerCharacter.skills[requiredSkill] = { timesUsed: 0 };
          }
          if (SKILLS[requiredSkill].category === "Weapon") {
            setEquippedWeapon(playerCharacter, requiredSkill);
            playerCharacter.equippedWeaponItemName = name;
          } else if (SKILLS[requiredSkill].category === "Armor") {
            setEquippedArmor(playerCharacter, requiredSkill);
            playerCharacter.equippedArmorItemName = name;
          }
          renderInventoryScreen();
          saveGameState();
        });
      } else if (name.startsWith("Shield (")) {
        card.addEventListener("click", () => {
          playerCharacter.equippedShield = !playerCharacter.equippedShield;
          renderInventoryScreen();
          saveGameState();
        });
      }
      grid.appendChild(card);
    });
    list.appendChild(grid);
  }

  if (playerCharacter.weaponEnchantment || playerCharacter.armorEnchantment) {
    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = "Active Enchantments";
    list.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "cc-grid";

    if (playerCharacter.weaponEnchantment) {
      const card = document.createElement("div");
      card.className = "cc-card";
      card.innerHTML = `
        <div class="cc-card-name">Weapon</div>
        <div class="cc-card-desc">${playerCharacter.weaponEnchantment.name}-Enchanted</div>
      `;
      grid.appendChild(card);
    }

    if (playerCharacter.armorEnchantment) {
      const card = document.createElement("div");
      card.className = "cc-card";
      card.innerHTML = `
        <div class="cc-card-name">Armor</div>
        <div class="cc-card-desc">${playerCharacter.armorEnchantment.name}-Enchanted</div>
      `;
      grid.appendChild(card);
    }

    list.appendChild(grid);
  }

  const style = COMBAT_STYLES[playerCharacter.combatStyle];
  if (style) {
    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = "Combat Style";
    list.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "cc-grid";
    const card = document.createElement("div");
    card.className = "cc-card";
    card.innerHTML = `
      <div class="cc-card-name">${style.name}</div>
      <div class="cc-card-desc">${style.description}</div>
      <div class="cc-card-image" style="background-image: url('${getCombatStyleImagePath(style.id)}')"></div>
    `;
    grid.appendChild(card);
    list.appendChild(grid);
  }
}

const REGION_MAPS = {
  deveran: "assets/images/deveran-map.png",
  drakvarr: "assets/images/drakvarr-map.png",
  gaeldrim: "assets/images/gaeldrim-map.png",
  vandiri: "assets/images/vandiri-map.png",
  yorenshi: "assets/images/yorenshi-map.png"
};

let dungeonSelectRegionId = null;

function goToDungeonSelectScreen() {
  showScreen("screen-dungeon-select");
  renderDungeonList();
}

let pendingDungeon = null;

function selectDungeon(dungeon) {
  pendingDungeon = dungeon;
  showScreen("screen-dungeon-difficulty");
  renderDungeonDifficultyScreen();
}

function renderDungeonDifficultyScreen() {
  document.getElementById("dungeon-difficulty-name").textContent = pendingDungeon.name;
  document.getElementById("dungeon-difficulty-desc").textContent = "Choose your difficulty for this dungeon.";

  const grid = document.getElementById("dungeon-difficulty-grid");
  grid.innerHTML = "";

  Object.values(DIFFICULTY_SETTINGS).forEach((diff) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    if (selectedDifficulty === diff.id) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${diff.name}</div>
      <div class="cc-card-desc">${diff.description}</div>
    `;
    card.addEventListener("click", () => {
      selectedDifficulty = diff.id;
      saveGameState();
      renderDungeonDifficultyScreen();
    });
    grid.appendChild(card);
  });
}

function confirmEnterDungeon() {
  selectedDungeonId = pendingDungeon.id;
  resetDungeonCompanionState();
  if (DUNGEON_CONTENT[pendingDungeon.id]) {
    enterDungeon(pendingDungeon.id);
  } else {
    enterPlaceholderDungeon(pendingDungeon);
  }
}

function goToTrainingDifficultyScreen() {
  showScreen("screen-training-difficulty");
  playMusic(TRAINING_GROUNDS_MUSIC_SRC);
  renderTrainingDifficultyScreen();
}

let inTrainingGrounds = false;
let trainingGroundsDefeatCount = 0;

/**
 * Every enemy you've ever encountered across all dungeons is
 * fair game — pulled fresh from ENEMIES each fight, so as you
 * unlock more dungeons over time, the pool naturally grows too.
 */
/**
 * Boss enemy IDs are pulled dynamically from every dungeon's
 * bossRoom, rather than hardcoded — so this stays correct
 * automatically as new dungeons (and new bosses) get added later,
 * with nothing to remember to update here.
 */
function getBossEnemyIds() {
  const bossIds = new Set();
  Object.values(DUNGEON_CONTENT).forEach((dungeonData) => {
    const bossRoom = dungeonData.rooms && dungeonData.rooms.bossRoom;
    if (!bossRoom) return;
    bossRoom.choices.forEach((choice) => {
      if (choice.type === "combat") bossIds.add(choice.enemyId);
    });
  });
  return bossIds;
}

const TRAINING_GROUNDS_ENEMY_IDS = ["arenaMinotaur", "arenaWyvern", "arenaDirewolf", "arenaTroll", "arenaBasilisk"];

function pickRandomTrainingEnemy() {
  return TRAINING_GROUNDS_ENEMY_IDS[Math.floor(Math.random() * TRAINING_GROUNDS_ENEMY_IDS.length)];
}

function startTrainingGauntlet() {
  inTrainingGrounds = true;
  trainingGroundsDefeatCount = 0;
  combatReturnRoomId = null;
  const enemyId = pickRandomTrainingEnemy();
  showScreen("screen-game");
  startCombat(enemyId);
  setGameViewportImage(ENEMIES[enemyId].image, ENEMIES[enemyId].name);
  applyAmbientGlows(true);
  stopAllNarration();
  playMusic(ARENA_CROWD_AMBIENCE_SRC);
  renderCombatScreen();
  saveGameState();
}

function continueTrainingGauntlet() {
  trainingGroundsDefeatCount += 1;
  const enemyId = pickRandomTrainingEnemy();
  startCombat(enemyId);
  setGameViewportImage(ENEMIES[enemyId].image, ENEMIES[enemyId].name);
  applyAmbientGlows(true);
  renderCombatScreen();
  saveGameState();
}

function leaveTrainingGrounds() {
  inTrainingGrounds = false;
  currentCombat = null;
  goToHomebaseScreen();
}

function renderTrainingDifficultyScreen() {
  const grid = document.getElementById("training-difficulty-grid");
  grid.innerHTML = "";

  Object.values(DIFFICULTY_SETTINGS).forEach((diff) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    if (selectedDifficulty === diff.id) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${diff.name}</div>
      <div class="cc-card-desc">${diff.description}</div>
    `;
    card.addEventListener("click", () => {
      selectedDifficulty = diff.id;
      saveGameState();
      renderTrainingDifficultyScreen();
    });
    grid.appendChild(card);
  });
}

function renderDungeonList() {
  const tabsContainer = document.getElementById("region-tabs-grid");
  const list = document.getElementById("dungeon-list");
  tabsContainer.innerHTML = "";
  list.innerHTML = "";

  const regionIds = Object.keys(REGION_MAPS);
  if (!dungeonSelectRegionId || !regionIds.includes(dungeonSelectRegionId)) {
    dungeonSelectRegionId = regionIds[0];
  }

  regionIds.forEach((cultureId) => {
    const culture = CULTURES[cultureId];
    const tabCard = document.createElement("div");
    tabCard.className = "cc-card";
    if (dungeonSelectRegionId === cultureId) tabCard.classList.add("selected");
    tabCard.style.setProperty("--card-accent", culture.accentColor);
    tabCard.innerHTML = `<div class="cc-card-name">${culture.name}</div>`;
    tabCard.addEventListener("click", () => {
      dungeonSelectRegionId = cultureId;
      renderDungeonList();
    });
    tabsContainer.appendChild(tabCard);
  });

  const regionDungeons = Object.values(DUNGEONS).filter((d) => d.culture === dungeonSelectRegionId);

  regionDungeons.forEach((dungeon) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    card.style.setProperty("--card-accent", dungeon.hotspotColor || "var(--ember)");
    card.innerHTML = `
      <div class="cc-card-name">${dungeon.name}</div>
      <div class="cc-card-desc">${dungeon.description}</div>
      <div class="cc-card-image" style="background-image: url('${dungeon.image}')"></div>
    `;
    card.addEventListener("click", () => selectDungeon(dungeon));
    list.appendChild(card);
  });
}

function enterPlaceholderDungeon(dungeon) {
  showScreen("screen-game");
  setGameViewportImage(dungeon.image, dungeon.name);
  document.getElementById("game-story-text").innerHTML = `
    <strong>${dungeon.name}</strong><br />
    ${dungeon.description}<br /><br />
    This descent hasn't been charted yet.
  `;
  const choicesEl = document.getElementById("game-choices");
  choicesEl.innerHTML = "";
  addChoiceButton(choicesEl, "Return to Homebase", () => goToHomebaseScreen());
}

function enterDungeon(dungeonId) {
  const dungeonData = DUNGEON_CONTENT[dungeonId];
  playMusic(DUNGEONS[dungeonId].musicSrc);
  renderDungeonRoom(dungeonData.startRoomId);
}

function getManaStatusLine() {
  const manaMax = getManaPoolMax(playerCharacter);
  if (manaMax <= 0) return "";
  return `Mana: ${playerCharacter.currentMana} / ${manaMax}`;
}

function getAttemptLabel(choice) {
  let label = choice.label;
  if ((choice.type === "discover" || choice.type === "persuade") && choice.spellId) {
    const skillSpells = SPELLS[choice.skillId] || [];
    const spell = skillSpells.find((s) => s.id === choice.spellId);
    if (spell) label = label.replace(/\([^)]*\)$/, `(${spell.name})`);
  }

  const used = choice._attempts || 0;
  if (used > 0 && used < 3) {
    const remaining = 3 - used;
    return `${label} (${remaining} ${remaining === 1 ? "try" : "tries"} left)`;
  }
  return label;
}

function attemptDiscoverOrLearn(room, choice) {
  choice._attempts = (choice._attempts || 0) + 1;

  let tierName;
  let difficulty;
  let adjustment = 0;
  if (choice.type === "discover") {
    tierName = getCharacterSkillTier(playerCharacter, choice.skillId).name;
    difficulty = "Adept";
  } else if (choice.type === "persuade") {
    tierName = getCharacterSkillTier(playerCharacter, "persuasion").name;
    difficulty = "Adept";
    if (playerCharacter.traits && playerCharacter.traits.includes("honeyedTongue")) {
      adjustment = 0.15;
    }
  } else {
    tierName = "Untrained";
    difficulty = "Novice";
  }

  const success = rollSuccess(tierName, difficulty, adjustment);

  if (success) {
    let message;
    if (choice.type === "discover" || choice.type === "persuade") {
      if (!playerCharacter.skills[choice.skillId]) {
        playerCharacter.skills[choice.skillId] = { timesUsed: 0 };
      }
      const spell = discoverSpell(playerCharacter, choice.skillId, choice.spellId);
      if (spell && (playerCharacter.activeSpellIds || []).length < 4) {
        toggleActiveSpell(playerCharacter, spell.id);
      }
      message = spell
        ? choice.type === "persuade"
          ? `Your words finally land — you have learned ${spell.name}.`
          : `After several attempts, it finally clicks — you have learned ${spell.name}.`
        : "You already know what they have to teach.";
    } else {
      learnNewSkill(playerCharacter, choice.skillId);
      message = `After several attempts, it finally clicks — you have learned ${SKILLS[choice.skillId].name}.`;
    }
    saveGameState();
    renderDiscoveryOutcome(message, choice.target);
    return;
  }

  if (choice._attempts >= 3) {
    if (choice.type === "persuade" && choice.enemyId) {
      const message = choice.finalFailDialogue
        ? `${choice.finalFailDialogue} They won't be reasoned with any further.`
        : "After three failed attempts, they refuse to be swayed any further.";
      document.getElementById("game-story-text").innerHTML = message;
      const choicesEl = document.getElementById("game-choices");
      choicesEl.innerHTML = "";
      addChoiceButton(choicesEl, "Fight", () => {
        goToCombatScreen(choice.enemyId, choice.target);
      });
      return;
    }

    let message;
    if (choice.type === "discover") {
      message = "After three failed attempts, the technique still eludes you. You give up for now and move on.";
    } else if (choice.type === "persuade") {
      message = choice.finalFailDialogue
        ? `${choice.finalFailDialogue} You give up for now and move on.`
        : "After three failed attempts, they refuse to be swayed any further. You give up for now and move on.";
    } else {
      message = "After three failed attempts, it still doesn't click. You give up for now and move on.";
    }
    renderDiscoveryOutcome(message, choice.target);
    return;
  }

  const remaining = 3 - choice._attempts;
  let failMessage;
  if (choice.type === "persuade") {
    const dialogueLine = choice.failDialogue && choice.failDialogue[choice._attempts - 1];
    const baseLine = dialogueLine || "They aren't convinced yet.";
    failMessage = `${baseLine} (${remaining} ${remaining === 1 ? "attempt" : "attempts"} left.)`;
  } else {
    failMessage = `You fail to grasp it this time. (${remaining} ${remaining === 1 ? "attempt" : "attempts"} left.)`;
  }
  document.getElementById("game-story-text").innerHTML = `${room.text}<br /><br /><em>${failMessage}</em>`;
  buildRoomChoices(room);
}

function renderDiscoveryOutcome(message, targetRoomId) {
  const storyEl = document.getElementById("game-story-text");
  const choicesEl = document.getElementById("game-choices");
  storyEl.innerHTML = message;
  choicesEl.innerHTML = "";
  addChoiceButton(choicesEl, "Continue", () => renderDungeonRoom(targetRoomId));
}

function buildRoomChoices(room) {
  const choicesEl = document.getElementById("game-choices");
  choicesEl.innerHTML = "";

  room.choices.forEach((choice) => {
    if (choice.type === "goto") {
      addChoiceButton(choicesEl, choice.label, () => renderDungeonRoom(choice.target));
    } else if (choice.type === "check") {
      addChoiceButton(choicesEl, choice.label, () => {
        const tierBeforeName = getCharacterSkillTier(playerCharacter, choice.skillId).name;
        useSkill(playerCharacter, choice.skillId);
        const hasSureFooted = choice.skillId === "survival" &&
          playerCharacter.traits && playerCharacter.traits.includes("surefooted");
        const hasHoneyedTongue = choice.skillId === "persuasion" &&
          playerCharacter.traits && playerCharacter.traits.includes("honeyedTongue");
        const bonus = (hasSureFooted || hasHoneyedTongue) ? 0.15 : 0;
        const success = rollSuccess(tierBeforeName, choice.difficulty, bonus);
        renderDungeonRoom(success ? choice.successTarget : choice.failureTarget);
      });
    } else if (choice.type === "combat") {
      addChoiceButton(choicesEl, choice.label, () => {
        goToCombatScreen(choice.enemyId, choice.target);
      });
    } else if (choice.type === "discover" || choice.type === "learnSkill" || choice.type === "persuade") {
      addChoiceButton(choicesEl, getAttemptLabel(choice), () => attemptDiscoverOrLearn(room, choice));
    } else if (choice.type === "end") {
      addChoiceButton(choicesEl, choice.label, () => {
        goToHomebaseScreen();
      });
    }
  });

  if (room.choices.every((c) => c.type !== "end")) {
    addChoiceButton(choicesEl, "Return to Homebase", () => {
      const storyEl = document.getElementById("game-story-text");
      const confirmChoicesEl = document.getElementById("game-choices");
      storyEl.innerHTML = "Leave the dungeon and return to Homebase? Your progress in this room is saved, but you'll need to make your way back in to continue.";
      confirmChoicesEl.innerHTML = "";
      addChoiceButton(confirmChoicesEl, "Yes, return to Homebase", () => goToHomebaseScreen());
      addChoiceButton(confirmChoicesEl, "No, stay here", () => renderDungeonRoom(currentDungeonRoomId));
    });
  }
}

function renderDiscoveryOutcome(message, targetRoomId) {
  const storyEl = document.getElementById("game-story-text");
  const choicesEl = document.getElementById("game-choices");
  storyEl.innerHTML = message;
  choicesEl.innerHTML = "";
  addChoiceButton(choicesEl, "Continue", () => renderDungeonRoom(targetRoomId));
}

function renderDungeonRoom(roomId) {
  const dungeonData = DUNGEON_CONTENT[selectedDungeonId];
  const room = dungeonData.rooms[roomId];
  currentDungeonRoomId = roomId;

  showScreen("screen-game");
  setGameViewportImage(getRoomImage(selectedDungeonId, roomId), DUNGEONS[selectedDungeonId].name, false, false, false, true);

  let text = room.text;
  if (room.loot && !room._lootGranted) {
    const BOOSTED_MATERIALS = ["Old Ore", "Grave Essence"];
    room.loot.forEach((itemName) => {
      playerCharacter.inventory.push(itemName);
      if (BOOSTED_MATERIALS.includes(itemName)) {
        playerCharacter.inventory.push(itemName);
      }
    });
    text += `<br /><br />You find: ${room.loot.join(", ")}.`;
    room._lootGranted = true;
  }

  playRoomNarration(selectedDungeonId, roomId, room.text);

  const maxHP = getHitPoints(playerCharacter);
  const hpLine = `Hit Points: ${playerCharacter.currentHP} / ${maxHP}`;
  const manaLine = getManaStatusLine();
  text += `<br /><br />${hpLine}`;
  if (manaLine) text += `<br />${manaLine}`;

  document.getElementById("game-story-text").innerHTML = text;

  buildRoomChoices(room);
  saveGameState();
}

function goToCombatScreen(enemyId, returnRoomId) {
  combatReturnRoomId = returnRoomId || null;
  showScreen("screen-game");
  startCombat(enemyId);

  const enemyTemplate = ENEMIES[enemyId];
  setGameViewportImage(enemyTemplate.image, enemyTemplate.name);
  applyAmbientGlows(true);
  stopAllNarration();

  renderCombatScreen();
  saveGameState();
}

function getFollowerStatusLine() {
  const activeFollowers = getActiveFollowers();
  if (!activeFollowers || activeFollowers.length === 0) return "";
  return activeFollowers
    .map((f) => {
      const max = getHitPoints(f);
      const cur = f.currentHP !== undefined ? f.currentHP : max;
      return cur <= 0 ? `${f.name}: downed` : `${f.name}: ${cur} / ${max} HP`;
    })
    .join(" &middot; ");
}

function getEquipmentStatusLine() {
  const parts = [];
  if (playerCharacter.weaponEnchantment) parts.push(`Weapon: ${playerCharacter.weaponEnchantment.name}-Enchanted`);
  if (playerCharacter.armorEnchantment) parts.push(`Armor: ${playerCharacter.armorEnchantment.name}-Enchanted`);
  const style = COMBAT_STYLES[playerCharacter.combatStyle];
  if (style && style.id !== "single") parts.push(`Style: ${style.name}`);
  return parts.join(" &middot; ");
}

function getHealthBarHTML(current, max) {
  const safeMax = max > 0 ? max : 1;
  const safeCurrent = Math.max(0, current);
  const pct = Math.max(0, Math.min(100, Math.round((safeCurrent / safeMax) * 100)));

  let fillClass = "hp-fill-high";
  if (pct <= 25) fillClass = "hp-fill-low";
  else if (pct <= 60) fillClass = "hp-fill-mid";

  const pulseClass = pct <= 25 ? "hp-pulse" : "";

  return `
    <div class="health-bar">
      <div class="health-bar-fill ${fillClass} ${pulseClass}" style="width: ${pct}%;"></div>
      <div class="health-bar-label">${safeCurrent} / ${max}</div>
    </div>
  `;
}

function getManaBarHTML(current, max) {
  const safeMax = max > 0 ? max : 1;
  const safeCurrent = Math.max(0, current);
  const pct = Math.max(0, Math.min(100, Math.round((safeCurrent / safeMax) * 100)));

  return `
    <div class="mana-bar">
      <div class="mana-bar-fill" style="width: ${pct}%;"></div>
      <div class="mana-bar-label">${safeCurrent} / ${max}</div>
    </div>
  `;
}

function getEnchantGlowClass() {
  if (!playerCharacter.weaponEnchantment) return "";
  return `enchant-glow-${playerCharacter.weaponEnchantment.type}`;
}

function getAverickGlowClass() {
  if (!currentCombat) return "";
  const hasAverickBuff = currentCombat.activeEffects.some(
    (e) => e.kind === "playerAttackBonus" && e.skillId === "ancestralAverick"
  );
  return hasAverickBuff ? "averick-glow" : "";
}

function getEnemyAmbientGlowClass() {
  if (!currentCombat) return "";
  const enemyTemplate = ENEMIES[currentCombat.enemyId];
  if (enemyTemplate && enemyTemplate.soundCategory === "spectral") {
    return "spectral-glow";
  }
  return "";
}

const YOKAI_FORM_IMAGES = {
  "Fire Form": "assets/images/effects/element-fire.png",
  "Water Form": "assets/images/effects/element-water.png",
  "Earth Form": "assets/images/effects/element-earth.png",
  "Wind Form": "assets/images/effects/element-wind.png",
  "Mist Form": "assets/images/effects/element-mist.png",
  "Lightning Form": "assets/images/effects/element-lightning.png"
};

const FETCH_FORM_IMAGES = {
  "Beithir Form": "assets/images/effects/beithir-form.png",
  "Baobhan Sìth Form": "assets/images/effects/baobhan-sith-form.png",
  "Cù Sídhe Form": "assets/images/effects/cu-sidhe-form.png",
  "Cat-Sìth Form": "assets/images/effects/cat-sith-form.png",
  "Stag Form": "assets/images/effects/stag-form.png",
  "Nuckelavee Form": "assets/images/effects/nuckelavee-form.png"
};

function getActorImageForLogEntry(entry) {
  if (entry.actor === "enemy") {
    const enemyTemplate = ENEMIES[currentCombat.enemyId];
    return enemyTemplate ? enemyTemplate.image : null;
  }
  if (entry.actor === "effect" && entry.kind === "companion") {
    return SPECTRAL_COMPANION_IMAGE;
  }
  if (entry.actor === "follower" && entry.followerName) {
    const follower = followers.find((f) => f.name === entry.followerName);
    if (follower) {
      const activeYokaiForm = currentCombat.activeEffects.find((e) => e.kind === "yokaiForm" && e.owner === follower);
    if (activeYokaiForm && YOKAI_FORM_IMAGES[activeYokaiForm.spellName]) {
      return YOKAI_FORM_IMAGES[activeYokaiForm.spellName];
    }
    const activeFetchForm = currentCombat.activeEffects.find((e) => e.kind === "fetchForm" && e.owner === follower);
    if (activeFetchForm && FETCH_FORM_IMAGES[activeFetchForm.spellName]) {
      return FETCH_FORM_IMAGES[activeFetchForm.spellName];
    }
    return follower.portraitImage || (RACES[follower.raceId] ? RACES[follower.raceId].image : null);
    }
  }
  if (entry.actor === "player") {
    const activeYokaiForm = currentCombat.activeEffects.find((e) => e.kind === "yokaiForm" && !e.owner);
    if (activeYokaiForm && YOKAI_FORM_IMAGES[activeYokaiForm.spellName]) {
      return YOKAI_FORM_IMAGES[activeYokaiForm.spellName];
    }
    const activeFetchForm = currentCombat.activeEffects.find((e) => e.kind === "fetchForm" && !e.owner);
    if (activeFetchForm && FETCH_FORM_IMAGES[activeFetchForm.spellName]) {
      return FETCH_FORM_IMAGES[activeFetchForm.spellName];
    }
  }
  return playerCharacter.portraitImage || (RACES[playerCharacter.raceId] ? RACES[playerCharacter.raceId].image : null);
}

/**
 * Which race, if any, belongs to whoever's portrait is showing
 * for this log entry — used so the Sídhe glow can be applied to
 * whichever party member actually has that race, player or
 * follower alike, not just the player specifically.
 */
function getActorRaceId(entry) {
  if (entry.actor === "enemy" || entry.actor === "effect") return null;
  if (entry.actor === "follower" && entry.followerName) {
    const follower = followers.find((f) => f.name === entry.followerName);
    return follower ? follower.raceId : null;
  }
  return playerCharacter.raceId;
}

/**
 * Sídhe glow is a natural racial trait, not tied to gear or a
 * cast spell — it simply applies whenever a Sídhe character's
 * portrait is the one currently shown.
 */
function applySidheGlow(raceId) {
  const img = document.getElementById("game-viewport-img");
  img.classList.remove("sidhe-glow");
  if (raceId === "sidhe") {
    img.classList.add("sidhe-glow");
  }
}

function playRoundSequenceThenRender(entries) {
  if (!entries || entries.length === 0) {
    renderCombatScreen();
    return;
  }

  stopAllNarration();

  let i = 0;

  function showNext() {
    if (i >= entries.length) {
      renderCombatScreen();
      return;
    }
    const entry = entries[i];
    i++;

    const line = describeLogEntry(entry);
    if (!line) {
      showNext();
      return;
    }

    const isCompanionTurn = entry.actor === "effect" && entry.kind === "companion";

    let isMeleeHit = false;
    if (entry.hit) {
      if (entry.actor === "player" && !entry.spellName && !entry.action) isMeleeHit = true;
      if (entry.actor === "follower" && !entry.action) isMeleeHit = true;
      if (entry.actor === "enemy" && currentCombat.enemyAttackType === "physical") isMeleeHit = true;
    }

    const isSpellCast = entry.actor === "player" && !!entry.spellName;

    setGameViewportImage(getActorImageForLogEntry(entry), "", isCompanionTurn, isMeleeHit, isSpellCast);
    applyAmbientGlows(entry.actor === "enemy");
    applySidheGlow(getActorRaceId(entry));

    document.getElementById("game-viewport").classList.remove(
      "hit-flash-fire", "hit-flash-physical", "hit-flash-lightning",
      "hit-flash-ice", "hit-flash-poison", "heal-flash",
      "hit-flash-enchant-fire", "hit-flash-enchant-ice",
      "hit-flash-enchant-lightning", "hit-flash-enchant-poison"
    );
    const hitFlashClass = getHitFlashClass(entry);
    if (hitFlashClass) {
      void document.getElementById("game-viewport").offsetWidth;
      document.getElementById("game-viewport").classList.add(hitFlashClass);
    }

if (isMeleeHit && (entry.actor === "player" || entry.actor === "follower")) {
  let activeForm;
  if (entry.actor === "player") {
    activeForm = currentCombat.activeEffects.find((e) => (e.kind === "yokaiForm" || e.kind === "fetchForm") && !e.owner);
  } else {
    const attackingFollower = followers.find((f) => f.name === entry.followerName);
    activeForm = currentCombat.activeEffects.find((e) => (e.kind === "yokaiForm" || e.kind === "fetchForm") && e.owner === attackingFollower);
  }
  const elementalAttackSfx = activeForm ? getElementalAttackSfxPath(activeForm.spellName) : null;
  if (elementalAttackSfx) {
    playSfx(elementalAttackSfx);
  } else {
    playWeaponSfx(entry.skillId);
  }
} else if (entry.actor === "enemy" && entry.hit) {
      const enemySfx = currentCombat.enemyAttackType === "physical"
        ? "assets/audio/sfx/weapon-slash.mp3"
        : getSpellSfxPath(currentCombat.enemyName);
      playSfx(enemySfx);
    }

    if (isSpellCast) {
      const yokaiSfx = entry.skillId === "wayYokai" ? getYokaiTransformSfxPath(entry.spellName) : null;
      const fetchSfx = entry.skillId === "ancestralFetch" ? getFetchTransformSfxPath(entry.spellName) : null;
      const songSfx = BARD_SKILL_IDS.includes(entry.skillId) ? getSongSfxPath(entry.spellName) : null;
      if (yokaiSfx) {
        playSfx(yokaiSfx);
      } else if (fetchSfx) {
        playSfx(fetchSfx);
      } else if (songSfx) {
        playSfx(songSfx);
      } else if (["heal", "hot", "groupHeal"].includes(entry.spellType)) {
        playSfx(HEAL_CAST_SFX);
      } else {
        playSfx(getSpellSfxPathWithType(entry.spellName, entry.spellType));
      }
    }

    if (entry.actor === "effect" && entry.spellName) {
      const tickSongSfx = getSongSfxPath(entry.spellName);
      if (tickSongSfx) playSfx(tickSongSfx);
    }

    if (entry.actor === "follower" && entry.action === "heal") {
      playSfx(HEAL_CAST_SFX);
    }

    if (entry.actor === "follower" && entry.action === "cast") {
      const followerYokaiSfx = entry.skillId === "wayYokai" ? getYokaiTransformSfxPath(entry.spellName) : null;
      const followerFetchSfx = entry.skillId === "ancestralFetch" ? getFetchTransformSfxPath(entry.spellName) : null;
      playSfx(followerYokaiSfx || followerFetchSfx || getSpellSfxPathWithType(entry.spellName, entry.spellType));
    }

    if (entry.actor === "follower" && entry.action === "sing") {
      playSfx(getSongSfxPath(entry.spellName));
    }

    if (entry.hit === false) {
      playSfx(ATTACK_MISS_SFX);
    }

    const enemyTookDamage =
      ((entry.actor === "player" || entry.actor === "follower") && entry.hit === true) ||
      (entry.actor === "effect" && (entry.kind === "companion" || entry.kind === "dot"));

    if (enemyTookDamage && currentCombat && currentCombat.enemyId) {
      playSfx(getEnemyHitSfxPath(currentCombat.enemyId));
    }

    document.getElementById("game-story-text").innerHTML = line;
    document.getElementById("game-choices").innerHTML = "";

    const plainText = line.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const pacingMs = Math.max(1800, plainText.length * 65);
    setTimeout(showNext, pacingMs);
  }

  showNext();
}

function isPlayerIncapacitated() {
  const stunEffect = currentCombat.activeEffects.find((e) => e.kind === "stun" && e.target === "player");
  if (stunEffect) return "stun";

  const fearEffect = currentCombat.activeEffects.find((e) => e.kind === "fear" && e.target === "player");
  if (fearEffect && Math.random() < 0.4) return "fear";

  return null;
}

function performPlayerIncapacitatedTurn(incapacitateType) {
  currentCombat.log.push({ actor: "player", action: "incapacitated", incapacitateType: incapacitateType });

  performFollowersTurn();

  if (currentCombat.enemyCurrentHP <= 0) {
    currentCombat.result = "victory";
    return currentCombat;
  }

  resolveEnemyAttack();
  return currentCombat;
}

function promptHealTarget(skillId, spell) {
  const choicesEl = document.getElementById("game-choices");
  choicesEl.innerHTML = "";

  addChoiceButton(choicesEl, "Heal Yourself", () => {
    const startIndex = currentCombat.log.length;
    performPlayerCast(skillId, spell, playerCharacter);
    saveGameState();
    playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
  });

  getActiveFollowers().forEach((follower) => {
    if (follower.currentHP <= 0) return;
    addChoiceButton(choicesEl, `Heal ${follower.name}`, () => {
      const startIndex = currentCombat.log.length;
      performPlayerCast(skillId, spell, follower);
      saveGameState();
      playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
    });
  });

  addChoiceButton(choicesEl, "Cancel", () => renderCombatScreen());
}

function renderCombatScreen() {
  if (currentCombat.result) {
    renderCombatOutcome();
    return;
  }

  const incapacitateType = isPlayerIncapacitated();
  if (incapacitateType) {
    const choicesEl = document.getElementById("game-choices");
    document.getElementById("game-story-text").innerHTML =
      incapacitateType === "stun"
        ? "You're still reeling from the blow, unable to act this round."
        : "Fear grips you tight — you can't bring yourself to act this round.";
    choicesEl.innerHTML = "";
    addChoiceButton(choicesEl, "Continue", () => {
      const startIndex = currentCombat.log.length;
      performPlayerIncapacitatedTurn(incapacitateType);
      saveGameState();
      playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
    });
    return;
  }

  const storyEl = document.getElementById("game-story-text");
  const choicesEl = document.getElementById("game-choices");
  const maxHP = getHitPoints(playerCharacter);
  document.getElementById("game-viewport").classList.toggle(
    "low-hp-pulse",
    playerCharacter.currentHP > 0 && playerCharacter.currentHP / maxHP <= 0.25
  );
  const manaMax = getManaPoolMax(playerCharacter);
  const enemyCondition = getEnemyConditionText();
  const effectsSummary = getActiveEffectsSummary();
  const equipmentLine = getEquipmentStatusLine();

  let followerBarsHTML = "";
  getActiveFollowers().forEach((f) => {
    const fMax = getHitPoints(f);
    const fCur = f.currentHP !== undefined ? f.currentHP : fMax;
    followerBarsHTML += `
      <div class="cc-skill-count">${f.name}${fCur <= 0 ? " (downed)" : ""}</div>
      ${getHealthBarHTML(fCur, fMax)}
    `;
  });

  storyEl.innerHTML = `
    <strong>${currentCombat.enemyName}</strong> (${enemyCondition})<br />
    ${currentCombat.enemyDescription}<br /><br />
    <div class="cc-skill-count">${currentCombat.enemyName}'s Hit Points</div>
    ${getHealthBarHTML(currentCombat.enemyCurrentHP, currentCombat.enemyMaxHP)}
    <div class="cc-skill-count">Your Hit Points</div>
    ${getHealthBarHTML(playerCharacter.currentHP, maxHP)}
    ${manaMax > 0 ? '<div class="cc-skill-count">Your Mana</div>' + getManaBarHTML(playerCharacter.currentMana, manaMax) : ""}
    ${followerBarsHTML}
    ${equipmentLine ? "<br />" + equipmentLine : ""}
    ${effectsSummary ? "<br />" + effectsSummary : ""}
  `;

  choicesEl.innerHTML = "";

const YOKAI_ATTACK_LABELS = {
   "Fire Form": "Flame Strike",
   "Earth Form": "Stone Fist",
   "Wind Form": "Gale Slash",
   "Mist Form": "Mist Strike"
};
const FETCH_ATTACK_LABELS = {
   "Cù Sídhe Form": "Cù Sídhe's Bite",
   "Stag Form": "Stag's Antlers",
   "Nuckelavee Form": "Nuckelavee's Wrath"
};
  const activeYokaiForm = currentCombat.activeEffects.find((e) => e.kind === "yokaiForm" && !e.owner);
  const activeFetchForm = currentCombat.activeEffects.find((e) => e.kind === "fetchForm" && !e.owner);
  const equippedWeaponId = playerCharacter.equippedWeaponSkill || "unarmedCombat";
  const attackLabel = (activeYokaiForm && YOKAI_ATTACK_LABELS[activeYokaiForm.spellName])
    || (activeFetchForm && FETCH_ATTACK_LABELS[activeFetchForm.spellName])
    || SKILLS[equippedWeaponId].name;
  addChoiceButton(choicesEl, `Attack - ${attackLabel}`, (event) => {
    const weaponFlashClass = getWeaponEnchantFlashClass();
    if (weaponFlashClass && event && event.currentTarget) {
      event.currentTarget.classList.add(weaponFlashClass);
    }
    const startIndex = currentCombat.log.length;
    performPlayerAction(equippedWeaponId);
    saveGameState();
    playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
  });

  if (playerCharacter.equippedShield) {
    const bashCooldown = getSpellCooldownRemaining(playerCharacter, SHIELD_BASH_ID);
    if (bashCooldown > 0) {
      addChoiceButton(choicesEl, `Shield Bash (recovering, ${bashCooldown} ${bashCooldown === 1 ? "round" : "rounds"} left)`, null, true);
    } else {
      addChoiceButton(choicesEl, "Shield Bash", () => {
        const startIndex = currentCombat.log.length;
        performShieldBash();
        saveGameState();
        playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
      });
    }
  }

  const trainedSkillIds = Object.keys(playerCharacter.skills);
  const magicSkillIds = trainedSkillIds.filter((id) => SKILLS[id].category === "Magic");
  const hasEnoughMana = playerCharacter.currentMana >= MANA_CONFIG.costPerCast;

  currentCombat.activeEffects.filter((e) => e.source === "song" && (e.owner || playerCharacter) === playerCharacter).forEach((songEffect) => {
    addChoiceButton(choicesEl, `Stop Song - ${songEffect.spellName}`, () => {
      stopSong(songEffect.spellName);
      renderCombatScreen();
      saveGameState();
    });
  });

  magicSkillIds.forEach((skillId) => {
    const knownIds = (playerCharacter.knownSpells && playerCharacter.knownSpells[skillId]) || [];
    const allSpellsForLine = SPELLS[skillId] || [];
    const knownSpells = allSpellsForLine.filter((spell) => knownIds.includes(spell.id));

    knownSpells.forEach((spell) => {
      if (!isSpellActive(playerCharacter, spell.id)) return;
      if (spell.type === "companion" && dungeonCompanionUsed) {
        return;
      }
      if (spell.type === "cooldownBuff") {
        const cooldownLeft = getSpellCooldownRemaining(playerCharacter, spell.id);
        if (cooldownLeft > 0) {
          addChoiceButton(choicesEl, `Cast - ${spell.name} (recovering, ${cooldownLeft} ${cooldownLeft === 1 ? "round" : "rounds"} left)`, null, true);
          return;
        }
      }
      const isSong = skillId === "ancestralSiuloir";
      const songCapped = isSong && getActiveSongCount() >= 2;
      const verb = isSong ? "Sing" : "Cast";

      if (songCapped) {
        addChoiceButton(choicesEl, `${verb} - ${spell.name} (stop a song first)`, null, true);
        return;
      }
      const cultureForSpell = Object.values(CULTURES).find(c => c.magicSkillIds.includes(skillId));
      const spellImagePath = cultureForSpell ? `assets/images/spells/${cultureForSpell.id}/${spell.id}.png` : null;

      if (hasEnoughMana) {
        addChoiceButton(choicesEl, `${verb} - ${spell.name} (${MANA_CONFIG.costPerCast} mana): ${spell.description}`, (event) => {
          if (spell.type === "heal") {
            promptHealTarget(skillId, spell);
            return;
          }
          const elementClass = getElementFlashClass(spell.name, spell.type);
          if (elementClass && event && event.currentTarget) {
            event.currentTarget.classList.add(elementClass);
          }
          const startIndex = currentCombat.log.length;
          performPlayerCast(skillId, spell);
          saveGameState();
          playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
        }, false, spellImagePath);
      } else {
        addChoiceButton(choicesEl, `${verb} - ${spell.name} (not enough mana)`, null, true);
      }
    });
  });

  addChoiceButton(choicesEl, "Defend", () => {
    const startIndex = currentCombat.log.length;
    performPlayerDefend();
    saveGameState();
    playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
  });

  addChoiceButton(choicesEl, "Flee", () => {
    const startIndex = currentCombat.log.length;
    performPlayerFlee();
    saveGameState();
    playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
  });

  if (inTrainingGrounds) {
    addChoiceButton(choicesEl, "Return to Homebase", () => {
      const confirmStoryEl = document.getElementById("game-story-text");
      const confirmChoicesEl = document.getElementById("game-choices");
      confirmStoryEl.innerHTML = "Leave the Training Grounds and return to Homebase? This ends your current session.";
      confirmChoicesEl.innerHTML = "";
      addChoiceButton(confirmChoicesEl, "Yes, return to Homebase", leaveTrainingGrounds);
      addChoiceButton(confirmChoicesEl, "No, keep fighting", () => renderCombatScreen());
    });
  }
}

function renderCombatOutcome() {
  const gameViewportEl = document.getElementById("game-viewport");
  if (gameViewportEl) {
    gameViewportEl.classList.remove(
      "hit-flash-fire", "hit-flash-physical", "hit-flash-lightning",
      "hit-flash-ice", "hit-flash-poison", "heal-flash", "low-hp-pulse",
      "hit-flash-enchant-fire", "hit-flash-enchant-ice",
      "hit-flash-enchant-lightning", "hit-flash-enchant-poison"
    );
  }

  const storyEl = document.getElementById("game-story-text");
  const choicesEl = document.getElementById("game-choices");
  choicesEl.innerHTML = "";

  if (currentCombat.result === "victory") {
    const enemyTemplate = ENEMIES[currentCombat.enemyId];
    if (enemyTemplate.deathImage) {
      setGameViewportImage(enemyTemplate.deathImage, `${enemyTemplate.name} defeated`);
    }
    applyVictoryPulse();
    playSfx(getEnemyDeathSfxPath(currentCombat.enemyId));

    const loot = claimVictoryLoot();

    if (inTrainingGrounds) {
      const newDefeatCount = trainingGroundsDefeatCount + 1;
      const bonusMaterials = ["Old Ore", "Hide", "Grave Essence"];
      const bonusCount = Math.min(3, 1 + Math.floor(newDefeatCount / 5));
      const bonusLoot = [];
      for (let i = 0; i < bonusCount; i++) {
        const material = bonusMaterials[Math.floor(Math.random() * bonusMaterials.length)];
        playerCharacter.inventory.push(material);
        bonusLoot.push(material);
      }

      storyEl.innerHTML = `
        <strong>${currentCombat.enemyName}</strong> falls.<br /><br />
        You recover: ${loot.join(", ") || "nothing of note"}, plus ${bonusLoot.join(", ")}.<br />
        Enemies defeated: ${newDefeatCount}
      `;

      if (newDefeatCount === 5) {
        const rewardTierByDifficulty = { easy: "Adept", normal: "Expert", hard: "Master" };
        const rewardTier = rewardTierByDifficulty[selectedDifficulty] || "Adept";

        storyEl.innerHTML += `<br /><br /><strong>Five falls in the arena.</strong> Choose your champion's reward.`;
        const weaponSkillId = playerCharacter.equippedWeaponSkill;
        const armorSkillId = playerCharacter.equippedArmorSkill;
        const weaponRecipe = Object.values(CRAFTING_RECIPES).find((r) => r.linkedSkill === weaponSkillId);
        const armorRecipe = Object.values(CRAFTING_RECIPES).find((r) => r.linkedSkill === armorSkillId);
        const hasShield = !!playerCharacter.equippedShield;
        let anyOption = false;

        if (weaponRecipe) {
          anyOption = true;
          addChoiceButton(choicesEl, `Claim Weapon - ${weaponRecipe.name}`, () => {
            playerCharacter.inventory.push(`${weaponRecipe.name} (Champion's ${rewardTier}-crafted)`);
            saveGameState();
            addChoiceButton(choicesEl, "Continue Training", continueTrainingGauntlet);
            addChoiceButton(choicesEl, "Retreat to Homebase", leaveTrainingGrounds);
          });
        }
        if (armorRecipe) {
          anyOption = true;
          addChoiceButton(choicesEl, `Claim Armor - ${armorRecipe.name}`, () => {
            playerCharacter.inventory.push(`${armorRecipe.name} (Champion's ${rewardTier}-crafted)`);
            saveGameState();
            addChoiceButton(choicesEl, "Continue Training", continueTrainingGauntlet);
            addChoiceButton(choicesEl, "Retreat to Homebase", leaveTrainingGrounds);
          });
        }
        if (hasShield) {
          anyOption = true;
          addChoiceButton(choicesEl, "Claim Shield", () => {
            playerCharacter.inventory.push(`Shield (Champion's ${rewardTier}-crafted)`);
            saveGameState();
            addChoiceButton(choicesEl, "Continue Training", continueTrainingGauntlet);
            addChoiceButton(choicesEl, "Retreat to Homebase", leaveTrainingGrounds);
          });
        }
        if (!anyOption) {
          addChoiceButton(choicesEl, "Continue Training", continueTrainingGauntlet);
          addChoiceButton(choicesEl, "Retreat to Homebase", leaveTrainingGrounds);
        }
      } else {
        addChoiceButton(choicesEl, "Continue Training", continueTrainingGauntlet);
        addChoiceButton(choicesEl, "Retreat to Homebase", leaveTrainingGrounds);
      }
    } else {
      storyEl.innerHTML = `
        <strong>${currentCombat.enemyName}</strong> falls.<br /><br />
        You recover: ${loot.join(", ") || "nothing of note"}.
      `;
      addChoiceButton(choicesEl, "Continue", () => {
        currentCombat = null;
        if (combatReturnRoomId) {
          renderDungeonRoom(combatReturnRoomId);
        } else {
          goToHomebaseScreen();
        }
      });
    }
  } else if (currentCombat.result === "defeat") {
    applyDefeatFade();

    if (inTrainingGrounds) {
      storyEl.innerHTML = `
        Everything goes dark. <strong>${playerCharacter.name}</strong> falls before ${currentCombat.enemyName}.<br /><br />
        Enemies defeated this session: ${trainingGroundsDefeatCount}.<br />
        You wake later, battered but alive, back at Homebase.
      `;
      addChoiceButton(choicesEl, "Return to Homebase", leaveTrainingGrounds);
    } else {
      storyEl.innerHTML = `
        Everything goes dark. <strong>${playerCharacter.name}</strong> falls before ${currentCombat.enemyName}.<br /><br />
        You wake later, battered but alive, back at Homebase.
      `;
      addChoiceButton(choicesEl, "Return to Homebase", () => {
        currentCombat = null;
        combatReturnRoomId = null;
        goToHomebaseScreen();
      });
    }
  } else if (currentCombat.result === "fled") {
    if (inTrainingGrounds) {
      storyEl.innerHTML = `
        You break away from ${currentCombat.enemyName} and don't look back.<br /><br />
        Enemies defeated this session: ${trainingGroundsDefeatCount}.
      `;
      addChoiceButton(choicesEl, "Return to Homebase", leaveTrainingGrounds);
    } else {
      storyEl.innerHTML = `
        You break away from ${currentCombat.enemyName} and don't look back.
      `;
      addChoiceButton(choicesEl, "Return to Homebase", () => {
        currentCombat = null;
        combatReturnRoomId = null;
        goToHomebaseScreen();
      });
    }
  }

  saveGameState();
}

function applyVictoryPulse() {
  const img = document.getElementById("game-viewport-img");
  img.classList.remove("companion-glow", "hit-shake", "spell-flash", "defeat-fade");
  img.classList.add("victory-pulse");
}

function applyDefeatFade() {
  const img = document.getElementById("game-viewport-img");
  img.classList.remove("companion-glow", "hit-shake", "spell-flash", "victory-pulse");
  void img.offsetWidth;
  img.classList.add("defeat-fade");
}

function goToCraftingScreen() {
  showScreen("screen-crafting");
  craftingEnchantSlotPending = null;
  renderCraftingScreen();
}

function countMaterial(materialName) {
  return playerCharacter.inventory.filter((item) => item === materialName).length;
}

function renderCraftingTabs() {
  const tabsEl = document.getElementById("crafting-tabs");
  tabsEl.innerHTML = "";
  const tabs = [
    { id: "weapon", label: "Weapons" },
    { id: "armor", label: "Armor" },
    { id: "enchant", label: "Enchant" }
  ];
  tabs.forEach((tab) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    if (craftingCategory === tab.id) card.classList.add("selected");
    card.innerHTML = `<div class="cc-card-name">${tab.label}</div>`;
    card.addEventListener("click", () => {
      craftingCategory = tab.id;
      craftingEnchantSlotPending = null;
      renderCraftingScreen();
    });
    tabsEl.appendChild(card);
  });
}

function renderCraftingScreen() {
  renderCraftingTabs();
  const list = document.getElementById("crafting-list");
  const resultEl = document.getElementById("crafting-result");
  list.innerHTML = "";
  resultEl.innerHTML = "";

  if (craftingCategory === "enchant") {
    renderEnchantSection(list, resultEl);
    return;
  }

  const recipes = Object.values(CRAFTING_RECIPES).filter((r) => r.category === craftingCategory);
  const usableRecipes = recipes.filter((recipe) => !!playerCharacter.skills[recipe.craftingSkill]);

  if (usableRecipes.length === 0) {
    resultEl.innerHTML = "You don't have the right Crafting skill trained yet for this category.";
    return;
  }

  usableRecipes.forEach((recipe) => {
    const have = countMaterial(recipe.material);
    const craftingTier = getCharacterSkillTier(playerCharacter, recipe.craftingSkill).name;
    const card = document.createElement("div");
    card.className = "cc-card";
    card.innerHTML = `
      <div class="cc-card-name">${recipe.name}</div>
      <div class="cc-card-desc">Requires: ${recipe.materialCost} &times; ${recipe.material} (you have ${have})</div>
      <div class="cc-card-desc">Your ${SKILLS[recipe.craftingSkill].name}: ${craftingTier}</div>
      <div class="cc-card-image" style="background-image: url('assets/images/items/${getRecipeImageSlug(recipe.id)}.png')"></div>
    `;
    card.addEventListener("click", () => {
      attemptCraft(recipe.id);
    });
    list.appendChild(card);
  });
}

function renderEnchantSection(list, resultEl) {
  if (!playerCharacter.skills.enchanting) {
    resultEl.innerHTML = "You haven't trained Enchanting — nothing to do here yet.";
    return;
  }

  if (!craftingEnchantSlotPending) {
    const weaponCard = document.createElement("div");
    weaponCard.className = "cc-card";
    const currentWeaponEnchant = playerCharacter.weaponEnchantment ? playerCharacter.weaponEnchantment.name : "None";
    const equippedWeaponImage = playerCharacter.equippedWeaponItemName ? getItemImagePath(playerCharacter.equippedWeaponItemName) : null;
    weaponCard.innerHTML = `
      <div class="cc-card-name">Enchant Weapon</div>
      <div class="cc-card-desc">Current: ${currentWeaponEnchant}</div>
      <div class="cc-card-desc">Requires: ${ENCHANT_MATERIAL_COST} &times; ${ENCHANT_MATERIAL}</div>
      ${equippedWeaponImage ? `<div class="cc-card-image" style="background-image: url('${equippedWeaponImage}')"></div>` : ""}
    `;
    weaponCard.addEventListener("click", () => {
      craftingEnchantSlotPending = "weapon";
      renderCraftingScreen();
    });
    list.appendChild(weaponCard);

    const armorSlotLabels = { head: "Head", chest: "Chest", legs: "Legs", gloves: "Gloves", boots: "Boots" };
    const armorEnchantFields = {
      head: "headEnchantment", chest: "chestEnchantment", legs: "legsEnchantment",
      gloves: "glovesEnchantment", boots: "bootsEnchantment"
    };
    const armorItemNameFields = {
      head: "equippedHeadItemName", chest: "equippedChestItemName", legs: "equippedLegsItemName",
      gloves: "equippedGlovesItemName", boots: "equippedBootsItemName"
    };
    Object.keys(armorSlotLabels).forEach((slotName) => {
      const enchantField = armorEnchantFields[slotName];
      const current = playerCharacter[enchantField];
      const slotCard = document.createElement("div");
      slotCard.className = "cc-card";
      const equippedSlotItemName = playerCharacter[armorItemNameFields[slotName]];
      const equippedSlotImage = equippedSlotItemName ? getItemImagePath(equippedSlotItemName) : null;
      slotCard.innerHTML = `
        <div class="cc-card-name">Enchant ${armorSlotLabels[slotName]}</div>
        <div class="cc-card-desc">Current: ${current ? current.name : "None"}</div>
        <div class="cc-card-desc">Requires: ${ENCHANT_MATERIAL_COST} &times; ${ENCHANT_MATERIAL}</div>
        ${equippedSlotImage ? `<div class="cc-card-image" style="background-image: url('${equippedSlotImage}')"></div>` : ""}
      `;
      slotCard.addEventListener("click", () => {
        craftingEnchantSlotPending = slotName;
        renderCraftingScreen();
      });
      list.appendChild(slotCard);
    });
    return;
  }

  const armorEnchantFieldsLookup = {
    head: "headEnchantment", chest: "chestEnchantment", legs: "legsEnchantment",
    gloves: "glovesEnchantment", boots: "bootsEnchantment"
  };
  const currentEnchantment = craftingEnchantSlotPending === "weapon"
    ? playerCharacter.weaponEnchantment
    : playerCharacter[armorEnchantFieldsLookup[craftingEnchantSlotPending]];
  const currentTypeId = currentEnchantment ? currentEnchantment.type : null;

  Object.values(ENCHANTMENT_TYPES).forEach((type) => {
    const alreadyActive = type.id === currentTypeId;

    const card = document.createElement("div");
    card.className = "cc-card";
    card.innerHTML = `
      <div class="cc-card-name">${type.name}</div>
      <div class="cc-card-desc">${type.description}</div>
      ${alreadyActive ? '<div class="cc-card-desc"><em>Already active on this item</em></div>' : ""}
    `;

    if (alreadyActive) {
      card.style.opacity = "0.4";
      card.style.cursor = "not-allowed";
    } else {
      card.addEventListener("click", () => {
        attemptEnchant(craftingEnchantSlotPending, type.id);
      });
    }

    list.appendChild(card);
  });
}

function attemptCraft(recipeId) {
  const recipe = CRAFTING_RECIPES[recipeId];
  const have = countMaterial(recipe.material);

  if (have < recipe.materialCost) {
    document.getElementById("crafting-result").innerHTML =
      `<span class="craft-result-fail">You need ${recipe.materialCost} &times; ${recipe.material} to attempt this — you only have ${have}.</span>`;
    return;
  }

  const craftingTierBefore = getCharacterSkillTier(playerCharacter, recipe.craftingSkill).name;
  useSkill(playerCharacter, recipe.craftingSkill);

  const success = rollSuccess(craftingTierBefore, "Adept");
  let resultMessage;

  if (success) {
    for (let i = 0; i < recipe.materialCost; i++) {
      const idx = playerCharacter.inventory.indexOf(recipe.material);
      if (idx !== -1) playerCharacter.inventory.splice(idx, 1);
    }
    const craftedName = `${recipe.name} (${craftingTierBefore}-crafted)`;
    playerCharacter.inventory.push(craftedName);
    resultMessage = `<span class="craft-result-success">Success! You craft: <strong>${craftedName}</strong>.</span>`;
  } else {
    resultMessage = `<span class="craft-result-fail">The attempt fails. No materials lost — but you've learned something from the mistake.</span>`;
  }

  renderCraftingScreen();
  document.getElementById("crafting-result").innerHTML = resultMessage;
  saveGameState();
}

const ARMOR_ENCHANT_FIELD_BY_SLOT = {
  head: "headEnchantment", chest: "chestEnchantment", legs: "legsEnchantment",
  gloves: "glovesEnchantment", boots: "bootsEnchantment"
};

function attemptEnchant(slot, typeId) {
  const enchantField = slot === "weapon" ? "weaponEnchantment" : ARMOR_ENCHANT_FIELD_BY_SLOT[slot];
  const currentEnchantment = playerCharacter[enchantField];
  if (currentEnchantment && currentEnchantment.type === typeId) {
    document.getElementById("crafting-result").innerHTML =
      `<span class="craft-result-fail">This item is already ${ENCHANTMENT_TYPES[typeId].name}-Enchanted — choose a different type to change it.</span>`;
    return;
  }

  const have = countMaterial(ENCHANT_MATERIAL);

  if (have < ENCHANT_MATERIAL_COST) {
    document.getElementById("crafting-result").innerHTML =
      `<span class="craft-result-fail">You need ${ENCHANT_MATERIAL_COST} &times; ${ENCHANT_MATERIAL} to attempt this — you only have ${have}.</span>`;
    return;
  }

  const craftingTierBefore = getCharacterSkillTier(playerCharacter, "enchanting").name;
  useSkill(playerCharacter, "enchanting");

  const success = rollSuccess(craftingTierBefore, "Adept");
  const typeInfo = ENCHANTMENT_TYPES[typeId];
  let resultMessage;

  if (success) {
    for (let i = 0; i < ENCHANT_MATERIAL_COST; i++) {
      const idx = playerCharacter.inventory.indexOf(ENCHANT_MATERIAL);
      if (idx !== -1) playerCharacter.inventory.splice(idx, 1);
    }
    const enchantment = { type: typeId, name: typeInfo.name, tierWhenMade: craftingTierBefore };
    playerCharacter[enchantField] = enchantment;
    resultMessage = `<span class="craft-result-success">Success! Your ${slot} is now <strong>${typeInfo.name}-Enchanted</strong>.</span>`;
  } else {
    resultMessage = `<span class="craft-result-fail">The enchantment fails to take hold. No materials lost — but you've learned something from the mistake.</span>`;
  }

  craftingEnchantSlotPending = null;
  renderCraftingScreen();
  document.getElementById("crafting-result").innerHTML = resultMessage;
  saveGameState();
}

function getItemRequiredSkill(itemName) {
  const startingEntry = Object.entries(STARTING_EQUIPMENT).find(
    ([skillId, name]) => name === itemName
  );
  if (startingEntry) return startingEntry[0];

  const recipeMatch = Object.values(CRAFTING_RECIPES).find((recipe) =>
    itemName.startsWith(`${recipe.name} (`)
  );
  if (recipeMatch) return recipeMatch.linkedSkill;

  return null;
}

function getRecipeImageSlug(recipeId) {
  return recipeId
    .replace(/^craft/, "")
    .replace(/([A-Z])/g, (match, letter, offset) => (offset > 0 ? "-" : "") + letter.toLowerCase());
}

function getSkillImagePath(skillId) {
  const slug = skillId.replace(/([A-Z])/g, (match, letter) => "-" + letter.toLowerCase());
  return `assets/images/skills/${slug}.png`;
}

function getCombatStyleImagePath(styleId) {
  const slug = styleId.replace(/([A-Z])/g, (match, letter) => "-" + letter.toLowerCase());
  return `assets/images/combat-styles/${slug}.png`;
}

function getTraitImagePath(traitId) {
  const slug = traitId.replace(/([A-Z])/g, (match, letter) => "-" + letter.toLowerCase());
  return `assets/images/traits/${slug}.png`;
}

function getItemImagePath(itemName) {
  const startingImageMap = { "Old Sword": "sword", "Worn Axe": "axe", "Simple Bow": "bow" };
  if (startingImageMap[itemName]) {
    return `assets/images/items/${startingImageMap[itemName]}.png`;
  }

  const legendaryImageMap = {
    "Averick's Reckoning": "avericks-reckoning",
    "Kolgrim's Brand": "kolgrims-brand",
    "Ivarr's Grudge": "ivarrs-grudge",
    "Neasa's Unbroken Sky": "neasas-unbroken-sky",
    "Kurogane's Perfect Step": "kuroganes-perfect-step",
    "Kwabena's Undoing": "kwabenas-undoing"
  };
  if (legendaryImageMap[itemName]) {
    return `assets/images/items/${legendaryImageMap[itemName]}.png`;
  }

  const recipeMatch = Object.values(CRAFTING_RECIPES).find((recipe) =>
    itemName.startsWith(`${recipe.name} (`)
  );
  if (recipeMatch) {
    return `assets/images/items/${getRecipeImageSlug(recipeMatch.id)}.png`;
  }

  return null;
}

function goToGiveItemsScreen() {
  showScreen("screen-give-items");
  selectedGiveItemName = null;
  renderGiveItemsScreen();
}

function renderGiveItemsScreen() {
  const resultEl = document.getElementById("give-items-result");
  const inventoryGrid = document.getElementById("give-items-inventory-grid");
  const followerGrid = document.getElementById("give-items-follower-grid");

  inventoryGrid.innerHTML = "";
  followerGrid.innerHTML = "";

  const knownMaterials = ["Old Ore", "Hide", "Grave Essence"];
  const giveableItems = playerCharacter.inventory.filter(
    (itemName) => !knownMaterials.includes(itemName)
  );

  if (giveableItems.length === 0) {
    inventoryGrid.innerHTML = '<div class="cc-skill-count">You have no weapons or armor to give.</div>';
  } else {
    const uniqueItems = [...new Set(giveableItems)];
    uniqueItems.forEach((itemName) => {
      const count = giveableItems.filter((n) => n === itemName).length;
      const card = document.createElement("div");
      card.className = "cc-card";
      if (selectedGiveItemName === itemName) card.classList.add("selected");
      const itemImage = getItemImagePath(itemName);
      card.innerHTML = `
        <div class="cc-card-name">${itemName}</div>
        <div class="cc-card-desc">${count > 1 ? `Quantity: ${count}` : "Carried"}</div>
        ${itemImage ? `<div class="cc-card-image" style="background-image: url('${itemImage}')"></div>` : ""}
      `;
      card.addEventListener("click", () => {
        selectedGiveItemName = itemName;
        renderGiveItemsScreen();
      });
      inventoryGrid.appendChild(card);
    });
  }

  if (followers.length === 0) {
    followerGrid.innerHTML = '<div class="cc-skill-count">You have no followers yet.</div>';
  } else {
    followers.forEach((follower, index) => {
      const card = document.createElement("div");
      card.className = "cc-card";
      card.innerHTML = `
        <div class="cc-card-name">${follower.name}</div>
        <div class="cc-card-desc">${RACES[follower.raceId] ? RACES[follower.raceId].name : ""}</div>
      `;
      card.addEventListener("click", () => {
        attemptGiveItem(index);
      });
      followerGrid.appendChild(card);
    });
  }

  if (!selectedGiveItemName) {
    resultEl.textContent = "Choose an item, then choose who to give it to.";
  }
}

function attemptGiveItem(followerIndex) {
  const resultEl = document.getElementById("give-items-result");

  if (!selectedGiveItemName) {
    resultEl.textContent = "Choose an item first.";
    return;
  }

  const follower = followers[followerIndex];
  const requiredSkill = getItemRequiredSkill(selectedGiveItemName);

  if (requiredSkill && !follower.skills[requiredSkill]) {
    resultEl.textContent = `${follower.name} hasn't trained ${SKILLS[requiredSkill] ? SKILLS[requiredSkill].name : requiredSkill} and can't use this.`;
    return;
  }

  const idx = playerCharacter.inventory.indexOf(selectedGiveItemName);
  if (idx === -1) {
    resultEl.textContent = "That item is no longer available.";
    selectedGiveItemName = null;
    renderGiveItemsScreen();
    return;
  }

  playerCharacter.inventory.splice(idx, 1);
  follower.inventory.push(selectedGiveItemName);

  let autoEquipped = false;

  if (requiredSkill) {
    if (SKILLS[requiredSkill].category === "Weapon") {
      follower.equippedWeaponSkill = requiredSkill;
      autoEquipped = true;
    } else if (SKILLS[requiredSkill].category === "Armor") {
      follower.equippedArmorSkill = requiredSkill;
      autoEquipped = true;
    }
  } else if (selectedGiveItemName.startsWith("Shield (")) {
    follower.equippedShield = true;
    autoEquipped = true;
  }

  resultEl.textContent = `${follower.name} now carries ${selectedGiveItemName}${autoEquipped ? " and has it equipped" : ""}.`;
  selectedGiveItemName = null;
  renderGiveItemsScreen();
  saveGameState();
}

if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  document.getElementById("ios-volume-note").style.display = "inline";
}

document.getElementById("btn-toggle-music").addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  if (musicEnabled) {
    gameMusic.play().catch(() => {});
  } else {
    gameMusic.pause();
  }
  syncToggleIcons();
  saveGameState();
});

document.getElementById("btn-toggle-voice").addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  syncToggleIcons();
  if (!voiceEnabled) {
    stopAllNarration();
  }
  saveGameState();
});

document.getElementById("btn-begin").addEventListener("click", confirmDifficultyAndStartCreation);

document.getElementById("btn-step1-next").addEventListener("click", () => {
  const errorEl = document.getElementById("cc-error-step1");
  const name = document.getElementById("cc-name").value.trim();
  if (!name) {
    errorEl.textContent = "Your character needs a name.";
    return;
  }
  if (!creationState.race) {
    errorEl.textContent = "Choose a race.";
    return;
  }
  errorEl.textContent = "";
  creationState.name = name;
  goToCreationStep(1);
});

document.getElementById("btn-step3b-back").addEventListener("click", () => goToCreationStep(0));
document.getElementById("btn-step3b-next").addEventListener("click", () => {
  goToCreationStep(2);
});

document.getElementById("btn-step3-back").addEventListener("click", () => goToCreationStep(1));
document.getElementById("btn-step3-next").addEventListener("click", () => {
  const errorEl = document.getElementById("cc-error-step3");
  if (creationState.skills.length === 0) {
    errorEl.textContent = "Choose at least one starting skill or spell.";
    return;
  }
  errorEl.textContent = "";
  goToCreationStep(3);
});

document.getElementById("btn-step4-back").addEventListener("click", () => goToCreationStep(2));
document.getElementById("btn-step4-next").addEventListener("click", () => {
  const errorEl = document.getElementById("cc-error-step4");
  if (creationState.traits.length < TRAIT_SELECTION_MIN) {
    errorEl.textContent = `Choose at least ${TRAIT_SELECTION_MIN} traits.`;
    return;
  }
  errorEl.textContent = "";
  goToCreationStep(4);
});

document.getElementById("btn-step5-back").addEventListener("click", () => goToCreationStep(3));
document.getElementById("btn-step5-next").addEventListener("click", () => {
  goToCreationStep(5);
});

document.getElementById("btn-review-back").addEventListener("click", () => goToCreationStep(4));
document.getElementById("btn-confirm-character").addEventListener("click", attemptConfirmCharacter);

document.getElementById("btn-add-follower").addEventListener("click", () => {
  resetCreationState("follower");
  goToCreationStep(0);
});

document.getElementById("btn-continue-to-homebase").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-manage-party").addEventListener("click", goToPartyScreen);

document.getElementById("btn-go-to-skills").addEventListener("click", goToSkillsScreen);
document.getElementById("btn-mastery").addEventListener("click", goToMasteryScreen);
document.getElementById("btn-mastery-back").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-skills-back").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-go-to-inventory").addEventListener("click", goToInventoryScreen);

document.getElementById("btn-inventory-back").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-go-to-give-items").addEventListener("click", goToGiveItemsScreen);

document.getElementById("btn-give-items-back").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-continue-to-dungeon-select").addEventListener("click", goToDungeonSelectScreen);

document.getElementById("btn-go-to-crafting").addEventListener("click", goToCraftingScreen);

document.getElementById("btn-crafting-back").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-start-another-game").addEventListener("click", beginNewHeroCreation);

document.getElementById("btn-delete-game").addEventListener("click", deleteCurrentHero);

document.getElementById("btn-start-new-hero").addEventListener("click", beginNewHeroCreation);



/**
 * ------------------------------------------------------------
 * STARTUP
 * If a save exists, restore it and jump straight to wherever
 * the player left off (Homebase, or the exact dungeon room they
 * were in). Otherwise, show the title screen as normal.
 * ------------------------------------------------------------
 */

let manageSpellsCharacter = null;
let manageSpellsIsFollower = false;

function goToManageSpellsScreen(character, isFollower) {
  manageSpellsCharacter = character;
  manageSpellsIsFollower = !!isFollower;
  showScreen("screen-manage-spells");
  renderManageSpellsScreen();
}

function renderManageSpellsScreen() {
  const character = manageSpellsCharacter;
  document.getElementById("manage-spells-name").textContent = character.name;

  const grid = document.getElementById("manage-spells-grid");
  grid.innerHTML = "";

  const allKnown = getAllKnownSpells(character);
  const activeCount = (character.activeSpellIds || []).length;
  document.getElementById("manage-spells-count").textContent = `Active: ${activeCount} / 4`;

  if (allKnown.length === 0) {
    grid.innerHTML = '<div class="cc-skill-count">No spells known yet.</div>';
    return;
  }

  allKnown.forEach(({ skillId, spell }) => {
    const isActive = isSpellActive(character, spell.id);
    const card = document.createElement("div");
    card.className = "cc-card";
    if (isActive) card.classList.add("selected");
    const cultureForSpell = Object.values(CULTURES).find(c => c.magicSkillIds.includes(skillId));
    const spellImagePath = `../assets/images/spells/${cultureForSpell.id}/${spell.id}.png`;
    card.innerHTML = `
      <div class="cc-card-name">${spell.name}</div>
      <div class="cc-card-desc">${spell.description}</div>
      <div class="cc-card-desc"><em>${SKILLS[skillId] ? SKILLS[skillId].name : skillId}</em></div>
      <div class="cc-card-image" style="background-image: url('${spellImagePath}')"></div>
    `;
    card.addEventListener("click", () => {
      const changed = toggleActiveSpell(character, spell.id);
      if (!changed && !isActive) {
        document.getElementById("manage-spells-count").textContent = "Active: 4 / 4 (remove one first)";
        return;
      }
      renderManageSpellsScreen();
      saveGameState();
    });
    grid.appendChild(card);
  });
}

document.getElementById("btn-your-spells").addEventListener("click", () => {
  goToManageSpellsScreen(playerCharacter, false);
});

document.getElementById("btn-manage-spells-back").addEventListener("click", () => {
  if (manageSpellsIsFollower) {
    goToPartyScreen();
  } else {
    goToHomebaseScreen();
  }
});
function goToLearnSkillScreen() {
  showScreen("screen-learn-skill");
  renderLearnSkillScreen();
}

function renderLearnSkillScreen() {
  const resultEl = document.getElementById("learn-skill-result");
  const container = document.getElementById("learn-skill-grid");
  container.innerHTML = "";
  resultEl.textContent = "";

  const availableSkills = Object.values(SKILLS).filter((s) => !playerCharacter.skills[s.id]);

  if (availableSkills.length === 0) {
    container.innerHTML = '<div class="cc-skill-count">You already know every skill.</div>';
    return;
  }

  SKILL_CATEGORY_ORDER.forEach((categoryName) => {
    const skillsInCategory = availableSkills.filter((s) => s.category === categoryName);
    if (skillsInCategory.length === 0) return;

    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = categoryName;
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "cc-grid";

    skillsInCategory.forEach((skill) => {
      const card = document.createElement("div");
      card.className = "cc-card";
      card.innerHTML = `
        <div class="cc-card-name">${skill.name}</div>
        <div class="cc-card-desc">${skill.description}</div>
      `;
      card.addEventListener("click", () => {
        learnNewSkill(playerCharacter, skill.id);
        resultEl.textContent = `You have learned ${skill.name}.`;
        renderLearnSkillScreen();
        saveGameState();
      });
      grid.appendChild(card);
    });

    container.appendChild(grid);
  });
}
let teachSkillFollowerIndex = null;

function goToTeachSkillScreen(followerIndex) {
  teachSkillFollowerIndex = followerIndex;
  showScreen("screen-teach-skill");
  renderTeachSkillScreen();
}

function renderTeachSkillScreen() {
  const follower = followers[teachSkillFollowerIndex];
  const resultEl = document.getElementById("teach-skill-result");
  const nameEl = document.getElementById("teach-skill-name");
  const container = document.getElementById("teach-skill-grid");
  nameEl.textContent = follower.name;
  container.innerHTML = "";
  resultEl.textContent = "";

  const allTeachableSkills = Object.values(SKILLS).filter((s) => s.category !== "Magic");

  SKILL_CATEGORY_ORDER.forEach((categoryName) => {
    if (categoryName === "Magic") return;
    const skillsInCategory = allTeachableSkills.filter((s) => s.category === categoryName);
    if (skillsInCategory.length === 0) return;

    const heading = document.createElement("div");
    heading.className = "cc-category-heading";
    heading.textContent = categoryName;
    container.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "cc-grid";

    skillsInCategory.forEach((skill) => {
      const isKnown = !!follower.skills[skill.id];
      const card = document.createElement("div");
      card.className = "cc-card";
      if (isKnown) card.classList.add("selected");
      card.innerHTML = `
        <div class="cc-card-name">${skill.name}</div>
        <div class="cc-card-desc">${skill.description}</div>
        <div class="cc-card-desc"><em>${isKnown ? "Learned (click to remove)" : "Click to teach"}</em></div>
        <div class="cc-card-image" style="background-image: url('${getSkillImagePath(skill.id)}')"></div>
      `;
      card.addEventListener("click", () => {
        if (isKnown) {
          delete follower.skills[skill.id];
          if (follower.equippedWeaponSkill === skill.id) {
            follower.equippedWeaponSkill = "unarmedCombat";
          }
          if (follower.equippedArmorSkill === skill.id) {
            follower.equippedArmorSkill = null;
          }
          resultEl.textContent = `${follower.name} has forgotten ${skill.name}.`;
        } else if (Object.keys(follower.skills).filter((id) => SKILLS[id].category !== "Magic").length >= MAX_STARTING_SKILLS) {
          resultEl.textContent = `${follower.name} already knows ${MAX_STARTING_SKILLS} skills — forget one first to make room.`;
        } else {
          learnNewSkill(follower, skill.id);
          resultEl.textContent = `${follower.name} has learned ${skill.name}.`;
        }
        renderTeachSkillScreen();
        saveGameState();
      });
      grid.appendChild(card);
    });

    container.appendChild(grid);
  });
}

let teachSpellFollowerIndex = null;

function goToTeachSpellScreen(followerIndex) {
  teachSpellFollowerIndex = followerIndex;
  showScreen("screen-teach-spell");
  renderTeachSpellScreen();
}

let teachSpellViewCultureId = null;

function renderTeachSpellScreen() {
  const follower = followers[teachSpellFollowerIndex];
  const nameEl = document.getElementById("teach-spell-name");
  const resultEl = document.getElementById("teach-spell-result");
  const container = document.getElementById("teach-spell-grid");

nameEl.textContent = follower.name;
nameEl.style.color = "#ffffff";
resultEl.style.color = "#ffffff";
  container.innerHTML = "";
  resultEl.textContent = "";
  
  if (!teachSpellViewCultureId || !CULTURES[teachSpellViewCultureId]) {
    teachSpellViewCultureId = Object.keys(CULTURES)[0];
  }
  
  // Culture tabs row
  const cultureTabsRow = document.createElement("div");
  cultureTabsRow.className = "cc-grid";
  cultureTabsRow.style.marginBottom = "18px";
  
  Object.values(CULTURES).forEach((culture) => {
    const tabCard = document.createElement("div");
    tabCard.className = "cc-card";
    if (teachSpellViewCultureId === culture.id) tabCard.classList.add("selected");
    tabCard.style.setProperty("--card-accent", culture.accentColor);
    tabCard.innerHTML = `
      <div class="cc-card-name">${culture.name}</div>
      <div class="cc-card-desc"><em>Click to explore</em></div>
      <div class="cc-card-image" style="background-image: url('../assets/images/cultures/${culture.id}-icon.png')"></div>
    `;
    tabCard.addEventListener("click", () => {
      teachSpellViewCultureId = culture.id;
      renderTeachSpellScreen();
    });
    cultureTabsRow.appendChild(tabCard);
  });
  
  container.appendChild(cultureTabsRow);
  
  // Selected culture info
  const culture = CULTURES[teachSpellViewCultureId];
  
  const cultureHeading = document.createElement("div");
  cultureHeading.className = "cc-category-heading";
  cultureHeading.textContent = `${culture.name} --- ${culture.magicName}`;
  container.appendChild(cultureHeading);
  
  const cultureDesc = document.createElement("div");
  cultureDesc.className = "cc-card-desc";
  cultureDesc.style.marginBottom = "14px";
  cultureDesc.textContent = culture.magicDescription;
  container.appendChild(cultureDesc);
  
  // Spell lines for selected culture
  culture.magicSkillIds.forEach((skillId) => {
    const skill = SKILLS[skillId];
    const allSpells = SPELLS[skillId] || [];
    
    if (!skill || allSpells.length === 0) return;
    
    const subHeading = document.createElement("div");
    subHeading.className = "cc-culture-subheading";
    subHeading.style.setProperty("--card-accent", culture.accentColor);
    subHeading.style.color = "#ffffff !important";
    subHeading.innerHTML = `<span style="color: #ffffff !important;">${skill.name}</span>`;
    container.appendChild(subHeading);
    
    const lineDesc = document.createElement("div");
    lineDesc.className = "cc-card-desc";
    lineDesc.style.marginBottom = "10px";
    lineDesc.textContent = skill.description;
    container.appendChild(lineDesc);
    
    const grid = document.createElement("div");
    grid.className = "cc-grid";
    
    const knownIds = (follower.knownSpells && follower.knownSpells[skillId]) || [];
    
    allSpells.forEach((spell) => {
      const isKnown = knownIds.includes(spell.id);
      const isActive = (follower.activeSpellIds || []).includes(spell.id);
      
      const card = document.createElement("div");
      card.className = "cc-card";
      if (isKnown && isActive) card.classList.add("selected");
      card.style.setProperty("--card-accent", culture.accentColor);
      
      const statusLabel = !isKnown ? "Click to teach" : (isActive ? "Active" : "Known (benched)");
      
      card.innerHTML = `
      <div class="cc-card-name">${spell.name}</div>
      <div class="cc-card-desc">${spell.description}</div>
      <div class="cc-card-desc"><em>${statusLabel}</em></div>
      <div class="cc-card-image" style="background-image: url('../assets/images/spells/${culture.id}/${spell.id}.png')"></div>
    `;
      card.addEventListener("click", () => {
        if (isKnown) {
          const nowActive = toggleActiveSpell(follower, spell.id);
          resultEl.textContent = nowActive
            ? `${spell.name} is now active for ${follower.name}.`
            : `${spell.name} is now benched for ${follower.name}.`;
        } else {
          if (!follower.skills[skillId]) {
            follower.skills[skillId] = { timesUsed: 0 };
          }
          if (!follower.knownSpells) follower.knownSpells = {};
          if (!follower.knownSpells[skillId]) follower.knownSpells[skillId] = [];
          follower.knownSpells[skillId].push(spell.id);
          if ((follower.activeSpellIds || []).length < 4) {
            toggleActiveSpell(follower, spell.id);
          }
          resultEl.textContent = `${follower.name} has learned ${spell.name}.`;
        }
        renderTeachSpellScreen();
        saveGameState();
      });
      
      grid.appendChild(card);
    });
    
    container.appendChild(grid);
  });
  
  if (container.innerHTML.includes("cc-grid") === false) {
    container.innerHTML = '<div class="cc-skill-count">They already know every spell.</div>';
  }
}
document.getElementById("btn-teach-skill-back").addEventListener("click", goToPartyScreen);
document.getElementById("btn-teach-spell-back").addEventListener("click", goToPartyScreen);
document.getElementById("btn-dungeon-difficulty-back").addEventListener("click", goToDungeonSelectScreen);
document.getElementById("btn-dungeon-difficulty-enter").addEventListener("click", confirmEnterDungeon);
document.getElementById("btn-training-grounds").addEventListener("click", goToTrainingDifficultyScreen);
document.getElementById("btn-training-difficulty-back").addEventListener("click", goToHomebaseScreen);
document.getElementById("btn-dungeon-select-back").addEventListener("click", goToHomebaseScreen);
document.getElementById("btn-training-difficulty-enter").addEventListener("click", startTrainingGauntlet);

try {
  const oldSave = localStorage.getItem("burrowsOfCairntirSave");
  if (oldSave && !localStorage.getItem(getSaveKey(1))) {
    localStorage.setItem(getSaveKey(1), oldSave);
    localStorage.removeItem("burrowsOfCairntirSave");
  }
} catch (e) {}

const existingSaveSummaries = getAllSaveSummaries();
if (existingSaveSummaries.length > 0) {
  goToChooseHeroScreen();
} else {
  renderRaceGrid();
  renderPortraitGrid();
  renderSkillGrid();
  renderStartingSpellsGrid();
  renderTraitGrid();
  renderCombatStyleGrid();
  playMusic(MAIN_THEME_SRC);
}
