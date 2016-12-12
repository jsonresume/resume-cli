import {Resume} from '../models/resume';
import * as chalk from 'chalk';
let fs = require('fs');
let resumeJson = require('resume-schema').resumeJson;
let process = require('process');

export class TestAction{
    testResume(resume : Resume){
        resume.test((report : boolean, errs : any) => {
            if(!report){
                console.log(chalk.red("Resume is invalid" + errs));
            }
            else {
                console.log(chalk.green("Resume is good"));
            }
        });
    }
}

