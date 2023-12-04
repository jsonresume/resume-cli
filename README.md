# resume-cli

[![matrix](https://img.shields.io/badge/matrix-join%20chat-%230dbd8b)](https://matrix.to/#/#json-resume:one.ems.host)
[![Build status](https://img.shields.io/github/actions/workflow/status/jsonresume/resume-cli/test.yml?branch=master)](https://github.com/jsonresume/resume-cli/actions)
[![npm package](https://badge.fury.io/js/resume-cli.svg)](https://www.npmjs.org/package/resume-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org), the open-source initiative to create a JSON-based standard for resumes.

## Project Status

This repository is not actively maintained. It's recommended to use one of the third-party clients that support the JSON Resume standard instead:

* [Resumed](https://github.com/rbardini/resumed)

## Getting Started

Install the command-line tool:

```
npm install -g resume-cli
```

## Usage

### Commands at a Glance

| Command | Description |
|---|---|
| init | Initialize a `resume.json` file. |
| validate | Schema validation test your `resume.json`. |
| export path/to/file.html | Export to `.html`. |
| serve | Serve resume at `http://localhost:4000/`. |

### `resume --help`

Show a list of options and commands for the <abbr title="Command-line Interface">CLI</abbr>.

### `resume init`

Creates a new `resume.json` file in your current working directory.

Complete the `resume.json` with your text editor. Be sure to follow the schema (available at https://jsonresume.org/schema/).

### `resume validate`

Validates your `resume.json` against our schema to ensure it complies with the standard. Tries to identify where any errors may be occurring.

### `resume export [fileName]`

Exports your resume in a stylized HTML or PDF format.

A list of available themes can be found here:  
https://jsonresume.org/themes/

Please npm install the theme you wish to use before attempting to export it.

Options:

- `--format <file type>` Example: `--format pdf`
- `--theme <name>` Example: `--theme even`

### `resume serve`

Starts a web server that serves your local `resume.json`. It will live reload when you make changes to your `resume.json`.

Options:

- `--port <port>`
- `--theme <name>`

When developing themes, change into your theme directory and run `resume serve --theme .`, which tells it to run the local folder as the specified theme.

This is not intended for production use, it's a convenience for theme development or to visualize changes to your resume while editing it.

## Supported Resume Input Types

- [`json`](https://www.json.org/json-en.html): via `JSON.parse`.
- [`yaml`](https://yaml.org/): via [`yaml-js`](https://www.npmjs.com/package/yaml-js)
- `quaff`: if `--resume` is a directory, then the path is passed to [`quaff`](https://www.npmjs.com/package/quaff) and the resulting json is used as the resume. quaff supports a variety of formats in the directory, including javascript modules.

## Resume Data

- Setting `--resume -` tells the CLI to read resume data from standard input (`STDIN`), and defaults `--type` to `application/json`.
- Setting `--resume <path>` reads resume data from `path`.
- Leaving `--resume` unset defaults to reading from `resume.json` on the current working directory.

## Resume MIME Types

Supported resume data MIME types are:

- `application/json`
- `text/yaml`

## License

Available under [the MIT license](http://mths.be/mit).
