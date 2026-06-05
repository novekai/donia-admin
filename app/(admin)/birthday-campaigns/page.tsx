"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api } from "@/lib/api";

// Campagnes anniversaire — séquence automatique J-7 / J-5 / J-1 / Jour J.
// Stats globales + édition des templates par étape.
// Backend : GET /v1/admin/birthday-campaigns → { stats, sequence, templates }
//           PATCH /v1/admin/birthday-campaigns/sequence/:stage → { enabled }

type Stage = "J7" | "J5" | "J1" | "J0";

type CampaignStats = {
  emailsSent30d: number;
  openRate: number;       // 0..1
  conversionRate: number; // 0..1
  spamRate: number;       // 0..1 (alerte si > 0.5%)
};

type SequenceStep = {
  stage: Stage;
  label: string;
  hint: string;
  enabled: boolean;
  openRate: number;
  clickRate: number;
};

type Template = {
  stage: Stage;
  subject: string;
  body: string;
  ctaLabel: string;
  variables: string[]; // ex: ['PRENOM_DESTINATAIRE', 'DATE_ANNIVERSAIRE']
};

type CampaignsResponse = {
  stats: CampaignStats;
  sequence: SequenceStep[];
  templates: Template[];
};

const STAGE_INFO: Record<Stage, { title: string; sub: string; color: string }> = {
  J7: { title: "J-7 · Teaser", sub: "7 jours avant", color: C.ink2 },
  J5: { title: "J-5 · Relance principale", sub: "5 jours avant", color: C.coral },
  J1: { title: "J-1 · Rappel", sub: "1 jour avant", color: C.mango },
  J0: { title: "Jour J · Anniversaire", sub: "le jour même", color: C.pink },
};

