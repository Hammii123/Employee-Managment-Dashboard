import { getEmployees, setEmployees, addEmployee, updateEmployee, deleteEmployee, loadFromStorage } from "./state.js";
import { renderEmployees, renderDepartmentOptions } from "./ui.js";
import { generateId, isValidEmail, isValidName, isDuplicateEmail, filterByName, filterByDepartment } from "./utils.js";

const testEmployees = [
    { id: generateId(), name: "Malik Ali", email: "ali@company.com", department: "Engineering", position: "Frontend Developer" },
    { id: generateId(), name: "Sara Ahmed", email: "sara@gmail.com", department: "Marketing", position: "Content Strategist" },
    { id: generateId(), name: "Shazam Ilyas", email: "sahzi@gmail.com", department: "Engineering", position: "Backend Developer" }
];

setEmployees(testEmployees);

/* ---------- ELEMENTS ---------- */

const modal = document.getElementById("employeeModal");
const modalTitle = document.getElementById("modalTitle");
const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const employeeForm = document.getElementById("employeeForm");
const tableBody = document.getElementById("employeeTableBody");

const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const departmentInput = document.getElementById("departmentInput");
const positionInput = document.getElementById("positionInput");

const searchInput = document.getElementById("searchInput");
const departmentFilter = document.getElementById("departmentFilter");

// tracks whether we're adding a new employee or editing an existing one
let editingId = null;

/* ---------- MAIN RENDER PIPELINE ---------- */

function refreshAll() {
    renderDepartmentOptions(getEmployees());
    applyFilters();
}

function applyFilters() {
    let result = getEmployees();
    result = filterByName(result, searchInput.value);
    result = filterByDepartment(result, departmentFilter.value);
    renderEmployees(result);
}

refreshAll();

/* ---------- SEARCH + DEPARTMENT FILTER ---------- */

let searchTimeout;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(applyFilters, 300);
});

departmentFilter.addEventListener("change", applyFilters);

/* ---------- OPEN / CLOSE MODAL ---------- */

function openModal(editEmployee = null) {
    if (editEmployee) {
        modalTitle.textContent = "Edit Employee";
        editingId = editEmployee.id;
        nameInput.value = editEmployee.name;
        emailInput.value = editEmployee.email;
        departmentInput.value = editEmployee.department;
        positionInput.value = editEmployee.position || "";
    } else {
        modalTitle.textContent = "Add Employee";
        editingId = null;
        employeeForm.reset();
    }
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    employeeForm.reset();
    editingId = null;
}

addEmployeeBtn.addEventListener("click", () => openModal());
cancelModalBtn.addEventListener("click", closeModal);

/* ---------- FORM SUBMISSION (handles both ADD and EDIT) ---------- */

employeeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const department = departmentInput.value.trim();
    const position = positionInput.value.trim();

    if (!name) {
        alert("Name is required.");
        return;
    }

    if (!isValidName(name)) {
        alert("Name must contain only letters and spaces (no numbers or symbols).");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (isDuplicateEmail(email, getEmployees(), editingId)) {
        alert("An employee with this email already exists.");
        return;
    }

    if (!department) {
        alert("Department is required.");
        return;
    }

    if (editingId) {
        updateEmployee(editingId, { name, email, department, position });
    } else {
        addEmployee({ id: generateId(), name, email, department, position });
    }

    refreshAll();
    closeModal();
});

/* ---------- EDIT / DELETE (event delegation on the table body) ---------- */

tableBody.addEventListener("click", (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains("btn-edit")) {
        const employee = getEmployees().find((emp) => emp.id === id);
        if (employee) openModal(employee);
    }

    if (e.target.classList.contains("btn-delete")) {
        if (confirm("Delete this employee?")) {
            deleteEmployee(id);
            refreshAll();
        }
    }
});