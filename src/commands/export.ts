import {ResumeCommand} from './command';
import {IExpandedCommand} from './commander-extension';
import {ExportAction} from '../actions/export';
import {Resume} from '../models/resume';

export class ExportCommand extends ResumeCommand {
    addFlags(program: IExpandedCommand) : IExpandedCommand{
        let thisFlag : any = this;
        program
        .command('export [fileName]')
        .description('export a resume.json file to various formats')
        .action(function(fileName) {
            thisFlag.execute(program.theme, fileName);
        });
        return program;
    }

    execute(theme : string, fileName : string){
        let resume = new Resume('resume.json');
        let init : ExportAction = new ExportAction()
        
        init.exportResume(resume, theme, fileName);
    }
}