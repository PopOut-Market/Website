"use client";

import { useMemo, useState } from "react";

export type GraphNode = { id: string; label: string; invites: number; invited: number };
export type GraphLink = { source: string; target: string; paid: boolean };

type Placed = { x: number; y: number; depth: number };

const X_GAP = 120;
const Y_LEVEL = 96;

/**
 * Tidy top-down tree layout (Reingold–Tilford style): leaves get evenly-spaced
 * x slots, parents centre over their children, depth → y. Deterministic and
 * dependency-free (so it's SSR-safe with no hydration mismatch). Handles a
 * forest (multiple roots) and guards against cycles / multiple parents.
 */
function computeTreeLayout(nodes: GraphNode[], links: GraphLink[]): Map<string, Placed> {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const childrenOf = new Map<string, string[]>();
  const parentOf = new Map<string, string>();
  for (const l of links) {
    if (!byId.has(l.source) || !byId.has(l.target)) continue;
    if (!childrenOf.has(l.source)) childrenOf.set(l.source, []);
    childrenOf.get(l.source)!.push(l.target);
    if (!parentOf.has(l.target)) parentOf.set(l.target, l.source); // first parent wins
  }

  const pos = new Map<string, Placed>();
  const visited = new Set<string>();
  let leaf = 0;

  const place = (id: string, depth: number): number => {
    visited.add(id);
    const kids = (childrenOf.get(id) ?? []).filter((c) => byId.has(c) && !visited.has(c));
    let x: number;
    if (kids.length === 0) {
      x = leaf * X_GAP;
      leaf += 1;
    } else {
      const xs = kids.map((c) => place(c, depth + 1));
      x = (Math.min(...xs) + Math.max(...xs)) / 2;
    }
    pos.set(id, { x, y: depth * Y_LEVEL, depth });
    return x;
  };

  // Roots = nodes nobody invited; then any stragglers left by a cycle.
  for (const n of nodes) if (!parentOf.has(n.id) && !visited.has(n.id)) place(n.id, 0);
  for (const n of nodes) if (!visited.has(n.id)) place(n.id, 0);
  return pos;
}

function truncate(s: string, n = 16): string {
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
}

export function InvitationGraph({ nodes, links }: { nodes: GraphNode[]; links: GraphLink[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const pos = useMemo(() => computeTreeLayout(nodes, links), [nodes, links]);

  if (nodes.length === 0) {
    return <p className="text-sm text-slate-500">No invitations yet.</p>;
  }

  const pts = [...pos.values()];
  const padX = 80;
  const padY = 40;
  const minX = Math.min(...pts.map((p) => p.x)) - padX;
  const minY = Math.min(...pts.map((p) => p.y)) - padY;
  const vw = Math.max(1, Math.max(...pts.map((p) => p.x)) + padX - minX);
  const vh = Math.max(1, Math.max(...pts.map((p) => p.y)) + padY + 20 - minY);

  const active = hover
    ? new Set(
        links
          .filter((l) => l.source === hover || l.target === hover)
          .flatMap((l) => [l.source, l.target])
          .concat(hover),
      )
    : null;

  return (
    <svg
      viewBox={`${minX} ${minY} ${vw} ${vh}`}
      className="w-full"
      style={{ aspectRatio: `${vw} / ${vh}`, maxHeight: "70vh" }}
      role="img"
      aria-label="Invitation tree"
    >
      {links.map((l, i) => {
        const a = pos.get(l.source);
        const b = pos.get(l.target);
        if (!a || !b) return null;
        const dim = active && !(active.has(l.source) && active.has(l.target));
        const my = (a.y + b.y) / 2;
        return (
          <path
            key={i}
            d={`M ${a.x},${a.y} C ${a.x},${my} ${b.x},${my} ${b.x},${b.y}`}
            fill="none"
            stroke={l.paid ? "#10b981" : "#cbd5e1"}
            strokeWidth={1.6}
            opacity={dim ? 0.12 : 0.85}
          />
        );
      })}

      {nodes.map((node) => {
        const p = pos.get(node.id);
        if (!p) return null;
        const r = 7 + Math.min(18, node.invites * 3);
        const isInviter = node.invites > 0;
        const dim = active && !active.has(node.id);
        return (
          <g
            key={node.id}
            opacity={dim ? 0.2 : 1}
            onMouseEnter={() => setHover(node.id)}
            onMouseLeave={() => setHover(null)}
          >
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={isInviter ? "#6366f1" : "#ffffff"}
              stroke={isInviter ? "#4338ca" : "#94a3b8"}
              strokeWidth={1.5}
            />
            <text
              x={p.x}
              y={p.y + r + 13}
              textAnchor="middle"
              className="fill-slate-700"
              style={{ fontSize: 11 }}
            >
              {truncate(node.label)}
              {node.invites > 0 ? ` (${node.invites})` : ""}
              <title>{node.label}</title>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
