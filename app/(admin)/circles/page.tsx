"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, API_URL } from "@/lib/api";

// Contacts associés / Cercles — vue CRM organique du graphe relationnel.
// Un "cercle" = un utilisateur Donia + tous les contacts (emails) à qui il a déjà envoyé une carte.
// Stats globales : volume capté · taille moyenne d'un cercle · taux opt-in marketing · désinscriptions.
//
// V1.0 — endpoint backend GET /v1/admin/circles renvoie :
//   { stats, topCircles, focused: { user, contacts } }
// Si l'endpoint n'existe pas encore (backend pas redéployé), on affiche un placeholder.

type CircleStats = {
  totalContacts: number;
  avgPerUser: number;
  optInRate: number;       // 0..1
  unsubscribeRate: number; // 0..1
};

type TopCircleEntry = {
  userId: string;
  name: string;
  initial: string;
  color: "coral" | "indigo" | "mango" | "mint" | "plum" | "pink";
  contactsCount: number;
  optInCount: number;
};

type CircleContact = {
  emailMasked: string;
  source: string;        // code carte qui a capté ce contact
  optIn: boolean | null; // null = pas répondu
  interactions: number;
  status: "ACTIVE" | "UNSUBSCRIBED" | "BOUNCED";
  isDoniaUser: boolean;
};

type CirclesResponse = {
  stats: CircleStats;
  topCircles: TopCircleEntry[];
  focused: {
    user: { id: string; name: string };
    contacts: CircleContact[];
    totalContacts: number;
    optInCount: number;
  } | null;
};

const COLOR_BY_KEY: Record<TopCircleEntry["color"], string> = {
  coral: C.coral,
  indigo: C.indigo,
  mango: C.mango,
  mint: C.mint,
  plum: C.plum,
  pink: C.pink,
};

