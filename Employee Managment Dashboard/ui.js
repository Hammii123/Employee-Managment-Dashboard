export function renderEmployees(employeeList) {
    const tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = "";

    employeeList.forEach((employee) => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = employee.name;

        const emailCell = document.createElement("td");
        emailCell.textContent = employee.email;

        const departmentCell = document.createElement("td");
        departmentCell.textContent = employee.department || "-";

        const positionCell = document.createElement("td");
        positionCell.textContent = employee.position || "-";

        const actionsCell = document.createElement("td");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "btn-edit";
        editBtn.dataset.id = employee.id;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "btn-delete";
        deleteBtn.dataset.id = employee.id;

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);

        row.appendChild(nameCell);
        row.appendChild(emailCell);
        row.appendChild(departmentCell);
        row.appendChild(positionCell);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

export function renderDepartmentOptions(employeeList) {
    const departmentFilter = document.getElementById("departmentFilter");

    // pull out unique department names from the current employee list
    const departments = [];
    employeeList.forEach((emp) => {
        if (emp.department && !departments.includes(emp.department)) {
            departments.push(emp.department);
        }
    });

    departmentFilter.innerHTML = '<option value="all">All Departments</option>';

    departments.forEach((dept) => {
        const option = document.createElement("option");
        option.value = dept;
        option.textContent = dept;
        departmentFilter.appendChild(option);
    });
}