var request = require('superagent');
var http = require('http');
var resumeToText = require('resume-to-text');
var resumeToHtml = require('resume-to-html');
var fs = require('fs');
var read = require('read');
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('downloading...');
spinner.setSpinnerString('/-\\');

var download = function(url, dest, cb) {
    var file = fs.createWriteStream(dest);
    var request = http.get(url, function(response) {
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb); // close() is async, call cb after close completes.
        });
    }).on('error', function(err) { // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
    });
};

function exportResume(resumeJson, fileName, theme, callback) {

    if (fileName && fileName.indexOf('.') !== -1) {

        splitFileName = fileName && fileName.split('.') || false;
        var fileExtension = splitFileName[1];
        //if no filename argument was provided, prompt to select one from the terminal menu
        if (theme && theme !== 'traditional' && theme !== 'crisp' && theme !== 'modern') {
            console.log('Invalid --theme flag:', theme);
            console.log('supported themes include: --theme <modern, crisp, traditional>');
            theme = 'modern';
        }

        var extensions = {};

        extensions.html = function() {
            resumeToHtml(resumeJson, {
                theme: theme
            }, function(htmlResume) {
                fs.writeFileSync(fileName, htmlResume, 'utf8');
                console.log('Done! Find your generated .html resume at:'.green, process.cwd() + '/' + fileName);
                console.log('To publish your resume at:'.cyan, 'http://jsonresume.org', 'Type the command:'.cyan, 'resume publish');
                callback(true, fileName);
            });
        };

        extensions.pdf = function() {
            spinner.start();
            request
                .post(registryServer + '/resume')
                .send({
                    resume: resumeJson,
                    email: null,
                    password: null,
                    guest: true,
                    passphrase: false
                })
                .set('X-API-Key', 'foobar')
                .set('Accept', 'application/json')
                .end(function(error, res) {
                    // cannot read property of null
                    if (error && error.code === 'ENOTFOUND') {
                        console.log('\nThere has been an error publishing your resume.'.red);
                        console.log('Please check your network connection.'.cyan);
                        process.exit();
                        return;
                    } else if (error || res.body.message === 'ERRORRRSSSS') {
                        spinner.stop();
                        console.log(error, res.body.message);
                        console.log('There has been an error downloading your resume.'.red);
                    } else {
                        download(res.body.url + '.pdf', fileName, function(err, data) {
                            spinner.stop();
                            console.log('\nDone! Find your generated .pdf resume at:'.green, process.cwd() + '/' + fileName);
                        });
                    }
                });
            return;
        };
        if (extensions[fileExtension]) {
            return extensions[fileExtension]();
        } else {
            console.log('\nInvalid filename:', fileName);
            console.log('supported file formats: .html or .pdf');
        }
    } else {

        noFileNameMenu(fileName, function(fileName) {
            exportResume(resumeJson, fileName, theme, callback);
            fileName = fileName;
        });
    }
}

function noFileNameMenu(fileName, callback) {
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
    menu.add('md');
    // menu.add('txt');
    menu.add('pdf (requires network connection)');
    menu.on('select', function(extension) {
        if (extension === 'pdf (requires network connection)') {
            extension = 'pdf';
        }
        menu.close();
        console.log('SELECTED: ' + extension);
        if (fileName) {
            callback(fileName + '.' + extension);
        } else {
            read({
                prompt: "Provide a file name: ",
                default: 'resume'
            }, function(er, fileName) {
                callback(fileName + '.' + extension);
            });
        }
    });
    menu.createStream().pipe(process.stdout);
}

module.exports = exportResume;
