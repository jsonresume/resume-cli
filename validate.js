var fs = require('fs');
var resumeSchema = require('resume-schema');
var colors = require('colors');

function validate() {

    var resumeData = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
    resumeSchema.validate(resumeData, function(report, errs) {
        // console.log(report, errs);
        if (errs) {
            console.log(errs.errors[0].path.red, errs.errors[0].message.red);
            // console.log(errs.message);
            // console.log(errs.errors);

            console.log('resume.json is in a vailid format');
        } else if (report) {
            console.log(report);
            // console.log('resume.json is in a vailid format');
        }

    });
}
module.exports = validate;