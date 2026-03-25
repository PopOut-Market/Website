"use client";

import { KpiCard } from "@/components/admin/kpi-card";
import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#6366f1", "#e2e8f0"];

export default function StudentsPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [universities, setUniversities] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminAuthConfigured()) return;
    const sb = getAdminAuthBrowserClient();

    async function load() {
      setLoading(true);

      const { data: profiles } = await sb.from("profiles").select("is_student, university_name");

      const total = profiles?.length ?? 0;
      const students = profiles?.filter((p: { is_student: boolean | null }) => p.is_student) ?? [];
      setTotalUsers(total);
      setStudentCount(students.length);

      const uniCounts: Record<string, number> = {};
      students.forEach((p: { university_name: string | null }) => {
        const name = p.university_name ?? "Unknown";
        uniCounts[name] = (uniCounts[name] ?? 0) + 1;
      });
      setUniversities(
        Object.entries(uniCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
      );

      setLoading(false);
    }

    load();
  }, []);

  const studentPct = totalUsers > 0 ? Math.round((studentCount / totalUsers) * 100) : 0;
  const studentBreakdown = [
    { name: "Student", value: studentCount, color: COLORS[0] },
    { name: "Non-Student", value: Math.max(totalUsers - studentCount, 0), color: COLORS[1] },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Student Verification Analytics</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Users" total={totalUsers} loading={loading} />
        <KpiCard label="Students" total={studentCount} loading={loading} />
        <KpiCard label="Student %" total={`${studentPct}%`} loading={loading} />
        <KpiCard label="Universities" total={universities.length} loading={loading} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">Student vs Non-Student</h2>
          {loading ? (
            <div className="h-56 animate-pulse rounded bg-slate-100" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-[220px,1fr] sm:items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={studentBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    label={false}
                  >
                    {studentBreakdown.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2">
                {studentBreakdown.map((item) => {
                  const pct = totalUsers > 0 ? Math.round((item.value / totalUsers) * 100) : 0;
                  return (
                    <div key={item.name} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-700">{item.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">By University</h2>
          {loading ? (
            <div className="h-56 animate-pulse rounded bg-slate-100" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={universities.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </div>
  );
}
