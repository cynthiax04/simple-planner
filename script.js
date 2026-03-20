// Select DOM elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// Progress elements
const progressBar = document.getElementById('progress-bar');
const animal = document.getElementById('animal');
const progressText = document.getElementById('progress-text');

// Load saved todos
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

// Save todos
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// ✅ UPDATE PROGRESS FUNCTION
function updateProgress() {
    const total = todos.length;

    if (total === 0) {
        progressBar.value = 0;
        animal.style.setProperty('--move', '0%');
        progressText.textContent = '0% completed';
        return;
    }

    const completed = todos.filter(todo => todo.completed).length;
    const percent = Math.round((completed / total) * 100);

    progressBar.value = percent;
    animal.style.setProperty('--move', percent + '%');
    progressText.textContent = percent + '% completed';

    // Bonus 🎉
    if (percent === 100) {
        progressText.textContent = "🎉 All tasks completed!";
    }
}

// Create todo node
function createTodoNode(todo, index) {
    const li = document.createElement('li');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;

    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.style.margin = '0 8px';

    if (todo.completed) {
        textSpan.style.textDecoration = 'line-through';
    }

    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;

        textSpan.style.textDecoration = todo.completed ? 'line-through' : '';

        saveTodos();
        updateProgress(); // ✅
    });

    // Edit on double click
    textSpan.addEventListener("dblclick", () => {
        const newText = prompt('Edit todo', todo.text);

        if (newText !== null) {
            todo.text = newText.trim();
            textSpan.textContent = todo.text;
            saveTodos();
        }
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";

    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        render();
        saveTodos();
        updateProgress(); // ✅
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);

    return li;
}

// Render list
function render() {
    list.innerHTML = '';

    todos.forEach((todo, index) => {
        const node = createTodoNode(todo, index);
        list.appendChild(node);
    });

    updateProgress(); // ✅ important
}

// Add todo
function addTodo() {
    const text = input.value.trim();

    if (!text) return;

    todos.push({ text, completed: false });
    input.value = '';

    render();
    saveTodos();
    updateProgress(); // ✅
}

// Events
addBtn.addEventListener("click", addTodo);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Initial render
render();

function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  // active tab highlight
  document.querySelectorAll(".nav-item").forEach(tab => {
    tab.classList.remove("active-tab");
  });

  event.target.classList.add("active-tab");
}

// ================= CALENDAR =================

// ================= CALENDAR =================

let currentDate = new Date();

// store events
const savedEvents = localStorage.getItem("calendarEvents");
const calendarEvents = savedEvents ? JSON.parse(savedEvents) : {};

function saveEvents() {
  localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
}

function renderCalendar() {
  const grid = document.getElementById("calendarGrid");
  const monthYear = document.getElementById("monthYear");

  grid.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  monthYear.textContent = `${months[month]} ${year}`;

  let startDay = firstDay === 0 ? 6 : firstDay - 1;

  // EMPTY BOXES
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement("div");
    grid.appendChild(empty);
  }

  // DAYS
  for (let d = 1; d <= daysInMonth; d++) {
    const day = document.createElement("div");
    day.classList.add("day");

    const dateNumber = document.createElement("div");
    dateNumber.textContent = d;
    dateNumber.style.fontWeight = "bold";

    const eventBox = document.createElement("div");
    eventBox.classList.add("event-box");

    // ✅ FIXED KEY (IMPORTANT)
    const key = `${year}-${month + 1}-${d}`;

    // LOAD EVENTS
    const MAX_VISIBLE = 2;

if (calendarEvents[key]) {

  const events = calendarEvents[key];

  events.slice(0, MAX_VISIBLE).forEach((ev) => {
    const eventItem = document.createElement("div");
    eventItem.classList.add("event-item");

    const text = document.createElement("span");
    text.textContent = ev;

    eventItem.appendChild(text);
    eventBox.appendChild(eventItem);
  });

  // "+X more"
  if (events.length > MAX_VISIBLE) {
    const more = document.createElement("div");
    more.classList.add("more-events");

    more.textContent = `+${events.length - MAX_VISIBLE} more`;

    more.addEventListener("click", (e) => {
      e.stopPropagation();
      showEvents(key);
    });

    eventBox.appendChild(more);
  }
}
    day.appendChild(dateNumber);
    day.appendChild(eventBox);

    // CLICK EVENT
    day.addEventListener("click", () => {

      // ✅ show events in right panel
      showEvents(key);

      // prevent multiple inputs
      if (day.querySelector("input")) return;

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Add event...";
      input.classList.add("event-input");

      eventBox.appendChild(input);
      input.focus();

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {

          if (!calendarEvents[key]) {
            calendarEvents[key] = [];
          }

          calendarEvents[key].push(input.value.trim());
          saveEvents();

          renderCalendar();
          showEvents(key); // ✅ update panel
        }
      });

      input.addEventListener("blur", () => {
        input.remove();
      });
    });

    // highlight today
    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      day.classList.add("today");
    }

    grid.appendChild(day);
  }
}

