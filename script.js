// Selectors
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");

let tasks = [];

// Initialize App
function init() {
  loadTasks();
  renderTasks();
  updateStats();

  // Show today’s date
  document.getElementById("current-date").textContent = new Date().toDateString();

  addBtn.addEventListener("click", addTask);
}

// Add Task
function addTask() {
  const text = taskInput.value.trim();
  const dueDate = document.getElementById("task-date").value;
  const important = document.getElementById("important-task").checked;

  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  const newTask = {
    id: Date.now(),
    text,
    dueDate,
    important,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateStats();

  // Reset input
  taskInput.value = "";
  document.getElementById("task-date").value = "";
  document.getElementById("important-task").checked = false;
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.important ? "important" : ""} ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
      <div class="task-content">
        <div class="task-text">${task.text}</div>
        <div class="task-date">${task.dueDate ? task.dueDate : "No date"}</div>
      </div>
      <div class="task-actions">
        <button class="task-btn important-btn ${task.important ? "active" : ""}">★</button>
        <button class="task-btn edit-btn">✏️</button>
        <button class="task-btn delete-btn">🗑️</button>
      </div>
    `;

    // Events
    const checkbox = li.querySelector(".task-checkbox");
    const importantBtn = li.querySelector(".important-btn");
    const editBtn = li.querySelector(".edit-btn");
    const deleteBtn = li.querySelector(".delete-btn");

    checkbox.addEventListener("change", () => toggleTaskComplete(task.id));
    importantBtn.addEventListener("click", () => toggleTaskImportant(task.id));
    editBtn.addEventListener("click", () => editTask(task.id));
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    taskList.appendChild(li);
  });
}

// Toggle completion
function toggleTaskComplete(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  saveTasks();
  renderTasks();
  updateStats();
}

// Toggle importance
function toggleTaskImportant(id) {
  tasks = tasks.map((t) => (t.id === id ? { ...t, important: !t.important } : t));
  saveTasks();
  renderTasks();
}

// Edit Task
function editTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const newText = prompt("Edit task:", task.text);
  if (newText && newText.trim() !== "") {
    task.text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

// Delete Task
function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
  }
}

// Stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
}

// Save / Load
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) tasks = JSON.parse(saved);
}

// Init
document.addEventListener("DOMContentLoaded", init);