"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { getAdminAuthBrowserClient } from "@/lib/supabase/admin-auth-browser-client";
import {
  ShopMatchSearch,
  type ShopCandidate as Candidate,
} from "@/components/admin/shop-match-search";
import { INNER_MAX, PRIMARY_BUTTON_CLASS } from "@/lib/site-config";
import {
  declineVerification,
  localDateTime,
  reviewErrors,
  reviewFields,
  verification,
  type ReviewFields,
  type Verification,
} from "@/lib/shop-review";

type QueueItem = {
  id: number;
  shop_name: string;
  shop_address: string;
  created_at: string;
  is_new_shop?: boolean;
};
type Shop = {
  id?: number;
  name: string;
  address: string;
  unit?: string;
  kind: string;
  lat?: number;
  lng?: number;
  has_owner?: boolean;
};
type Application = QueueItem & {
  shop_id: number | null;
  proposed_shop: Shop | null;
  status: string;
  abn: string;
  applicant_name: string;
  account_contact: string | null;
  contact_method?: string | null;
  contact_value?: string | null;
  shop_link: string | null;
  note: string | null;
  evidence_path: string | null;
  declaration_version: string;
  declaration_accepted_at: string;
  already_managed: boolean;
  is_own_application: boolean;
  verification: Verification | null;
};
const input =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-100 disabled:bg-slate-50";
const button =
  "rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";
const primary = `${PRIMARY_BUTTON_CLASS} px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40`;
const denied = (e: { code?: string; message?: string }) =>
  ["42501", "28000", "PGRST301", "PGRST303"].includes(e.code ?? "") ||
  /NOT_AUTHORIZED|NOT_AUTHENTICATED|ACCOUNT_BANNED/.test(e.message ?? "");
const dateLabel = (s: string) =>
  new Date(s).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" });
function Section({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
          {number}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-6 text-slate-900">
        {children || "Not provided"}
      </dd>
    </div>
  );
}

