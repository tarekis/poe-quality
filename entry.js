const colors = require('colors');
const inquirer = require('inquirer');
const _arguments = require('optimist').argv;
const fs = require('fs');

const readableProperties = {
    stashTabName: "Stash tab name",
    sessionId: "Session ID",
    accountName: "Account Name",
    league: "League Name"
}

if ((_arguments.h)||(_arguments.help)) {
    console.log('poe-quality'.bold.white + ' to get all your combinations.');
    console.log('poe-quality config'.bold.white + ' to set your config.');
    process.exit(0);
}

if (_arguments._.length === 0) {
    require('./lib/main');
} else {
    if (_arguments._[0] === 'config') {
        const questions = [{
            name: 'changeFields',
            message: 'Which fields do you want to change?',
            type: 'checkbox',
            choices: [
                {
                    name: readableProperties.stashTabName
                },
                {
                    name: readableProperties.sessionId
                },
                {
                    name: readableProperties.accountName
                },
                {
                    name: readableProperties.league
                }
            ]
        }];

        inquirer.prompt(questions)
        .then(answers => {
            return inquirer.prompt(answers.changeFields.map(configProperty => {
                return {
                    name: configProperty,
                    message: 'Please enter the new ' + configProperty.charAt(0).toLowerCase() +  configProperty.slice(1) + ':',
                    type: 'text'
                }
            }))
        })
        .then(answers => {
            return inquirer.prompt([{
                name: 'changeFields',
                message: 'Are you sure you entered the correct values?',
                type: 'confirm'
            }])
            .then(_answers => {
                if (_answers.changeFields) {
                    return answers;
                } else {
                    console.log('No changes were made to your configuration.');
                    process.exit(0);
                }
            });
        })
        .then(changes => new Promise((resolve, reject) => {
                fs.readFile('config.json', 'utf8', (error, data) => {
                    if (error) {
                        reject(error);
                    }

                    const newOptions = {};
                    const readablePropertyToPropertyMap = {};
                    for (const key in readableProperties) {
                        readablePropertyToPropertyMap[readableProperties[key]] = key;
                    }

                    Object.keys(changes).forEach(answerProperty => {
                        newOptions[readablePropertyToPropertyMap[answerProperty]] = changes[answerProperty];
                    });
            
                    const oldOptions = JSON.parse(data);
                    resolve(Object.assign(oldOptions, newOptions));
                });
        })
        .then(newOptions => new Promise((resolve, reject) => {
            fs.writeFile('config.json', JSON.stringify(newOptions), (err) => {
                if (err) throw err;
                console.log('Your configuarion has been saved!'.green.bold + '  Run ' + 'poe-quality'.bold.white + ' to calculate combinations!');
            });
        })))
        .catch(error => {
            console.log('❌  ' + error.red);
            process.end(1);
        });        
    } else {
        console.log('Bad command!'.bold.red);
        console.log('See ' + 'poe-quality --help'.bold.white + ' for help.');
        process.exit(1);
    }
}
