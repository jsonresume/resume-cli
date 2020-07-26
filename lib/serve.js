const fs = require('fs');
const path = require('path');
const http = require('http');
const open = require('open');
const static = require('node-static');
const readline = require('readline');

const builder = require('./builder');

function serveFile(file, req, res, _dir) {
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

    const file = new static.Server(path.join(process.cwd(), dir), { cache: 1 });
    http.createServer(function(req, res) {
        if(req.url === '/' || req.url === '/index.html') {
            reBuildResume(theme, dir, resumeFilename, serveFile.bind(this, file, req, res));
        } else {
            serveFile(file, req, res);
        }

    }).listen(port);

    console.log('');
    const previewUrl = 'http://localhost:' + port;
    console.log('Preview: ' + previewUrl);
    console.log('Press ctrl-c to stop');
    console.log('');

    if (!silent) {
        open(previewUrl, { url: true });
    }
};

// console.log javascript errors. could not find render function.
