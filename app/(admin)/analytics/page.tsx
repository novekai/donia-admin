"use client";

import { useEffect, useMemo, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, formatNumber } from "@/lib/api";

type Stats = {
  range: { days: number; since: string };
  totalVisits: number;
  uniqueSessions: number;
  topPages: { path: string; count: number }[];
  byCountry: { country: string; count: number }[];
  byDevice: { device: string; count: number }[];
  byBrowser: { browser: string; count: number }[];
  bySource: { referrer: string; count: number }[];
  byUtm: { utmSource: string; utmCampaign: string | null; count: number }[];
  daily: { day: string; count: number }[];
};

const RANGES = [
  { label: "7j", value: 7 },
  { label: "30j", value: 30 },
  { label: "90j", value: 90 },
  { label: "365j", value: 365 },
];

const FLAGS: Record<string, string> = {
  BJ: "🇧🇯", CI: "🇨🇮", SN: "🇸🇳", TG: "🇹🇬", BF: "🇧🇫", ML: "🇲🇱", NE: "🇳🇪",
  CM: "🇨🇲", GH: "🇬🇭", GN: "🇬🇳", FR: "🇫🇷", BE: "🇧🇪", CA: "🇨🇦", US: "🇺🇸",
  GB: "🇬🇧", DE: "🇩🇪", CH: "🇨🇭", ES: "🇪🇸", IT: "🇮🇹", PT: "🇵🇹",
};

export default function AnalyticsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setData(null);
    api
      .get<Stats>(`/v1/admin/analytics/site?days=${days}`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError((e as { message?: string }).message ?? "Chargement impossible"));
    return () => {
      cancelled = true;
    };
  }, [days]);

  const maxDaily = useMemo(() => Math.max(1, ...(data?.daily.map((d) => d.count) ?? [1])), [data]);

  return (
    <>
      <TopBar
        title="Analytics site"
        subtitle={
          data
            ? `${formatNumber(data.totalVisits)} visites · ${formatNumber(data.uniqueSessions)} sessions uniques sur ${days}j`
            : "Chargement…"
        }
        actions={
          <div style={{ display: "flex", gap: 6 }}>
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setDays(r.value)}
                style={{
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 10,
                  background: days === r.value ? C.indigo : C.surface,
                  color: days === r.value ? C.creamSoft : C.ink,
                  border: days === r.value ? 0 : `1px solid ${C.line}`,
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
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
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement…
          </div>
        )}

        {data && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              {[
                { l: "Visites totales", v: formatNumber(data.totalVisits), sub: `${days} derniers jours` },
                { l: "Sessions uniques", v: formatNumber(data.uniqueSessions), sub: "déduplifiées" },
                { l: "Pages vues / session", v: data.uniqueSessions > 0 ? (data.totalVisits / data.uniqueSessions).toFixed(1) : "—", sub: "moyenne" },
                { l: "Top pays", v: data.byCountry[0]?.country ? `${FLAGS[data.byCountry[0].country] ?? ""} ${data.byCountry[0].country}` : "—", sub: `${data.byCountry[0]?.count ?? 0} visites` },
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

            {/* Daily sparkline */}
            <Card title="Visites par jour" subtitle={`${data.daily.length} jours de données`}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100 }}>
                {data.daily.map((d) => (
                  <div
                    key={d.day}
                    title={`${d.day} : ${d.count} visites`}
                    style={{
                      flex: 1,
                      minWidth: 4,
                      height: `${Math.max(2, (d.count / maxDaily) * 100)}%`,
                      background: C.coral,
                      borderRadius: 3,
                    }}
                  />
                ))}
              </div>
              <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 10, color: C.ink2 }}>
                <span>{data.daily[0]?.day ?? ""}</span>
                <span>{data.daily[data.daily.length - 1]?.day ?? ""}</span>
              </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              <Card title="Top pages" subtitle="Les pages les plus visitées">
                <RankedList items={data.topPages.map((p) => ({ label: p.path, count: p.count }))} accent={C.coral} />
              </Card>

              <Card title="Top pays" subtitle="D'où viennent tes visiteurs">
                <RankedList
                  items={data.byCountry.map((c) => ({
                    label: `${FLAGS[c.country] ?? "🌍"} ${c.country}`,
                    count: c.count,
                  }))}
                  accent={C.indigo}
                />
              </Card>

              <Card title="Appareils" subtitle="Mobile / Desktop / Tablette">
                <RankedList items={data.byDevice.map((d) => ({ label: d.device, count: d.count }))} accent={C.mint} />
              </Card>

              <Card title="Navigateurs" subtitle="Top des navigateurs">
                <RankedList items={data.byBrowser.map((b) => ({ label: b.browser, count: b.count }))} accent={C.mango} />
              </Card>

              <Card title="Référents" subtitle="D'où viennent tes visiteurs (Instagram, WhatsApp, etc.)">
                <RankedList
                  items={data.bySource.map((s) => ({
                    label: shortenReferrer(s.referrer),
                    count: s.count,
                  }))}
                  accent={C.plum}
                />
              </Card>

              <Card title="Campagnes UTM" subtitle="Sources de tes campagnes marketing">
                <RankedList
                  items={data.byUtm.map((u) => ({
                    label: `${u.utmSource}${u.utmCampaign ? ` · ${u.utmCampaign}` : ""}`,
                    count: u.count,
                  }))}
                  accent={C.pink}
                />
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: 24, background: C.surface, borderRadius: 18, border: `1px solid ${C.line}` }}>
      <div>
        <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.ink2, marginTop: 2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
          {subtitle}
        </div>
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function RankedList({ items, accent }: { items: { label: string; count: number }[]; accent: string }) {
  if (items.length === 0) {
    return <div style={{ padding: 20, textAlign: "center", color: C.ink2, fontStyle: "italic", fontSize: 13 }}>Pas encore de données</div>;
  }
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${(item.count / max) * 100}%`,
              background: `${accent}1c`,
              borderRadius: 6,
            }}
          />
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 12px",
              fontSize: 13,
            }}
          >
            <span style={{ color: C.ink, fontFamily: "monospace", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }}>
              {item.label}
            </span>
            <span style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, color: accent }}>
              {item.count.toLocaleString("fr-FR").replace(/,/g, " ")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function shortenReferrer(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 40);
  }
}
