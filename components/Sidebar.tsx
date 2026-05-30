"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { C } from "@/lib/colors";
import { LogoMark } from "./LogoMark";

type NavItem = {
  href: string;
  label: string;
  badge?: string;
  badgeColor?: "coral" | "mint";
  icon: (color: string) => React.ReactNode;
};

const NAV: NavItem[] = [
  {
    href: "/dashboard",
    label: "Tableau de bord",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    href: "/cards",
    label: "Cartes cadeaux",
    badge: "NEW",
    badgeColor: "mint",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
      </svg>
    ),
  },
  {
    href: "/designer",
    label: "Designer",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
  },
  {
    href: "/users",
    label: "Utilisateurs",
    badge: "12",
    badgeColor: "coral",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    href: "/kyc",
    label: "KYC à valider",
    badge: "4",
    badgeColor: "coral",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="3" />
        <path d="M3 17l4-4 3 3 5-5 6 6" />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Paramètres",
    icon: (c) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <div
      style={{
        width: 240,
        height: "100%",
        background: C.indigoDeep,
        color: C.creamSoft,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        padding: "20px 14px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* deco circles */}
      <svg
        className="c-spin-slow"
        style={{ position: "absolute", bottom: -80, right: -80, opacity: 0.15 }}
        width="220"
        height="220"
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="45" stroke={C.mango} strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="32" stroke={C.mango} strokeWidth="0.5" fill="none" strokeDasharray="2 3" />
        <circle cx="50" cy="50" r="20" fill={C.mango} opacity="0.4" />
      </svg>

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "0 8px 24px",
          borderBottom: "1px solid rgba(255,241,220,0.08)",
          marginBottom: 18,
          position: "relative",
        }}
      >
        <LogoMark size={40} />
        <div>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 500, fontSize: 18, letterSpacing: "-0.01em" }}>
            Donia
          </div>
          <div style={{ fontSize: 10, color: C.mango, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
            Back-office
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, position: "relative" }}>
        {NAV.map((item) => {
          const on = pathname === item.href || pathname.startsWith(item.href + "/");
          const badgeBg = item.badgeColor === "mint" ? C.mint : C.coral;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: on ? "rgba(249,160,28,0.18)" : "transparent",
                color: on ? C.mango : C.creamSoft,
                cursor: "pointer",
                marginBottom: 2,
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: on ? 600 : 500,
                fontSize: 14,
                transition: "background .15s, color .15s",
                position: "relative",
                textDecoration: "none",
              }}
            >
              {on && (
                <div
                  style={{
                    position: "absolute",
                    left: -14,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    borderRadius: 99,
                    background: C.mango,
                  }}
                />
              )}
              {item.icon(on ? C.mango : C.creamSoft)}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    padding: "2px 6px",
                    borderRadius: 5,
                    background: badgeBg,
                    color: C.creamSoft,
                    fontSize: 10,
                    fontWeight: 700,
                    fontFamily: "var(--font-bricolage), sans-serif",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User block */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 8px",
          borderRadius: 12,
          background: "rgba(255,241,220,0.06)",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: C.coral,
            color: C.creamSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-fraunces), serif",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          E
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-fraunces), serif", fontWeight: 600, fontSize: 13 }}>Espoir K.</div>
          <div style={{ fontSize: 10, color: C.mango, fontWeight: 600 }}>Admin · NovekAI</div>
        </div>
        <Link href="/" aria-label="Déconnexion" style={{ color: C.creamSoft }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
