"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { listArticles, deleteArticle, type Article, type ArticleStatus } from "@/lib/articles";

type Filter = "all" | ArticleStatus;

export default function BlogPage() {
  const [items, setItems] = useState<Article[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await listArticles("all");
      setItems(res.items);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Chargement impossible");
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDelete(slug: string, title: string) {
    if (!confirm(`Supprimer définitivement "${title}" ?`)) return;
    setDeleting(slug);
    try {
      await deleteArticle(slug);
      setItems((curr) => curr?.filter((a) => a.slug !== slug) ?? null);
    } catch (e) {
      alert((e as { message?: string }).message ?? "Suppression impossible");
    } finally {
      setDeleting(null);
    }
  }

  const total = items?.length ?? 0;
  const published = items?.filter((a) => a.status === "PUBLISHED").length ?? 0;
  const drafts = items?.filter((a) => a.status === "DRAFT").length ?? 0;
  const visible = items?.filter((a) =>
    filter === "all" ? true : a.status === filter
  ) ?? [];

  return (
    <>
      <TopBar
        title="Blog"
        subtitle={items ? `${total} articles · ${published} publiés · ${drafts} brouillons` : "Chargement…"}
        actions={
          <Link
            href="/blog/new"
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
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.creamSoft} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvel article
          </Link>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          {(
            [
              ["all", `Tous (${total})`],
              ["PUBLISHED", `Publiés (${published})`],
              ["DRAFT", `Brouillons (${drafts})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "8px 14px",
                borderRadius: 99,
                background: filter === key ? C.indigo : C.surface,
                color: filter === key ? C.creamSoft : C.ink,
                border: filter === key ? 0 : `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Les articles publiés apparaissent automatiquement sur doniia.com/#blog
          </span>
        </div>

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

        {items === null && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement des articles…
          </div>
        )}

        {items !== null && visible.length === 0 && (
          <div
            style={{
              padding: 40,
              background: C.surface,
              borderRadius: 18,
              border: `1px solid ${C.line}`,
              textAlign: "center",
              color: C.ink2,
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, color: C.ink }}>
              Aucun article {filter !== "all" ? "dans ce filtre" : "encore"}
            </div>
            <p style={{ marginTop: 6, fontSize: 13 }}>
              Crée ton premier article — il apparaîtra automatiquement sur doniia.com/#blog dès que tu publieras.
            </p>
          </div>
        )}

        {items !== null && visible.length > 0 && (
          <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            {visible.map((a, i) => (
              <div
                key={a.slug}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  gap: 18,
                  padding: "16px 20px",
                  borderBottom: i < visible.length - 1 ? `1px solid ${C.line}` : 0,
                  alignItems: "center",
                  opacity: deleting === a.slug ? 0.5 : 1,
                }}
              >
                <div
                  style={{
                    height: 80,
                    borderRadius: 12,
                    background: a.color,
                    color: C.creamSoft,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 36,
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <svg
                    style={{ position: "absolute", top: -16, right: -16, opacity: 0.22 }}
                    width="80"
                    height="80"
                    viewBox="0 0 100 100"
                  >
                    <circle cx="50" cy="50" r="42" stroke={C.creamSoft} strokeWidth="0.8" fill="none" />
                    <circle cx="50" cy="50" r="28" stroke={C.creamSoft} strokeWidth="0.8" fill="none" />
                  </svg>
                  <span style={{ position: "relative" }}>{a.emoji}</span>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 5,
                        background: `${a.color}22`,
                        color: a.color,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      {a.category}
                    </span>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 5,
                        background:
                          a.status === "PUBLISHED"
                            ? "rgba(92,138,69,0.15)"
                            : a.status === "DRAFT"
                              ? "rgba(249,160,28,0.15)"
                              : "rgba(42,15,26,0.1)",
                        color:
                          a.status === "PUBLISHED" ? C.green : a.status === "DRAFT" ? "#A66E0E" : C.ink2,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {a.status === "PUBLISHED"
                        ? "PUBLIÉ"
                        : a.status === "DRAFT"
                          ? "BROUILLON"
                          : "ARCHIVÉ"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: 17,
                      fontWeight: 600,
                      letterSpacing: "-0.01em",
                      color: C.ink,
                      marginBottom: 4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: C.ink2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: 6,
                    }}
                  >
                    {a.excerpt}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: C.ink3,
                      fontFamily: "var(--font-fraunces), serif",
                      fontStyle: "italic",
                    }}
                  >
                    {a.publishedAt
                      ? `${formatDate(a.publishedAt)} · ${a.readMinutes} min · ${a.author}`
                      : `Modifié ${formatDate(a.updatedAt)} · ${a.author}`}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  <Link
                    href={`/blog/${a.slug}`}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "transparent",
                      border: `1px solid ${C.line}`,
                      color: C.ink,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-fraunces), serif",
                      textDecoration: "none",
                    }}
                  >
                    Éditer
                  </Link>
                  <button
                    onClick={() => onDelete(a.slug, a.title)}
                    disabled={deleting === a.slug}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "transparent",
                      border: `1px solid rgba(214,46,85,0.3)`,
                      color: C.coralDeep,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: deleting === a.slug ? "not-allowed" : "pointer",
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    {deleting === a.slug ? "…" : "Supprimer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
