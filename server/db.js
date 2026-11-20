// Database setup. Uses sql.js (SQLite compiled to WebAssembly), so there is
// nothing to install or compile: the database is a single file, data/tasks.db.
import initSqlJs from "sql.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DB_DIR, "tasks.db");

const SQL = await initSqlJs();

let db;
if (fs.existsSync(DB_FILE)) {
  db = new SQL.Database(fs.readFileSync(DB_FILE));
} else {
  db = new SQL.Database();
  db.run(`
    CREATE TABLE tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      priority TEXT,
      due_date TEXT,
      done INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  const seed = [
    ["Set up my GitHub profile", "high", "2026-11-20", 1],
    ["Install Node.js and VS Code", "high", "2026-11-20", 1],
    ["Read the Week 1 assessment", "medium", "2026-11-22", 0],
    ["Try Gemini Code Assist", "low", "", 0],
  ];
  for (const t of seed) {
    db.run("INSERT INTO tasks (title, priority, due_date, done) VALUES (?, ?, ?, ?)", t);
  }
  save();
}

// sql.js keeps the database in memory, so write it to disk after every change.
export function save() {
  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
}

// Run a SELECT and return the rows as plain objects.
export function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

// Run an INSERT, UPDATE or DELETE and save the file.
export function run(sql, params = []) {
  db.run(sql, params);
  const id = all("SELECT last_insert_rowid() AS id")[0].id;
  save();
  return id;
}
