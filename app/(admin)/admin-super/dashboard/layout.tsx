"use client";

import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { ReactNode } from "react";

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
