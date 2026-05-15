const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const taskDueDate = document.getElementById("taskDueDate");
const taskCategory = document.getElementById("taskCategory");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const tasksLeft = document.getElementById("tasksLeft");

const searchTask = document.getElementById("searchTask");
const filterStatus = document.getElementById("filterStatus");
const sortTasks = document.getElementById("sortTasks");

const markAllComplete =
    document.getElementById("markAllComplete");

const clearCompleted =
    document.getElementById("clearCompleted");

const clearAllTasks =
    document.getElementById("clearAllTasks");

const themeToggle =
    document.getElementById("themeToggle");

const STORAGE_KEY = "advanced_todo_tasks";
const THEME_KEY = "advanced_todo_theme";

let tasks = [];

function sanitizeText(text) {
    return text.trim();
}

function generateTaskId() {
    return Date.now() + Math.random();
}

function saveTasks() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );
}

function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (!storedTasks) {
        return;
    }

    tasks = JSON.parse(storedTasks);
}

function saveTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
}

function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    }
}

function updateCounters() {
    const total = tasks.length;
    const completed = tasks.filter(
        (task) => task.completed
    ).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    tasksLeft.textContent =
        pending === 1
            ? "1 task left"
            : `${pending} tasks left`;
}

function createTaskObject() {
    const title = sanitizeText(taskInput.value);
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;
    const category = sanitizeText(taskCategory.value);

    if (!title) {
        alert("Please enter a task.");
        return null;
    }

    return {
        id: generateTaskId(),
        title,
        priority,
        dueDate,
        category,
        completed: false,
        createdAt: new Date().toISOString()
    };
}

function createTaskHTML(task) {
    return `
        <li class="task-item ${
            task.completed ? "completed" : ""
        }" data-id="${task.id}">
            <div class="task-left">
                <input
                    type="checkbox"
                    class="task-complete-checkbox"
                    ${task.completed ? "checked" : ""}
                />

                <div class="task-content">
                    <h3 class="task-title">${task.title}</h3>

                    <div class="task-meta">
                        <span class="priority ${task.priority}">
                            ${task.priority.toUpperCase()}
                        </span>

                        ${
                            task.category
                                ? `
                        <span class="category">
                            ${task.category}
                        </span>
                        `
                                : ""
                        }

                        ${
                            task.dueDate
                                ? `
                        <span class="due-date">
                            ${task.dueDate}
                        </span>
                        `
                                : ""
                        }
                    </div>
                </div>
            </div>

            <div class="task-actions">
                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        </li>
    `;
}

function getFilteredTasks() {
    let filteredTasks = [...tasks];

    const searchValue = searchTask.value
        .trim()
        .toLowerCase();

    const selectedFilter = filterStatus.value;
    const selectedSort = sortTasks.value;

    if (searchValue) {
        filteredTasks = filteredTasks.filter((task) =>
            task.title.toLowerCase().includes(searchValue)
        );
    }

    if (selectedFilter === "completed") {
        filteredTasks = filteredTasks.filter(
            (task) => task.completed
        );
    }

    if (selectedFilter === "pending") {
        filteredTasks = filteredTasks.filter(
            (task) => !task.completed
        );
    }

    if (selectedSort === "oldest") {
        filteredTasks.sort(
            (a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
        );
    }

    if (selectedSort === "newest") {
        filteredTasks.sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    if (selectedSort === "alphabetical") {
        filteredTasks.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    if (selectedSort === "priority") {
        const priorityOrder = {
            high: 1,
            medium: 2,
            low: 3
        };

        filteredTasks.sort(
            (a, b) =>
                priorityOrder[a.priority] -
                priorityOrder[b.priority]
        );
    }

    if (selectedSort === "duedate") {
        filteredTasks.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;

            return (
                new Date(a.dueDate) - new Date(b.dueDate)
            );
        });
    }

    return filteredTasks;
}

function renderTasks() {
    const visibleTasks = getFilteredTasks();

    if (tasks.length === 0) {
        taskList.innerHTML = "";
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";

        taskList.innerHTML = visibleTasks
            .map(createTaskHTML)
            .join("");
    }

    updateCounters();
}

function addTask(event) {
    event.preventDefault();

    const newTask = createTaskObject();

    if (!newTask) {
        return;
    }

    tasks.unshift(newTask);

    saveTasks();
    renderTasks();

    taskForm.reset();
    taskInput.focus();
}

function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);

    saveTasks();
    renderTasks();
}

function toggleTaskComplete(taskId) {
    tasks = tasks.map((task) =>
        task.id === taskId
            ? {
                  ...task,
                  completed: !task.completed
              }
            : task
    );

    saveTasks();
    renderTasks();
}

function editTask(taskId) {
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
        return;
    }

    const updatedTitle = prompt(
        "Edit your task:",
        task.title
    );

    if (updatedTitle === null) {
        return;
    }

    const cleanTitle = sanitizeText(updatedTitle);

    if (!cleanTitle) {
        alert("Task cannot be empty.");
        return;
    }

    task.title = cleanTitle;

    saveTasks();
    renderTasks();
}

function completeAllTasks() {
    tasks = tasks.map((task) => ({
        ...task,
        completed: true
    }));

    saveTasks();
    renderTasks();
}

function clearCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);

    saveTasks();
    renderTasks();
}

function clearAllTaskData() {
    tasks = [];

    saveTasks();
    renderTasks();
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");

    const currentTheme =
        document.body.classList.contains("dark-theme")
            ? "dark"
            : "light";

    saveTheme(currentTheme);
}

function getTaskIdFromElement(element) {
    const taskItem = element.closest(".task-item");

    if (!taskItem) {
        return null;
    }

    return Number(taskItem.dataset.id);
}

function handleTaskListClick(event) {
    const clickedElement = event.target;
    const taskId = getTaskIdFromElement(clickedElement);

    if (!taskId) {
        return;
    }

    if (clickedElement.classList.contains("delete-btn")) {
        deleteTask(taskId);
        return;
    }

    if (
        clickedElement.classList.contains(
            "task-complete-checkbox"
        )
    ) {
        toggleTaskComplete(taskId);
        return;
    }

    if (clickedElement.classList.contains("edit-btn")) {
        editTask(taskId);
    }
}

taskForm.addEventListener("submit", addTask);
taskList.addEventListener("click", handleTaskListClick);

searchTask.addEventListener("input", renderTasks);
filterStatus.addEventListener("change", renderTasks);
sortTasks.addEventListener("change", renderTasks);

markAllComplete.addEventListener(
    "click",
    completeAllTasks
);

clearCompleted.addEventListener(
    "click",
    clearCompletedTasks
);

clearAllTasks.addEventListener(
    "click",
    clearAllTaskData
);

themeToggle.addEventListener("click", toggleTheme);

loadTasks();
loadTheme();
renderTasks();