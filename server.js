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
      { name: "Update an employee's manager"},
      { name: "View employees by manager"},
      { name: "View employees by department"},
      { name: "Delete department"},
      { name: "Delete role"},
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
    db.query(`SELECT department.id AS "dept_id", department.name AS "dept_name" FROM department`, function (err, results) {
      console.table(results);
      init();
    });
  } else if (response.firstquestion === "View all roles") {
    db.query(`SELECT role.title AS "job_title", role.id AS "role_id", role.salary, role.department_id FROM role`, function (err, results) {
      console.table(results);
      init();
    });
  } else if (response.firstquestion === "View all employees") {
    db.query(
      `SELECT a.id, CONCAT(a.first_name," ",a.last_name) AS "employee_name", role.title, department.name AS "department_name", department.id AS "department_id", role.salary, CONCAT(b.first_name," ",b.last_name) AS "manager_name"
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
  } else if (response.firstquestion === "Update an employee's manager") {
    updateEmployeeManager();
  } else if (response.firstquestion === "View employees by manager") {
    viewEmployeeByMgr();
  } else if (response.firstquestion === "View employees by department") {
    viewEmployeeByDept();
  } else if (response.firstquestion === "Delete department") {
    deleteDepartment();
  } else if (response.firstquestion === "Delete role") {
    deleteRole();
  } else if (response.firstquestion === "Quit") {
    console.log("Bye!");
    return;
  }
}

async function deleteDepartment () {
    let deptList = await generateDeptList();

    const deptQuestions = [
        {
          type: "list",
          message: "Choose which department you'd like to delete:",
          choices: deptList,
          name: "deptid",
        }
      ];
      inquirer.prompt(deptQuestions).then((response) => {
        db.query(
            `DELETE from department WHERE id = ${response.deptid}`,
          function (err, results) {
            console.log(`Department deleted.`);
            init();
          }
        );
      });
}

async function deleteRole () {
    let roleList = await generateRoleList();

    const roleQuestions = [
        {
          type: "list",
          message: "Choose which role you'd like to delete:",
          choices: roleList,
          name: "roleid",
        }
      ];
      inquirer.prompt(roleQuestions).then((response) => {
        db.query(
            `DELETE from role WHERE id = ${response.roleid}`,
          function (err, results) {
            console.log(`Role deleted.`);
            init();
          }
        );
      });
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
        console.log(`${response.deptname} added to the database.`);
        init();
      }
    );
  });
}

async function addRole() {
    let deptList = await generateDeptList();

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
      message: "Choose department:",
      choices: deptList,
      name: "deptid",
    },
  ];
  inquirer.prompt(roleQuestions).then((response) => {
    db.query(
      `INSERT INTO role (title, salary, department_id) VALUES ('${response.rolename}', '${response.salary}', '${response.deptid}')`,
      function (err, results) {
        console.log(`${response.rolename} added to the database.`);
        init();
      }
    );
  });
}


async function generateDeptList() {
   let [departments] = await db.promise().query(`SELECT * FROM department`);
   return departments.map((element, index, array) => {
      return { name: element.name, value: element.id };
    });
}

async function addEmployee() {
    let roleList = await generateRoleList();
    let managerList = await generateManagerList();
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
      type: "list",
      message: "Enter employee role:",
      choices: roleList,
      name: "roleid",
    },
    {
      type: "list",
      message: "Enter employee's manager:",
      choices: managerList,
      name: "mgrid",
    },
  ];
  inquirer.prompt(employeeQuestions).then((response) => {
    db.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstname}', '${response.lastname}', '${response.roleid}', '${response.mgrid}'`,
      function (err, results) {
        console.log(
          `${response.firstname} ${response.lastname} added to the database.`
        );
        init();
      }
    );
  });
}

async function generateRoleList() {
    let [roles] = await db.promise().query(`SELECT role.id, role.title FROM role`);
    return roles.map((element, index, array) => {
       return { name: element.title, value: element.id };
     });
 }

 async function generateManagerList() {
    let [managers] = await db.promise().query(`SELECT employee.id, CONCAT(employee.first_name," ",employee.last_name) AS "name" FROM employee`)
    return managers.map((element, index, array) => {
        return { name: element.name, value: element.id };
      });
}

async function updateEmployeeRole() {
  let employeeList = await generateManagerList();
  let roleList = await generateRoleList();

    const employeeRoleQuestions = [
    {
      type: "list",
      message: "Choose employee whose role you'd like to update:",
      choices: employeeList,
      name: "empid",
    },
    {
      type: "list",
      message: "What would you like to update their role to?",
      choices: roleList,
      name: "role",
    },
  ];
  inquirer.prompt(employeeRoleQuestions).then((response) => {
    db.query(
      `UPDATE employee SET employee.role_id = ${response.role} WHERE employee.id = ${response.empid}`,
      function (err, results) {
        console.log("Employee updated!")
        init();
      }
    );
  });
}

async function updateEmployeeManager() {
    let employeeList = await generateManagerList();

    const employeeMgrQuestions = [
        {
          type: "list",
          message: "Choose employee whose role you'd like to update:",
          choices: employeeList,
          name: "empid",
        },
        {
          type: "list",
          message: "Who would you like to update the employee's manager to?",
          choices: employeeList,
          name: "mgrid",
        },
      ];
      inquirer.prompt(employeeMgrQuestions).then((response) => {
        db.query(
          `UPDATE employee SET employee.manager_id = ${response.mgrid} WHERE employee.id = ${response.empid}`,
          function (err, results) {
            console.log("Employee updated!")
            init();
          }
        );
      });
}

async function viewEmployeeByMgr () {
    let employeeList = await generateManagerList();

    const mgrQuestions = [
        {
          type: "list",
          message: "Choose which manager you'd like to view employees by:",
          choices: employeeList,
          name: "mgrid",
        }
      ];
      inquirer.prompt(mgrQuestions).then((response) => {
        db.query(
            `SELECT a.id, CONCAT(a.first_name," ",a.last_name) AS "employee_name", role.title, department.name AS "department_name", department.id AS "department_id", role.salary, CONCAT(b.first_name," ",b.last_name) AS "manager_name"
            FROM employee AS a
            INNER JOIN employee AS b
            ON b.id = a.manager_id
            JOIN role ON role.id = a.role_id
            JOIN department ON department.id = role.department_id
           WHERE a.manager_id = ${response.mgrid}`,
          function (err, results) {
            console.table(results);
            init();
          }
        );
      });
}

async function viewEmployeeByDept () {
    let deptList = await generateDeptList();

    const deptQuestions = [
        {
          type: "list",
          message: "Choose which department you'd like to view employees by:",
          choices: deptList,
          name: "deptid",
        }
      ];
      inquirer.prompt(deptQuestions).then((response) => {
        db.query(
            `SELECT a.id, CONCAT(a.first_name," ",a.last_name) AS "employee_name", role.title, department.name AS "department_name", department.id AS "department_id", role.salary, CONCAT(b.first_name," ",b.last_name) AS "manager_name"
            FROM employee AS a
            INNER JOIN employee AS b
            ON b.id = a.manager_id
            JOIN role ON role.id = a.role_id
            JOIN department ON department.id = role.department_id
           WHERE department.id = ${response.deptid}`,
          function (err, results) {
            console.table(results);
            init();
          }
        );
      });
}