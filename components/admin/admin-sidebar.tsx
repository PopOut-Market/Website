"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "./admin-auth-guard";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin-super/dashboard", icon: "📊" },
  { label: "Geographic", href: "/admin-super/dashboard/geographic", icon: "🗺️" },
  { label: "Categories", href: "/admin-super/dashboard/categories", icon: "📦" },
  { label: "Likes", href: "/admin-super/dashboard/likes", icon: "❤️" },
  { label: "Students", href: "/admin-super/dashboard/students", icon: "🎓" },
  { label: "Reports", href: "/admin-super/dashboard/reports", icon: "🚩" },
  { label: "Feedback", href: "/admin-super/dashboard/feedback", icon: "💬" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { email, logout } = useAdminAuth();

  function isActive(href: string) {
    if (href === "/admin-super/dashboard") return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <p className="text-lg font-semibold tracking-tight text-slate-900">PopOut Admin</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
        <p className="mb-2 truncate text-xs text-slate-500" title={email}>
          {email}
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
  );
}
