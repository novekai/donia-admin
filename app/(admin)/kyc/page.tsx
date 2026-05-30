"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api } from "@/lib/api";

type KycRow = {
  id: string;
  docType: "CNI" | "PASSPORT" | "PERMIS";
  docUrlRecto: string;
  docUrlVerso: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    country: string;
    avatarUrl: string | null;
  };
};

const AVATAR_COLORS = [C.coral, C.indigo, C.pink, C.mango, C.mint, C.plum];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]!;
}
function countryFlag(code: string): string {
  const map: Record<string, string> = {
    BJ: "🇧🇯",
    CI: "🇨🇮",
    SN: "🇸🇳",
    TG: "🇹🇬",
    BF: "🇧🇫",
    ML: "🇲🇱",
    NE: "🇳🇪",
    GN: "🇬🇳",
    GH: "🇬🇭",
    CM: "🇨🇲",
    FR: "🇫🇷",
  };
  return map[code] ?? "🌍";
}
function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const h = Math.floor(ms / 3_600_000);
  if (h < 1) return "à l'instant";
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} j`;
}
function docLabel(type: KycRow["docType"]): string {
  return type === "CNI" ? "CNI" : type === "PASSPORT" ? "Passeport" : "Permis";
}

export default function KycPage() {
  const [items, setItems] = useState<KycRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);

  async function load() {
    setError(null);
    try {
      const data = await api.get<{ items: KycRow[] }>("/v1/admin/kyc?status=PENDING");
      setItems(data.items);
      if (data.items[0]) setActiveId((curr) => curr ?? data.items[0]!.id);
      else setActiveId(null);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Chargement impossible");
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const active = items?.find((i) => i.id === activeId) ?? null;

  async function decide(action: "approve" | "reject") {
    if (!active) return;
    setActing(action);
    try {
      const payload = action === "reject" ? { reason: note.trim() || undefined } : { note: note.trim() || undefined };
      await api.post(`/v1/admin/kyc/${active.id}/${action}`, payload);
      setNote("");
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
        title="KYC à valider"
        subtitle={items ? `${items.length} document(s) en attente` : "Chargement…"}
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
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
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600, color: C.ink }}>
              Aucun KYC en attente
            </div>
            <p style={{ marginTop: 8, fontSize: 14 }}>
              Bravo — tu as traité tous les documents soumis. 🎉
            </p>
          </div>
        )}

        {items !== null && items.length > 0 && (
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
                En attente · {items.length}
              </div>
              {items.map((p, i) => {
                const on = activeId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 20px",
                      borderBottom: i < items.length - 1 ? `1px solid ${C.line}` : 0,
                      background: on ? "rgba(244,72,111,0.06)" : "transparent",
                      width: "100%",
                      textAlign: "left",
                      border: 0,
                      cursor: "pointer",
                    }}
                  >
                    {p.user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.user.avatarUrl} alt="" style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                    ) : (
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: "50%",
                          background: colorFor(p.user.id),
                          color: C.creamSoft,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-fraunces), serif",
                          fontWeight: 600,
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {p.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 14 }}>
                        {p.user.name}
                      </div>
                      <div style={{ fontSize: 12, color: C.ink2 }}>
                        {docLabel(p.docType)} · {countryFlag(p.user.country)} · il y a {relTime(p.createdAt)}
                      </div>
                    </div>
                    {on ? (
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
                      <span
                        style={{
                          fontSize: 11,
                          color: C.ink2,
                          fontWeight: 600,
                          fontFamily: "var(--font-fraunces), serif",
                        }}
                      >
                        Examiner →
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active review */}
            {active && (
              <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.line}`, padding: 24, position: "sticky", top: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  {active.user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={active.user.avatarUrl} alt="" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: "50%",
                        background: colorFor(active.user.id),
                        color: C.creamSoft,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-fraunces), serif",
                        fontWeight: 600,
                        fontSize: 22,
                      }}
                    >
                      {active.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 500 }}>
                      {active.user.name}
                    </div>
                    <div style={{ fontSize: 12, color: C.ink2, fontFamily: "monospace" }}>
                      {active.user.phone} · {countryFlag(active.user.country)}
                    </div>
                  </div>
                </div>

                {/* Document preview */}
                <a
                  href={active.docUrlRecto}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    textDecoration: "none",
                  }}
                >
                  <div style={{ position: "absolute", inset: 16, border: "1px dashed rgba(249,160,28,0.4)", borderRadius: 8 }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 40, marginBottom: 4 }}>🪪</div>
                    <div>{docLabel(active.docType)}</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                      cliquer pour ouvrir le document
                    </div>
                  </div>
                </a>

                {active.docUrlVerso && (
                  <a
                    href={active.docUrlVerso}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      marginTop: 8,
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: `1px solid ${C.line}`,
                      color: C.ink,
                      fontSize: 12,
                      fontFamily: "var(--font-fraunces), serif",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    Voir le verso →
                  </a>
                )}

                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <button
                    onClick={() => decide("approve")}
                    disabled={acting !== null}
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
                      cursor: acting !== null ? "not-allowed" : "pointer",
                      opacity: acting !== null ? 0.6 : 1,
                    }}
                  >
                    {acting === "approve" ? "Validation…" : "✓ Valider"}
                  </button>
                  <button
                    onClick={() => decide("reject")}
                    disabled={acting !== null}
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
                      cursor: acting !== null ? "not-allowed" : "pointer",
                      opacity: acting !== null ? 0.6 : 1,
                    }}
                  >
                    {acting === "reject" ? "Rejet…" : "✗ Rejeter"}
                  </button>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Note interne ou raison du rejet (optionnel)…"
                  style={{
                    marginTop: 8,
                    width: "100%",
                    height: 56,
                    border: `1px solid ${C.line}`,
                    borderRadius: 8,
                    padding: "10px 12px",
                    fontSize: 12,
                    fontFamily: "inherit",
                    background: C.bg,
                    color: C.ink,
                    resize: "none",
                    outline: "none",
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
