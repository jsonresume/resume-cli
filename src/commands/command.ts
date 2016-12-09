import {ICommand} from 'commander';
export class ResumeCommand {
    resumeJson : any;
    fileName : string;

    addFlags(program: ICommand) : ICommand {
        return program;
    }

    execute(){
        return;
    }

    needsValidation() : boolean {
        return false;
    }

    needsUpdateCheck(): boolean {
        return false;
    }

    
}