import { C } from "@/lib/colors";

export function TopBar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "20px 32px",
        borderBottom: `1px solid ${C.line}`,
        background: C.bg,
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        {subtitle && (
          <div style={{ fontSize: 11, color: C.ink2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            {subtitle}
          </div>
        )}
        <div
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: C.ink,
            marginTop: 2,
          }}
        >
          {title}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 40,
            padding: "0 14px",
            borderRadius: 12,
            background: C.surface,
            border: `1px solid ${C.line}`,
            color: C.ink2,
            fontSize: 13,
            minWidth: 240,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Rechercher utilisateur, carte, transaction…</span>
          <span
            style={{
              marginLeft: "auto",
              padding: "2px 6px",
              borderRadius: 5,
              background: "rgba(42,15,26,0.06)",
              fontSize: 10,
              fontFamily: "monospace",
            }}
          >
            ⌘K
          </span>
        </div>
        <button
          aria-label="Notifications"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: C.surface,
            border: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 9,
              width: 8,
              height: 8,
              background: C.coral,
              borderRadius: "50%",
            }}
          />
        </button>
        {actions}
      </div>
    </div>
  );
}
