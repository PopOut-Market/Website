import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localizedAlternates, siteUrl, OG_IMAGE } from "@/lib/seo";
import {
  DEFAULT_LOCALE,
  LOCALE_SEGMENT_TO_CODE,
  localeFromSegment,
  toLocalePath,
} from "@/lib/site-locale-routing";
import {
  EXISTING_SUBURB_PAGES,
  MELBOURNE_REGIONS,
  REGION_SLUGS,
  getRegion,
} from "@/lib/melbourne-regions";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

const HUB_PATH = "/melbourne-suburbs";

type RegionParams = { params: Promise<{ locale: string; region: string }> };

type RegionCopy = {
  metaTitle: (r: string) => string;
  metaDesc: (r: string, count: number, examples: string) => string;
  h1: (r: string) => string;
  intro: (r: string, count: number) => string;
  coveredHeading: (r: string) => string;
  coveredNote: string;
  guideLinkedNote: string;
  relatedHeading: string;
  browseMarket: string;
  allRegions: string;
  otherRegions: string;
};

// Localized page copy. Suburb names themselves stay as proper nouns; only the
// surrounding copy is translated. The unique per-region suburb list is what
// makes each of the 9 pages substantially different content (not thin/dupe).
const COPY: Record<Locale, RegionCopy> = {
  en: {
    metaTitle: (r) => `${r} Melbourne Second-Hand App & Marketplace | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `Buy and sell second-hand across ${r} Melbourne, Australia with PopOut Market — ${count} suburbs including ${examples}. Browse local listings by area, chat in multiple languages, and meet up safely. Live in Melbourne now, with more Australian cities coming soon.`,
    h1: (r) => `${r} Melbourne Second-Hand`,
    intro: (r, count) =>
      `PopOut Market is a second-hand app and neighbourhood marketplace for ${r} Melbourne, Australia. We cover ${count} suburbs across this part of Melbourne — find furniture, appliances, bikes and everyday items near you, chat across languages, and meet up safely. Currently live in Melbourne, with more Australian cities coming soon.`,
    coveredHeading: (r) => `Suburbs we cover in ${r} Melbourne`,
    coveredNote: "Every suburb below is an active PopOut service area.",
    guideLinkedNote: "Suburbs with their own guide are linked.",
    relatedHeading: "Related pages",
    browseMarket: "Browse Melbourne listings",
    allRegions: "All Melbourne suburb regions",
    otherRegions: "Other Melbourne regions",
  },
  "zh-Hans": {
    metaTitle: (r) => `墨尔本${r}二手App与同城二手交易 | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `用 PopOut Market 在澳大利亚墨尔本${r}买卖二手：覆盖 ${count} 个 suburb，包括 ${examples} 等。按区域浏览本地二手好物，多语言沟通，更安全地当面交易。现已上线墨尔本，更多澳洲城市陆续开放，敬请期待。`,
    h1: (r) => `墨尔本${r}二手交易`,
    intro: (r, count) =>
      `PopOut Market 是面向澳大利亚墨尔本${r}的二手 App 与同城二手平台。我们覆盖墨尔本${r}的 ${count} 个 suburb——在你身边找二手家具、电器、单车和日常好物，支持多语言沟通和更安全的当面交易。现已上线墨尔本，更多澳洲城市陆续开放，敬请期待。`,
    coveredHeading: (r) => `墨尔本${r}覆盖的 suburb`,
    coveredNote: "以下每个 suburb 都是 PopOut 正在开放服务的区域。",
    guideLinkedNote: "有独立介绍页的 suburb 已加链接。",
    relatedHeading: "相关页面",
    browseMarket: "浏览墨尔本在售二手",
    allRegions: "查看墨尔本所有区域",
    otherRegions: "墨尔本其他区域",
  },
  "zh-Hant": {
    metaTitle: (r) => `墨爾本${r}二手App與同城二手交易 | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `用 PopOut Market 在澳洲墨爾本${r}買賣二手：涵蓋 ${count} 個 suburb，包括 ${examples} 等。依區域瀏覽本地二手好物，多語言溝通，更安全地當面交易。現已上線墨爾本，更多澳洲城市陸續開放，敬請期待。`,
    h1: (r) => `墨爾本${r}二手交易`,
    intro: (r, count) =>
      `PopOut Market 是面向澳洲墨爾本${r}的二手 App 與同城二手平台。我們涵蓋墨爾本${r}的 ${count} 個 suburb——在你身邊找二手家具、電器、單車與日常好物，支援多語言溝通與更安全的當面交易。現已上線墨爾本，更多澳洲城市陸續開放，敬請期待。`,
    coveredHeading: (r) => `墨爾本${r}涵蓋的 suburb`,
    coveredNote: "以下每個 suburb 都是 PopOut 正在開放服務的區域。",
    guideLinkedNote: "有獨立介紹頁的 suburb 已加連結。",
    relatedHeading: "相關頁面",
    browseMarket: "瀏覽墨爾本在售二手",
    allRegions: "查看墨爾本所有區域",
    otherRegions: "墨爾本其他區域",
  },
  ko: {
    metaTitle: (r) => `${r} 멜버른 중고거래 앱 & 마켓 | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `PopOut Market로 호주 멜버른 ${r}에서 중고를 사고파세요 — ${examples} 등 ${count}개 suburb를 포함합니다. 지역별로 매물을 둘러보고, 다국어로 소통하며, 안전하게 직거래하세요. 현재 멜버른에서 운영 중이며, 호주 내 더 많은 도시로 확대될 예정입니다.`,
    h1: (r) => `${r} 멜버른 중고거래`,
    intro: (r, count) =>
      `PopOut Market는 호주 멜버른 ${r}을(를) 위한 중고거래 앱이자 동네 중고마켓입니다. 멜버른 ${r}의 ${count}개 suburb를 다루며, 가까운 중고 가구·가전·자전거·생활용품을 찾고 다국어로 소통하며 안전하게 직거래할 수 있습니다. 현재 멜버른에서 운영 중이며, 호주 내 더 많은 도시로 확대될 예정입니다.`,
    coveredHeading: (r) => `멜버른 ${r}에서 다루는 suburb`,
    coveredNote: "아래 모든 suburb는 현재 PopOut 서비스 지역입니다.",
    guideLinkedNote: "전용 안내 페이지가 있는 suburb는 링크되어 있습니다.",
    relatedHeading: "관련 페이지",
    browseMarket: "멜버른 중고 매물 둘러보기",
    allRegions: "멜버른 전체 지역 보기",
    otherRegions: "멜버른 다른 지역",
  },
  ja: {
    metaTitle: (r) => `${r} メルボルンの中古売買アプリ・マーケット | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `PopOut Marketでオーストラリア・メルボルンの${r}の中古を売買。${examples} など ${count} のサバーブをカバー。エリア別に出品を探し、多言語でやり取りし、安全に手渡し取引できます。現在はメルボルンで提供中、今後オーストラリアの他都市にも順次拡大予定です。`,
    h1: (r) => `${r} メルボルンの中古売買`,
    intro: (r, count) =>
      `PopOut Marketは、オーストラリア・メルボルンの${r}向けの中古売買アプリ・地元フリマです。メルボルン${r}の ${count} のサバーブをカバーし、近くの中古家具・家電・自転車・日用品を探して、多言語でやり取りし、安全に手渡しで取引できます。現在はメルボルンで提供中、今後オーストラリアの他都市にも順次拡大予定です。`,
    coveredHeading: (r) => `メルボルン${r}のカバー対象サバーブ`,
    coveredNote: "以下のサバーブはすべてPopOutの提供エリアです。",
    guideLinkedNote: "専用ページがあるサバーブはリンクしています。",
    relatedHeading: "関連ページ",
    browseMarket: "メルボルンの中古品を見る",
    allRegions: "メルボルンの全地域を見る",
    otherRegions: "メルボルンの他の地域",
  },
  vi: {
    metaTitle: (r) => `App đồ cũ ${r} Melbourne & chợ đồ cũ | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `Mua bán đồ cũ tại ${r} Melbourne, Úc với PopOut Market — gồm ${count} suburb như ${examples}. Duyệt tin theo khu vực, chat đa ngôn ngữ và giao dịch an toàn. Hiện đã có mặt tại Melbourne, sắp mở rộng tới nhiều thành phố khác ở Úc.`,
    h1: (r) => `Đồ cũ ${r} Melbourne`,
    intro: (r, count) =>
      `PopOut Market là app đồ cũ và chợ mua bán đồ cũ cho khu ${r} của Melbourne, Úc. Chúng tôi bao phủ ${count} suburb ở khu vực này của Melbourne — tìm nội thất, đồ điện, xe đạp và đồ dùng hằng ngày gần bạn, chat đa ngôn ngữ và giao dịch gặp mặt an toàn. Hiện đã có mặt tại Melbourne, sắp mở rộng tới nhiều thành phố khác ở Úc.`,
    coveredHeading: (r) => `Các suburb thuộc ${r} Melbourne`,
    coveredNote: "Mỗi suburb bên dưới đều là khu vực PopOut đang phục vụ.",
    guideLinkedNote: "Suburb có trang riêng đã được gắn liên kết.",
    relatedHeading: "Trang liên quan",
    browseMarket: "Xem đồ cũ tại Melbourne",
    allRegions: "Tất cả khu vực Melbourne",
    otherRegions: "Các khu vực khác ở Melbourne",
  },
  fr: {
    metaTitle: (r) => `Appli d'occasion ${r} Melbourne & marché | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `Achetez et vendez d'occasion dans ${r} de Melbourne, en Australie, avec PopOut Market — ${count} quartiers dont ${examples}. Parcourez les annonces par zone, discutez en plusieurs langues et rencontrez-vous en toute sécurité. Disponible à Melbourne, bientôt dans d'autres villes australiennes.`,
    h1: (r) => `Occasion ${r} Melbourne`,
    intro: (r, count) =>
      `PopOut Market est une appli d'occasion et un marché de quartier pour ${r} de Melbourne, en Australie. Nous couvrons ${count} quartiers dans cette partie de Melbourne — trouvez meubles, électroménager, vélos et objets du quotidien près de chez vous, discutez en plusieurs langues et rencontrez-vous en toute sécurité. Disponible à Melbourne, bientôt dans d'autres villes australiennes.`,
    coveredHeading: (r) => `Quartiers couverts dans ${r} de Melbourne`,
    coveredNote: "Chaque quartier ci-dessous est une zone desservie par PopOut.",
    guideLinkedNote: "Les quartiers ayant leur propre page sont liés.",
    relatedHeading: "Pages liées",
    browseMarket: "Voir les annonces à Melbourne",
    allRegions: "Toutes les régions de Melbourne",
    otherRegions: "Autres régions de Melbourne",
  },
  es: {
    metaTitle: (r) => `App de segunda mano ${r} Melbourne y mercado | PopOut Market`,
    metaDesc: (r, count, examples) =>
      `Compra y vende de segunda mano en ${r} de Melbourne, Australia, con PopOut Market — ${count} barrios incluyendo ${examples}. Explora anuncios por zona, chatea en varios idiomas y queda de forma segura. Ya en Melbourne y pronto en más ciudades de Australia.`,
    h1: (r) => `Segunda mano ${r} Melbourne`,
    intro: (r, count) =>
      `PopOut Market es una app de segunda mano y un mercado de barrio para ${r} de Melbourne, Australia. Cubrimos ${count} barrios en esta parte de Melbourne — encuentra muebles, electrodomésticos, bicis y artículos cotidianos cerca de ti, chatea en varios idiomas y queda de forma segura. Ya en Melbourne y pronto en más ciudades de Australia.`,
    coveredHeading: (r) => `Barrios que cubrimos en ${r} de Melbourne`,
    coveredNote: "Cada barrio de abajo es una zona de servicio activa de PopOut.",
    guideLinkedNote: "Los barrios con su propia página están enlazados.",
    relatedHeading: "Páginas relacionadas",
    browseMarket: "Ver anuncios en Melbourne",
    allRegions: "Todas las regiones de Melbourne",
    otherRegions: "Otras regiones de Melbourne",
  },
};

export function generateStaticParams() {
  const segments = Object.keys(LOCALE_SEGMENT_TO_CODE);
  return segments.flatMap((locale) => REGION_SLUGS.map((region) => ({ locale, region })));
}

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateMetadata({ params }: RegionParams): Promise<Metadata> {
  const { locale: seg, region: slug } = await params;
  const locale = localeFromSegment(seg) ?? DEFAULT_LOCALE;
  const region = getRegion(slug);
  if (!region) return {};

  const path = `/melbourne-suburbs/${region.slug}`;
  const name = region.names[locale];
  const c = COPY[locale];
  const examples = region.suburbs.slice(0, 4).join(", ");
  const title = c.metaTitle(name);
  const description = c.metaDesc(name, region.suburbs.length, examples);

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: toLocalePath(path, locale),
      languages: localizedAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl().replace(/\/$/, "")}${toLocalePath(path, locale)}`,
      type: "website",
      siteName: "PopOut Market",
      images: [OG_IMAGE],
    },
  };
}

