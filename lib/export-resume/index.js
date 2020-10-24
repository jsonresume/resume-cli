const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const btoa = require('btoa');

module.exports = (resumeJson, fileName, theme, format, callback) => {
  if (!fileName) {
    console.error('Please enter a export destination.');
    process.exit(1);
  }

  const fileNameAndFormat = getFileNameAndFormat(fileName, format);
  fileName = fileNameAndFormat.fileName;
  const fileFormatToUse = fileNameAndFormat.fileFormatToUse;
  const formatToUse = '.' + fileFormatToUse;
  if (formatToUse === '.html') {
    createHtml(resumeJson, fileName, theme, formatToUse, (error) => {
      if (error) {
        console.error(error, '`createHtml` errored out');
      }
      callback(error, fileName, formatToUse);
    });
  } else if (formatToUse === '.pdf') {
    createPdf(resumeJson, fileName, theme, formatToUse, (error) => {
      if (error) {
        console.error(error, '`createPdf` errored out');
      }
      callback(error, fileName, formatToUse);
    });
  } else {
    console.error(`JSON Resume does not support the ${formatToUse} format`);
    process.exit(1);
  }
};

const extractFileFormat = (fileName) => {
  const dotPos = fileName.lastIndexOf('.');
  if (dotPos === -1) {
    return null;
  }
  return fileName.substring(dotPos + 1).toLowerCase();
};

const createHtml = (resumeJson, fileName, theme, format, callback) => {
  const html = renderHtml(resumeJson, theme);
  const stream = fs.createWriteStream(
    path.resolve(process.cwd(), fileName + format),
  );

  stream.write(html, (error) => {
    if (error) {
      return callback(error);
    }
    stream.close(callback);
  });
};

const getThemePkg = (theme) => {
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

const renderHtml = (resumeJson, theme) => {
  const themePkg = getThemePkg(theme);
  const contents = themePkg.render(resumeJson);
  return contents;
};

const createPdf = (resumeJson, fileName, theme, format, callback) => {
  (async () => {
    const html = renderHtml(resumeJson, theme);
    const themePkg = getThemePkg(theme);
    const puppeteerLaunchArgs = [];

    if (process.env.RESUME_PUPPETEER_NO_SANDBOX) {
      puppeteerLaunchArgs.push('--no-sandbox');
    }

    const browser = await puppeteer.launch({
      args: puppeteerLaunchArgs,
    });
    const page = await browser.newPage();

    await page.emulateMediaType(
      (themePkg.pdfRenderOptions && themePkg.pdfRenderOptions.mediaType) ||
        'screen',
    );
    await page.goto(
      `data:text/html;base64,${btoa(unescape(encodeURIComponent(html)))}`,
      { waitUntil: 'networkidle0' },
    );
    if (themePkg.pdfViewport) {
      await page.setViewport(themePkg.pdfViewport);
    }
    await page.pdf({
      path: fileName + format,
      format: 'Letter',
      printBackground: true,
      ...themePkg.pdfRenderOptions,
    });

    await browser.close();
  })()
    .then(callback)
    .catch(callback);
};

const getFileNameAndFormat = (fileName, format) => {
  const fileFormatFound = extractFileFormat(fileName);
  let fileFormatToUse = format;
  if (format && fileFormatFound && format === fileFormatFound) {
    fileName = fileName.substring(0, fileName.lastIndexOf('.'));
  } else if (fileFormatFound) {
    fileFormatToUse = fileFormatFound;
    fileName = fileName.substring(0, fileName.lastIndexOf('.'));
  }

  return {
    fileName: fileName,
    fileFormatToUse: fileFormatToUse,
  };
};
