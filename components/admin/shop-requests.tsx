"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminAuthBrowserClient } from "@/lib/supabase/admin-auth-browser-client";

type QueueItem = { id: number; shop_name: string; shop_address: string; created_at: string };
type Application = QueueItem & {
  is_new_shop?: boolean;
  proposed_shop?: {
    name: string;
    address: string;
    unit: string;
    kind: string;
    lat: number;
    lng: number;
  };
  status: string;
  abn: string;
  applicant_name: string;
  account_contact: string;
  shop_link: string | null;
  note: string | null;
  evidence_path: string | null;
  declaration_version: string;
  declaration_accepted_at: string;
  already_managed: boolean;
  is_own_application: boolean;
};
const inputClass = "w-full rounded-lg border border-slate-300 bg-white p-2";
const buttonClass = "rounded-lg border border-slate-300 bg-white px-4 py-2 disabled:opacity-40";
const isDenied = (error: { message?: string; code?: string }) =>
  ["42501", "28000", "PGRST301", "PGRST303"].includes(error.code ?? "") ||
  /NOT_AUTHORIZED|NOT_AUTHENTICATED|ACCOUNT_BANNED/.test(error.message ?? "");

export function ShopRequests() {
  const [rows, setRows] = useState<QueueItem[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const [after, setAfter] = useState(0);
  const [notice, setNotice] = useState("");
  const endAccess = useCallback(() => {
    setEnded(true);
    setRows([]);
    setSelected(null);
  }, []);
  const load = useCallback(
    async (cursor: number) => {
      setBusy(true);
      setError("");
      setSelected(null);
      try {
        const { data, error: failure } = await getAdminAuthBrowserClient().rpc(
          "admin_list_shop_applications",
          { p_after_id: cursor },
        );
        if (failure) {
          if (isDenied(failure)) endAccess();
          throw failure;
        }
        setRows(data ?? []);
        setAfter(cursor);
      } catch {
        setError("Could not load shop requests. Please retry.");
      } finally {
        setBusy(false);
      }
    },
    [endAccess],
  );
  useEffect(() => {
    void load(0);
  }, [load]);
  async function open(id: number) {
    setBusy(true);
    setError("");
    setSelected(null);
    setNotice("");
    try {
      const { data, error: failure } = await getAdminAuthBrowserClient().rpc(
        "admin_get_shop_application",
        { p_request_id: id },
      );
      if (failure) {
        if (isDenied(failure)) endAccess();
        throw failure;
      }
      setSelected(data);
    } catch {
      setError("Could not load this application. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  if (ended) return <p role="alert">Your reviewer access has ended. Sign out and sign in again.</p>;
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Shop requests</h1>
      <p className="text-slate-600">
        Confirm the business and this specific application through an independently established shop
        channel. Owner means page administrator; ABN details do not establish the applicant’s
        authority.
      </p>
      <div className="flex gap-2">
        <button className={buttonClass} disabled={busy} onClick={() => void load(0)}>
          Refresh from start
        </button>
        {rows.length === 25 && (
          <button
            className={buttonClass}
            disabled={busy}
            onClick={() => void load(rows[rows.length - 1].id)}
          >
            Next 25
          </button>
        )}
      </div>
      {notice && <p role="status">{notice}</p>}
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {busy && <p role="status">Loading…</p>}
      {!busy && !error && rows.length === 0 && (
        <p>{after ? "No more pending applications." : "No pending applications."}</p>
      )}
      <ul className="space-y-2">
        {rows.map((row) => (
          <li key={row.id}>
            <button
              className={`${buttonClass} w-full text-left`}
              disabled={busy}
              onClick={() => void open(row.id)}
            >
              <strong>{row.shop_name}</strong> — {row.shop_address}
              <span className="ml-2 text-sm text-slate-500">#{row.id}</span>
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <ApplicationReview
          key={selected.id}
          application={selected}
          onDenied={endAccess}
          onDone={(approved) => {
            setNotice(
              approved
                ? "Approved. Shop access was granted; an existing shop’s followers are preserved."
                : "Declined. The applicant can correct and resubmit.",
            );
            void load(after);
          }}
        />
      )}
    </div>
  );
}

function ApplicationReview({
  application: a,
  onDenied,
  onDone,
}: {
  application: Application;
  onDenied: () => void;
  onDone: (approved: boolean) => void;
}) {
  const [duplicates, setDuplicates] = useState<
    { id: number; name: string; address: string; managed: boolean }[] | null
  >(null);
  const [resolution, setResolution] = useState("");
  const [duplicatesConfirmed, setDuplicatesConfirmed] = useState(false);
  const [business, setBusiness] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [channel, setChannel] = useState("");
  const [source, setSource] = useState("");
  const [method, setMethod] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [evidence, setEvidence] = useState<string | null>(null);
  useEffect(() => {
    if (!evidence) return;
    const timer = setTimeout(() => setEvidence(null), 55000);
    return () => clearTimeout(timer);
  }, [evidence]);
  async function checkDuplicates() {
    setBusy(true);
    setError("");
    setDuplicates(null);
    setResolution("");
    setDuplicatesConfirmed(false);
    try {
      const { data, error: failure } = await getAdminAuthBrowserClient().rpc(
        "find_shop_application_duplicates",
        { p_shop: a.proposed_shop },
      );
      if (failure) {
        if (isDenied(failure)) onDenied();
        throw failure;
      }
      setDuplicates(data ?? []);
    } catch {
      setError("Could not check existing shops. Retry before approving.");
    } finally {
      setBusy(false);
    }
  }
  async function copyAbn() {
    try {
      await navigator.clipboard.writeText(a.abn);
      setCopyStatus("ABN copied.");
    } catch {
      setCopyStatus("Could not copy. Select the ABN above and copy it manually.");
    }
  }
  async function showEvidence() {
    setBusy(true);
    setError("");
    setEvidence(null);
    try {
      // Recheck reviewer access before minting a short-lived private link.
      const check = await getAdminAuthBrowserClient().rpc("admin_get_shop_application", {
        p_request_id: a.id,
      });
      if (check.error) {
        if (isDenied(check.error)) onDenied();
        throw check.error;
      }
      if (!check.data?.evidence_path) throw new Error("Evidence unavailable");
      const { data, error: failure } = await getAdminAuthBrowserClient()
        .storage.from("shop_application_evidence")
        .createSignedUrl(check.data.evidence_path, 60);
      if (failure || !data) throw failure;
      setEvidence(data.signedUrl);
    } catch {
      setError("Evidence is unavailable. Please retry.");
    } finally {
      setBusy(false);
    }
  }
  async function decide(approve: boolean) {
    setBusy(true);
    setError("");
    try {
      const { error: failure } = await getAdminAuthBrowserClient().rpc(
        a.is_new_shop ? "admin_review_new_shop_application" : "admin_review_shop_application",
        {
          ...(a.is_new_shop
            ? {
                p_existing_shop_id: resolution && resolution !== "new" ? Number(resolution) : null,
                p_duplicate_ids: duplicates?.map((d) => d.id) ?? null,
              }
            : {}),
          p_request_id: a.id,
          p_approve: approve,
          p_reason: reason.trim() || null,
          p_verification: {
            business_confirmed: business,
            application_confirmed: confirmed,
            channel: channel.trim() || null,
            source: source.trim() || null,
            method: method || null,
            confirmed_at: date ? new Date(date).toISOString() : null,
            notes: notes.trim(),
          },
        },
      );
      if (failure) {
        if (isDenied(failure)) onDenied();
        if (/SHOP_ALREADY_MANAGED/.test(failure.message))
          setError(
            "This shop already has an owner. Escalate the ownership dispute; this application cannot replace the owner.",
          );
        else if (/SHOP_REMOVED_USE_RESTORE/.test(failure.message))
          setError(
            "This matches a removed shop. Ask an operator to restore or resolve that record; creating a replacement would lose its history.",
          );
        else if (/SHOP_ALREADY_IN_DIRECTORY/.test(failure.message))
          setError(
            "This exact shop is already in the directory. Check existing shops and confirm the matching branch instead of creating another record.",
          );
        else if (/SHOP_EXISTING_CLAIM_PENDING/.test(failure.message))
          setError(
            "This applicant already has a waiting claim for that shop. Resolve or withdraw that claim before connecting this application.",
          );
        else if (/SHOP_DUPLICATES_CHANGED/.test(failure.message)) {
          setDuplicatesConfirmed(false);
          setResolution("");
          setDuplicates(null);
          setError(
            "The possible matches changed. Check existing shops again and confirm the resolution.",
          );
        } else if (/SHOP_REQUEST_RESOLVED/.test(failure.message))
          setError("This request was already resolved or withdrawn. Refresh the queue.");
        else if (/SHOP_ACCOUNT_REQUIRED|SHOP_UNAVAILABLE/.test(failure.message))
          setError(
            "The applicant account or shop is no longer eligible for approval. Refresh the request; changing confirmation fields will not resolve this.",
          );
        else
          setError(
            "The decision could not be saved. Check the confirmation fields and retry. Your entries are preserved.",
          );
        return;
      }
      onDone(approve);
    } catch {
      setError(
        "The decision could not be confirmed. Retry the same decision safely; your entries are preserved.",
      );
    } finally {
      setBusy(false);
    }
  }
  const blocked = busy || a.status !== "waiting" || a.is_own_application;
  const confirmationComplete =
    !confirmed ||
    (channel.trim() &&
      source.trim() &&
      method &&
      date &&
      Number.isFinite(new Date(date).getTime()));
  return (
    <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold">
        {a.shop_name} · Application #{a.id}
      </h2>
      <p>{a.shop_address}</p>
      {a.is_new_shop && (
        <div className="space-y-3 rounded-lg border p-3">
          <h3 className="font-semibold">New shop — private until approval</h3>
          <p>
            Unit: {a.proposed_shop?.unit || "None"} · Category: {a.proposed_shop?.kind}
          </p>
          <p>
            Map coordinates: {a.proposed_shop?.lat}, {a.proposed_shop?.lng}
          </p>
          <p>
            Confirm the physical storefront, customer-facing address, map position and pilot
            eligibility. Neither a shared address nor ABN proves a duplicate.
          </p>
          <button className={buttonClass} disabled={busy} onClick={() => void checkDuplicates()}>
            Check existing shops
          </button>
          {duplicates && (
            <>
              <p>
                {duplicates.length
                  ? "Possible matches — confirm whether this is the same shop and branch."
                  : "No candidate matches found."}
              </p>
              {duplicates.map((d) => (
                <label key={d.id} className="block">
                  <input
                    type="radio"
                    name="resolution"
                    disabled={busy || d.managed}
                    checked={resolution === String(d.id)}
                    onChange={() => {
                      setResolution(String(d.id));
                      setDuplicatesConfirmed(false);
                    }}
                  />{" "}
                  Connect to #{d.id}: {d.name} — {d.address}
                  {d.managed ? " (already managed; use support for disputes)" : ""}
                </label>
              ))}
              <label className="block">
                <input
                  type="radio"
                  name="resolution"
                  disabled={busy}
                  checked={resolution === "new"}
                  onChange={() => {
                    setResolution("new");
                    setDuplicatesConfirmed(false);
                  }}
                />{" "}
                This is a distinct shop. Create a new public shop on approval.
              </label>
              <label className="block">
                <input
                  type="checkbox"
                  disabled={busy || !resolution}
                  checked={duplicatesConfirmed}
                  onChange={(e) => setDuplicatesConfirmed(e.target.checked)}
                />{" "}
                I checked the candidate shops, branch/unit and map position and confirmed this
                resolution.
              </label>
            </>
          )}
        </div>
      )}
      <dl className="grid gap-2 sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Applicant</dt>
          <dd>{a.applicant_name}</dd>
        </div>
        <div>
          <dt className="font-semibold">Account mobile at submission</dt>
          <dd>{a.account_contact}</dd>
        </div>
        <div>
          <dt className="font-semibold">ABN</dt>
          <dd>{a.abn}</dd>
        </div>
        <div>
          <dt className="font-semibold">Declaration accepted</dt>
          <dd>
            {a.declaration_accepted_at} ({a.declaration_version})
          </dd>
        </div>
      </dl>
      {a.note && <p className="whitespace-pre-wrap">Applicant note: {a.note}</p>}
      {a.shop_link && /^https?:\/\//i.test(a.shop_link) && (
        <a className="underline" href={a.shop_link} target="_blank" rel="noreferrer">
          Applicant-provided shop link
        </a>
      )}
      <div className="flex flex-wrap gap-3">
        <button className={buttonClass} disabled={busy} onClick={() => void copyAbn()}>
          Copy ABN
        </button>
        <a
          className={buttonClass}
          href={`https://abr.business.gov.au/ABN/View?abn=${encodeURIComponent(a.abn)}`}
          target="_blank"
          rel="noreferrer"
        >
          Official ABN Lookup
        </a>
        {a.evidence_path && (
          <button className={buttonClass} disabled={busy} onClick={() => void showEvidence()}>
            View private evidence (60 seconds)
          </button>
        )}
      </div>
      {copyStatus && <p role="status">{copyStatus}</p>}
      <p className="text-sm text-slate-600">
        Open Official ABN Lookup and check that the ABN is active and matches the business
        operating this shop. Record your findings below. An ABN does not prove the applicant’s authority.
      </p>
      {evidence && (
        <div>
          {/* Private signed URLs must not pass through an image optimizer/cache. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={evidence}
            alt="Applicant storefront evidence"
            referrerPolicy="no-referrer"
            className="max-h-96 max-w-full object-contain"
          />
        </div>
      )}
      {a.already_managed && (
        <p role="alert">
          This shop already has an owner. Handle competing claims through support; approval cannot
          replace or add an owner.
        </p>
      )}
      {a.is_own_application && <p role="alert">You cannot review your own application.</p>}
      <fieldset disabled={blocked} className="space-y-3">
        <legend className="font-semibold">Independent verification</legend>
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={business}
            onChange={(e) => setBusiness(e.target.checked)}
          />
          I confirmed the ABN is active and belongs to the business operating this shop.
        </label>
        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          The shop confirmed this specific application through an independent channel.
        </label>
        <label className="block">
          Shop channel contacted
          <input
            className={inputClass}
            maxLength={500}
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          />
        </label>
        <label className="block">
          Independent source of that channel
          <input
            className={inputClass}
            maxLength={2048}
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </label>
        <label className="block">
          Confirmation method
          <select className={inputClass} value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Choose a method</option>
            <option value="phone">Shop phone</option>
            <option value="instagram">Official Instagram</option>
            <option value="visit">In-person visit</option>
          </select>
        </label>
        <label className="block">
          Confirmed at (your local time)
          <input
            className={inputClass}
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="block">
          Private reviewer notes
          <textarea
            className={inputClass}
            maxLength={4000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <label className="block">
          Reason shown to applicant (required to decline)
          <textarea
            className={inputClass}
            maxLength={2000}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <p className="text-sm text-slate-600">
          Approval grants access to the selected shop, or creates the verified new shop and grants
          access atomically. If clarification is needed, leave the request pending and contact the
          applicant. Private notes are saved with the final decision.
        </p>
        <div className="flex gap-3">
          <button
            className={buttonClass}
            disabled={
              blocked ||
              a.already_managed ||
              !business ||
              !confirmed ||
              !confirmationComplete ||
              (a.is_new_shop && (!duplicates || !resolution || !duplicatesConfirmed))
            }
            onClick={() => void decide(true)}
          >
            Approve and grant shop access
          </button>
          <button
            className={buttonClass}
            disabled={blocked || !reason.trim() || !confirmationComplete}
            onClick={() => void decide(false)}
          >
            Decline with reason
          </button>
        </div>
      </fieldset>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