export default async function MelbourneRegionPage({ params }: RegionParams) {
  const { locale: seg, region: slug } = await params;
  const locale = localeFromSegment(seg) ?? DEFAULT_LOCALE;
  const region = getRegion(slug);
  if (!region) notFound();

  const name = region.names[locale];
  const c = COPY[locale];
  const count = region.suburbs.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.metaTitle(name),
    description: c.intro(name, count),
    about: {
      "@type": "Place",
      name: `${region.names.en}, Melbourne`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Melbourne",
        addressRegion: "VIC",
        addressCountry: "AU",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: count,
      itemListElement: region.suburbs.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${s}, Melbourne`,
      })),
    },
  };

  const otherRegions = MELBOURNE_REGIONS.filter((r) => r.slug !== region.slug);

  return (
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
        <Link
          href={toLocalePath(HUB_PATH, locale)}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          ← {c.allRegions}
        </Link>

        <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {c.h1(name)}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{c.intro(name, count)}</p>

        <section className="mt-8 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.coveredHeading(name)}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {c.coveredNote} {c.guideLinkedNote}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {region.suburbs.map((suburb) => {
              const pagePath = EXISTING_SUBURB_PAGES[suburb];
              return (
                <li key={suburb}>
                  {pagePath ? (
                    <Link
                      href={toLocalePath(pagePath, locale)}
                      className="inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:border-brand-400"
                    >
                      {suburb}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center rounded-lg border border-black/5 bg-gray-50 px-3 py-1.5 text-sm text-gray-700">
                      {suburb}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.otherRegions}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {otherRegions.map((r) => (
              <Link
                key={r.slug}
                href={toLocalePath(`/melbourne-suburbs/${r.slug}`, locale)}
                className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
              >
                {r.names[locale]}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.relatedHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={toLocalePath("/market", locale)}
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              {c.browseMarket}
            </Link>
            <Link
              href={toLocalePath(HUB_PATH, locale)}
              className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
            >
              {c.allRegions}
            </Link>
          </div>
        </section>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
