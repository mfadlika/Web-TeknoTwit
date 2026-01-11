import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function PostCard({ post, onToggleLike }) {
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

  const likeButtonStyle = {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #e0e0e0",
    background: "#fafafa",
    color: "#333",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    transition: "all 0.2s",
  };

  const userId =
    post.user?.id ||
    post.userId ||
    post.author?.id ||
    post.author?.userId ||
    null;

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
          {(post.author && post.author.name && post.author.name.charAt(0)) ||
            "U"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>
              <Link
                to={`/user/${userId}`}
                style={{ color: "#1a1a1a", textDecoration: "none" }}
              >
                {post.author.name}
              </Link>
            </div>
            <div style={{ color: "#999", fontSize: 13, marginLeft: "auto" }}>
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
          <div style={{ marginTop: 10, color: "#333", lineHeight: 1.5, fontSize: 14 }}>
            {post.content}
          </div>
          <div
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={() => onToggleLike(post)}
              style={likeButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f0f0f0";
                e.currentTarget.style.borderColor = "#d0d0d0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fafafa";
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              ❤️ Like
            </button>
            <span style={{ color: "#666", fontSize: 13, fontWeight: 500 }}>
              {post.likes} {post.likes === 1 ? "like" : "likes"}
            </span>
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
            id: (p.user && p.user.id) || p.userId || null,
          },
          user: p.user || null,
          userId: (p.user && p.user.id) || p.userId || null,
          content: p.content,
          createdAt: p.createdAt || p.created_at || new Date().toISOString(),
          likes: p.likes || 0,
        }));
        if (apiPosts.length) setPosts(apiPosts.reverse());
      })
      .catch((err) => {
        setError("Gagal memuat posts");
        console.warn(
          "Failed to load posts from API, using mock posts",
          err.message
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh", paddingTop: 20, paddingBottom: 40 }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ 
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            color: "#1a1a1a",
            letterSpacing: "-0.5px"
          }}>
            Home
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "#666", fontSize: 14 }}>
            Share your thoughts with the community
          </p>
        </div>

        {loading && (
          <div style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
            background: "#f0f8ff",
            color: "#1976d2",
            fontSize: 14,
          }}>
            ⏳ Loading posts...
          </div>
        )}
        {error && (
          <div style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
            background: "#ffebee",
            color: "#c62828",
            fontSize: 14,
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
          background: "#fff",
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              border: "1px solid #e0e0e0",
              resize: "none",
              fontSize: 14,
              fontFamily: "inherit",
              marginBottom: 12,
              width: "100%",
              boxSizing: "border-box",
            }}
          />
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
                  setError("Please login to create a post.");
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
                      id:
                        (created.user && created.user.id) ||
                        created.userId ||
                        null,
                    },
                    user: created.user || null,
                    userId:
                      (created.user && created.user.id) ||
                      created.userId ||
                      null,
                    content: created.content,
                    createdAt: created.createdAt || new Date().toISOString(),
                    likes: created.likes || 0,
                  };
                  setPosts((prev) => [mapped, ...prev]);
                } else {
                  // fallback optimistic insert
                  const newPost = {
                    id: `local_${Date.now()}`,
                    author: {
                      name: "You",
                      id: Number(localStorage.getItem("userId")) || null,
                    },
                    user: null,
                    userId: Number(localStorage.getItem("userId")) || null,
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
                  setError("Token invalid or expired. Please login again.");
                  // remove invalid token
                  localStorage.removeItem("token");
                  window.dispatchEvent(new Event("app:auth-changed"));
                } else {
                  setError("Failed to create post. Try again.");
                }
              } finally {
                setPosting(false);
              }
            }}
            disabled={!newContent.trim() || posting}
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "none",
              background: newContent.trim() && !posting ? "#667eea" : "#ccc",
              color: "#fff",
              cursor:
                newContent.trim() && !posting ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: 14,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (newContent.trim() && !posting) {
                e.currentTarget.style.background = "#5568d3";
              }
            }}
            onMouseLeave={(e) => {
              if (newContent.trim() && !posting) {
                e.currentTarget.style.background = "#667eea";
              }
            }}
          >
            {posting ? "Posting..." : "Post"}
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {posts.length === 0 && !loading ? (
            <div style={{
              padding: 32,
              textAlign: "center",
              color: "#999",
              fontSize: 14,
            }}>
              No posts yet. Be the first to share! 🚀
            </div>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onToggleLike={async (post) => {
                  try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      setError("Please login to like posts.");
                      return;
                    }
                    const likeUrl = `${API_BASE}/post/${post.id}/like`;
                    // Try to like
                    const res = await axios.post(likeUrl, null, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    const newLikes =
                      res.data && typeof res.data.likes === "number"
                        ? res.data.likes
                        : post.likes + 1;
                    setPosts((prev) =>
                      prev.map((x) =>
                        x.id === post.id ? { ...x, likes: newLikes } : x
                      )
                    );
                  } catch (err) {
                    if (err.response && err.response.status === 409) {
                      // already liked, toggle to unlike
                      try {
                        const token = localStorage.getItem("token");
                        const unlikeUrl = `${API_BASE}/post/${post.id}/like`;
                        const res = await axios.delete(unlikeUrl, {
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        const newLikes =
                          res.data && typeof res.data.likes === "number"
                            ? res.data.likes
                            : Math.max(0, post.likes - 1);
                        setPosts((prev) =>
                          prev.map((x) =>
                            x.id === post.id ? { ...x, likes: newLikes } : x
                          )
                        );
                      } catch (e2) {
                        console.error("Unlike failed", e2);
                      }
                    } else if (err.response && err.response.status === 401) {
                      setError("Token invalid or expired. Please login again.");
                      localStorage.removeItem("token");
                      window.dispatchEvent(new Event("app:auth-changed"));
                    } else {
                      console.error("Like failed", err);
                    }
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
