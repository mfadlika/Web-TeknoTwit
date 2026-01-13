import React, { useState } from "react";
import "./SignupPage.css";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const EMAIL_DOMAIN = "@teknokrat.ac.id";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernamePattern.test(String(username).trim())) {
      setError(
        "Username must be 3-20 characters and contain only letters, numbers, or underscore"
      );
      return;
    }

    setIsLoading(true);
    try {
      const localPart = String(username).trim().split("@")[0];
      const signupEmail = `${localPart}${EMAIL_DOMAIN}`;

      const res = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: username,
          username: localPart,
          email: signupEmail,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Signup failed");
        setIsLoading(false);
        return;
      }

      setSuccess("Account created. Please sign in.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <h2 className="signup-title">Create Account</h2>
        <p className="signup-subtitle">Sign up to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="signup-field">
          <label className="signup-label">Username</label>
          <div className="signup-input-row">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="signup-input"
              placeholder="Choose a username"
            />
            <div className="signup-domain">{EMAIL_DOMAIN}</div>
          </div>
        </div>

        <div className="signup-field">
          <label className="signup-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            placeholder="Create a password"
          />
        </div>

        <div className="signup-field">
          <label className="signup-label">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="signup-input"
            placeholder="Re-enter your password"
          />
        </div>

        <button type="submit" disabled={isLoading} className="signup-button">
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {error && <div className="signup-feedback signup-error">{error}</div>}
      {success && (
        <div className="signup-feedback signup-success">{success}</div>
      )}

      <div className="signup-footer">
        <span>Already have an account?</span>
        <a href="/login" className="signup-login-link">
          Sign In
        </a>
      </div>
    </div>
  );
}