export function ShopRequests() {
  const [rows, setRows] = useState<QueueItem[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingBusy, setEditingBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState("");
  const [ended, setEnded] = useState(false);
  const [after, setAfter] = useState(0);
  const [notice, setNotice] = useState("");
  const endAccess = useCallback(() => {
    setEnded(true);
    setDirty(false);
    setRows([]);
    setSelected(null);
  }, []);
  const load = useCallback(
    async (cursor: number) => {
      setBusy(true);
      setError("");
      setSelected(null);
      setDirty(false);
      try {
        const { data, error: e } = await getAdminAuthBrowserClient().rpc(
          "admin_list_shop_applications",
          { p_after_id: cursor },
        );
        if (e) {
          if (denied(e)) endAccess();
          throw e;
        }
        setRows(data ?? []);
        setAfter(cursor);
      } catch {
        setError("Could not load applications. Please refresh to retry.");
      } finally {
        setBusy(false);
      }
    },
    [endAccess],
  );
  useEffect(() => {
    void load(0);
  }, [load]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const leave = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a[href]");
      if (
        link &&
        link.getAttribute("target") !== "_blank" &&
        !window.confirm("Leave this review? Unsaved changes will be lost.")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty]);
  function canLeave() {
    return !dirty || window.confirm("Leave this review? Unsaved changes will be lost.");
  }
  async function open(id: number) {
    if (!canLeave()) return;
    setBusy(true);
    setError("");
    setSelected(null);
    setDirty(false);
    setNotice("");
    try {
      const { data, error: e } = await getAdminAuthBrowserClient().rpc(
        "admin_get_shop_application",
        { p_request_id: id },
      );
      if (e) {
        if (denied(e)) endAccess();
        throw e;
      }
      setSelected(data);
    } catch {
      setError("Could not open this application. Select it again to retry.");
    } finally {
      setBusy(false);
    }
  }
  if (ended) return <p role="alert">Your reviewer access has ended. Sign out and sign in again.</p>;
  return (
    <div className={`${INNER_MAX} space-y-6 pb-12`}>
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-orange-700">
          Shop management
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Shop requests</h1>
        <p className="mt-2 text-sm text-slate-500">
          Review the application, compare existing shops, record your checks, then make a decision.
        </p>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">
            Awaiting review{" "}
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-1 text-xs">
              {rows.length}
              {rows.length === 25 ? "+" : ""}
            </span>
          </h2>
          <div className="flex gap-2">
            <button
              className={button}
              disabled={busy || editingBusy}
              onClick={() => {
                if (canLeave()) void load(0);
              }}
            >
              Refresh from start
            </button>
            {rows.length === 25 && (
              <button
                className={button}
                disabled={busy || editingBusy}
                onClick={() => {
                  if (canLeave()) void load(rows[rows.length - 1].id);
                }}
              >
                Next 25
              </button>
            )}
          </div>
        </div>
        {busy && (
          <p role="status" className="py-3 text-sm text-slate-500">
            Loading applications…
          </p>
        )}
        {!busy && !error && rows.length === 0 && (
          <p className="py-3 text-sm text-slate-500">
            {after
              ? "No more pending applications."
              : "You’re up to date. No applications are waiting."}
          </p>
        )}
        <ul className="grid gap-2 sm:grid-cols-2">
          {rows.map((row) => (
            <li key={row.id}>
              <button
                disabled={busy || editingBusy}
                aria-pressed={selected?.id === row.id}
                onClick={() => void open(row.id)}
                className={`h-full w-full rounded-xl border p-4 text-left transition disabled:opacity-50 ${selected?.id === row.id ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500" : "border-slate-200 hover:border-slate-400"}`}
              >
                <span className="flex justify-between gap-2">
                  <strong className="text-sm">{row.shop_name}</strong>
                  <span className="text-xs text-slate-500">#{row.id}</span>
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {row.shop_address}
                </span>
                <span className="mt-3 block text-xs font-medium text-slate-600">
                  {row.is_new_shop ? "New shop registration" : "Existing shop claim"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {notice && (
        <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}
      {selected && (
        <ApplicationReview
          key={selected.id}
          application={selected}
          onDenied={endAccess}
          onDirty={setDirty}
          onBusy={setEditingBusy}
          onDone={(approved) => {
            setNotice(
              approved
                ? "Approved. The applicant can now manage the shop in My shops."
                : "Declined. The applicant can read your reason, correct the application and resubmit.",
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
  onDirty,
  onBusy,
  onDone,
}: {
  application: Application;
  onDenied: () => void;
  onDirty: (v: boolean) => void;
  onBusy: (v: boolean) => void;
  onDone: (v: boolean) => void;
}) {
  const [saved, setSaved] = useState(a.verification);
  const [fields, setFields] = useState(() => reviewFields(a.verification));
  const [savedFields, setSavedFields] = useState(() =>
    JSON.stringify(reviewFields(a.verification)),
  );
  const [duplicates, setDuplicates] = useState<Candidate[] | null>(null);
  const [resolution, setResolution] = useState("");
  const [selectedShop, setSelectedShop] = useState<Candidate | null>(null);
  const [duplicatesConfirmed, setDuplicatesConfirmed] = useState(false);
  const [directoryShop, setDirectoryShop] = useState<Shop | null>(null);
  const [directoryError, setDirectoryError] = useState(false);
  const [decision, setDecision] = useState<"approve" | "decline" | null>(null);
  const [reason, setReason] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [conflict, setConflict] = useState(false);
  const [evidence, setEvidence] = useState<string | null>(null);
  const [resolved, setResolved] = useState(a.status !== "waiting");
  const dirty = JSON.stringify(fields) !== savedFields;
  const blocked = busy || resolved || a.is_own_application;
  useEffect(() => {
    onDirty(dirty || !!reason);
  }, [dirty, reason, onDirty]);
  useEffect(() => {
    onBusy(busy);
    return () => onBusy(false);
  }, [busy, onBusy]);
  useEffect(() => {
    if (!evidence) return;
    const t = setTimeout(() => setEvidence(null), 55000);
    return () => clearTimeout(t);
  }, [evidence]);
  const loadDirectory = useCallback(async () => {
    if (!a.shop_id) return;
    setDirectoryError(false);
    try {
      const { data, error: e } = await getAdminAuthBrowserClient().rpc("get_shop_public_profile", {
        p_shop_id: a.shop_id,
      });
      if (e || !data) throw e ?? new Error("Directory record unavailable");
      setDirectoryShop(data);
    } catch {
      setDirectoryShop(null);
      setDirectoryError(true);
    }
  }, [a.shop_id]);
  useEffect(() => {
    void loadDirectory();
  }, [loadDirectory]);
  function change<K extends keyof ReviewFields>(key: K, value: ReviewFields[K]) {
    setFields((f) => ({ ...f, [key]: value }));
    setConfirming(false);
    setNotice("");
  }
  function handleError(
    e: { message?: string; code?: string },
    operation: "save" | "reload" | "decision" | "evidence" | "duplicates" = "save",
  ) {
    setConfirming(false);
    if (denied(e)) {
      onDenied();
      return;
    }
    if (/SHOP_REVIEW_CHANGED/.test(e.message ?? "")) {
      setConflict(true);
      setError(
        "This review changed since you opened it, or your previous save completed. Your entries are still here. Copy any notes you need, then reload the saved review before continuing.",
      );
    } else if (/SHOP_REQUEST_RESOLVED/.test(e.message ?? "")) {
      setResolved(true);
      setError("This application was already decided or withdrawn. Refresh the application list.");
    } else if (/SHOP_DUPLICATES_CHANGED/.test(e.message ?? "")) {
      setDuplicates(null);
      setResolution("");
      setSelectedShop(null);
      setDuplicatesConfirmed(false);
      setError("The matching shops changed. Check existing shops again before approving.");
    } else if (/SHOP_ALREADY_MANAGED/.test(e.message ?? ""))
      setError(
        "This shop already has an owner. Approval cannot replace them; use the ownership support process.",
      );
    else if (/SHOP_REMOVED_USE_RESTORE/.test(e.message ?? ""))
      setError(
        "This matches a removed shop. An operator must restore or resolve that record before approval.",
      );
    else if (/SHOP_ALREADY_IN_DIRECTORY/.test(e.message ?? ""))
      setError("This shop already exists. Check existing shops and connect the matching branch.");
    else if (/SHOP_EXISTING_CLAIM_PENDING/.test(e.message ?? ""))
      setError(
        "This applicant already has a pending claim for that shop. Resolve or withdraw that claim first.",
      );
    else if (/SHOP_UNAVAILABLE/.test(e.message ?? "")) {
      setResolution("");
      setSelectedShop(null);
      setDuplicatesConfirmed(false);
      setError(
        "The selected shop is no longer available. Check existing shops again and choose another eligible shop before approving.",
      );
    } else if (/SHOP_ACCOUNT_REQUIRED/.test(e.message ?? ""))
      setError("The applicant is no longer eligible. Refresh the application list.");
    else if (/SHOP_INVALID_VERIFICATION|SHOP_VERIFICATION_REQUIRED/.test(e.message ?? ""))
      setError(
        "Check the review details. Confirmed authority needs a contact, source, method and a date that is not in the future.",
      );
    else if (/PGRST202|42883/.test(e.code ?? ""))
      setError(
        "The review-saving update is not installed on this backend yet. Your entries are preserved. Ask the operator to apply the shop review migration.",
      );
    else
      setError(
        {
          save: "Could not confirm the save. Your entries are preserved. Retry saving, or copy any unsaved notes before reloading the saved review.",
          reload:
            "Could not reload the saved review. Your current entries are unchanged. Try again.",
          decision:
            "Could not confirm the decision. Your entries are preserved. Retrying the same decision is safe; a completed decision will not be applied twice.",
          evidence:
            "Could not open the submitted photo. Try viewing the photo again. Your review entries are unchanged.",
          duplicates:
            "Could not load matching shops. Try checking existing shops again. Your review entries are unchanged.",
        }[operation],
      );
  }
  async function checkDuplicates() {
    setBusy(true);
    setError("");
    setDuplicates(null);
    setResolution("");
    setSelectedShop(null);
    setDuplicatesConfirmed(false);
    setConfirming(false);
    try {
      const { data, error: e } = await getAdminAuthBrowserClient().rpc(
        "find_shop_application_duplicates",
        { p_shop: a.proposed_shop },
      );
      if (e) throw e;
      setDuplicates(data ?? []);
    } catch (e) {
      handleError(e as { message: string }, "duplicates");
    } finally {
      setBusy(false);
    }
  }
  async function showEvidence() {
    setBusy(true);
    setError("");
    setEvidence(null);
    try {
      const check = await getAdminAuthBrowserClient().rpc("admin_get_shop_application", {
        p_request_id: a.id,
      });
      if (check.error) throw check.error;
      if (!check.data?.evidence_path) throw new Error("Evidence unavailable");
      const result = await getAdminAuthBrowserClient()
        .storage.from("shop_application_evidence")
        .createSignedUrl(check.data.evidence_path, 60);
      if (result.error || !result.data) throw result.error;
      setEvidence(result.data.signedUrl);
    } catch (e) {
      handleError((e ?? {}) as { message: string }, "evidence");
    } finally {
      setBusy(false);
    }
  }
  async function saveReview() {
    if (blocked || conflict || sending.current) return;
    const issues = reviewErrors(fields, false);
    if (issues.length) {
      setError(issues.join(" "));
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    setConfirming(false);
    try {
      const { data, error: e } = await getAdminAuthBrowserClient().rpc(
        "admin_save_shop_application_review",
        {
          p_request_id: a.id,
          p_verification: verification(fields),
          p_expected_verification: saved,
        },
      );
      if (e) throw e;
      setSaved(data);
      setSavedFields(JSON.stringify(fields));
      setNotice(
        "Review saved. The application is still awaiting a decision. You can return to it later.",
      );
    } catch (e) {
      handleError(e as { message: string });
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  async function reloadReview() {
    if (
      dirty &&
      !window.confirm(
        "Replace your unsaved review fields with the saved review? Copy any notes you want to keep first.",
      )
    )
      return;
    setBusy(true);
    setError("");
    setConfirming(false);
    try {
      const { data, error: e } = await getAdminAuthBrowserClient().rpc(
        "admin_get_shop_application",
        { p_request_id: a.id },
      );
      if (e) throw e;
      if (!data || data.status !== "waiting") {
        setResolved(true);
        throw new Error("SHOP_REQUEST_RESOLVED");
      }
      setSaved(data.verification);
      setFields(reviewFields(data.verification));
      setSavedFields(JSON.stringify(reviewFields(data.verification)));
      setConflict(false);
      setNotice("Saved review reloaded. Check existing-shop matches again before approving.");
      setDuplicates(null);
      setResolution("");
      setSelectedShop(null);
      setDuplicatesConfirmed(false);
    } catch (e) {
      handleError(e as { message: string }, "reload");
    } finally {
      setBusy(false);
    }
  }
  function approvalIssues() {
    const issues = reviewErrors(fields, true);
    if (a.already_managed || directoryShop?.has_owner)
      issues.push("The selected shop already has an owner.");
    if (!a.is_new_shop && !directoryShop)
      issues.push("Load the current directory record before approving.");
    if (a.is_new_shop && (!duplicates || !resolution || !duplicatesConfirmed))
      issues.push("Check existing shops and confirm whether to create or connect this shop.");
    return issues;
  }
  const missing =
    decision === "approve"
      ? approvalIssues()
      : decision === "decline" && !reason.trim()
        ? ["Write a clear reason for the applicant."]
        : [];
  async function decide() {
    if (!decision || !confirming || blocked || conflict || sending.current) return;
    const approve = decision === "approve";
    const issues = approve
      ? approvalIssues()
      : !reason.trim()
        ? ["Write a reason for the applicant."]
        : [];
    if (issues.length) {
      setError(issues.join(" "));
      setConfirming(false);
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    try {
      const { error: e } = await getAdminAuthBrowserClient().rpc(
        "admin_decide_shop_application_review",
        {
          p_request_id: a.id,
          p_approve: approve,
          p_reason: approve ? null : reason.trim(),
          p_verification: approve ? verification(fields) : declineVerification(saved, fields.notes),
          p_expected_verification: saved,
          p_existing_shop_id:
            a.is_new_shop && approve && resolution !== "new" ? Number(resolution) : null,
          p_duplicate_ids: a.is_new_shop && approve ? (duplicates?.map((d) => d.id) ?? null) : null,
        },
      );
      if (e) throw e;
      onDirty(false);
      onDone(approve);
    } catch (e) {
      handleError(e as { message: string }, "decision");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  const shop = a.proposed_shop ?? directoryShop;
  return (
    <article className="space-y-5" aria-label={`Application ${a.id}`}>
      <header className="px-1">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">
            {resolved ? "No longer pending" : "Awaiting decision"}
          </span>
          <span className="text-slate-500">
            Application #{a.id} · {a.is_new_shop ? "New shop" : "Existing shop claim"}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight">{a.shop_name}</h2>
        <p className="mt-1 text-sm text-slate-500">{a.shop_address}</p>
      </header>
      {a.is_own_application && (
        <p role="alert" className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          You submitted this application. Another reviewer must save the review and make the
          decision.
        </p>
      )}
      <Section
        number="1"
        title="Application details"
        description="Everything submitted by the applicant. These details are read-only; reviewer notes are recorded separately below."
      >
        <div className="mb-5 rounded-xl bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {a.is_new_shop ? "Proposed shop · not yet public" : "Existing directory shop"}
          </p>
          <dl className="grid gap-5 sm:grid-cols-2">
            <Detail label="Shop name">{a.shop_name}</Detail>
            <Detail label="Street address">{a.shop_address}</Detail>
            <Detail label="Unit / shop number">
              {shop?.unit ||
                (a.is_new_shop ? "None provided" : "Included in the directory address")}
            </Detail>
            <Detail label="Category">{shop?.kind ?? "Loading directory details…"}</Detail>
            {a.proposed_shop && (
              <Detail label="Map coordinates">
                {a.proposed_shop.lat}, {a.proposed_shop.lng}
              </Detail>
            )}
          </dl>
          <a
            className="mt-4 inline-block text-sm font-semibold text-orange-700 underline"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.proposed_shop ? `${a.proposed_shop.lat},${a.proposed_shop.lng}` : a.shop_address)}`}
            target="_blank"
            rel="noreferrer"
          >
            View location on map ↗
          </a>
          {directoryError && (
            <p className="mt-3 text-sm text-red-700">
              Directory details could not be loaded.{" "}
              <button className="underline" onClick={() => void loadDirectory()}>
                Retry directory lookup
              </button>
            </p>
          )}
        </div>
        <dl className="grid gap-5 sm:grid-cols-2">
          <Detail label="Applicant name">{a.applicant_name}</Detail>
          <Detail label={a.contact_method === "email" ? "Contact email" : "Contact phone"}>
            {a.contact_value ?? a.account_contact}
          </Detail>
          <Detail label="Business ABN">{a.abn}</Detail>
          <Detail label="Submitted">{dateLabel(a.created_at)}</Detail>
          <Detail label="Applicant note">{a.note}</Detail>
          <Detail label="Shop link">
            {a.shop_link && /^https?:\/\//i.test(a.shop_link) ? (
              <a
                href={a.shop_link}
                target="_blank"
                rel="noreferrer"
                className="break-all text-orange-700 underline"
              >
                {a.shop_link} ↗
              </a>
            ) : (
              a.shop_link
            )}
          </Detail>
        </dl>
        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="text-sm font-semibold">Supporting photo</p>
          <p className="mt-1 text-sm text-slate-500">
            Private application evidence. It is not the shop’s public profile photo.
          </p>
          {a.evidence_path ? (
            <button
              className={`${button} mt-3`}
              disabled={busy}
              onClick={() => void showEvidence()}
            >
              View submitted photo · expires after 60 seconds
            </button>
          ) : (
            <p className="mt-2 text-sm text-slate-500">No photo submitted.</p>
          )}
          {/* Signed private URLs must not go through an image optimizer or persistent cache. */}
          {evidence && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={evidence}
              alt="Submitted shop evidence"
              referrerPolicy="no-referrer"
              className="mt-4 max-h-96 max-w-full rounded-xl object-contain"
            />
          )}
        </div>
        <details className="mt-5 border-t border-slate-100 pt-4 text-sm">
          <summary className="cursor-pointer font-medium">
            Applicant declaration · accepted {dateLabel(a.declaration_accepted_at)}
          </summary>
          {a.declaration_version === "shop-onboarding-2026-10-13" && (
            <blockquote className="mt-3 border-l-2 border-slate-200 pl-4 leading-6 text-slate-700">
              I am submitting this application on behalf of this shop and am authorised to manage
              its PopOut page. I understand that PopOut will verify the application and may review
              or revoke access if it is inaccurate or disputed.
            </blockquote>
          )}
          <p className="mt-3 text-slate-600">Version: {a.declaration_version}</p>
          <p className="mt-2 text-slate-500">
            The recorded acceptance belongs to this application. It does not replace your
            independent authority check.
          </p>
        </details>
      </Section>
      <Section
        number="2"
        title="Compare existing shops"
        description={
          a.is_new_shop
            ? "Check for the same shop and branch before creating a directory entry. A shared name, address or ABN alone does not prove a match."
            : "This claim is linked to the existing directory record. Approval must preserve that shop and cannot replace another owner."
        }
      >
        {a.is_new_shop ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <button className={button} disabled={blocked} onClick={() => void checkDuplicates()}>
                {duplicates ? "Check matches again" : "Check existing shops"}
              </button>
              <span className="text-xs text-slate-500">
                Required for approval. Not required to decline.
              </span>
            </div>
            {duplicates && (
              <div className="mt-4 space-y-3">
                <p className="text-sm font-medium">
                  {duplicates.length
                    ? `${duplicates.length} possible match${duplicates.length === 1 ? "" : "es"} — compare the address and branch.`
                    : "No suggested matches found. Search by name or address below before deciding whether this is a separate shop."}
                </p>
                {duplicates.map((d) => (
                  <label
                    key={d.id}
                    className={`flex gap-3 rounded-xl border p-4 ${d.managed ? "bg-slate-50 text-slate-500" : "border-slate-200"}`}
                  >
                    <input
                      className="mt-1"
                      type="radio"
                      name={`resolution-${a.id}`}
                      checked={resolution === String(d.id)}
                      disabled={blocked || d.managed}
                      onChange={() => {
                        setResolution(String(d.id));
                        setSelectedShop(d);
                        setDuplicatesConfirmed(false);
                        setConfirming(false);
                      }}
                    />
                    <span className="min-w-0 text-sm">
                      <strong className="block">
                        {d.name} · #{d.id}
                      </strong>
                      <span className="mt-1 block">{d.address}</span>
                      <span className="mt-2 block text-xs">
                        {d.managed
                          ? "Already managed — cannot connect this application. Use ownership support."
                          : "Same shop and branch — connect this application to the existing record."}
                      </span>
                      <a
                        className="mt-2 inline-block underline"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.address)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Compare location ↗
                      </a>
                    </span>
                  </label>
                ))}
                <ShopMatchSearch
                  disabled={blocked}
                  selectedId={selectedShop?.id ?? null}
                  onDenied={onDenied}
                  onSelect={(shop) => {
                    setSelectedShop(shop);
                    setResolution(String(shop.id));
                    setDuplicatesConfirmed(false);
                    setConfirming(false);
                  }}
                />
                {selectedShop && (
                  <div
                    className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm"
                    role="status"
                  >
                    <p className="font-semibold">
                      Selected existing shop: {selectedShop.name} · #{selectedShop.id}
                    </p>
                    <p className="mt-1">{selectedShop.address}</p>
                    <p className="mt-2 text-slate-600">
                      Approval connects this application to this shop. No new shop will be created.
                      Confirm that it is the same shop and branch below.
                    </p>
                  </div>
                )}
                <label className="flex gap-3 rounded-xl border border-slate-200 p-4">
                  <input
                    type="radio"
                    name={`resolution-${a.id}`}
                    checked={resolution === "new"}
                    disabled={blocked}
                    onChange={() => {
                      setResolution("new");
                      setSelectedShop(null);
                      setDuplicatesConfirmed(false);
                      setConfirming(false);
                    }}
                  />
                  <span className="text-sm">
                    <strong className="block">Create a separate shop</strong>
                    <span className="mt-1 block text-slate-500">
                      This is a distinct shop or branch. It becomes public only when approved.
                    </span>
                  </span>
                </label>
                <label className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm">
                  <input
                    type="checkbox"
                    checked={duplicatesConfirmed}
                    disabled={blocked || !resolution}
                    onChange={(e) => {
                      setDuplicatesConfirmed(e.target.checked);
                      setConfirming(false);
                    }}
                  />
                  I checked the storefront, branch/unit, Melbourne location and map position, and
                  confirmed the choice above.
                </label>
              </div>
            )}
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Matches and this choice must be rechecked when you reopen an application. Record any
              comparison findings in the private notes below.
            </p>
          </>
        ) : (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="font-semibold">
              {a.shop_name} · Shop #{a.shop_id}
            </p>
            <p className="mt-1 text-sm text-slate-500">{a.shop_address}</p>
            <p
              className={`mt-3 text-sm font-medium ${a.already_managed || directoryShop?.has_owner ? "text-red-700" : "text-slate-700"}`}
            >
              {a.already_managed || directoryShop?.has_owner
                ? "Already managed. Approval cannot replace the current owner."
                : directoryShop
                  ? "No current owner shown. The server rechecks ownership when you approve."
                  : "Checking current directory status…"}
            </p>
          </div>
        )}
      </Section>
      <Section
        number="3"
        title="Review record"
        description="Private to authorised reviewers. Save your progress here without approving or declining the application."
      >
        <fieldset disabled={blocked} className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold">Business check</h4>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Open the official ABN register. Check that the registration is active and relates to
              the business operating this shop. An ABN does not prove the applicant’s authority.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                className={button}
                href={`https://abr.business.gov.au/ABN/View?abn=${encodeURIComponent(a.abn)}`}
                target="_blank"
                rel="noreferrer"
              >
                Open official ABN Lookup ↗
              </a>
              <button
                className={button}
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(a.abn);
                    setNotice("ABN copied.");
                  } catch {
                    setError(
                      "Could not copy. Select the ABN in the application details and copy it manually.",
                    );
                  }
                }}
              >
                Copy ABN
              </button>
            </div>
            <label className="mt-4 flex gap-3 rounded-xl bg-slate-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={fields.business}
                onChange={(e) => change("business", e.target.checked)}
              />
              I checked the active ABN and its connection to this shop.
            </label>
          </div>
          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-sm font-semibold">Applicant authority check</h4>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Contact the shop using a source you found independently, such as its official website
              or a visit. Ask whether this person is authorised to manage its PopOut page. The
              applicant’s own contact details alone are not independent confirmation.
            </p>
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium">
                How did you confirm it?
                <select
                  className={input}
                  value={fields.method}
                  onChange={(e) => change("method", e.target.value)}
                >
                  <option value="">Not confirmed yet</option>
                  <option value="phone">Phone call to the shop</option>
                  <option value="instagram">Official Instagram account</option>
                  <option value="visit">In-person visit</option>
                </select>
                <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">
                  Choose the method you actually used. Leave blank while gathering information.
                </span>
              </label>
              <label className="text-sm font-medium">
                When was it confirmed?
                <input
                  className={input}
                  type="datetime-local"
                  max={localDateTime(new Date().toISOString())}
                  value={fields.date}
                  onChange={(e) => change("date", e.target.value)}
                />
                <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">
                  Your local time. Use the actual confirmation time, not a future appointment.
                </span>
              </label>
              <label className="text-sm font-medium">
                Shop contact or location used
                <input
                  className={input}
                  maxLength={500}
                  placeholder={
                    fields.method === "instagram"
                      ? "e.g. @shopname"
                      : fields.method === "visit"
                        ? "e.g. shop address and person met"
                        : "e.g. the shop phone number you called"
                  }
                  value={fields.channel}
                  onChange={(e) => change("channel", e.target.value)}
                />
                <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">
                  Enter the actual number, account or visit location — not just “phone”.
                </span>
              </label>
              <label className="text-sm font-medium">
                Where did you find it?
                <input
                  className={input}
                  maxLength={2048}
                  placeholder="e.g. https://shop.example/contact, or storefront signage"
                  value={fields.source}
                  onChange={(e) => change("source", e.target.value)}
                />
                <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">
                  Record the independent source so another reviewer can follow your check.
                </span>
              </label>
            </div>
            <label className="mt-4 flex gap-3 rounded-xl bg-slate-50 p-4 text-sm">
              <input
                type="checkbox"
                checked={fields.confirmed}
                onChange={(e) => change("confirmed", e.target.checked)}
              />
              The shop confirmed this applicant is authorised to manage its PopOut page.
            </label>
            <p className="mt-2 text-xs text-slate-500">
              Leave unchecked until confirmed. If checked, the method, contact, source and time are
              required to save.
            </p>
          </div>
          <label className="block border-t border-slate-100 pt-5 text-sm font-semibold">
            Private reviewer notes <span className="font-normal text-slate-400">· optional</span>
            <textarea
              className={input}
              rows={4}
              maxLength={4000}
              placeholder="e.g. Compared the branch address. Waiting for the manager to confirm the applicant’s role. Follow up on Monday."
              value={fields.notes}
              onChange={(e) => change("notes", e.target.value)}
            />
            <span className="mt-1.5 block text-xs font-normal leading-5 text-slate-500">
              Record findings, unresolved questions and follow-up plans. The applicant cannot see
              these notes. If someone else performed a check, name them here.
            </span>
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={primary}
              disabled={blocked || conflict || !dirty}
              onClick={() => void saveReview()}
            >
              {busy ? "Please wait…" : "Save review record"}
            </button>
            <button className={button} disabled={busy} onClick={() => void reloadReview()}>
              Reload saved review
            </button>
            <span className="text-xs text-slate-500">
              {dirty
                ? "Unsaved review changes"
                : saved
                  ? "Saved review loaded"
                  : "No review record saved yet"}
            </span>
          </div>
        </fieldset>
        {notice && (
          <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
            {notice}
          </p>
        )}
      </Section>
      <Section
        number="4"
        title="Decision"
        description="Saving a review leaves the application pending. Only the final confirmation below approves or declines it."
      >
        <fieldset disabled={blocked || conflict} className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {(["approve", "decline"] as const).map((value) => (
              <button
                key={value}
                aria-pressed={decision === value}
                className={`rounded-xl border p-4 text-left ${decision === value ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900" : "border-slate-200"}`}
                onClick={() => {
                  setDecision(value);
                  setConfirming(false);
                  setError("");
                }}
              >
                <span className="block text-sm font-semibold">
                  {value === "approve" ? "Approve application" : "Decline application"}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {value === "approve"
                    ? "All checks must be complete. Grants access to manage the shop."
                    : "Explain what needs correcting. The applicant can edit and resubmit."}
                </span>
              </button>
            ))}
          </div>
          {decision === "decline" && (
            <div>
              <label className="block text-sm font-semibold">
                Reason for the applicant <span className="text-red-600">· required</span>
                <textarea
                  className={input}
                  rows={4}
                  maxLength={2000}
                  placeholder="e.g. Please clarify your role at the shop and provide a link that connects the business to this branch."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setConfirming(false);
                  }}
                />
                <span className="mt-2 block text-xs font-normal leading-5 text-slate-500">
                  Shown in the applicant’s My shops screen after you decline. This reason is not
                  saved by “Save review record”.
                </span>
              </label>
              <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                You do not need to complete the approval checks to decline. Your last saved checks
                and current private notes are retained; unfinished changes to the check fields are
                not submitted.
              </p>
            </div>
          )}
          {decision && missing.length > 0 && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">
                {decision === "approve" ? "Before you can approve" : "Before you can decline"}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {decision && !confirming && (
            <button
              className={decision === "approve" ? primary : `${button} border-red-200 text-red-700`}
              disabled={blocked || conflict || missing.length > 0}
              onClick={() => setConfirming(true)}
            >
              Review {decision === "approve" ? "approval" : "decline"}
            </button>
          )}
          {confirming && (
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-5">
              <h4 className="font-semibold">
                Confirm {decision === "approve" ? "approval" : "decline"} · Application #{a.id}
              </h4>
              <p className="mt-2 text-sm">{a.shop_name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {decision === "approve"
                  ? a.is_new_shop
                    ? resolution === "new"
                      ? "This creates a public shop and gives the applicant owner access."
                      : `This connects the application to ${selectedShop?.name ?? "shop"} (#${resolution}), ${selectedShop?.address ?? ""}, and gives the applicant owner access.`
                    : "This gives the applicant owner access to the existing shop. Its identity and followers are preserved."
                  : "The applicant will see this reason and can correct and resubmit:"}
              </p>
              {decision === "decline" && (
                <p className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-sm">
                  {reason}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className={
                    decision === "approve"
                      ? primary
                      : "rounded-xl bg-red-700 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                  }
                  disabled={blocked}
                  onClick={() => void decide()}
                >
                  {busy
                    ? "Saving decision…"
                    : decision === "approve"
                      ? "Confirm approval"
                      : "Confirm decline"}
                </button>
                <button className={button} disabled={busy} onClick={() => setConfirming(false)}>
                  Back to review
                </button>
              </div>
            </div>
          )}
          {!decision && (
            <p className="text-sm text-slate-500">
              Need more information? Save the review above and return later.
            </p>
          )}
        </fieldset>
      </Section>
      {error && (
        <div
          role="alert"
          className="sticky bottom-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm"
        >
          {error}
        </div>
      )}
    </article>
  );
}
