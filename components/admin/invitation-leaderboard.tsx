"use client";

import { Fragment, useMemo, useState } from "react";

export type GraphNode = { id: string; label: string; invites: number; invited: number };
export type GraphLink = { source: string; target: string; paid: boolean };

type ChildEdge = { id: string; paid: boolean };
type Forest = {
  byId: Map<string, GraphNode>;
  children: Map<string, ChildEdge[]>;
};

/**
 * Referral adjacency, built once: children per node (with the per-edge `paid`
 * flag) plus an id→node lookup. Same cycle-safe, first-parent-wins shape the
 * old SVG renderer built in `computeTreeLayout`, minus the x/y layout — here we
 * render plain DOM text at a fixed size, so a wide forest can never shrink the
 * labels to sub-pixel the way the fit-to-viewBox <svg> did.
 */
function buildForest(nodes: GraphNode[], links: GraphLink[]): Forest {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const children = new Map<string, ChildEdge[]>();
  for (const l of links) {
    if (!byId.has(l.source) || !byId.has(l.target)) continue;
    if (!children.has(l.source)) children.set(l.source, []);
    children.get(l.source)!.push({ id: l.target, paid: l.paid });
  }
  return { byId, children };
}

/** Distinct transitive invitees reachable from a root (cycle-guarded, iterative). */
function reachOf(rootId: string, children: Map<string, ChildEdge[]>): number {
  const seen = new Set<string>();
  const stack = (children.get(rootId) ?? []).map((c) => c.id);
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    for (const c of children.get(id) ?? []) if (!seen.has(c.id)) stack.push(c.id);
  }
  return seen.size;
}

/** Pre-order flatten of a root's subtree into indented rows (cycle-guarded). */
function flattenSubtree(
  rootId: string,
  children: Map<string, ChildEdge[]>,
): { id: string; depth: number; paid: boolean }[] {
  const rows: { id: string; depth: number; paid: boolean }[] = [];
  const seen = new Set<string>([rootId]);
  const walk = (id: string, depth: number) => {
    for (const { id: cid, paid } of children.get(id) ?? []) {
      if (seen.has(cid)) continue;
      seen.add(cid);
      rows.push({ id: cid, depth, paid });
      walk(cid, depth + 1);
    }
  };
  walk(rootId, 0);
  return rows;
}

type Row = {
  id: string;
  label: string;
  invites: number; // total invitations sent (incl. phone-only pending)
  joined: number; // invitees who signed up (have an edge)
  paid: number; // signed-up invitees whose reward was paid
  reach: number; // total transitive invitees
  pct: number | null; // paid ÷ joined
};

type SortKey = "label" | "invites" | "joined" | "paid" | "pct" | "reach";

const PAGE_SIZE = 25;

const COLS: { key: SortKey; label: string; numeric: boolean; hint?: string }[] = [
  { key: "label", label: "Referrer", numeric: false },
  { key: "invites", label: "Invites", numeric: true, hint: "invitations sent (incl. pending)" },
  { key: "joined", label: "Joined", numeric: true, hint: "invitees who signed up" },
  { key: "paid", label: "Paid", numeric: true, hint: "rewards paid out" },
  { key: "pct", label: "Paid %", numeric: true, hint: "paid ÷ joined" },
  { key: "reach", label: "Reach", numeric: true, hint: "total downstream invitees" },
];

