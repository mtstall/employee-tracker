// packages needed to run application
const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// create connection to db
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // TODO: Add MySQL password
      password: '12345',
      database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
  );

// array of questions for user input
const questions = [
    {
        type: "list",
        choices: [
            { name: "View all departments"},
            { name: "View all roles"},
            { name: "View all employees"},
            { name: "Add a department"},
            { name: "Add a role"},
            { name: "Add an employee"},
            { name: "Update an employee role"},
            { name: "Quit"},
        ],
        message: "Select from the following:",
        name: "firstquestion"
    }
];

function init (response) {
    inquirer.prompt(questions).then((response) => {
        determineResponse(response);
    })
}

init();

function determineResponse (response) {
    if(response.firstquestion === "View all departments") {
            db.query(`SELECT * FROM department`, function(err, results) {
                console.table(results);
                init();
            })
    }
    else if (response.firstquestion === "View all roles") {
            db.query(`SELECT * FROM role`, function(err, results) {
                console.table(results); 
                init();
            })
    }
    else if(response.firstquestion === "View all employees") {
        // COME BACK TO THIS - NEED TO ADD MGR NAME
            db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id
            FROM employee
            JOIN role ON role.id = employee.role_id
            JOIN department ON role.department_id = department.id`, function(err, results) {
            console.table(results);
            init();
            })
    }
    else if(response.firstquestion === "Add a department") {
            addDepartment();
            }
    else if (response.firstquestion === "Add a role") {
        addRole();
    }
    else if (response.firstquestion === "Add an employee") {
        addEmployee();
    }
    else if(response.firstquestion === "Quit") {
            console.log("Bye!");
            return;
            }
    
function addDepartment () {
    const deptQuestion = [
        {
            type: "input",
            message: "Enter department name:",
            name: "deptname"
        }
    ]
    inquirer.prompt(deptQuestion).then((response) => {
        console.log(response.deptname);
        db.query(`INSERT INTO department (name) VALUES ('${response.deptname})'`, function(err, results) {
        // unable to console.log the results
            // console.table(results);
        })
        init();
})
}}

function addRole () {
    const roleQuestions = [
        {
            type: "input",
            message: "Enter role name:",
            name: "rolename"
        },
        {
            type: "input",
            message: "Enter salary:",
            name: "salary"
        },
        {
            type: "input",
            message: "Enter department ID:",
            name: "deptid"
        }
    ]
    inquirer.prompt(roleQuestions).then((response) => {
        console.log(response.rolename);
        db.query(`INSERT INTO role (title, salary, department_ID) VALUES ('${response.rolename}', '${response.salary})', '${response.deptid}`, function(err, results) {
        // unable to console.log the results
            // console.table(results);
        })
        init();
})
}

function addEmployee () {
    const employeeQuestions = [
        {
            type: "input",
            message: "Enter employee first name:",
            name: "firstname"
        },
        {
            type: "input",
            message: "Enter employee last name:",
            name: "lastname"
        },
        {
            type: "input",
            message: "Enter role ID:",
            name: "roleid"
        },
        {
            type: "input",
            message: "Enter employee's manager ID:",
            name: "mgrid"
        }
    ]
    inquirer.prompt(employeeQuestions).then((response) => {
        console.log(response.rolename);
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${response.firstname}', '${response.lastname})', '${response.roleid}', '${response.mgrid}'`, function(err, results) {
        // unable to console.log the results
            // console.table(results);
        })
        init();
})
}