import { useState, useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  function addTask(e) {
    e.preventDefault();
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: title, priority: priority, due_date: dueDate }),
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([task, ...tasks]);
        setTitle("");
        setPriority("medium");
        setDueDate("");
      });
  }

  function toggleDone(t) {
    fetch("/api/tasks/" + t.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: t.title, priority: t.priority, due_date: t.due_date, done: !t.done }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTasks(tasks.map((x) => (x.id === updated.id ? updated : x)));
      });
  }

  function saveEdit(t) {
    fetch("/api/tasks/" + t.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, priority: t.priority, due_date: t.due_date, done: t.done }),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTasks(tasks.map((x) => (x.id === updated.id ? updated : x)));
        setEditingId(null);
      });
  }

  function deleteTask(id) {
    fetch("/api/tasks/" + id, { method: "DELETE" }).then(() => {
      setTasks(tasks.filter((x) => x.id !== id));
    });
  }

  let shown = tasks;
  if (filter === "active") shown = tasks.filter((t) => !t.done);
  if (filter === "done") shown = tasks.filter((t) => t.done);
  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div style={{ width: 900, margin: 20, fontFamily: "Times New Roman" }}>
      <h1>Task Tracker</h1>

      <form onSubmit={addTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task" style={{ width: 300 }} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <p>
        Show:{" "}
        <button onClick={() => setFilter("all")} style={{ fontWeight: filter === "all" ? "bold" : "normal" }}>All</button>
        <button onClick={() => setFilter("active")} style={{ fontWeight: filter === "active" ? "bold" : "normal" }}>Active</button>
        <button onClick={() => setFilter("done")} style={{ fontWeight: filter === "done" ? "bold" : "normal" }}>Done</button>
        {" "}{remaining} left
      </p>

      <table border="1" cellPadding="4" style={{ width: 900, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Done</th>
            <th>Task</th>
            <th>Priority</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((t) => (
            <tr key={t.id}>
              <td><input type="checkbox" checked={!!t.done} onChange={() => toggleDone(t)} /></td>
              <td style={{ textDecoration: t.done ? "line-through" : "none" }}>
                {editingId === t.id ? (
                  <span>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <button onClick={() => saveEdit(t)}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </span>
                ) : (
                  t.title
                )}
              </td>
              <td style={{ color: t.priority === "high" ? "red" : t.priority === "medium" ? "orange" : "green" }}>{t.priority}</td>
              <td>{t.due_date}</td>
              <td>
                <button onClick={() => { setEditingId(t.id); setEditTitle(t.title); }}>Edit</button>
                <button onClick={() => deleteTask(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
