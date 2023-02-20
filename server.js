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
    else if(response.firstquestion === "Quit") {
            console.log("Bye!");
            return;
            }
    }