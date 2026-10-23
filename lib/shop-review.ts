export type Verification = {
  business_confirmed: boolean;
  application_confirmed: boolean;
  channel: string | null;
  source: string | null;
  method: string | null;
  confirmed_at: string | null;
  notes: string;
  reviewer_id?: string;
};
export type ReviewFields = {
  business: boolean;
  confirmed: boolean;
  channel: string;
  source: string;
  method: string;
  date: string;
  notes: string;
};
export function localDateTime(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function reviewFields(v: Verification | null): ReviewFields {
  return {
    business: v?.business_confirmed ?? false,
    confirmed: v?.application_confirmed ?? false,
    channel: v?.channel ?? "",
    source: v?.source ?? "",
    method: v?.method ?? "",
    date: localDateTime(v?.confirmed_at ?? null),
    notes: v?.notes ?? "",
  };
}
export function verification(f: ReviewFields): Verification {
  return {
    business_confirmed: f.business,
    application_confirmed: f.confirmed,
    channel: f.channel.trim() || null,
    source: f.source.trim() || null,
    method: f.method || null,
    confirmed_at: f.date ? new Date(f.date).toISOString() : null,
    notes: f.notes.trim(),
  };
}
export function reviewErrors(f: ReviewFields, approve: boolean, now = Date.now()) {
  const errors: string[] = [];
  if (approve && !f.business)
    errors.push("Confirm the ABN is active and belongs to the business operating this shop.");
  if (approve && !f.confirmed)
    errors.push("Confirm that the shop authorised this applicant to manage its page.");
  if (f.confirmed || approve) {
    if (!f.channel.trim()) errors.push("Enter the shop contact or visit location used.");
    if (!f.source.trim())
      errors.push("Enter where you independently found that contact or location.");
    if (!f.method) errors.push("Choose how you confirmed the application.");
    if (!f.date) errors.push("Enter when you confirmed the application.");
  }
  if (f.date && !Number.isFinite(new Date(f.date).getTime()))
    errors.push("Enter a valid confirmation date and time.");
  else if (f.date && new Date(f.date).getTime() > now)
    errors.push("Confirmation time cannot be in the future.");
  return errors;
}
// A decline needs no completed checks. Preserve previously saved valid checks,
// without submitting hidden/unfinished approval edits or a future date.
export function declineVerification(saved: Verification | null, notes: string): Verification {
  const { reviewer_id: _reviewer, ...v } = saved ?? verification(reviewFields(null));
  void _reviewer;
  return { ...v, notes: notes.trim() };
}
