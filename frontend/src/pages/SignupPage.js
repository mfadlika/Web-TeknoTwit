import React, { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("Name, email, and password are required");
      return;
    }

    // Client-side domain validation for better UX
    const allowedDomain = "@teknokrat.ac.id";
    if (!String(email).toLowerCase().endsWith(allowedDomain)) {
      setError(`Hanya email ${allowedDomain} yang dapat mendaftar`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || data.error || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess("Akun berhasil dibuat. Silakan masuk.");
      // optionally redirect to login
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "48px auto", padding: 20 }}>
      <h2>Daftar</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: 8 }}
            placeholder="Nama lengkap"
          />
        </div>

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
            placeholder="Max 20 characters"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "8px 12px" }}
        >
          {loading ? "Mendaftarkan..." : "Daftar"}
        </button>
      </form>

      {error && <div style={{ marginTop: 12, color: "#b00020" }}>{error}</div>}
      {success && (
        <div style={{ marginTop: 12, color: "#007700" }}>{success}</div>
      )}
    </div>
  );
}
