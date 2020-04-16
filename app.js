const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const inquirer = require('inquirer');
const fs = require('fs');
const render = require('./lib/htmlRenderer');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

const teamArray = [];
const idArray = [];

//question array for each role as chosen
const askQuestion = teamMember => [
  {
    type: 'input',
    name: 'name',
    message: `What is the ${teamMember}'s name?`
  },
  {
    type: 'input',
    name: 'id',
    message: `What is the ${teamMember}'s id?`
  },
  {
    type: 'input',
    name: 'email',
    message: `What is the ${teamMember}'s email address?`
  }
];

// setup for prompts depending on role chosen
const team = () => {

  console.log("Welcome to your Team Roster Web Builder! Let's get started:");

  const addManager = async () => {
    const response = await inquirer.prompt([
      ...askQuestion('manager'),
      {
        type: 'input',
        name: 'officeNumber',
        message: "what is the manager's office number?"
      }
    ]);

    const { name, id, email, officeNumber } = response;
    const manager = new Manager(name, id, email, officeNumber);

    teamArray.push(manager);
    idArray.push(id);

    createTeam();
  };

  const addEngineer = async () => {
    const response = await inquirer.prompt([
      ...askQuestion('engineer'),
      {
        type: 'input',
        name: 'github',
        message: "What is the engineer's GitHub username?"
      }
    ]);

    const { name, id, email, github } = response;
    const engineer = new Engineer(name, id, email, github);

    teamArray.push(engineer);
    idArray.push(id);

    createTeam();
  };

  const addIntern = async () => {
    const response = await inquirer.prompt([
      ...askQuestion('intern'),
      {
        type: 'input',
        name: 'school',
        message: "Where did the intern go to school?"
      }
    ]);

    const { name, id, email, school } = response;
    const intern = new Intern(name, id, email, school);

    teamArray.push(intern);
    idArray.push(id);

    createTeam();
  };

//allows user to choose role. After role is chosen the switch runs to the const above
  const createTeam = async () => {
    const response = await inquirer.prompt([
      {
        type: 'list',
        name: 'userChoice',
        message: 'Who would you like to add to your team?',
        choices: ['Manager','Engineer', 'Intern', "My team is complete."]
      }
    ]);

    switch (response.userChoice) {
      case 'Manager':
        addManager();
        break;

      case 'Engineer':
        addEngineer();
        break;

      case 'Intern':
        addIntern();
        break;

      default:
        fs.writeFileSync(outputPath, render(teamArray), 'utf-8');
        break;
    }
  };

  createTeam();
};

team();