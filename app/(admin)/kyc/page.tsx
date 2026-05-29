import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";

const PENDING = [
  { n: "Marie Dossou", doc: "CNI · Bénin", date: "2 heures", i: "M", c: C.pink },
  { n: "Fatou Ndiaye", doc: "Passeport · Sénégal", date: "5 heures", i: "F", c: C.indigo },
  { n: "Ibrahim Sow", doc: "CNI · Bénin", date: "1 jour", i: "I", c: C.mint },
  { n: "Chantal Eboumbou", doc: "CNI · Cameroun", date: "2 jours", i: "C", c: C.mango, ink: C.ink },
];

const FIELDS = [
  { l: "Nom", v: "Dossou", match: true },
  { l: "Prénom", v: "Marie", match: true },
  { l: "Date naissance", v: "22 juil. 1992", match: true },
  { l: "Pays", v: "Bénin", match: true },
];

export default function KycPage() {
  return (
    <>
      <TopBar
        title="KYC à valider"
        subtitle="4 documents en attente · délai moyen : 2h"
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
            }}
          >
            Valider tout (4)
          </button>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
          {/* Queue */}
          <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 600,
                fontSize: 14,
                background: C.bg,
              }}
            >
              En attente · 4
            </div>
            {PENDING.map((p, i) => (
              <div
                key={p.n}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 20px",
                  borderBottom: i < PENDING.length - 1 ? `1px solid ${C.line}` : 0,
                  background: i === 0 ? "rgba(244,72,111,0.06)" : "transparent",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: p.c,
                    color: p.ink ?? C.creamSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-fraunces), serif",
                    fontWeight: 600,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {p.i}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 14 }}>{p.n}</div>
                  <div style={{ fontSize: 12, color: C.ink2 }}>
                    {p.doc} · il y a {p.date}
                  </div>
                </div>
                {i === 0 ? (
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: 5,
                      background: C.coral,
                      color: C.creamSoft,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    EN COURS
                  </span>
                ) : (
                  <button
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: "transparent",
                      border: `1px solid ${C.line}`,
                      color: C.ink,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    Examiner →
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Active review */}
          <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, padding: 24, position: "sticky", top: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: C.pink,
                  color: C.creamSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 600,
                  fontSize: 22,
                }}
              >
                M
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 500 }}>Marie Dossou</div>
                <div style={{ fontSize: 12, color: C.ink2, fontFamily: "monospace" }}>+229 95 11 03 42 · 🇧🇯</div>
              </div>
            </div>

            {/* Doc preview placeholder */}
            <div
              style={{
                aspectRatio: "1.6",
                borderRadius: 14,
                background: "linear-gradient(135deg, #41087B 0%, #2A0454 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: C.mango,
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontSize: 13,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", inset: 16, border: "1px dashed rgba(249,160,28,0.4)", borderRadius: 8 }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 4 }}>🪪</div>
                <div>Carte nationale d&rsquo;identité</div>
                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>recto · soumis il y a 2 heures</div>
              </div>
            </div>

            {/* Extracted fields */}
            <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
              {FIELDS.map((f) => (
                <div key={f.l} style={{ padding: "8px 10px", borderRadius: 8, background: C.bg, border: `1px solid ${C.line}` }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.ink2,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    {f.l}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                    {f.v}
                    {f.match && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  background: C.green,
                  color: C.creamSoft,
                  border: 0,
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ✓ Valider
              </button>
              <button
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  background: "transparent",
                  color: C.coralDeep,
                  border: `1.5px solid ${C.coralDeep}`,
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                ✗ Rejeter
              </button>
            </div>
            <textarea
              placeholder="Note interne (optionnel)…"
              style={{
                marginTop: 8,
                width: "100%",
                height: 44,
                border: `1px solid ${C.line}`,
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: 12,
                fontFamily: "inherit",
                background: C.bg,
                color: C.ink,
                resize: "none",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
