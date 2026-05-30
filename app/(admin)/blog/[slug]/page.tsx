"use client";

import { use, useEffect, useState } from "react";
import { ArticleEditor } from "@/components/ArticleEditor";
import { getArticle, type Article } from "@/lib/articles";
import { C } from "@/lib/colors";

export default function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getArticle(slug)
      .then((a) => {
        if (!cancelled) setArticle(a);
      })
      .catch((e) => {
        if (!cancelled) setError((e as { message?: string }).message ?? "Article introuvable");
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <div
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            background: "rgba(214,46,85,0.08)",
            border: `1px solid rgba(214,46,85,0.18)`,
            color: C.coralDeep,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: 40, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
        Chargement…
      </div>
    );
  }

  return <ArticleEditor mode="edit" initial={article} />;
}
