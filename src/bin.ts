#!/usr/bin/env node

import {ICommand} from 'commander';
import {commands} from './commands';
import {InitCommand} from './commands/init';

let program : ICommand = require('commander');

program
  .usage("[command] [options]")

// Take all commands from folder
for(let command of commands){
  program = command.addFlags(program);
}

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}

