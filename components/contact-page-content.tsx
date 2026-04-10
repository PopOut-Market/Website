"use client";

import { BackNavLink } from "@/components/back-nav-link";
import { useSiteShell } from "@/components/site-chrome-context";
import {
  FOOTER_CONTACT_EMAIL,
  INNER_MAX,
  POPOUT_BRAND_GRADIENT_TEXT_CLASS,
  SHELL_X,
} from "@/lib/site-config";
import { useState } from "react";

function contactCopy(locale: string) {
  if (locale === "zh-Hans") {
    return {
      back: "返回首页",
      title: "联系我们",
      hint: "留下你的问题或合作需求，我们会尽快通过邮箱回复。",
      emailLabel: "Email",
      titleLabel: "Title",
      mainLabel: "Main",
      titlePlaceholder: "请输入标题",
      mainPlaceholder: "请输入详细内容",
      send: "发送",
      sending: "发送中...",
      success: "已发送成功，我们会尽快回复你。",
      errorRequired: "请先填写 Title 和 Main。",
      errorFallback: "发送失败，请稍后重试。",
    };
  }
  if (locale === "zh-Hant") {
    return {
      back: "返回首頁",
      title: "聯絡我們",
      hint: "留下你的問題或合作需求，我們會盡快透過信箱回覆。",
      emailLabel: "Email",
      titleLabel: "Title",
      mainLabel: "Main",
      titlePlaceholder: "請輸入標題",
      mainPlaceholder: "請輸入詳細內容",
      send: "送出",
      sending: "送出中...",
      success: "已成功送出，我們會盡快回覆你。",
      errorRequired: "請先填寫 Title 與 Main。",
      errorFallback: "送出失敗，請稍後再試。",
    };
  }
  return {
    back: "Back Home",
    title: "Contact Us",
    hint: "Tell us your question or partnership request and we will reply by email.",
    emailLabel: "Email",
    titleLabel: "Title",
    mainLabel: "Main",
    titlePlaceholder: "Enter a short title",
    mainPlaceholder: "Write your message",
    send: "Send",
    sending: "Sending...",
    success: "Sent successfully. We will get back to you soon.",
    errorRequired: "Please fill in both Title and Main.",
    errorFallback: "Unable to send right now. Please try again.",
  };
}

export function ContactPageContent() {
  const { locale } = useSiteShell();
  const copy = contactCopy(locale);
  const [title, setTitle] = useState("");
  const [main, setMain] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanTitle = title.trim();
    const cleanMain = main.trim();
    if (!cleanTitle || !cleanMain) {
      setError(copy.errorRequired);
      return;
    }

    setSending(true);
    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: FOOTER_CONTACT_EMAIL,
          title: cleanTitle,
          main: cleanMain,
          locale,
        }),
      });

      if (!resp.ok) {
        const result = (await resp.json().catch(() => ({}))) as { error?: string };
        throw new Error(result.error || copy.errorFallback);
      }

      setTitle("");
      setMain("");
      setSuccess(copy.success);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.errorFallback);
    } finally {
      setSending(false);
    }
  }

  return (
    <section className={`${SHELL_X} flex min-h-0 flex-1 flex-col`}>
      <div className={`${INNER_MAX} flex w-full min-h-0 flex-1 flex-col py-3 sm:py-4`}>
        <div className="pt-1">
          <BackNavLink href="/">{copy.back}</BackNavLink>
        </div>

        <div className="mt-4 rounded-[24px] border border-white/45 bg-white/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 md:p-7">
          <h1 className={`text-2xl font-black sm:text-3xl ${POPOUT_BRAND_GRADIENT_TEXT_CLASS}`}>
            {copy.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{copy.hint}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {copy.emailLabel}
              </label>
              <input
                type="email"
                value={FOOTER_CONTACT_EMAIL}
                readOnly
                aria-readonly="true"
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm font-medium text-gray-700 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-title" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {copy.titleLabel}
              </label>
              <input
                id="contact-title"
                name="title"
                type="text"
                required
                maxLength={140}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={copy.titlePlaceholder}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-gray-300"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="contact-main" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {copy.mainLabel}
              </label>
              <textarea
                id="contact-main"
                name="main"
                required
                maxLength={4000}
                value={main}
                onChange={(event) => setMain(event.target.value)}
                placeholder={copy.mainPlaceholder}
                className="min-h-40 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-gray-900 outline-none transition focus:border-gray-300"
              />
            </div>

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            {success ? <p className="text-sm font-medium text-emerald-700">{success}</p> : null}

            <button
              type="submit"
              disabled={sending}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? copy.sending : copy.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
