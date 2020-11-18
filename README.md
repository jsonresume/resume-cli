# resume-cli

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jsonresume/public?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build status](https://img.shields.io/github/workflow/status/jsonresume/resume-cli/Main)](https://github.com/jsonresume/resume-cli/actions)
[![Dependency status](https://david-dm.org/jsonresume/resume-cli.svg)](https://david-dm.org/jsonresume/resume-cli)
[![devDependency status](https://david-dm.org/jsonresume/resume-cli/dev-status.svg)](https://david-dm.org/jsonresume/resume-cli#info=devDependencies)
[![npm package](https://badge.fury.io/js/resume-cli.svg)](https://www.npmjs.org/package/resume-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org), the open source initiative to create a JSON-based standard for resumes.

[Read more...](https://jsonresume.org/schema/)

# Getting Started

Install the command-line tool:

```
npm install -g resume-cli
```

## Commands at a glance

| command                | description                               |
| ---------------------- | ----------------------------------------- |
| init                   | Initialize a `resume.json` file           |
| test                   | Schema validation test your `resume.json` |
| export [fileName.html] | Export locally to `.html`                 |
| serve                  | Serve resume at `http://localhost:4000/`  |

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

Exports your resume locally in a stylized HTML or PDF format.

A list of available themes can be found here: http://jsonresume.org/themes/

Please npm install the theme you wish to use locally before attempting to export it.

Options:

- `--format <file type>` Example: `--format pdf`
- `--theme <name>` Example: `--theme even`

## `resume serve`

Starts a web server that serves your local `resume.json`. It will live reload when you make edits to your `resume.json`.

Options:

- `--port <port>`
- `--theme <name>`

When developing themes, simply change into your theme directory and run `resume serve --theme .` (which tells it to run the local folder as the specified theme)

# License

Available under [the MIT license](http://mths.be/mit).
