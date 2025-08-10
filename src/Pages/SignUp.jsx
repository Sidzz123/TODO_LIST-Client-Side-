import React, { useState } from "react";
import "../UI CSS/Gpt.css";

function Signup({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const status = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!status.ok) {
        const errorData = await status.json();
        alert(errorData.message || "SignUp failed");
        throw new Error(errorData.message || "SignUp failed");
      }

      const data = await status.json();
      console.log("Sign Up Successful:", data);
      setUser(data.user);
      alert("Sign Up Successful! You can now log in.");
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <h2 className="auth-title">✍️ Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
          />
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
          <button type="submit" className="btn signup-btn">
            <i className="fas fa-user-plus"></i> Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
