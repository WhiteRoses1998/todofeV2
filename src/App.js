import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TaskList from "./components/TaskList";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <nav>
          <Link to="/login">Login</Link> |{" "}
          <Link to="/register">Register</Link> |{" "}
          <Link to="/tasks">Tasks</Link>
        </nav>
        <Routes>
          <Route path="/login" element={<Login setUserId={setUserId} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={userId ? <TaskList userId={userId} /> : <p>Please login first</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
