"use client";

import { useMemo, useState } from "react";

export type GraphNode = { id: string; label: string; invites: number; invited: number };
export type GraphLink = { source: string; target: string; paid: boolean };

const W = 760;
const H = 440;

type Pt = { x: number; y: number; vx: number; vy: number };

/**
 * Tiny deterministic force-directed layout (no deps, no randomness → stable
 * across renders and SSR-safe). O(n²) per tick — fine for referral-sized graphs.
 */
function computeLayout(
  nodes: GraphNode[],
  links: GraphLink[],
): Map<string, { x: number; y: number }> {
  const n = nodes.length;
  const idx = new Map(nodes.map((node, i) => [node.id, i]));
  const p: Pt[] = nodes.map((_, i) => ({
    x: W / 2 + Math.cos((2 * Math.PI * i) / Math.max(1, n)) * 150,
    y: H / 2 + Math.sin((2 * Math.PI * i) / Math.max(1, n)) * 150,
    vx: 0,
    vy: 0,
  }));
  const pairs = links
    .map((l) => [idx.get(l.source), idx.get(l.target)] as [number | undefined, number | undefined])
    .filter((pair): pair is [number, number] => pair[0] != null && pair[1] != null);

  const REP = 9000;
  const SPRING = 0.03;
  const DIST = 95;
  const ITERATIONS = 350;

  for (let it = 0; it < ITERATIONS; it++) {
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = p[i].x - p[j].x;
        const dy = p[i].y - p[j].y;
        const d2 = dx * dx + dy * dy + 0.01;
        const d = Math.sqrt(d2);
        const f = REP / d2;
        const fx = (f * dx) / d;
        const fy = (f * dy) / d;
        p[i].vx += fx;
        p[i].vy += fy;
        p[j].vx -= fx;
        p[j].vy -= fy;
      }
    }
    for (const [a, b] of pairs) {
      const dx = p[b].x - p[a].x;
      const dy = p[b].y - p[a].y;
      const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const f = SPRING * (d - DIST);
      const fx = (f * dx) / d;
      const fy = (f * dy) / d;
      p[a].vx += fx;
      p[a].vy += fy;
      p[b].vx -= fx;
      p[b].vy -= fy;
    }
    for (let i = 0; i < n; i++) {
      p[i].vx += (W / 2 - p[i].x) * 0.002;
      p[i].vy += (H / 2 - p[i].y) * 0.002;
      p[i].vx *= 0.86;
      p[i].vy *= 0.86;
      p[i].x += p[i].vx;
      p[i].y += p[i].vy;
    }
  }
  return new Map(nodes.map((node, i) => [node.id, { x: p[i].x, y: p[i].y }]));
}

export function InvitationGraph({ nodes, links }: { nodes: GraphNode[]; links: GraphLink[] }) {
  const [hover, setHover] = useState<string | null>(null);
  const positions = useMemo(() => computeLayout(nodes, links), [nodes, links]);

  if (nodes.length === 0) {
    return <p className="text-sm text-slate-500">No invitations yet.</p>;
  }

  const xs = [...positions.values()].map((q) => q.x);
  const ys = [...positions.values()].map((q) => q.y);
  const pad = 52;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const vw = Math.max(1, Math.max(...xs) + pad - minX);
  const vh = Math.max(1, Math.max(...ys) + pad - minY);

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
      className="h-[440px] w-full"
      role="img"
      aria-label="Invitation network graph"
    >
      <defs>
        <marker
          id="inv-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
        </marker>
      </defs>

      {links.map((l, i) => {
        const a = positions.get(l.source);
        const b = positions.get(l.target);
        if (!a || !b) return null;
        const dim = active && !(active.has(l.source) && active.has(l.target));
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={l.paid ? "#10b981" : "#cbd5e1"}
            strokeWidth={1.5}
            markerEnd="url(#inv-arrow)"
            opacity={dim ? 0.12 : 0.85}
          />
        );
      })}

      {nodes.map((node) => {
        const q = positions.get(node.id);
        if (!q) return null;
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
              cx={q.x}
              cy={q.y}
              r={r}
              fill={isInviter ? "#6366f1" : "#ffffff"}
              stroke={isInviter ? "#4338ca" : "#94a3b8"}
              strokeWidth={1.5}
            />
            <text
              x={q.x}
              y={q.y - r - 4}
              textAnchor="middle"
              className="fill-slate-700"
              style={{ fontSize: 11 }}
            >
              {node.label}
              {node.invites > 0 ? ` (${node.invites})` : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
