import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";

type Status = "sent" | "completed" | "pending" | "failed";
type Type = "send" | "redeem" | "topup";

type Tx = {
  ref: string;
  type: Type;
  from: string;
  to: string;
  amount: string;
  commission: string;
  status: Status;
  card: string;
  date: string;
  emoji: string;
};

const TXS: Tx[] = [
  { ref: "DON-2026-A7K91", type: "send", from: "Awa D.", to: "Kofi M.", amount: "10 000", commission: "—", status: "sent", card: "Anniversaire", date: "30 mai · 14:32", emoji: "🎂" },
  { ref: "DON-2026-A7K90", type: "redeem", from: "Kofi M.", to: "MTN Bénin", amount: "5 000", commission: "250", status: "completed", card: "Bonjour", date: "30 mai · 13:12", emoji: "👋" },
  { ref: "DON-2026-A7K88", type: "send", from: "Marie D.", to: "Awa D.", amount: "5 000", commission: "—", status: "sent", card: "Je t'aime", date: "30 mai · 13:08", emoji: "💖" },
  { ref: "DON-2026-A7K87", type: "topup", from: "Wave", to: "Awa D.", amount: "25 000", commission: "—", status: "completed", card: "—", date: "30 mai · 09:21", emoji: "💰" },
  { ref: "DON-2026-A7K86", type: "redeem", from: "Aïcha T.", to: "Orange SN", amount: "15 200", commission: "760", status: "pending", card: "GoShop", date: "29 mai · 18:14", emoji: "🛍️" },
  { ref: "DON-2026-A7K85", type: "send", from: "Sam A.", to: "Léa T.", amount: "5 100", commission: "—", status: "sent", card: "Bravo", date: "29 mai · 11:02", emoji: "🏆" },
  { ref: "DON-2026-A7K84", type: "redeem", from: "Léa T.", to: "Moov Bénin", amount: "5 100", commission: "255", status: "failed", card: "Bravo", date: "29 mai · 11:05", emoji: "🏆" },
];

const STATUS_MAP: Record<Status, { l: string; bg: string; c: string }> = {
  sent: { l: "ENVOYÉ", bg: "rgba(65,8,123,0.12)", c: C.indigo },
  completed: { l: "TERMINÉ", bg: "rgba(92,138,69,0.15)", c: C.green },
  pending: { l: "EN COURS", bg: "rgba(249,160,28,0.18)", c: "#A66E0E" },
  failed: { l: "ÉCHEC", bg: "rgba(214,46,85,0.15)", c: C.coralDeep },
};
const TYPE_MAP: Record<Type, { l: string; c: string }> = {
  send: { l: "ENVOI", c: C.coral },
  redeem: { l: "CONVERSION", c: C.mint },
  topup: { l: "RECHARGE", c: C.mango },
};

const STATS = [
  { l: "Aujourd'hui", v: "127 transactions", sub: "4,2 M FCFA" },
  { l: "En attente", v: "8", sub: "à examiner" },
  { l: "Échecs (24h)", v: "3", sub: "0,2% taux" },
  { l: "Commission (24h)", v: "74 200 FCFA", sub: "+12% vs hier", positive: true },
];

const FILTERS = ["Toutes", "Envois", "Conversions", "Recharges", "En échec"];

export default function TransactionsPage() {
  return (
    <>
      <TopBar
        title="Transactions"
        subtitle="48 217 transactions · 2,41 M FCFA de commissions"
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
        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
          {STATS.map((s) => (
            <div key={s.l} style={{ padding: "14px 18px", background: C.surface, borderRadius: 14, border: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 11, color: C.ink2, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.l}</div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: s.positive ? C.green : C.ink,
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 11, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif", marginTop: 2 }}>
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {FILTERS.map((f, i) => (
            <button
              key={f}
              style={{
                padding: "6px 12px",
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
              gridTemplateColumns: "1fr 0.9fr 1.1fr 1.1fr 0.7fr 0.8fr 0.8fr 0.8fr",
              padding: "12px 20px",
              borderBottom: `1px solid ${C.line}`,
              fontSize: 11,
              color: C.ink2,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              background: C.bg,
            }}
          >
            <span>Référence</span>
            <span>Type</span>
            <span>De</span>
            <span>Vers</span>
            <span>Montant</span>
            <span>Commission</span>
            <span>Statut</span>
            <span>Date</span>
          </div>
          {TXS.map((t, i) => {
            const sm = STATUS_MAP[t.status];
            const tm = TYPE_MAP[t.type];
            return (
              <div
                key={t.ref}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 0.9fr 1.1fr 1.1fr 0.7fr 0.8fr 0.8fr 0.8fr",
                  padding: "12px 20px",
                  borderBottom: i < TXS.length - 1 ? `1px solid ${C.line}` : 0,
                  alignItems: "center",
                  fontSize: 12,
                }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 11, color: C.ink }}>{t.ref}</span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "3px 7px",
                    borderRadius: 5,
                    background: `${tm.c}22`,
                    color: tm.c,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    width: "fit-content",
                  }}
                >
                  <span style={{ fontSize: 12 }}>{t.emoji}</span> {tm.l}
                </span>
                <span style={{ fontWeight: 600 }}>{t.from}</span>
                <span style={{ color: C.ink2 }}>{t.to}</span>
                <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700 }}>{t.amount}</span>
                <span
                  style={{
                    fontFamily: "var(--font-bricolage), sans-serif",
                    fontWeight: 700,
                    color: t.commission === "—" ? C.ink3 : C.green,
                  }}
                >
                  {t.commission}
                </span>
                <span
                  style={{
                    padding: "3px 7px",
                    borderRadius: 5,
                    background: sm.bg,
                    color: sm.c,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    width: "fit-content",
                  }}
                >
                  {sm.l}
                </span>
                <span style={{ fontSize: 11, color: C.ink2, fontFamily: "var(--font-fraunces), serif", fontStyle: "italic" }}>
                  {t.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
