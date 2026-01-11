import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";

function NavBar() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handler = () => setToken(localStorage.getItem("token"));
    window.addEventListener("app:auth-changed", handler);
    return () => window.removeEventListener("app:auth-changed", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("app:auth-changed"));
    navigate("/login");
  };

  return (
    <nav
      style={{
        padding: "14px 20px",
        background: "#fff",
        borderBottom: "1px solid #f0f0f0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#667eea",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          TeknoTwit
        </Link>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {token ? (
            <>
              <Link
                to="/"
                style={{
                  color: "#333",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "6px 12px",
                  borderRadius: 6,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: "1px solid #667eea",
                  background: "transparent",
                  color: "#667eea",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#667eea";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#667eea";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: "#333",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "6px 12px",
                  borderRadius: 6,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f0f0f0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Login
              </Link>
              <Link
                to="/signup"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "8px 14px",
                  borderRadius: 6,
                  background: "#667eea",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#5568d3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#667eea";
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
