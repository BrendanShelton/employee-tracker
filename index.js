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

let questions


db.query('SELECT * FROM employee', function (err, results) {

  let employees = results.map(employeeObj => {
    return employeeObj.first_name + " " + employeeObj.last_name
  })
  
  db.query('SELECT * FROM role', function (err, results) {
  
    let roles = results.map(roleObj => {
      return roleObj.title;
    })
    
    questions = [{
      type: 'list',
      message: 'Select an option',
      name: 'option',
      choices: ['view all departments', 'view all roles', 'view all employees', 
        'add a department', 'add a role', 'add an employee', 
        'update an employee role', 'quit']
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
      name: 'updatedEmployee',
      choices: employees,
      when: (answers) => answers.option === "update an employee role"
    },
    {
      type: 'list',
      message: 'What is the employee\'s new role?',
      name: 'pdatedEmployeeRole',
      choices: roles,
      when: (answers) => answers.option === "update an employee role"
    }];
  
    init()

  })
  
  
});


  
function init() {
    inquirer
    .prompt(questions)
    .then((response) => handleResponse(response))
  }

function handleResponse(response) {
  console.log(response)
  switch(response.option) {
    case "view all departments":
      viewDepartments(response)
      break;

    case "view all roles":
      viewRoles(response);

      break;
      
    case "view all employees":
      viewEmployees(response);
      break;

    case "add a department":
      addDepartment(response)

      break;

    case "add a role":
      addRole(response)

      break;

    case "add an employee":
      addEmployee(response)
          
      break;

    case "update an employee role":
      updateRole(response)

      break;

    default:
      console.log("no option chosen")
  }
}

function viewDepartments(response) {
  //console.log("department chosen")
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results);
  })
  //init()
}

function viewRoles(response) {
  //console.log("")
  db.query('SELECT * FROM role JOIN department ON role.department_id = department.id', function (err, results) {
    console.table(results);
  })
}

function viewEmployees(response) {
  //console.log("")
  db.query('SELECT employee.id, first_name, last_name FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
    console.table(results);
  })
}

function addDepartment(response) {
  console.log("add a department chosen")
      db.query(`INSERT INTO department(name) VALUES (?)`, response.department, function (err, results) {
        if (err) {
          console.log(err);
        }
        console.log(`Added ${response.department} to database.`);
      })
}

function addRole(response) {
  console.log("add a role chosen")
  let id
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      console.log(err);
  }
    //console.log(results);
    //console.log("first row:");
    //console.log(results[0]);
    for(row of results) {
      console.log(row)
      if (row.name === response.roleDepartment) {
        id = row.id
      }
  }
    db.query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`, [response.role, response.salary, id], function (err, results) {
      if (err) {
        console.log(err);
      }
      console.log(`Added ${response.role} to database.`);
  })
})
}

function addEmployee(response) {
  console.log("add an employee chosen")
  let roleId
  let manager = response.employeeManager.split(" ")
  let managerId
  db.query('SELECT * FROM role', function (err, results) {
    if (err) {
      console.log(err);
    }
    
    for(row of results) {
      console.log(row)
      if (row.title === response.employeeRole) {
        roleId = row.id
      }
    }
    db.query('SELECT * FROM employee', function (err, results) {
      if (err) {
        console.log(err);
      }
      for(row of results) {
        console.log(row)
        if (row.first_name === manager[0] && row.last_name === manager[1]) {
          managerId = row.id
        }
      }
        db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [response.firstName, response.lastName, roleId, managerId], function (err, results) {
          if (err) {
          console.log(err);
          }
            console.log(`Added ${response.firstName} ${response.lastName} to database.`);
          })
        })
  })
}

function updateRole(response) {
  console.log("updating role")
  console.log(response)
  let roleId
  employeeArr = response.updatedEmployee.split(' ')

  db.query('SELECT * FROM role', function (err, results) {
  
    for(row of results) {
      if (row.title === response.updatedEmployeeRole) {
        roleId = row.id
      }
  }
  })


  db.query('UPDATE employee WHERE first_name = ? and last_name = ? SET role_id = ?', [employeeArr[0], employeeArr[1], roleId], function (err, results) {
    console.log(`updated role of ${response.updatedEmployee} to ${response.updatedEmployeeRole}`);
  })
}