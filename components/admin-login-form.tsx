"use client";

import {
  getAdminAuthBrowserClient,
  isAdminAuthConfigured,
} from "@/lib/supabase/admin-auth-browser-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

// Only these accounts may request an OTP. All are present in the
// server-side `reward_admins` allowlist (the real gate); this client-side
// restriction just avoids sending SMS codes to arbitrary numbers.
// Sooyoung (operator), Eric, Jun.
const ALLOWED_PHONES = ["+61466807771", "+61481690673", "+61422054574"] as const;

function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const plus = trimmed.startsWith("+") ? "+" : "";
  return plus + trimmed.replace(/\D/g, "");
}

type AdminLoginFormProps = {
  title: string;
  description: string;
  successRedirectTo?: string;
};

export function AdminLoginForm({
  title,
  description,
  successRedirectTo = "/admin-super/dashboard",
}: AdminLoginFormProps) {
  const router = useRouter();
  const configured = useMemo(() => isAdminAuthConfigured(), []);

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  async function sendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    const normalized = normalizePhone(phone);
    if (!ALLOWED_PHONES.includes(normalized as (typeof ALLOWED_PHONES)[number])) {
      setErrorText("This phone number is not authorized for admin access.");
      return;
    }

    setSubmitting(true);
    setErrorText(null);
    try {
      const supabase = getAdminAuthBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        phone: normalized,
        options: { shouldCreateUser: false },
      });
      if (error) {
        setErrorText(error.message);
        return;
      }
      setPhone(normalized);
      setStep("otp");
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured) return;

    setSubmitting(true);
    setErrorText(null);
    try {
      const supabase = getAdminAuthBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        phone: normalizePhone(phone),
        token: code.trim(),
        type: "sms",
      });
      if (error) {
        setErrorText(error.message);
        return;
      }
      router.replace(successRedirectTo);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center bg-slate-50 px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{description}</p>

        {!configured ? (
          <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            Missing Supabase browser env keys. Set
            <code className="mx-1 rounded bg-amber-100 px-1 py-0.5">EXPO_PUBLIC_SUPABASE_URL</code>
            and
            <code className="ml-1 rounded bg-amber-100 px-1 py-0.5">
              EXPO_PUBLIC_SUPABASE_ANON_KEY
            </code>
            .
          </div>
        ) : null}

        {step === "phone" ? (
          <form onSubmit={sendCode} className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-800">Mobile number</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="+61 4XX XXX XXX"
                required
              />
            </label>

            {errorText ? (
              <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {errorText}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!configured || submitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Sending code..." : "Send code"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="mt-6 space-y-4">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-slate-800">Verification code</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 tracking-widest text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                placeholder="123456"
                required
              />
            </label>

            <p className="text-xs text-slate-500">
              Sent to {phone}.{" "}
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setCode("");
                  setErrorText(null);
                }}
                className="font-medium text-slate-900 underline underline-offset-4"
              >
                Change number
              </button>
            </p>

            {errorText ? (
              <p className="rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {errorText}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!configured || submitting}
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Verifying..." : "Verify & sign in"}
            </button>
          </form>
        )}

        <div className="mt-5 text-sm text-slate-600">
          <Link
            href="/admin-super"
            className="font-medium text-slate-900 underline underline-offset-4"
          >
            Back to admin-super
          </Link>
        </div>
      </div>
    </section>
  );
}
