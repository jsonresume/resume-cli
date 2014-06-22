var system = require("system")
  , page = require("webpage").create()
  , fs = require("fs")

// Read in arguments
var args = ["in", "out", "runningsPath", "cssPath", "highlightCssPath", "paperFormat", "paperOrientation", "paperBorder", "renderDelay", "template", "jsonPath"].reduce(function (args, name, i) {
  args[name] = system.args[i + 1]
  return args
}, {})

page.open(page.libraryPath + "/../" + args.template + "/index.html", function (status) {

  if (status == "fail") {
    page.close()
    phantom.exit(1)
    return
  }

  // Add custom CSS to the page
  page.evaluate(function(cssPaths) {

    var head = document.querySelector("head")
    
    cssPaths.forEach(function(cssPath) {
      
    var css = document.createElement("link")

    css.rel = "stylesheet"
    css.href = cssPath

    head.appendChild(css)

    });

  }, [args.cssPath, args.highlightCssPath])

  // Add the HTML to the page
  page.evaluate(function(html) {

    var body = document.querySelector("body")

    // Remove the paragraph HTML5 boilerplate adds
    body.removeChild(document.querySelector("p"))

    var container = document.createElement("div")
    container.innerHTML = html

    body.appendChild(container)

  }, fs.read(args.in))

  // Set the PDF paper size
  page.paperSize = paperSize(args.runningsPath, {format: args.paperFormat, orientation: args.paperOrientation, border: args.paperBorder})

  // Render the page
  setTimeout(function () {
    page.render(args.out)
    page.close()
    phantom.exit(0)
  }, parseInt(args.renderDelay, 10))
})

function paperSize(runningsPath, obj) {
  var runnings = require(runningsPath)

  // encapsulate .contents into phantom.callback()
  //   Why does phantomjs not support Array.prototype.forEach?!
  var keys = ["header", "footer"]
  for (var i = 0; i < keys.length; i++) {
    var which = keys[i]
    if (runnings[which]
      && runnings[which].contents
      && typeof runnings[which].contents === "function") {
      obj[which] = {
        contents: phantom.callback(runnings[which].contents)
      }
      if (runnings[which].height)
        obj[which].height = runnings[which].height
    }
  }

  return obj
}
