
let users = [];
let tasks = [];

const userNameInput = document.getElementById("userName");
const addUserBtn = document.getElementById("addUser");
const userSelect = document.getElementById("userSelect");
const editUserBtn = document.getElementById("editUser");

const taskInput = document.getElementById("task");
const addTaskBtn = document.getElementById("addTask");
const list = document.getElementById("list");

const filterSelect = document.getElementById("filterSelect");
const clearAllBtn = document.getElementById("clearAll");

const totalCountEl = document.getElementById("totalCount");
const completedCountEl = document.getElementById("completedCount");
const pendingCountEl = document.getElementById("pendingCount");


function saveToStorage() {
    localStorage.setItem("todo_users", JSON.stringify(users));
    localStorage.setItem("todo_tasks", JSON.stringify(tasks));
}

function loadFromStorage() {
    const storedUsers = localStorage.getItem("todo_users");
    const storedTasks = localStorage.getItem("todo_tasks");

    // If nothing was stored yet, default to empty arrays
    users = storedUsers ? JSON.parse(storedUsers) : [];
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

/* =========================================================
   SANITIZATION HELPER
   -------------------------------------------------
   Basic protection: strips HTML tags out of user input so
   someone can't type "<script>" or "<img onerror=...>" into
   a task/user name and have it run as code when we insert it.
   We use .trim() everywhere too, to block empty/whitespace input.
   ========================================================= */
function sanitize(str) {
    const div = document.createElement("div");
    div.textContent = str;   // textContent auto-escapes HTML
    return div.innerHTML;    // now safe to insert later if needed
}


function addUser() {
    const name = userNameInput.value.trim();

    if (!name) {
        alert("User name cannot be empty.");
        return;
    }

    if(!/^[a-zA-Z]/.test(name)){
        alert("User name must contain at least one letter at Start like(username123!) .");
        return;
    }
    
    

   
    if (users.includes(name)) {
        alert("That user already exists.");
        return;
    }

    users.push(name);
    userNameInput.value = "";

    saveToStorage();
    renderUsers();
}

function editUser() {
    const oldName = userSelect.value;

    if (!oldName) {
        alert("Select a user first, then click Edit User.");
        return;
    }

    let newName = prompt("Edit user name:", oldName);

    // If they clicked Cancel, prompt() returns null — do nothing
    if (newName === null) return;

       newName = newName.trim();

    if (!newName) {
        alert("User name cannot be empty.");
        return;
    }

    if (newName !== oldName && users.includes(newName)) {
        alert("That user already exists.");
        return;
    }

    // Step 1: rename in the users array
    const index = users.indexOf(oldName);
    users[index] = newName;

    // Step 2: rename on every task that belonged to the old name
    // (without this step, those tasks would still say the OLD username
    // and would no longer show up when filtering by the new name)
    tasks.forEach((t) => {
        if (t.user === oldName) {
            t.user = newName;
        }   
    });

    saveToStorage();
    renderUsers();

    // Keep the same user selected after renaming (now under the new name)
    userSelect.value = newName;

    renderTasks();
    updateStats();
}

function renderUsers() {
    // Rebuild the <select> dropdown from scratch
    userSelect.innerHTML = '<option value="">-- Select a user --</option>';

    users.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        userSelect.appendChild(option);
    });
}


function addTask() {
    const text = taskInput.value.trim();
    const currentUser = userSelect.value;

    if (!text) {
        alert("Task cannot be empty.");
        return;
    }

    if (!currentUser) {
        alert("Please select a user before adding a task.");
        return;
    }

    const newTask = {
        id: Date.now(),      // unique id based on timestamp
        text: sanitize(text),
        completed: false,
        user: currentUser,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(newTask);
    taskInput.value = "";

    saveToStorage();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    // Keep every task EXCEPT the one whose id matches
    tasks = tasks.filter((t) => t.id !== id);

    saveToStorage();
    renderTasks();
    updateStats();
}

function toggleComplete(id) {
    // Find the task and flip its completed boolean
    const found = tasks.find((t) => t.id === id);
    if (found) {
        found.completed = !found.completed;
    }

    saveToStorage();
    renderTasks();
    updateStats();
}

function editTask(id) {
    const found = tasks.find((t) => t.id === id);
    if (!found) return;

    const newText = prompt("Edit task:", found.text);

    // If they clicked Cancel, prompt() returns null — do nothing
    if (newText === null) return;

    const trimmedText = newText.trim();

    if (!trimmedText) {
        alert("Task cannot be empty.");
        return;
    }

    found.text = sanitize(trimmedText);

    saveToStorage();
    renderTasks();
    updateStats();
}

function clearAllTasks() {
    const currentUser = userSelect.value;

    if (!currentUser) {
        if (confirm("No user selected. Clear ALL tasks for ALL users?")) {
            tasks = [];
        }
    } else {
        if (confirm(`Clear all tasks for ${currentUser}?`)) {
            tasks = tasks.filter((t) => t.user !== currentUser);
        }
    }

    saveToStorage();
    renderTasks();
    updateStats();
}


function renderTasks() {
    list.innerHTML = ""; // clear the current list before redrawing

    const currentUser = userSelect.value;
    const statusFilter = filterSelect.value; // "all" | "pending" | "completed"

    // Step 1: filter by selected user (if one is chosen)
    let visibleTasks = currentUser
        ? tasks.filter((t) => t.user === currentUser)
        : tasks;

    // Step 2: filter by status
    if (statusFilter === "pending") {
        visibleTasks = visibleTasks.filter((t) => !t.completed);
    } else if (statusFilter === "completed") {
        visibleTasks = visibleTasks.filter((t) => t.completed);
    }

    // Step 3: build an <li> for each visible task
    visibleTasks.forEach((t) => {
        const li = document.createElement("li");
        li.className = t.completed ? "completed" : "";

        const textSpan = document.createElement("span");
        textSpan.className = "task-text";
        textSpan.textContent = t.text;

        const userTag = document.createElement("span");
        userTag.className = "task-user";
        userTag.textContent = t.user;

        const dateTag = document.createElement("span");
        dateTag.className = "task-date";
        dateTag.textContent = t.createdAt

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.className = "btn-complete";
        completeBtn.textContent = t.completed ? "Undo" : "Done";
        completeBtn.addEventListener("click", () => toggleComplete(t.id));

        const editBtn = document.createElement("button");
        editBtn.className = "btn-edit";
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => editTask(t.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteTask(t.id));

        actions.appendChild(completeBtn);
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(textSpan);
        li.appendChild(userTag);
        li.appendChild(dateTag);
        li.appendChild(actions);

        list.appendChild(li);
    });
}


function updateStats() {
    const currentUser = userSelect.value;

    const relevantTasks = currentUser
        ? tasks.filter((t) => t.user === currentUser)
        : tasks;

    const total = relevantTasks.length;
    const completed = relevantTasks.filter((t) => t.completed).length;
    const pending = total - completed;

    totalCountEl.textContent = total;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = pending;
}


addUserBtn.addEventListener("click", addUser);
editUserBtn.addEventListener("click", editUser);
addTaskBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAllTasks);

// Pressing Enter in the inputs should also submit
userNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addUser();
});
taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

// Changing the user or the status filter should re-render the list + stats
userSelect.addEventListener("change", () => {
    renderTasks();
    updateStats();
});
filterSelect.addEventListener("change", renderTasks);

loadFromStorage();
renderUsers();
renderTasks();
updateStats();