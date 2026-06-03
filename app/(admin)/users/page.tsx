"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, formatNumber } from "@/lib/api";

type Kyc = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

type UserRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  country: string;
  kyc: Kyc;
  referralCode: string;
  avatarUrl: string | null;
  joinedAt: string;
  sentCount: number;
  volume: number;
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

function formatJoin(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

const FILTERS: { key: "all" | Kyc; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "APPROVED", label: "KYC OK" },
  { key: "PENDING", label: "KYC en attente" },
  { key: "REJECTED", label: "KYC rejeté" },
];

export default function UsersPage() {
  const router = useRouter();
  const [items, setItems] = useState<UserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Kyc>("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setItems(null);
    const params = new URLSearchParams();
    params.set("kyc", filter);
    if (q.trim()) params.set("q", q.trim());
    api
      .get<{ items: UserRow[]; nextCursor: string | null }>(`/v1/admin/users?${params.toString()}`)
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch((e) => {
        if (!cancelled) setError((e as { message?: string }).message ?? "Chargement impossible");
      });
    return () => {
      cancelled = true;
    };
  }, [filter, q]);

  const totalShown = items?.length ?? 0;
  const headerSub = useMemo(() => {
    if (items === null) return "Chargement…";
    if (q) return `${totalShown} résultats pour « ${q} »`;
    return `${totalShown} utilisateurs affichés`;
  }, [items, totalShown, q]);

  return (
    <>
      <TopBar
        title="Utilisateurs"
        subtitle={headerSub}
        actions={
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
            Exporter CSV
          </button>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px" }}>
        {/* Filters + Search */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center", flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "8px 14px",
                borderRadius: 99,
                background: filter === f.key ? C.indigo : C.surface,
                color: filter === f.key ? C.creamSoft : C.ink,
                border: filter === f.key ? 0 : `1px solid ${C.line}`,
                fontFamily: "var(--font-fraunces), serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {f.label}
            </button>
          ))}
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher nom, email, téléphone, code parrainage…"
            style={{
              marginLeft: "auto",
              height: 36,
              minWidth: 320,
              padding: "0 14px",
              borderRadius: 10,
              border: `1px solid ${C.line}`,
              background: C.surface,
              fontSize: 13,
              fontFamily: "inherit",
              color: C.ink,
              outline: "none",
            }}
          />
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
            Chargement des utilisateurs…
          </div>
        )}

        {items !== null && items.length === 0 && (
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
            <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 16, fontWeight: 600, color: C.ink }}>
              Aucun utilisateur trouvé
            </div>
          </div>
        )}

        {items !== null && items.length > 0 && (
          <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.4fr 0.6fr 0.8fr 0.9fr 0.7fr 0.6fr",
                padding: "14px 20px",
                borderBottom: `1px solid ${C.line}`,
                fontSize: 11,
                color: C.ink2,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: C.bg,
              }}
            >
              <span>Utilisateur</span>
              <span>Contact</span>
              <span>Pays</span>
              <span>KYC</span>
              <span>Volume (FCFA)</span>
              <span>Cartes</span>
              <span style={{ textAlign: "right" }}>Action</span>
            </div>
            {items.map((u, i) => (
              <div
                key={u.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1.4fr 0.6fr 0.8fr 0.9fr 0.7fr 0.6fr",
                  padding: "14px 20px",
                  borderBottom: i < items.length - 1 ? `1px solid ${C.line}` : 0,
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {u.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={u.avatarUrl} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: colorFor(u.id),
                        color: C.creamSoft,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-fraunces), serif",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
                      Inscrit en {formatJoin(u.joinedAt)}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12 }}>{u.email ?? "—"}</div>
                  <div style={{ fontSize: 11, color: C.ink2, fontFamily: "monospace" }}>{u.phone}</div>
                </div>
                <div style={{ fontSize: 18 }}>{countryFlag(u.country)}</div>
                <div>
                  <KycPill kyc={u.kyc} />
                </div>
                <div style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700, fontSize: 14 }}>
                  {formatNumber(u.volume)}
                </div>
                <div style={{ fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 600 }}>{u.sentCount}</div>
                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={() => router.push(`/users/${u.id}`)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: "transparent",
                      border: `1px solid ${C.line}`,
                      color: C.ink,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    Voir →
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

function KycPill({ kyc }: { kyc: Kyc }) {
  const map: Record<Kyc, { bg: string; color: string; label: string }> = {
    APPROVED: { bg: "rgba(92,138,69,0.15)", color: C.green, label: "✓ OK" },
    PENDING: { bg: "rgba(249,160,28,0.18)", color: "#A66E0E", label: "⏳ EN ATTENTE" },
    REJECTED: { bg: "rgba(214,46,85,0.15)", color: C.coralDeep, label: "✗ REJETÉ" },
    NONE: { bg: "rgba(42,15,26,0.06)", color: C.ink2, label: "—" },
  };
  const s = map[kyc];
  return (
    <span
      style={{
        padding: "3px 8px",
        borderRadius: 5,
        background: s.bg,
        color: s.color,
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {s.label}
    </span>
  );
}
