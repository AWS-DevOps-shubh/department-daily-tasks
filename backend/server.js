// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Sample in-memory tasks list
let tasks = [
  { id: 1, title: "Daily Meeting", description: "Attend daily meeting at 9 AM", completed: false },
  { id: 2, title: "Report Update", description: "Update department daily report", completed: false }
];

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const newTask = { id: tasks.length + 1, ...req.body, completed: false };
  tasks.push(newTask);
  res.json(newTask);
});

// Update an existing task (e.g., toggle completion or edit details)
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(task => task.id === parseInt(id));
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...req.body };
    res.json(tasks[index]);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== parseInt(id));
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
