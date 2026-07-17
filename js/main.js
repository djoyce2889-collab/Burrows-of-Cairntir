
/* ============================================================
   MAIN.JS
   ============================================================ */

const creationState = {
  mode: "player",
  name: "",
  race: null,
  culture: null,
  skills: [],
  traits: [],
  combatStyle: "single",
  portraitImage: null
};

const CREATION_STEP_SCREENS = [
  "screen-creation-step1",
  "screen-creation-step2",
  "screen-creation-step3",
  "screen-creation-step4",
  "screen-creation-step5",
  "screen-creation-review"
];

let selectedDungeonId = null;
let currentDungeonRoomId = null;
let combatReturnRoomId = null;
let selectedDifficulty = "normal";
let craftingCategory = "weapon";
let craftingEnchantSlotPending = null;
let voiceEnabled = true;
let cachedVoice = null;

const SPECTRAL_COMPANION_IMAGE = "assets/images/effects/spectral-companion.png";
const ATTACK_MISS_SFX = "assets/audio/sfx/attack-miss.mp3";
const HEAL_CAST_SFX = "assets/audio/sfx/heal-cast.mp3";

const MAIN_THEME_SRC = "assets/audio/main-theme.mp3";
const gameMusic = new Audio();
gameMusic.loop = true;
gameMusic.volume = 0.4;

function playMusic(src) {
  if (!src) return;
  try {
    if (gameMusic.getAttribute("src") !== src) {
      gameMusic.src = src;
    }
    gameMusic.play().catch(() => {});
  } catch (e) {}
}

function playSfx(path) {
  if (!path) return;
  try {
    const sfx = new Audio(path);
    sfx.volume = 0.6;
    sfx.play().catch(() => {});
  } catch (e) {}
}

function playWeaponSfx(skillId) {
  if (skillId === "swords" || skillId === "axes") {
    playSfx("assets/audio/sfx/weapon-slash.mp3");
  }
}

function getSpellSfxPath(spellName) {
  if (!spellName) return null;
  const text = spellName.toLowerCase();
  if (/fire|flame|ember|burn|blaze/.test(text)) return "assets/audio/sfx/fire-cast.mp3";
  if (/frost|ice|chill|freeze|winter/.test(text)) return "assets/audio/sfx/frost-cast.mp3";
  if (/storm|thunder|lightning|spark|bolt|shock/.test(text)) return "assets/audio/sfx/lightning-cast.mp3";
  return null;
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

// ----------------------------------------------------------
// PRE-RECORDED ROOM NARRATION
// narrationAudio plays real recorded room narration files when
// they exist, falling back to the browser's built-in voice
// (via speak()) when they don't. stopAllNarration() is the
// single choke point that kills BOTH sources at once — the
// recorded audio AND the browser voice — plus invalidates any
// in-flight file-existence check via narrationRequestId. It's
// called at the start of every place new speech is about to
// happen (room narration, combat lines, discovery outcomes,
// combat outcomes), so a lingering recording from a room the
// player just left can never keep playing underneath something
// new — which was the actual cause of narration "overriding."
// ----------------------------------------------------------
const narrationAudio = new Audio();
let narrationRequestId = 0;

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
}

function speak(text) {
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
        narrationAudio.play().catch(() => {
          if (thisRequestId === narrationRequestId) speak(fallbackText);
        });
      } catch (e) {
        speak(fallbackText);
      }
    } else {
      speak(fallbackText);
    }
  });
}

function setGameViewportImage(src, altText, glow, shake, flash) {
  const img = document.getElementById("game-viewport-img");
  const placeholder = document.getElementById("game-viewport-placeholder");
  if (src) {
    img.src = src;
    img.alt = altText || "";
    img.style.display = "block";
    placeholder.style.display = "none";
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

  img.classList.remove("victory-pulse");
  img.classList.remove("defeat-fade");
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

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.remove("active");
  });
  document.getElementById(screenId).classList.add("active");
}

