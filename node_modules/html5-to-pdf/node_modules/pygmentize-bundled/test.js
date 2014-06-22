const tape        = require('tape')
    , pygments    = require('./')
    , fs          = require('fs')
    , path        = require('path')
    , streamEqual = require('stream-equal')

function simpleStringConversionTest (python) {
  return function (t) {
    var cases       = [
            {
                lang: 'js'
              , format: 'html'
              , input: 'var a = "b";'
              , output: '<div class="highlight"><pre><span class="kd">var</span> <span class="nx">a</span> '
                  + '<span class="o">=</span> <span class="s2">&quot;b&quot;</span><span class="p">;</span></pre></div>'
            }
          , {
                lang: 'c++'
              , format: 'console'
              , input: 'bool a = true;'
              , output: '\u001b[36mbool\u001b[39;49;00m \u001b[39;49;00ma\u001b[39;49;00m '
                  + '\u001b[39;49;00m=\u001b[39;49;00m \u001b[39;49;00m\u001b[36mtrue\u001b[39;49;00m;\u001b[39;49;00m'
            }
          , {
                lang: 'php'
              , format: 'html'
              , input: 'var a = true;'
              , output: '<div class="highlight"><pre><span class="x">var a = true;</span></pre></div>'
            }
          , {
                lang: 'php'
              , format: 'html'
              , options: { startinline: 1 }
              , input: 'var a = true;'
              , output: '<div class="highlight"><pre><span class="k">var</span> <span class="nx">a</span> '
                  + '<span class="o">=</span> <span class="k">true</span><span class="p">;</span></pre></div>'
            }
        ]

    t.plan(cases.length * 3)

    cases.forEach(function (c) {
      pygments(
          {
              lang    : c.lang
            , format  : c.format
            , options : c.options || {}
            , python  : python
          }
        , c.input
        , function (err, result) {
            t.equal(err, null)
            t.ok(Buffer.isBuffer(result), 'isBuffer')
            result = result.toString().replace(/\n/g, '')
            t.equal(result, c.output)
          }
      )
    })
  }
}

function fileConversionTest (python) {
  return function (t) {
    t.plan(2)

    var fileIn  = fs.createReadStream(__dirname + '/test-fixtures/active_model.rb')
      , fileOut = fs.createWriteStream(
            __dirname + '/test-fixtures/active_model.tmp'
          , { flags: 'w+', encoding: null, mode: 0666 }
        )

    fileIn.pipe(pygments({ lang: 'rb', format: 'html', python: python })).pipe(fileOut)

    fileOut.on('close', function() {
      var expectedResult = fs.createReadStream(path.join(__dirname, '/test-fixtures/active_model.html'))
        , result         = fs.createReadStream(path.join(__dirname, '/test-fixtures/active_model.tmp'))

      streamEqual(expectedResult, result, function (err, equal) {
        t.notOk(err, 'no error')
        t.ok(equal, 'stream equal')
      })
    })
  }
}

tape('simple string conversions', simpleStringConversionTest())
tape('file conversions', fileConversionTest())

if (fs.existsSync('/usr/bin/python3')) {
  tape('simple string conversions (python3)', simpleStringConversionTest('/usr/bin/python3'))
  tape('file conversions (python3)', fileConversionTest('/usr/bin/python3'))
} else {
  console.error('NO /usr/bin/python3, not testing Python3')
}