import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function PostCard({ post }) {
  const cardStyle = {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #e6e6e6",
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  };

  const avatarStyle = {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#1976d2",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  };

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={avatarStyle}>
          {(post.user && post.user.name && post.user.name.charAt(0)) || "U"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>
              {post.user?.name || "Unknown"}
            </div>
            <div style={{ color: "#999", fontSize: 12 }}>
              • {new Date(post.createdAt || post.created_at).toLocaleString()}
            </div>
          </div>
          <div style={{ marginTop: 8 }}>{post.content}</div>
          <div style={{ marginTop: 10, color: "#555", fontSize: 13 }}>
            {post.likes || 0} likes
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserPage() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
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
        const res = await axios.get(`${API_BASE}/post/user/${id}`);
        if (!mounted) return;
        setPosts(res.data || []);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Gagal memuat post user.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [id]);

  return (
    <div style={{ maxWidth: 800, margin: "28px auto", padding: "0 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <h2>Postingan User</h2>
        <Link to="/">Kembali</Link>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#b00020" }}>{error}</div>}

      {!loading && !error && posts.length === 0 && (
        <div>Belum ada postingan.</div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
