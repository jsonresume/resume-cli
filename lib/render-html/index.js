const path = require('path');
const chalk = require('chalk');
const getThemePkg = (theme) => {
  if (theme[0] === '.') {
    theme = path.join(process.cwd(), theme, 'index.js');
  }
  try {
    const themePkg = require(theme);
    return themePkg;
  } catch (err) {
    // Theme not installed
    console.log(
      'You have to install this theme relative to the folder to use it e.g. `npm install ' +
        theme +
        '`',
    );
    process.exit();
  }
};
module.exports = async function renderHtml(resumeJson, theme) {
  const render = getThemePkg(theme).render;

  if (typeof render !== 'function') {
    console.log(
      chalk.yellow('Could not run the render function from local theme.'),
    );
    return Promise.reject(new Error(`Can't render with "${theme}"'s theme`));
  }

  return render(resumeJson);
};
