// Beta Build: Board button, board picker window (board rows + Create board) and Save button.
// Only the cursor changes instantly. CSS transitions every other change; this script
// switches classes, and keeps the "database" in the browser's localStorage.

const NORMAL = 150; // ms, matches --normal in style.css

const stage = document.querySelector(".stage");
const boardBtn = document.querySelector(".board-btn");
const boardName = document.querySelector(".board-name");
const saveBtn = document.querySelector(".save-btn");
const picker = document.querySelector(".picker");
const search = document.querySelector(".picker-search");
const list = document.querySelector(".picker-list");
const allLabel = document.querySelector(".all-label");
const noResults = document.querySelector(".no-results");
const createRow = document.querySelector(".create");
const createForm = document.querySelector(".create-form");
const createInput = document.querySelector(".create-input");
const createBtn = document.querySelector(".create-btn");

// ===== "Database" (localStorage) =====
const KEY = "idm241-beta-build";
const DEFAULT_STATE = { savedTo: null, lastBoard: "Andys", newBoards: [] };

function loadState() {
  try {
    return Object.assign({}, DEFAULT_STATE, JSON.parse(localStorage.getItem(KEY)));
  } catch (error) {
    return Object.assign({}, DEFAULT_STATE);
  }
}

function saveState() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (error) {
    // Private windows can block storage; the page still works for this visit
  }
}

let state = loadState();

// ===== Board rows =====
function allRows() {
  return [...list.querySelectorAll(".row")];
}

function findBoard(name) {
  const row = allRows().find((r) => r.dataset.board.toLowerCase() === name.toLowerCase());
  return row ? row.dataset.board : null;
}

function addBoardRow(name, grow) {
  const row = document.createElement("div");
  row.className = "row";
  row.dataset.board = name;
  row.innerHTML =
    '<span class="row-thumb" aria-hidden="true"></span>' +
    '<span class="row-name"></span>' +
    '<button type="button" class="row-save">Save</button>';
  row.querySelector(".row-thumb").textContent = name.charAt(0).toUpperCase();
  row.querySelector(".row-name").textContent = name;
  row.querySelector(".row-save").setAttribute("aria-label", "Save to " + name);
  row.addEventListener("click", onRowClick);

  if (grow) {
    // Start at height 0 and opacity 0%, then grow in over 0.2 seconds
    row.classList.add("is-new", "is-growing");
    allLabel.after(row);
    row.getBoundingClientRect();
    row.classList.remove("is-new");
    setTimeout(() => row.classList.remove("is-growing"), 250);
  } else {
    allLabel.after(row);
  }
}

// ===== Board name: fade out, resize the button, fade the new name in =====
function setBoardName(name, animate) {
  if (boardName.textContent === name) return;

  if (!animate) {
    boardName.textContent = name;
    return;
  }

  boardName.classList.add("is-fading");          // old name: opacity 100% -> 0%
  setTimeout(() => {
    const startWidth = boardBtn.offsetWidth;
    boardName.textContent = name;
    boardBtn.style.width = "auto";
    const endWidth = boardBtn.offsetWidth;
    boardBtn.style.width = startWidth + "px";
    boardBtn.getBoundingClientRect();
    boardBtn.style.width = endWidth + "px";      // width grows/shrinks over 0.15s
    boardName.classList.remove("is-fading");     // new name: opacity 0% -> 100%
    setTimeout(() => (boardBtn.style.width = ""), NORMAL + 30);
  }, NORMAL);
}

// ===== Show the current state =====
function render(animate) {
  const saved = state.savedTo !== null;
  stage.classList.toggle("is-saved", saved);     // Save/Saved cross-fade, colors, arrow, underline
  setBoardName(saved ? state.savedTo : state.lastBoard, animate);
  saveBtn.setAttribute("aria-pressed", String(saved));
  saveBtn.setAttribute("aria-label", saved ? "Saved" : "Save");
}

// ===== Saving =====
function saveTo(board) {
  state.savedTo = board;                         // hidden: image card added to the board
  state.lastBoard = board;                       // hidden: default board for the next save
  saveState();                                   // hidden: database updated
  render(true);
}

function unsave() {
  state.savedTo = null;                          // hidden: image card removed from the board
  saveState();                                   // hidden: database updated
  render(true);
}

// ===== Board picker window =====
function isOpen() {
  return stage.classList.contains("is-open");
}

function openPicker() {
  stage.classList.add("is-open");
  boardBtn.setAttribute("aria-expanded", "true");
  setTimeout(() => search.focus({ preventScroll: true }), 50);
}

function closePicker() {
  if (!isOpen()) return;
  stage.classList.remove("is-open");
  boardBtn.setAttribute("aria-expanded", "false");
  if (picker.contains(document.activeElement)) document.activeElement.blur();
  // Once it has finished sliding up (out of view), reset it for next time
  setTimeout(resetPicker, NORMAL + 30);
}

function resetPicker() {
  if (isOpen()) return;
  picker.classList.add("no-anim");
  search.value = "";
  filterRows("");
  stage.classList.remove("is-creating");
  createInput.value = "";
  updateCreateBtn();
  list.scrollTop = 0;
  picker.getBoundingClientRect();
  picker.classList.remove("no-anim");
}

// SEARCH MODE: board rows whose names don't match fade out and collapse
function filterRows(text) {
  const query = text.trim().toLowerCase();
  let shown = 0;
  allRows().forEach((row) => {
    const match = row.dataset.board.toLowerCase().includes(query);
    row.classList.toggle("is-collapsed", !match);
    if (match) shown++;
  });
  noResults.classList.toggle("is-shown", shown === 0);
  document.querySelectorAll(".picker-label").forEach((label) => {
    label.classList.toggle("is-collapsed", query !== "");
  });
}

// ===== Create board =====
function openCreateForm() {
  stage.classList.add("is-creating");          // row fades out, form fades in (0.1s)
  updateCreateBtn();
  setTimeout(() => createInput.focus({ preventScroll: true }), 50);
}

function updateCreateBtn() {
  createBtn.disabled = createInput.value.trim() === "";
}

function createBoard() {
  const name = createInput.value.trim();
  if (!name) return;
  const existing = findBoard(name);
  const board = existing || name;
  if (!existing) {
    addBoardRow(board, true);
    state.newBoards.push(board);                 // hidden: new board added to the database
  }
  closePicker();
  saveTo(board);
}

// ===== Triggers =====
function onRowClick(event) {
  event.stopPropagation();
  closePicker();
  saveTo(event.currentTarget.dataset.board);
}

// Board button: Click ON opens the picker, clicking it again closes it
boardBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  isOpen() ? closePicker() : openPicker();
});

// Save button: Click ON saves to the board shown; Click OFF (on "Saved") removes the save
saveBtn.addEventListener("click", () => {
  closePicker();
  state.savedTo === null ? saveTo(boardName.textContent) : unsave();
});

allRows().forEach((row) => row.addEventListener("click", onRowClick));

createRow.addEventListener("click", (event) => {
  event.stopPropagation();
  openCreateForm();
});

createRow.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openCreateForm();
  }
});

createInput.addEventListener("input", updateCreateBtn);
createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createBoard();
});

search.addEventListener("input", () => filterRows(search.value));
picker.addEventListener("click", (event) => event.stopPropagation());

// Click OFF: click outside the board picker window, or press Esc
document.addEventListener("click", closePicker);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePicker();
});

// ===== Page load: the page starts out showing what the database holds =====
stage.classList.add("no-anim");
state.newBoards.forEach((board) => {
  if (!findBoard(board)) addBoardRow(board, false);
});
render(false);
requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("no-anim")));
