const inquirer = require('inquirer');
const cTable = require('console.table');

const questions = [{
    type: 'list',
    message: 'Select an option',
    name: 'option',
    choices: ['Engineer', 'Intern']
  },
  {
    type: 'input',
    message: 'Enter the team manager\'s employee ID',
    name: 'ID',
  },
  {
    type: 'input',
    message: 'Enter the team manager\'s email address',
    name: 'email',
  },
  {
    type: 'input',
    message: 'Enter the team manager\'s office number',
    name: 'office',
  },
  {
    type: 'loop',
    message: 'Do you want to add more team members?',
    name: 'members',
    questions: [
        {
            type: 'list',
            message: 'What is the next team member\'s role',
            name: 'role',
            choices: ['Engineer', 'Intern']
        },
        {
            type: 'input',
            message: 'Enter the team member\'s name',
            name: 'name',
        },
        {
            type: 'input',
            message: 'Enter the team member\'s employee ID',
            name: 'ID',
        },
        {
            type: 'input',
            message: 'Enter the team member\'s email address',
            name: 'email',
        },
        {
            type: 'input',
            message: 'What is the team member\'s github username?',
            name: 'github',
            when: (answers) => answers.role === "Engineer"
        },
        {
            type: 'input',
            message: 'What is the name of the team member\'s school?',
            name: 'school',
            when: (answers) => answers.role === "Intern"
        },
    ]
  }];

function init() {
    inquirer
    .prompt(questions)
    .then((response) => getTeamMembers(response))
  }