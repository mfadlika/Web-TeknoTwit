import React, { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const EMAIL_DOMAIN = "@teknokrat.ac.id";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const normalizedUsername = String(username).trim();

      // Keep backend compatibility: login expects username, not email
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalizedUsername, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Login failed");
        setIsLoading(false);
        return;
      }

      setSuccess("Login successful");
      if (data.userId) localStorage.setItem("userId", String(data.userId));
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("app:auth-changed"));
      }

      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "48px auto", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h2 style={{ margin: 0 }}>Welcome Back</h2>
        <p style={{ marginTop: 8, opacity: 0.7 }}>Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontWeight: 600 }}>Username</label>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                flex: 1,
                height: 48,
                padding: "0 12px",
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                background: "#f5f5f5",
              }}
              placeholder="Enter your username"
              autoCapitalize="none"
              autoCorrect="off"
            />
            <div
              style={{
                height: 48,
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                border: "1px solid #e0e0e0",
                borderRadius: 12,
                background: "#f5f5f5",
                marginLeft: 8,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontWeight: 600 }}>{EMAIL_DOMAIN}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <label style={{ fontWeight: 600 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              height: 48,
              padding: "0 12px",
              border: "1px solid #e0e0e0",
              borderRadius: 12,
              background: "#f5f5f5",
            }}
            placeholder="Enter your password"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            height: 48,
            borderRadius: 12,
            border: "none",
            background: "#61dafb",
            color: "#030000ff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <div style={{ textAlign: "center" }}>
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              color: "#61dafb",
              fontWeight: 500,
              cursor: "pointer",
            }}
            onClick={() => alert("Forgot Password flow coming soon")}
          >
            Forgot Password?
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginTop: 12, color: "#b00020", textAlign: "center" }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginTop: 12, color: "#007700", textAlign: "center" }}>
          {success}
        </div>
      )}

      <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
        <span>Don9t have an account?&nbsp;</span>
        <a href="/signup" style={{ color: "#61dafb", fontWeight: 600 }}>
          Sign Up
        </a>
      </div>
    </div>
  );
}
