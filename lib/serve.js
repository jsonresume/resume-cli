var fs = require('fs');
var path = require('path');
var http = require('http');
var open = require('open');
var static = require('node-static');
var readline = require('readline');

var builder = require('./builder');

function serveFile(file, req, res, dir) {
    req.addListener('end', function () {
        file.serve(req, res);
    }).resume();
}

function reBuildResume(theme, dir, resumeFilename, cb) {
    builder(theme, dir, resumeFilename, function(err, html) {
        if(err) {
            readline.cursorTo(process.stdout, 0);
            console.log(err);
            html = err;
        }

        fs.writeFile(path.join(process.cwd(), dir, 'index.html'), html, function(err) {
            if(err) {
                console.log(err);
            }
            cb();
        });
    });
}

module.exports = function(port, theme, silent, dir, resumeFilename) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    var file = new static.Server(path.join(process.cwd(), dir), { cache: 1 });
    http.createServer(function(req, res) {
        if(req.url === '/' || req.url === '/index.html') {
            reBuildResume(theme, dir, resumeFilename, serveFile.bind(this, file, req, res));
        } else {
            serveFile(file, req, res);
        }

    }).listen(port);

    console.log('');
    var previewUrl = 'http://localhost:' + port;
    console.log('Preview: ' + previewUrl);
    console.log('Press ctrl-c to stop');
    console.log('');

    if (!silent) {
        open(previewUrl);
    }
};

// console.log javascript errors. could not find render function.
