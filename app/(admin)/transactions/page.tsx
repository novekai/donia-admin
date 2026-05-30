"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, compactNumber, formatNumber } from "@/lib/api";

type TxType =
  | "SEND"
  | "RECEIVE"
  | "TOPUP_MOBILE_MONEY"
  | "TOPUP_CODE"
  | "WITHDRAWAL"
  | "COMMISSION"
  | "REFERRAL_BONUS"
  | "CAGNOTTE_IN";

type Status = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

type Tx = {
  id: string;
  ref: string | null;
  type: TxType;
  status: Status;
  amount: number;
  currency: string;
  cardId: string | null;
  counterpartyId: string | null;
  createdAt: string;
  user: { id: string; name: string } | null;
};

type ApiResponse = {
  items: Tx[];
  nextCursor: string | null;
  stats: {
    todayCount: number;
    todayCommissions: number;
    pendingCount: number;
    failed24h: number;
  };
};

const TYPE_MAP: Record<TxType, { l: string; c: string; emoji: string }> = {
  SEND: { l: "ENVOI", c: C.coral, emoji: "🎁" },
  RECEIVE: { l: "RÉCEPTION", c: C.pink, emoji: "📨" },
  TOPUP_MOBILE_MONEY: { l: "RECHARGE", c: C.mango, emoji: "💰" },
  TOPUP_CODE: { l: "RECHARGE", c: C.mango, emoji: "🎟️" },
  WITHDRAWAL: { l: "RETRAIT", c: C.mint, emoji: "💸" },
  COMMISSION: { l: "COMMISSION", c: C.green, emoji: "✨" },
  REFERRAL_BONUS: { l: "PARRAINAGE", c: C.indigo, emoji: "🤝" },
  CAGNOTTE_IN: { l: "CAGNOTTE", c: C.plum, emoji: "🎊" },
};

const STATUS_MAP: Record<Status, { l: string; bg: string; c: string }> = {
  PENDING: { l: "EN COURS", bg: "rgba(249,160,28,0.18)", c: "#A66E0E" },
  SUCCESS: { l: "TERMINÉ", bg: "rgba(92,138,69,0.15)", c: C.green },
  FAILED: { l: "ÉCHEC", bg: "rgba(214,46,85,0.15)", c: C.coralDeep },
  REFUNDED: { l: "REMBOURSÉ", bg: "rgba(65,8,123,0.12)", c: C.indigo },
};

const FILTERS: { key: "all" | TxType; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "SEND", label: "Envois" },
  { key: "RECEIVE", label: "Réceptions" },
  { key: "TOPUP_MOBILE_MONEY", label: "Recharges" },
  { key: "COMMISSION", label: "Commissions" },
  { key: "REFERRAL_BONUS", label: "Parrainages" },
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransactionsPage() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | TxType>("all");

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setData(null);
    api
      .get<ApiResponse>(`/v1/admin/transactions?type=${filter}`)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((e) => {
        if (!cancelled) setError((e as { message?: string }).message ?? "Chargement impossible");
      });
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const items = data?.items ?? [];

  return (
    <>
      <TopBar
        title="Transactions"
        subtitle={data ? `${items.length} affichées · ${formatNumber(data.stats.todayCommissions)} FCFA commissions aujourd'hui` : "Chargement…"}
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
        {error && (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(214,46,85,0.08)",
              border: `1px solid rgba(214,46,85,0.18)`,
              color: C.coralDeep,
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* Quick stats */}
        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { l: "Aujourd'hui", v: `${formatNumber(data.stats.todayCount)} tx`, sub: `${compactNumber(data.stats.todayCommissions)} FCFA commission` },
              { l: "En attente", v: formatNumber(data.stats.pendingCount), sub: "à surveiller" },
              { l: "Échecs (24h)", v: formatNumber(data.stats.failed24h), sub: "à investiguer" },
              { l: "Commission (24h)", v: `${formatNumber(data.stats.todayCommissions)} FCFA`, sub: "depuis minuit", positive: true },
            ].map((s) => (
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
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "6px 12px",
                borderRadius: 99,
                background: filter === f.key ? C.indigo : C.surface,
                color: filter === f.key ? C.creamSoft : C.ink,
                border: filter === f.key ? 0 : `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {!data && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement des transactions…
          </div>
        )}

        {data && items.length === 0 && (
          <div
            style={{
              padding: 40,
              background: C.surface,
              borderRadius: 18,
              border: `1px solid ${C.line}`,
              textAlign: "center",
              color: C.ink2,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📊</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, color: C.ink }}>
              Aucune transaction
            </div>
          </div>
        )}

        {data && items.length > 0 && (
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 0.9fr 1.1fr 0.8fr 0.8fr 0.8fr",
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
              <span>Utilisateur</span>
              <span>Montant</span>
              <span>Statut</span>
              <span>Date</span>
            </div>
            {items.map((t, i) => {
              const tm = TYPE_MAP[t.type];
              const sm = STATUS_MAP[t.status];
              return (
                <div
                  key={t.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 0.9fr 1.1fr 0.8fr 0.8fr 0.8fr",
                    padding: "12px 20px",
                    borderBottom: i < items.length - 1 ? `1px solid ${C.line}` : 0,
                    alignItems: "center",
                    fontSize: 12,
                  }}
                >
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.ref ?? t.id.slice(0, 12)}
                  </span>
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
                    <span style={{ fontSize: 12 }}>{tm.emoji}</span> {tm.l}
                  </span>
                  <span style={{ fontWeight: 600 }}>{t.user?.name ?? "—"}</span>
                  <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700 }}>
                    {formatNumber(t.amount)}
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
                    {formatDate(t.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