function addChoiceButton(container, label, onClick, disabled) {
  const btn = document.createElement("button");
  btn.className = "choice-button";
  btn.textContent = label;
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
  if (CREATION_STEP_SCREENS[index] === "screen-creation-review") {
    renderReviewScreen();
  }
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
  document.getElementById("cc-name").value = "";
  document.getElementById("cc-error-step1").textContent = "";
  document.getElementById("cc-error-step2").textContent = "";
  document.getElementById("cc-error-step3").textContent = "";
  document.getElementById("cc-error-step4").textContent = "";

  renderRaceGrid();
  renderPortraitGrid();
  renderCultureGrid();
  renderSkillGrid();
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
      creationState.race = race.id;
      creationState.portraitImage = null;
      renderRaceGrid();
      renderPortraitGrid();
    });
    grid.appendChild(card);
  });
}

function buildPortraitOptions(raceId) {
  const options = [];

  options.push({ path: `assets/images/characters/${raceId}.png`, label: "Classic (Male)" });
  options.push({ path: `assets/images/characters/${raceId}-female.png`, label: "Classic (Female)" });

  ARCHETYPES.forEach((arch) => {
    options.push({
      path: `assets/images/characters/archetypes/${arch.fileSlug}-male.png`,
      label: `${arch.name} (Male)`
    });
    options.push({
      path: `assets/images/characters/archetypes/${arch.fileSlug}-female.png`,
      label: `${arch.name} (Female)`
    });
  });

  ARCHETYPES.forEach((arch) => {
    options.push({
      path: `assets/images/characters/full-set/${raceId}-male-${arch.fileSlug}.png`,
      label: `${RACES[raceId].name} ${arch.name} (Male)`
    });
    options.push({
      path: `assets/images/characters/full-set/${raceId}-female-${arch.fileSlug}.png`,
      label: `${RACES[raceId].name} ${arch.name} (Female)`
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

function renderCultureGrid() {
  const grid = document.getElementById("cc-culture-grid");
  grid.innerHTML = "";

  Object.values(CULTURES).forEach((culture) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    card.style.setProperty("--card-accent", culture.accentColor);
    if (creationState.culture === culture.id) card.classList.add("selected");
    card.innerHTML = `
      <div class="cc-card-name">${culture.name}</div>
      <div class="cc-card-desc">${culture.tagline}</div>
      <div class="cc-card-desc">${culture.magicName} &middot; ${culture.socialStructure}</div>
    `;
    card.addEventListener("click", () => {
      creationState.culture = culture.id;
      renderCultureGrid();
    });
    grid.appendChild(card);
  });
}

function renderSkillGrid() {
  const container = document.getElementById("cc-skill-grid");
  const countLabel = document.getElementById("cc-skill-count");
  container.innerHTML = "";

  const availableSkills = Object.values(SKILLS);

  const atLimit = creationState.skills.length >= MAX_STARTING_SKILLS;
  countLabel.textContent = `Chosen ${creationState.skills.length} / ${MAX_STARTING_SKILLS}`;
  countLabel.classList.toggle("limit-reached", atLimit);

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
      const isSelected = creationState.skills.includes(skill.id);
      card.className = "cc-card";
      if (isSelected) card.classList.add("selected");

      let cultureLabel = "";
      if (skill.category === "Magic") {
        const owningCulture = Object.values(CULTURES).find((c) => c.magicSkillIds.includes(skill.id));
        if (owningCulture) {
          cultureLabel = `<div class="cc-card-desc"><em>Associated with the ${owningCulture.name}</em></div>`;
        }
      }

      card.innerHTML = `
        <div class="cc-card-name">${skill.name}</div>
        <div class="cc-card-desc">${skill.description}</div>
        ${cultureLabel}
      `;

      card.addEventListener("click", () => {
        if (isSelected) {
          creationState.skills = creationState.skills.filter((id) => id !== skill.id);
        } else if (!atLimit) {
          creationState.skills.push(skill.id);
        }
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
    `;

    card.addEventListener("click", () => {
      if (isSelected) {
        creationState.traits = creationState.traits.filter((id) => id !== trait.id);
      } else if (!atLimit) {
        creationState.traits.push(trait.id);
      }
      renderTraitGrid();
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
    <div class="cc-card-desc">${race ? race.name : ""} of the ${culture ? culture.name : ""}</div>
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
    creationState.portraitImage
  );

  if (creationState.mode === "player") {
    playerCharacter = newCharacter;
  } else {
    followers.push(newCharacter);
  }

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

    const card = document.createElement("div");
    card.className = "cc-card";
    card.style.setProperty("--card-accent", culture.accentColor);
    card.innerHTML = `
      <div class="cc-card-name">${follower.name}</div>
      <div class="cc-card-desc">${race.name} of the ${culture.name}</div>
      <div class="cc-card-desc">Skills: ${skillNames}</div>
      <div class="cc-card-desc">Traits: ${traitNames}</div>
    `;

    const removeBtn = document.createElement("button");
    removeBtn.className = "follower-remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      followers.splice(index, 1);
      renderPartyScreen();
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

function renderEquipSection() {
  const weaponGrid = document.getElementById("equip-weapon-grid");
  const armorGrid = document.getElementById("equip-armor-grid");
  weaponGrid.innerHTML = "";
  armorGrid.innerHTML = "";

  const trainedWeaponIds = Object.keys(playerCharacter.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Weapon"
  );
  if (!trainedWeaponIds.includes("unarmedCombat")) {
    trainedWeaponIds.push("unarmedCombat");
  }
  trainedWeaponIds.forEach((skillId) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    if (playerCharacter.equippedWeaponSkill === skillId) card.classList.add("selected");
    card.innerHTML = `<div class="cc-card-name">${SKILLS[skillId].name}</div>`;
    card.addEventListener("click", () => {
      setEquippedWeapon(playerCharacter, skillId);
      renderEquipSection();
    });
    weaponGrid.appendChild(card);
  });

  const trainedArmorIds = Object.keys(playerCharacter.skills).filter(
    (id) => SKILLS[id] && SKILLS[id].category === "Armor"
  );
  if (trainedArmorIds.length === 0) {
    armorGrid.innerHTML = '<div class="cc-skill-count">No armor trained yet.</div>';
  } else {
    trainedArmorIds.forEach((skillId) => {
      const card = document.createElement("div");
      card.className = "cc-card";
      if (playerCharacter.equippedArmorSkill === skillId) card.classList.add("selected");
      card.innerHTML = `<div class="cc-card-name">${SKILLS[skillId].name}</div>`;
      card.addEventListener("click", () => {
        setEquippedArmor(playerCharacter, skillId);
        renderEquipSection();
      });
      armorGrid.appendChild(card);
    });
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
    } else {
      equipmentCounts[itemName] = (equipmentCounts[itemName] || 0) + 1;
    }
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
      const card = document.createElement("div");
      card.className = "cc-card";
      card.innerHTML = `
        <div class="cc-card-name">${name}</div>
        <div class="cc-card-desc">${count > 1 ? `Quantity: ${count}` : "Carried"}</div>
      `;
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
    `;
    grid.appendChild(card);
    list.appendChild(grid);
  }
}

function goToDungeonSelectScreen() {
  showScreen("screen-dungeon-select");
  renderDungeonList();
}

function renderDungeonList() {
  const list = document.getElementById("dungeon-list");
  list.innerHTML = "";

  Object.values(DUNGEONS).forEach((dungeon) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    card.innerHTML = `
      <div class="cc-card-name">${dungeon.name}</div>
      <div class="cc-card-desc"><em>Difficulty: ${dungeon.difficulty}</em></div>
      <div class="cc-card-desc">${dungeon.description}</div>
    `;
    card.addEventListener("click", () => {
      selectedDungeonId = dungeon.id;
      resetDungeonCompanionState();
      if (DUNGEON_CONTENT[dungeon.id]) {
        enterDungeon(dungeon.id);
      } else {
        enterPlaceholderDungeon(dungeon);
      }
    });
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
  const used = choice._attempts || 0;
  if (used > 0 && used < 3) {
    const remaining = 3 - used;
    return `${choice.label} (${remaining} ${remaining === 1 ? "try" : "tries"} left)`;
  }
  return choice.label;
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
        const success = rollSuccess(tierBeforeName, choice.difficulty);
        renderDungeonRoom(success ? choice.successTarget : choice.failureTarget);
      });
    } else if (choice.type === "combat") {
      addChoiceButton(choicesEl, choice.label, () => {
        goToCombatScreen(choice.enemyId, choice.target);
      });
    } else if (choice.type === "discover" || choice.type === "learnSkill") {
      addChoiceButton(choicesEl, getAttemptLabel(choice), () => attemptDiscoverOrLearn(room, choice));
    } else if (choice.type === "end") {
      addChoiceButton(choicesEl, choice.label, () => {
        goToHomebaseScreen();
      });
    }
  });
}

function attemptDiscoverOrLearn(room, choice) {
  choice._attempts = (choice._attempts || 0) + 1;

  let tierName;
  let difficulty;
  if (choice.type === "discover") {
    tierName = getCharacterSkillTier(playerCharacter, choice.skillId).name;
    difficulty = "Adept";
  } else {
    tierName = "Untrained";
    difficulty = "Novice";
  }

  const success = rollSuccess(tierName, difficulty);

  if (success) {
    let message;
    if (choice.type === "discover") {
      const spell = discoverSpell(playerCharacter, choice.skillId, choice.spellId);
      message = spell
        ? `After several attempts, it finally clicks — you have learned ${spell.name}.`
        : "You study it again, though you already know what it teaches.";
    } else {
      learnNewSkill(playerCharacter, choice.skillId);
      message = `After several attempts, it finally clicks — you have learned ${SKILLS[choice.skillId].name}.`;
    }
    renderDiscoveryOutcome(message, choice.target);
    return;
  }

  if (choice._attempts >= 3) {
    const message =
      choice.type === "discover"
        ? "After three failed attempts, the technique still eludes you. You give up for now and move on."
        : "After three failed attempts, it still doesn't click. You give up for now and move on.";
    renderDiscoveryOutcome(message, choice.target);
    return;
  }

  const remaining = 3 - choice._attempts;
  const failMessage = `You fail to grasp it this time. (${remaining} ${remaining === 1 ? "attempt" : "attempts"} left.)`;
  speak(failMessage);
  document.getElementById("game-story-text").innerHTML = `${room.text}<br /><br /><em>${failMessage}</em>`;
  buildRoomChoices(room);
}

function renderDiscoveryOutcome(message, targetRoomId) {
  const storyEl = document.getElementById("game-story-text");
  const choicesEl = document.getElementById("game-choices");
  speak(message);
  storyEl.innerHTML = message;
  choicesEl.innerHTML = "";
  addChoiceButton(choicesEl, "Continue", () => renderDungeonRoom(targetRoomId));
}

function renderDungeonRoom(roomId) {
  const dungeonData = DUNGEON_CONTENT[selectedDungeonId];
  const room = dungeonData.rooms[roomId];
  currentDungeonRoomId = roomId;

  showScreen("screen-game");
  setGameViewportImage(getRoomImage(selectedDungeonId, roomId), DUNGEONS[selectedDungeonId].name);

  let text = room.text;
  if (room.loot && !room._lootGranted) {
    room.loot.forEach((itemName) => playerCharacter.inventory.push(itemName));
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
}

function goToCombatScreen(enemyId, returnRoomId) {
  combatReturnRoomId = returnRoomId || null;
  showScreen("screen-game");
  startCombat(enemyId);

  const enemyTemplate = ENEMIES[enemyId];
  setGameViewportImage(enemyTemplate.image, enemyTemplate.name);
  stopAllNarration();
  speak(`${enemyTemplate.name}. ${enemyTemplate.description}`);

  renderCombatScreen();
}

function getFollowerStatusLine() {
  if (!followers || followers.length === 0) return "";
  return followers
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
      return follower.portraitImage || (RACES[follower.raceId] ? RACES[follower.raceId].image : null);
    }
  }
  return playerCharacter.portraitImage || (RACES[playerCharacter.raceId] ? RACES[playerCharacter.raceId].image : null);
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

    if (isMeleeHit && (entry.actor === "player" || entry.actor === "follower")) {
      playWeaponSfx(entry.skillId);
    } else if (entry.actor === "enemy" && entry.hit) {
      const enemySfx = currentCombat.enemyAttackType === "physical"
        ? "assets/audio/sfx/weapon-slash.mp3"
        : getSpellSfxPath(currentCombat.enemyName);
      playSfx(enemySfx);
    }

    if (isSpellCast) {
      if (entry.spellType === "heal") {
        playSfx(HEAL_CAST_SFX);
      } else {
        playSfx(getSpellSfxPath(entry.spellName));
      }
    }

    if (entry.actor === "follower" && entry.action === "heal") {
      playSfx(HEAL_CAST_SFX);
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

    if (voiceEnabled && "speechSynthesis" in window && plainText) {
      try {
        const utterance = new SpeechSynthesisUtterance(plainText);
        utterance.rate = 1;
        utterance.pitch = 1;
        const voice = getPreferredVoice();
        if (voice) utterance.voice = voice;

        let advanced = false;
        const advanceOnce = () => {
          if (advanced) return;
          advanced = true;
          showNext();
        };

        utterance.onend = advanceOnce;
        utterance.onerror = advanceOnce;

        const fallbackMs = Math.max(2200, plainText.length * 110);
        setTimeout(advanceOnce, fallbackMs);

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setTimeout(showNext, 1600);
      }
    } else {
      setTimeout(showNext, 1600);
    }
  }

  showNext();
}

