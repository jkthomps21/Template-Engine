const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const asyncWriter = util.promisify(fs.writeFile);
const render = require("./lib/htmlRenderer");

const employees = [];
const ids = [];
const managerInfo = [
    {
        type: "input",
        message: "What is the full name of your new team manager?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your new manager's employee id?",
        name: "id",
        validate: (input) => (!Number(input) || ids.includes(Number(input))) ? "Please provide a new id number." : true
    },
    {
        type: "input",
        message: "What is your new team manager's email address?",
        name: "email",
        validate: (input) => (!input) ? "Please provide a valid email address." : true
    },
    {
        type: "input",
        message: "Enter the office number of your team manager",
        name: "officeNumber",
        validate: (input) => !Number(input) ? "Please provide a valid office number." : true
    }
];

const userChoices = [
    {
        type: "list",
        message: "Please choose one of the following:",
        name: "choice",
        choices: [
            {
                name: "Add an engineer to your team.",
                value: "addEngineer",
            },
            {
                name: "Add an intern to the team.",
                value: "addIntern",
            },
            {
                name: "Generate HTML page (no additional team members).",
                value: "generate",
            },
            {
                name: "Exit application without generating page.",
                value: "exit",
            }
        ]
    }
];

const engineerInfo = [
    {
        type: "input",
        message: "What is the full name of your new engineer?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your new engineer's employee ID?",
        name: "id",
        validate: (input) => (!Number(input) || ids.includes(Number(input))) ? "Please provide a new ID number." : true
    },
    {
        type: "input",
        message: "What is your new engineer's email address?",
        name: "email",
        validate: (input) => (!input) ? "Please provide a valid email address." : true
    },
    {
        type: "input",
        message: "What is your new engineer's github username?",
        name: "github",
        validate: (input) => (!input) ? "Please provide a valid github username." : true
    }
];

const internInfo = [
    {
        type: "input",
        message: "What is the full name of your new intern?",
        name: "name"
    },
    {
        type: "input",
        message: "What is your new intern's employee ID?",
        name: "id",
        validate: (input) => (!Number(input) || ids.includes(Number(input))) ? "Please provide a new ID number." : true
    },
    {
        type: "input",
        message: "What is your new intern's email address?",
        name: "email",
        validate: (input) => (!input) ? "Please provide a valid email address." : true
    },
    {
        type: "input",
        message: "What school did your new intern come from?",
        name: "school",
        validate: (input) => (!input) ? "Please provide a school." : true
    }
];

function userPrompt(prompt) {return inquirer.prompt(prompt);}

async function createTeam() {
    try {
        console.log(
            `\nWelcome to my automated CLI HTML generator! :)\n`
        );
        console.log(
            `A staff contact page will be created once all required information has been entered. The HTML file will be created in your output folder.\n`
        );
        let manager = await userPrompt(managerInfo);
        ids.push(Number(manager.id));
        employees.push(new Manager(...Object.values(manager)));
        console.log("");
        for (employee of employees) {
            let { choice } = await userPrompt(userChoices);
            console.log("");
            switch (choice) {
                case "addEngineer":
                    let engineer = await userPrompt(engineerInfo);
                    ids.push(Number(engineer.id));
                    employees.push(new Engineer(...Object.values(engineer)));
                    console.log("");
                    break;
                case "addIntern":
                    let intern = await userPrompt(internInfo);
                    ids.push(Number(intern.id));
                    employees.push(new Intern(...Object.values(intern)));
                    console.log("");
                    break;
                case "generate":
                    console.log("All employees were entered successfully!");
                    break;
                case "exit":
                    console.log("User has chosen to exit.");
                    return;
            } 
        }
        employees.sort((a, b) => a.id - b.id);
        const htmlString = render(employees);
        // Creates an output folder for the team.html (output will not be included in commit (.gitignore))
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        await asyncWriter(outputPath, htmlString);
        console.log(`\nThe "team.html" has been successfully created!`)
    } catch(err) {
        console.log(err);
    }
}

createTeam();

