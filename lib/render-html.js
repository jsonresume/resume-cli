import path from 'path';

export default async ({ resume, themePath }) => {
  const cwd = process.cwd();
  let resolvedThemePath = themePath;
  try {
    if (themePath[0] === '.') {
      resolvedThemePath = path.join(process.cwd(), themePath, 'index.js');
    } else {
      try {
        resolvedThemePath = require.resolve(themePath, {
          paths: process.cwd(),
        });
      } catch (err) {
        resolvedThemePath = require.resolve(`jsonresume-theme-${themePath}`, {
          paths: process.cwd(),
        });
      }
    }
  } catch (err) {
    throw new Error(`Theme ${themePath} could not be resolved from ${cwd}`);
  }
  const theme = require(resolvedThemePath);
  if (typeof theme?.render !== 'function') {
    throw new Error('theme.render is not a function');
  }

  return theme.render(resume);
};
