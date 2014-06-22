# Pygmentize (Bundled)

**Python's Pygments code formatter, for Node.js, distributed with Pygments**

[![NPM](https://nodei.co/npm/pygmentize-bundled.png?downloads=true&stars=true)](https://nodei.co/npm/pygmentize-bundled/) [![NPM](https://nodei.co/npm-dl/pygmentize-bundled.png?months=6)](https://nodei.co/npm/pygmentize-bundled/)

Can be used as either a *String-in, Buffer-out*, or as a Duplex stream.

Compatible with both Python v2 and v3.

## API

**pygmentize(options, code, callback)**

Pygmentize a given `code` string and return it as a Buffer to the `callback` Function.

* `options` contains options to be passed to Pygments (see [Options](#options)).
* `code` is a String to be formatted.
* `callback` is a Function, called when complete. The first argument will be an `error` object/string if there was a problem and the second argument will be a Buffer containing your formatted code.

**pygmentize(options)**

When you only supply the `options` argument, it will return a Duplex stream that you can pipe to and from to format your code.

* `options` contains options to be passed to Pygments (see [Options](#options)).

## Options

Language/lexer, formatter, and their options are currently supported. Filters are not supported yet.

* `lang`: source language/lexer name - `String`
* `format`: output formatter name - `String`
* `python`: the full path to the `python` command on the current system, defaults to `'python'` - `String`
* `options`: lexer and formatter options, each key/value pair is passed through to `pygmentize` with `-P` - `Object`

## Examples

The string interface is very simple:

```js
var pygmentize = require('pygmentize-bundled')

pygmentize({ lang: 'js', format: 'html' }, 'var a = "b";', function (err, result) {
  console.log(result.toString())
})
```

Results in:

```html
<div class="highlight"><pre>
  <span class="kd">var</span>
  <span class="nx">a</span>
  <span class="o">=</span>
  <span class="s2">&quot;b&quot;</span>
  <span class="p">;</span>
</pre></div>
```

Example with extra options:

```js
var pygmentize = require('pygmentize-bundled')

pygmentize({ lang: 'php', format: 'html', options: { startinline: 1 } }, 'var a = true;', function (err, result) {
  console.log(result.toString())
})
```

A duplex streaming API is also available. Simply omit the `code` and `callback` arguments:

```js
var pygmentize = require('pygmentize-bundled')

process.stdin
  .pipe(pygmentize({ lang: 'js', format: 'html' }))
  .pipe(process.stdout);
```

Refer to the [Pygments documentation](http://pygments.org/docs/). For supported languages, see the list of [lexers](http://pygments.org/docs/lexers/), for supported formatted, see the list of [formatters](http://pygments.org/docs/formatters/).

## Contributors

* [Rod Vagg](https://github.com/rvagg)
* [Cyril Rohr](https://github.com/crohr)
* [Ahmed Fasih](https://github.com/fasiha)
* [Scott Walkinshaw](https://github.com/swalkinshaw)
* [Chris Wren](https://github.com/ChrisWren)

## Licence & copyright

Pygments (Bundled) is Copyright (c) 2012 Rod Vagg <@rvagg> and licenced under the MIT licence. All rights not explicitly granted in the MIT license are reserved. See the included LICENSE file for more details.

Pygments is licenced under the BSD licence.
