import { C } from "@/lib/colors";
import { KPI } from "@/components/KPI";
import { TopBar } from "@/components/TopBar";

const KPIS = [
  { label: "Utilisateurs", value: "14 287", delta: "+12% / mois", accent: C.coral, sub: "vs 12 760 en avril", icon: "👥" },
  { label: "Cartes envoyées", value: "2 416", delta: "+8% / mois", accent: C.pink, sub: "ce mois-ci", icon: "🎁" },
  { label: "Volume transité", value: "48,2 M", delta: "+22% / mois", accent: C.mango, sub: "FCFA · mai 2026", icon: "💰" },
  { label: "Commissions", value: "2,41 M", delta: "+22% / mois", accent: C.mint, sub: "FCFA · 5% conversion", icon: "✨" },
];

const BARS = [
  { m: "Déc", e: 60, c: 45 },
  { m: "Jan", e: 72, c: 58 },
  { m: "Fév", e: 85, c: 70 },
  { m: "Mar", e: 78, c: 65 },
  { m: "Avr", e: 92, c: 80 },
  { m: "Mai", e: 100, c: 88 },
];

const TOP_CARDS = [
  { name: "Anniversaire", count: 412, emoji: "🎂", color: C.coral, pct: 100 },
  { name: "Je t'aime", count: 287, emoji: "💖", color: C.pink, pct: 70 },
  { name: "Bravo", count: 198, emoji: "🏆", color: C.mango, pct: 48 },
  { name: "Bonjour", count: 156, emoji: "👋", color: C.coral, pct: 38 },
  { name: "Mariage", count: 89, emoji: "💍", color: C.indigo, pct: 22 },
];

const ACTIVITY = [
  { who: "Awa D.", action: "a envoyé", what: "Anniversaire · 10 000", target: "à Kofi M.", time: "à l'instant", emoji: "🎂", color: C.coral },
  { who: "Sam A.", action: "a converti", what: "Bravo · 15 000", target: "commission 750 FCFA", time: "il y a 2 min", emoji: "🏆", color: C.mango, revenue: true },
  { who: "Marie D.", action: "a rejoint", what: "via parrainage Awa", target: "+500 FCFA bonus", time: "il y a 5 min", emoji: "✨", color: C.pink },
  { who: "Léa T.", action: "a converti", what: "Je t'aime · 5 000", target: "commission 250 FCFA", time: "il y a 8 min", emoji: "💖", color: C.pink, revenue: true },
  { who: "Kofi M.", action: "a rechargé", what: "via MTN · 25 000", target: "", time: "il y a 12 min", emoji: "💰", color: C.mint },
];

const ALERTS = [
  { l: "KYC en attente", v: 4, color: C.coral, action: "Valider", emoji: "🪪" },
  { l: "Cartes brouillon", v: 2, color: C.mango, action: "Publier", emoji: "✎" },
  { l: "Tickets support", v: 7, color: C.indigo, action: "Répondre", emoji: "💬" },
  { l: "Litiges", v: 1, color: C.coralDeep, action: "Examiner", emoji: "⚠️" },
];

export default function DashboardPage() {
  return (
    <>
      <TopBar
        title="Tableau de bord"
        subtitle="30 mai 2026 · Vue d'ensemble"
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
            Exporter
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.creamSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "24px 32px" }}>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {KPIS.map((k) => (
            <KPI key={k.label} {...k} />
          ))}
        </div>

        {/* Charts row */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
          {/* Bars */}
          <div style={{ padding: 24, background: C.surface, borderRadius: 20, border: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  Volume mensuel
                </div>
                <div style={{ fontSize: 12, color: C.ink2, marginTop: 2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
                  Cartes envoyées vs converties · 6 derniers mois
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                <Legend color={C.coral} label="Envoyées" />
                <Legend color={C.mango} label="Converties" />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 200, paddingTop: 12 }}>
              {BARS.map((d) => (
                <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, flex: 1, width: "100%" }}>
                    <div
                      style={{
                        flex: 1,
                        height: `${d.e}%`,
                        background: "linear-gradient(180deg, #F4486F 0%, #D62E55 100%)",
                        borderRadius: "8px 8px 4px 4px",
                      }}
                    />
                    <div
                      style={{
                        flex: 1,
                        height: `${d.c}%`,
                        background: "linear-gradient(180deg, #F9A01C 0%, #D9871F 100%)",
                        borderRadius: "8px 8px 4px 4px",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, color: C.ink2, fontWeight: 600 }}>{d.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top cards */}
          <div style={{ padding: 24, background: C.surface, borderRadius: 20, border: `1px solid ${C.line}` }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
              Top cartes
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.ink2,
                marginTop: 2,
                fontStyle: "italic",
                fontFamily: "var(--font-fraunces), serif",
                marginBottom: 14,
              }}
            >
              Les plus envoyées · 30 jours
            </div>
            {TOP_CARDS.map((t) => (
              <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: `${t.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {t.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{t.name}</span>
                    <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: 13, fontWeight: 700 }}>{t.count}</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 99, background: "rgba(42,15,26,0.06)", overflow: "hidden" }}>
                    <div style={{ width: `${t.pct}%`, height: "100%", background: t.color, borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity + Alerts */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
          <div style={{ padding: 24, background: C.surface, borderRadius: 20, border: `1px solid ${C.line}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em" }}>
                Activité en direct
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: C.green, fontWeight: 700 }}>
                <div className="c-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: C.green }} />
                Live
              </span>
            </div>
            <div>
              {ACTIVITY.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 0",
                    borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${C.line}` : 0,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: `${a.color}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                    }}
                  >
                    {a.emoji}
                  </div>
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <span style={{ fontWeight: 700 }}>{a.who}</span>
                    <span style={{ color: C.ink2 }}> {a.action} </span>
                    <span style={{ fontWeight: 600 }}>{a.what}</span>
                    {a.target && <span style={{ color: C.ink2 }}> · {a.target}</span>}
                  </div>
                  {a.revenue && (
                    <span
                      style={{
                        padding: "2px 7px",
                        borderRadius: 99,
                        background: "rgba(92,138,69,0.12)",
                        color: C.green,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      REVENUE
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 11,
                      color: C.ink3,
                      fontStyle: "italic",
                      fontFamily: "var(--font-fraunces), serif",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 24, background: C.surface, borderRadius: 20, border: `1px solid ${C.line}` }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14 }}>
              À traiter
            </div>
            {ALERTS.map((a, i) => (
              <div
                key={a.l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 0",
                  borderBottom: i < ALERTS.length - 1 ? `1px solid ${C.line}` : 0,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: `${a.color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {a.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{a.l}</div>
                  <div style={{ fontSize: 11, color: C.ink2 }}>{a.v} en attente</div>
                </div>
                <button
                  style={{
                    padding: "6px 12px",
                    borderRadius: 99,
                    background: a.color,
                    color: C.creamSoft,
                    border: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "var(--font-fraunces), serif",
                    cursor: "pointer",
                  }}
                >
                  {a.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 5, color: C.ink2, fontWeight: 600 }}>
      <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
      {label}
    </span>
  );
}
