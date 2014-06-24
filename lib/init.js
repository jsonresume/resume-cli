var fs = require('fs');
var read = require('read');

function init(resumeJson, callback) {
    console.log('Fill out some basic details to generate a new resume.json'.cyan);

    read({
        prompt: 'name: ',
        default: resumeJson.name
    }, function(er, name) {
        if (er) {
            console.log();
            process.exit();
        }

        read({
            prompt: 'email: ',
            default: resumeJson.email
        }, function(er, email) {
            if (er) {
                console.log();
                process.exit();
            }

            resumeJson.email = email;
            resumeJson.name = name;

            fs.writeFileSync(process.cwd() + '/resume.json', JSON.stringify(resumeJson, undefined, 2));

            console.log('About to write to'.cyan, process.cwd() + '/resume.json', '\n');
            console.log(resumeJson);
            console.log('Done! Your resume.json file is located at:'.green, process.cwd() + '/resume.json');
            console.log('To generate a formatted .html .txt or .pdf resume from your resume.json'.cyan);
            console.log('type:'.cyan, 'resume export [your file name]', 'including file extension eg:'.cyan, 'resume export myresume.html');
            console.log('Or to publish your resume at:'.cyan, 'http://jsonresume.org', 'Simply type the command:'.cyan, 'resume publish');
            process.exit();
            callback(true);

        });
    });
}

module.exports = init;