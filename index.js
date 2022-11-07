const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'root',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

let employees;
db.query('SELECT * FROM employee', function (err, results) {
  //console.table(results);
  employees = results.map(employeeObj => {
    return employeeObj.first_name + " " + employeeObj.last_name
  })
  console.log(employees)
  console.log(employees[0])
  init()
});



const questions = [{
    type: 'list',
    message: 'Select an option',
    name: 'option',
    choices: ['view all departments', 'view all roles', 'view all employees', 
      'add a department', 'add a role', 'add an employee', 
      'update an employee role']
  },
  {
    type: 'input',
    message: 'What is the name of the department you are adding?',
    name: 'department',
    when: (answers) => answers.option === "add a department"
  },
  {
    type: 'input',
    message: 'What is the name of the role you are adding?',
    name: 'role',
    when: (answers) => answers.option === "add a role"
  },
  {
    type: 'input',
    message: 'What is the salary of the role you are adding?',
    name: 'salary',
    when: (answers) => answers.option === "add a role"
  },
  {
    type: 'input',
    message: 'What department is the role you are adding part of?',
    name: 'roleDepartment',
    when: (answers) => answers.option === "add a role"
  },
  {
    type: 'input',
    message: 'What is the employee\'s first name?',
    name: 'firstName',
    when: (answers) => answers.option === "add an employee"
  },
  {
    type: 'input',
    message: 'What is the employee\'s last name?',
    name: 'lastName',
    when: (answers) => answers.option === "add an employee"
  },
  {
    type: 'input',
    message: 'What is the employee\'s role?',
    name: 'employeeRole',
    when: (answers) => answers.option === "add an employee"
  },
  {
    type: 'input',
    message: 'What is the ID of the employee\'s manager?',
    name: 'employeeManager',
    when: (answers) => answers.option === "add an employee"
  },
  {
    type: 'list',
    message: 'Which employee\'s role do you want to update?',
    name: 'UpdatedEmployee',
    choices: employees,
    when: (answers) => answers.option === "update an employee role"
  }];

function init() {
    inquirer
    .prompt(questions)
    .then((response) => handleResponse(response))
  }

function handleResponse(response) {
  console.log(response)
  switch(response.option) {
    case "view all departments":
      //console.log("department chosen")
      db.query('SELECT * FROM department', function (err, results) {
        console.table(results);
      })
      //init()
      break;

    case "view all roles":
      //console.log("")
      db.query('SELECT * FROM role JOIN department ON role.department_id = department.id', function (err, results) {
        console.table(results);
      })
      break;
      
    case "view all employees":
      //console.log("")
      db.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
        console.table(results);
      })
      break;

    case "add a department":
      console.log("add a department chosen")
      db.query(`INSERT INTO department(name) VALUES (?),`, response.department, function (err, results) {
        if (err) {
          console.log(err);
        }
        console.table(results);
      })
      break;
    default:
  }
}

//init()