var fs = require('fs');
var resumeSchema = require('resume-schema');
var colors = require('colors');
var chalk = require('chalk'); // slowly replace colors with chalk

var symbols = {
    ok: '\u2713',
    err: '\u2717'
};

// win32 console default output fonts don't support tick/cross
if (process && process.platform === 'win32') {
    symbols = {
        ok: '\u221A',
        err: '\u00D7'
    };
}

var tick = chalk.green(symbols.ok);
var cross = chalk.red(symbols.err);

function pathFormatter(path) {
    var jsonPath = path.split('/');
    jsonPath.shift();
    var jsonPath = jsonPath.join('.');
    var jsonPath = jsonPath.replace('.[', '[');
    return jsonPath;
}

function errorFormatter(errors) {
    console.log('TEST FAILED'.red);
    console.log('Number of errors:'.cyan, errors.errors.length);
    errors.errors.forEach(function(error) {
        console.log('    ', cross, chalk.gray(pathFormatter(error.path), 'is', error.params.type, 'expected', error.params.expected));
    });
}

function validate(resumeData, callback) {
    resumeSchema.validate(resumeData, function(report, errs) {
        if (errs) {
            errorFormatter(errs);

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