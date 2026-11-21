# Week 1 Assessment: Starter App Exploration

## At least three things you would improve, and why

1. **The add form:** It lets users submit a blank task title because the submit handler has no `required` or non-empty check. Without this restriction, users can repeatedly add empty tasks, which sends unnecessary invalid requests to the backend.
   * Code: `<button type="submit">Add</button>` — Line 82 (`client/src/App.jsx`)

2. **Deletion button:** It deletes a task immediately without asking the user for confirmation first. Adding a browser confirmation prompt (`window.confirm`) before taking the action would reduce accidental deletions.
   * Code: `<button onClick={() => deleteTask(t.id)}>Delete</button>` — Line 122 (`client/src/App.jsx`)

3. **Layout is not responsive:** The layout uses a fixed pixel width instead of adapting to smaller screens. Adding responsiveness from the form to the table would improve accessibility and usability for users on different devices.
   * Code: `<table border="1" cellPadding="4" style={{ width: 900, borderCollapse: "collapse" }}>` — Line 93 (`client/src/App.jsx`)

## The prompts and AI tools you used to explore the app

**Prompt used:**
> **Role:** You are a senior full-stack software engineer reviewing a starter React + Express + SQLite application.
> **Context:** I am exploring this task-tracker codebase (`@App.jsx` and the tagged `server/` files) to understand how the frontend and backend connect and where the app falls short.
> **Task:** Explain how data flows between the frontend and backend, and identify at least four specific bugs, missing validations, or UX/security weaknesses with exact file names and line numbers.
> **Constraints:** Do not rewrite or modify my code yet, and do not assume features exist unless they are explicitly written in the tagged files.
> **Output format:** First, give a 4-bullet summary of the data flow. Second, provide a numbered list of issues with the file name, line number, and a one-sentence explanation of why it matters.

**AI Tools Used:** ChatGPT and GitHub Copilot in VS Code.

## One thing AI got wrong or missed, and how you noticed

The one thing AI got wrong was the line numbers of the code it was explaining. For example, it said Line 63 had a fixed width of `900px`, but it was actually Line 93 (`client/src/App.jsx`). I noticed it by crosschecking the explanation it gave me against the actual code in VS Code.