export function InvitationLeaderboard({
  nodes,
  links,
}: {
  nodes: GraphNode[];
  links: GraphLink[];
}) {
  const forest = useMemo(() => buildForest(nodes, links), [nodes, links]);

  const rows = useMemo<Row[]>(() => {
    const { children } = forest;
    return nodes
      .filter((n) => n.invites > 0)
      .map((n) => {
        const kids = children.get(n.id) ?? [];
        const joined = kids.length;
        const paid = kids.reduce((acc, c) => acc + (c.paid ? 1 : 0), 0);
        return {
          id: n.id,
          label: n.label,
          invites: n.invites,
          joined,
          paid,
          reach: reachOf(n.id, children),
          pct: joined > 0 ? paid / joined : null,
        };
      });
  }, [nodes, forest]);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("invites");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q ? rows.filter((r) => r.label.toLowerCase().includes(q)) : rows;
    return [...base].sort((a, b) => {
      let d: number;
      if (sortKey === "label") {
        d = a.label.localeCompare(b.label);
      } else {
        const av = sortKey === "pct" ? (a.pct ?? -1) : a[sortKey];
        const bv = sortKey === "pct" ? (b.pct ?? -1) : b[sortKey];
        d = (av as number) - (bv as number);
      }
      return dir === "asc" ? d : -d;
    });
  }, [rows, query, sortKey, dir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const setSort = (key: SortKey) => {
    if (key === sortKey) {
      setDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDir(key === "label" ? "asc" : "desc");
    }
    setPage(0);
  };

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">No invitations yet.</p>;
  }

  const arrow = (key: SortKey) => (sortKey === key ? (dir === "asc" ? "▲" : "▼") : "");

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Search referrer…"
          className="w-56 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
        />
        <span className="text-xs text-slate-500">
          {filtered.length} referrer{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
              <th className="w-8 py-2 pr-2" />
              <th className="py-2 pr-4 text-right">#</th>
              {COLS.map((c) => (
                <th key={c.key} className={`py-2 pr-4 ${c.numeric ? "text-right" : ""}`}>
                  <button
                    type="button"
                    onClick={() => setSort(c.key)}
                    title={c.hint}
                    className={`inline-flex items-center gap-1 uppercase tracking-wider transition hover:text-slate-700 ${
                      sortKey === c.key ? "text-slate-700" : ""
                    }`}
                  >
                    {c.label}
                    <span className="text-[9px] leading-none">{arrow(c.key)}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => {
              const isOpen = expanded.has(r.id);
              const rank = safePage * PAGE_SIZE + i + 1;
              const sub = isOpen ? flattenSubtree(r.id, forest.children) : [];
              return (
                <Fragment key={r.id}>
                  <tr
                    className="cursor-pointer border-b border-slate-100 hover:bg-slate-50"
                    onClick={() => toggle(r.id)}
                    aria-expanded={isOpen}
                  >
                    <td className="py-2 pl-1 pr-2 text-slate-400">
                      <span
                        aria-hidden
                        className={`inline-block transition-transform ${isOpen ? "rotate-90" : ""}`}
                      >
                        ▸
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-400">{rank}</td>
                    <td className="py-2 pr-4 font-medium text-slate-800">{r.label}</td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-700">
                      {r.invites}
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-700">{r.joined}</td>
                    <td className="py-2 pr-4 text-right font-semibold tabular-nums text-emerald-600">
                      {r.paid}
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-600">
                      {r.pct === null ? "—" : `${Math.round(r.pct * 100)}%`}
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums text-slate-600">{r.reach}</td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <td colSpan={8} className="py-3 pl-8 pr-4">
                        {sub.length > 0 ? (
                          <ul className="space-y-1">
                            {sub.map((s) => {
                              const node = forest.byId.get(s.id);
                              return (
                                <li
                                  key={s.id}
                                  className="flex items-center gap-2 text-sm text-slate-700"
                                  style={{ paddingLeft: s.depth * 20 }}
                                >
                                  <span className="text-slate-300">└</span>
                                  <span className="font-medium text-slate-800">
                                    {node?.label ?? `${s.id.slice(0, 6)}…`}
                                  </span>
                                  {node && node.invites > 0 && (
                                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-600">
                                      invited {node.invites}
                                    </span>
                                  )}
                                  {s.paid && (
                                    <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-medium text-emerald-600">
                                      ✓ paid
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-slate-400">
                            No signed-up invitees yet
                            {r.invites > 0 ? ` (${r.invites} pending phone-only)` : ""}.
                          </p>
                        )}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-3 flex items-center justify-end gap-2 text-sm">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-slate-600 transition enabled:hover:bg-slate-50 disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-slate-500">
            Page {safePage + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={safePage >= pageCount - 1}
            className="rounded-md border border-slate-200 px-2.5 py-1 text-slate-600 transition enabled:hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
