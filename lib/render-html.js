import { join } from 'path';

const tryRequire = (...args) => {
  try {
    return require(...args);
  } catch (err) {
    return false;
  }
};

export default async ({ resume, themePath }) => {
  const cwd = process.cwd();
  let theme;
  if (themePath[0] === '.') {
    theme = tryRequire(join(cwd, themePath));
  } else {
    theme = tryRequire(themePath);
  }
  if (!theme && /^[a-z0-9-]+$/i.test(themePath)) {
    theme = tryRequire(`jsonresume-theme-${themePath}`);
  }
  if (!theme) {
    throw new Error(
      `theme path ${themePath} could not be resolved. cwd is ${cwd}`,
    );
  }
  if (typeof theme?.render !== 'function') {
    throw new Error('theme.render is not a function');
  }

  return theme.render(resume);
};
