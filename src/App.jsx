import React, { useState } from "react";
import Todo from "./Pages/Todo";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import Reset from "./Pages/Reset";

function App() {
  const [user, setUser] = useState(() => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") return null;
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Failed to parse user from localStorage:", error);
    return null;
  }
});

  const ProtectedRoute = ({ user, children }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  const PublicRoute = ({ user, children }) => {
    return user ? <Navigate to="/app" replace /> : children;
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          exact
          element={
            <PublicRoute user={user}>
              <Login setUser={setUser} />
            </PublicRoute>
          }
        />
        <Route
          path="/SignUp"
          element={
            <PublicRoute user={user}>
              <SignUp setUser={setUser} />
            </PublicRoute>
          }
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute user={user}>
              <Todo user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset"
          element={
            <ProtectedRoute user={user}>
              <Reset user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;