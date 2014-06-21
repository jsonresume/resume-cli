var fs = require('fs');
var resumeSchema = require('resume-schema');
var colors = require('colors');

function errorFormatter(err) {
    err.errors.forEach(function(error) {
        // console.log(error);
        console.log('code:'.red, error.code);
        console.log('message:'.red, error.message);
        console.log('path:'.red, error.path);
        console.log('params:'.red, error.params);
    });
    process.exit();
}

function validate(resumeData, callback) {
    resumeSchema.validate(resumeData, function(report, errs) {
        if (errs) {
            errorFormatter(errs);

            // console.log(errs.message);
            // console.log(errs.errors);

            // console.log('resume.json is in a vailid format');
        } else {
            callback(report);
            // console.log('resume.json is in a vailid format');
        }

    });
}
module.exports = {
    validate: validate,
    errorFormatter: errorFormatter
};