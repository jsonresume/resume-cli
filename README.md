# resume-cli

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jsonresume/public?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/jsonresume/resume-cli.svg?branch=master)](https://travis-ci.org/jsonresume/resume-cli) [![Dependency Status](https://david-dm.org/jsonresume/resume-cli.svg)](https://david-dm.org/jsonresume/resume-cli) [![devDependency Status](https://david-dm.org/jsonresume/resume-cli/dev-status.svg)](https://david-dm.org/jsonresume/resume-cli#info=devDependencies)  [![](https://badge.fury.io/js/resume-cli.svg)](https://www.npmjs.org/package/resume-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org/), the open source initiative to create a JSON-based standard for resumes.

[Read more...](https://jsonresume.org/schema/)

## Donations

[![Bountysource](https://www.bountysource.com/badge/team?team_id=21303&style=bounties_received)](https://www.bountysource.com/teams/jsonresume/issues?utm_source=JSON%20Resume&utm_medium=shield&utm_campaign=bounties_received)
[![Support via Gratipay](http://img.shields.io/gratipay/jsonresume.svg)](https://gratipay.com/jsonresume/)
[![tip for next commit](https://tip4commit.com/projects/43122.svg)](https://tip4commit.com/github/jsonresume/resume-cli)

## IRC

```
#jsonresume on freenode
```

You can use the web client [http://webchat.freenode.net/](http://webchat.freenode.net?channels=%23jsonresume).

# Getting Started

```
npm install -g resume-cli
```

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

## License

Available under [the MIT license](http://mths.be/mit).
