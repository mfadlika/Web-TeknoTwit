import { MouseEvent } from "react";
import type { FeedTab } from "../types/post";

export interface FeedTabsProps {
  tab: FeedTab;
  onChange: (tab: FeedTab) => void;
}

export function FeedTabs({ tab, onChange }: FeedTabsProps) {
  const baseStyle = {
    padding: "8px 16px",
    border: "none",
    background: "transparent",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  } as const;

  const renderButton = (value: FeedTab, label: string) => {
    const active = tab === value;
    return (
      <button
        key={value}
        onClick={() => onChange(value)}
        style={{
          ...baseStyle,
          color: active ? "#667eea" : "#999",
          borderBottom: active ? "2px solid #667eea" : "none",
        }}
        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
          if (!active) e.currentTarget.style.color = "#666";
        }}
        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
          if (!active) e.currentTarget.style.color = "#999";
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        marginBottom: 24,
        borderBottom: "1px solid #e0e0e0",
        paddingBottom: 12,
      }}
    >
      {renderButton("all", "All Posts")}
      {renderButton("following", "Following")}
    </div>
  );
}
