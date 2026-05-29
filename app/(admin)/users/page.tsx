import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";

type Kyc = "OK" | "Pending" | "Rejected";
type User = {
  n: string;
  e: string;
  p: string;
  country: string;
  kyc: Kyc;
  volume: string;
  sent: number;
  joined: string;
  i: string;
  c: string;
  ink?: string;
};

const USERS: User[] = [
  { n: "Awa Diallo", e: "awa@donia.com", p: "+229 90 12 34 56", country: "🇧🇯", kyc: "OK", volume: "125 800", sent: 18, joined: "Mars 2026", i: "A", c: C.coral },
  { n: "Kofi Mensah", e: "kofi@gmail.com", p: "+229 94 50 21 87", country: "🇧🇯", kyc: "OK", volume: "45 200", sent: 9, joined: "Mars 2026", i: "K", c: C.indigo },
  { n: "Marie Dossou", e: "marie.d@gmail.com", p: "+229 95 11 03 42", country: "🇧🇯", kyc: "Pending", volume: "20 000", sent: 3, joined: "Avril 2026", i: "M", c: C.pink },
  { n: "Aïcha Traoré", e: "aicha.t@gmail.com", p: "+221 77 312 88 45", country: "🇸🇳", kyc: "OK", volume: "78 500", sent: 14, joined: "Février 2026", i: "A", c: C.mango, ink: C.ink },
  { n: "Sam Adigun", e: "sam@gmail.com", p: "+229 90 22 18 04", country: "🇧🇯", kyc: "OK", volume: "32 100", sent: 7, joined: "Avril 2026", i: "S", c: C.mint },
  { n: "Léa Tchao", e: "lea.t@gmail.com", p: "+229 96 55 67 19", country: "🇧🇯", kyc: "Rejected", volume: "0", sent: 0, joined: "Mai 2026", i: "L", c: C.plum },
  { n: "David Koffi", e: "david.k@yahoo.com", p: "+225 07 89 12 34", country: "🇨🇮", kyc: "OK", volume: "156 700", sent: 22, joined: "Janvier 2026", i: "D", c: C.coral },
  { n: "Fatou Ndiaye", e: "fatou@gmail.com", p: "+221 78 234 56 78", country: "🇸🇳", kyc: "Pending", volume: "8 500", sent: 1, joined: "Mai 2026", i: "F", c: C.indigo },
];

const FILTERS = ["Tous (14 287)", "KYC OK (8 412)", "KYC en attente (12)", "Inactifs (487)", "Top contributeurs (94)"];

export default function UsersPage() {
  return (
    <>
      <TopBar
        title="Utilisateurs"
        subtitle="14 287 inscrits · 12 KYC à examiner"
        actions={
          <button
            style={{
              height: 40,
              padding: "0 16px",
              borderRadius: 12,
              background: C.indigo,
              color: C.creamSoft,
              border: 0,
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Exporter CSV
          </button>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
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
        </div>

        {/* Table */}
        <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.4fr 0.6fr 0.8fr 0.9fr 0.7fr 0.6fr",
              padding: "14px 20px",
              borderBottom: `1px solid ${C.line}`,
              fontSize: 11,
              color: C.ink2,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: C.bg,
            }}
          >
            <span>Utilisateur</span>
            <span>Contact</span>
            <span>Pays</span>
            <span>KYC</span>
            <span>Volume (FCFA)</span>
            <span>Cartes</span>
            <span style={{ textAlign: "right" }}>Action</span>
          </div>
          {USERS.map((u, i) => (
            <div
              key={u.e}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.4fr 0.6fr 0.8fr 0.9fr 0.7fr 0.6fr",
                padding: "14px 20px",
                borderBottom: i < USERS.length - 1 ? `1px solid ${C.line}` : 0,
                alignItems: "center",
                fontSize: 13,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: u.c,
                    color: u.ink ?? C.creamSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-fraunces), serif",
                    fontWeight: 600,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {u.i}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600 }}>{u.n}</div>
                  <div style={{ fontSize: 11, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
                    {u.joined}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12 }}>{u.e}</div>
                <div style={{ fontSize: 11, color: C.ink2, fontFamily: "monospace" }}>{u.p}</div>
              </div>
              <div style={{ fontSize: 18 }}>{u.country}</div>
              <div>
                <KycPill kyc={u.kyc} />
              </div>
              <div style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 14 }}>{u.volume}</div>
              <div style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 600 }}>{u.sent}</div>
              <div style={{ textAlign: "right" }}>
                <button
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "transparent",
                    border: `1px solid ${C.line}`,
                    color: C.ink,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-fraunces), serif",
                  }}
                >
                  Voir →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function KycPill({ kyc }: { kyc: Kyc }) {
  const map: Record<Kyc, { bg: string; color: string; label: string }> = {
    OK: { bg: "rgba(92,138,69,0.15)", color: C.green, label: "✓ OK" },
    Pending: { bg: "rgba(249,160,28,0.18)", color: "#A66E0E", label: "⏳ EN ATTENTE" },
    Rejected: { bg: "rgba(214,46,85,0.15)", color: C.coralDeep, label: "✗ REJETÉ" },
  };
  const s = map[kyc];
  return (
    <span
      style={{
        padding: "3px 8px",
        borderRadius: 5,
        background: s.bg,
        color: s.color,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {s.label}
    </span>
  );
}
