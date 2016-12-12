import {ICommand} from 'commander';
    export interface IExpandedCommand extends ICommand {
        theme: string; 
    }