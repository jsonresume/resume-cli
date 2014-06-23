var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
// var html5pdf = require("html5-to-pdf");
var fs = require('fs');
var read = require('read');


function exportResume(resumeData, fileName) {

    if (!fileName) {
        noFileNameMenu(function(fileName) {
            exportResume(resumeData, fileName);
        });
    } else {
        splitFileName = fileName.split('.');
        var fileExtension = splitFileName[1];
        switch (fileExtension) {
            case 'html':
                resumeToHtml(resumeData, function(htmlResume) {
                    fs.writeFileSync(fileName, htmlResume, 'utf8');
                    console.log('Done! Find your generated .'.green + fileExtension + ' resume at:'.green, process.cwd() + '/' + fileName);
                    console.log('To publish your resume at:'.cyan, 'http://jsonresume.org', 'Type the command:'.cyan, 'resume publish');
                    process.exit();
                });
                break;
            case 'txt':
                resumeToText(resumeData, function(txtResume) {
                    fs.writeFileSync(fileName, txtResume, 'utf8');
                    console.log('Done! Please find your generated .html resume at:'.green, process.cwd() + '/resume.txt');
                    process.exit();
                });
                break;
                // case 'pdf':
                //     resumeToHtml(resumeData, function(htmlResume) {
                //         fs.writeFileSync(fileName, htmlResume, 'utf8');
                //         html5pdf().from(splitFileName[0] + '.html').to(splitFileName[0] + '.pdf', function() {
                //             console.log('Done! Please find your generated'.green + fileName + ' resume at:'.green, process.cwd() + '/resume.pdf');
                //             process.exit();
                //         })
                //     });
                //     break;
        }
    }
}

function noFileNameMenu(callback) {
    var menu = require('terminal-menu')({
        width: 29,
        x: 4,
        y: 2,
        bg: 'black',
        fg: 'cyan'
    });
    menu.reset();
    menu.write('Select file format for export\n');
    menu.write('-------------------------\n');
    menu.add('html');
    menu.add('txt');
    menu.add('pdf');
    menu.add('doc');
    menu.add('docx');
    menu.on('select', function(extension) {
        menu.close();
        console.log('SELECTED: ' + extension);
        read({
            prompt: "Provide a file name: ",
            default: 'resume'
        }, function(er, fileName) {
            callback(fileName + '.' + extension);
        });
    });
    menu.createStream().pipe(process.stdout);
}

module.exports = exportResume;