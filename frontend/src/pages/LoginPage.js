import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Gagal login");
        setLoading(false);
        return;
      }

      setSuccess("Login berhasil");
      // store user id and token for later use
      if (data.userId) localStorage.setItem("userId", data.userId);
      if (data.token) {
        localStorage.setItem("token", data.token);
        // notify app about auth change
        window.dispatchEvent(new Event("app:auth-changed"));
      }

      // small delay so user sees success message
      setTimeout(() => {
        window.location.href = "/";
      }, 600);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "48px auto", padding: 20 }}>
      <h2>Masuk</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 12px" }}
        >
          {loading ? "Loading..." : "Masuk"}
        </button>
      </form>

      {error && <div style={{ marginTop: 12, color: "#b00020" }}>{error}</div>}
      {success && (
        <div style={{ marginTop: 12, color: "#007700" }}>{success}</div>
      )}
    </div>
  );
}