function renderCombatScreen() {
  if (currentCombat.result) {
    renderCombatOutcome();
    return;
  }

  const storyEl = document.getElementById("game-story-text");
  const choicesEl = document.getElementById("game-choices");
  const maxHP = getHitPoints(playerCharacter);
  const manaMax = getManaPoolMax(playerCharacter);
  const enemyCondition = getEnemyConditionText();
  const effectsSummary = getActiveEffectsSummary();
  const followerLine = getFollowerStatusLine();
  const equipmentLine = getEquipmentStatusLine();

  storyEl.innerHTML = `
    <strong>${currentCombat.enemyName}</strong> (${enemyCondition})<br />
    ${currentCombat.enemyDescription}<br /><br />
    Your Hit Points: ${playerCharacter.currentHP} / ${maxHP}
    ${manaMax > 0 ? "<br />Your Mana: " + playerCharacter.currentMana + " / " + manaMax : ""}
    ${followerLine ? "<br />Party: " + followerLine : ""}
    ${equipmentLine ? "<br />" + equipmentLine : ""}
    ${effectsSummary ? "<br />" + effectsSummary : ""}
  `;

  choicesEl.innerHTML = "";

  const equippedWeaponId = playerCharacter.equippedWeaponSkill || "unarmedCombat";
  addChoiceButton(choicesEl, `Attack - ${SKILLS[equippedWeaponId].name}`, () => {
    const startIndex = currentCombat.log.length;
    performPlayerAction(equippedWeaponId);
    playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
  });

  const trainedSkillIds = Object.keys(playerCharacter.skills);
  const magicSkillIds = trainedSkillIds.filter((id) => SKILLS[id].category === "Magic");
  const hasEnoughMana = playerCharacter.currentMana >= MANA_CONFIG.costPerCast;

  magicSkillIds.forEach((skillId) => {
    const knownIds = (playerCharacter.knownSpells && playerCharacter.knownSpells[skillId]) || [];
    const allSpellsForLine = SPELLS[skillId] || [];
    const knownSpells = allSpellsForLine.filter((spell) => knownIds.includes(spell.id));

    knownSpells.forEach((spell) => {
      if (spell.type === "companion" && dungeonCompanionUsed) {
        return;
      }
      if (hasEnoughMana) {
        addChoiceButton(choicesEl, `Cast - ${spell.name} (${MANA_CONFIG.costPerCast} mana): ${spell.description}`, () => {
          const startIndex = currentCombat.log.length;
          performPlayerCast(skillId, spell);
          playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
        });
      } else {
        addChoiceButton(choicesEl, `Cast - ${spell.name} (not enough mana)`, null, true);
      }
    });
  });

  addChoiceButton(choicesEl, "Defend", () => {
    const startIndex = currentCombat.log.length;
    performPlayerDefend();
    playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
  });

  addChoiceButton(choicesEl, "Flee", () => {
    const startIndex = currentCombat.log.length;
    performPlayerFlee();
    playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
  });
}

