import {ResumeCommand} from './command';
import {IExpandedCommand} from './commander-extension';
import {InitAction} from '../actions/init';
import {Resume} from '../models/resume';

export class InitCommand extends ResumeCommand {
    addFlags(program: IExpandedCommand) : IExpandedCommand{
        program
        .command('init')
        .description('Initialize a resume.json file')
        .action(this.execute);
        return program;
    }

    execute(){
        let resume : Resume = new Resume('resume.json');
        let init : InitAction = new InitAction();
        init.initResume(resume);
    }
}