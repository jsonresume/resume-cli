const fs = require('fs');
const path = require('path');
const readline = require('readline');
const bs = require('browser-sync').create();

const builder = require('./builder');

const reBuildResume = async (theme, dir, resumeFilename, mime, cb) => {
  await builder(theme, dir, resumeFilename, mime, (err, html) => {
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

module.exports = async function ({ port, theme, silent, dir, resumeFilename, type }) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  bs.watch(resumeFilename).on('change', async () => {
    await reBuildResume(theme, dir, resumeFilename, type, () => {
      bs.reload();
    });
  });
  await reBuildResume(theme, dir, resumeFilename, type, () => {
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