export default function CirclesPage() {
  const [data, setData] = useState<CirclesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  async function load(focusUserId?: string) {
    setError(null);
    try {
      const qs = focusUserId ? `?focusUserId=${encodeURIComponent(focusUserId)}` : "";
      const res = await api.get<CirclesResponse>(`/v1/admin/circles${qs}`);
      setData(res);
      if (!focusUserId && res.topCircles[0]) setSelectedUserId(res.topCircles[0].userId);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Chargement impossible");
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (selectedUserId) load(selectedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  function exportCsv() {
    window.location.href = `${API_URL}/v1/admin/circles/export.csv${
      selectedUserId ? `?focusUserId=${selectedUserId}` : ""
    }`;
  }

  return (
    <>
      <TopBar
        title="Contacts associés · Cercles"
        subtitle="Graphe relationnel · CRM organique"
        actions={
          <button
            onClick={exportCsv}
            disabled={!data}
            style={{
              padding: "8px 14px",
              borderRadius: 10,
              background: C.indigoDeep,
              color: C.creamSoft,
              border: 0,
              cursor: data ? "pointer" : "not-allowed",
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 600,
              fontSize: 13,
              opacity: data ? 1 : 0.5,
            }}
          >
            Export CSV (RGPD)
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
            <div style={{ marginTop: 4, fontSize: 11, color: C.ink2 }}>
              L'endpoint <code>/v1/admin/circles</code> n'est peut-être pas encore déployé sur Railway.
            </div>
          </div>
        )}

        {!data && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement du graphe relationnel…
          </div>
        )}

        {data && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
              <Kpi label="Contacts captés" value={data.stats.totalContacts.toLocaleString("fr-FR")} sub="cercles cumulés" emoji="📇" color={C.indigo} />
              <Kpi label="Cercle moyen" value={data.stats.avgPerUser.toFixed(1)} sub="contacts / utilisateur" emoji="🔵" color={C.coral} />
              <Kpi label="Consentement" value={`${Math.round(data.stats.optInRate * 100)} %`} sub="opt-in marketing" emoji="✅" color={C.green} />
              <Kpi label="Désinscriptions" value={`${(data.stats.unsubscribeRate * 100).toFixed(1)} %`} sub="sous le seuil 1 %" emoji="⏏️" color={C.mango} />
            </div>

            {/* Layout : top cercles à gauche, détail du cercle sélectionné à droite */}
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>
              {/* Top cercles */}
              <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, padding: 16 }}>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
                  Top cercles
                </div>
                {data.topCircles.length === 0 ? (
                  <div style={{ color: C.ink2, fontStyle: "italic", fontSize: 13, padding: 12 }}>
                    Aucun cercle pour l'instant.
                  </div>
                ) : (
                  data.topCircles.map((c) => {
                    const on = selectedUserId === c.userId;
                    return (
                      <button
                        key={c.userId}
                        onClick={() => setSelectedUserId(c.userId)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "10px 12px",
                          borderRadius: 10,
                          border: 0,
                          background: on ? "rgba(214,46,85,0.06)" : "transparent",
                          cursor: "pointer",
                          marginBottom: 4,
                          textAlign: "left",
                          fontFamily: "inherit",
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            background: COLOR_BY_KEY[c.color],
                            color: C.creamSoft,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-fraunces), serif",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          {c.initial}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13, color: C.ink }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: 11, color: C.ink2 }}>
                            {c.contactsCount} contacts · {c.optInCount} opt-in
                          </div>
                        </div>
                        <span style={{ fontSize: 11, color: on ? C.coral : C.ink3, fontFamily: "var(--font-fraunces), serif" }}>Voir →</span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Cercle détaillé */}
              <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, padding: 20 }}>
                {data.focused ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 15 }}>
                        Cercle de <span style={{ color: C.coral }}>{data.focused.user.name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.ink2 }}>
                        {data.focused.totalContacts} contacts · {data.focused.optInCount} opt-in
                      </div>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ textAlign: "left", color: C.ink2, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                          <th style={th}>Email</th>
                          <th style={th}>Source</th>
                          <th style={th}>Opt-in</th>
                          <th style={{ ...th, textAlign: "right" }}>Interac.</th>
                          <th style={{ ...th, textAlign: "right" }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.focused.contacts.map((c, i) => (
                          <tr key={i} style={{ borderTop: `1px solid ${C.line}` }}>
                            <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>
                              {c.emailMasked}
                              {c.isDoniaUser && (
                                <span style={badgeDonia}>DONIA</span>
                              )}
                            </td>
                            <td style={{ ...td, color: C.indigo, fontFamily: "monospace", fontSize: 12 }}>{c.source}</td>
                            <td style={td}>
                              {c.optIn === true ? (
                                <span style={{ color: C.green, fontWeight: 600 }}>✓ Oui</span>
                              ) : c.optIn === false ? (
                                <span style={{ color: C.ink3 }}>Non</span>
                              ) : (
                                <span style={{ color: C.ink3, fontStyle: "italic" }}>—</span>
                              )}
                            </td>
                            <td style={{ ...td, textAlign: "right", fontWeight: 600 }}>{c.interactions}</td>
                            <td style={{ ...td, textAlign: "right" }}>
                              <StatusBadge status={c.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ marginTop: 18, padding: 10, background: "rgba(92,138,69,0.08)", borderRadius: 10, fontSize: 11, color: C.green }}>
                      🔒 Emails partiellement masqués · droit à l'oubli appliqué en 1 clic via lien de désinscription.
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontSize: 13 }}>
                    Sélectionne un cercle à gauche pour voir ses contacts.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Kpi({ label, value, sub, emoji, color }: { label: string; value: string; sub: string; emoji: string; color: string }) {
  return (
    <div style={{ padding: 18, background: C.surface, borderRadius: 16, border: `1px solid ${C.line}`, position: "relative" }}>
      <div style={{ fontSize: 11, color: C.ink2, letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div style={{ marginTop: 8, fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 28, color: C.ink }}>{value}</div>
      <div style={{ marginTop: 2, fontSize: 11, color: C.ink3, fontStyle: "italic" }}>{sub}</div>
      <div style={{ position: "absolute", top: 16, right: 16, width: 30, height: 30, borderRadius: 10, background: `${color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
        {emoji}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CircleContact["status"] }) {
  const map = {
    ACTIVE: { label: "ACTIF", bg: "rgba(92,138,69,0.16)", fg: C.green },
    UNSUBSCRIBED: { label: "DÉSINSCRIT", bg: "rgba(42,15,26,0.10)", fg: C.ink2 },
    BOUNCED: { label: "BOUNCE", bg: "rgba(214,46,85,0.12)", fg: C.coralDeep },
  }[status];
  return (
    <span style={{ padding: "3px 8px", borderRadius: 5, background: map.bg, color: map.fg, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}>
      {map.label}
    </span>
  );
}

const th: React.CSSProperties = { padding: "10px 8px", fontWeight: 600 };
const td: React.CSSProperties = { padding: "10px 8px", color: C.ink };
const badgeDonia: React.CSSProperties = {
  marginLeft: 6,
  padding: "1px 6px",
  borderRadius: 4,
  background: "rgba(65,8,123,0.14)",
  color: C.indigo,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.05em",
};
