var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var resumeToPDF = require('resume-to-pdf');
var fs = require('fs');
var read = require('read');

function exportResume(resumeData, fileName, callback) {
    if (!fileName) {
        //if no filename argument was provided, prompt to select one from the terminal menu 
        noFileNameMenu(function(fileName) {
            exportResume(resumeData, fileName, callback);
        });
    } else {
        splitFileName = fileName.split('.');
        var fileExtension = splitFileName[1];
        switch (fileExtension) {
            case 'html':
                resumeToHtml(resumeData, function(htmlResume) {
                    fs.writeFileSync(fileName, htmlResume, 'utf8');
                    console.log('Done! Find your generated .html resume at:'.green, process.cwd() + '/' + fileName);
                    console.log('To publish your resume at:'.cyan, 'http://jsonresume.org', 'Type the command:'.cyan, 'resume publish');
                    callback(true, fileName);
                });
                break;
            case 'txt':
                resumeToText(resumeData, function(txtResume) {
                    fs.writeFileSync(fileName, txtResume, 'utf8');
                    console.log('Done! Find your generated .txt resume at:'.green, process.cwd() + '/' + fileName);
                    console.log('To publish your resume at:'.cyan, 'http://jsonresume.org', 'Type the command:'.cyan, 'resume publish');
                    callback(true, fileName);
                });
                break;
            case 'pdf':
                resumeToPDF(resumeData, fileName, function(response) {
                    response && console.log('Done! Find your generated .pdf resume at:'.green, process.cwd() + '/' + fileName);
                });
                break;
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