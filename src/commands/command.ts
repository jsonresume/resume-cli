import {IExpandedCommand} from './commander-extension';
import {Resume} from '../models/Resume';

export abstract class ResumeCommand {
    resumeJson : any;
    fileName : string;
    resume : Resume;

    addFlags(program: IExpandedCommand) : IExpandedCommand {
        return program;
    }

    needsValidation() : boolean {
        return false;
    }

    needsUpdateCheck(): boolean {
        return false;
    }

    
}