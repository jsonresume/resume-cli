var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var fs = require('fs');

function exportJson(resumeData, fileName) {
    // console.log(resumeData, fileName);

    splitFileName = fileName.split('.');

    switch (splitFileName[1]) {
        case 'html':

            resumeToHtml(resumeData, function(htmlResume) {
                fs.writeFileSync(fileName, htmlResume, 'utf8');
            });
            break;
        case 'txt':
            resumeToText(resumeData, function(txtResume) {
                fs.writeFileSync(fileName, txtResume, 'utf8');
            });
            break;
        case 'pdf':
            console.log('pdf')
            break;
    }

}


module.exports = exportJson;


// var resumeOutput = 'resume';


// if (program.format === 'html') {

//     if (!resumeOutput) {
//         // resumeOutput = argumentZero.replace("json", "html");
//         resumeOutput = 'resume.html';
//     }
//     resumeToHtml(resumeData, function(TextResume) {
//         fs.writeFileSync(resumeOutput, TextResume, 'utf8');
//     });

// }

// else if (program.format === 'txt') {

//     if (!resumeOutput) {
//         resumeOutput = argumentZero.replace("json", "txt");;
//     }
//     resumeToText(resumeData, function(TextResume) {
//         fs.writeFileSync(resumeOutput, TextResume, 'utf8');
//     });

// }