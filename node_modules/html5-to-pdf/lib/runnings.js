exports.header = null

exports.footer = null

/**
 * header and footer might be of format specified in https://github.com/ariya/phantomjs/wiki/API-Reference-WebPage#wiki-webpage-paperSize
 * 
 * Example:
 *  {
 *    height: "1cm",
 *    contents: function(pageNum, numPages) {
 *      return "<h1>Header <span style='float:right'>" + pageNum + " / " + numPages + "</span></h1>"
 *    }
 *  }
 */