# Task Tracker structure

The project has two main parts, managed as npm workspaces:

- `client/` is the React frontend. `src/main.jsx` mounts `App.jsx` into the page. `App.jsx` holds the task list and form/filter/edit values in React state, renders the interface, and handles user actions.
- `server/` is the Express backend. `server.js` defines the HTTP API and parses JSON request bodies.
- `server/db.js` initializes `sql.js`, a SQLite implementation compiled to WebAssembly, and reads/writes the database file at `server/data/tasks.db`. The `tasks` table stores each task's title, priority, due date, completion state, and creation time.

## How data flows

When the app opens, `App.jsx` sends `GET /api/tasks` and puts the JSON response into React state. Adding a task sends `POST /api/tasks`; editing or changing its completion state sends `PUT /api/tasks/:id`; deleting sends `DELETE /api/tasks/:id`. Express routes these requests to SQL queries in `db.js`, then responds with JSON. The frontend updates its state from those responses so React re-renders the task list.

During development, Vite serves the frontend on port 5173 and proxies requests beginning with `/api` to Express on port 4000, as configured in `client/vite.config.js`. The root `npm run dev` command starts both development servers.

## Three improvements I would make

1. Validate task input in both the frontend and backend. For example, reject blank titles and unsupported priorities so invalid data cannot be saved by bypassing the UI.
2. Handle failed API requests and show useful feedback. The current fetch calls do not check HTTP error responses or catch network failures, so the interface may not explain why an action failed.
3. Improve accessibility and responsive layout. Add clear labels for form controls and make the fixed-width page/table usable on narrow screens.

## Prompts and AI tools used

- Prompt: “Explain how this Task Tracker app is structured. How does the React frontend in client/ communicate with the Express backend and SQLite database in server/?”
- Follow-up prompt: “Explain how this Task Tracker app is structured ... Add a NOTES.md file to my repository with [the assessment requirements].”
- Tool: Copilot Chat in VS Code. I checked the explanation against the project files, including `App.jsx`, `server.js`, `db.js`, and `vite.config.js`.

## One thing AI missed

The first draft of these notes explained the app but omitted the assessment's required improvements, prompts/tools, and AI-missed-item sections. I noticed by checking the requirements in `ASSESSMENT.md` and added those sections here.