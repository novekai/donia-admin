"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api } from "@/lib/api";

type Status = "PENDING" | "VALID" | "HIDDEN" | "REPORTED" | "DELETED";

type Message = {
  id: string;
  content: string;
  status: Status;
  isFavorite: boolean;
  reportReason: string | null;
  reportedAt: string | null;
  readAt: string | null;
  createdAt: string;
  link: {
    code: string;
    user: { id: string; name: string; avatarUrl: string | null };
  };
};

const STATUS_TABS: { key: Status | "all"; label: string }[] = [
  { key: "REPORTED", label: "Signalés" },
  { key: "HIDDEN", label: "Masqués" },
  { key: "VALID", label: "Validés" },
  { key: "all", label: "Tous" },
];

const AVATAR_COLORS = [C.coral, C.indigo, C.pink, C.mango, C.mint, C.plum];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]!;
}

function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60_000);
  if (m < 1) return "à l'instant";
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} j`;
}

export default function AnonymesPage() {
  const [items, setItems] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Status | "all">("REPORTED");
  const [acting, setActing] = useState<string | null>(null);

  async function load() {
    setError(null);
    setItems(null);
    try {
      const data = await api.get<{ items: Message[] }>(
        `/v1/admin/anonymes/messages?status=${filter}`
      );
      setItems(data.items);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Chargement impossible");
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function moderate(id: string, action: "hide" | "restore" | "delete") {
    setActing(id);
    try {
      await api.post(`/v1/admin/anonymes/messages/${id}`, { action });
      await load();
    } catch (e) {
      alert((e as { message?: string }).message ?? "Action impossible");
    } finally {
      setActing(null);
    }
  }

  return (
    <>
      <TopBar
        title="Anonymes — Modération"
        subtitle={
          items === null
            ? "Chargement…"
            : items.length === 0
              ? "Aucun message dans ce filtre"
              : `${items.length} message(s) ${filter === "REPORTED" ? "signalé(s)" : filter === "HIDDEN" ? "masqué(s)" : filter === "VALID" ? "validé(s)" : ""}`
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          {STATUS_TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              style={{
                padding: "8px 14px",
                borderRadius: 99,
                background: filter === t.key ? C.indigo : C.surface,
                color: filter === t.key ? C.creamSoft : C.ink,
                border: filter === t.key ? 0 : `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            La modération auto IA s&rsquo;applique en premier — ici tu vois ce qui a échappé au filtre.
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

        {items !== null && items.length === 0 && !error && (
          <div
            style={{
              padding: 60,
              background: C.surface,
              borderRadius: 18,
              border: `1px solid ${C.line}`,
              textAlign: "center",
              color: C.ink2,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {filter === "REPORTED" ? "🎉" : "📭"}
            </div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600, color: C.ink }}>
              {filter === "REPORTED" ? "Aucun signalement en attente" : "Aucun message"}
            </div>
            <p style={{ marginTop: 8, fontSize: 14 }}>
              {filter === "REPORTED"
                ? "Tu es à jour sur la modération."
                : "Rien à afficher dans ce filtre pour l'instant."}
            </p>
          </div>
        )}

        {items !== null && items.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((m) => (
              <div
                key={m.id}
                style={{
                  background: C.surface,
                  borderRadius: 14,
                  border: `1px solid ${C.line}`,
                  padding: 16,
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 14,
                  opacity: acting === m.id ? 0.5 : 1,
                }}
              >
                {m.link.user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.link.user.avatarUrl}
                    alt=""
                    style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: colorFor(m.link.user.id),
                      color: C.creamSoft,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-fraunces), serif",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {m.link.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: C.ink2, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, color: C.ink }}>{m.link.user.name}</span>
                    <span style={{ color: C.ink3 }}> · /a/{m.link.code}</span>
                    <span style={{ color: C.ink3 }}> · il y a {relTime(m.createdAt)}</span>
                    {m.reportReason && (
                      <span
                        style={{
                          marginLeft: 8,
                          padding: "2px 7px",
                          borderRadius: 5,
                          background: "rgba(214,46,85,0.15)",
                          color: C.coralDeep,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.04em",
                        }}
                      >
                        SIGNALÉ · {m.reportReason}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: 16,
                      lineHeight: 1.45,
                      color: C.ink,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.content}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {m.status !== "HIDDEN" && (
                    <button
                      onClick={() => moderate(m.id, "hide")}
                      disabled={acting !== null}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: "transparent",
                        border: `1px solid rgba(249,160,28,0.4)`,
                        color: "#A66E0E",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: acting === null ? "pointer" : "not-allowed",
                        fontFamily: "var(--font-fraunces), serif",
                      }}
                    >
                      Masquer
                    </button>
                  )}
                  {m.status === "HIDDEN" && (
                    <button
                      onClick={() => moderate(m.id, "restore")}
                      disabled={acting !== null}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: "transparent",
                        border: `1px solid rgba(92,138,69,0.4)`,
                        color: C.green,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: acting === null ? "pointer" : "not-allowed",
                        fontFamily: "var(--font-fraunces), serif",
                      }}
                    >
                      Restaurer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (confirm("Supprimer définitivement ce message ?")) moderate(m.id, "delete");
                    }}
                    disabled={acting !== null}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: "transparent",
                      border: `1px solid rgba(214,46,85,0.3)`,
                      color: C.coralDeep,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: acting === null ? "pointer" : "not-allowed",
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    Supprimer
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
