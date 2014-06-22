module.exports = process.env.HTML5TOPDF_COV
   ? require('./lib-cov/html5-to-pdf')
   : require('./lib/html5-to-pdf')