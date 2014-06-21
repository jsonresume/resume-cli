var fs = require('fs');
var resumeSchema = require('resume-schema');
var colors = require('colors');

function errorFormatter(err) {
    err.errors.forEach(function(error) {
        // console.log(error);
        console.log('code:', error.code);
        console.log('message:', error.message);
        console.log('path:', error.path);
        console.log('params:', error.params);
    });
}

function validate(resumeData, callback) {
    resumeSchema.validate(resumeData, function(report, errs) {
        if (errs) {
            console.log('TESTS FAILED'.red);
            errorFormatter(errs);
            process.exit();
        } else {
            console.log('TEST SUCCESSFUL'.green);
            console.log(report);
            // console.log('resume.json is in a vailid format');
        }

    });
}
module.exports = {
    validate: validate,
    errorFormatter: errorFormatter
};