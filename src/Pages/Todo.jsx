import React, { useState, useEffect } from "react";
import "../UI CSS/Gpt.css";
import { useNavigate } from "react-router-dom";

function Todo({ user }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/TodoNames/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 500) {
          window.location.href = "/";
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("Unexpected response:", data);
          setTasks([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setTasks([]);
      });
  }, [user?.token]);

  const handleAddTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch("http://localhost:3000/TodoNames/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Title: title, Description: description }),
      });

      const data = await res.json();
      setTasks([...tasks, data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/TodoNames/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setTasks(tasks.filter((task) => task._id !== id));
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/TodoNames/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Title: editTitle, Description: editDescription }),
      });

      const updated = await res.json();
      setTasks(tasks.map((task) => (task._id === id ? updated : task)));
      setEditId(null);
      setEditTitle("");
      setEditDescription("");
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  const toggleCompleted = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/TodoNames/${id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ Completed: !currentStatus }),
      });

      const updated = await res.json();
      setTasks(tasks.map((task) => (task._id === id ? updated : task)));
    } catch (err) {
      console.error("Error toggling completion:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/Auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("user");
        alert(data.message || "Logged out successfully");
        window.location.href = "/";
      } else {
        alert(data.error || "Logout failed");
      }
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  const handleReset = () => {
    navigate("/reset", { replace: true });
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.Completed;
    if (filter === "Pending") return !task.Completed;
    return true;
  });

  // Only modified return block is shown for brevity
  return (
    <div className="todo-wrapper">
      <div className="todo container section">
        <h1 className="todo__title">📝 Task Manager</h1>

        <div className="todo__inputs">
          <input
            type="text"
            className="todo__input"
            placeholder="Enter title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="todo__input"
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="btn add-btn" onClick={handleAddTask}>
            <i className="fas fa-plus"></i> Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="todo__filters">
          {["All", "Completed", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`btn filter-btn ${filter === status ? "active" : ""}`}
            >
              <i className="fas fa-filter"></i> {status}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="todo__list">
          {filteredTasks.map((task) => (
            <li className={`todo__item ${task.Completed ? "completed" : "pending"}`} key={task._id}>
              {editId === task._id ? (
                <div className="todo__edit-form">
                  <input
                    type="text"
                    className="todo__edit-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    type="text"
                    className="todo__edit-input"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <button className="btn save-btn" onClick={() => handleEdit(task._id)}>
                    <i className="fas fa-save"></i> Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="todo__details">
                    <h3 className="todo__subtitle">{task.Title}</h3>
                    <p className="todo__description">{task.Description}</p>
                  </div>
                  <div className="todo__controls">
                    <div className="todo__checkbox">
                      <input
                        type="checkbox"
                        id={`status-${task._id}`}
                        checked={task.Completed}
                        onChange={() => toggleCompleted(task._id, task.Completed)}
                      />
                      <label htmlFor={`status-${task._id}`}>
                        {task.Completed ? "✅ Completed" : "🕒 Pending"}
                      </label>
                    </div>
                    <div className="todo__actions">
                      <button
                        className="btn edit-btn"
                        onClick={() => {
                          setEditId(task._id);
                          setEditTitle(task.Title);
                          setEditDescription(task.Description);
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                      <button className="btn delete-btn" onClick={() => handleDelete(task._id)}>
                        <i className="fas fa-trash-alt"></i> Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Footer Buttons */}
        <div className="todo__footer">
          <button className="btn logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Log Out
          </button>

          <button className="btn reset-btn" onClick={handleReset}>
            <i className="fas fa-undo"></i> Reset Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Todo;
