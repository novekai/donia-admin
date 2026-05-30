"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { hasToken } from "@/lib/api";

// Client-side gate: bounces to /login if no token is present.
// We render nothing during the check to avoid a flash of admin chrome.
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
