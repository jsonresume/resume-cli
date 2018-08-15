module.exports = function getResumePath(argv) {
  let jsonLocation = './resume.json'
  argv.forEach(arg => {
    if (arg.indexOf('--resume') !== -1 || arg.indexOf('-r') !== -1) {
      jsonLocation = arg.replace('--resume=', '').replace('-r=', '')
    }
  })
  return jsonLocation
}
