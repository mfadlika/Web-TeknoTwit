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
    <nav style={{ padding: 12 }}>
      <Link to="/" style={{ marginRight: 12 }}>
        Home
      </Link>
      {token ? (
        <button
          onClick={handleLogout}
          style={{ marginLeft: 8, padding: "6px 10px", borderRadius: 6 }}
        >
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 12 }}>
            Login
          </Link>
          <Link to="/signup">Daftar</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