function renderCombatOutcome() {
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
    const outcomeText = `${currentCombat.enemyName} falls. You recover: ${loot.join(", ") || "nothing of note"}.`;
    stopAllNarration();
    speak(outcomeText);
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
  } else if (currentCombat.result === "defeat") {
    applyDefeatFade();

    const outcomeText = `Everything goes dark. ${playerCharacter.name} falls before ${currentCombat.enemyName}. You wake later, battered but alive, back at Homebase.`;
    stopAllNarration();
    speak(outcomeText);
    storyEl.innerHTML = `
      Everything goes dark. <strong>${playerCharacter.name}</strong> falls before ${currentCombat.enemyName}.<br /><br />
      You wake later, battered but alive, back at Homebase.
    `;
    addChoiceButton(choicesEl, "Return to Homebase", () => {
      currentCombat = null;
      combatReturnRoomId = null;
      goToHomebaseScreen();
    });
  } else if (currentCombat.result === "fled") {
    const outcomeText = `You break away from ${currentCombat.enemyName} and don't look back.`;
    stopAllNarration();
    speak(outcomeText);
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
    weaponCard.innerHTML = `
      <div class="cc-card-name">Enchant Weapon</div>
      <div class="cc-card-desc">Current: ${currentWeaponEnchant}</div>
      <div class="cc-card-desc">Requires: ${ENCHANT_MATERIAL_COST} &times; ${ENCHANT_MATERIAL}</div>
    `;
    weaponCard.addEventListener("click", () => {
      craftingEnchantSlotPending = "weapon";
      renderCraftingScreen();
    });
    list.appendChild(weaponCard);

    const armorCard = document.createElement("div");
    armorCard.className = "cc-card";
    const currentArmorEnchant = playerCharacter.armorEnchantment ? playerCharacter.armorEnchantment.name : "None";
    armorCard.innerHTML = `
      <div class="cc-card-name">Enchant Armor</div>
      <div class="cc-card-desc">Current: ${currentArmorEnchant}</div>
      <div class="cc-card-desc">Requires: ${ENCHANT_MATERIAL_COST} &times; ${ENCHANT_MATERIAL}</div>
    `;
    armorCard.addEventListener("click", () => {
      craftingEnchantSlotPending = "armor";
      renderCraftingScreen();
    });
    list.appendChild(armorCard);
    return;
  }

  const currentEnchantment = craftingEnchantSlotPending === "weapon"
    ? playerCharacter.weaponEnchantment
    : playerCharacter.armorEnchantment;
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
  const resultEl = document.getElementById("crafting-result");
  const have = countMaterial(recipe.material);

  if (have < recipe.materialCost) {
    resultEl.innerHTML = `You need ${recipe.materialCost} &times; ${recipe.material} to attempt this — you only have ${have}.`;
    return;
  }

  const craftingTierBefore = getCharacterSkillTier(playerCharacter, recipe.craftingSkill).name;
  useSkill(playerCharacter, recipe.craftingSkill);

  const success = rollSuccess(craftingTierBefore, "Adept");

  if (success) {
    for (let i = 0; i < recipe.materialCost; i++) {
      const idx = playerCharacter.inventory.indexOf(recipe.material);
      if (idx !== -1) playerCharacter.inventory.splice(idx, 1);
    }
    const craftedName = `${recipe.name} (${craftingTierBefore}-crafted)`;
    playerCharacter.inventory.push(craftedName);
    resultEl.innerHTML = `Success! You craft: <strong>${craftedName}</strong>.`;
  } else {
    resultEl.innerHTML = `The attempt fails. No materials lost — but you've learned something from the mistake.`;
  }

  renderCraftingScreen();
  document.getElementById("crafting-result").innerHTML = resultEl.innerHTML;
}

