"use client";

import {
  RESTRICT_REASON_HINTS,
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
  const genericOnOldApp = RESTRICT_REASONS_GENERIC_ON_APP_17.includes(reason);
  if (!hint && !genericOnOldApp) return null;

  return (
    <div className="space-y-1.5">
      {hint && (
        <p className="text-xs text-slate-600">
          <span className="font-medium text-slate-700">{RESTRICTION_REASON_LABELS[reason]}:</span>{" "}
          {hint}
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
