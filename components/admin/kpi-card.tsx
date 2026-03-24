type KpiCardProps = {
  label: string;
  total: number | string;
  today?: number | string;
  loading?: boolean;
};

export function KpiCard({ label, total, today, loading }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
      {loading ? (
        <div className="mt-2 h-7 w-20 animate-pulse rounded bg-slate-100" />
      ) : (
        <p className="mt-1 text-2xl font-semibold text-slate-900">{total}</p>
      )}
      {today !== undefined && !loading && (
        <p className="mt-1 text-xs text-slate-500">
          Today <span className="font-medium text-emerald-600">+{today}</span>
        </p>
      )}
    </div>
  );
}
