const tryResolve = (...args) => {
  try {
    return require.resolve(...args);
  } catch (err) {
    return false;
  }
};

export default async ({ resume, themePath }) => {
  const cwd = process.cwd();
  let path;
  if (themePath[0] === '.') {
    path = tryResolve(path.join(cwd, themePath), { paths: [cwd] });
    throw new Error(
      `Theme ${themePath} could not be resolved relative to ${cwd}`,
    );
  }
  if (!path) {
    path = tryResolve(themePath, { paths: [cwd] });
  }
  if (!path && /^[a-z0-9]/i.test(path)) {
    path = tryResolve(`jsonresume-theme-${themePath}`, { paths: [cwd] });
  }
  if (!path) {
    throw new Error(
      `theme path ${themePath} could not be resolved from current working directory`,
    );
  }
  const theme = require(path);
  if (typeof theme?.render !== 'function') {
    throw new Error('theme.render is not a function');
  }

  return theme.render(resume);
};
