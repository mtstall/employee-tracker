-- SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id
-- FROM employee
-- JOIN role ON role.id = employee.role_id
-- JOIN department ON role.department_id = department.id
-- AS e
-- LEFT JOIN employee AS m on m.manager_id = e.role_id;


-- SELECT a.id, a.first_name, a.last_name, role.title, department.name AS "department_name", department.id AS "department_id", role.salary, CONCAT(b.first_name," ",b.last_name) AS "manager_name"
-- FROM employee AS a
-- INNER JOIN employee AS b
-- ON b.id = a.manager_id
-- JOIN role ON role.id = a.role_id
-- JOIN department ON department.id = role.department_id;

INSERT INTO department (name) VALUES ('Test Department')