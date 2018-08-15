const should = require('should')
const getResumePath = require('../lib/pre-flow/get-resume-path')

describe('getResumePath', () => {
  it('should give "./resume.json" by default', () => {
    const resumePath = getResumePath([])

    resumePath.should.equal('./resume.json')
  })

  describe('should give resume path given by arguments', () => {
    it('with "-r=<PATH>" option', () => {
      const argv = [
        '/usr/bin/node',
        '/home/user/my-resume/node_modules/.bin/resume',
        'export',
        'resume.html',
        '-r=my-resume.json',
      ]

      const resumePath = getResumePath(argv)

      resumePath.should.equal('my-resume.json')
    })

    it('with "--resume=<PATH>" option', () => {
      const argv = [
        '/usr/bin/node',
        '/home/user/my-resume/node_modules/.bin/resume',
        'export',
        'resume.html',
        '--resume=my-resume.json',
      ]

      const resumePath = getResumePath(argv)

      resumePath.should.equal('my-resume.json')
    })

    it('with "-r <PATH>" option', () => {
      const argv = [
        '/usr/bin/node',
        '/home/user/my-resume/node_modules/.bin/resume',
        'export',
        'resume.html',
        '-r',
        'my-resume.json',
      ]

      const resumePath = getResumePath(argv)

      resumePath.should.equal('my-resume.json')
    })

    it('with "--resume <PATH>" option', () => {
      const argv = [
        '/usr/bin/node',
        '/home/user/my-resume/node_modules/.bin/resume',
        'export',
        'resume.html',
        '--resume',
        'my-resume.json',
      ]

      const resumePath = getResumePath(argv)

      resumePath.should.equal('my-resume.json')
    })
  })

  it('should give default value even when the folder contains "-r"', () => {
    const argv = [
      '/usr/bin/node',
      '/home/user/my-resume/node_modules/.bin/resume',
      'export',
      'resume.html',
    ]

    const resumePath = getResumePath(argv)

    resumePath.should.equal('./resume.json')
  })
})
