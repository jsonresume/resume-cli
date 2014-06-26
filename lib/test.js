var fs = require('fs');
var resumeSchema = require('resume-schema');
var colors = require('colors');

function errorFormatter(err) {
    // console.log('Number of errors:'.cyan, err.errors.length);
    // err.errors.forEach(function(error) {
    console.log(error);
    //     console.log('code:', error.code);
    //     console.log('message:', error.message);
    //     console.log('path:', error.path);
    //     console.log('params:', error.params);
    // });
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