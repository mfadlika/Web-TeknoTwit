import { useEffect, useState } from "react";
import axios, { type AxiosRequestConfig } from "axios";
import { PostCard } from "../components/PostCard";
import { PostComposer } from "../components/PostComposer";
import { FeedTabs } from "../components/FeedTabs";
import type { FeedTab, Post } from "../types/post";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3000/api";

const mapApiPost = (p: any): Post => ({
  id: p.id ?? `post_${Math.random()}`,
  author: {
    name: p.userName || p.author?.name || p.user?.name || `User ${p.userId ?? ""}`,
    id: p.author?.id ?? p.user?.id ?? p.userId ?? null,
  },
  user: p.user ?? null,
  userId: p.user?.id ?? p.userId ?? null,
  content: p.content,
  createdAt: p.createdAt || p.created_at || new Date().toISOString(),
  likes: typeof p.likes === "number" ? p.likes : 0,
});

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [posting, setPosting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<FeedTab>("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const fetchPosts = async () => {
      try {
        let url = `${API_BASE}/post`;
        const config: AxiosRequestConfig = {};

        if (tab === "following" && token) {
          url = `${API_BASE}/post/following/feed`;
          config.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await axios.get(url, config);
        if (!mounted) return;
        const apiPosts: Post[] = (res.data || []).map(mapApiPost);
        setPosts(apiPosts.length ? apiPosts.reverse() : []);
      } catch (err) {
        if (!mounted) return;
        setError(
          tab === "following"
            ? "Gagal memuat posts dari following"
            : "Gagal memuat posts"
        );
        if (axios.isAxiosError(err)) {
          console.warn("Failed to load posts:", err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPosts();
    return () => {
      mounted = false;
    };
  }, [tab, token]);

  const handleCreatePost = async () => {
    const content = newContent.trim();
    if (!content) return;
    setPosting(true);
    setError(null);

    try {
      const activeToken = localStorage.getItem("token");
      if (!activeToken) {
        setError("Please login to create a post.");
        setPosting(false);
        return;
      }

      const title = content.split("\n")[0].slice(0, 60) || "Post";
      const body = { title, content };
      const res = await axios.post(`${API_BASE}/post`, body, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });

      const created = res.data?.post ?? null;
      if (created) {
        const mapped = mapApiPost(created);
        setPosts((prev) => [mapped, ...prev]);
      } else {
        const userId = Number(localStorage.getItem("userId")) || null;
        const optimistic: Post = {
          id: `local_${Date.now()}`,
          author: { name: "You", id: userId },
          user: null,
          userId,
          content,
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        setPosts((prev) => [optimistic, ...prev]);
      }
      setNewContent("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Token invalid or expired. Please login again.");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("app:auth-changed"));
      } else {
        setError("Failed to create post. Try again.");
      }
    } finally {
      setPosting(false);
    }
  };

  const handleToggleLike = async (post: Post) => {
    try {
      const activeToken = localStorage.getItem("token");
      if (!activeToken) {
        setError("Please login to like posts.");
        return;
      }

      const likeUrl = `${API_BASE}/post/${post.id}/like`;
      const res = await axios.post(likeUrl, null, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const newLikes =
        res.data && typeof res.data.likes === "number"
          ? res.data.likes
          : post.likes + 1;
      setPosts((prev) =>
        prev.map((x) => (x.id === post.id ? { ...x, likes: newLikes } : x))
      );
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        try {
          const activeToken = localStorage.getItem("token");
          if (!activeToken) return;
          const unlikeUrl = `${API_BASE}/post/${post.id}/like`;
          const res = await axios.delete(unlikeUrl, {
            headers: { Authorization: `Bearer ${activeToken}` },
          });
          const newLikes =
            res.data && typeof res.data.likes === "number"
              ? res.data.likes
              : Math.max(0, post.likes - 1);
          setPosts((prev) =>
            prev.map((x) => (x.id === post.id ? { ...x, likes: newLikes } : x))
          );
        } catch (e2) {
          console.error("Unlike failed", e2);
        }
      } else if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Token invalid or expired. Please login again.");
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("app:auth-changed"));
      } else {
        console.error("Like failed", err);
      }
    }
  };

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
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
            }}
          >
            Home
          </h1>
          <p style={{ margin: "6px 0 0 0", color: "#666", fontSize: 14 }}>
            Share your thoughts with the community
          </p>
        </div>

        {token && <FeedTabs tab={tab} onChange={setTab} />}

        {loading && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              background: "#f0f8ff",
              color: "#1976d2",
              fontSize: 14,
            }}
          >
            ⏳ Loading posts...
          </div>
        )}
        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: 12,
              borderRadius: 8,
              background: "#ffebee",
              color: "#c62828",
              fontSize: 14,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <PostComposer
          value={newContent}
          posting={posting}
          onChange={setNewContent}
          onSubmit={handleCreatePost}
        />

        <div style={{ display: "grid", gap: 14 }}>
          {posts.length === 0 && !loading ? (
            <div
              style={{
                padding: 32,
                textAlign: "center",
                color: "#999",
                fontSize: 14,
              }}
            >
              No posts yet. Be the first to share! 🚀
            </div>
          ) : (
            posts.map((p) => (
              <PostCard key={p.id} post={p} onToggleLike={handleToggleLike} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