// change month
function changeMonth(step) {
  currentDate.setMonth(currentDate.getMonth() + step);
  renderCalendar();
}

// initial load
renderCalendar();

function showEvents(key) {
  const panel = document.getElementById("eventDetails");
  panel.innerHTML = "";

  if (!calendarEvents[key] || calendarEvents[key].length === 0) {
    panel.textContent = "No events";
    return;
  }

  calendarEvents[key].forEach((ev, index) => {
    const div = document.createElement("div");
    div.classList.add("event-detail-item");

    const text = document.createElement("span");
    text.textContent = ev;

    const del = document.createElement("span");
    del.textContent = "❌";
    del.style.cursor = "pointer";

    del.addEventListener("click", () => {
      calendarEvents[key].splice(index, 1);
      saveEvents();
      renderCalendar();
      showEvents(key);
    });

    div.appendChild(text);
    div.appendChild(del);
    panel.appendChild(div);
  });
}

// ================= NOTES =================

let notes = [];

// load notes AFTER page loads
window.addEventListener("DOMContentLoaded", () => {
    const noteInput = document.getElementById("note-input");

noteInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault(); // stop new line
    addNote();
  }
});

  const savedNotes = localStorage.getItem("notes");
  notes = savedNotes ? JSON.parse(savedNotes) : [];

  renderNotes();
});

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function renderNotes() {
  const container = document.getElementById("notes-container");
  if (!container) return; // safety

  container.innerHTML = "";

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.classList.add("note");

    const text = document.createElement("p");
    text.textContent = note;

    const del = document.createElement("button");
    del.textContent = "❌";

    del.addEventListener("click", () => {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    });

    div.appendChild(del);
    div.appendChild(text);

    container.appendChild(div);
  });
}

function addNote() {
  const input = document.getElementById("note-input");

  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  notes.push(text);
  input.value = "";

  saveNotes();
  renderNotes();
}
function showSection(id, el) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.remove("active");
  });

  document.getElementById(id).classList.add("active");

  document.querySelectorAll(".nav-item").forEach(tab => {
    tab.classList.remove("active-tab");
  });

  if (el) el.classList.add("active-tab");
}

// ================= TIMER =================

document.addEventListener("DOMContentLoaded", () => {

  let timer;
  let seconds = 0;
  let running = false;

  const timeDisplay = document.getElementById("time");
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (!timeDisplay || !startBtn || !stopBtn || !resetBtn) return;

  function updateTime() {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    timeDisplay.textContent =
      String(mins).padStart(2, "0") + ":" +
      String(secs).padStart(2, "0");
  }

  startBtn.onclick = () => {
    if (!running) {
      running = true;
      timer = setInterval(() => {
        seconds++;
        updateTime();
      }, 1000);
    }
  };

  stopBtn.onclick = () => {
    running = false;
    clearInterval(timer);
  };

  resetBtn.onclick = () => {
    running = false;
    clearInterval(timer);
    seconds = 0;
    updateTime();
  };

});