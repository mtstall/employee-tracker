SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id
FROM employee
JOIN role ON role.id = employee.role_id
JOIN department ON role.department_id = department.id;