// App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTask, setEditTask] = useState({ title: '', description: '' });

  // Fetch tasks from the backend API
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks');
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  // Add a new task
  const addTask = async () => {
    if (!newTask.title || !newTask.description) return;
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTask({ title: '', description: '' });
    setIsAdding(false);
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (id, completed) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
  };

  // Delete a task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    });
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Begin editing a task
  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTask({ title: task.title, description: task.description });
  };

  // Save edited task
  const saveEditedTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editTask)
    });
    const updatedTask = await res.json();
    setTasks(tasks.map(task => (task.id === id ? updatedTask : task)));
    setEditTaskId(null);
  };

  return (
    <div className="app-container">
      <h1>Department Daily Tasks</h1>
      <button className="btn primary" onClick={() => setIsAdding(true)}>
        Add Task
      </button>

      {/* Modal for adding new task */}
      {isAdding && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsAdding(false)}>&times;</span>
            <h2>Add New Task</h2>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={newTask.title}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="description"
              placeholder="Task Description"
              value={newTask.description}
              onChange={handleInputChange}
            />
            <button className="btn" onClick={addTask}>
              Submit
            </button>
          </div>
        </div>
      )}

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className="task-item">
            {editTaskId === task.id ? (
              <div className="task-edit">
                <input
                  type="text"
                  name="title"
                  value={editTask.title}
                  onChange={handleEditInputChange}
                />
                <input
                  type="text"
                  name="description"
                  value={editTask.description}
                  onChange={handleEditInputChange}
                />
                <button className="btn" onClick={() => saveEditedTask(task.id)}>
                  Save
                </button>
                <button className="btn secondary" onClick={() => setEditTaskId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="task-view">
                <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.title}
                </h3>
                <p>{task.description}</p>
                <div className="btn-group">
                  <button
                    className="btn"
                    onClick={() => toggleTaskCompletion(task.id, task.completed)}
                  >
                    {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </button>
                  <button className="btn secondary" onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                  <button className="btn" onClick={() => handleEditTask(task)}>
                    Edit
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
