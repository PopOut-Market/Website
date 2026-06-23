"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "./admin-auth-guard";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin-super/dashboard", icon: "📊" },
  { label: "Reward review", href: "/admin-super/dashboard/reward-review", icon: "🪙" },
  { label: "Invitations", href: "/admin-super/dashboard/invitations", icon: "🔗" },
  { label: "My accounts", href: "/admin-super/dashboard/accounts", icon: "🗂️" },
  { label: "Vouchers", href: "/admin-super/dashboard/vouchers", icon: "🎟️" },
  { label: "Geographic", href: "/admin-super/dashboard/geographic", icon: "🗺️" },
  { label: "Categories", href: "/admin-super/dashboard/categories", icon: "📦" },
  { label: "Likes", href: "/admin-super/dashboard/likes", icon: "❤️" },
  { label: "Reports", href: "/admin-super/dashboard/reports", icon: "🚩" },
  { label: "Feedback", href: "/admin-super/dashboard/feedback", icon: "💬" },
] as const;

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { identity, logout } = useAdminAuth();

  function isActive(href: string) {
    if (href === "/admin-super/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Backdrop — only on mobile when the drawer is open. */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          aria-hidden="true"
          onClick={onClose}
        />
      )}

      {/* Off-canvas on mobile (slides in from the left), static on md+. */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 max-w-[80%] shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 md:static md:w-56 md:max-w-none md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <p className="text-lg font-semibold tracking-tight text-slate-900">PopOut Admin</p>
          {/* Close button — mobile only. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 md:hidden"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(item.href)
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 px-3 py-3">
          <p className="mb-2 truncate text-xs text-slate-500" title={identity}>
            {identity}
          </p>
          <button
            type="button"
            onClick={logout}
            className="w-full rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
