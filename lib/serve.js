var fs = require('fs');
var path = require('path');
var readline = require('readline');
var bs = require('browser-sync').create();

var builder = require('./builder');

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

    bs.watch(resumeFilename).on('change', function () {
        reBuildResume(theme, dir, resumeFilename, function () {
            bs.reload()
        })
    })
    reBuildResume(theme, dir, resumeFilename, function() {
      bs.init({
        server: dir,
        port: port,
        open: !silent && 'local',
        ui: false
      })
    })

    console.log('');
    var previewUrl = 'http://localhost:' + port;
    console.log('Preview: ' + previewUrl);
    console.log('Press ctrl-c to stop');
    console.log('');
};

// console.log javascript errors. could not find render function.
