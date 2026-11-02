// Beta Build: Board button, board picker window, board rows and Save button.
// CSS does every fade and slide. This script only switches classes and text.

const stage = document.querySelector(".stage");
const boardBtn = document.querySelector(".board-btn");
const boardName = document.querySelector(".board-name");
const saveBtn = document.querySelector(".save-btn");
const picker = document.querySelector(".picker");
const search = document.querySelector(".picker-search");
const rows = [...document.querySelectorAll(".row")];
const noResults = document.querySelector(".no-results");

// In this build the "database" is just this variable.
let savedTo = null;

function openPicker() {
  stage.classList.add("is-open");
  boardBtn.setAttribute("aria-expanded", "true");
  search.value = "";
  filterRows("");
  // Wait for the slide to start, then put the text cursor in the search bar
  setTimeout(() => search.focus(), 50);
}

function closePicker() {
  stage.classList.remove("is-open");
  boardBtn.setAttribute("aria-expanded", "false");
}

function saveTo(board) {
  savedTo = board;                     // hidden: "database" update
  boardName.textContent = board;       // Board button shows the chosen board
  saveBtn.textContent = "Saved";       // Save button text changes
  stage.classList.add("is-saved");     // red -> black, arrow fades, underline
  boardBtn.setAttribute("aria-label", "Saved to " + board);
}

// SEARCH (Loops & Modes): typing filters the board rows by name
function filterRows(text) {
  const query = text.trim().toLowerCase();
  let shown = 0;
  rows.forEach((row) => {
    const match = row.dataset.board.toLowerCase().includes(query);
    row.hidden = !match;
    if (match) shown++;
  });
  noResults.hidden = shown > 0;
  document.querySelectorAll(".picker-label").forEach((label) => {
    label.hidden = query !== "";
  });
}

// TRIGGER: Board button Click ON / Click ON again
boardBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  if (savedTo) return;                 // MODE: after saving, it is a link label
  stage.classList.contains("is-open") ? closePicker() : openPicker();
});

// TRIGGER: Save button Click ON (saves to the board shown)
saveBtn.addEventListener("click", () => {
  if (savedTo) return;                 // MODE: already saved
  closePicker();
  saveTo(boardName.textContent);
});

// TRIGGER: Board row Click ON (the Row Save button, or anywhere on the row)
rows.forEach((row) => {
  row.addEventListener("click", (event) => {
    event.stopPropagation();
    closePicker();
    saveTo(row.dataset.board);
  });
});

search.addEventListener("input", () => filterRows(search.value));
picker.addEventListener("click", (event) => event.stopPropagation());

// TRIGGER: Click OFF (click outside the window, or press Esc)
document.addEventListener("click", () => {
  if (stage.classList.contains("is-open")) closePicker();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && stage.classList.contains("is-open")) {
    closePicker();
    boardBtn.focus();
  }
});
