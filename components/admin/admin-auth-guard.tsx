"use client";

import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
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
  email: string;
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
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!configured) {
      setChecking(false);
      return;
    }

    const sb = getAdminAuthBrowserClient();
    let mounted = true;

    sb.auth.getUser().then(({ data, error }) => {
      if (!mounted) return;
      if (error || !data.user?.email) {
        router.replace("/admin-super/admin-login");
        return;
      }
      setEmail(data.user.email);
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
    await getAdminAuthBrowserClient().auth.signOut();
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

  if (!email) return null;

  return <Ctx.Provider value={{ email, logout }}>{children}</Ctx.Provider>;
}
