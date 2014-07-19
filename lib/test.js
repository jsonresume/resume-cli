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

//converts the schema's returned path output, to JS object selection notation. 
function pathFormatter(path) {
    var jsonPath = path.split('/');
    jsonPath.shift();
    jsonPath = jsonPath.join('.');
    jsonPath = jsonPath.replace('.[', '[');
    return jsonPath;
}

function errorFormatter(errors) {
    //if json parse errors
    // if (readFileErrors) {
    //     console.log('    ', cross + '  ' + chalk.gray(readFileErrors));
    //     console.log(chalk.red('\n  fail  ' + errors.errors.length), '\n');
    //     console.log('Visit'.cyan, 'http://jsonlint.com/', 'for details on correct .json fromatting.'.cyan);
    //     return;
    // }


    errors.errors.forEach(function(error) {
        console.log('    ', cross, chalk.gray(pathFormatter(error.path), 'is', error.params.type, 'expected', error.params.expected));
    });

    console.log(chalk.red('\n  fail  ' + errors.errors.length), '\n');
    console.log('Please fix your resume.json file and try again'); //wording? link to docs
    console.log('You can easily pinpoint problems that may occur in a JSON file at: http://jsonlint.com/'); //wording? link to docs
}

function validate(resumeData, callback) {
    console.log('\n  running validation tests on resume.json ... \n');
    resumeSchema.validate(resumeData, function(report, errs) {
        if (errs) {
            // or json parse errors
            callback(true, {
                message: 'Cannot export. There are errors in your resume.json schema format.\nTry using The JSONLInt Validator at: http://jsonlint.com/\n'
            });
            errorFormatter(errs);

        } else {
            console.log('  ' + tick + ' Passed all validation tests. \n'.green);
            // console.log(report)
            console.log('To publish your resume at'.cyan, 'http://jsonresume.org', 'type the command'.cyan, 'resume publish');

            callback(false);
        }
    });
}

module.exports = {
    validate: validate,
    errorFormatter: errorFormatter
};

//TODO error handling for single quotes

// use json error handler to pinpoint errors