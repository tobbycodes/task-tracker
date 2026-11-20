import express from "express";
import { all, run } from "./db.js";

const app = express();
app.use(express.json());

app.get("/api/tasks", (req, res) => {
  const tasks = all("SELECT * FROM tasks ORDER BY id DESC");
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { title, priority, due_date } = req.body;
  const id = run("INSERT INTO tasks (title, priority, due_date) VALUES (?, ?, ?)", [title, priority, due_date]);
  res.json(all("SELECT * FROM tasks WHERE id = ?", [id])[0]);
});

app.put("/api/tasks/:id", (req, res) => {
  const { title, priority, due_date, done } = req.body;
  run("UPDATE tasks SET title = ?, priority = ?, due_date = ?, done = ? WHERE id = ?", [title, priority, due_date, done ? 1 : 0, req.params.id]);
  res.json(all("SELECT * FROM tasks WHERE id = ?", [req.params.id])[0]);
});

app.delete("/api/tasks/:id", (req, res) => {
  run("DELETE FROM tasks WHERE id = ?", [req.params.id]);
  res.json({ ok: true });
});

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
