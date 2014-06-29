var fs = require('fs');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var chalk = require('chalk'); // slowly replace colors with chalk

var symbols = {
    ok: '\u2713',
    err: '\u2717'
};

var tick = chalk.green(symbols.ok);
var cross = chalk.red(symbols.err);

function errorFormatter(err) {
    console.log('Number of errors:'.cyan, err.errors.length);
    err.errors.forEach(function(error) {
        console.log(cross, chalk.red('Error:'), chalk.gray(error.path, 'is', error.params.type, 'expected', error.params.expected));
        // console.log(error);
    });
}

function validate(resumeData, callback) {
    resumeSchema.validate(resumeData, function(report, errs) {
        if (errs) {
            console.log('TEST FAILED'.red);
            errorFormatter(errs);
            process.exit();
        } else {
            console.log('TEST SUCCESSFUL'.green);
            // console.log('Number of errors:'.cyan, report.errors.length);
            console.log('To publish your resume at'.cyan, 'http://jsonresume.org', 'simply type the command'.cyan, 'resume publish');
            process.exit();
        }
    });
}
module.exports = {
    validate: validate,
    errorFormatter: errorFormatter
};