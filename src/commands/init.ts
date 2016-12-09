import {ResumeCommand} from './command';
import {ICommand} from 'commander';
import {InitAction} from '../actions/init';


export class InitCommand extends ResumeCommand {
    addFlags(program: ICommand) : ICommand{
        program
        .command('init')
        .description('Initialize a resume.json file')
        .action(this.execute);
        return program;
    }

    execute(){
        let init : InitAction = new InitAction();
        init.initResume(this.resumeJson, this.fileName);
    }
}