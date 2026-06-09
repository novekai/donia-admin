"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, formatNumber } from "@/lib/api";

type Subscriber = {
  id: string;
  email: string;
  source: string;
  country: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  createdAt: string;
  unsubscribedAt: string | null;
};

type ApiResp = {
  items: Subscriber[];
  nextCursor: string | null;
  stats: {
    total: number;
    last7d: number;
    last30d: number;
    bySource: { source: string; count: number }[];
  };
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsletterPage() {
  const [data, setData] = useState<ApiResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError(null);
    api
      .get<ApiResp>(`/v1/admin/newsletter${q ? `?q=${encodeURIComponent(q)}` : ""}`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError((e as { message?: string }).message ?? "Chargement impossible"));
    return () => {
      cancelled = true;
    };
  }, [q]);

  const items = data?.items ?? [];

  function exportCsv() {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE ?? "https://donia-backend-production.up.railway.app";
    const token = typeof window !== "undefined" ? window.localStorage.getItem("donia_admin_token") : null;
    // On utilise fetch + blob pour ajouter le token Bearer dans le header
    fetch(`${apiBase}/v1/admin/newsletter/export`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => alert("Export impossible"));
  }

  return (
    <>
      <TopBar
        title="Newsletter"
        subtitle={data ? `${formatNumber(data.stats.total)} abonnés actifs` : "Chargement…"}
        actions={
          <button
            onClick={exportCsv}
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

        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            {[
              { l: "Total abonnés", v: formatNumber(data.stats.total), sub: "actifs (hors désinscrits)" },
              { l: "7 derniers jours", v: formatNumber(data.stats.last7d), sub: "nouveaux" },
              { l: "30 derniers jours", v: formatNumber(data.stats.last30d), sub: "nouveaux" },
              {
                l: "Sources",
                v: `${data.stats.bySource.length}`,
                sub: data.stats.bySource.slice(0, 3).map((s) => s.source).join(", "),
              },
            ].map((s) => (
              <div key={s.l} style={{ padding: "14px 18px", background: C.surface, borderRadius: 14, border: `1px solid ${C.line}` }}>
                <div style={{ fontSize: 11, color: C.ink2, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {s.l}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "var(--font-bricolage), sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: C.ink,
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

        {/* Search */}
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par email, source, pays…"
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 12,
            border: `1px solid ${C.line}`,
            fontSize: 14,
            marginBottom: 14,
          }}
        />

        {!data && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement…
          </div>
        )}

        {data && items.length === 0 && (
          <div style={{ padding: 40, background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, textAlign: "center", color: C.ink2 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📧</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, color: C.ink }}>
              Aucun abonné pour l’instant
            </div>
          </div>
        )}

        {data && items.length > 0 && (
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 0.7fr 0.7fr 0.9fr 0.9fr",
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
              <span>Email</span>
              <span>Source</span>
              <span>Pays</span>
              <span>UTM Campaign</span>
              <span>Inscrit</span>
            </div>
            {items.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 0.7fr 0.7fr 0.9fr 0.9fr",
                  padding: "12px 20px",
                  borderBottom: i < items.length - 1 ? `1px solid ${C.line}` : 0,
                  fontSize: 12,
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "monospace", fontSize: 12, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.email}
                </span>
                <span
                  style={{
                    padding: "3px 7px",
                    borderRadius: 5,
                    background: `${C.indigo}22`,
                    color: C.indigo,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    width: "fit-content",
                  }}
                >
                  {s.source.toUpperCase()}
                </span>
                <span>{s.country ?? "—"}</span>
                <span style={{ color: C.ink2, fontSize: 11 }}>{s.utmCampaign ?? "—"}</span>
                <span style={{ fontSize: 11, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
                  {formatDate(s.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
