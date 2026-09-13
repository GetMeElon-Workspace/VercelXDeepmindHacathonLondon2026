# Contributing

## Commit attribution

Policy requested by GetMeElon on 2026-09-13, applicable to new work in
GetMeElon-Workspace and to every AI assistant working on GetMeElon's behalf.

- Author new AI-assisted commits as `GetMeElon <dzjchu@gmail.com>`.
- Add one `AI-assisted-by:` commit-message trailer for each assistant that
  actually contributed, for example `Devin`, `Claude`, or `ChatGPT`. Use the
  actual tool name for other assistants; never guess participation.
- Credit actual human collaborators with
  `Co-authored-by: Name <their GitHub-associated email>`. Ask for their preferred
  identity rather than inventing it.
- For shared work authored by a human collaborator, preserve their authorship
  and add `Co-authored-by: GetMeElon <dzjchu@gmail.com>` to credit GetMeElon.
- Preserve existing and third-party history, original authors, the real
  committer, and signing requirements. Do not rewrite history for attribution.
- Preserve all applicable AI and human trailers when squashing or merging.
  Put attribution in commit messages, not repetitive source-code comments.

For a commit made by Devin on GetMeElon's behalf:

```sh
env GIT_AUTHOR_NAME=GetMeElon GIT_AUTHOR_EMAIL=dzjchu@gmail.com \
  git var GIT_AUTHOR_IDENT
env GIT_AUTHOR_NAME=GetMeElon GIT_AUTHOR_EMAIL=dzjchu@gmail.com \
  git commit -m "Describe the change" -m "AI-assisted-by: Devin"
```

Use the assistant's actual name in place of `Devin`. For a multi-agent change,
include multiple trailers in the final paragraph. Add any human co-authors in
that same paragraph. Do not tag an AI assistant as a human co-author.

Before pushing, inspect the new commit's author and message with
`git show --no-patch --format=full HEAD` and check the trailers with
`git show -s --format=%B HEAD | git interpret-trailers --parse`. GitHub associates
human attribution with account-linked emails; push authentication alone does
not set the Git author.

These instructions require participating tools and contributors to follow them.
They do not automatically configure external AI services or create required
GitHub checks.
