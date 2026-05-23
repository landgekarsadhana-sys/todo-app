import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);

  const API = "http://localhost:5000/api/tasks";

  const fetchTasks = async () => {
    const res = await axios.get(API);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addOrUpdateTask = async () => {
    if (!title) return;

    if (editId) {
      // UPDATE
      await axios.put(`${API}/${editId}`, { title });
      setEditId(null);
    } else {
      // CREATE
      await axios.post(API, { title });
    }

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`${API}/${task._id}`, {
      completed: !task.completed
    });
    fetchTasks();
  };

  const editTask = (task) => {
    setTitle(task.title);
    setEditId(task._id);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>TODO APP</h1>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
        />
        <button style={styles.addBtn} onClick={addOrUpdateTask}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      <ul style={styles.list}>
        {tasks.map((task) => (
          <li style={styles.listItem} key={task._id}>
            <span
              onClick={() => toggleTask(task)}
              style={{
                ...styles.taskText,
                textDecoration: task.completed ? "line-through" : "none"
              }}
            >
              {task.title}
            </span>

            <div>
              <button
                style={styles.editBtn}
                onClick={() => editTask(task)}
              >
                Edit
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    textAlign: "center",
    fontFamily: "Arial"
  },
  heading: {
    marginBottom: "20px"
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    flex: 1,
    padding: "10px"
  },
  addBtn: {
    padding: "10px 20px",
    cursor: "pointer"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    border: "1px solid #ddd",
    marginBottom: "10px"
  },
  taskText: {
    cursor: "pointer"
  },
  editBtn: {
    marginRight: "10px",
    padding: "5px 10px",
    cursor: "pointer"
  },
  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer"
  }
};

export default App;