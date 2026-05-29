import { C } from "@/lib/colors";

export function KPI({
  label,
  value,
  delta,
  deltaPositive = true,
  accent,
  sub,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  accent: string;
  sub?: string;
  icon: string;
}) {
  return (
    <div
      style={{
        padding: "18px 20px",
        background: C.surface,
        borderRadius: 18,
        border: `1px solid ${C.line}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <svg style={{ position: "absolute", top: -20, right: -20, opacity: 0.08 }} width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" stroke={accent} strokeWidth="1" fill="none" />
        <circle cx="50" cy="50" r="28" stroke={accent} strokeWidth="1" fill="none" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="16" fill={accent} />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
        <div style={{ fontSize: 11, color: C.ink2, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 700 }}>
          {label}
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: `${accent}22`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          {icon}
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          fontFamily: "var(--font-bricolage), sans-serif",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: C.ink,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
        {delta && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              fontWeight: 700,
              color: deltaPositive ? C.green : C.coralDeep,
              padding: "2px 6px",
              borderRadius: 99,
              background: deltaPositive ? "rgba(92,138,69,0.12)" : "rgba(214,46,85,0.12)",
            }}
          >
            {deltaPositive ? "↑" : "↓"} {delta}
          </span>
        )}
        {sub && (
          <span style={{ fontSize: 11, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
