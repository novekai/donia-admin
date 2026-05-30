"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { listTemplates, deleteTemplate, updateTemplate, type CardTemplate } from "@/lib/card-templates";
import { formatNumber } from "@/lib/api";

type Filter = "all" | "live" | "draft";

export default function CardsPage() {
  const [items, setItems] = useState<CardTemplate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [acting, setActing] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await listTemplates();
      setItems(res.items);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Chargement impossible");
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const total = items?.length ?? 0;
  const live = items?.filter((c) => c.isLive).length ?? 0;
  const drafts = total - live;
  const visible = items?.filter((c) =>
    filter === "all" ? true : filter === "live" ? c.isLive : !c.isLive
  ) ?? [];

  async function toggleLive(t: CardTemplate) {
    setActing(t.themeKey);
    try {
      const updated = await updateTemplate(t.themeKey, { isLive: !t.isLive });
      setItems((curr) => curr?.map((c) => (c.themeKey === t.themeKey ? { ...c, isLive: updated.isLive } : c)) ?? null);
    } catch (e) {
      alert((e as { message?: string }).message ?? "Action impossible");
    } finally {
      setActing(null);
    }
  }

  async function onDelete(t: CardTemplate) {
    if (t.sentCount > 0) {
      alert(
        `Impossible de supprimer ce template : ${t.sentCount} carte(s) déjà envoyée(s) y font référence. Tu peux le mettre en BROUILLON pour le cacher du catalogue.`
      );
      return;
    }
    if (!confirm(`Supprimer définitivement le template "${t.name}" ?`)) return;
    setActing(t.themeKey);
    try {
      await deleteTemplate(t.themeKey);
      setItems((curr) => curr?.filter((c) => c.themeKey !== t.themeKey) ?? null);
    } catch (e) {
      alert((e as { message?: string }).message ?? "Suppression impossible");
    } finally {
      setActing(null);
    }
  }

  return (
    <>
      <TopBar
        title="Cartes cadeaux"
        subtitle={items ? `${total} designs · ${live} publié(s) · ${drafts} brouillon(s)` : "Chargement…"}
        actions={
          <Link
            href="/designer"
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
            Nouvelle carte
          </Link>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
          {(
            [
              ["all", `Toutes (${total})`],
              ["live", `Publiées (${live})`],
              ["draft", `Brouillon (${drafts})`],
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

        {items === null && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement des templates…
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
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎁</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, color: C.ink }}>
              Aucun template
            </div>
          </div>
        )}

        {items !== null && visible.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {visible.map((c) => (
              <div
                key={c.themeKey}
                style={{
                  background: C.surface,
                  borderRadius: 18,
                  border: `1px solid ${C.line}`,
                  overflow: "hidden",
                  position: "relative",
                  opacity: acting === c.themeKey ? 0.5 : 1,
                  transition: "opacity .15s",
                }}
              >
                <Link
                  href={`/designer/${c.themeKey}`}
                  style={{ display: "block", textDecoration: "none" }}
                >
                  <div
                    style={{
                      aspectRatio: "1.4",
                      background: c.color,
                      color: c.ink,
                      padding: 16,
                      position: "relative",
                      overflow: "hidden",
                      borderBottom: c.color === "#FFFFFF" ? `1px solid ${C.line}` : "none",
                    }}
                  >
                    <svg style={{ position: "absolute", top: -20, right: -20, opacity: 0.18 }} width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke={c.ink} strokeWidth="0.8" fill="none" />
                      <circle cx="50" cy="50" r="28" stroke={c.ink} strokeWidth="0.8" fill="none" />
                    </svg>
                    <div style={{ position: "absolute", top: 12, right: 12, fontSize: 28 }}>{c.emoji}</div>
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        fontFamily: "var(--font-fraunces), serif",
                        fontStyle: "italic",
                        fontSize: 12,
                        opacity: 0.85,
                      }}
                    >
                      donia
                    </div>
                    <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-fraunces), serif",
                          fontSize: 17,
                          fontWeight: 500,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.1,
                        }}
                      >
                        {c.name}
                      </div>
                    </div>
                  </div>
                </Link>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: C.ink2 }}>{formatNumber(c.sentCount)} envois</div>
                    </div>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 5,
                        background: c.isLive ? "rgba(92,138,69,0.15)" : "rgba(249,160,28,0.15)",
                        color: c.isLive ? C.green : "#A66E0E",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {c.isLive ? "LIVE" : "BROUILLON"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => toggleLive(c)}
                      disabled={acting !== null}
                      style={{
                        flex: 1,
                        padding: "6px 8px",
                        borderRadius: 7,
                        background: "transparent",
                        border: `1px solid ${C.line}`,
                        color: C.ink,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: acting === null ? "pointer" : "not-allowed",
                        fontFamily: "var(--font-fraunces), serif",
                      }}
                    >
                      {c.isLive ? "Cacher" : "Publier"}
                    </button>
                    <button
                      onClick={() => onDelete(c)}
                      disabled={acting !== null}
                      title={c.sentCount > 0 ? "Cartes déjà envoyées — passe-la en brouillon" : "Supprimer"}
                      style={{
                        padding: "6px 8px",
                        borderRadius: 7,
                        background: "transparent",
                        border: `1px solid rgba(214,46,85,0.3)`,
                        color: c.sentCount > 0 ? C.ink3 : C.coralDeep,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: acting === null && c.sentCount === 0 ? "pointer" : "not-allowed",
                        opacity: c.sentCount > 0 ? 0.5 : 1,
                        fontFamily: "var(--font-fraunces), serif",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
