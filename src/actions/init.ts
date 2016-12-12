import * as chalk from 'chalk';
import {Resume} from '../models/resume';

let fs = require('fs');
let resumeJson = require('resume-schema').resumeJson;
let process = require('process');

export class InitAction{
    initResume(resume : Resume){
        if(resume.exists()){
            console.log(chalk.yellow('There is already a resume.json file in this directory.'));
        }
        else {
            resume.init();
            console.log(chalk.green('Your resume.json has been created!'));
        }
    }
}

