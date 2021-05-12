const path = require('path');

const tryResolve = (...args) => {
  try {
    return require.resolve(...args);
  } catch (err) {
    return false;
  }
};

export default async ({ resume, themePath }) => {
  const cwd = process.cwd();
  let resolvedPath;
  if (themePath[0] === '.') {
    resolvedPath = tryResolve(path.join(cwd, themePath), { paths: [cwd] });
  }
  if (!resolvedPath) {
    resolvedPath = tryResolve(themePath, { paths: [cwd] });
  }
  if (!resolvedPath && /^[a-z0-9]/i.test(resolvedPath)) {
    resolvedPath = tryResolve(`jsonresume-theme-${themePath}`, {
      paths: [cwd]
    });
  }
  if (!resolvedPath) {
    throw new Error(
      `theme path ${themePath} could not be resolved from current working directory`,
    );
  }
  const theme = require(resolvedPath);
  if (typeof theme?.render !== 'function') {
    throw new Error('theme.render is not a function');
  }

  return theme.render(resume);
};
