const path = require('path')
const chalk = require('chalk')

module.exports = async function renderHtml(resumeJson, theme) {
  if (!theme.match('jsonresume-theme-.*')) {
    theme = 'jsonresume-theme-' + theme
  }

  const themePath = path.resolve(process.cwd(), 'node_modules', theme)
  const render = require(themePath).render

  if (typeof render !== 'function') {
    console.log(
      chalk.yellow('Could not run the render function from local theme.'),
    )
    return Promise.reject(new Error(`Can't render with "${theme}"'s theme`))
  }

  return render(resumeJson)
}
