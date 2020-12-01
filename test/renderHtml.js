/* eslint-disable */
const fs = require('fs');
const path = require('path');
const should = require('should');
const renderHtml = require('../lib/render-html');

describe('renderHtml', () => {
  const resumeJson = {
    basics: {
      name: 'test',
      label: 'Programmer',
      email: 'test4@test.com',
    },
  };

  it('should reject when theme is not availlable', async () => {
    const theme = 'unknown';

    const result = renderHtml(resumeJson, theme);

    return result.should.be.rejected();
  });

  describe('should render html when theme is availlable', () => {
    it('with long theme name', async () => {
      const theme = 'jsonresume-theme-even';

      const html = await renderHtml(resumeJson, theme);

      return html.should.startWith('<!doctype html>');
    });

    it('with short theme name', async () => {
      const theme = 'even';

      const html = await renderHtml(resumeJson, theme);

      return html.should.startWith('<!doctype html>');
    });
  });
});
