const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

//creates connection to database
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

//gets an array of employees which will be used in the question choices
db.query('SELECT * FROM employee', function (err, results) {

  let employees = results.map(employeeObj => {
    return employeeObj.first_name + " " + employeeObj.last_name
  })
//gets an array of roles which will be used in the question choices
  db.query('SELECT * FROM role', function (err, results) {
  
    let roles = results.map(roleObj => {
      return roleObj.title;
    })

//the questions the user will be asked
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
      type: 'list',
      message: 'What is the employee\'s role?',
      name: 'employeeRole',
      choices: roles,
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
      name: 'updatedEmployeeRole',
      choices: roles,
      when: (answers) => answers.option === "update an employee role"
    }];
  

    init()
  })
  
});

//displays the questions for the user
function init() {
    inquirer
    .prompt(questions)
    .then((response) => handleResponse(response))
  }

//called after the user answers questions
function handleResponse(response) {
  switch(response.option) {
    case "view all departments":
      viewDepartments(response)
      init()
      break;

    case "view all roles":
      viewRoles(response);
      init()
      break;
      
    case "view all employees":
      viewEmployees(response);
      init()
      break;

    case "add a department":
      addDepartment(response)
      init()
      break;

    case "add a role":
      addRole(response)
      init()
      break;

    case "add an employee":
      addEmployee(response)
      init()
      break;

    case "update an employee role":
      updateRole(response)
      init()
      break;

    case "quit":
      process.exit();

      break;
    default:
      console.log("no option chosen")
  }
}

function viewDepartments(response) {
//selects and displays the "department" table 
  db.query('SELECT * FROM department', function (err, results) {
    console.log("\b");
    console.table(results);
  })
 
}

function viewRoles(response) {
//selects and displays the "role" table with the corresponding department joined to each role
  db.query('SELECT * FROM role JOIN department ON role.department_id = department.id', function (err, results) {
    console.log("\b");
    console.table(results);
  })
}

function viewEmployees(response) {
//selects and displays the "employee" table with the corresponding role joined to each employee
  db.query('SELECT * FROM employee JOIN role ON employee.role_id = role.id', function (err, results) {
    console.log("\b");
    console.table(results);
  })
}

function addDepartment(response) {
//inserts the department the user entered into the "department" table
  db.query(`INSERT INTO department(name) VALUES (?)`, response.department, function (err, results) {
    if (err) {
      console.log(err);
    }
      console.log("\b");
      console.log(`Added ${response.department} to database.`);
    })
}

function addRole(response) {

  let id
//gets the id of the department the user entered
  db.query('SELECT * FROM department', function (err, results) {
    if (err) {
      console.log(err);
    }
    for(row of results) {
      console.log(row)
      if (row.name === response.roleDepartment) {
        id = row.id
      }
      
  }
//inserts the role the user entered into the "role" table if user entered a valid department
  if (!id) {
    console.error("department does not exist")
  } else {
    db.query(`INSERT INTO role(title, salary, department_id) VALUES (?,?,?)`, [response.role, response.salary, id], function (err, results) {
      if (err) {
        console.log(err);
      }
      console.log("\b");
      console.log(`Added ${response.role} to database.`);
  })
  }

})
}

function addEmployee(response) {
  let roleId
  let manager = response.employeeManager.split(" ")
  let managerId

//gets the id of the role the user entered
  db.query('SELECT * FROM role', function (err, results) {
    if (err) {
      console.log(err);
    }
    
    for(row of results) {
      if (row.title === response.employeeRole) {
        roleId = row.id
      }
    }
//inserts the employee the user entered into the "role" table if user entered a valid manager
    db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [response.firstName, response.lastName, roleId, response.employeeManager], function (err, results) {
      if (err) {
      console.log(err);
      }
      console.log("\b");
      console.log(`Added ${response.firstName} ${response.lastName} to database.`);
      })
   
  })
}

function updateRole(response) {
  let roleId
//splits the first and last name of the employee the user chose
  employeeArr = response.updatedEmployee.split(' ')
//gets the role the user entered
  db.query('SELECT * FROM role', function (err, results) {
  
    for(row of results) {
      if (row.title === response.updatedEmployeeRole) {
        roleId = row.id
      }
  }
//updates the role of the chosen employee to the role the chosen role
    db.query('UPDATE employee WHERE first_name = ? and last_name = ? SET role_id = ?', [employeeArr[0], employeeArr[1], roleId], function (err, results) {
      console.log("\b");
      console.log(`updated role of ${response.updatedEmployee} to ${response.updatedEmployeeRole}`);
    })
  })

  
}