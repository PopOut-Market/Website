"use client";

import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AdminAuthCtx = {
  identity: string;
  logout: () => Promise<void>;
};

const Ctx = createContext<AdminAuthCtx | null>(null);

export function useAdminAuth(): AdminAuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthGuard");
  return ctx;
}

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const configured = useMemo(() => isAdminAuthConfigured(), []);
  const [identity, setIdentity] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!configured) {
      setChecking(false);
      return;
    }

    const sb = getAdminAuthBrowserClient();
    let mounted = true;

    sb.auth.getUser().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error || !data.user?.id) {
        router.replace("/admin-super/admin-login");
        return;
      }
      // Authentication alone is not enough — confirm the user is an authorized
      // admin server-side. A signed-in non-admin must not see the dashboard.
      const res = await adminApiFetch("/api/admin/me").catch(() => null);
      if (!mounted) return;
      if (!res || !res.ok) {
        // scope: "local" ends only this browser's session. A global sign-out
        // would revoke every session on the account (e.g. the admin's PopOut
        // mobile app), which must never happen from the admin website.
        await sb.auth.signOut({ scope: "local" }).catch(() => {});
        router.replace("/admin-super/admin-login");
        return;
      }
      // Phone-OTP admins have no email; fall back to phone, then user id.
      setIdentity(data.user.phone ?? data.user.email ?? data.user.id);
      setChecking(false);
    });

    const { data: sub } = sb.auth.onAuthStateChange((_, session) => {
      if (!session) {
        router.replace("/admin-super/admin-login");
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [configured, router]);

  const logout = useCallback(async () => {
    if (!configured) return;
    // scope: "local" clears only this browser's session/storage. The default
    // (scope: "global") would delete every session on the account server-side,
    // logging the admin out of the PopOut mobile app on their phone too.
    await getAdminAuthBrowserClient().auth.signOut({ scope: "local" });
    router.replace("/admin-super/admin-login");
    router.refresh();
  }, [configured, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Verifying session...</p>
      </div>
    );
  }

  if (!identity) return null;

  return <Ctx.Provider value={{ identity, logout }}>{children}</Ctx.Provider>;
}
