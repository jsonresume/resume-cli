#!/usr/bin/env node

import {IExpandedCommand} from './commands/commander-extension';
import {commands} from './commands';
import {InitCommand} from './commands/init';

let program : IExpandedCommand = require('commander');

program
  .usage("[command] [options]")
  .option('-t, --theme <theme name>', 'Specify theme for export or publish (modern, crisp, flat: default)', 'flat')

// Take all commands from folder
for(let command of commands){
  program = command.addFlags(program);
}

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}

