# resume-cli

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/jsonresume/public?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build status](https://img.shields.io/github/workflow/status/jsonresume/resume-cli/Main)](https://github.com/jsonresume/resume-cli/actions)
[![Dependency status](https://david-dm.org/jsonresume/resume-cli.svg)](https://david-dm.org/jsonresume/resume-cli)
[![devDependency status](https://david-dm.org/jsonresume/resume-cli/dev-status.svg)](https://david-dm.org/jsonresume/resume-cli#info=devDependencies)
[![npm package](https://badge.fury.io/js/resume-cli.svg)](https://www.npmjs.org/package/resume-cli)

This is the command line tool for [JSON Resume](https://jsonresume.org), the open source initiative to create a JSON-based standard for resumes.

[Read more...](https://jsonresume.org/schema/)


Alternatives: The Resume CLI tool works as it is so there isn't a huge amount of active development on it, try these alternatives if it doesn't work for you;
- [Resumed](https://github.com/rbardini/resumed)


# Getting Started

Install the command-line tool:

```
npm install -g resume-cli
```

## Commands at a glance

| command                | description                               |
| ---------------------- | ----------------------------------------- |
| init                   | Initialize a `resume.json` file           |
| validate               | Schema validation test your `resume.json` |
| export [fileName.html] | Export locally to `.html`                 |
| serve                  | Serve resume at `http://localhost:4000/`  |

# Usage

## `resume --help`

Show a list of options and commands for the <abbr title="Command Line Interface">CLI</abbr>.

## `resume init`

Creates a new `resume.json` file in your current working directory.

Complete the `resume.json` with your text editor. Be sure to follow the schema
(available at http://jsonresume.org).

## `resume validate`

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

# supported resume input types

- [`json`](https://www.json.org/json-en.html): via `JSON.parse`.
- [`yaml`](https://yaml.org/): via [`yaml-js`](https://www.npmjs.com/package/yaml-js)
- `quaff`: if `--resume` is a directory, then the path is passed to [`quaff`](https://www.npmjs.com/package/quaff) and the resulting json is used as the resume. quaff supports a variety of formats in the directory, including javascript modules.

# resume data

- Setting `--resume -` tells the cli to read resume data from standard input (`stdin`), and defaults `--type` to `application/json`.
- Setting `--resume <path>` reads resume data from `path`.
- Leaving `--resume` unset defaults to reading from `resume.json` on the current working directory.

# resume mime types

Supported resume data mime types are:

- `application/json`
- `text/yaml`

# Development

to test the cli, run the dev script:

```sh
npm run dev -- [cli arguments can be passed after the double-dash]
```

# Vagrant Development Environment

To use the [Vagrant](vagrantup.com/) Development Environment:

## Install Virtualbox

The Virtual Machine for Vagrant for the developer environment for this will run in
[Virtualbox](https://www.virtualbox.org/), a Virtual Machine provider.

Vagrant will then help you configure the Virtual Machine in Virtualbox to work with
this code.

Before installing Vagrant, make sure you can successfully download and install
Virtualbox from [Virtualbox.org](https://www.virtualbox.org/wiki/Downloads).

## Install Vagrant

https://duckduckgo.com/?q=install+vagrant

## Run Vagrant

Use your terminal to navigate to the top level of this folder, 
by changing into the directory you just cloned with `cd resume`.

Then run `vagrant up` and `vagrant ssh`. 

You should see the command prompt change, and this means you're ready to start!

Side note: If you ever want to exit the Vagrant prompt, just enter the `exit` command
and you'll see your command prompt change back to normal. 

If you run into an error complaining about `bsdtar`, just try installing libarchive as described here: https://github.com/hashicorp/vagrant/issues/6390

If you get an error about default providers, make sure you have the latest version of Virtualbox installed.

```sh
vagrant up
vagrant ssh
cd /vagrant
ls # Should show a file named resume.json
resume validate
npm install jsonresume-theme-stackoverflow # Just in case
resume export --format html --theme stackoverflow resume-$(date +"%m-%d-%y").html
cp /www/html/sites/resume/resume.html /www/html/sites/resume/resume.html.$(date +"%m-%d-%y").bak
cp resume-$(date +"%m-%d-%y").html /www/html/sites/resume/resume.html
```

# License

Available under [the MIT license](http://mths.be/mit).
