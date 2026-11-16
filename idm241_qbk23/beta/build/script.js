// Beta Build: Board button, board picker window (board rows + Create board) and Save button.
// CSS does every fade and slide. This script switches classes and text, and keeps
// the "database" in the browser's localStorage so a save is still there after a reload.

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
    const stored = JSON.parse(localStorage.getItem(KEY));
    return Object.assign({}, DEFAULT_STATE, stored);
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

function addBoardRow(name) {
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
  allLabel.after(row);                       // new boards go to the top of "All boards"
  row.addEventListener("click", onRowClick);
}

// ===== Show the current state =====
function render() {
  const saved = state.savedTo !== null;
  stage.classList.toggle("is-saved", saved);
  boardName.textContent = saved ? state.savedTo : state.lastBoard;
  saveBtn.textContent = saved ? "Saved" : "Save";
  saveBtn.setAttribute("aria-pressed", String(saved));
}

// ===== Saving =====
function saveTo(board) {
  state.savedTo = board;                     // hidden: image card added to the board
  state.lastBoard = board;                   // hidden: default board for the next save
  saveState();                               // hidden: database updated
  render();
}

function unsave() {
  state.savedTo = null;                      // hidden: image card removed from the board
  saveState();                               // hidden: database updated
  render();
}

// ===== Board picker window =====
function openPicker() {
  stage.classList.add("is-open");
  boardBtn.setAttribute("aria-expanded", "true");
  search.value = "";
  filterRows("");
  closeCreateForm();
  setTimeout(() => search.focus(), 50);      // text cursor blinks in the search bar
}

function closePicker() {
  stage.classList.remove("is-open");
  boardBtn.setAttribute("aria-expanded", "false");
}

// SEARCH MODE: typing hides board rows whose names don't match
function filterRows(text) {
  const query = text.trim().toLowerCase();
  let shown = 0;
  allRows().forEach((row) => {
    const match = row.dataset.board.toLowerCase().includes(query);
    row.hidden = !match;
    if (match) shown++;
  });
  noResults.hidden = shown > 0;
  document.querySelectorAll(".picker-label").forEach((label) => {
    label.hidden = query !== "";
  });
}

// ===== Create board =====
function openCreateForm() {
  stage.classList.add("is-creating");
  createInput.value = "";
  updateCreateBtn();
  createInput.focus();
}

function closeCreateForm() {
  stage.classList.remove("is-creating");
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
    addBoardRow(board);
    state.newBoards.push(board);             // hidden: new board added to the database
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

// Board button: Click ON opens the picker, Click OFF (clicking it again) closes it
boardBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  stage.classList.contains("is-open") ? closePicker() : openPicker();
});

// Save button: Click ON saves to the board shown, Click OFF (on "Saved") removes the save
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
document.addEventListener("click", () => {
  if (stage.classList.contains("is-open")) closePicker();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && stage.classList.contains("is-open")) {
    closePicker();
  }
});

// ===== Page load: show what the database holds, with no animation =====
state.newBoards.forEach((board) => {
  if (!findBoard(board)) addBoardRow(board);
});
stage.classList.add("no-anim");
render();
requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove("no-anim")));
