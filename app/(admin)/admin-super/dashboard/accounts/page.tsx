"use client";

import { adminApiFetch } from "@/lib/supabase/admin-fetch";
import { getPostImageUrl } from "@/lib/supabase/post-image-url";
import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string | null;
  price_cents: number | null;
  status: string | null;
  thumbnail_path: string | null;
  created_at: string;
};
type Message = { id: string; from: string; preview: string; created_at: string };
type Account = {
  id: string;
  nickname: string;
  phone: string | null;
  totalPosts: number;
  totalMessages: number;
  posts: Post[];
  messages: Message[];
};

const aud = new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" });

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApiFetch("/api/admin/accounts", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) {
          const j = await r.json().catch(() => null);
          setError(j?.error ?? `Request failed (${r.status}).`);
          return;
        }
        setAccounts(((await r.json()) as { accounts: Account[] }).accounts);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">My accounts</h1>
        <p className="mt-1 text-sm text-slate-600">
          Posts and recently-received messages for your operator accounts.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        accounts?.map((acc) => <AccountCard key={acc.id} account={acc} />)
      )}
    </div>
  );
}

function AccountCard({ account }: { account: Account }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {account.nickname.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            {account.nickname}
            {account.phone && (
              <span className="ml-2 text-sm font-normal text-slate-400">{account.phone}</span>
            )}
          </h2>
          <p className="text-xs text-slate-500">
            {account.totalPosts} available posts · {account.totalMessages} messages received
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Available posts
            {account.totalPosts > account.posts.length ? ` · latest ${account.posts.length}` : ""}
          </h3>
          {account.posts.length === 0 ? (
            <p className="text-sm text-slate-400">No posts.</p>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {account.posts.map((p) => (
                <PostRow key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recent messages received
            {account.totalMessages > account.messages.length
              ? ` · latest ${account.messages.length}`
              : ""}
          </h3>
          {account.messages.length === 0 ? (
            <p className="text-sm text-slate-400">No messages.</p>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
              {account.messages.map((m) => (
                <div key={m.id} className="border-b border-slate-100 pb-2 last:border-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-700">{m.from}</span>
                    <span className="shrink-0 text-xs text-slate-400">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-600">{m.preview}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PostRow({ post }: { post: Post }) {
  const thumb = getPostImageUrl(post.thumbnail_path);
  return (
    <div className="flex items-center gap-3">
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
        <p className="truncate text-sm text-slate-800">{post.title || "(untitled)"}</p>
        <p className="text-xs text-slate-400">
          {post.price_cents != null ? aud.format(post.price_cents / 100) : "—"} ·{" "}
          {new Date(post.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
