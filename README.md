# resume-cli

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jsonresume/public?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/jsonresume/resume-cli.svg?branch=master)](https://travis-ci.org/jsonresume/resume-cli) [![Dependency Status](https://david-dm.org/jsonresume/resume-cli.svg)](https://david-dm.org/jsonresume/resume-cli) [![devDependency Status](https://david-dm.org/jsonresume/resume-cli/dev-status.svg)](https://david-dm.org/jsonresume/resume-cli#info=devDependencies)  [![](https://badge.fury.io/js/resume-cli.svg)](https://www.npmjs.org/package/resume-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org), the open source initiative to create a JSON-based standard for resumes.

[Read more...](https://jsonresume.org/schema/)


# Getting Started

Install the command-line tool:

```
npm install -g resume-cli
```
# General commands at a glance

| command | description |
| ------- | ----------- |
| init | Initialize a `resume.json` file |
| register | Register an account at [jsonresume](https://registry.jsonresume.org) |
| login | Stores a user session |
| settings | Change theme, change password, delete account |
| test | Schema validation test your `resume.json` |
| export [fileName] | Export locally to `.html` or `.pdf` |
| publish | Publish your resume to [jsonresume](https://registry.jsonresume.org) | 
| serve | Serve resume at `http://localhost:4000/` |

# Usage

## `resume --help`

Show a list of options and commands for the <abbr title="Command Line Interface">CLI</abbr>.


## `resume init`

Creates a new `resume.json` file in your current working directory.

Complete the `resume.json` with your text editor. Be sure to follow the schema 
(available at http://jsonresume.org).


## `resume test`

Validates your `resume.json` against our schema tests to ensure it complies with 
the standard. Tries to identify where any errors may be occurring.


## `resume export [fileName]`

Exports your resume locally in a stylized HTML, Markdown, or PDF format.

A list of available themes can be found here: http://jsonresume.org/themes/

Please npm install the theme you wish to use locally before attempting to export it.

Options:
  - `--format <file type>` Example: `--format pdf`
  - `--theme <name>` Example: `--theme flat`  

## `resume serve`

Starts a web server that serves your local `resume.json`.  

Options: 
  - `--port <port>`
  - `--theme <name>`

If no theme is specified, it will look for the file `index.js` and call 
`render()`. This is useful when developing themes.



# License

Available under [the MIT license](http://mths.be/mit).
