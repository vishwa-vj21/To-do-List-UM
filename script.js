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

  li.querySelector("input").addEventListener("change", toggleComplete);
  li.querySelector(".edit").addEventListener("click", editTask);
  li.querySelector(".delete").addEventListener("click", deleteTask);

  taskList.appendChild(li);
}

function toggleComplete(e) {
  const li = e.target.closest("li");
  li.classList.toggle("completed");
  updateTaskInLocalStorage(li.dataset.id, { completed: e.target.checked });
}

function editTask(e) {
  const li = e.target.closest("li");
  const newText = prompt(
    "Edit your task:",
    li.querySelector("span").textContent
  );
  if (newText && newText.trim() !== "") {
    li.querySelector("span").textContent = newText;
    updateTaskInLocalStorage(li.dataset.id, { text: newText });
  }
}

function deleteTask(e) {
  const li = e.target.closest("li");
  li.remove();
  deleteTaskFromLocalStorage(li.dataset.id);
}

function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(addTaskToDOM);
}

function updateTaskInLocalStorage(id, updates) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.map((t) =>
    t.id == id ? { ...t, ...updates } : t
  );
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function deleteTaskFromLocalStorage(id) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const filtered = tasks.filter((t) => t.id != id);
  localStorage.setItem("tasks", JSON.stringify(filtered));
}
