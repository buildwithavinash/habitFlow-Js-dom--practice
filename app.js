/**************************************************
 * HABITFLOW – FULL APP LOGIC (VANILLA JS)
 * -----------------------------------------------
 * This file controls:
 * - State (habits array)
 * - Rendering UI from state
 * - Events (add, toggle, edit, delete)
 * - Progress calculation
 * - LocalStorage persistence
 * - Daily automatic reset logic
 **************************************************/

/* =================================================
   1. GLOBAL STATE (SOURCE OF TRUTH)
   ================================================= */

// This array holds ALL habit data.
// UI is always created from this array.
let habits = [];


/* =================================================
   2. DOM ELEMENT SELECTION (ONCE)
   ================================================= */

const habitsList = document.querySelector(".habits");          // <ul> that holds habit items
const userInput = document.querySelector(".habit__text");      // input field
const progressBar = document.querySelector(".progress__bar");  // progress bar fill
const progressPercent = document.querySelector(".progress__percent"); // % text
const resetTodayBtn = document.querySelector(".btnReset");     // reset button
const emptyState = document.querySelector(".empty__state");    // "no habits" text
const guide = document.querySelector(".app__guide");           // how-to-use guide
const form = document.querySelector(".habits__input form");    // form wrapper


/* =================================================
   3. LOCAL STORAGE FUNCTIONS
   ================================================= */

/**
 * Save current habits array into localStorage
 * Converts JS array → JSON string
 */
function saveHabits() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

/**
 * Load habits from localStorage (if present)
 * Converts JSON string → JS array
 */
function loadHabits() {
  const savedHabits = localStorage.getItem("habits");

  if (savedHabits) {
    habits = JSON.parse(savedHabits);
  }
}


/* =================================================
   4. RENDERING FUNCTIONS (STATE → UI)
   ================================================= */

/**
 * Renders all habits on the screen.
 * Clears old UI and rebuilds it from `habits` array.
 */
function renderHabits() {
  habitsList.innerHTML = "";

  // Empty state message
  if (habits.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  // Hide guide after first habit
  if (habits.length > 0) {
    guide.style.display = "none";
  }

  // Create each habit item
  habits.forEach(habit => {
    const habitItem = createHabitElement(habit);
    habitsList.append(habitItem);
  });
}

function createHabitElement(habit) {
  const habitItem = document.createElement("li");
  habitItem.classList.add("habit__item");
  habitItem.dataset.id = habit.id;

  if (habit.completed) {
    habitItem.classList.add("completed");
  }

  const habitContainer = document.createElement("div");
  habitContainer.classList.add("habit__container");

  const habitContent = document.createElement("div");
  habitContent.classList.add("habit__content");

  const habitStatus = document.createElement("div");
  habitStatus.classList.add("habit__status");
  habitStatus.textContent = habit.completed ? "Completed" : "Pending";

  const habitInfo = document.createElement("div");
  habitInfo.classList.add("habit__info");

  const habitName = document.createElement("div");
  habitName.classList.add("habit__name");
  habitName.textContent = habit.name;

  const habitStreak = document.createElement("div");
  habitStreak.classList.add("habit__streak");
  habitStreak.textContent = `Streak : ${habit.streak}`;

  const habitActions = document.createElement("div");
  habitActions.classList.add("habit__actions");

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btn", "btnEdit");
  btnEdit.textContent = "Edit";

  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btn", "btnDelete");
  btnDelete.textContent = "Delete";

  habitInfo.append(habitName, habitStreak);
  habitContent.append(habitStatus, habitInfo);
  habitActions.append(btnEdit, btnDelete);
  habitContainer.append(habitContent, habitActions);
  habitItem.append(habitContainer);

  return habitItem;
}


/* =================================================
   5. PROGRESS BAR (DERIVED STATE)
   ================================================= */

/**
 * Calculates progress based on completed habits
 * Updates bar width and percentage text
 */
function updateProgress() {
  const total = habits.length;

  if (total === 0) {
    progressBar.style.width = "0%";
    progressPercent.textContent = "0%";
    return;
  }

  const completed = habits.filter(h => h.completed).length;
  const percent = Math.round((completed / total) * 100);

  progressBar.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
}


/* =================================================
   6. FORM SUBMIT – ADD HABIT
   ================================================= */

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const habitName = userInput.value.trim();
  if (habitName === "") return;

  const newHabit = {
    id: Date.now(),
    name: habitName,
    completed: false,
    streak: 0
  };

  habits.push(newHabit);
  saveHabits();
  renderHabits();
  updateProgress();

  userInput.value = "";
});


/* =================================================
   7. EVENT DELEGATION (TOGGLE / EDIT / DELETE)
   ================================================= */

habitsList.addEventListener("click", function (e) {

  // TOGGLE COMPLETED
  if (e.target.classList.contains("habit__status")) {
    const habitItem = e.target.closest(".habit__item");
    const habitId = Number(habitItem.dataset.id);

    const habit = habits.find(h => h.id === habitId);
    habit.completed = !habit.completed;

    saveHabits();
    renderHabits();
    updateProgress();
  }

  // DELETE HABIT
  if (e.target.classList.contains("btnDelete")) {
    const habitItem = e.target.closest(".habit__item");
    const habitId = Number(habitItem.dataset.id);

    habits = habits.filter(h => h.id !== habitId);

    saveHabits();
    renderHabits();
    updateProgress();
  }

  // EDIT HABIT
  if (e.target.classList.contains("btnEdit")) {
    const habitItem = e.target.closest(".habit__item");
    const habitId = Number(habitItem.dataset.id);

    const habit = habits.find(h => h.id === habitId);
    const newName = prompt("Edit habit name:", habit.name);

    if (newName === null || newName.trim() === "") return;

    habit.name = newName.trim();

    saveHabits();
    renderHabits();
    updateProgress();
  }
});


/* =================================================
   8. DAILY RESET LOGIC
   ================================================= */

/**
 * Resets all habits for a new day
 * Saves reset date to localStorage
 */

resetTodayBtn.addEventListener("click", function () {
  resetHabitsForNewDay();
});


function resetHabitsForNewDay() {
  habits.forEach(h => h.completed = false);
  saveHabits();

  localStorage.setItem("lastResetDate", new Date().toDateString());

  renderHabits();
  updateProgress();
}

/**
 * Checks on app load if a new day has started
 */
function checkDailyResetOnLoad() {
  const lastReset = localStorage.getItem("lastResetDate");
  const today = new Date().toDateString();

  if (lastReset !== today) {
    resetHabitsForNewDay();
  }
}

/**
 * Returns milliseconds until next midnight
 */
function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
}

let dailyResetInterval = null;

/**
 * Starts daily reset timer safely
 */
function startDailyResetTimer() {
  const timeUntilMidnight = getTimeUntilMidnight();

  setTimeout(() => {
    resetHabitsForNewDay();

    if (dailyResetInterval) {
      clearInterval(dailyResetInterval);
    }

    dailyResetInterval = setInterval(
      resetHabitsForNewDay,
      24 * 60 * 60 * 1000
    );
  }, timeUntilMidnight);
}


/* =================================================
   9. APP INITIALIZATION (START POINT)
   ================================================= */

loadHabits();
checkDailyResetOnLoad();
renderHabits();
updateProgress();
startDailyResetTimer();
