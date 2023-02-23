// packages needed to run application
const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

// create connection to db
const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // TODO: Add MySQL password
  password: "12345",
  database: "employees_db",
});

// array of questions for user input
const questions = [
  {
    type: "list",
    choices: [
      { name: "View all departments" },
      { name: "View all roles" },
      { name: "View all employees" },
      { name: "Add a department" },
      { name: "Add a role" },
      { name: "Add an employee" },
      { name: "Update an employee role" },
      { name: "Quit" },
    ],
    message: "Select from the following:",
    name: "firstquestion",
  },
];

function init(response) {
  inquirer.prompt(questions).then((response) => {
    determineResponse(response);
  });
}

init();

function determineResponse(response) {
  if (response.firstquestion === "View all departments") {
    db.query(`SELECT * FROM department`, function (err, results) {
      console.table(results);
      init();
    });
  } else if (response.firstquestion === "View all roles") {
    db.query(`SELECT * FROM role`, function (err, results) {
      console.table(results);
      init();
    });
  } else if (response.firstquestion === "View all employees") {
    db.query(
      `SELECT a.id, a.first_name, a.last_name, role.title, department.name AS "department_name", department.id AS "department_id", role.salary, CONCAT(b.first_name," ",b.last_name) AS "manager_name"
            FROM employee AS a
            INNER JOIN employee AS b
            ON b.id = a.manager_id
            JOIN role ON role.id = a.role_id
            JOIN department ON department.id = role.department_id`,
      function (err, results) {
        console.table(results);
        init();
      }
    );
  } else if (response.firstquestion === "Add a department") {
    addDepartment();
  } else if (response.firstquestion === "Add a role") {
    addRole();
  } else if (response.firstquestion === "Add an employee") {
    addEmployee();
  } else if (response.firstquestion === "Update an employee role") {
    updateEmployeeRole();
  } else if (response.firstquestion === "Quit") {
    console.log("Bye!");
    return;
  }
}

function addDepartment() {
  const deptQuestion = [
    {
      type: "input",
      message: "Enter department name:",
      name: "deptname",
    },
  ];
  inquirer.prompt(deptQuestion).then((response) => {
    db.query(
      `INSERT INTO department (name) VALUES (?)`,
      response.deptname,
      function (err, results) {
        console.log("code working");
        console.log(`${response.deptname} added to the database.`);
        init();
      }
    );
  });
}

async function addRole() {
    let deptList = await generateDeptList();
    console.log(deptList);

  const roleQuestions = [
    {
      type: "input",
      message: "Enter role name:",
      name: "rolename",
    },
    {
      type: "input",
      message: "Enter salary:",
      name: "salary",
    },
    {
      type: "list",
      choices: deptList,
      name: "deptid",
    },
  ];
  inquirer.prompt(roleQuestions).then((response) => {
    db.query(
      `INSERT INTO role (title, salary, department_ID) VALUES ('${response.rolename}', '${response.salary})', '${response.deptid}`,
      function (err, results) {
        console.log(`${response.rolename} added to the database.`);
        init();
      }
    );
  });
}


async function generateDeptList() {
   let [departments] = await db.promise().query(`SELECT * FROM department`);
   console.log(departments);
   return departments.map((element, index, array) => {
      return { name: element.name, value: element.id };
    });
}

function addEmployee() {
  const employeeQuestions = [
    {
      type: "input",
      message: "Enter employee first name:",
      name: "firstname",
    },
    {
      type: "input",
      message: "Enter employee last name:",
      name: "lastname",
    },
    {
      type: "input",
      message: "Enter role ID:",
      name: "roleid",
    },
    {
      type: "input",
      message: "Enter employee's manager ID:",
      name: "mgrid",
    },
  ];
  inquirer.prompt(employeeQuestions).then((response) => {
    db.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstname}', '${response.lastname})', '${response.roleid}', '${response.mgrid}'`,
      function (err, results) {
        console.log(
          `${response.firstname} ${response.lastname} added to the database.`
        );
        init();
      }
    );
  });
}

function updateEmployeeRole() {
  const employeeRoleQuestions = [
    {
      type: "input",
      message: "Enter ID of employee you'd like to update:",
      name: "empid",
    },
    {
      type: "input",
      message: "What would you like to update their role to?",
      name: "role",
    },
  ];
  inquirer.prompt(employeeRoleQuestions).then((response) => {
    db.query(
      `UPDATE employee SET (first_name, last_name, role_id, manager_id) VALUES ('${response.firstname}', '${response.lastname})', '${response.roleid}', '${response.mgrid}'`,
      function (err, results) {}
    );
  });
}

// QUESTION: HOW DO I MAKE A LIST BASED OFF EXISTING DEPARTMENTS
// HOW DO I UPDATE AN EMPLOYEE ROLE
// https://stackoverflow.com/questions/66626936/inquirer-js-populate-list-choices-from-sql-database
