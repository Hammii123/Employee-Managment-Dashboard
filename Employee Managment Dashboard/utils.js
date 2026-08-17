export function isValidEmail(email) {
    // stricter than before: only ONE dot allowed in the domain
    // (blocks chained domains like "123@gmail.edu.ok.com")
    const emailPattern = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;
    return emailPattern.test(email);
}

export function isValidName(name) {
    // letters and spaces only — no digits, no symbols
    const namePattern = /^[A-Za-z\s]+$/;
    return namePattern.test(name.trim());
}

export function isDuplicateEmail(email, employees, excludeId = null) {
    return employees.some((emp) =>
        emp.email.toLowerCase() === email.toLowerCase() && emp.id !== excludeId
    );
}

export function generateId() {
    return Date.now();
}

export function filterByName(employeeList, searchTerm) {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
        return employeeList;
    }

    return employeeList.filter((emp) =>
        emp.name.toLowerCase().includes(term)
    );
}

export function filterByDepartment(employeeList, department) {
    if (department === "all") {
        return employeeList;
    }

    return employeeList.filter((emp) => emp.department === department);
}