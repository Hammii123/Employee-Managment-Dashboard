let employees = [];

export function getEmployees() {
    return employees;
}

export function setEmployees(newEmployees) {
    employees = newEmployees;
}

export function addEmployee(employee) {
    employees.push(employee);
    saveToStorage();
}

export function updateEmployee(id, updatedData) {
    const index = employees.findIndex((emo) => emo.id === id);
    if (index !== -1) {
        employees[index] = { ...employees[index], ...updatedData };
        saveToStorage();
    }
}

export function deleteEmployee(id) {
    employees = employees.filter((emp) => emp.id !== id);
    saveToStorage();
}

export function saveToStorage() {
    localStorage.setItem("employees", JSON.stringify(employees));
}

export function loadFromStorage() {
    const stored = localStorage.getItem("employees");
    employees = stored ? JSON.parse(stored) : [];
}