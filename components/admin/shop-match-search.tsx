"use client";

import { useState } from "react";
import { getAdminAuthBrowserClient } from "@/lib/supabase/admin-auth-browser-client";

export type ShopCandidate = { id: number; name: string; address: string; managed: boolean };

export function ShopMatchSearch({
  disabled,
  selectedId,
  onSelect,
  onDenied,
}: {
  disabled: boolean;
  selectedId: number | null;
  onSelect: (shop: ShopCandidate) => void;
  onDenied: () => void;
}) {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<ShopCandidate[] | null>(null);
  const [after, setAfter] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const button =
    "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40";
  async function search(cursor: number) {
    if (busy || disabled || query.trim().length < 2) return;
    setBusy(true);
    setError("");
    setRows(null);
    try {
      const { data, error: e } = await getAdminAuthBrowserClient().rpc(
        "admin_search_shop_application_matches",
        {
          p_query: query.trim(),
          p_after_id: cursor,
        },
      );
      if (e) {
        if (
          ["42501", "28000", "PGRST301", "PGRST303"].includes(e.code) ||
          /NOT_AUTHORIZED|NOT_AUTHENTICATED|ACCOUNT_BANNED/.test(e.message)
        )
          onDenied();
        throw e;
      }
      setRows(data ?? []);
      setAfter(cursor);
    } catch {
      setError("Could not search existing shops. Your selected shop has not changed. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="font-semibold text-slate-900">Find another existing shop</h4>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        Missing from the suggested matches? Search the full directory by part of the shop name or
        address. This search is not limited to 75 metres.
      </p>
      <form
        className="mt-3"
        onSubmit={(e) => {
          e.preventDefault();
          void search(0);
        }}
      >
        <label className="block text-sm font-medium" htmlFor="manual-shop-search">
          Shop name or address
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id="manual-shop-search"
            type="search"
            value={query}
            minLength={2}
            maxLength={100}
            disabled={disabled || busy}
            onChange={(e) => {
              setQuery(e.target.value);
              setRows(null);
              setAfter(0);
              setError("");
            }}
            placeholder="e.g. Test Cafe or City Rd"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
          />
          <button
            className={button}
            disabled={disabled || busy || query.trim().length < 2}
            type="submit"
          >
            {busy ? "Searching…" : "Search directory"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Enter at least 2 characters. Matches ignore capital letters; try a shorter name or street
          name if nothing appears.
        </p>
      </form>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {rows && (
        <div className="mt-4 space-y-3">
          <p role="status" className="text-sm text-slate-600">
            {rows.length
              ? `${rows.length} results on this page. Compare the name, address and branch before selecting.`
              : after
                ? "No more results. Search again from the start or refine your search."
                : "No matches found. Try a shorter name or a different part of the address."}
          </p>
          {rows.map((shop) => (
            <div key={shop.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="break-words text-sm font-semibold">
                {shop.name} · #{shop.id}
              </p>
              <p className="mt-1 break-words text-sm text-slate-600">{shop.address}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className={button}
                  disabled={disabled || busy || shop.managed || selectedId === shop.id}
                  onClick={() => onSelect(shop)}
                >
                  {shop.managed
                    ? "Already managed — cannot connect"
                    : selectedId === shop.id
                      ? "Selected for connection"
                      : "Use this existing shop"}
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-orange-700 underline"
                >
                  Compare location ↗
                </a>
              </div>
            </div>
          ))}
          {rows.length === 25 && (
            <button
              type="button"
              className={button}
              disabled={disabled || busy}
              onClick={() => void search(rows[rows.length - 1].id)}
            >
              Next 25 results
            </button>
          )}
        </div>
      )}
    </div>
  );
}
