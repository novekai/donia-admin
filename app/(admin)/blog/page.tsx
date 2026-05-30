import Link from "next/link";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { ARTICLES } from "@/lib/blog-mock";

export default function BlogPage() {
  const published = ARTICLES.filter((a) => a.status === "published").length;
  const drafts = ARTICLES.length - published;

  return (
    <>
      <TopBar
        title="Blog"
        subtitle={`${ARTICLES.length} articles · ${published} publiés · ${drafts} brouillons`}
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
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          {[`Tous (${ARTICLES.length})`, `Publiés (${published})`, `Brouillons (${drafts})`].map((f, i) => (
            <button
              key={f}
              style={{
                padding: "8px 14px",
                borderRadius: 99,
                background: i === 0 ? C.indigo : C.surface,
                color: i === 0 ? C.creamSoft : C.ink,
                border: i === 0 ? 0 : `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Les articles publiés apparaissent automatiquement sur doniia.com/#blog
          </span>
        </div>

        {/* Articles list */}
        <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, overflow: "hidden" }}>
          {ARTICLES.map((a, i) => (
            <div
              key={a.slug}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr auto",
                gap: 18,
                padding: "16px 20px",
                borderBottom: i < ARTICLES.length - 1 ? `1px solid ${C.line}` : 0,
                alignItems: "center",
              }}
            >
              {/* Visual */}
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

              {/* Meta */}
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
                      background: a.status === "published" ? "rgba(92,138,69,0.15)" : "rgba(249,160,28,0.15)",
                      color: a.status === "published" ? C.green : "#A66E0E",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {a.status === "published" ? "PUBLIÉ" : "BROUILLON"}
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
                  {formatDate(a.publishedAt)} · {a.readMinutes} min de lecture · {a.author}
                </div>
              </div>

              {/* Actions */}
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
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "transparent",
                    border: `1px solid rgba(214,46,85,0.3)`,
                    color: C.coralDeep,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "var(--font-fraunces), serif",
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