function attemptEnchant(slot, typeId) {
  const resultEl = document.getElementById("crafting-result");

  const currentEnchantment = slot === "weapon" ? playerCharacter.weaponEnchantment : playerCharacter.armorEnchantment;
  if (currentEnchantment && currentEnchantment.type === typeId) {
    resultEl.innerHTML = `This item is already ${ENCHANTMENT_TYPES[typeId].name}-Enchanted — choose a different type to change it.`;
    return;
  }

  const have = countMaterial(ENCHANT_MATERIAL);

  if (have < ENCHANT_MATERIAL_COST) {
    resultEl.innerHTML = `You need ${ENCHANT_MATERIAL_COST} &times; ${ENCHANT_MATERIAL} to attempt this — you only have ${have}.`;
    return;
  }

  const craftingTierBefore = getCharacterSkillTier(playerCharacter, "enchanting").name;
  useSkill(playerCharacter, "enchanting");

  const success = rollSuccess(craftingTierBefore, "Adept");
  const typeInfo = ENCHANTMENT_TYPES[typeId];

  if (success) {
    for (let i = 0; i < ENCHANT_MATERIAL_COST; i++) {
      const idx = playerCharacter.inventory.indexOf(ENCHANT_MATERIAL);
      if (idx !== -1) playerCharacter.inventory.splice(idx, 1);
    }
    const enchantment = { type: typeId, name: typeInfo.name, tierWhenMade: craftingTierBefore };
    if (slot === "weapon") {
      playerCharacter.weaponEnchantment = enchantment;
    } else {
      playerCharacter.armorEnchantment = enchantment;
    }
    resultEl.innerHTML = `Success! Your ${slot} is now <strong>${typeInfo.name}-Enchanted</strong>.`;
  } else {
    resultEl.innerHTML = `The enchantment fails to take hold. No materials lost — but you've learned something from the mistake.`;
  }

  craftingEnchantSlotPending = null;
  renderCraftingScreen();
  document.getElementById("crafting-result").innerHTML = resultEl.innerHTML;
}

