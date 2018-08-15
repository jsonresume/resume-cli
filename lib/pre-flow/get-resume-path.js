module.exports = function getResumePath(argv) {
  let jsonLocation = './resume.json'
  argv.forEach((arg, index) => {
    if (arg.startsWith('--resume=') || arg.startsWith('-r=')) {
      jsonLocation = arg.replace('--resume=', '').replace('-r=', '')
    } else if (argv.length > index + 1) {
      if (arg === '--resume' || arg === '-r') {
        jsonLocation = argv[index + 1]
      }
    }
  })
  return jsonLocation
}
