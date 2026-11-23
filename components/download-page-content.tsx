import { downloadCopy } from "@/lib/download-copy";
import { APP_ICON, downloadUrl, type DownloadChannel } from "@/lib/download-metadata";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/site-config";
import { LOCALES, type Locale } from "@/lib/site-i18n";
import { localeSegment } from "@/lib/site-locale-routing";

export default function DownloadPageContent({
  locale,
  channel,
}: {
  locale: Locale;
  channel: DownloadChannel | null;
}) {
  const copy = downloadCopy[locale];
  const currentLanguage = LOCALES.find((language) => language.code === locale)?.label;
  return (
    <div className="dl-page">
      <header className="dl-header">
        <details className="dl-languages">
          <summary aria-label={`${copy.language} · ${currentLanguage}`}>
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.65"
            >
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="4" ry="9" />
              <path d="M3 12h18" />
            </svg>
            <span>{currentLanguage}</span>
            <svg
              aria-hidden="true"
              className="dl-chevron"
              width="13"
              height="13"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="m3.5 6 4.5 4 4.5-4" />
            </svg>
          </summary>
          <nav aria-label={copy.language}>
            {LOCALES.map((language) => (
              <a
                key={language.code}
                href={downloadUrl(language.code, channel)}
                hrefLang={language.code}
                lang={language.code}
                aria-current={locale === language.code ? "page" : undefined}
              >
                {language.label}
              </a>
            ))}
          </nav>
        </details>
      </header>
      <main className="dl-grid">
        <section className="dl-main" aria-labelledby="dl-title">
          <img className="dl-icon" src={APP_ICON} alt="PopOut" width="128" height="128" />
          <h1 id="dl-title">{copy.heading}</h1>
          <p className="dl-intro">
            {locale.startsWith("zh")
              ? copy.intro.split(/(?<=[、，])/u).map((phrase) => (
                  <span className="dl-phrase" key={phrase}>
                    {phrase}
                  </span>
                ))
              : copy.intro}
          </p>
        </section>
        <div className="dl-mobile">
          <div className="dl-stores">
            <a href={APP_STORE_URL}>
              <img
                src="/images/download/badge-app-store.svg?v=5"
                alt={copy.iphone}
                width="216"
                height="64"
              />
            </a>
            <a href={GOOGLE_PLAY_URL}>
              <img
                src="/images/download/badge-google-play.svg?v=5"
                alt={copy.android}
                width="216"
                height="64"
              />
            </a>
          </div>
          <details className="dl-help">
            <summary>{copy.helpLabel}</summary>
            <p>{copy.browserHelp}</p>
          </details>
        </div>
        <figure className="dl-scan">
          <img
            src={`/images/download/qr-${localeSegment(locale)}.svg`}
            alt={copy.qrAlt}
            width="246"
            height="246"
          />
          <figcaption>
            <h2>{copy.scan}</h2>
            <p>{copy.scanHelp}</p>
          </figcaption>
        </figure>
      </main>
    </div>
  );
}
