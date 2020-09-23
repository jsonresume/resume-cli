# Contributing

## Writing commit messages

resume-cli uses [semantic-release](https://semantic-release.gitbook.io/) to automate version management and package publishing.
semantic-release determines the next version number and [release notes](https://github.com/jsonresume/resume-cli/releases) based on the commit messages, meaning a convention must be followed.

resume-cli uses the [Conventional Commits](https://www.conventionalcommits.org/) specification to describe features, fixes, and breaking changes in commit messages. A typical commit title is structured as follows:

```txt
<type>[optional scope]: <description>
```

### Type

Must be one of the following:

- `fix:` for a bug fix (corresponds to a `PATCH` release);
- `feat:` for a new feature (corresponds to a `MINOR` release);
- other non-release types such as `build:`, `docs:`, `refactor:`, `test:` and others (see [recommended](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional#type-enum)).

Appending a `!` after the type/scope indicates a _breaking change_ (corresponds to a `MAJOR` release). A breaking change can be part of commits of any type.

### Scope

A scope may be provided to a commit’s type, to provide additional contextual information and is contained within parenthesis, e.g. `feat(theme): add ability to specify theme`.

### Description

The description contains a concise explanation of the changes:

- use the imperative, present tense, e.g. _"change"_, not _"changed"_ nor _"changes"_;
- don't capitalize the first letter;
- no period (`.`) at the end.

## Submitting a pull request

The pull request title should follow the same [commit title conventions](#writing-commit-messages), as it will become the merge commit title, and thus be used to determine the type of changes in the codebase.

Because pull request commits are squashed on merge, you don't need to follow this convention on every _feature branch_ commit, but certainly do for the _merge_ commit.

## Merging a pull request

Before merging a pull request:

1. make sure the pull request branch is synced with the target branch;
2. make sure all pull request checks are passing;
3. merge using the _squash and merge_ option;
4. assuming the pull request title is following the [title conventions](#submitting-a-pull-request):
   1. do not modify the merge commit title field, keeping the pull request ID reference;
   2. empty the merge commit message field, only adding content if relevant (e.g. breaking changes).
