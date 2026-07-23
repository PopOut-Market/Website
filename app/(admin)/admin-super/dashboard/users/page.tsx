"use client";

import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { getPostImageUrl } from "@/lib/supabase/post-image-url";
import { useEffect, useMemo, useState } from "react";

type UserPost = {
  id: number;
  title: string | null;
  priceCents: number | null;
  status: string | null;
  thumbnailPath: string | null;
  createdAt: string;
};
type ReportAgainst = {
  id: string;
  kind: "post" | "user";
  reason: string;
  status: string;
  createdAt: string;
};
type ManagedUser = {
  id: string;
  nickname: string;
  createdAt: string;
  lastActiveAt: string | null;
  isBanned: boolean;
  language: string | null;
  suburb: string | null;
  invitedBy: { id: string; nickname: string } | null;
  counts: {
    posts: number;
    available: number;
    sold: number;
    reportedAgainst: number;
    reportedSuccessful: number;
    reportedBy: number;
  };
  availablePosts: UserPost[];
  soldPosts: UserPost[];
  reportsAgainst: ReportAgainst[];
};

type SortKey = "recent" | "posts" | "sold" | "reported" | "reportedBy" | "reportedSuccessful";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Registration (newest)" },
  { key: "posts", label: "Most posts" },
  { key: "sold", label: "Most sold" },
  { key: "reported", label: "Most reported" },
  { key: "reportedBy", label: "Most reports filed" },
  { key: "reportedSuccessful", label: "Most reports upheld" },
];

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });
function priceLabel(cents: number | null): string {
  return cents == null ? "—" : aud.format(cents / 100);
}
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleDateString() : "—";
}
function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? new Date(t).toLocaleString() : "—";
}

