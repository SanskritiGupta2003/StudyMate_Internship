const STORAGE_KEY = "studymate_tasks_v1";
const $ = (id) => document.getElementById(id);

let tasks = loadTasks();

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function formatDate(dateString) {
  if (!dateString) return "No due date";
  return new Date(dateString + "T00:00:00").toLocaleDateString(undefined, {
    day: "numeric", month: "short", year: "numeric"
  });
}

function isOverdue(task) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return !task.completed && new Date(task.dueDate + "T00:00:00") < today;
}

function renderStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  $("totalCount").textContent = total;
  $("completedCount").textContent = completed;
  $("pendingCount").textContent = total - completed;
  $("completionRate").textContent = (total ? Math.round(completed / total * 100) : 0) + "%";
}

function getVisibleTasks() {
  const query = $("searchInput").value.trim().toLowerCase();
  const status = $("statusFilter").value;
  const sort = $("sortFilter").value;
  let visible = tasks.filter(task => {
    const matchesQuery = (task.title + " " + task.subject).toLowerCase().includes(query);
    const matchesStatus = status === "all" ||
      (status === "completed" && task.completed) ||
      (status === "pending" && !task.completed);
    return matchesQuery && matchesStatus;
  });

  if (sort === "date") visible.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  if (sort === "priority") {
    const rank = { High: 0, Medium: 1, Low: 2 };
    visible.sort((a, b) => rank[a.priority] - rank[b.priority]);
  }
  if (sort === "newest") visible.sort((a, b) => b.createdAt - a.createdAt);
  return visible;
}

function renderTasks() {
  const visible = getVisibleTasks();
  $("taskList").innerHTML = visible.map(task => `
    <article class="task-item ${task.completed ? "done" : ""}">
      <button class="check-btn" data-action="toggle" data-id="${task.id}" aria-label="${task.completed ? "Mark pending" : "Mark completed"}">${task.completed ? "✓" : ""}</button>
      <div>
        <div class="task-title">${escapeHTML(task.title)}</div>
        <div class="task-meta">${escapeHTML(task.subject)} · Due ${formatDate(task.dueDate)}
          ${isOverdue(task) ? '<span class="overdue"> · Overdue</span>' : ""}
        </div>
      </div>
      <div class="task-tags"><span class="tag priority-${task.priority}">${task.priority} priority</span><span class="tag">${task.completed ? "Completed" : "Pending"}</span></div>
      <button class="delete-btn" data-action="delete" data-id="${task.id}">Delete</button>
    </article>
  `).join("");
  $("emptyState").hidden = visible.length > 0;
  if (visible.length === 0 && tasks.length > 0) {
    $("emptyState").textContent = "No matching tasks. Try changing your search or filters.";
  } else {
    $("emptyState").textContent = "No tasks yet. Add your first task above to get started.";
  }
}

function render() {
  renderStats();
  renderTasks();
}

$("taskForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const title = $("taskTitle").value.trim();
  const subject = $("taskSubject").value.trim();
  const dueDate = $("taskDate").value;
  if (!title || !subject || !dueDate) return;

  tasks.push({
    id: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random())),
    title, subject, dueDate,
    priority: $("taskPriority").value,
    completed: false,
    createdAt: Date.now()
  });
  saveTasks();
  $("taskForm").reset();
  $("taskDate").value = new Date().toISOString().slice(0, 10);
  render();
});

$("taskList").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = button.dataset.id;
  if (button.dataset.action === "toggle") {
    tasks = tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task);
  } else if (button.dataset.action === "delete") {
    if (!confirm("Delete this task?")) return;
    tasks = tasks.filter(task => task.id !== id);
  }
  saveTasks();
  render();
});

["searchInput", "statusFilter", "sortFilter"].forEach(id => {
  $(id).addEventListener(id === "searchInput" ? "input" : "change", renderTasks);
});

$("todayLabel").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "short", day: "numeric", month: "short", year: "numeric"
});
$("taskDate").value = new Date().toISOString().slice(0, 10);
render();
