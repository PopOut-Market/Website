"use client";

import {
  RESTRICT_REASON_HINTS,
  RESTRICT_REASONS_GENERIC_ON_ALL_APPS,
  RESTRICT_REASONS_GENERIC_ON_APP_17,
  RESTRICTION_REASON_LABELS,
} from "@/lib/supabase/admin-rpc";

/**
 * Guidance for the reason the operator has picked, rendered under either restrict
 * dropdown (the standalone moderation tool and the reward-review panel) so the two
 * cannot drift apart. Renders nothing for reasons that need no explaining.
 */
export function RestrictReasonHelp({ reason }: { reason: string }) {
  const hint = RESTRICT_REASON_HINTS[reason];
  const genericOnAllApps = RESTRICT_REASONS_GENERIC_ON_ALL_APPS.includes(reason);
  const genericOnOldApp = !genericOnAllApps && RESTRICT_REASONS_GENERIC_ON_APP_17.includes(reason);
  if (!hint && !genericOnAllApps && !genericOnOldApp) return null;

  return (
    <div className="space-y-1.5">
      {hint && (
        <p className="text-xs text-slate-600">
          <span className="font-medium text-slate-700">{RESTRICTION_REASON_LABELS[reason]}:</span>{" "}
          {hint}
        </p>
      )}
      {genericOnAllApps && (
        <p className="text-xs text-slate-500">
          No released app version has a label for this reason yet, so every seller sees the generic
          “Breaks a marketplace rule” on the takedown screen; the push notification carries the full
          wording. Pick it anyway — it records the real reason, and the screen corrects itself once
          the app release adding it is live.
        </p>
      )}
      {genericOnOldApp && (
        <p className="text-xs text-slate-500">
          Sellers still on app 1.7 see the generic “Breaks a marketplace rule” on the takedown
          screen for this reason; the push notification carries the full wording, and the screen
          corrects itself once they update. Pick it anyway — it records the real reason.
        </p>
      )}
    </div>
  );
}
