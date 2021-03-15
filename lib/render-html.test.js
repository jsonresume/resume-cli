import renderHTML from './render-html';

describe('renderHTML', () => {
  beforeAll(() => {
    const originalRequireResolve = require.resolve;
    const mockThemePath = 'mock/path/to/jsonresume-theme-even';
    require.resolve = (...args) => {
      if (args[0] === 'jsonresume-theme-even') {
        return mockThemePath;
      }
      return originalRequireResolve.apply(require, ...args);
    };
    require.cache[mockThemePath] = {
      render: () => 'here-is-your-mocked-theme',
    };
  });
  const resume = {
    basics: {
      name: 'test',
      label: 'Programmer',
      email: 'test4@test.com',
    },
  };

  it('should reject when theme is not available', async () => {
    await expect(
      renderHTML({ resume, themePath: 'unknown' }),
    ).rejects.toBeTruthy();
  });

  describe('should render html when theme is available', () => {
    it('with long theme name', async () => {
      expect(
        await renderHTML({ resume, themePath: 'jsonresume-theme-even' }),
      ).toStartWith('<!doctype html>');
    });

    it('with short theme name', async () => {
      expect(await renderHTML({ resume, themePath: 'even' })).toStartWith(
        '<!doctype html>',
      );
    });

    it('should reject theme with invalid path', async () => {
      await expect(
        renderHTML({ resume, themePath: './unknown' }),
      ).rejects.toBeTruthy();
    });

    it('with local theme path', async () => {
      expect(
        await renderHTML({
          resume,
          themePath: './node_modules/jsonresume-theme-even',
        }),
      ).toStartWith('<!doctype html>');
    });
  });
});
