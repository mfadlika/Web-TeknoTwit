import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function PostCard({ post }) {
  const cardStyle = {
    padding: 16,
    borderRadius: 12,
    border: "1px solid #f0f0f0",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "box-shadow 0.2s, border-color 0.2s",
  };

  const avatarStyle = {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 18,
    flexShrink: 0,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = "#e8e8e8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#f0f0f0";
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <div style={avatarStyle}>
          {(post.user && post.user.name && post.user.name.charAt(0)) || "U"}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              {post.user?.name || "Unknown"}
            </div>
            <div style={{ color: "#999", fontSize: 13, marginLeft: "auto" }}>
              {new Date(post.createdAt || post.created_at).toLocaleString()}
            </div>
          </div>
          <div
            style={{
              marginTop: 10,
              color: "#333",
              lineHeight: 1.5,
              fontSize: 14,
            }}
          >
            {post.content}
          </div>
          <div
            style={{
              marginTop: 10,
              color: "#666",
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {post.likes || 0} {post.likes === 1 ? "like" : "likes"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    process.env.REACT_APP_API_BASE || "http://localhost:3000/api";

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [userRes, postsRes] = await Promise.all([
          axios.get(`${API_BASE}/user/${id}`),
          axios.get(`${API_BASE}/post/user/${id}`),
        ]);

        if (!mounted) return;
        setUser(userRes.data || null);
        setPosts(postsRes.data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load user profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [id, API_BASE]);

  return (
    <div
      style={{
        background: "#fafafa",
        minHeight: "100vh",
        paddingTop: 20,
        paddingBottom: 40,
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
        <Link
          to="/"
          style={{
            color: "#667eea",
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 20,
            display: "inline-block",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          ← Back to Home
        </Link>

        {loading && (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              color: "#1976d2",
              fontSize: 14,
            }}
          >
            ⏳ Loading profile...
          </div>
        )}
        {error && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              background: "#ffebee",
              color: "#c62828",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {user && (
          <div
            style={{
              padding: 24,
              borderRadius: 12,
              background: "#fff",
              border: "1px solid #f0f0f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    marginBottom: 6,
                  }}
                >
                  {user.name}
                </div>
                <div style={{ color: "#666", fontSize: 14, marginBottom: 12 }}>
                  {user.email}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    paddingTop: 12,
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#667eea",
                      }}
                    >
                      {posts.length}
                    </div>
                    <div style={{ fontSize: 13, color: "#666" }}>
                      {posts.length === 1 ? "Post" : "Posts"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: 20,
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            Posts
          </h2>
        </div>

        {!loading && !error && posts.length === 0 && (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              color: "#999",
              fontSize: 14,
            }}
          >
            No posts yet 📝
          </div>
        )}

        <div style={{ display: "grid", gap: 14 }}>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
