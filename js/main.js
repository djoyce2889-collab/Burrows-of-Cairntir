/* ============================================================
   MAIN.JS
   ============================================================ */

const creationState = {
  mode: "player",
  race: null,
  culture: null,
  skills: [],
  traits: []
};

let selectedDungeonId = null;
let currentDungeonRoomId = null;
let combatReturnRoomId = null;
let selectedDifficulty = "normal";
let craftingCategory = "weapon";
let craftingEnchantSlotPending = null;
let voiceEnabled = true;
let cachedVoice = null;

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

function speak(text) {
  if (!voiceEnabled || !text) return;
  if (!("speechSynthesis" in window)) return;

  const plainText = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (!plainText) return;

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

function setGameViewportImage(src, altText) {
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

function resetCreationState(mode) {
  creationState.mode = mode;
  creationState.race = null;
  creationState.culture = null;
  creationState.skills = [];
  creationState.traits = [];
  document.getElementById("cc-name").value = "";

  renderRaceGrid();
  renderCultureGrid();
  renderSkillGrid();
  renderTraitGrid();
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
      renderRaceGrid();
    });
    grid.appendChild(card);
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
      const legalIds = getAvailableStartingSkills(culture.id).map((s) => s.id);
      creationState.skills = creationState.skills.filter((id) => legalIds.includes(id));

      renderCultureGrid();
      renderSkillGrid();
    });
    grid.appendChild(card);
  });
}

