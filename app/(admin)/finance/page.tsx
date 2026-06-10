"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, formatNumber } from "@/lib/api";

type FinanceData = {
  owedToUsers: { total: number; principal: number; referral: number };
  fedapay: { available: number; pending: number; error: string | null };
  margin: { total: number; thisMonth: number; cagnotteCommissions: number };
  withdrawals: { pending: number };
  health: { status: "healthy" | "warning" | "critical"; coverageRatio: number; deficit: number };
  asOf: string;
};

const HEALTH_MAP: Record<FinanceData["health"]["status"], { label: string; bg: string; color: string; emoji: string }> = {
  healthy: { label: "Saine", bg: "rgba(92,138,69,0.15)", color: C.green, emoji: "✅" },
  warning: { label: "À surveiller", bg: "rgba(249,160,28,0.18)", color: C.mangoDeep, emoji: "⚠️" },
  critical: { label: "Déficit", bg: "rgba(214,46,85,0.15)", color: C.coralDeep, emoji: "🔴" },
};

export default function FinancePage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  function load() {
    setError(null);
    setRefreshing(true);
    api
      .get<FinanceData>("/v1/admin/finance/dashboard")
      .then((d) => setData(d))
      .catch((e) => setError((e as { message?: string }).message ?? "Chargement impossible"))
      .finally(() => setRefreshing(false));
  }

  useEffect(() => {
    load();
  }, []);

  const health = data ? HEALTH_MAP[data.health.status] : null;

  return (
    <>
      <TopBar
        title="Finance"
        subtitle={
          data
            ? `Mise à jour ${new Date(data.asOf).toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}`
            : "Chargement…"
        }
        actions={
          <button
            onClick={load}
            disabled={refreshing}
            style={{
              height: 40,
              padding: "0 14px",
              borderRadius: 12,
              background: C.indigo,
              color: C.creamSoft,
              border: 0,
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: refreshing ? "not-allowed" : "pointer",
              opacity: refreshing ? 0.6 : 1,
            }}
          >
            {refreshing ? "Actualisation…" : "↻ Actualiser"}
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

        {!data && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic" }}>Chargement…</div>
        )}

        {data && health && (
          <>
            {/* Bandeau santé */}
            <div
              style={{
                padding: "18px 22px",
                background: health.bg,
                borderRadius: 14,
                border: `1px solid ${health.color}33`,
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div style={{ fontSize: 28 }}>{health.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, color: health.color }}>
                  Santé financière : {health.label}
                </div>
                <div style={{ fontSize: 12, color: C.ink2, marginTop: 2 }}>
                  Couverture {(data.health.coverageRatio * 100).toFixed(0)}% — Solde FedaPay vs total dû aux users.
                  {data.health.deficit > 0 && (
                    <>
                      {" "}
                      <strong style={{ color: C.coralDeep }}>
                        Déficit : {formatNumber(data.health.deficit)} FCFA
                      </strong>{" "}
                      à recharger sur le compte marchand.
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 4 KPIs principaux */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              <KpiCard
                label="Dû aux users"
                value={`${formatNumber(data.owedToUsers.total)} FCFA`}
                sub="soldes wallet (principal + parrainage)"
                accent={C.indigo}
                icon="💵"
              />
              <KpiCard
                label="Solde FedaPay"
                value={`${formatNumber(data.fedapay.available)} FCFA`}
                sub={
                  data.fedapay.error
                    ? "API indisponible"
                    : data.fedapay.pending > 0
                    ? `+ ${formatNumber(data.fedapay.pending)} en attente`
                    : "compte marchand"
                }
                accent={data.fedapay.error ? C.coralDeep : C.mint}
                icon="🏦"
              />
              <KpiCard
                label="Marge Donia totale"
                value={`${formatNumber(data.margin.total)} FCFA`}
                sub={`dont ${formatNumber(data.margin.thisMonth)} ce mois-ci`}
                accent={C.green}
                icon="✅"
              />
              <KpiCard
                label="Retraits en attente"
                value={`${formatNumber(data.withdrawals.pending)} FCFA`}
                sub="à traiter (manuel ou auto)"
                accent={data.withdrawals.pending > 0 ? C.mangoDeep : C.ink2}
                icon="⏳"
              />
            </div>

            {/* Détail dû aux users */}
            <div
              style={{
                padding: 22,
                background: C.surface,
                borderRadius: 18,
                border: `1px solid ${C.line}`,
                marginBottom: 16,
              }}
            >
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                Détail du dû aux users
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                <DetailRow label="Solde principal (rechargements + cartes reçues)" value={data.owedToUsers.principal} />
                <DetailRow label="Solde parrainage (bonus referral)" value={data.owedToUsers.referral} />
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: C.bg, borderRadius: 10, fontSize: 12, color: C.ink2 }}>
                💡 Ce sont les <strong>fonds des users</strong>, pas tes revenus. Ils doivent rester disponibles sur ton compte FedaPay
                pour pouvoir honorer leurs retraits.
              </div>
            </div>

            {/* Détail marge Donia */}
            <div
              style={{
                padding: 22,
                background: C.surface,
                borderRadius: 18,
                border: `1px solid ${C.line}`,
                marginBottom: 16,
              }}
            >
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                Détail de la marge Donia
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                <DetailRow label="Commissions cartes (5% + forfait 200)" value={data.margin.total - data.margin.cagnotteCommissions} accent={C.green} />
                <DetailRow label="Commissions cagnottes (retraits)" value={data.margin.cagnotteCommissions} accent={C.green} />
                <DetailRow label="Marge ce mois-ci" value={data.margin.thisMonth} accent={C.coral} />
              </div>
              <div style={{ marginTop: 14, padding: "10px 14px", background: C.bg, borderRadius: 10, fontSize: 12, color: C.ink2 }}>
                💡 La marge est <strong>déjà dans ton solde FedaPay</strong> (pas une 2e poche). Elle représente la part que tu peux
                retirer pour Donia <em>après</em> avoir mis de côté le dû aux users.
              </div>
            </div>

            {/* Indication retrait Donia possible */}
            <div
              style={{
                padding: 22,
                background: C.surface,
                borderRadius: 18,
                border: `1px solid ${C.line}`,
              }}
            >
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
                Combien Donia peut retirer pour elle-même
              </div>
              <div style={{ fontSize: 13, color: C.ink2, marginBottom: 12 }}>
                Solde FedaPay disponible − dû aux users = ce que NOVEKAI LTD peut sortir sans toucher aux fonds users.
              </div>
              {(() => {
                const retrait = Math.max(0, data.fedapay.available - data.owedToUsers.total);
                const positive = retrait > 0;
                return (
                  <div
                    style={{
                      padding: "16px 20px",
                      background: positive ? "rgba(92,138,69,0.10)" : "rgba(214,46,85,0.08)",
                      borderRadius: 12,
                      border: `1px solid ${positive ? "rgba(92,138,69,0.25)" : "rgba(214,46,85,0.18)"}`,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-bricolage), sans-serif",
                        fontSize: 28,
                        fontWeight: 700,
                        color: positive ? C.green : C.coralDeep,
                      }}
                    >
                      {formatNumber(retrait)} FCFA
                    </div>
                    <div style={{ fontSize: 12, color: C.ink2, marginTop: 4 }}>
                      {positive
                        ? "Tu peux retirer ce montant pour Donia (compte pro NOVEKAI LTD) sans gêner les users."
                        : "⚠️ Ne retire rien. Recharge d'abord ton compte FedaPay pour combler le déficit."}
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </>
  );
}

function KpiCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
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
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: C.ink,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
        {sub}
      </div>
    </div>
  );
}

function DetailRow({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div style={{ padding: "10px 14px", background: C.bg, borderRadius: 10 }}>
      <div style={{ fontSize: 11, color: C.ink2, fontWeight: 600 }}>{label}</div>
      <div
        style={{
          marginTop: 4,
          fontFamily: "var(--font-bricolage), sans-serif",
          fontSize: 18,
          fontWeight: 700,
          color: accent ?? C.ink,
        }}
      >
        {formatNumber(value)} FCFA
      </div>
    </div>
  );
}
