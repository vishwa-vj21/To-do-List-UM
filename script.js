document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // Each task is stored as an object with a unique ID
  const task = {
    id: Date.now(),
    text: taskText,
    completed: false,
  };

  addTaskToDOM(task);
  saveTaskToLocalStorage(task);
  taskInput.value = "";
}

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);
  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <input type="checkbox" ${task.completed ? "checked" : ""}>
    <span>${task.text}</span>
    <div class="actions">
      <button class="edit">✏️</button>
      <button class="delete">🗑️</button>
    </div>
  `;

  // Attach task-level actions
  li.querySelector("input").addEventListener("change", toggleComplete);
  li.querySelector(".edit").addEventListener("click", editTask);
  li.querySelector(".delete").addEventListener("click", deleteTask);

  taskList.appendChild(li);
}

function toggleComplete(e) {
  const li = e.target.closest("li");
  li.classList.toggle("completed");

  // Only update the 'completed' status in storage
  updateTaskInLocalStorage(li.dataset.id, { completed: e.target.checked });
}

function editTask(e) {
  const li = e.target.closest("li");

  // Pre-fill prompt with existing text for easier editing
  const newText = prompt(
    "Edit your task:",
    li.querySelector("span").textContent
  );

  if (newText && newText.trim() !== "") {
    li.querySelector("span").textContent = newText;

    // Update only the 'text' field in storage
    updateTaskInLocalStorage(li.dataset.id, { text: newText });
  }
}

function deleteTask(e) {
  const li = e.target.closest("li");
  li.remove();

  // Remove this task completely from localStorage
  deleteTaskFromLocalStorage(li.dataset.id);
}

function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  // Load all saved tasks when page loads
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToDOM);
}

function updateTaskInLocalStorage(id, updates) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Update only the fields provided in 'updates'
  const updatedTasks = tasks.map((t) =>
    t.id == id ? { ...t, ...updates } : t
  );

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function deleteTaskFromLocalStorage(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Filter out only the deleted task
  const filtered = tasks.filter((t) => t.id != id);

  localStorage.setItem("tasks", JSON.stringify(filtered));
}
