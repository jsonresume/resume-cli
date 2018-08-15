module.exports = function getResumePath(argv) {
  let jsonLocation = './resume.json'
  argv.forEach(arg => {
    if (arg.startsWith('--resume=') || arg.startsWith('-r=')) {
      jsonLocation = arg.replace('--resume=', '').replace('-r=', '')
    }
  })
  return jsonLocation
}