export default function BirthdayCampaignsPage() {
  const [data, setData] = useState<CampaignsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<Stage>("J5");
  const [savingStage, setSavingStage] = useState<Stage | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await api.get<CampaignsResponse>("/v1/admin/birthday-campaigns");
      setData(res);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Chargement impossible");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStage(stage: Stage, next: boolean) {
    if (!data) return;
    setSavingStage(stage);
    // Optimistic
    setData({
      ...data,
      sequence: data.sequence.map((s) => (s.stage === stage ? { ...s, enabled: next } : s)),
    });
    try {
      await api.patch(`/v1/admin/birthday-campaigns/sequence/${stage}`, { enabled: next });
    } catch (e) {
      alert((e as { message?: string }).message ?? "Sauvegarde impossible");
      load();
    } finally {
      setSavingStage(null);
    }
  }

  const selectedTemplate = data?.templates.find((t) => t.stage === selectedStage) ?? null;

  return (
    <>
      <TopBar
        title="Campagnes anniversaire"
        subtitle="Relances automatiques · J-7 / J-5 / J-1 / Jour J"
        actions={
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => alert("Test template — endpoint à implémenter en V1.1")}
              disabled={!data}
              style={btnGhost}
            >
              Tester un template
            </button>
            <button onClick={() => alert("Nouvelle occasion — à implémenter en V1.1")} disabled={!data} style={btnPrimary}>
              + Nouvelle occasion
            </button>
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
            <div style={{ marginTop: 4, fontSize: 11, color: C.ink2 }}>
              L'endpoint <code>/v1/admin/birthday-campaigns</code> n'est peut-être pas encore déployé sur Railway.
            </div>
          </div>
        )}

        {!data && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement des campagnes…
          </div>
        )}

        {data && (
          <>
            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
              <Kpi label="Emails envoyés (30j)" value={data.stats.emailsSent30d.toLocaleString("fr-FR")} sub="anniversaires" emoji="📨" color={C.coral} />
              <Kpi label="Taux d'ouverture" value={`${Math.round(data.stats.openRate * 100)} %`} sub={`cible 35 % ${data.stats.openRate >= 0.35 ? "✓" : "⚠"}`} emoji="📬" color={C.indigo} />
              <Kpi label="Conversion" value={`${(data.stats.conversionRate * 100).toFixed(1)} %`} sub="clic → carte envoyée" emoji="🎯" color={C.green} />
              <Kpi
                label="Plaintes spam"
                value={`${(data.stats.spamRate * 100).toFixed(2)} %`}
                sub={`sous seuil 0,5 % ${data.stats.spamRate <= 0.005 ? "✓" : "⚠"}`}
                emoji="🛡️"
                color={data.stats.spamRate > 0.005 ? C.coralDeep : C.mint}
              />
            </div>

            {/* Layout : séquence à gauche, template editor à droite */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 460px", gap: 16 }}>
              {/* Séquence */}
              <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, padding: 18 }}>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 15, marginBottom: 12 }}>
                  Séquence automatique
                </div>
                {data.sequence.map((s) => {
                  const info = STAGE_INFO[s.stage];
                  const on = selectedStage === s.stage;
                  return (
                    <button
                      key={s.stage}
                      onClick={() => setSelectedStage(s.stage)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "12px 12px",
                        borderRadius: 12,
                        border: 0,
                        background: on ? "rgba(214,46,85,0.06)" : "transparent",
                        cursor: "pointer",
                        marginBottom: 4,
                        textAlign: "left",
                        fontFamily: "inherit",
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: info.color, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 14, color: C.ink }}>
                          {info.title}
                        </div>
                        <div style={{ fontSize: 11, color: C.ink2, marginTop: 2 }}>
                          {info.sub} · ouverture {Math.round(s.openRate * 100)} % · clic {Math.round(s.clickRate * 100)} %
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStage(s.stage, !s.enabled);
                        }}
                        disabled={savingStage === s.stage}
                        style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}
                        aria-label={`Toggle ${info.title}`}
                      >
                        <StaticToggle on={s.enabled} />
                      </button>
                    </button>
                  );
                })}

                <div style={{ marginTop: 12, padding: 10, background: "rgba(255,199,0,0.10)", borderRadius: 10, fontSize: 11, color: C.ink2 }}>
                  ⚠️ Anti-spam : max 1 email / occasion / contact / an · cap 3 / semaine · gel auto si plaintes &gt; 0,5 %.
                </div>
              </div>

              {/* Template editor */}
              <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 15 }}>
                    Template · {STAGE_INFO[selectedStage].title}
                  </div>
                  <button
                    onClick={() => alert("Éditeur HTML / drag & drop — V1.1")}
                    style={{ background: "none", border: 0, color: C.coral, fontWeight: 600, fontSize: 12, cursor: "pointer", fontFamily: "var(--font-fraunces), serif" }}
                  >
                    Éditer
                  </button>
                </div>

                {selectedTemplate ? (
                  <>
                    <div
                      style={{
                        background: C.indigoDeep,
                        color: C.creamSoft,
                        borderRadius: 14,
                        padding: 22,
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 13, color: C.creamSoft, opacity: 0.85, marginBottom: 4 }}>
                        donia
                      </div>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>🎂</div>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 18 }}>
                        {selectedTemplate.subject}
                      </div>
                    </div>

                    <div style={{ marginTop: 12, fontSize: 12, color: C.ink2, lineHeight: 1.5 }}>
                      {selectedTemplate.body}
                    </div>

                    <button
                      style={{
                        marginTop: 12,
                        width: "100%",
                        background: C.coral,
                        color: C.creamSoft,
                        border: 0,
                        padding: "14px 16px",
                        borderRadius: 12,
                        fontFamily: "var(--font-fraunces), serif",
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      🎁 {selectedTemplate.ctaLabel}
                    </button>

                    <div style={{ marginTop: 8, textAlign: "center", fontSize: 10, color: C.ink3, fontStyle: "italic" }}>
                      [LIEN_DÉSABONNEMENT] · se désabonner en 1 clic
                    </div>

                    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.line}` }}>
                      <div style={{ fontSize: 11, color: C.ink2, marginBottom: 6, fontFamily: "var(--font-fraunces), serif", fontStyle: "italic" }}>
                        Variables
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {selectedTemplate.variables.map((v) => (
                          <span
                            key={v}
                            style={{
                              padding: "3px 7px",
                              borderRadius: 5,
                              background: "rgba(214,46,85,0.10)",
                              color: C.coralDeep,
                              fontSize: 10,
                              fontFamily: "monospace",
                              fontWeight: 600,
                            }}
                          >
                            [{v}]
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontSize: 13 }}>
                    Aucun template pour cette étape.
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

function StaticToggle({ on }: { on: boolean }) {
  return (
    <div style={{ width: 38, height: 22, borderRadius: 99, background: on ? C.green : "rgba(42,15,26,0.15)", position: "relative", flexShrink: 0, transition: "background .15s" }}>
      <div style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 18, height: 18, borderRadius: "50%", background: C.creamSoft, transition: "left .15s" }} />
    </div>
  );
}

const btnGhost: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 10,
  background: C.surface,
  color: C.ink,
  border: `1px solid ${C.line}`,
  cursor: "pointer",
  fontFamily: "var(--font-fraunces), serif",
  fontWeight: 500,
  fontSize: 13,
};

const btnPrimary: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 10,
  background: C.coral,
  color: C.creamSoft,
  border: 0,
  cursor: "pointer",
  fontFamily: "var(--font-fraunces), serif",
  fontWeight: 600,
  fontSize: 13,
};
