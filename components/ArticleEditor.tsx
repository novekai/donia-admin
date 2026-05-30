"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { C } from "@/lib/colors";
import {
  CATEGORIES,
  COLOR_PRESETS,
  createArticle,
  updateArticle,
  type Article,
  type ArticleStatus,
} from "@/lib/articles";

type Initial = Partial<Article>;

const DEFAULTS = {
  category: "Conseil",
  color: "#F4486F",
  emoji: "🎂",
  readMinutes: 4,
  author: "Équipe Donia",
};

export function ArticleEditor({ mode, initial }: { mode: "new" | "edit"; initial?: Initial }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? DEFAULTS.category);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [emoji, setEmoji] = useState(initial?.emoji ?? DEFAULTS.emoji);
  const [color, setColor] = useState(initial?.color ?? DEFAULTS.color);
  const [readMinutes, setReadMinutes] = useState(initial?.readMinutes ?? DEFAULTS.readMinutes);
  const [publishedAt, setPublishedAt] = useState<string>(
    initial?.publishedAt ? initial.publishedAt.slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [author, setAuthor] = useState(initial?.author ?? DEFAULTS.author);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function onTitleChange(v: string) {
    setTitle(v);
    if (mode === "new") setSlug(slugify(v));
  }

  async function save(targetStatus: ArticleStatus) {
    setError(null);
    setSaving(targetStatus === "PUBLISHED" ? "publish" : "draft");
    const payload = {
      slug: slug || slugify(title),
      title,
      category,
      excerpt,
      content,
      emoji,
      color,
      readMinutes,
      author,
      status: targetStatus,
      publishedAt: targetStatus === "PUBLISHED" ? new Date(publishedAt).toISOString() : null,
    };
    try {
      if (mode === "new" || !initial?.slug) {
        await createArticle(payload);
      } else {
        await updateArticle(initial.slug, payload);
      }
      router.push("/blog");
      router.refresh();
    } catch (e) {
      const err = e as { status?: number; code?: string; message?: string };
      if (err.code === "SLUG_TAKEN") setError("Ce slug existe déjà — choisis-en un autre");
      else setError(err.message ?? "Enregistrement impossible");
      setSaving(null);
    }
  }

  const titleEmpty = !title.trim();
  const excerptEmpty = !excerpt.trim();
  const contentEmpty = !content.trim();
  const canPublish = !titleEmpty && !excerptEmpty && !contentEmpty;

  return (
    <>
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
          href="/blog"
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
            {mode === "new" ? "Nouveau brouillon" : "Édition d'article"}
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
            {title || "Sans titre"}
          </div>
        </div>
        <button
          onClick={() => save("DRAFT")}
          disabled={saving !== null || titleEmpty}
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
            cursor: saving !== null || titleEmpty ? "not-allowed" : "pointer",
            opacity: saving !== null || titleEmpty ? 0.6 : 1,
          }}
        >
          {saving === "draft" ? "Enregistrement…" : "Enregistrer brouillon"}
        </button>
        <button
          onClick={() => save("PUBLISHED")}
          disabled={saving !== null || !canPublish}
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
            cursor: saving !== null || !canPublish ? "not-allowed" : "pointer",
            opacity: saving !== null || !canPublish ? 0.6 : 1,
          }}
        >
          {saving === "publish" ? "Publication…" : "Publier ✨"}
        </button>
      </div>

      <div className="scroll" style={{ flex: 1, overflow: "auto" }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "28px 32px",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 24,
          }}
        >
          <div>
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

            <Field label="Titre">
              <input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Ex. 5 façons de célébrer un anniversaire à distance"
                style={{
                  ...inputStyle,
                  height: 50,
                  fontSize: 20,
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 500,
                }}
              />
            </Field>
            <Field label="Slug (URL)" hint="Sera utilisé pour /blog/[slug] sur le site">
              <input
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="ex. 5-facons-celebrer-anniversaire"
                style={{ ...inputStyle, fontFamily: "monospace", fontSize: 13 }}
              />
            </Field>
            <Field label="Extrait (carte de blog sur le site)" hint="1 à 2 phrases — max 400 caractères">
              <textarea
                value={excerpt}
                maxLength={400}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Quand la famille est éparpillée…"
                style={{ ...inputStyle, height: 70, padding: "10px 12px", resize: "vertical" }}
              />
              <div style={{ marginTop: 4, fontSize: 11, color: C.ink3, textAlign: "right", fontFamily: "monospace" }}>
                {excerpt.length}/400
              </div>
            </Field>
            <Field label="Contenu" hint="Texte brut. Le markdown sera supporté plus tard.">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={18}
                placeholder="Le texte intégral de ton article…"
                style={{ ...inputStyle, height: 380, padding: "14px 16px", fontSize: 14, lineHeight: 1.6, resize: "vertical" }}
              />
            </Field>
          </div>

          <div>
            <div
              style={{
                position: "sticky",
                top: 0,
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderRadius: 16,
                padding: 18,
              }}
            >
              <SectionTitle>Aperçu carte</SectionTitle>
              <div
                style={{
                  aspectRatio: "16/9",
                  borderRadius: 12,
                  background: color,
                  color: C.creamSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 64,
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                <svg
                  style={{ position: "absolute", top: -20, right: -20, opacity: 0.25 }}
                  width="120"
                  height="120"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="42" stroke={C.creamSoft} strokeWidth="0.8" fill="none" />
                  <circle cx="50" cy="50" r="28" stroke={C.creamSoft} strokeWidth="0.8" fill="none" />
                </svg>
                <span style={{ position: "relative" }}>{emoji}</span>
              </div>

              <SectionTitle>Métadonnées</SectionTitle>
              <Field label="Catégorie">
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Auteur">
                <input value={author} onChange={(e) => setAuthor(e.target.value)} style={inputStyle} />
              </Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Field label="Date">
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Lecture (min)">
                  <input
                    type="number"
                    min={1}
                    max={60}
                    value={readMinutes}
                    onChange={(e) => setReadMinutes(Number(e.target.value) || 1)}
                    style={inputStyle}
                  />
                </Field>
              </div>

              <SectionTitle>Visuel</SectionTitle>
              <Field label="Emoji">
                <input
                  value={emoji}
                  maxLength={4}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="🎂"
                  style={{ ...inputStyle, fontSize: 22, textAlign: "center" }}
                />
              </Field>
              <Field label="Couleur de fond">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {COLOR_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setColor(p.value)}
                      title={p.name}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: p.value,
                        border: color === p.value ? `2px solid ${C.ink}` : `1px solid ${C.line}`,
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: C.ink2,
                  }}
                >
                  {color}
                </div>
              </Field>
            </div>
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
    .slice(0, 80);
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
        fontSize: 13,
        fontWeight: 600,
        marginTop: 4,
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
