import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {

  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  // GET all tasks
  const loadTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/todos`);
      setTasks(response.data);
    } catch {
      setMessage("Backend connection failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // ADD task
  const createTask = async (e) => {
    e.preventDefault();

    if (!taskInput.trim()) return;

    try {
      const response = await axios.post(`${BASE_URL}/api/todos`, {
        title: taskInput.trim(),
      });

      setTasks([response.data, ...tasks]);
      setTaskInput("");
    } catch {
      setMessage("Unable to create task.");
    }
  };

  // COMPLETE toggle
  const toggleTask = async (task) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/todos/${task.id}`, {
        completed: !task.completed,
      });

      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch {
      setMessage("Update failed.");
    }
  };

  // START edit
  const beginEdit = (task) => {
    setEditTaskId(task.id);
    setEditText(task.title);
  };

  // SAVE edit
  const updateTask = async (id) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(`${BASE_URL}/api/todos/${id}`, {
        title: editText.trim(),
      });

      setTasks(tasks.map((t) => (t.id === id ? response.data : t)));
      setEditTaskId(null);
    } catch {
      setMessage("Edit failed.");
    }
  };

  // DELETE task
  const removeTask = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/todos/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      setMessage("Delete failed.");
    }
  };

  return (
    <div className="wrapper">
      <div className="todo-box">

        <h2>Todo </h2>

        {message && (
          <div className="alert">
            {message}
            <button onClick={() => setMessage("")}>x</button>
          </div>
        )}

        {/* ADD FORM */}
        <form className="task-form" onSubmit={createTask}>
          <input
            type="text"
            placeholder="Enter task..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button>Add</button>
        </form>

        {/* LIST */}
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className={task.completed ? "done" : ""}>

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task)}
                />

                {editTaskId === task.id ? (
                  <div className="edit-area">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => updateTask(task.id)}>Save</button>
                    <button onClick={() => setEditTaskId(null)}>Cancel</button>
                  </div>
                ) : (
                  <span>{task.title}</span>
                )}

                {editTaskId !== task.id && (
                  <div className="buttons">
                    <button onClick={() => beginEdit(task)}>Edit</button>
                    <button onClick={() => removeTask(task.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="task-count">
          {tasks.filter((t) => !t.completed).length} pending
        </p>

      </div>
    </div>
  );
}

export default App;