function renderSkillGrid() {
  const container = document.getElementById("cc-skill-grid");
  const countLabel = document.getElementById("cc-skill-count");
  container.innerHTML = "";

  const availableSkills = creationState.culture
    ? getAvailableStartingSkills(creationState.culture)
    : Object.values(SKILLS).filter((s) => !s.cultureLocked);

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
      card.innerHTML = `
        <div class="cc-card-name">${skill.name}</div>
        <div class="cc-card-desc">${skill.description}</div>
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

function attemptConfirmCharacter() {
  const errorEl = document.getElementById("cc-error");
  const name = document.getElementById("cc-name").value.trim();

  if (!name) {
    errorEl.textContent = "Your character needs a name.";
    return;
  }
  if (!creationState.race) {
    errorEl.textContent = "Choose a race.";
    return;
  }
  if (!creationState.culture) {
    errorEl.textContent = "Choose a culture.";
    return;
  }
  if (creationState.skills.length === 0) {
    errorEl.textContent = "Choose at least one starting skill.";
    return;
  }
  if (creationState.traits.length < TRAIT_SELECTION_MIN) {
    errorEl.textContent = `Choose at least ${TRAIT_SELECTION_MIN} traits.`;
    return;
  }

  errorEl.textContent = "";

  const newCharacter = createCharacter(
    name,
    creationState.race,
    creationState.culture,
    creationState.skills,
    creationState.traits
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

  if (playerCharacter) {
    playerCharacter.currentHP = getHitPoints(playerCharacter);
    refillMana(playerCharacter);
  }
  followers.forEach((follower) => {
    follower.currentHP = getHitPoints(follower);
    refillMana(follower);
  });
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

function renderDungeonRoom(roomId) {
  const dungeonData = DUNGEON_CONTENT[selectedDungeonId];
  const room = dungeonData.rooms[roomId];
  currentDungeonRoomId = roomId;

  showScreen("screen-game");
  setGameViewportImage(DUNGEONS[selectedDungeonId].image, DUNGEONS[selectedDungeonId].name);

  let text = room.text;
  if (room.loot && !room._lootGranted) {
    room.loot.forEach((itemName) => playerCharacter.inventory.push(itemName));
    text += `<br /><br />You find: ${room.loot.join(", ")}.`;
    room._lootGranted = true;
  }

  speak(text);

  const maxHP = getHitPoints(playerCharacter);
  const hpLine = `Hit Points: ${playerCharacter.currentHP} / ${maxHP}`;
  const manaLine = getManaStatusLine();
  text += `<br /><br />${hpLine}`;
  if (manaLine) text += `<br />${manaLine}`;

  document.getElementById("game-story-text").innerHTML = text;

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
    } else if (choice.type === "discover") {
      addChoiceButton(choicesEl, choice.label, () => {
        discoverSpell(playerCharacter, choice.skillId, choice.spellId);
        renderDungeonRoom(choice.target);
      });
    } else if (choice.type === "end") {
      addChoiceButton(choicesEl, choice.label, () => {
        goToHomebaseScreen();
      });
    }
  });
}

function goToCombatScreen(enemyId, returnRoomId) {
  combatReturnRoomId = returnRoomId || null;
  showScreen("screen-game");
  startCombat(enemyId);

  const enemyTemplate = ENEMIES[enemyId];
  setGameViewportImage(enemyTemplate.image, enemyTemplate.name);
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
  return parts.join(" &middot; ");
}

function getActorImageForLogEntry(entry) {
  if (entry.actor === "enemy") {
    const enemyTemplate = ENEMIES[currentCombat.enemyId];
    return enemyTemplate ? enemyTemplate.image : null;
  }
  const raceInfo = RACES[playerCharacter.raceId];
  return raceInfo ? raceInfo.image : null;
}

/**
 * Plays a set of NEW combat log entries one at a time — each
 * gets its own portrait and its own line of text. Unlike before,
 * this now waits for the SPOKEN LINE to actually finish (using
 * the browser's utterance "onend" event) before moving to the
 * next one, instead of a fixed timer that could cut long lines
 * off mid-sentence. A safety fallback timer (scaled to the
 * line's length) still exists in case onend never fires, and if
 * voice is turned off entirely, it falls back to a short fixed
 * pause between lines instead.
 */
function playRoundSequenceThenRender(entries) {
  if (!entries || entries.length === 0) {
    renderCombatScreen();
    return;
  }

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

    setGameViewportImage(getActorImageForLogEntry(entry), "");
    document.getElementById("game-story-text").innerHTML = line;
    document.getElementById("game-choices").innerHTML = "";

    const plainText = line.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    if (voiceEnabled && "speechSynthesis" in window && plainText) {
      try {
        window.speechSynthesis.cancel();
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

        const fallbackMs = Math.max(1800, plainText.length * 65);
        setTimeout(advanceOnce, fallbackMs);

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        setTimeout(showNext, 1400);
      }
    } else {
      setTimeout(showNext, 1400);
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

  const trainedSkillIds = Object.keys(playerCharacter.skills);

  const weaponSkillIds = trainedSkillIds.filter((id) => SKILLS[id].category === "Weapon");
  if (!weaponSkillIds.includes("unarmedCombat")) {
    weaponSkillIds.push("unarmedCombat");
  }
  weaponSkillIds.forEach((skillId) => {
    addChoiceButton(choicesEl, `Attack - ${SKILLS[skillId].name}`, () => {
      const startIndex = currentCombat.log.length;
      performPlayerAction(skillId);
      playRoundSequenceThenRender(currentCombat.log.slice(startIndex));
    });
  });

  const magicSkillIds = trainedSkillIds.filter((id) => SKILLS[id].category === "Magic");
  const hasEnoughMana = playerCharacter.currentMana >= MANA_CONFIG.costPerCast;

  magicSkillIds.forEach((skillId) => {
    const knownIds = (playerCharacter.knownSpells && playerCharacter.knownSpells[skillId]) || [];
    const allSpellsForLine = SPELLS[skillId] || [];
    const knownSpells = allSpellsForLine.filter((spell) => knownIds.includes(spell.id));

    knownSpells.forEach((spell) => {
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
    const loot = claimVictoryLoot();
    const outcomeText = `${currentCombat.enemyName} falls. You recover: ${loot.join(", ") || "nothing of note"}.`;
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
    const outcomeText = `Everything goes dark. ${playerCharacter.name} falls before ${currentCombat.enemyName}. You wake later, battered but alive, back at Homebase.`;
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
  const usableRecipes = recipes.filter((recipe) => {
    const hasCraftingSkill = !!playerCharacter.skills[recipe.craftingSkill];
    const hasLinkedSkill = !recipe.linkedSkill || !!playerCharacter.skills[recipe.linkedSkill];
    return hasCraftingSkill && hasLinkedSkill;
  });

  if (usableRecipes.length === 0) {
    resultEl.innerHTML = "You don't have the right skills trained yet to craft anything in this category.";
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

  Object.values(ENCHANTMENT_TYPES).forEach((type) => {
    const card = document.createElement("div");
    card.className = "cc-card";
    card.innerHTML = `
      <div class="cc-card-name">${type.name}</div>
      <div class="cc-card-desc">${type.description}</div>
    `;
    card.addEventListener("click", () => {
      attemptEnchant(craftingEnchantSlotPending, type.id);
    });
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
  if (!voiceEnabled && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
});

document.getElementById("btn-begin").addEventListener("click", () => {
  playMusic(MAIN_THEME_SRC);
  resetCreationState("player");
  showScreen("screen-creation");
});

document.getElementById("btn-confirm-character").addEventListener("click", attemptConfirmCharacter);

document.getElementById("btn-add-follower").addEventListener("click", () => {
  resetCreationState("follower");
  showScreen("screen-creation");
});

document.getElementById("btn-continue-to-homebase").addEventListener("click", goToHomebaseScreen);

document.getElementById("btn-continue-to-dungeon-select").addEventListener("click", goToDungeonSelectScreen);

document.getElementById("btn-go-to-crafting").addEventListener("click", goToCraftingScreen);

document.getElementById("btn-crafting-back").addEventListener("click", goToHomebaseScreen);

renderRaceGrid();
renderCultureGrid();
renderSkillGrid();
renderTraitGrid();
renderDifficultyGrid();
playMusic(MAIN_THEME_SRC);