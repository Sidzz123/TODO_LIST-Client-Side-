import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UI CSS/Gpt.css";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // <-- Add this

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const status = await fetch("http://localhost:3000/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!status.ok) {
        const errorData = await status.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await status.json();
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      console.error("Error during login:", err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <h2 className="auth-title">🔐 Login</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
          <button type="submit" className="btn login-btn">
            <i className="fas fa-sign-in-alt"></i> Login
          </button>
        </form>

        <button
          className="btn signup-btn"
          onClick={() => navigate("/SignUp")}
          style={{ marginTop: "1rem" }}
        >
          <i className="fas fa-user-plus"></i> Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;
