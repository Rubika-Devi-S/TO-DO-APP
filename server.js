const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

let todos = [];

// Get all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// Add a todo
app.post("/api/todos", (req, res) => {
  const newTodo = {
    id: Date.now(),
    task: req.body.task,
    completed: false,
  };
  todos.push(newTodo);
  res.json(newTodo);
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  todos = todos.filter((todo) => todo.id != req.params.id);
  res.json({ message: "Deleted" });
});

// Toggle completed
app.put("/api/todos/:id", (req, res) => {
  todos = todos.map((todo) =>
    todo.id == req.params.id ? { ...todo, completed: !todo.completed } : todo
  );
  res.json({ message: "Updated" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
