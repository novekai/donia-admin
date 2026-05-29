import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";

type Card = {
  name: string;
  bg: string;
  ink: string;
  emoji: string;
  sent: number;
  live: boolean;
  border?: boolean;
};

const CARDS: Card[] = [
  { name: "Anniversaire", bg: C.coral, ink: C.creamSoft, emoji: "🎂", sent: 412, live: true },
  { name: "Saint-Valentin", bg: C.pink, ink: C.creamSoft, emoji: "💖", sent: 287, live: true },
  { name: "Mariage", bg: C.surface, ink: C.ink, emoji: "💍", sent: 89, live: true, border: true },
  { name: "Condoléances", bg: C.plum, ink: C.creamSoft, emoji: "🕊️", sent: 47, live: true },
  { name: "Bravo", bg: C.mango, ink: C.ink, emoji: "🏆", sent: 198, live: true },
  { name: "Noël", bg: C.mint, ink: C.creamSoft, emoji: "🎄", sent: 0, live: false },
  { name: "Tabaski", bg: C.indigo, ink: C.creamSoft, emoji: "🌙", sent: 156, live: true },
  { name: "Naissance", bg: "#6FB5D4", ink: "#FFFFFF", emoji: "👶", sent: 32, live: true },
  { name: "Bon voyage", bg: C.indigoDeep, ink: C.creamSoft, emoji: "✈️", sent: 22, live: true },
  { name: "GoShop", bg: C.surface, ink: C.ink, emoji: "🛍️", sent: 67, live: true, border: true },
  { name: "Bonjour", bg: C.coral, ink: C.creamSoft, emoji: "👋", sent: 156, live: true },
  { name: "Diplôme", bg: C.surface, ink: C.ink, emoji: "🎓", sent: 0, live: false, border: true },
];

const FILTERS = ["Toutes (12)", "Publiées (10)", "Brouillon (2)", "Archivées (0)"];

export default function CardsPage() {
  return (
    <>
      <TopBar
        title="Cartes cadeaux"
        subtitle="12 designs · 10 publiées"
        actions={
          <button
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: 12,
              background: C.coral,
              color: C.creamSoft,
              border: 0,
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.creamSoft} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvelle carte
          </button>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          {FILTERS.map((f, i) => (
            <button
              key={f}
              style={{
                padding: "8px 14px",
                borderRadius: 99,
                background: i === 0 ? C.indigo : C.surface,
                color: i === 0 ? C.creamSoft : C.ink,
                border: i === 0 ? 0 : `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 4, padding: 3, background: C.surface, borderRadius: 10, border: `1px solid ${C.line}` }}>
            <button style={{ padding: "6px 10px", borderRadius: 7, background: C.bg, border: 0, fontSize: 12, color: C.ink, fontWeight: 600, cursor: "pointer" }}>
              ⊞ Grille
            </button>
            <button style={{ padding: "6px 10px", borderRadius: 7, background: "transparent", border: 0, fontSize: 12, color: C.ink2, fontWeight: 600, cursor: "pointer" }}>
              ≡ Liste
            </button>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {CARDS.map((c) => (
            <div
              key={c.name}
              style={{
                background: C.surface,
                borderRadius: 18,
                border: `1px solid ${C.line}`,
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  aspectRatio: "1.4",
                  background: c.bg,
                  color: c.ink,
                  padding: 16,
                  position: "relative",
                  overflow: "hidden",
                  border: c.border ? `1px solid ${C.line}` : "none",
                }}
              >
                <svg style={{ position: "absolute", top: -20, right: -20, opacity: 0.18 }} width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke={c.ink} strokeWidth="0.8" fill="none" />
                  <circle cx="50" cy="50" r="28" stroke={c.ink} strokeWidth="0.8" fill="none" />
                </svg>
                <div style={{ position: "absolute", top: 12, right: 12, fontSize: 28 }}>{c.emoji}</div>
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    fontFamily: "var(--font-fraunces), serif",
                    fontStyle: "italic",
                    fontSize: 12,
                    opacity: 0.85,
                  }}
                >
                  donia
                </div>
                <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: 17,
                      fontWeight: 500,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.1,
                    }}
                  >
                    {c.name}
                  </div>
                </div>
              </div>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.ink2 }}>{c.sent.toLocaleString("fr-FR")} envois</div>
                </div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 5,
                    background: c.live ? "rgba(92,138,69,0.15)" : "rgba(249,160,28,0.15)",
                    color: c.live ? C.green : "#A66E0E",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {c.live ? "LIVE" : "BROUILLON"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
