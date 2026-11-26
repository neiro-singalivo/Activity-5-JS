// Preset Data

let expenses = [
  { id: 1, title: "Lunch", amount: 120, category: "Food" },
  { id: 2, title: "Jeepney fare", amount: 25, category: "Commute" },
  { id: 3, title: "Notebook", amount: 85.5, category: "School" },
];

// Keeps track of the next unique id
let nextId = 4;

const nameInput = document.getElementById("expenseName");
const amountInput = document.getElementById("expenseAmount");
const categorySelect = document.getElementById("expenseCategory");
const addBtn = document.getElementById("addExpenseButton");
const errorEl = document.getElementById("error");
const filterSelect = document.getElementById("filterCategory");
const listEl = document.getElementById("expenseList");
const totalEl = document.getElementById("totalAmount");

function calculateTotal(list) {
  return list.reduce((sum, expense) => sum + expense.amount, 0);
}

// Turns a number like 120 into "₱120.00"
function formatPeso(value) {
  return "₱" + value.toFixed(2);
}

function render() {
  const selected = filterSelect.value;

  const filtered = expenses.filter(
    (expense) => selected === "All" || expense.category === selected,
  );

  if (filtered.length === 0) {
    listEl.innerHTML = '<p class="text-gray-500 py-2">No expenses to show.</p>';
  } else {
    listEl.innerHTML = filtered
      .map((expense) => {
        const { title, amount, category } = expense;

        return `
          <div class="flex justify-between items-center py-2 border-b border-gray-200">
            <div>
              <p class="font-semibold">${title}</p>
              <p class="text-sm text-gray-500">${category}</p>
            </div>
            <p class="text-green-500 font-semibold">+${formatPeso(amount)}</p>
          </div>`;
      })
      .join("");
  }

  totalEl.textContent = formatPeso(calculateTotal(filtered));
}

function addExpense() {
  const title = nameInput.value.trim();
  const amount = Number(amountInput.value);
  const category = categorySelect.value;

  if (title === "") {
    errorEl.textContent = "Please enter a title for the expense.";
    return;
  }

  if (Number.isNaN(amount) || amount <= 0) {
    errorEl.textContent = "Amount must be greater than 0.";
    return;
  }

  errorEl.textContent = "";

  const newExpense = { id: nextId, title, amount, category };
  nextId = nextId + 1;

  expenses = [...expenses, newExpense];

  nameInput.value = "";
  amountInput.value = "";
  nameInput.focus();

  render();
}

addBtn.addEventListener("click", () => addExpense());
filterSelect.addEventListener("change", () => render());

render();

// background music button

const backgroundMusic = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");

backgroundMusic.volume = 0.35;

function updateMusicButton() {
  const isPlaying = !backgroundMusic.paused;
  musicToggle.textContent = isPlaying ? "♫ Music on · mute" : "♫ Enable music";
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
}

async function playMusic() {
  try {
    await backgroundMusic.play();
    updateMusicButton();
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      updateMusicButton();
      return;
    }

    musicToggle.textContent = "Music unavailable";
    musicToggle.disabled = true;
    console.error("Could not play the background music.", error);
  }
}

musicToggle.addEventListener("click", () => {
  if (backgroundMusic.paused) {
    playMusic();
  } else {
    backgroundMusic.pause();
    updateMusicButton();
  }
});

backgroundMusic.addEventListener("play", updateMusicButton);
backgroundMusic.addEventListener("pause", updateMusicButton);
playMusic();
