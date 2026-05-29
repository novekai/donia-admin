import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";

const OPERATORS = [
  { name: "MTN", countries: "Bénin · Côte d'Ivoire", live: true, c: C.mango },
  { name: "Moov", countries: "Bénin · Togo · Burkina", live: true, c: C.indigo },
  { name: "Orange", countries: "Sénégal · Mali · Côte d'Ivoire", live: true, c: C.coral },
  { name: "Wave", countries: "Sénégal · Côte d'Ivoire", live: true, c: C.mint },
  { name: "Free Money", countries: "Sénégal", live: false, c: C.plum },
];

const NOTIFICATIONS = [
  { name: "Push (in-app)", on: true, emoji: "🔔" },
  { name: "Email transactionnel", on: true, emoji: "✉️" },
  { name: "SMS (OTP, alertes)", on: true, emoji: "💬" },
  { name: "WhatsApp Business", on: true, emoji: "📲" },
];

const TEAM = [
  { n: "Espoir K.", r: "Owner", e: "espoir@novekai.agency", c: C.coral, i: "E" },
  { n: "NovekAI Bot", r: "Système", e: "bot@novekai.agency", c: C.indigo, i: "N" },
  { n: "Support Donia", r: "Support", e: "support@doniia.com", c: C.mint, i: "S" },
];

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Paramètres" subtitle="Configuration plateforme · Donia v1.0" />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Économique */}
          <Card title="Modèle économique" subtitle="Commission prélevée à la conversion des cartes">
            <Field label="Commission par défaut (%)">
              <div style={pillBig}>
                <input
                  defaultValue="5"
                  style={{ flex: 1, border: 0, background: "transparent", fontFamily: "var(--font-bricolage), sans-serif", fontSize: 18, fontWeight: 700, color: C.coral, outline: "none" }}
                />
                <span style={{ fontSize: 12, color: C.ink2 }}>% du montant de la carte</span>
              </div>
            </Field>
            <Field label="Montant minimum d'une carte">
              <div style={pillBig}>
                <input
                  defaultValue="500"
                  style={{ flex: 1, border: 0, background: "transparent", fontFamily: "var(--font-bricolage), sans-serif", fontSize: 18, fontWeight: 700, color: C.ink, outline: "none" }}
                />
                <span style={{ fontSize: 12, color: C.ink2 }}>FCFA</span>
              </div>
            </Field>
            <Field label="Montant maximum sans KYC">
              <div style={pillBig}>
                <input
                  defaultValue="50 000"
                  style={{ flex: 1, border: 0, background: "transparent", fontFamily: "var(--font-bricolage), sans-serif", fontSize: 18, fontWeight: 700, color: C.ink, outline: "none" }}
                />
                <span style={{ fontSize: 12, color: C.ink2 }}>FCFA</span>
              </div>
            </Field>
            <Field label="Parrainage à vie">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: C.bg,
                  border: `1px solid ${C.line}`,
                }}
              >
                <span style={{ fontSize: 13, color: C.ink }}>1% reversé au parrain · à vie</span>
                <Toggle on />
              </div>
            </Field>
          </Card>

          {/* Opérateurs */}
          <Card title="Opérateurs Mobile Money" subtitle="17 méthodes intégrées via FedaPay">
            {OPERATORS.map((op, i) => (
              <div
                key={op.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: i < OPERATORS.length - 1 ? `1px solid ${C.line}` : 0,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: `${op.c}22`,
                    color: op.c,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontFamily: "var(--font-fraunces), serif",
                    fontSize: 12,
                  }}
                >
                  {op.name.slice(0, 2)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{op.name}</div>
                  <div style={{ fontSize: 11, color: C.ink2 }}>{op.countries}</div>
                </div>
                <Toggle on={op.live} />
              </div>
            ))}
          </Card>

          {/* Notifications */}
          <Card title="Canaux de notification" subtitle="Canaux activés pour les utilisateurs finaux">
            {NOTIFICATIONS.map((n, i) => (
              <div
                key={n.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: i < NOTIFICATIONS.length - 1 ? `1px solid ${C.line}` : 0,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: C.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {n.emoji}
                </div>
                <div style={{ flex: 1, fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{n.name}</div>
                <Toggle on={n.on} />
              </div>
            ))}
          </Card>

          {/* Team */}
          <Card
            title="Équipe admin"
            subtitle="3 admins · NovekAI"
            right={
              <button
                style={{
                  padding: "6px 12px",
                  borderRadius: 8,
                  background: C.coral,
                  color: C.creamSoft,
                  border: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "var(--font-fraunces), serif",
                  cursor: "pointer",
                }}
              >
                + Inviter
              </button>
            }
          >
            {TEAM.map((m, i) => (
              <div
                key={m.e}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: i < TEAM.length - 1 ? `1px solid ${C.line}` : 0,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: m.c,
                    color: C.creamSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-fraunces), serif",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {m.i}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{m.n}</div>
                  <div style={{ fontSize: 11, color: C.ink2, fontFamily: "monospace" }}>{m.e}</div>
                </div>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 5,
                    background: "rgba(65,8,123,0.12)",
                    color: C.indigo,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {m.r.toUpperCase()}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  subtitle,
  right,
  children,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: 24, background: C.surface, borderRadius: 18, border: `1px solid ${C.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 12, color: C.ink2, marginTop: 2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            {subtitle}
          </div>
        </div>
        {right}
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 38,
        height: 22,
        borderRadius: 99,
        background: on ? C.green : "rgba(42,15,26,0.15)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: C.creamSoft,
        }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-fraunces), serif",
          fontStyle: "italic",
          fontSize: 12,
          color: C.ink2,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const pillBig: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
  borderRadius: 10,
  background: C.bg,
  border: `1px solid ${C.line}`,
};
