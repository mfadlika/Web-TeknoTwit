import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

  const userId =
    post.user?.id ||
    post.userId ||
    post.author?.id ||
    post.author?.userId ||
    null;

  return (
    <div style={cardStyle}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={avatarStyle}>
          {(post.author && post.author.name && post.author.name.charAt(0)) ||
            "U"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>
              {userId ? (
                <Link
                  to={`/user/${userId}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {post.author.name}
                </Link>
              ) : (
                post.author.name
              )}
            </div>
            <div style={{ color: "#999", fontSize: 12 }}>
              • {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
          <div style={{ marginTop: 8, color: "#111" }}>{post.content}</div>
          <div style={{ marginTop: 10, color: "#555", fontSize: 13 }}>
            {post.likes} likes
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE =
    process.env.REACT_APP_API_BASE || "http://localhost:3000/api";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get(`${API_BASE}/post`)
      .then((res) => {
        if (!mounted) return;
        const apiPosts = (res.data || []).map((p) => ({
          id: p.id || `post_${Math.random()}`,
          author: {
            name: p.userName || (p.user && p.user.name) || `User ${p.userId}`,
          },
          content: p.content,
          createdAt: p.createdAt || p.created_at || new Date().toISOString(),
          likes: p.likes || 0,
        }));
        if (apiPosts.length) setPosts(apiPosts.reverse());
      })
      .catch((err) => {
        console.warn(
          "Failed to load posts from API, using mock posts",
          err.message
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "28px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 14 }}>Beranda</h1>

      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Apa yang terjadi?"
            rows={3}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ddd",
              resize: "vertical",
              fontSize: 14,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={async () => {
                const content = newContent.trim();
                if (!content) return;
                setPosting(true);
                setError(null);
                try {
                  const title = content.split("\n")[0].slice(0, 60) || "Post";
                  const body = { title, content };
                  const token = localStorage.getItem("token");
                  if (!token) {
                    setError("Silakan login untuk membuat post.");
                    setPosting(false);
                    return;
                  }
                  const res = await axios.post(`${API_BASE}/post`, body, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  // API returns { message, post }
                  const created =
                    res.data && res.data.post ? res.data.post : null;
                  if (created) {
                    const mapped = {
                      id: created.id || `local_${Date.now()}`,
                      author: {
                        name:
                          created.userName ||
                          (created.user && created.user.name) ||
                          `User ${created.userId}`,
                      },
                      content: created.content,
                      createdAt: created.createdAt || new Date().toISOString(),
                      likes: created.likes || 0,
                    };
                    setPosts((prev) => [mapped, ...prev]);
                  } else {
                    // fallback optimistic insert
                    const newPost = {
                      id: `local_${Date.now()}`,
                      author: { name: "Kamu" },
                      content,
                      createdAt: new Date().toISOString(),
                      likes: 0,
                    };
                    setPosts((prev) => [newPost, ...prev]);
                  }
                  setNewContent("");
                } catch (err) {
                  console.error("Post failed", err);
                  if (err.response && err.response.status === 401) {
                    setError(
                      "Token tidak valid atau kadaluarsa. Silakan login ulang."
                    );
                    // remove invalid token
                    localStorage.removeItem("token");
                    window.dispatchEvent(new Event("app:auth-changed"));
                  } else {
                    setError("Gagal membuat post. Coba lagi.");
                  }
                } finally {
                  setPosting(false);
                }
              }}
              disabled={!newContent.trim() || posting}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: posting ? "#9bbce8" : "#1976d2",
                color: "#fff",
                cursor:
                  newContent.trim() && !posting ? "pointer" : "not-allowed",
                fontWeight: 700,
              }}
            >
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
}
