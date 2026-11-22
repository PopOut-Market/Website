import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/site-config";
import { LOCALES, type Locale } from "@/lib/site-i18n";
import { downloadCopy } from "@/lib/download-copy";
import { APP_ICON, WIDE_ART, downloadUrl } from "@/lib/download-metadata";
import { localeSegment } from "@/lib/site-locale-routing";

export default function DownloadPageContent({ locale }: { locale: Locale }) {
  const copy = downloadCopy[locale];
  const stores = [
    { name: "App Store", action: copy.iphone, href: APP_STORE_URL, icon: "ios" },
    { name: "Google Play", action: copy.android, href: GOOGLE_PLAY_URL, icon: "android" },
  ];
  return (
    <div className="dl-page">
      <header className="dl-header">
        <span className="dl-brand">
          <img src={APP_ICON} alt="" width="32" height="32" />
          PopOut Market
        </span>
        <details className="dl-languages">
          <summary
            aria-label={copy.language + " · " + LOCALES.find((l) => l.code === locale)?.label}
          >
            <span aria-hidden="true">◎</span> {LOCALES.find((l) => l.code === locale)?.label}
          </summary>
          <nav aria-label={copy.language}>
            {LOCALES.map((l) => (
              <a
                key={l.code}
                href={downloadUrl(l.code)}
                hrefLang={l.code}
                lang={l.code}
                aria-current={locale === l.code ? "page" : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </details>
      </header>
      <main className="dl-grid">
        <section className="dl-main">
          <img className="dl-icon" src={APP_ICON} alt="PopOut" width="88" height="88" />
          <h1>{copy.heading}</h1>
          <p className="dl-intro">{copy.intro}</p>
          <div className="dl-stores">
            {stores.map((store) => (
              <a href={store.href} className="dl-store" key={store.icon}>
                <img
                  src={`/images/download/device-${store.icon}.svg`}
                  alt=""
                  width="27"
                  height="27"
                />
                <span>
                  <strong>{store.name}</strong>
                  <small>{store.action}</small>
                </span>
              </a>
            ))}
          </div>
          <p className="dl-help">{copy.browserHelp}</p>
        </section>
        <aside className="dl-aside">
          <img className="dl-map" src={WIDE_ART} alt="" width="1200" height="630" />
          <div className="dl-scan">
            <img
              src={`/images/download/qr-${localeSegment(locale)}.svg`}
              alt={copy.qrAlt}
              width="144"
              height="144"
            />
            <div>
              <h2>{copy.scan}</h2>
              <p>{copy.scanHelp}</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
