"use client";

import { use, useEffect, useState } from "react";
import { TemplateEditor } from "@/components/TemplateEditor";
import { getTemplate, type CardTemplate } from "@/lib/card-templates";
import { C } from "@/lib/colors";

export default function EditTemplatePage({ params }: { params: Promise<{ themeKey: string }> }) {
  const { themeKey } = use(params);
  const [template, setTemplate] = useState<CardTemplate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTemplate(themeKey)
      .then((t) => {
        if (!cancelled) setTemplate(t);
      })
      .catch((e) => {
        if (!cancelled) setError((e as { message?: string }).message ?? "Template introuvable");
      });
    return () => {
      cancelled = true;
    };
  }, [themeKey]);

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

  if (!template) {
    return (
      <div style={{ padding: 40, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
        Chargement…
      </div>
    );
  }

  return <TemplateEditor mode="edit" initial={template} />;
}
