"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, formatNumber } from "@/lib/api";

type Status = "ACTIVE" | "CLOSED" | "CANCELLED";

type Cagnotte = {
  id: string;
  title: string;
  description: string | null;
  goalAmount: number;
  totalRaised: number;
  deadline: string | null;
  status: Status;
  publicCode: string | null;
  commissionPercent: number;
  withdrawnAt: string | null;
  withdrawnAmount: number | null;
  createdAt: string;
  owner: { id: string; name: string };
  contributionCount: number;
};

type ApiResp = {
  items: Cagnotte[];
  nextCursor: string | null;
  stats: { total: number; active: number; closed: number; cancelled: number; totalRaisedAll: number; totalCommissions: number };
};

const STATUS_MAP: Record<Status, { label: string; bg: string; color: string }> = {
  ACTIVE: { label: "EN COURS", bg: "rgba(249,160,28,0.18)", color: "#A66E0E" },
  CLOSED: { label: "CLÔTURÉE", bg: "rgba(92,138,69,0.15)", color: C.green },
  CANCELLED: { label: "ANNULÉE", bg: "rgba(214,46,85,0.15)", color: C.coralDeep },
};

const FILTERS: { key: "all" | Status; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "ACTIVE", label: "En cours" },
  { key: "CLOSED", label: "Clôturées" },
  { key: "CANCELLED", label: "Annulées" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CagnottesPage() {
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [data, setData] = useState<ApiResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  function load() {
    setError(null);
    api
      .get<ApiResp>(`/v1/admin/cagnottes?status=${filter}`)
      .then((d) => setData(d))
      .catch((e) => setError((e as { message?: string }).message ?? "Chargement impossible"));
  }

  useEffect(() => {
    setData(null);
    load();
  }, [filter]);

  async function action(id: string, kind: "close" | "cancel") {
    const label = kind === "close" ? "clôturer" : "annuler";
    if (!confirm(`Confirmer : ${label} cette cagnotte ?`)) return;
    setBusy(id);
    try {
      await api.post(`/v1/admin/cagnottes/${id}/${kind}`, {});
      load();
    } catch (e) {
      alert((e as { message?: string }).message ?? "Action impossible");
    } finally {
      setBusy(null);
    }
  }

  const items = data?.items ?? [];

  return (
    <>
      <TopBar
        title="Cagnottes"
        subtitle={data ? `${data.stats.active} actives · ${formatNumber(data.stats.totalRaisedAll)} FCFA collectés au total` : "Chargement…"}
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

        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { l: "Total", v: formatNumber(data.stats.total), sub: "toutes confondues" },
              { l: "En cours", v: formatNumber(data.stats.active), sub: "actives" },
              { l: "Clôturées", v: formatNumber(data.stats.closed), sub: "terminées" },
              { l: "Collecté total", v: `${formatNumber(data.stats.totalRaisedAll)} FCFA`, sub: "depuis lancement" },
              { l: "Commissions Donia", v: `${formatNumber(data.stats.totalCommissions)} FCFA`, sub: "encaissées (retraits)", green: true },
            ].map((s) => (
              <div key={s.l} style={{ padding: "14px 18px", background: C.surface, borderRadius: 14, border: `1px solid ${C.line}` }}>
                <div style={{ fontSize: 11, color: C.ink2, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.l}</div>
                <div style={{ marginTop: 6, fontFamily: "var(--font-bricolage), sans-serif", fontSize: 22, fontWeight: 700, color: s.green ? C.green : C.ink }}>
                  {s.v}
                </div>
                <div style={{ fontSize: 11, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif", marginTop: 2 }}>
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        )}

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
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic" }}>Chargement…</div>
        )}

        {data && items.length === 0 && (
          <div style={{ padding: 40, background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎁</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600 }}>Aucune cagnotte</div>
          </div>
        )}

        {data && items.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {items.map((c) => {
              const pct = c.goalAmount > 0 ? Math.min(100, (c.totalRaised / c.goalAmount) * 100) : 0;
              const sm = STATUS_MAP[c.status];
              return (
                <div
                  key={c.id}
                  style={{
                    padding: 18,
                    background: C.surface,
                    borderRadius: 14,
                    border: `1px solid ${C.line}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600 }}>{c.title}</span>
                        <span
                          style={{
                            padding: "3px 7px",
                            borderRadius: 5,
                            background: sm.bg,
                            color: sm.color,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {sm.label}
                        </span>
                      </div>
                      <div style={{ marginTop: 2, fontSize: 12, color: C.ink2 }}>
                        Par <strong>{c.owner.name}</strong> · {c.contributionCount} contrib. · {formatDate(c.createdAt)}
                      </div>
                      {c.publicCode && (
                        <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, color: C.ink2 }}>Lien public :</span>
                          <a
                            href={`https://doniia.com/c/${c.publicCode}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: 11, color: C.indigo, fontFamily: "monospace", textDecoration: "underline" }}
                          >
                            doniia.com/c/{c.publicCode}
                          </a>
                        </div>
                      )}
                      {c.description && (
                        <div style={{ marginTop: 6, fontSize: 13, color: C.ink2, fontStyle: "italic" }}>{c.description}</div>
                      )}
                      {c.withdrawnAt && c.withdrawnAmount !== null && (
                        <div style={{ marginTop: 6, padding: "6px 10px", background: "rgba(92,138,69,0.10)", borderRadius: 6, fontSize: 11, color: C.green, fontWeight: 600 }}>
                          ✓ Retrait effectué : {formatNumber(c.withdrawnAmount)} FCFA (commission Donia {formatNumber(c.totalRaised - c.withdrawnAmount)} FCFA · {c.commissionPercent}%) — {formatDate(c.withdrawnAt)}
                        </div>
                      )}
                    </div>
                    {c.status === "ACTIVE" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => action(c.id, "close")}
                          disabled={busy === c.id}
                          style={{
                            height: 30,
                            padding: "0 10px",
                            borderRadius: 8,
                            background: C.green,
                            color: C.creamSoft,
                            border: 0,
                            fontFamily: "var(--font-fraunces), serif",
                            fontWeight: 600,
                            fontSize: 11,
                            cursor: busy === c.id ? "not-allowed" : "pointer",
                          }}
                        >
                          ✓ Clôturer
                        </button>
                        <button
                          onClick={() => action(c.id, "cancel")}
                          disabled={busy === c.id}
                          style={{
                            height: 30,
                            padding: "0 10px",
                            borderRadius: 8,
                            background: "transparent",
                            color: C.coralDeep,
                            border: `1px solid ${C.coralDeep}`,
                            fontFamily: "var(--font-fraunces), serif",
                            fontWeight: 600,
                            fontSize: 11,
                            cursor: busy === c.id ? "not-allowed" : "pointer",
                          }}
                        >
                          ✕ Annuler
                        </button>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, color: C.ink }}>
                      {formatNumber(c.totalRaised)} FCFA
                    </span>
                    <span style={{ color: C.ink2 }}>
                      / {formatNumber(c.goalAmount)} FCFA ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: C.bg, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: C.coral, borderRadius: 99 }} />
                  </div>
                  {c.deadline && (
                    <div style={{ marginTop: 8, fontSize: 11, color: C.ink2, fontStyle: "italic" }}>
                      Clôture prévue : {new Date(c.deadline).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
