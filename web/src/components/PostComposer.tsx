import { ChangeEvent, MouseEvent } from "react";

export interface PostComposerProps {
  value: string;
  posting: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
}

export function PostComposer({
  value,
  posting,
  onChange,
  onSubmit,
}: PostComposerProps) {
  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0 && !posting;

  return (
    <div
      style={{
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        background: "#fff",
        border: "1px solid #f0f0f0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <textarea
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
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
        onClick={onSubmit}
        disabled={!canSubmit}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          border: "none",
          background: canSubmit ? "#667eea" : "#ccc",
          color: "#fff",
          cursor: canSubmit ? "pointer" : "not-allowed",
          fontWeight: 600,
          fontSize: 14,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          if (canSubmit) {
            e.currentTarget.style.background = "#5568d3";
          }
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          if (canSubmit) {
            e.currentTarget.style.background = "#667eea";
          }
        }}
      >
        {posting ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
