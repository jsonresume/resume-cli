const fs = require('fs');
const path = require('path');
const readline = require('readline');
const bs = require('browser-sync').create();

const builder = require('./builder');

const reBuildResume = (theme, dir, resumeFilename, cb) => {
  builder(theme, dir, resumeFilename, (err, html) => {
    if (err) {
      readline.cursorTo(process.stdout, 0);
      console.log(err);
      html = err;
    }

    fs.writeFile(path.join(process.cwd(), dir, 'index.html'), html, (err) => {
      if (err) {
        console.log(err);
      }
      cb();
    });
  });
};

module.exports = function ({ port, theme, silent, dir, resumeFilename }) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  bs.watch(resumeFilename).on('change', () => {
    reBuildResume(theme, dir, resumeFilename, () => {
      bs.reload();
    });
  });
  reBuildResume(theme, dir, resumeFilename, () => {
    bs.init({
      server: dir,
      port: port,
      open: !silent && 'local',
      ui: false,
    });
  });

  console.log('');
  const previewUrl = 'http://localhost:' + port;
  console.log('Preview: ' + previewUrl);
  console.log('Press ctrl-c to stop');
  console.log('');
};
