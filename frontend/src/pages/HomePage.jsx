import React, { useEffect, useState } from "react";

function generateMockPosts(count = 6) {
  const authors = [
    { name: "Ayu Santoso", handle: "ayu" },
    { name: "Rizal H", handle: "rizal" },
    { name: "Maya", handle: "maya_dev" },
    { name: "Budi", handle: "budi" },
  ];

  const contents = [
    "Hai dunia! Ini postingan pertama saya.",
    "Belajar React itu menyenangkan.",
    "Cuaca hari ini cerah, semoga produktif!",
    "Baru saja menyelesaikan tantangan coding.",
    "Ini contoh konten post yang di-generate lokal.",
  ];

  const now = Date.now();

  return Array.from({ length: count }).map((_, i) => ({
    id: `post_${i + 1}`,
    author: authors[i % authors.length],
    content: contents[i % contents.length],
    createdAt: new Date(now - i * 1000 * 60 * 60).toISOString(),
    likes: Math.floor(Math.random() * 120),
  }));
}

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
        <div style={avatarStyle}>{post.author.name.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontWeight: 700 }}>{post.author.name}</div>
            <div style={{ color: "#666", fontSize: 13 }}>
              @{post.author.handle}
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

  useEffect(() => {
    const data = generateMockPosts(8);
    setPosts(data);
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
              onClick={() => {
                const content = newContent.trim();
                if (!content) return;
                const newPost = {
                  id: `local_${Date.now()}`,
                  author: { name: "Kamu", handle: "you" },
                  content,
                  createdAt: new Date().toISOString(),
                  likes: 0,
                };
                setPosts((prev) => [newPost, ...prev]);
                setNewContent("");
              }}
              disabled={!newContent.trim()}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "none",
                background: "#1976d2",
                color: "#fff",
                cursor: newContent.trim() ? "pointer" : "not-allowed",
                fontWeight: 700,
              }}
            >
              Post
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
