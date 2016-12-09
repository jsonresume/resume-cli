import * as chalk from 'chalk';
let fs = require('fs');
let resumeJson = require('resume-schema').resumeJson;
let process = require('process');

export class InitAction{
    initResume(resumeJson : any, fileName : string){
        console.log(chalk.blue("Initializing new resume"));
        if(!this.doesHaveResume(process.cwd())){
            fs.writeFileSync(process.cwd() + '/resume.json', JSON.stringify(resumeJson, undefined, 2));
        }
    }

    doesHaveResume(path : string) : boolean {
        if(fs.existsSync(path + '/resume.json')){
            console.log(chalk.red('There is already a resume.json file in this directory. Please initialize this resume in a different folder.'));
            return true;
        }
        return false;
    }
}

