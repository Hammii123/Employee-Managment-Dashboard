export function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@.]+\.[^\s@.]+$/;
    return emailPattern.test(email);
}

export function isValidName(name) {
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

export function getDashboardStats(employeeList) {
    const totalEmployees = employeeList.length;

    const departmentCounts = {};

    employeeList.forEach((emp) => {
        const dept = emp.department || "Unassigned";
        departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    return {
        totalEmployees,
        departmentCounts
    };
}