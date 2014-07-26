var themeServer = process.env.THEME_SERVER || 'http://themes.jsonresume.org/theme/';

var fs = require('fs');
var http = require('http');
var request = require('superagent');
var open = require('open');
var resumeToHtml = require('resume-to-html');
var Spinner = require('cli-spinner').Spinner;
var chalk = require('chalk');

module.exports = function(port, theme, silent) {

    http.createServer(function(req, res) {

        var file = process.cwd() + '/resume.json';
        fs.readFile(file, function(err, resumeJson) {
            var resumeJson;
            if (err) {
                // console.log(file + ' could not be found');
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
            var spinner = new Spinner('serving...');
            spinner.start();
            res.writeHead(
                200, {
                    'Content-Type': 'text/html'
                });

            try {
                var render = require(process.cwd() + '/index').render;
                res.end(render(resumeJson));
                console.log(chalk.yellow('Using local theme.'));

            } catch (e) {
                console.log(chalk.yellow('Could not find render function.'));
                sendExportHTML(resumeJson, theme, function(html) {
                    res.end(html);
                });
            }

        });
    }).listen(port);

    console.log('');
    var previewUrl = "http://localhost:" + port;
    console.log('Preview: ' + previewUrl);
    console.log('Press ctrl-c to stop')
    console.log('');

    if (!silent) {
        open(previewUrl);
    }
};

function sendExportHTML(resumeJson, theme, callback) {
    var spinner = new Spinner('downloading html...');
    spinner.start();
    request
        .post(themeServer + theme)
        .send({
            resume: resumeJson
        })
        .set('Accept', 'application/json')
        .end(function(response) {
            spinner.stop();
            if (response.text) {
                callback(response.text);
            } else {
                console.log('There was an error downloading your generated html resume from our server.');
            }
        });
    return;
}



// resume test is failing when there in no resume file


// if in a npm resume theme dirietory,
// require that theme instead of. 

// require current dir