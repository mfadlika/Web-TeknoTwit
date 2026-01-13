import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../types/post";

export interface PostCardProps {
  post: Post;
  onToggleLike: (post: Post) => void | Promise<void>;
}

export function PostCard({ post, onToggleLike }: PostCardProps) {
  const userId =
    (post.user as { id?: string | number | null } | null)?.id ||
    post.userId ||
    (post as { author?: { id?: string | number | null } }).author?.id ||
    null;

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
        e.currentTarget.style.borderColor = "#e8e8e8";
      }}
      onMouseLeave={(e: MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "#f0f0f0";
      }}
    >
      <div style={{ display: "flex", gap: 14 }}>
        <div
          style={{
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
          }}
        >
          {post.author?.name?.charAt(0) || "U"}
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
              <Link
                to={`/user/${userId ?? ""}`}
                style={{ color: "#1a1a1a", textDecoration: "none" }}
              >
                {post.author?.name || "User"}
              </Link>
            </div>
            <div style={{ color: "#999", fontSize: 13, marginLeft: "auto" }}>
              {new Date(post.createdAt).toLocaleString()}
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
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <button
              onClick={() => onToggleLike(post)}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #e0e0e0",
                background: "#fafafa",
                color: "#333",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = "#f0f0f0";
                e.currentTarget.style.borderColor = "#d0d0d0";
              }}
              onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
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
