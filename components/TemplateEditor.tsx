"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { C } from "@/lib/colors";
import {
  CATEGORIES,
  PRESET_COLORS,
  createTemplate,
  deleteTemplate,
  updateTemplate,
  type CardTemplate,
} from "@/lib/card-templates";

type Initial = Partial<CardTemplate>;

const DEFAULTS = {
  emoji: "🎁",
  color: "#F4486F",
  ink: "#FDF7F6",
  category: "Famille · Fêtes",
};

export function TemplateEditor({ mode, initial }: { mode: "new" | "edit"; initial?: Initial }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [themeKey, setThemeKey] = useState(initial?.themeKey ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? DEFAULTS.emoji);
  const [color, setColor] = useState(initial?.color ?? DEFAULTS.color);
  const [ink, setInk] = useState(initial?.ink ?? DEFAULTS.ink);
  const [category, setCategory] = useState(initial?.category ?? DEFAULTS.category);
  const [isLive, setIsLive] = useState(initial?.isLive ?? true);
  const [saving, setSaving] = useState<"save" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onNameChange(v: string) {
    setName(v);
    if (mode === "new") setThemeKey(slugify(v));
  }

  function pickPreset(p: (typeof PRESET_COLORS)[number]) {
    setColor(p.value);
    setInk(p.ink);
  }

  async function save(publish?: boolean) {
    setError(null);
    setSaving("save");
    const payload = {
      themeKey: themeKey || slugify(name),
      name,
      emoji,
      color,
      ink,
      category,
      isLive: publish ?? isLive,
      sortOrder: initial?.sortOrder ?? 999,
    };
    try {
      if (mode === "new" || !initial?.themeKey) {
        await createTemplate(payload);
      } else {
        await updateTemplate(initial.themeKey, payload);
      }
      router.push("/cards");
      router.refresh();
    } catch (e) {
      const err = e as { code?: string; message?: string };
      if (err.code === "THEME_KEY_TAKEN") setError("Cet identifiant est déjà utilisé — change le nom");
      else setError(err.message ?? "Enregistrement impossible");
      setSaving(null);
    }
  }

  async function onDelete() {
    if (!initial?.themeKey) return;
    if (!confirm(`Supprimer le template "${name}" ? Si des cartes ont déjà été envoyées avec ce template, l'opération échouera.`)) return;
    setSaving("delete");
    try {
      await deleteTemplate(initial.themeKey);
      router.push("/cards");
      router.refresh();
    } catch (e) {
      alert((e as { message?: string }).message ?? "Suppression impossible");
      setSaving(null);
    }
  }

  const canSave = name.trim().length >= 2 && emoji.trim().length >= 1;

  return (
    <>
      {/* Header */}
      <div
        style={{
          padding: "20px 32px",
          borderBottom: `1px solid ${C.line}`,
          background: C.bg,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Link
          href="/cards"
          aria-label="Retour"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: C.surface,
            border: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.ink,
            textDecoration: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: C.ink2, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            {mode === "new" ? "Nouveau template" : "Édition de template"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: C.ink,
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name || "Sans nom"}
          </div>
        </div>
        {mode === "edit" && (
          <button
            onClick={onDelete}
            disabled={saving !== null}
            style={{
              height: 40,
              padding: "0 14px",
              borderRadius: 12,
              background: "transparent",
              color: C.coralDeep,
              border: `1px solid rgba(214,46,85,0.3)`,
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: saving !== null ? "not-allowed" : "pointer",
            }}
          >
            {saving === "delete" ? "Suppression…" : "Supprimer"}
          </button>
        )}
        <button
          onClick={() => save(false)}
          disabled={saving !== null || !canSave}
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
            cursor: saving !== null || !canSave ? "not-allowed" : "pointer",
            opacity: saving !== null || !canSave ? 0.6 : 1,
          }}
        >
          {saving === "save" && !isLive ? "Enregistrement…" : "Enregistrer brouillon"}
        </button>
        <button
          onClick={() => save(true)}
          disabled={saving !== null || !canSave}
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
            cursor: saving !== null || !canSave ? "not-allowed" : "pointer",
            opacity: saving !== null || !canSave ? 0.6 : 1,
          }}
        >
          {saving === "save" && isLive ? "Publication…" : "Publier ✨"}
        </button>
      </div>

      {/* Body */}
      <div className="scroll" style={{ flex: 1, overflow: "auto" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "28px 32px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 28,
          }}
        >
          {/* Preview */}
          <div>
            <SectionTitle>Aperçu</SectionTitle>
            <div
              style={{
                width: "100%",
                aspectRatio: "1.4",
                borderRadius: 24,
                background: color,
                color: ink,
                padding: 32,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 30px 60px -20px rgba(42,15,26,0.4)",
                border: color === "#FFFFFF" ? `1px solid ${C.line}` : "none",
              }}
            >
              <svg
                className="c-spin-slow"
                style={{ position: "absolute", top: -60, right: -60, opacity: 0.18 }}
                width="200"
                height="200"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="45" stroke={ink} strokeWidth="0.8" fill="none" />
                <circle cx="50" cy="50" r="32" stroke={ink} strokeWidth="0.8" fill="none" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r="20" stroke={ink} strokeWidth="0.8" fill="none" />
              </svg>
              <div style={{ position: "absolute", top: 28, right: 28, fontSize: 52 }}>{emoji}</div>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "var(--font-fraunces), serif", fontStyle: "italic", fontSize: 16, opacity: 0.85 }}>
                  donia · {name || "Anniversaire"}
                </div>
                <div
                  style={{
                    marginTop: 32,
                    fontFamily: "var(--font-fraunces), serif",
                    fontSize: 36,
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  Une belle pensée,
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
                  10 000 <span style={{ fontSize: 20, opacity: 0.85 }}>FCFA</span>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, fontFamily: "var(--font-fraunces), serif", fontStyle: "italic", fontSize: 13, color: C.ink2 }}>
              Aperçu côté destinataire — [Prénom] et le montant sont remplis à l&rsquo;envoi.
            </div>
          </div>

          {/* Form */}
          <div>
            <SectionTitle>Propriétés</SectionTitle>
            {error && (
              <div
                style={{
                  marginBottom: 16,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(214,46,85,0.08)",
                  border: `1px solid rgba(214,46,85,0.18)`,
                  color: C.coralDeep,
                  fontSize: 13,
                }}
              >
                {error}
              </div>
            )}

            <Field label="Nom du template">
              <input
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Ex. Anniversaire"
                style={inputStyle}
              />
            </Field>
            <Field label="Identifiant interne (themeKey)" hint="Utilisé en base · pas modifiable une fois envoyé">
              <input
                value={themeKey}
                disabled={mode === "edit"}
                onChange={(e) => setThemeKey(slugify(e.target.value))}
                placeholder="ex. anniversaire"
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13, opacity: mode === "edit" ? 0.6 : 1 }}
              />
            </Field>
            <Field label="Catégorie">
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Emoji">
              <input
                value={emoji}
                maxLength={4}
                onChange={(e) => setEmoji(e.target.value)}
                placeholder="🎂"
                style={{ ...inputStyle, fontSize: 22, textAlign: "center" }}
              />
            </Field>

            <Field label="Palette" hint="Cliquer sur une couleur applique aussi la teinte du texte adaptée">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PRESET_COLORS.map((p) => (
                  <button
                    type="button"
                    key={p.value}
                    onClick={() => pickPreset(p)}
                    title={p.name}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: p.value,
                      border: color === p.value ? `2.5px solid ${C.ink}` : `1px solid ${C.line}`,
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Field label="Couleur de fond (hex)">
                <input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#F4486F"
                  style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
                />
              </Field>
              <Field label="Couleur du texte (hex)">
                <input
                  value={ink}
                  onChange={(e) => setInk(e.target.value)}
                  placeholder="#FDF7F6"
                  style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
                />
              </Field>
            </div>

            <Field label="Statut">
              <button
                onClick={() => setIsLive(!isLive)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: C.bg,
                  border: `1px solid ${C.line}`,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 13, color: C.ink }}>
                  {isLive ? "Publié dans le catalogue mobile" : "Brouillon (caché)"}
                </span>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 5,
                    background: isLive ? "rgba(92,138,69,0.15)" : "rgba(249,160,28,0.15)",
                    color: isLive ? C.green : "#A66E0E",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                  }}
                >
                  {isLive ? "LIVE" : "BROUILLON"}
                </span>
              </button>
            </Field>
          </div>
        </div>
      </div>
    </>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 40);
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 38,
  border: `1px solid ${C.line}`,
  borderRadius: 8,
  padding: "0 12px",
  fontSize: 13,
  fontFamily: "inherit",
  background: C.bg,
  color: C.ink,
  outline: "none",
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
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
        {hint && (
          <span style={{ marginLeft: 6, fontStyle: "normal", color: C.ink3, fontSize: 11 }}>
            · {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-fraunces), serif",
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 12,
        color: C.ink,
        paddingBottom: 6,
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      {children}
    </div>
  );
}
