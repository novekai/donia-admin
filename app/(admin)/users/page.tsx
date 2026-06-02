"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [items, setItems] = useState<UserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | Kyc>("all");
  const [q, setQ] = useState("");
  // TEMP-CREDIT-WALLET: user actuellement ouvert dans le modal. À retirer après les captures.
  const [creditTarget, setCreditTarget] = useState<UserRow | null>(null);

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
                  {/* TEMP-CREDIT-WALLET: bouton temporaire pour captures Play Store. À retirer après. */}
                  <button
                    onClick={() => setCreditTarget(u)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      background: C.mango,
                      border: 0,
                      color: C.ink,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "var(--font-fraunces), serif",
                    }}
                  >
                    💰 Créditer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TEMP-CREDIT-WALLET: modal temporaire. À retirer en même temps que le bouton ci-dessus. */}
      {creditTarget && (
        <CreditWalletModal
          user={creditTarget}
          onClose={() => setCreditTarget(null)}
        />
      )}
    </>
  );
}

// TEMP-CREDIT-WALLET: composant temporaire. À retirer après les captures Play Store.
function CreditWalletModal({
  user,
  onClose,
}: {
  user: UserRow;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState<string>("120000");
  const [reason, setReason] = useState<string>("Play Store screenshot");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  // TEMP-ADMIN-FIX: parrainage state
  const [refCode, setRefCode] = useState<string>(user.referralCode);
  const [fakeCount, setFakeCount] = useState<string>("4");
  const [fakeAmount, setFakeAmount] = useState<string>("20000");
  const [referralBusy, setReferralBusy] = useState<string | null>(null);
  const [referralMsg, setReferralMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit() {
    const n = Number(amount);
    if (!Number.isFinite(n) || n === 0) {
      setResult({ ok: false, message: "Montant invalide (doit être un nombre non nul)" });
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.post<{ ok: boolean; userId: string; newBalance: number; adjusted: number }>(
        `/v1/admin/users/${user.id}/credit-wallet`,
        { amount: n, reason: reason.trim() || "admin adjustment" }
      );
      setResult({
        ok: true,
        message: `Nouveau solde : ${formatNumber(res.newBalance)} FCFA (ajustement ${n > 0 ? "+" : ""}${formatNumber(n)})`,
      });
    } catch (e) {
      setResult({ ok: false, message: (e as { message?: string }).message ?? "Échec de l'ajustement" });
    } finally {
      setSubmitting(false);
    }
  }

  async function onClearAdminTx() {
    if (referralBusy) return;
    setReferralBusy("clear");
    setReferralMsg(null);
    try {
      const res = await api.post<{ ok: boolean; cleared: number; netReverted: number; newBalance: number }>(
        `/v1/admin/users/${user.id}/admin-transactions/clear`
      );
      setReferralMsg({
        ok: true,
        text: `${res.cleared} transactions admin supprimées. Solde : ${formatNumber(res.newBalance)} FCFA.`,
      });
      setResult(null);
    } catch (e) {
      setReferralMsg({ ok: false, text: (e as { message?: string }).message ?? "Échec du nettoyage" });
    } finally {
      setReferralBusy(null);
    }
  }

  async function onChangeRefCode() {
    if (referralBusy) return;
    setReferralBusy("code");
    setReferralMsg(null);
    try {
      const res = await api.patch<{ ok: boolean; referralCode: string }>(
        `/v1/admin/users/${user.id}/referral`,
        { code: refCode.trim() }
      );
      setReferralMsg({ ok: true, text: `Code parrainage : ${res.referralCode}` });
    } catch (e) {
      setReferralMsg({ ok: false, text: (e as { message?: string }).message ?? "Échec du changement de code" });
    } finally {
      setReferralBusy(null);
    }
  }

  async function onCreateFakes() {
    if (referralBusy) return;
    const c = Number(fakeCount);
    const a = Number(fakeAmount);
    if (!Number.isFinite(c) || c < 1 || c > 20) {
      setReferralMsg({ ok: false, text: "Nombre de filleuls invalide (1 à 20)" });
      return;
    }
    setReferralBusy("create");
    setReferralMsg(null);
    try {
      const res = await api.post<{ ok: boolean; created: number; totalAmountAllocated: number }>(
        `/v1/admin/users/${user.id}/fake-referrals`,
        { count: c, totalAmount: Number.isFinite(a) ? a : 0 }
      );
      setReferralMsg({
        ok: true,
        text: `${res.created} fake filleuls créés (${formatNumber(res.totalAmountAllocated)} FCFA répartis).`,
      });
    } catch (e) {
      setReferralMsg({ ok: false, text: (e as { message?: string }).message ?? "Échec de la création" });
    } finally {
      setReferralBusy(null);
    }
  }

  async function onDeleteFakes() {
    if (referralBusy) return;
    setReferralBusy("delete");
    setReferralMsg(null);
    try {
      const res = await api.del<{ ok: boolean; deleted: number }>(
        `/v1/admin/users/${user.id}/fake-referrals`
      );
      setReferralMsg({ ok: true, text: `${res.deleted} fake filleuls supprimés.` });
    } catch (e) {
      setReferralMsg({ ok: false, text: (e as { message?: string }).message ?? "Échec de la suppression" });
    } finally {
      setReferralBusy(null);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(42,15,26,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 500,
          maxHeight: "90vh",
          overflowY: "auto",
          background: C.surface,
          borderRadius: 18,
          padding: 24,
          boxShadow: "0 24px 60px rgba(42,15,26,0.25)",
        }}
      >
        <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 18, color: C.ink, marginBottom: 4 }}>
          💰 Ajustements admin
        </div>
        <div style={{ fontSize: 13, color: C.ink2, marginBottom: 18 }}>
          {user.name} · {user.phone}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: C.ink2, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Wallet
        </div>

        <label style={{ display: "block", fontSize: 12, color: C.ink2, marginBottom: 6, fontWeight: 600 }}>
          Montant (FCFA) — négatif pour débiter
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
          style={{
            width: "100%",
            height: 44,
            padding: "0 14px",
            borderRadius: 10,
            border: `1px solid ${C.line}`,
            background: C.bg,
            fontSize: 16,
            fontFamily: "var(--font-bricolage), sans-serif",
            fontWeight: 700,
            color: C.ink,
            marginBottom: 14,
          }}
        />

        <label style={{ display: "block", fontSize: 12, color: C.ink2, marginBottom: 6, fontWeight: 600 }}>
          Raison
        </label>
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{
            width: "100%",
            height: 40,
            padding: "0 14px",
            borderRadius: 10,
            border: `1px solid ${C.line}`,
            background: C.bg,
            fontSize: 13,
            color: C.ink,
            marginBottom: 18,
          }}
        />

        {result && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: result.ok ? "rgba(92,138,69,0.12)" : "rgba(214,46,85,0.08)",
              color: result.ok ? C.green : C.coralDeep,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {result.message}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginBottom: 8 }}>
          <button
            onClick={onSubmit}
            disabled={submitting}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              background: C.indigo,
              border: 0,
              color: C.creamSoft,
              fontSize: 13,
              fontWeight: 700,
              cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            {submitting ? "Ajustement…" : "Créditer / débiter"}
          </button>
        </div>

        <button
          onClick={onClearAdminTx}
          disabled={!!referralBusy}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(214,46,85,0.08)",
            border: `1px solid rgba(214,46,85,0.18)`,
            color: C.coralDeep,
            fontSize: 12,
            fontWeight: 700,
            cursor: referralBusy ? "not-allowed" : "pointer",
            fontFamily: "var(--font-fraunces), serif",
            marginBottom: 22,
          }}
        >
          🧹 Annuler tous mes ajustements (efface les lignes admin de l'activité)
        </button>

        {/* TEMP-ADMIN-FIX: Parrainage section */}
        <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.ink2, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
            🎁 Parrainage
          </div>

          <label style={{ display: "block", fontSize: 12, color: C.ink2, marginBottom: 6, fontWeight: 600 }}>
            Code parrainage
          </label>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <input
              value={refCode}
              onChange={(e) => setRefCode(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                height: 40,
                padding: "0 14px",
                borderRadius: 10,
                border: `1px solid ${C.line}`,
                background: C.bg,
                fontSize: 14,
                fontFamily: "var(--font-bricolage), sans-serif",
                fontWeight: 700,
                color: C.ink,
                letterSpacing: "0.05em",
              }}
            />
            <button
              onClick={onChangeRefCode}
              disabled={!!referralBusy}
              style={{
                padding: "0 16px",
                borderRadius: 10,
                background: C.indigo,
                border: 0,
                color: C.creamSoft,
                fontSize: 12,
                fontWeight: 700,
                cursor: referralBusy ? "not-allowed" : "pointer",
                fontFamily: "var(--font-fraunces), serif",
              }}
            >
              Changer
            </button>
          </div>

          <label style={{ display: "block", fontSize: 12, color: C.ink2, marginBottom: 6, fontWeight: 600 }}>
            Créer des faux filleuls
          </label>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              value={fakeCount}
              onChange={(e) => setFakeCount(e.target.value)}
              placeholder="Nombre"
              inputMode="numeric"
              style={{
                width: 80,
                height: 40,
                padding: "0 12px",
                borderRadius: 10,
                border: `1px solid ${C.line}`,
                background: C.bg,
                fontSize: 14,
                fontWeight: 700,
                color: C.ink,
                textAlign: "center",
              }}
            />
            <input
              value={fakeAmount}
              onChange={(e) => setFakeAmount(e.target.value)}
              placeholder="Total FCFA gagné"
              inputMode="numeric"
              style={{
                flex: 1,
                height: 40,
                padding: "0 12px",
                borderRadius: 10,
                border: `1px solid ${C.line}`,
                background: C.bg,
                fontSize: 14,
                fontWeight: 700,
                color: C.ink,
              }}
            />
            <button
              onClick={onCreateFakes}
              disabled={!!referralBusy}
              style={{
                padding: "0 14px",
                borderRadius: 10,
                background: C.mango,
                border: 0,
                color: C.ink,
                fontSize: 12,
                fontWeight: 700,
                cursor: referralBusy ? "not-allowed" : "pointer",
                fontFamily: "var(--font-fraunces), serif",
              }}
            >
              Créer
            </button>
          </div>
          <button
            onClick={onDeleteFakes}
            disabled={!!referralBusy}
            style={{
              width: "100%",
              padding: "8px 14px",
              borderRadius: 10,
              background: "rgba(214,46,85,0.08)",
              border: `1px solid rgba(214,46,85,0.18)`,
              color: C.coralDeep,
              fontSize: 11,
              fontWeight: 700,
              cursor: referralBusy ? "not-allowed" : "pointer",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            🧹 Supprimer tous les faux filleuls
          </button>
        </div>

        {referralMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: referralMsg.ok ? "rgba(92,138,69,0.12)" : "rgba(214,46,85,0.08)",
              color: referralMsg.ok ? C.green : C.coralDeep,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {referralMsg.text}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              background: "transparent",
              border: `1px solid ${C.line}`,
              color: C.ink,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-fraunces), serif",
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
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
