var fs = require('fs');
var http = require('http');
var open = require('open');
var static = require('node-static');

var builder = require('./builder');
var file = new static.Server(process.cwd(), { cache: 1 });

function serveFile(req, res) {
    req.addListener('end', function () {
        file.serve(req, res);
    }).resume();
}

function reBuildResume(theme, cb) {
    builder(theme, function(err, html) {
        if(err) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log(err);
            html = err;
        }

        fs.writeFile(process.cwd() + '/index.html', html, function(err) {
            if(err) {
                console.log(err);
            }
            cb();
        });
    });
}

module.exports = function(port, theme, silent) {
    http.createServer(function(req, res) {
        if(req.url === '/' || req.url === '/index.html') {
            reBuildResume(theme, serveFile.bind(this, req, res));
        } else {
            serveFile(req, res);
        }

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

// console.log javascript errors. could not find render function.