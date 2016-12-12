import {InitCommand} from './init';
import {TestCommand} from './test';
import {ResumeCommand} from './command';
import {ExportCommand} from './export';

export let commands : Array<ResumeCommand> = [new InitCommand(), new TestCommand(), new ExportCommand()];