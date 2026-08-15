# Project Memory

This is a monorepo with multiple subprojects. Each subproject keeps its own persistent memory so sessions don't lose context when you switch projects.

## Determining the subproject

Find the top-level folder under this repo that contains the current working directory. That folder name is the subproject name. For example, `demo/resume/...` -> subproject `resume`.

## Memory file location

Memory lives at `.opencode/memory/<subproject>.md` (relative to this repo root, i.e. `demo/.opencode/memory/resume.md`). If the current working directory is the repo root itself with no subproject, use `.opencode/memory.md`.

## Session start (required)

Before starting any work in a new session, read the memory file for the current subproject and review the `## Last session` section. If it records unfinished work, decisions, or context, factor it into what you're doing.

## Session end (required)

When the session is wrapping up (the user stops giving tasks or asks you to summarize), update the `## Last session` section in the current subproject's memory file with:

- What was worked on (short paragraph)
- Current state / unfinished work
- Key decisions made
- Suggested next steps

Keep it concise but complete enough that a fresh session can pick up where this one left off. If the file already has a `## Last session` section, replace it (keep only the most recent session). Create the memory file and directory if it does not exist.
