import { useState } from "react";
import "../UI CSS/Gpt.css";

function Reset({ user, setUser }) {
  const [Newname, setNewName] = useState("");
  const [Newemail, setNewEmail] = useState("");
  const [Newpassword, setNewPassword] = useState("");
  const userId = user?._id || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const status = await fetch(`http://localhost:3000/auth/reset/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ Newname, Newemail, Newpassword }),
      });

      if (!status.ok) {
        const errorData = await status.json();
        alert(errorData.message || "Account details reset failed");
        throw new Error(errorData.message || "Account details reset failed");
      }

      const data = await status.json();
      console.log("Details reset successfully:", data);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      alert("New Account Details Set Successfully");
    } catch (err) {
      console.error("Error during account reset:", err);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-form-container">
        <h2 className="auth-title">🔄 Reset Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="New Name"
            required
            value={Newname}
            onChange={(e) => setNewName(e.target.value)}
            className="auth-input"
          />
          <input
            type="email"
            placeholder="New Email"
            required
            value={Newemail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="auth-input"
          />
          <input
            type="password"
            placeholder="New Password"
            required
            value={Newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="auth-input"
          />
          <button type="submit" className="btn reset-btn">
            <i className="fas fa-sync-alt"></i> Reset Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Reset;
