"use client";

import { AppealsQueue } from "@/components/admin/content-review/appeals-queue";
import { CommunityQueue } from "@/components/admin/content-review/community-queue";
import { PhotoQueue } from "@/components/admin/content-review/photo-queue";
import { RestrictionLookup } from "@/components/admin/content-review/restriction-lookup";
import { AccessEnded } from "@/components/admin/content-review/shared";
import { ACCESS_ENDED_MESSAGE } from "@/lib/supabase/admin-content-review";
import { isAdminAuthConfigured } from "@/lib/supabase/admin-auth-browser-client";
import { useCallback, useMemo, useState } from "react";

/**
 * Content review — community posts, profile photos, and appeals.
 *
 * This is moderation, and it is unrelated to the listing reward queue: no coins,
 * no rewards, nothing to do with reward-review. It shares only the auth (phone
 * OTP + a row in `reward_admins`), which every backing function re-checks itself
 * as its first act.
 */

type TabKey = "community" | "photos" | "appeals";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "community", label: "Community posts", icon: "📝" },
  { key: "photos", label: "Profile photos", icon: "🖼️" },
  { key: "appeals", label: "Appeals", icon: "⚖️" },
];

export default function ContentReviewPage() {
  const [tab, setTab] = useState<TabKey>("community");
  const [accessEnded, setAccessEnded] = useState(false);
  const configured = useMemo(() => isAdminAuthConfigured(), []);

  /**
   * Rule 5. The backend cannot reach into a browser and retract rows it already
   * sent — this half is ours. Flipping this unmounts every queue, so the member
   * content they were holding goes with them; an operator removed mid-session
   * cannot keep reading the queue off a stale page.
   */
  const handleAccessEnded = useCallback(() => setAccessEnded(true), []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Content review</h1>
        <p className="mt-1 text-sm text-slate-600">
          Community posts and profile photos, oldest first. Purely moderation — no coins and no
          rewards. Your own content never appears here.
        </p>
      </div>

      {!configured ? (
        <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm text-rose-700">
          Supabase is not configured.
        </div>
      ) : accessEnded ? (
        // Deliberately replaces the tabs entirely: no member content stays on
        // screen, and this must never be mistaken for an empty queue.
        <AccessEnded message={ACCESS_ENDED_MESSAGE} />
      ) : (
        <>
          <div className="flex flex-wrap gap-1 border-b border-slate-200" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition ${
                  tab === t.key
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <span aria-hidden>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {tab === "community" && (
            <div className="space-y-4">
              <RestrictionLookup onAccessEnded={handleAccessEnded} />
              <CommunityQueue onAccessEnded={handleAccessEnded} />
            </div>
          )}
          {tab === "photos" && <PhotoQueue onAccessEnded={handleAccessEnded} />}
          {tab === "appeals" && <AppealsQueue onAccessEnded={handleAccessEnded} />}
        </>
      )}
    </div>
  );
}
