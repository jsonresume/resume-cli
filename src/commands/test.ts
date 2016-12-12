import {ResumeCommand} from './command';
import {IExpandedCommand} from './commander-extension';
import {TestAction} from '../actions/test';
import {Resume} from '../models/resume';

export class TestCommand extends ResumeCommand {
    addFlags(program: IExpandedCommand) : IExpandedCommand{
        program
        .command('test')
        .description('test a resume.json file')
        .action(this.execute);
        return program;
    }

    execute(){
        let resume = new Resume('resume.json');
        let init : TestAction = new TestAction();
        init.testResume(resume);
    }
}