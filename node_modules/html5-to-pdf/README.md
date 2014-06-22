Node module that converts HTML files to PDFs. Built on [markdown-pdf](https://www.npmjs.org/package/markdown-pdf) by alanshaw.

The PDF looks great because it is styled by HTML5 Boilerplate or Bootstrap. What? - Yes! HTML is pushed into the HTML5 template `index.html`. Phantomjs renders the page and saves it to a PDF. You can even customize the style of the PDF by passing an optional path to your CSS _and_ you can pre-process your html file before it is converted to a PDF by passing in a pre-processing function, for creating templates.

Getting started
---

    npm install html5-to-pdf

Example  usage
---

```javascript
var html5pdf = require("html5-to-pdf")
  , fs = require("fs")

fs.createReadStream("/path/to/document.html")
  .pipe(html5pdf())
  .pipe(fs.createWriteStream("/path/to/document.pdf"))

// --- OR ---

html5pdf().from("/path/to/document.html").to("/path/to/document.pdf", function () {
  console.log("Done")
})
```

### Options

Pass an options object (`html5pdf({/* options */})`) to configure the output.

#### options.phantomPath
Type: `String`
Default value: `Path provided by phantomjs module`

Path to phantom binary

#### options.cssPath
Type: `String`
Default value: `[module path]/markdown-pdf/pdf.css`

Path to custom CSS file, relative to the current directory

#### options.highlightCssPath
Type: `String`
Default value: `[module path]/markdown-pdf/highlight.css`

Path to custom highlight CSS file (for code highlighting), relative to the current directory

#### options.paperFormat
Type: `String`
Default value: `A4`

'A3', 'A4', 'A5', 'Legal', 'Letter' or 'Tabloid'

#### options.paperOrientation
Type: `String`
Default value: `portrait`

'portrait' or 'landscape'

#### options.paperBorder
Type: `String`
Default value: `1cm`

Supported dimension units are: 'mm', 'cm', 'in', 'px'

#### options.runningsPath
Type: `String`
Default value: `runnings.js`

Path to CommonJS module which sets the page header and footer (see [runnings.js](lib/runnings.js))

#### options.renderDelay
Type: `Number`
Default value: `1000`

Delay in millis before rendering the PDF (give HTML and CSS a chance to load)

#### options.template
Type: `String`
Default value: `html5bp`

The template to use with phantomjs. You can choose between `html5bp` (HTML5 Boilerplate) or `htmlbootstrap` (Boostrap 3.1.1)

#### options.preProcessHtml
Type: `Function`
Default value: `function () { return through() }`

A function that returns a [through stream](https://npmjs.org/package/through) that transforms the HTML before it is converted to html.

API
---

### from.path(path, opts) / from(path, opts)

Create a readable stream from `path` and pipe to html5-to-pdf. `path` can be a single path or array of paths.

### from.string(string)

Create a readable stream from `string` and pipe to html5-to-pdf. `string` can be a single string or array of strings.

### concat.from.paths(paths, opts)

Create and concatenate readable streams from `paths` and pipe to html5-to-pdf.

### concat.from.strings(strings, opts)

Create and concatenate readable streams from `strings` and pipe to html5-to-pdf.

### to.path(path, cb) / to(path, cb)

Create a writeable stream to `path` and pipe output from html5-to-pdf to it. `path` can be a single path, or array of output paths if you specified an array of inputs. The callback function `cb` will be invoked when data has finished being written.

### to.buffer(opts, cb)

Create a [concat-stream](https://npmjs.org/package/concat-stream) and pipe output from html5-to-pdf to it. The callback function `cb` will be invoked when the buffer has been created.

### to.string(opts, cb)

Create a [concat-stream](https://npmjs.org/package/concat-stream) and pipe output from html5-to-pdf to it. The callback function `cb` will be invoked when the string has been created.

More examples
---

### From string to path

```javascript
var html5pdf = require("html5-to-pdf")

var html = "foo===\n <strong>bar\n</strong> baz\n\nLorem ipsum dolor sit"
  , outputPath = "/path/to/doc.pdf"

html5pdf().from.string(html).to(outputPath, function () {
  console.log("Created", outputPath)
})
```

### From multiple paths to multiple paths

```javascript
var html5pdf = require("html5-to-pdf")

var htmlDocs = ["home.html", "about.html", "contact.html"]
  , pdfDocs = htmlDocs.map(function (d) { return "out/" + d.replace(".html", ".pdf") })

html5pdf().from(htmlDocs).to(htmlDocs, function () {
  pdfDocs.forEach(function (d) { console.log("Created", d) })
})
```

### Concat from multiple paths to single path

```javascript
var html5pdf = require("html5-to-pdf")

var htmlDocs = ["chapter1.html", "chapter2.html", "chapter3.html"]
  , bookPath = "/path/to/book.pdf"

html5pdf().concat.from(htmlDocs).to(bookPath, function () {
  console.log("Created", bookPath)
})
```

### Transform html before conversion

```javascript
var html5pdf = require("html5-to-pdf")
  , split = require("split")
  , through = require("through")
  , duplexer = require("duplexer")

function preProcessHTML () {
  // Split the input stream by lines
  var splitter = split()

  // Replace occurences of "foo" with "bar"
  var replacer = through(function (data) {
    this.queue(data.replace(/foo/g, "bar") + "\n")
  })

  splitter.pipe(replacer)
  return duplexer(splitter, replacer)
}

html5pdf({preProcessHtml: preProcessHtml})
  .from("/path/to/document.html")
  .to("/path/to/document.pdf", function () { console.log("Done") })
```

CLI interface
---

### Installation

To use html5-to-pdf as a standalone program from the terminal run

```sh
npm install -g html5-to-pdf
```

### Usage

```sh
Usage: html5-to-pdf [options] <html-file-path>

Options:

  -h, --help                             output usage information
  -V, --version                          output the version number
  <html-file-path>                       Path of the html file to convert
  -p, --phantom-path [path]              Path to phantom binary
  -h, --runnings-path [path]             Path to runnings (header, footer)
  -s, --css-path [path]                  Path to custom CSS file
  -f, --paper-format [format]            'A3', 'A4', 'A5', 'Legal', 'Letter' or 'Tabloid'
  -r, --paper-orientation [orientation]  'portrait' or 'landscape'
  -b, --paper-border [measurement]       Supported dimension units are: 'mm', 'cm', 'in', 'px'
  -d, --render-delay [millis]            Delay before rendering the PDF (give HTML and CSS a chance to load)
  -o, --out [path]                       Path of where to save the PDF
```