document.getElementById("btn-toggle-music").addEventListener("click", () => {
  if (gameMusic.paused) {
    gameMusic.play();
    document.getElementById("btn-toggle-music").textContent = "\uD83D\uDD0A";
  } else {
    gameMusic.pause();
    document.getElementById("btn-toggle-music").textContent = "\uD83D\uDD07";
  }
});

document.getElementById("btn-toggle-voice").addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  document.getElementById("btn-toggle-voice").textContent = voiceEnabled ? "\uD83D\uDDE3" : "\uD83D\uDEAB";
  if (!voiceEnabled) {
    stopAllNarration();
  }
});

document.getElementById("btn-begin").addEventListener("click", () => {
  playMusic(MAIN_THEME_SRC);
  resetCreationState("player");
  goToCreationStep(0);
});

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

document.getElementById("btn-step2-back").addEventListener("click", () => goToCreationStep(0));
document.getElementById("btn-step2-next").addEventListener("click", () => {
  const errorEl = document.getElementById("cc-error-step2");
  if (!creationState.culture) {
    errorEl.textContent = "Choose a culture.";
    return;
  }
  errorEl.textContent = "";
  goToCreationStep(2);
});

document.getElementById("btn-step3-back").addEventListener("click", () => goToCreationStep(1));
document.getElementById("btn-step3-next").addEventListener("click", () => {
  const errorEl = document.getElementById("cc-error-step3");
  if (creationState.skills.length === 0) {
    errorEl.textContent = "Choose at least one starting skill.";
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

document.getElementById("btn-go-to-skills").addEventListener("click", goToSkillsScreen);

document.getElementById("btn-skills-back").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-go-to-inventory").addEventListener("click", goToInventoryScreen);

document.getElementById("btn-inventory-back").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-continue-to-dungeon-select").addEventListener("click", goToDungeonSelectScreen);

document.getElementById("btn-go-to-crafting").addEventListener("click", goToCraftingScreen);

document.getElementById("btn-crafting-back").addEventListener("click", goToHomebaseScreen);

renderRaceGrid();
renderPortraitGrid();
renderCultureGrid();
renderSkillGrid();
renderTraitGrid();
renderCombatStyleGrid();
renderDifficultyGrid();
playMusic(MAIN_THEME_SRC);
prewarmAllPortraitCaches();
