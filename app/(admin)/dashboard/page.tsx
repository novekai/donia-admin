"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { KPI } from "@/components/KPI";
import { TopBar } from "@/components/TopBar";
import { api, compactNumber, formatNumber } from "@/lib/api";

type Stats = {
  kpis: {
    users: { value: number; delta: number; positive: boolean };
    cards: { value: number; delta: number; positive: boolean };
    volume: { value: number; delta: number; positive: boolean };
    commissions: { value: number; delta: number; positive: boolean };
  };
  bars: { m: string; sent: number; converted: number }[];
  topCards: { name: string; count: number }[];
  alerts: { kycPending: number; articleDrafts: number; anonymesReported: number };
};

const CARD_META: Record<string, { emoji: string; color: string }> = {
  anniversaire: { emoji: "🎂", color: C.coral },
  bonjour: { emoji: "👋", color: C.coral },
  bravo: { emoji: "🏆", color: C.mango },
  noel: { emoji: "🎄", color: C.mint },
  mariage: { emoji: "💍", color: C.indigo },
  tabaski: { emoji: "🌙", color: C.indigo },
  jetaime: { emoji: "💖", color: C.pink },
  "saint-valentin": { emoji: "💖", color: C.pink },
  condoleances: { emoji: "🕊️", color: C.plum },
  naissance: { emoji: "👶", color: "#6FB5D4" },
  goshop: { emoji: "🛍️", color: C.surface },
};

function metaFor(themeKey: string) {
  return CARD_META[themeKey.toLowerCase()] ?? { emoji: "🎁", color: C.coral };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<Stats>("/v1/admin/stats")
      .then((s) => {
        if (!cancelled) setStats(s);
      })
      .catch((e) => {
        if (!cancelled) setError((e as { message?: string }).message ?? "Chargement impossible");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <TopBar
        title="Tableau de bord"
        subtitle={`${today} · Vue d'ensemble`}
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

        {!stats && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement des statistiques…
          </div>
        )}

        {stats && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              <KPI
                label="Utilisateurs"
                value={formatNumber(stats.kpis.users.value)}
                delta={`${stats.kpis.users.positive ? "+" : ""}${stats.kpis.users.delta}% / mois`}
                deltaPositive={stats.kpis.users.positive}
                accent={C.coral}
                sub="vs mois dernier"
                icon="👥"
              />
              <KPI
                label="Cartes envoyées"
                value={formatNumber(stats.kpis.cards.value)}
                delta={`${stats.kpis.cards.positive ? "+" : ""}${stats.kpis.cards.delta}% / mois`}
                deltaPositive={stats.kpis.cards.positive}
                accent={C.pink}
                sub="ce mois-ci"
                icon="🎁"
              />
              <KPI
                label="Volume transité"
                value={compactNumber(stats.kpis.volume.value)}
                delta={`${stats.kpis.volume.positive ? "+" : ""}${stats.kpis.volume.delta}% / mois`}
                deltaPositive={stats.kpis.volume.positive}
                accent={C.mango}
                sub="FCFA · ce mois"
                icon="💰"
              />
              <KPI
                label="Commissions"
                value={compactNumber(stats.kpis.commissions.value)}
                delta={`${stats.kpis.commissions.positive ? "+" : ""}${stats.kpis.commissions.delta}% / mois`}
                deltaPositive={stats.kpis.commissions.positive}
                accent={C.mint}
                sub="FCFA · ce mois"
                icon="✨"
              />
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
                <BarsChart bars={stats.bars} />
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
                {stats.topCards.length === 0 && (
                  <div style={{ padding: 24, textAlign: "center", color: C.ink3, fontSize: 13 }}>
                    Aucune carte envoyée sur la période.
                  </div>
                )}
                {stats.topCards.map((t) => {
                  const m = metaFor(t.name);
                  const max = stats.topCards[0]?.count ?? 1;
                  const pct = Math.round((t.count / max) * 100);
                  return (
                    <div key={t.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 10,
                          background: `${m.color}22`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                        }}
                      >
                        {m.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                          <span style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>
                            {t.name}
                          </span>
                          <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontSize: 13, fontWeight: 700 }}>{t.count}</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, background: "rgba(42,15,26,0.06)", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 99 }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alerts */}
            <div style={{ marginTop: 20, padding: 24, background: C.surface, borderRadius: 20, border: `1px solid ${C.line}`, maxWidth: 480 }}>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600, letterSpacing: "-0.01em", marginBottom: 14 }}>
                À traiter
              </div>
              {[
                { l: "KYC en attente", v: stats.alerts.kycPending, color: C.coral, emoji: "🪪", href: "/kyc" },
                { l: "Brouillons d'articles", v: stats.alerts.articleDrafts, color: C.mango, emoji: "✎", href: "/blog" },
                { l: "Messages anonymes signalés", v: stats.alerts.anonymesReported, color: C.coralDeep, emoji: "⚠️", href: "/anonymes" },
              ].map((a, i, arr) => (
                <a
                  key={a.l}
                  href={a.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : 0,
                    color: C.ink,
                    textDecoration: "none",
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
                    <div style={{ fontSize: 11, color: C.ink2 }}>
                      {a.v === 0 ? "Rien en attente" : `${a.v} en attente`}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: 99,
                      background: a.v > 0 ? a.color : "transparent",
                      color: a.v > 0 ? C.creamSoft : C.ink3,
                      border: a.v > 0 ? 0 : `1px solid ${C.line}`,
                      fontSize: 11,
                      fontWeight: 700,
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    {a.v > 0 ? "Traiter →" : "OK"}
                  </span>
                </a>
              ))}
            </div>
          </>
        )}
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

function BarsChart({ bars }: { bars: { m: string; sent: number; converted: number }[] }) {
  const max = Math.max(1, ...bars.flatMap((b) => [b.sent, b.converted]));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 200, paddingTop: 12 }}>
      {bars.map((d) => (
        <div key={d.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, flex: 1, width: "100%" }}>
            <div
              style={{
                flex: 1,
                height: `${(d.sent / max) * 100}%`,
                background: "linear-gradient(180deg, #F4486F 0%, #D62E55 100%)",
                borderRadius: "8px 8px 4px 4px",
                minHeight: 4,
              }}
              title={`Envoyées : ${d.sent}`}
            />
            <div
              style={{
                flex: 1,
                height: `${(d.converted / max) * 100}%`,
                background: "linear-gradient(180deg, #F9A01C 0%, #D9871F 100%)",
                borderRadius: "8px 8px 4px 4px",
                minHeight: 4,
              }}
              title={`Converties : ${d.converted}`}
            />
          </div>
          <span style={{ fontSize: 11, color: C.ink2, fontWeight: 600 }}>{d.m}</span>
        </div>
      ))}
    </div>
  );
}
