import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";

const TEMPLATES = [
  { bg: C.coral, e: "🎂" },
  { bg: C.pink, e: "💖" },
  { bg: C.mango, e: "🏆" },
  { bg: C.mint, e: "🎄" },
  { bg: C.indigo, e: "🌙" },
  { bg: C.plum, e: "🕊️" },
];

const ICONS = ["🎂", "💖", "🏆", "🎄", "🌙", "🕊️", "✨", "🎉", "💍", "🌻", "🪪", "👶"];

const PALETTES = [
  { name: "Coral", colors: [C.coral, C.coralDeep, "#FBC4D1"] },
  { name: "Mango", colors: [C.mango, C.mangoDeep, "#F8E6E2"] },
  { name: "Pink", colors: [C.pink, C.plum, "#FBCAD8"] },
  { name: "Indigo", colors: [C.indigo, C.indigoDeep, "#6FB5D4"] },
  { name: "Mint", colors: [C.mint, "#4A9E84", "#BFE8D9"] },
];

export default function DesignerPage() {
  return (
    <>
      <TopBar
        title="Designer · Nouvelle carte"
        subtitle="Brouillon · Sauvegarde auto"
        actions={
          <>
            <button
              style={{
                height: 40,
                padding: "0 16px",
                borderRadius: 12,
                background: C.surface,
                color: C.ink,
                border: `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 500,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Aperçu mobile
            </button>
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
              Sauvegarder
            </button>
            <button
              style={{
                height: 40,
                padding: "0 18px",
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
              Publier ✨
            </button>
          </>
        }
      />

      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "300px 1fr 320px", overflow: "hidden" }}>
        {/* Left — Library */}
        <div className="scroll" style={{ overflow: "auto", padding: "20px 18px", borderRight: `1px solid ${C.line}`, background: C.surface }}>
          <SectionLabel>Modèles</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {TEMPLATES.map((t, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: 12,
                  background: t.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  cursor: "pointer",
                  border: i === 0 ? `2px solid ${C.ink}` : "none",
                }}
              >
                {t.e}
              </div>
            ))}
          </div>

          <SectionLabel style={{ marginTop: 20 }}>Illustrations</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            {ICONS.map((e) => (
              <div
                key={e}
                style={{
                  aspectRatio: "1",
                  borderRadius: 8,
                  background: C.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  cursor: "pointer",
                  border: `1px solid ${C.line}`,
                }}
              >
                {e}
              </div>
            ))}
          </div>

          <SectionLabel style={{ marginTop: 20 }}>Palettes</SectionLabel>
          {PALETTES.map((p) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
              <div style={{ display: "flex", gap: 3 }}>
                {p.colors.map((c) => (
                  <div key={c} style={{ width: 18, height: 18, borderRadius: 5, background: c }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: C.ink, fontWeight: 500, flex: 1 }}>{p.name}</span>
            </div>
          ))}
        </div>

        {/* Canvas */}
        <div
          className="scroll"
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: C.bg,
            padding: 40,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              display: "flex",
              gap: 6,
              padding: 4,
              borderRadius: 10,
              background: C.surface,
              border: `1px solid ${C.line}`,
            }}
          >
            {["Aperçu", "Brouillon", "Annoter"].map((t, i) => (
              <button
                key={t}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
                  background: i === 0 ? C.indigo : "transparent",
                  color: i === 0 ? C.creamSoft : C.ink2,
                  border: 0,
                  fontSize: 12,
                  fontWeight: 600,
                  fontFamily: "var(--font-fraunces), serif",
                  cursor: "pointer",
                }}
              >
                {t}
              </button>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              padding: "6px 12px",
              background: C.surface,
              border: `1px solid ${C.line}`,
              borderRadius: 8,
              fontSize: 12,
              color: C.ink2,
              fontFamily: "monospace",
            }}
          >
            320 × 200 px · 16:10
          </div>

          <div
            style={{
              width: 480,
              aspectRatio: "1.4",
              borderRadius: 24,
              background: "linear-gradient(160deg, #F4486F 0%, #D62E55 100%)",
              padding: 32,
              color: C.creamSoft,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 30px 60px -20px rgba(42,15,26,0.4)",
            }}
          >
            <svg
              className="c-spin-slow"
              style={{ position: "absolute", top: -60, right: -60, opacity: 0.18 }}
              width="200"
              height="200"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="45" stroke={C.creamSoft} strokeWidth="0.8" fill="none" />
              <circle cx="50" cy="50" r="32" stroke={C.creamSoft} strokeWidth="0.8" fill="none" strokeDasharray="2 2" />
              <circle cx="50" cy="50" r="20" stroke={C.creamSoft} strokeWidth="0.8" fill="none" />
            </svg>
            <div style={{ position: "absolute", top: 28, right: 28, fontSize: 52 }}>🎂</div>
            <div style={{ position: "relative" }}>
              <div style={{ fontFamily: "var(--font-fraunces), serif", fontStyle: "italic", fontSize: 16, opacity: 0.85 }}>
                donia · Anniversaire
              </div>
              <div
                style={{
                  marginTop: 32,
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: 36,
                  fontWeight: 500,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  maxWidth: 280,
                }}
              >
                Joyeux anniversaire,
              </div>
              <div style={{ marginTop: 8, fontSize: 14, opacity: 0.85 }}>
                pour <b>[Prénom]</b>
              </div>
              <div
                style={{
                  marginTop: 30,
                  fontFamily: "var(--font-bricolage), sans-serif",
                  fontSize: 56,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                [Montant] <span style={{ fontSize: 20, opacity: 0.85 }}>FCFA</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              fontFamily: "var(--font-fraunces), serif",
              fontStyle: "italic",
              fontSize: 13,
              color: C.ink2,
            }}
          >
            Aperçu côté destinataire · [Prénom] et [Montant] sont remplis au moment de l&rsquo;envoi
          </div>
        </div>

        {/* Right — Properties */}
        <div
          className="scroll"
          style={{
            overflow: "auto",
            padding: "20px 18px",
            borderLeft: `1px solid ${C.line}`,
            background: C.surface,
          }}
        >
          <SectionLabel>Propriétés</SectionLabel>

          <Field label="Nom interne">
            <input defaultValue="Anniversaire" style={inputStyle} />
          </Field>
          <Field label="Catégorie">
            <select style={inputStyle}>
              <option>Famille · Fêtes</option>
            </select>
          </Field>

          <SectionTitle>Visuel</SectionTitle>
          <Field label="Fond">
            <div style={pillStyle}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: C.coral }} />
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>#F4486F</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: C.ink2 }}>Coral</span>
            </div>
          </Field>
          <Field label="Texte">
            <div style={pillStyle}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: C.creamSoft, border: `1px solid ${C.line}` }} />
              <span style={{ fontFamily: "monospace", fontSize: 12 }}>#FDF7F6</span>
            </div>
          </Field>
          <Field label="Illustration">
            <div style={pillStyle}>
              <span style={{ fontSize: 18 }}>🎂</span>
              <span style={{ fontSize: 12, color: C.ink }}>Gâteau (illustration native)</span>
            </div>
          </Field>

          <SectionTitle>Texte type</SectionTitle>
          <Field label="Occasion">
            <input defaultValue="Joyeux anniversaire," style={inputStyle} />
          </Field>
          <Field label="Messages suggérés (4)">
            <textarea
              defaultValue={"Joyeux anniversaire 🎂\nUne belle année qui commence !\nProfite bien de ta journée 💕\nUne pensée pour toi ✨"}
              style={{ ...inputStyle, height: 90, padding: "8px 10px", resize: "none" }}
            />
          </Field>

          <SectionTitle>Économique</SectionTitle>
          <Field label="Commission conversion">
            <div style={pillStyle}>
              <input
                defaultValue="5"
                style={{ flex: 1, border: 0, background: "transparent", fontFamily: "monospace", fontSize: 13, color: C.ink, outline: "none" }}
              />
              <span style={{ fontSize: 12, color: C.ink2 }}>% du montant</span>
            </div>
          </Field>
          <Field label="Montant minimum">
            <div style={pillStyle}>
              <input
                defaultValue="500"
                style={{ flex: 1, border: 0, background: "transparent", fontFamily: "monospace", fontSize: 13, color: C.ink, outline: "none" }}
              />
              <span style={{ fontSize: 12, color: C.ink2 }}>FCFA</span>
            </div>
          </Field>
        </div>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 36,
  border: `1px solid ${C.line}`,
  borderRadius: 8,
  padding: "0 10px",
  fontSize: 13,
  fontFamily: "inherit",
  background: C.bg,
  color: C.ink,
  outline: "none",
};

const pillStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  height: 36,
  padding: "0 10px",
  border: `1px solid ${C.line}`,
  borderRadius: 8,
  background: C.bg,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-fraunces), serif",
          fontStyle: "italic",
          fontSize: 12,
          color: C.ink2,
          marginBottom: 5,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 14, fontWeight: 600, marginBottom: 12, ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-fraunces), serif",
        fontSize: 13,
        fontWeight: 600,
        marginTop: 18,
        marginBottom: 10,
        color: C.ink,
        paddingBottom: 6,
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      {children}
    </div>
  );
}
