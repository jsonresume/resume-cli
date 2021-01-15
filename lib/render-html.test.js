import renderHTML from './render-html';

jest.mock(
  'jsonresume-theme-even',
  () => {
    return {
      render: () => 'hello from theme even',
    };
  },
  { virtual: true },
);
jest.mock(
  '/the/mocked/cwd/some-local-theme',
  () => {
    return {
      render: () => 'hello from the local mocked theme',
    };
  },
  { virtual: true },
);
describe('renderHTML', () => {
  beforeAll(() => {
    const localPath = '/the/mocked/cwd/';
    process.cwd = jest.fn().mockReturnValue(localPath);
  });
  const resume = {
    basics: {
      name: 'test',
      label: 'Programmer',
      email: 'test4@test.com',
    },
  };

  it('should reject when theme is not availlable', async () => {
    await expect(
      renderHTML({ resume, themePath: 'unknown' }),
    ).rejects.toBeTruthy();
  });

  describe('when theme is availlable', () => {
    it('should resolve from cwd when themePath starts with a period', async () => {
      expect(
        await renderHTML({ resume, themePath: './some-local-theme' }),
      ).toMatchInlineSnapshot(`"hello from the local mocked theme"`);
    });
    it('should render html with long theme name', async () => {
      expect(
        await renderHTML({ resume, themePath: 'jsonresume-theme-even' }),
      ).toMatchInlineSnapshot(`"hello from theme even"`);
    });

    it('should render html with short theme name', async () => {
      expect(
        await renderHTML({ resume, themePath: 'even' }),
      ).toMatchInlineSnapshot(`"hello from theme even"`);
    });
  });
});
