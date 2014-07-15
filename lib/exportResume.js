var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';
var request = require('superagent');
var http = require('http');
var fs = require('fs');
var read = require('read');
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('downloading from server...');
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

function exportResume(resumeJson, fileName, program, callback) {

    var theme = program.theme;

    console.log(fileName, program.format);

    if (!fileName) {
        read({
            prompt: "Provide a file name: ",
            default: 'resume'
        }, function(er, fileName) {
            if (er) return console.log();

            var fileName = fileName;

            formatSelectMenu(program.format, function(format) {

                // console.log(fileName, format);
                sendExportRequest(resumeJson, fileName, theme, format)

            });

        });

    } else {

        formatSelectMenu(program.format, function(format) {

            // console.log(fileName, format);
            sendExportRequest(resumeJson, fileName, theme, format)

        });
    }
}

function sendExportRequest(resumeJson, fileName, theme, format) {


    spinner.start();
    request
        .post(registryServer + '/resume')
        .send({
            resume: resumeJson,
            email: null,
            password: null,
            guest: true,
            passphrase: false,
            theme: theme
        })
        .set('Accept', 'application/json')
        .end(function(error, res) {
            spinner.stop();

            if (error && error.code === 'ENOTFOUND') {
                console.log('\nThere has been an error publishing your resume.'.red);
                console.log('Please check your network connection.'.cyan);
                process.exit();
                return;
            } else if (res.body.message) {
                console.log(res.body.message);
            } else {
                download(res.body.url + format, fileName + format, function(err, data) {
                    console.log('\nDone! Find your generated ' + format + ' resume at:'.green, process.cwd() + '/' + fileName + format);
                });
            }
        });
    return;
}

function formatSelectMenu(format, callback) {
    if (format) {
        callback('.' + format);
    } else {
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
        // menu.add('md');
        // menu.add('txt');
        menu.add('pdf (requires network connection)');
        menu.on('select', function(format) {
            if (format === 'pdf (requires network connection)') {
                format = 'pdf';
            }
            menu.close();
            console.log('SELECTED: ' + format);

            callback('.' + format);
        });
        menu.createStream().pipe(process.stdout);
    }
}
module.exports = exportResume;