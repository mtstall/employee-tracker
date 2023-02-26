INSERT INTO department (name)
VALUES ("Information Technology"),
        ("Administration"),
        ("Accounting"),
        ("Marketing"),
        ("Sales"),
        ("Human Resources"),
        ("Customer Service");

INSERT INTO role (title, salary, department_id)
VALUES ("IT Analyst", 100000, 1),
        ("Admin Assistant", 50000, 2),
        ("Accountant", 80000, 3),
        ("Marketing Specialist", 65000, 4),
        ("Sales Representative", 80000, 5),
        ("Human Resources Manager", 60000, 6),
        ("Customer Service Rep", 75000, 7),
        ("IT Manager", 125000, 1),
        ("CEO",1000000,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sarah", "Smith", 1, 8),
        ("Joe", "Shmoe", 2, 2),
        ("Stanley", "Yelnats", 3, 9),
        ("Hector", "Zeroni", 4, 9),
        ("Kathryn", "Barlow", 5, 9),
        ("Marion", "Sevillo", 6, 9),
        ("Rex", "Washburn", 7, 9),
        ("Katniss", "Everdeen", 8, 9),
        ("Doug","Dimmadome",9,NULL);