import * as chalk from 'chalk';
let fs = require('fs');

export function initResume(resumeJson : any, fileName : string){
    console.log(chalk.blue("Initializing new resume"));
    doesNotHaveResume();

}

function doesNotHaveResume() : boolean {
    if(fs.existsSync('./resume.json')){
        console.log(chalk.red('There is already a resume.json file in this directory. Please initialize this resume in a different folder.'));
        return false;
    }
    return true;
}

