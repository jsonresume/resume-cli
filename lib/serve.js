var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';

var fs = require('fs');
var http = require('http');
var request = require('superagent');
var open = require('open');
var chalk = require('chalk');

module.exports = function(port, theme, silent) {
    http.createServer(function(req, res) {
        if (req.url == '/favicon.ico') {
            res.writeHead(200, {
                'Content-Type': 'image/x-icon'
            });
            res.end();
            return;
        }
        var file = process.cwd() + '/resume.json';
        fs.readFile(file, function(err, resumeJson) {
            var resumeJson;
            if (err) {
                console.log(chalk.yellow('Could not find:'), file);
                console.log(chalk.cyan('Using example resume.json from resume-schema instead...'));
                resumeJson = require('resume-schema').resumeJson;
            } else {
                try {
                    // todo: test resume schema
                    resumeJson = JSON.parse(resumeJson);
                } catch (e) {
                    var msg = 'Parse error: ' + file;
                    res.writeHead(404);
                    res.end(msg);
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    console.log(msg);
                    return;
                }
            }
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            try {
                var render = require(process.cwd() + '/index').render;
                try {
                    res.end(render(resumeJson));
                    console.log(chalk.cyan('Using local theme.'));
                } catch (e) {
                    console.log(e);
                    throw e;
                }
            } catch (e) {
                console.log(chalk.yellow('Could not run the render function from local theme.'));
                console.log(chalk.red('Errors:'), e);
                sendExportHTML(resumeJson, theme, function(html) {
                    res.end(html);
                });
            }
        });
    }).listen(port);

    console.log('');
    var previewUrl = 'http://localhost:' + port;
    console.log('Preview: ' + previewUrl);
    console.log('Press ctrl-c to stop')
    console.log('');

    if (!silent) {
        open(previewUrl);
    }
};

function sendExportHTML(resumeJson, theme, callback) {
    console.log('Requesting theme from server...');
    request
        .post(themeServer + theme)
        .send({
            resume: resumeJson
        })
        .set('Accept', 'application/json')
        .end(function(response) {
            if (response.text) {
                callback(response.text);
            } else {
                console.log('There was an error downloading your generated html resume from our server.');
            }
        });
    return;
}


// console.log javascript errors. could not find render function.