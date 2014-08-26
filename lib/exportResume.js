var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';
var registryServer = process.env.REGISTRY_SERVER || 'http://registry.jsonresume.org';

var request = require('superagent');
var http = require('http');
var fs = require('fs');
var read = require('read');
var spinner = require("char-spinner");

function exportResume(resumeJson, fileName, program, callback) {
    var theme = program.theme;

    if (!fileName) {
        read({
            prompt: "Provide a file name: ",
            default: 'resume'
        }, function(er, fileName) {
            if (er) return console.log();
            var fileName = fileName;

            formatSelectMenu(program.format, function(format) {
                if (format === '.html') {
                    sendExportRequest(resumeJson, fileName, theme, format, function() {
                        callback(null, fileName, format);
                    });
                } else if (format === '.pdf') {
                    sendExportPDFRequest(resumeJson, fileName, theme, format, function() {
                        callback(null, fileName, format);
                    });
                }
            });
        });
    } else {
        formatSelectMenu(program.format, function(format) {
            if (format === '.html') {
                sendExportRequest(resumeJson, fileName, theme, format, function() {
                    callback(null, fileName, format);
                });
            } else if (format === '.pdf') {
                sendExportPDFRequest(resumeJson, fileName, theme, format, function() {
                    callback(null, fileName, format);
                });
            }
        });
    }
}

function sendExportRequest(resumeJson, fileName, theme, format, callback) {
    spinner();
    request
        .post(themeServer + theme)
        .send({
            resume: resumeJson
        })
        .set('Accept', 'application/json')
        .end(function(response) {
            fs.writeFileSync(process.cwd() + '/' + fileName + format, response.text);
            callback();
        });
    return;
}

function sendExportPDFRequest(resumeJson, fileName, theme, format, callback) {
    spinner();
    var stream = fs.createWriteStream(process.cwd() + '/' + fileName + format);
    var req = request

    .get(registryServer + '/pdf')
        .send({
            resume: resumeJson,
            theme: theme
        })
        .set('Accept', 'application/json');

    req.pipe(stream);
    stream.on('finish', function() {
        stream.close(callback);
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
        menu.add('.html');
        // menu.add('.md');
        // menu.add('.txt');
        menu.add('.pdf');
        menu.on('select', function(format) {
            menu.close();
            console.log('SELECTED: ' + format);
            callback(format);
        });
        menu.createStream().pipe(process.stdout);
    }
}
module.exports = exportResume;