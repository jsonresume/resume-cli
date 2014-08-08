# JSON Resume Command Line

[![](https://api.travis-ci.org/jsonresume/resume-cli.svg)](http://travis-ci.org/jsonresume/resume-cli)

### IRC

Everyone working on the early stages of the project should join our Freenode channel:

```
#jsonresume on freenode
```

You can use the web client [http://webchat.freenode.net/](http://webchat.freenode.net/).

# Getting Started

```
npm install -g resume-cli
```

[![](https://badge.fury.io/js/resume-cli.png)](https://www.npmjs.org/package/resume-cli)

# Usage

```
resume --help
```

For a complete list of options and commands.

```
resume init
```

Creates a new resume.json file in your current working directory.   

Complete the resume.json with your text editor, following the schema available at:  
http://jsonresume.org/

```
resume test
```

Runs your resume.json through our schema tests to ensure it complies with the standard and tries to identify where any errors may be occurring.

```
resume export [fileName]
```

Exports your resume locally in a stylized html, markdown, or pdf format.

Use the `--format` flag to specify file type. Example: `--format pdf`

Use the `--theme <name>` flag to specify theme. Example: `--theme flat`  
_A list of available themes can be found here: http://jsonresume.org/themes/_

```
resume register
```

_Registration is optional._

To publish your resume to your account with a custom domain extension at http://registry.jsonresume.org/, you will first need to acquire login credentials. 

```
resume publish
```

This command will guide you through the publish process.
Consider using the theme flag to style your resume (Default: `flat`).

Example: `resume publish --theme flat`

```
resume serve
```

Starts a web server that serves your local resume.json.  
Options: `--port <port>`, `--theme <name>`

If no theme is specified, it will try to locate a local `index.js` and call the `render()` function. This is useful when developing themes.

## Community Projects

Anyone working on projects for JSON Resume should submit a pull request and add themselves to the list.

### LinkedIn Exporters
* [Web based export](https://github.com/JMPerez/linkedin-to-json-resume) by [José Manuel Pérez](https://twitter.com/jmperezperez)
* [CLI based export](https://github.com/mblarsen/resume-linkedin) by [Michael Bøcker-Larsen](https://twitter.com/mblarsen)

### Web UI Builders
* [Resume Edit](https://erming.github.io/resume-edit) by [Mattias Erming](https://github.com/erming)
* [JSON Resume Web App](https://github.com/jonnykry/JSONResumeWebApp/tree/gh-pages) by [Jonny Krysh](https://github.com/jonnykry)
