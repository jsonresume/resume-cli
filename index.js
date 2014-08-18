#!/usr/bin/env node

var pkg = require('./package.json');
var lib = require('./lib');
var program = require('commander');
var async = require('async');
var colors = require('colors');
var chalk = require('chalk');
var read = require('read');

program
    .version(pkg.version)
    .option('-t, --theme <theme name>', 'Specify theme for export or publish (modern, traditional, crisp)', 'flat')
    .option('-F, --force', 'Used by `publish` - bypasses schema testing.')
    .option('-f, --format <file type extension>', 'Used by `export`.')
    .option('-p, --port <port>', 'Used by `serve` (default: 4000)', 4000)
    .option('-l, --local', 'Used along with port, Used by `serve` to listen at localhost only (default: false)', false)
    .option('-r, --resume <resume file>', 'The json resume file (eg. /path/to/myresume.json).', './resume.json')
    .option('-d, --exportDir <export directory>', 'The directory where to export the resume (default: ' + process.cwd() + '/). Make sure to include the trailing slash `/` (eg. /tmp/docs/). Used by `export`', process.cwd() + '/')
    .option('-c, --config <config file>', 'Specify the json config file path (eg. /path/to/.jsonresume.json).')
    .option('-s, --silent', 'Used by `serve` to tell it if open browser auto or not.', false);

async.waterfall(lib.waterfallArray, function(err, results) {

    program
        .command('init')
        .description('Initialize a resume.json file')
        .action(function() {
            lib.init(program.resume);
        });

    program
        .command('register')
        .description('Register an account at https://registry.jsonresume.org')
        .action(function() {
            lib.register(results.resumeJson);
        });

    program
        .command('login')
        .description('Stores a user session.')
        .action(function() {
            lib.login(config);
        });

    program
        .command('settings')
        .description('Change theme, change password, delete account.')
        .action(function() {
            lib.settings(results.resumeJson, program, results.config);
        });

    // if validation does not pass type resume test
    program
        .command('test')
        .description('Schema validation test your resume.json')
        .action(function() {
            lib.test.validate(results.resumeJson, function(error, response) {
                error && console.log(response.message);
            });
        });

    program
        .command('export [fileName]')
        .description('Export locally to .html, .md or .pdf. Supply a --format <file format> flag and argument to specify export format.')
        .action(function(fileName) {
            lib.exportResume(results.resumeJson, fileName, program, function(err, fileName, format) {
                console.log(chalk.green('\nDone! Find your new', format, 'resume at', program.exportDir + fileName + format));
            });
        });

    program
        .command('publish')
        .description('Publish your resume to https://registry.jsonresume.org')
        .action(function() {
            lib.publish(results.resumeJson, program, results.config);
        });

    program
        .command('serve')
        .description('Serve resume at http://localhost:4000/')
        .action(function() {
            lib.serve(program.port, program.local, program.theme, program.silent);
        });

    program.parse(process.argv);
    
    Array.prototype.getItemCount = function(item){
        var counts = {};
        for(var i=0;i<this.length;++i){
            var num = this[i];
            counts[num] = counts[num] ? counts[num] : 1;
        }
        return counts[item] || 0;
    }
    
    var validCommands = program.commands.map(function(cmd) { return cmd; });
    var validOptions = program.commands.map(function(opt){ return opt;  });

    if (!program.args.length) {
        console.log('resume-cli:'.cyan, 'http://jsonresume.org', '\n');
        program.help();

    }
    
    var args = process.argv.slice(2);
    validCommands.forEach(function(command){
        //Check to make sure the command was used as an argument.
        var commandIndex = args.indexOf(command._name);
        if(commandIndex != -1){
            //check how many times the command is specified
            var commandCount = args.getItemCount(command._name);
            if(commandCount > 1){
                console.log('Invalid command use.  The command can only be specified once.  Error on command: '.red, command._name);
            }
            //remove command
            args.splice(commandIndex, 1);
            //Check to see if the command is specified to take any parameters.
            if(command._args.length > 0){
                var commandArgumentIndex = commandIndex;
                command._args.forEach(function(arg){
                    if(args.length > commandArgumentIndex && args[commandArgumentIndex].indexOf("-") == -1){
                        args.splice(commandArgumentIndex, 1);
                    }
                    else if(arg.required){
                        console.log('Invalid command use (argument required) for command: '.red, command._name);
                    }
                });
            }
        }
    });
    validOptions.forEach(function(option){
        var optionShortFound = false, optionLongFound = false;
        var optionShortIndex = args.indexOf(option.short);
        var optionLongIndex = args.indexOf(option.long);
        if(optionShortIndex != -1){
            args.splice(optionShortIndex, 1);
            optionShortFound = true;
        }
        else if(optionLongIndex != -1){
            args.splice(optionLongIndex, 1);
            optionLongFound = true;
        }
        if(optionShortFound || optionLongFound){
            if(option.required != 0){
                if(optionShortFound){ args.splice(optionShortIndex, 1); }
                if(optionLongFound){ args.splice(optionLongIndex, 1); }
            }
        }
    });
    args.forEach(function(arg){
        if(arg.indexOf("-") != -1){
            console.log("Invalid Option: ".red, arg);
        }
        else{
            console.log("Invalid Command: ".red, arg);
        }
    });
});


// every time you publish, theme is changed to default. need to keep current theme


// error handling on export wrong theme name server side
// prompt user session time. 
// export, post to theme server. 
// change theme to always use the server

// get rid of npm install warning: html to text, wrong node version
// get text converter working again

// version test on menu does not show
// publishing to non existent account error handling
// use jsonlint before schema tests run.
// run more tests on windows

// settings change theme errors if 'account does not exist errors' or resume does not exist. 
// resume doesn't handle test errors on 'resume publish' properly.  
// or resume test is not running before publish as it should
