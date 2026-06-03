"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api, formatNumber } from "@/lib/api";

type Kyc = "NONE" | "PENDING" | "APPROVED" | "REJECTED";

type UserDetail = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  whatsapp: string | null;
  sex: string | null;
  dob: string | null;
  city: string | null;
  country: string;
  avatarUrl: string | null;
  kycStatus: Kyc;
  emailVerified: boolean;
  phoneVerified: boolean;
  referralCode: string;
  referredBy: string | null;
  birthdayOptIn: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  wallet: { balancePrincipal: string; balanceReferral: string; currency: string } | null;
  _count: {
    sentCards: number;
    redeemedCards: number;
    anonymousLinks: number;
    referralsAsParrain: number;
  };
  transactions: Array<{
    id: string;
    type: string;
    amount: string;
    status: string;
    createdAt: string;
    cardId: string | null;
    metadata: Record<string, unknown> | null;
  }>;
  sentCards: Array<{
    id: string;
    redeemCode: string;
    recipientName: string | null;
    recipientPhone: string;
    amount: string;
    occasion: string | null;
    status: string;
    deliveryChannel: string;
    createdAt: string;
  }>;
  kycSubmissions: Array<{
    id: string;
    status: Kyc;
    docType: string;
    createdAt: string;
    reviewedAt: string | null;
    rejectionReason: string | null;
  }>;
  anonymousLinks: Array<{
    id: string;
    code: string;
    status: string;
    createdAt: string;
    _count: { messages: number };
  }>;
  referrals: Array<{
    id: string;
    totalEarned: string;
    rate: string;
    createdAt: string;
    filleul: { id: string; name: string; phone: string; createdAt: string };
  }>;
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const AVATAR_COLORS = [C.coral, C.indigo, C.pink, C.mango, C.mint, C.plum];
function colorFor(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]!;
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setError(null);
    setUser(null);
    api
      .get<UserDetail>(`/v1/admin/users/${userId}`)
      .then(setUser)
      .catch((e) => setError((e as { message?: string }).message ?? "Chargement impossible"));
  }, [userId]);

  async function onDelete() {
    if (!user) return;
    const ok = window.confirm(
      `⚠️ Supprimer définitivement le compte de ${user.name} ?\n\n` +
        `Les données personnelles seront anonymisées (RGPD).\n` +
        `Les transactions financières sont conservées (obligation BCEAO 10 ans).\n\n` +
        `Cette action est irréversible.`
    );
    if (!ok) return;

    setDeleting(true);
    try {
      await api.del(`/v1/admin/users/${userId}`);
      alert(`Compte de ${user.name} supprimé.`);
      router.push("/users");
    } catch (e) {
      alert(`Suppression échouée : ${(e as { message?: string }).message ?? "erreur"}`);
      setDeleting(false);
    }
  }

  if (error) {
    return (
      <>
        <TopBar title="Erreur" subtitle={error} actions={<BackButton onClick={() => router.push("/users")} />} />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <TopBar title="Chargement…" actions={<BackButton onClick={() => router.push("/users")} />} />
      </>
    );
  }

  const isDeleted = !!user.deletedAt;
  const initial = (user.name?.[0] ?? "?").toUpperCase();
  const balance = Number(user.wallet?.balancePrincipal ?? 0);
  const refBalance = Number(user.wallet?.balanceReferral ?? 0);

  return (
    <>
      <TopBar
        title={user.name}
        subtitle={`${user.phone}${user.email ? " · " + user.email : ""}`}
        actions={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <BackButton onClick={() => router.push("/users")} />
            {!isDeleted && (
              <button
                onClick={onDelete}
                disabled={deleting}
                style={{
                  height: 40,
                  padding: "0 14px",
                  borderRadius: 12,
                  background: C.coralDeep,
                  color: "#fff",
                  border: 0,
                  fontFamily: "var(--font-fraunces), serif",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: deleting ? "not-allowed" : "pointer",
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? "Suppression…" : "🗑️ Supprimer ce compte"}
              </button>
            )}
          </div>
        }
      />

      <div className="scroll" style={{ flex: 1, overflow: "auto", padding: "20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
        {isDeleted && (
          <div style={{ padding: 14, borderRadius: 12, background: "rgba(214,46,85,0.10)", border: `1px solid rgba(214,46,85,0.30)`, color: C.coralDeep, fontWeight: 600 }}>
            ⚠️ Ce compte a été supprimé le {formatDate(user.deletedAt)}. Les données personnelles ont été anonymisées.
          </div>
        )}

        {/* Header card with avatar + key info */}
        <div style={{ background: C.surface, borderRadius: 18, padding: 22, border: `1px solid ${C.line}`, display: "flex", gap: 18, alignItems: "center" }}>
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt="" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: colorFor(user.id), color: C.creamSoft, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 32 }}>
              {initial}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 22, color: C.ink }}>{user.name}</div>
            <div style={{ fontSize: 13, color: C.ink2, marginTop: 4 }}>
              Inscrit le {formatDate(user.createdAt)} · ID <code style={{ fontSize: 11 }}>{user.id}</code>
            </div>
          </div>
          <KycPill kyc={user.kycStatus} />
        </div>

        {/* Profile + Wallet grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Section title="👤 Profil">
            <Row label="Nom" value={user.name} />
            <Row label="Email" value={user.email ?? "—"} extra={user.emailVerified ? "✓ vérifié" : "non vérifié"} />
            <Row label="Téléphone" value={user.phone} extra={user.phoneVerified ? "✓ vérifié" : "non vérifié"} />
            <Row label="WhatsApp" value={user.whatsapp ?? user.phone} />
            <Row label="Pays" value={user.country} />
            <Row label="Ville" value={user.city ?? "—"} />
            <Row label="Sexe" value={user.sex ?? "—"} />
            <Row label="Date de naissance" value={user.dob ? formatDateShort(user.dob) : "—"} />
            <Row label="Code parrainage" value={user.referralCode} mono />
            <Row label="Parrainé par" value={user.referredBy ?? "—"} mono />
            <Row label="Anniversaire opt-in" value={user.birthdayOptIn ? "Oui" : "Non"} />
          </Section>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Section title="💰 Wallet">
              <Row label="Solde principal" value={`${formatNumber(balance)} FCFA`} highlight />
              <Row label="Solde parrainage" value={`${formatNumber(refBalance)} FCFA`} highlight />
              <Row label="Devise" value={user.wallet?.currency ?? "—"} />
            </Section>
            <Section title="📊 Activité">
              <Row label="Cartes envoyées" value={String(user._count.sentCards)} />
              <Row label="Cartes reçues" value={String(user._count.redeemedCards)} />
              <Row label="Liens anonymes" value={String(user._count.anonymousLinks)} />
              <Row label="Filleuls" value={String(user._count.referralsAsParrain)} />
            </Section>
          </div>
        </div>

        {/* Transactions */}
        <Section title={`💸 Transactions récentes (${user.transactions.length})`}>
          {user.transactions.length === 0 ? (
            <Empty msg="Aucune transaction." />
          ) : (
            <Table headers={["Date", "Type", "Montant", "Statut"]}>
              {user.transactions.map((t) => (
                <tr key={t.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={cell}>{formatDateShort(t.createdAt)}</td>
                  <td style={cell}>{t.type}</td>
                  <td style={{ ...cell, fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700 }}>
                    {formatNumber(Number(t.amount))} FCFA
                  </td>
                  <td style={cell}>{t.status}</td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        {/* Sent cards */}
        <Section title={`🎁 Cartes envoyées (${user.sentCards.length})`}>
          {user.sentCards.length === 0 ? (
            <Empty msg="Aucune carte envoyée." />
          ) : (
            <Table headers={["Date", "Destinataire", "Téléphone", "Montant", "Statut", "Canal"]}>
              {user.sentCards.map((c) => (
                <tr key={c.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={cell}>{formatDateShort(c.createdAt)}</td>
                  <td style={cell}>{c.recipientName ?? "—"}</td>
                  <td style={{ ...cell, fontFamily: "monospace", fontSize: 11 }}>{c.recipientPhone}</td>
                  <td style={{ ...cell, fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700 }}>
                    {formatNumber(Number(c.amount))} FCFA
                  </td>
                  <td style={cell}>{c.status}</td>
                  <td style={cell}>{c.deliveryChannel}</td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        {/* KYC */}
        <Section title={`📄 Soumissions KYC (${user.kycSubmissions.length})`}>
          {user.kycSubmissions.length === 0 ? (
            <Empty msg="Aucune soumission KYC." />
          ) : (
            <Table headers={["Date", "Type", "Statut", "Examiné le", "Raison rejet"]}>
              {user.kycSubmissions.map((k) => (
                <tr key={k.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={cell}>{formatDateShort(k.createdAt)}</td>
                  <td style={cell}>{k.docType}</td>
                  <td style={cell}><KycPill kyc={k.status} /></td>
                  <td style={cell}>{k.reviewedAt ? formatDateShort(k.reviewedAt) : "—"}</td>
                  <td style={{ ...cell, color: C.coralDeep }}>{k.rejectionReason ?? "—"}</td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        {/* Anonymous links */}
        <Section title={`💌 Liens anonymes (${user.anonymousLinks.length})`}>
          {user.anonymousLinks.length === 0 ? (
            <Empty msg="Aucun lien anonyme." />
          ) : (
            <Table headers={["Date", "Code", "Statut", "Messages"]}>
              {user.anonymousLinks.map((l) => (
                <tr key={l.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={cell}>{formatDateShort(l.createdAt)}</td>
                  <td style={{ ...cell, fontFamily: "monospace" }}>{l.code}</td>
                  <td style={cell}>{l.status}</td>
                  <td style={cell}>{l._count.messages}</td>
                </tr>
              ))}
            </Table>
          )}
        </Section>

        {/* Referrals */}
        <Section title={`🎉 Filleuls (${user.referrals.length})`}>
          {user.referrals.length === 0 ? (
            <Empty msg="Aucun filleul." />
          ) : (
            <Table headers={["Date", "Nom", "Téléphone", "Total gagné"]}>
              {user.referrals.map((r) => (
                <tr key={r.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                  <td style={cell}>{formatDateShort(r.createdAt)}</td>
                  <td style={cell}>{r.filleul.name}</td>
                  <td style={{ ...cell, fontFamily: "monospace", fontSize: 11 }}>{r.filleul.phone}</td>
                  <td style={{ ...cell, fontFamily: "var(--font-bricolage), sans-serif", fontWeight: 700 }}>
                    {formatNumber(Number(r.totalEarned))} FCFA
                  </td>
                </tr>
              ))}
            </Table>
          )}
        </Section>
      </div>
    </>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ height: 40, padding: "0 14px", borderRadius: 12, background: C.surface, color: C.ink, border: `1px solid ${C.line}`, fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
    >
      ← Retour
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.surface, borderRadius: 16, padding: 18, border: `1px solid ${C.line}` }}>
      <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 700, fontSize: 15, color: C.ink, marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>{children}</div>
    </div>
  );
}

function Row({ label, value, extra, mono, highlight }: { label: string; value: string; extra?: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, padding: "6px 0", borderBottom: `1px solid ${C.line}` }}>
      <span style={{ fontSize: 12, color: C.ink2, fontFamily: "var(--font-fraunces), serif", fontStyle: "italic" }}>{label}</span>
      <span
        style={{
          fontSize: highlight ? 16 : 13,
          fontWeight: highlight ? 700 : 500,
          color: C.ink,
          fontFamily: mono ? "monospace" : highlight ? "var(--font-bricolage), sans-serif" : "inherit",
        }}
      >
        {value} {extra && <span style={{ marginLeft: 8, fontSize: 11, color: C.ink2 }}>({extra})</span>}
      </span>
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: C.bg, borderBottom: `1px solid ${C.line}` }}>
          {headers.map((h) => (
            <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontSize: 10, color: C.ink2, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

const cell: React.CSSProperties = { padding: "10px", fontSize: 12, color: C.ink };

function Empty({ msg }: { msg: string }) {
  return <div style={{ padding: 16, textAlign: "center", color: C.ink2, fontStyle: "italic", fontSize: 12 }}>{msg}</div>;
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
    <span style={{ padding: "4px 10px", borderRadius: 6, background: s.bg, color: s.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em" }}>
      {s.label}
    </span>
  );
}