function metric(u: ManagedUser, key: SortKey): number {
  switch (key) {
    case "posts":
      return u.counts.posts;
    case "sold":
      return u.counts.sold;
    case "reported":
      return u.counts.reportedAgainst;
    case "reportedBy":
      return u.counts.reportedBy;
    case "reportedSuccessful":
      return u.counts.reportedSuccessful;
    default:
      return 0;
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    adminApiFetch("/api/admin/users", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => null);
          setError(j?.error ?? `Request failed (${r.status}).`);
          return;
        }
        setUsers(((await r.json()) as { users: ManagedUser[] }).users);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  const shown = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    const filtered = q ? users.filter((u) => u.nickname.toLowerCase().includes(q)) : users;
    const sorted = [...filtered];
    if (sortKey === "recent") {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else {
      // Sort by the chosen metric (high → low), newest registration breaks ties.
      sorted.sort(
        (a, b) => metric(b, sortKey) - metric(a, sortKey) || b.createdAt.localeCompare(a.createdAt),
      );
    }
    return sorted;
  }, [users, search, sortKey]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">User management</h1>
        <p className="mt-1 text-sm text-slate-600">
          Every existing user (deleted accounts excluded), newest registration first by default.
          Search by name, or sort by a metric. Click a user for their listings and reports.
        </p>
      </div>

      {/* Search + single-select sort filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          aria-label="Sort users"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && users && (
        <p className="text-xs text-slate-500">
          {shown.length} of {users.length} user{users.length === 1 ? "" : "s"}
          {search.trim() ? ` matching “${search.trim()}”` : ""}.
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <p className="text-sm text-slate-400">No users found.</p>
      ) : (
        <div className="space-y-2.5">
          {shown.map((u) => (
            <UserRow
              key={u.id}
              user={u}
              sortKey={sortKey}
              isOpen={expanded === u.id}
              onToggle={() => setExpanded((prev) => (prev === u.id ? null : u.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CountPill({
  label,
  value,
  highlight,
  tone = "slate",
}: {
  label: string;
  value: number;
  highlight?: boolean;
  tone?: "slate" | "rose" | "emerald";
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-600",
    rose: "bg-rose-100 text-rose-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  const cls = value > 0 && tone !== "slate" ? tones[tone] : tones.slate;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${cls} ${
        highlight ? "ring-2 ring-indigo-300" : ""
      }`}
      title={label}
    >
      {label} {value}
    </span>
  );
}

function UserRow({
  user,
  sortKey,
  isOpen,
  onToggle,
}: {
  user: ManagedUser;
  sortKey: SortKey;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
      >
        <span className="text-slate-400">{isOpen ? "▾" : "▸"}</span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {(user.nickname.trim()[0] ?? "?").toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-semibold text-slate-900">{user.nickname}</span>
            {user.isBanned && (
              <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                BANNED
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-slate-400">
            <span>Joined {fmtDate(user.createdAt)}</span>
            <span aria-hidden>·</span>
            {user.invitedBy ? (
              <span>
                Invited by{" "}
                <span className="font-medium text-slate-600">{user.invitedBy.nickname}</span>
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 font-medium text-slate-500">
                No inviter
              </span>
            )}
          </div>
        </div>
        <div className="hidden flex-wrap items-center justify-end gap-1.5 sm:flex">
          <CountPill label="posts" value={user.counts.posts} highlight={sortKey === "posts"} />
          <CountPill label="sold" value={user.counts.sold} highlight={sortKey === "sold"} />
          <CountPill
            label="reported"
            value={user.counts.reportedAgainst}
            tone="rose"
            highlight={sortKey === "reported"}
          />
          {(sortKey === "reportedBy" || user.counts.reportedBy > 0) && (
            <CountPill
              label="filed"
              value={user.counts.reportedBy}
              highlight={sortKey === "reportedBy"}
            />
          )}
          {(sortKey === "reportedSuccessful" || user.counts.reportedSuccessful > 0) && (
            <CountPill
              label="upheld"
              value={user.counts.reportedSuccessful}
              tone="rose"
              highlight={sortKey === "reportedSuccessful"}
            />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="space-y-5 border-t border-slate-100 bg-slate-50/50 p-4">
          {/* Quick facts */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-600">
            <span>
              Last active: <span className="font-medium">{fmtDateTime(user.lastActiveAt)}</span>
            </span>
            <span>
              Verified suburb: <span className="font-medium">{user.suburb ?? "—"}</span>
            </span>
            <span>
              Language: <span className="font-medium">{user.language ?? "—"}</span>
            </span>
            <span>
              Invited by:{" "}
              <span className="font-medium">
                {user.invitedBy ? user.invitedBy.nickname : "— (no inviter)"}
              </span>
            </span>
            <span>
              Reports filed: <span className="font-medium">{user.counts.reportedBy}</span>
            </span>
            <span>
              Reports upheld against:{" "}
              <span className="font-medium">{user.counts.reportedSuccessful}</span>
            </span>
          </div>

          {/* Reports against this user */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Reports against ({user.reportsAgainst.length})
            </h3>
            {user.reportsAgainst.length === 0 ? (
              <p className="text-sm text-slate-400">None.</p>
            ) : (
              <ul className="space-y-1.5">
                {user.reportsAgainst.map((r) => (
                  <li
                    key={r.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-600">
                      {r.kind === "post" ? "on a post" : "on the user"}
                    </span>
                    <span className="text-slate-700">{r.reason}</span>
                    <ReportStatusBadge status={r.status} />
                    <span className="ml-auto text-xs text-slate-400">{fmtDate(r.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Available + sold listings */}
          <div className="grid gap-5 lg:grid-cols-2">
            <PostList
              title={`Available posts (${user.counts.available})`}
              posts={user.availablePosts}
            />
            <PostList title={`Sold posts (${user.counts.sold})`} posts={user.soldPosts} />
          </div>
        </div>
      )}
    </div>
  );
}

function ReportStatusBadge({ status }: { status: string }) {
  const tone =
    status === "actioned"
      ? "bg-rose-100 text-rose-700"
      : status === "dismissed"
        ? "bg-slate-100 text-slate-500"
        : "bg-amber-100 text-amber-700"; // pending / reviewed / other
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}>{status}</span>;
}

function PostList({ title, posts }: { title: string; posts: UserPost[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {posts.length === 0 ? (
        <p className="text-sm text-slate-400">None.</p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
          {posts.map((p) => {
            const thumb = getPostImageUrl(p.thumbnailPath);
            return (
              <div key={p.id} className="flex items-center gap-3">
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm">
                    🖼️
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-800">{p.title || "(untitled)"}</p>
                  <p className="text-xs text-slate-400">
                    {priceLabel(p.priceCents)} · {fmtDate(p.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
