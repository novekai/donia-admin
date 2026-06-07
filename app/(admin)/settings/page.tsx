"use client";

import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { TopBar } from "@/components/TopBar";
import { api } from "@/lib/api";

type SettingKey =
  | "commission_rate"
  | "min_card_amount"
  | "min_withdrawal_amount"
  | "max_auto_payout_amount"
  | "max_amount_no_kyc"
  | "referral_lifetime_active"
  | "channel_push"
  | "channel_email"
  | "channel_whatsapp";

type SettingsResponse = {
  settings: Record<SettingKey, number | boolean>;
  admins: string[];
};

const OPERATORS = [
  { name: "MTN", countries: "Bénin · Côte d'Ivoire", live: true, c: C.mango },
  { name: "Moov", countries: "Bénin · Togo · Burkina", live: true, c: C.indigo },
  { name: "Orange", countries: "Sénégal · Mali · Côte d'Ivoire", live: true, c: C.coral },
  { name: "Wave", countries: "Sénégal · Côte d'Ivoire", live: true, c: C.mint },
  { name: "Free Money", countries: "Sénégal", live: false, c: C.plum },
];

const AVATAR_COLORS = [C.coral, C.indigo, C.pink, C.mango, C.mint, C.plum];
function colorFor(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]!;
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<SettingKey | null>(null);
  const [saved, setSaved] = useState<SettingKey | null>(null);

  async function load() {
    setError(null);
    try {
      const res = await api.get<SettingsResponse>("/v1/admin/settings");
      setData(res);
    } catch (e) {
      setError((e as { message?: string }).message ?? "Chargement impossible");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function update(key: SettingKey, value: number | boolean) {
    if (!data) return;
    setSaving(key);
    // Optimistic update so toggles feel snappy.
    setData({ ...data, settings: { ...data.settings, [key]: value } });
    try {
      await api.patch(`/v1/admin/settings/${key}`, { value });
      setSaved(key);
      setTimeout(() => setSaved((s) => (s === key ? null : s)), 1500);
    } catch (e) {
      alert((e as { message?: string }).message ?? "Sauvegarde impossible");
      load();
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      <TopBar title="Paramètres" subtitle="Configuration plateforme · Donia v1.0" />

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

        {!data && !error && (
          <div style={{ padding: 40, textAlign: "center", color: C.ink2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
            Chargement des paramètres…
          </div>
        )}

        {data && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Économique */}
            <Card title="Modèle économique" subtitle="Commission prélevée à la conversion · valeurs persistées en base">
              <NumberField
                label="Commission par défaut (%)"
                suffix="% du montant"
                value={data.settings.commission_rate as number}
                onCommit={(v) => update("commission_rate", v)}
                busy={saving === "commission_rate"}
                saved={saved === "commission_rate"}
                accent={C.coral}
              />
              <NumberField
                label="Montant minimum d'une carte"
                suffix="FCFA"
                value={data.settings.min_card_amount as number}
                onCommit={(v) => update("min_card_amount", v)}
                busy={saving === "min_card_amount"}
                saved={saved === "min_card_amount"}
              />
              <NumberField
                label="Montant minimum d'un retrait"
                suffix="FCFA"
                value={data.settings.min_withdrawal_amount as number}
                onCommit={(v) => update("min_withdrawal_amount", v)}
                busy={saving === "min_withdrawal_amount"}
                saved={saved === "min_withdrawal_amount"}
              />
              <NumberField
                label="Plafond payout auto (au-delà → validation manuelle)"
                suffix="FCFA"
                value={data.settings.max_auto_payout_amount as number}
                onCommit={(v) => update("max_auto_payout_amount", v)}
                busy={saving === "max_auto_payout_amount"}
                saved={saved === "max_auto_payout_amount"}
              />
              <NumberField
                label="Montant maximum sans KYC"
                suffix="FCFA"
                value={data.settings.max_amount_no_kyc as number}
                onCommit={(v) => update("max_amount_no_kyc", v)}
                busy={saving === "max_amount_no_kyc"}
                saved={saved === "max_amount_no_kyc"}
              />
              <ToggleField
                label="Parrainage à vie"
                hint="1% reversé au parrain · à vie"
                value={data.settings.referral_lifetime_active as boolean}
                onChange={(v) => update("referral_lifetime_active", v)}
                busy={saving === "referral_lifetime_active"}
              />
            </Card>

            {/* Opérateurs (lecture seule — gérés chez FedaPay) */}
            <Card
              title="Opérateurs Mobile Money"
              subtitle="17 méthodes intégrées via FedaPay · lecture seule"
            >
              {OPERATORS.map((op, i) => (
                <div
                  key={op.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: i < OPERATORS.length - 1 ? `1px solid ${C.line}` : 0,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: `${op.c}22`,
                      color: op.c,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontFamily: "var(--font-fraunces), serif",
                      fontSize: 12,
                    }}
                  >
                    {op.name.slice(0, 2)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{op.name}</div>
                    <div style={{ fontSize: 11, color: C.ink2 }}>{op.countries}</div>
                  </div>
                  <StaticToggle on={op.live} />
                </div>
              ))}
            </Card>

            {/* Notifications */}
            <Card title="Canaux de notification" subtitle="Canaux activés côté utilisateurs finaux">
              {(
                [
                  { key: "channel_push" as const, name: "Push (in-app)", emoji: "🔔" },
                  { key: "channel_email" as const, name: "Email transactionnel", emoji: "✉️" },
                  { key: "channel_whatsapp" as const, name: "WhatsApp Business", emoji: "📲" },
                ]
              ).map((n, i, arr) => (
                <div
                  key={n.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : 0,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: C.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    {n.emoji}
                  </div>
                  <div style={{ flex: 1, fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>{n.name}</div>
                  <button
                    onClick={() => update(n.key, !data.settings[n.key])}
                    disabled={saving === n.key}
                    style={{
                      background: "none",
                      border: 0,
                      padding: 0,
                      cursor: saving === n.key ? "not-allowed" : "pointer",
                    }}
                    aria-label={`Toggle ${n.name}`}
                  >
                    <StaticToggle on={data.settings[n.key] as boolean} />
                  </button>
                </div>
              ))}
            </Card>

            {/* Equipe */}
            <Card
              title="Équipe admin"
              subtitle={`${data.admins.length} admin(s) · whitelist ADMIN_EMAILS sur Railway`}
            >
              {data.admins.length === 0 ? (
                <div style={{ padding: 20, textAlign: "center", color: C.ink2, fontStyle: "italic", fontSize: 13 }}>
                  Aucun admin configuré. Ajoute des emails à la variable ADMIN_EMAILS sur Railway.
                </div>
              ) : (
                data.admins.map((email, i, arr) => (
                  <div
                    key={email}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 0",
                      borderBottom: i < arr.length - 1 ? `1px solid ${C.line}` : 0,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: colorFor(email),
                        color: C.creamSoft,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-fraunces), serif",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "monospace",
                          fontSize: 13,
                          color: C.ink,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {email}
                      </div>
                    </div>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 5,
                        background: "rgba(65,8,123,0.12)",
                        color: C.indigo,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                      }}
                    >
                      ADMIN
                    </span>
                  </div>
                ))
              )}
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ padding: 24, background: C.surface, borderRadius: 18, border: `1px solid ${C.line}` }}>
      <div>
        <div style={{ fontFamily: "var(--font-fraunces), serif", fontSize: 18, fontWeight: 600 }}>{title}</div>
        <div style={{ fontSize: 12, color: C.ink2, marginTop: 2, fontStyle: "italic", fontFamily: "var(--font-fraunces), serif" }}>
          {subtitle}
        </div>
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

function NumberField({
  label,
  suffix,
  value,
  onCommit,
  busy,
  saved,
  accent,
}: {
  label: string;
  suffix: string;
  value: number;
  onCommit: (n: number) => void;
  busy?: boolean;
  saved?: boolean;
  accent?: string;
}) {
  const [draft, setDraft] = useState<string>(String(value));
  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "var(--font-fraunces), serif",
          fontStyle: "italic",
          fontSize: 12,
          color: C.ink2,
          marginBottom: 6,
        }}
      >
        {label}
        {saved && (
          <span style={{ fontStyle: "normal", color: C.green, fontWeight: 700, fontSize: 11 }}>✓ Enregistré</span>
        )}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          borderRadius: 10,
          background: C.bg,
          border: `1px solid ${C.line}`,
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9.,]/g, ""))}
          onBlur={() => {
            const n = Number(draft.replace(/[^0-9.]/g, ""));
            if (!Number.isFinite(n) || n < 0) {
              setDraft(String(value));
              return;
            }
            if (n !== value) onCommit(n);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
          }}
          disabled={busy}
          style={{
            flex: 1,
            border: 0,
            background: "transparent",
            fontFamily: "var(--font-bricolage), sans-serif",
            fontSize: 18,
            fontWeight: 700,
            color: accent ?? C.ink,
            outline: "none",
          }}
        />
        <span style={{ fontSize: 12, color: C.ink2 }}>{suffix}</span>
      </div>
    </div>
  );
}

function ToggleField({
  label,
  hint,
  value,
  onChange,
  busy,
}: {
  label: string;
  hint: string;
  value: boolean;
  onChange: (v: boolean) => void;
  busy?: boolean;
}) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-fraunces), serif",
          fontStyle: "italic",
          fontSize: 12,
          color: C.ink2,
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <button
        onClick={() => onChange(!value)}
        disabled={busy}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: 10,
          background: C.bg,
          border: `1px solid ${C.line}`,
          cursor: busy ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 13, color: C.ink }}>{hint}</span>
        <StaticToggle on={value} />
      </button>
    </div>
  );
}

function StaticToggle({ on }: { on: boolean }) {
  return (
    <div
      style={{
        width: 38,
        height: 22,
        borderRadius: 99,
        background: on ? C.green : "rgba(42,15,26,0.15)",
        position: "relative",
        flexShrink: 0,
        transition: "background .15s",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: on ? 18 : 2,
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: C.creamSoft,
          transition: "left .15s",
        }}
      />
    </div>
  );
}
