"use client";

import {
  communityPhotoUrl,
  formatDateTime,
  type QueueAuthor,
} from "@/lib/supabase/admin-content-review";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/* Access ended                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Rule 5: an access-denied state and an empty queue are different states. This
 * deliberately shares no visual language with the "nothing to review" card — a
 * refusal must never read as an all-clear.
 */
export function AccessEnded({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-rose-300 bg-rose-50 py-16 text-center">
      <div className="mb-3 text-4xl" aria-hidden>
        🔒
      </div>
      <p className="text-base font-semibold text-rose-900">Access ended</p>
      <p className="mt-2 max-w-md px-6 text-sm text-rose-800">{message}</p>
    </div>
  );
}

/** "Nothing to review" — visually distinct from AccessEnded on purpose. */
export function EmptyQueue({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center shadow-sm">
      <div className="mb-3 text-4xl" aria-hidden>
        🎉
      </div>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Toast + notices                                                             */
/* -------------------------------------------------------------------------- */

export type NoticeTone = "success" | "info" | "error";

const TONE_CLASS: Record<NoticeTone, string> = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-800",
  info: "border-sky-300 bg-sky-50 text-sky-800",
  error: "border-rose-300 bg-rose-50 text-rose-700",
};

export function Notice({ tone, children }: { tone: NoticeTone; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl border px-4 py-2 text-sm ${TONE_CLASS[tone]}`}>{children}</div>
  );
}

/* -------------------------------------------------------------------------- */
/* Bilingual body                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Every community-post row already carries `*_en` alongside the author's raw
 * words. There is no translate call and no endpoint to add one — this only
 * toggles between two fields we already have.
 *
 * A null `*_en` is NORMAL (the translation cron has not caught up, or the post
 * is already English). Show the raw words and say so plainly — it is not an
 * error state.
 */
export function BilingualText({
  title,
  body,
  titleEn,
  bodyEn,
  idPrefix,
}: {
  title: string | null;
  body: string | null;
  titleEn: string | null;
  bodyEn: string | null;
  idPrefix: string;
}) {
  const hasEnglish = Boolean(titleEn?.trim() || bodyEn?.trim());
  // Default to English when we have it: the admin UI is English-only, so that is
  // the reading a reviewer can actually judge. The raw words stay one click away.
  const [showEnglish, setShowEnglish] = useState(hasEnglish);

  const shownTitle = showEnglish && hasEnglish ? (titleEn ?? title) : title;
  const shownBody = showEnglish && hasEnglish ? (bodyEn ?? body) : body;

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {hasEnglish ? (
          <div
            className="inline-flex overflow-hidden rounded-lg border border-slate-300"
            role="group"
            aria-label="Language"
          >
            <button
              type="button"
              onClick={() => setShowEnglish(false)}
              aria-pressed={!showEnglish}
              className={`px-2.5 py-1 text-xs font-medium transition ${
                !showEnglish
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              As written
            </button>
            <button
              type="button"
              onClick={() => setShowEnglish(true)}
              aria-pressed={showEnglish}
              className={`px-2.5 py-1 text-xs font-medium transition ${
                showEnglish
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              English
            </button>
          </div>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
            No English yet — showing as written
          </span>
        )}
      </div>

      <p
        id={`${idPrefix}-title`}
        lang={showEnglish && hasEnglish ? "en" : undefined}
        className="text-sm font-semibold text-slate-900"
      >
        {shownTitle?.trim() || "(no title)"}
      </p>
      <p
        id={`${idPrefix}-body`}
        lang={showEnglish && hasEnglish ? "en" : undefined}
        className="mt-1 whitespace-pre-wrap text-sm text-slate-700"
      >
        {shownBody?.trim() || "(no body)"}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Photos                                                                      */
/* -------------------------------------------------------------------------- */

/** Community post photos. Restricting a post does not destroy these. */
export function CommunityPhotoStrip({ paths }: { paths: string[] | null }) {
  const list = (paths ?? []).filter(Boolean);
  if (list.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-slate-500">
        {list.length} photo{list.length === 1 ? "" : "s"}
      </p>
      <div className="flex flex-wrap gap-2">
        {list.map((p) => {
          const url = communityPhotoUrl(p);
          if (!url) return null;
          return (
            <a
              key={p}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block h-24 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 transition hover:opacity-80"
              title="Open full size"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Author / meta                                                               */
/* -------------------------------------------------------------------------- */

export function AuthorLine({
  author,
  at,
  atLabel,
}: {
  author: QueueAuthor | null;
  at: string | null;
  atLabel: string;
}) {
  return (
    <p className="text-xs text-slate-400">
      {author?.nickname?.trim() || "(no nickname)"}
      {at ? ` · ${atLabel} ${formatDateTime(at)}` : ""}
    </p>
  );
}
