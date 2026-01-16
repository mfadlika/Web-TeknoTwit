import React, { useState, FormEvent, ChangeEvent } from "react";
import "./LoginPage.css";

interface LoginResponse {
  userId?: number;
  token?: string;
  message?: string;
  error?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const EMAIL_DOMAIN = "@teknokrat.ac.id";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const localPart = String(username).trim().split("@")[0];
      const loginEmail = `${localPart}${EMAIL_DOMAIN}`;

      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password }),
      });

      const data: LoginResponse = await res.json();
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
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Sign in to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-field">
          <label className="login-label">Username</label>
          <div className="login-input-row">
            <input
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className="login-input"
              placeholder="Enter your username"
            />
            <div className="login-domain">{EMAIL_DOMAIN}</div>
          </div>
        </div>

        <div className="login-field">
          <label className="login-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="login-input"
            placeholder="Enter your password"
          />
        </div>

        <button type="submit" disabled={isLoading} className="login-button">
          {isLoading ? "Signing in..." : "Sign In"}
        </button>

        <div className="login-header">
          <button
            type="button"
            className="login-link-button"
            onClick={() => alert("Forgot Password flow coming soon")}
          >
            Forgot Password?
          </button>
        </div>
      </form>

      {error && <div className="login-feedback login-error">{error}</div>}
      {success && <div className="login-feedback login-success">{success}</div>}

      <div className="login-footer">
        <span>Don't have an account?</span>
        <a href="/signup" className="login-signup-link">
          Sign Up
        </a>
      </div>
    </div>
  );
}
