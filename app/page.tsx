"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { C } from "@/lib/colors";
import { LogoMark } from "@/components/LogoMark";
import { api, saveSession, hasToken, type ApiError } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hasToken()) router.replace("/dashboard");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Email et mot de passe requis");
      return;
    }
    setBusy(true);
    try {
      const data = await api.post<{ token: string; email: string; expiresAt: string }>(
        "/v1/admin/auth/login",
        { email: email.trim(), password }
      );
      saveSession(data.token, data.email);
      router.push("/dashboard");
    } catch (err) {
      const e = err as ApiError;
      if (e.status === 401) setError("Email ou mot de passe incorrect");
      else if (e.status === 403) setError("Accès refusé — cet email n'est pas admin");
      else if (e.code === "ADMIN_NOT_CONFIGURED") setError("Back-office pas encore configuré côté serveur");
      else setError(e.message || "Connexion impossible");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: `linear-gradient(160deg, ${C.indigo} 0%, ${C.indigoDeep} 100%)`,
        position: "relative",
        overflow: "hidden",
        padding: 24,
      }}
    >
      <svg
        className="c-spin-slow"
        style={{ position: "absolute", top: -120, right: -120, opacity: 0.18 }}
        width="400"
        height="400"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" stroke={C.mango} strokeWidth="0.4" fill="none" />
        <circle cx="50" cy="50" r="32" stroke={C.mango} strokeWidth="0.4" fill="none" strokeDasharray="2 3" />
        <circle cx="50" cy="50" r="20" fill={C.mango} opacity="0.5" />
      </svg>
      <svg
        className="c-spin-slow"
        style={{
          position: "absolute",
          bottom: -160,
          left: -160,
          opacity: 0.12,
          animationDirection: "reverse",
        }}
        width="500"
        height="500"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" stroke={C.coral} strokeWidth="0.4" fill="none" />
        <circle cx="50" cy="50" r="28" stroke={C.coral} strokeWidth="0.4" fill="none" />
      </svg>

      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          background: C.surface,
          borderRadius: 24,
          padding: "36px 32px",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <LogoMark size={48} />
          <div>
            <div
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 500,
                fontSize: 22,
                letterSpacing: "-0.01em",
                color: C.ink,
              }}
            >
              Donia
            </div>
            <div
              style={{
                fontSize: 11,
                color: C.mango,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Back-office
            </div>
          </div>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: C.ink,
            margin: 0,
          }}
        >
          Connexion admin
        </h1>
        <p
          style={{
            marginTop: 6,
            fontSize: 13,
            color: C.ink2,
            fontFamily: "var(--font-fraunces), serif",
            fontStyle: "italic",
          }}
        >
          Accès réservé à l&rsquo;équipe NovekAI.
        </p>

        <div style={{ marginTop: 24 }}>
          <Label>Email</Label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="contact@doniia.com"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: 14 }}>
          <Label>Mot de passe</Label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            style={inputStyle}
          />
        </div>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 10,
              background: "rgba(214,46,85,0.08)",
              border: `1px solid rgba(214,46,85,0.18)`,
              color: C.coralDeep,
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          style={{
            marginTop: 22,
            width: "100%",
            height: 48,
            borderRadius: 12,
            background: "linear-gradient(140deg, #F4486F 0%, #D62E55 100%)",
            color: "#FDF7F6",
            border: 0,
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 600,
            fontSize: 15,
            cursor: busy ? "not-allowed" : "pointer",
            opacity: busy ? 0.65 : 1,
            boxShadow: "0 12px 30px -10px rgba(244,72,111,0.5)",
          }}
        >
          {busy ? "Connexion…" : "Se connecter →"}
        </button>

        <p style={{ marginTop: 18, fontSize: 11, color: C.ink3, textAlign: "center" }}>
          Donia v1.0 · NovekAI Agency
        </p>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  border: `1px solid ${C.line}`,
  borderRadius: 10,
  padding: "0 14px",
  fontSize: 14,
  fontFamily: "inherit",
  background: C.bg,
  color: C.ink,
  outline: "none",
};

function Label({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </label>
  );
}
