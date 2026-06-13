import { ComparisonHubContent } from "@/components/comparison-hub-content";
import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { getServerLocale } from "@/lib/server-locale";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";

const PATH = "/comparison";

// Column headers are product names (proper nouns) — same across locales.
const APPS = ["PopOut Market", "Gumtree", "Facebook Marketplace", "Carousell"];

type Row = { feature: string; values: string[] };
type Content = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  inLanguage: string;
  featureHeader: string;
  rows: Row[];
  faqHeading: string;
  faq: { q: string; a: string }[];
};

const CONTENT: Partial<Record<Locale, Content>> & { en: Content } = {
    "zh-Hant": {"title":"墨爾本二手 App 比較 | PopOut Market vs Gumtree vs Facebook Marketplace","description":"一張表看懂墨爾本二手 App 怎麼選:PopOut Market 對比 Gumtree、Facebook Marketplace、Carousell(旋轉拍賣)——涵蓋範圍、同城發現方式、多語言、安全與費用,適合墨爾本留學生與搬家族二手買賣。","h1":"墨爾本二手 App 比較","intro":"在墨爾本不知道該用哪個 App 做二手買賣?以下把 PopOut Market 與主要替代品——Gumtree、Facebook Marketplace、Carousell(旋轉拍賣)——按幾個決定同城二手交易能否順利成交的關鍵維度並排比較,涵蓋墨爾本二手家具、二手電器與留學生轉手的常見需求。","inLanguage":"zh-TW","featureHeader":"比較項目","rows":[{"feature":"定位 / 涵蓋範圍","values":["墨爾本在地,以社區(suburb)為主","全澳分類廣告","全球,在地+寄送","以亞洲為主,澳洲較少"]},{"feature":"發現方式","values":["優先顯示鄰近社區的物品","依分類與地區搜尋","演算法資訊流+地區","依分類與地區"]},{"feature":"多語言聊天","values":["內建聊天+翻譯","無內建","有限","有限"]},{"feature":"更安全的當面交易","values":["引導式安全見面流程","基本","基本","基本"]},{"feature":"費用","values":["免費","免費+付費推廣","免費","免費+付費置頂"]},{"feature":"最適合","values":["墨爾本留學生、租屋族、搬家族","全澳綜合分類廣告","廣泛的在地隨手賣","亞洲市場買家"]}],"faqHeading":"常見問題","faq":[{"q":"墨爾本哪個二手 App 最好用?","a":"要看你重視什麼。若想要在地、以社區為主的同城二手交易,加上多語言聊天和更安全的當面交易,PopOut Market 是專為墨爾本打造的二手平台。Gumtree 與 Facebook Marketplace 規模更大、更綜合,Carousell(旋轉拍賣)則主要在亞洲市場使用。"},{"q":"墨爾本有什麼免費替代 Gumtree、Facebook Marketplace 的二手平台?","a":"PopOut Market 是免費、在地優先的選擇,專注墨爾本:依社區顯示物品、內建多語言聊天、引導更安全的當面交易,而不是無止盡的全州資訊流,適合二手家具、二手電器等同城二手買賣。"},{"q":"墨爾本留學生賣二手家具、二手電器用哪個 App 比較方便?","a":"PopOut Market 在墨爾本留學生、租屋族與搬家族中很受歡迎。你可以從鄰近社區尋找物品,用翻譯聊天減少語言隔閡,並依安全當面交易流程完成二手物品的交收。"},{"q":"PopOut Market 真的免費嗎?","a":"是的。在 PopOut Market 上架與購買都免費,不收上架費。"}]},
    "ja": {"title":"メルボルン 中古アプリ比較 | PopOut Market vs Gumtree vs Facebook Marketplace","description":"メルボルンの中古売買アプリを一目で比較。PopOut Market と Gumtree、Facebook Marketplace、Carousell を、対応エリア・探しやすさ・多言語対応・安全性・手数料の観点で整理しました。","h1":"メルボルンの中古アプリ比較","intro":"メルボルンで中古品をどのアプリで売買するか迷っていませんか?PopOut Market と主な代替アプリ——Gumtree、Facebook Marketplace、Carousell——を、地元での取引が実際にスムーズに成立するかどうかを左右するポイントで並べて比較しました。留学生や賃貸・引っ越しユーザーの不用品売買にも役立ちます。","inLanguage":"ja","featureHeader":"比較項目","rows":[{"feature":"対象 / 対応エリア","values":["メルボルン地域に特化、サバーブ単位","オーストラリア全国の分類広告","世界規模、地元取引+配送","アジア中心、豪州での利用は限定的"]},{"feature":"探し方","values":["近所のサバーブの出品を優先表示","カテゴリ・地域から検索","アルゴリズムによるフィード+地域","カテゴリ・地域から検索"]},{"feature":"多言語チャット","values":["アプリ内チャット+翻訳機能","標準では非対応","限定的","限定的"]},{"feature":"より安全な手渡し","values":["ガイド付きの安全な直接取引フロー","基本的な機能のみ","基本的な機能のみ","基本的な機能のみ"]},{"feature":"手数料","values":["無料","無料+有料プロモーション","無料","無料+有料ブースト"]},{"feature":"向いている人","values":["メルボルンの留学生・賃貸・引っ越し層","豪州全国の総合的な分類広告利用者","気軽な地元での売買全般","アジア市場の買い手"]}],"faqHeading":"よくある質問","faq":[{"q":"メルボルンの中古アプリはどれが一番いい?","a":"何を重視するかによります。サバーブ単位の地元取引に加えて、多言語チャットやより安全な手渡しを求めるなら、PopOut Market はメルボルン向けに作られています。Gumtree と Facebook Marketplace はより大規模で総合的、Carousell は主にアジア市場で使われています。"},{"q":"メルボルンで Gumtree や Facebook Marketplace の無料代替になるフリマアプリは?","a":"PopOut Market は無料で地元優先の代替アプリです。メルボルンに特化し、出品をサバーブごとに表示し、アプリ内の多言語チャットに対応し、より安全な手渡しをガイドします。州全体の延々と続くフィードではありません。"},{"q":"PopOut Market は本当に無料?","a":"はい。PopOut Market は出品も購入も無料で、出品手数料はかかりません。"},{"q":"留学生がメルボルンで中古を手渡しで売買するのに使いやすいアプリは?","a":"PopOut Market はメルボルンの留学生や賃貸・引っ越しユーザーに人気です。近所のサバーブから出品を探せて、翻訳付きチャットで言葉の壁を減らし、安全な直接取引(手渡し)の流れを案内します。"}]},
  en: {
    title: "Best Second-Hand Apps in Melbourne Compared | PopOut vs Gumtree vs Facebook Marketplace",
    description:
      "An at-a-glance comparison of second-hand apps for Melbourne — PopOut Market vs Gumtree, Facebook Marketplace and Carousell — on coverage, discovery, languages, safety and fees.",
    h1: "Melbourne Second-Hand Apps Compared",
    intro:
      "Choosing where to buy and sell second-hand in Melbourne? Here is a quick, side-by-side comparison of PopOut Market and the main alternatives — Gumtree, Facebook Marketplace and Carousell — across the things that decide whether a local trade actually happens.",
    inLanguage: "en-AU",
    featureHeader: "Feature",
    rows: [
      { feature: "Focus / coverage", values: ["Local Melbourne, suburb-based", "Australia-wide classifieds", "Global, local + shipping", "Asia-focused, limited AU"] },
      { feature: "Discovery", values: ["Suburb-first nearby listings", "Category & location search", "Algorithmic feed + location", "Category & location"] },
      { feature: "Multilingual chat", values: ["Built-in chat + translation", "Not built-in", "Limited", "Limited"] },
      { feature: "Safer meetups", values: ["Guided safe-meetup flow", "Basic", "Basic", "Basic"] },
      { feature: "Fees", values: ["Free", "Free + paid promotions", "Free", "Free + paid boosts"] },
      { feature: "Best for", values: ["Melbourne students, renters, movers", "General AU classifieds", "Broad casual local selling", "Buyers in Asian markets"] },
    ],
    faqHeading: "FAQ",
    faq: [
      { q: "Which second-hand app is best in Melbourne?", a: "It depends on what you value. For local, suburb-based trading with multilingual chat and safer meetups, PopOut Market is built specifically for Melbourne. Gumtree and Facebook Marketplace are larger and more general, while Carousell is mainly used in Asian markets." },
      { q: "What is a good free alternative to Gumtree and Facebook Marketplace in Melbourne?", a: "PopOut Market is a free, local-first alternative focused on Melbourne: it shows listings by suburb, supports in-app multilingual chat, and guides a safer meetup, rather than an endless statewide feed." },
      { q: "Is PopOut Market really free?", a: "Yes. Listing and buying on PopOut Market is free, with no listing fees." },
    ],
  },
  "zh-Hans": {
    title: "墨尔本二手 App 对比 | PopOut vs Gumtree vs Facebook Marketplace 哪个好",
    description:
      "一张表看懂墨尔本二手 App 怎么选:PopOut Market 对比 Gumtree、Facebook Marketplace、Carousell——覆盖范围、发现方式、语言、安全与费用。",
    h1: "墨尔本二手 App 对比",
    intro:
      "在墨尔本不知道用哪个二手 App 买卖?下面把 PopOut Market 和主要替代品——Gumtree、Facebook Marketplace、Carousell——按几个决定能否顺利完成同城交易的关键维度并排对比一下。",
    inLanguage: "zh-CN",
    featureHeader: "对比项",
    rows: [
      { feature: "定位 / 覆盖", values: ["本地墨尔本,按社区", "全澳分类信息", "全球,本地+邮寄", "亚洲为主,澳洲较少"] },
      { feature: "发现方式", values: ["优先显示附近社区的物品", "按分类与地区搜索", "算法信息流+地区", "按分类与地区"] },
      { feature: "多语言聊天", values: ["内置聊天+翻译", "无内置", "有限", "有限"] },
      { feature: "更安全的当面交易", values: ["引导式安全见面流程", "基础", "基础", "基础"] },
      { feature: "费用", values: ["免费", "免费+付费推广", "免费", "免费+付费置顶"] },
      { feature: "最适合", values: ["墨尔本留学生、租房者、搬家人群", "全澳综合分类信息", "宽泛的本地随手卖", "亚洲市场买家"] },
    ],
    faqHeading: "常见问题",
    faq: [
      { q: "墨尔本哪个二手 App 最好用?", a: "看你更看重什么。如果要本地、按社区的同城交易,加上多语言聊天和更安全的当面交易,PopOut Market 是专为墨尔本打造的。Gumtree 和 Facebook Marketplace 更大更综合,Carousell 主要在亚洲市场使用。" },
      { q: "墨尔本有什么免费替代 Gumtree 和 Facebook Marketplace 的二手平台?", a: "PopOut Market 是免费、本地优先的替代选择,专注墨尔本:按社区显示物品、内置多语言聊天、引导更安全的当面交易,而不是无休止的全州信息流。" },
      { q: "PopOut Market 真的免费吗?", a: "是的。在 PopOut Market 发布和购买都免费,不收发布费。" },
    ],
  },
  ko: {
    title: "멜버른 중고 앱 비교 | PopOut vs Gumtree vs Facebook Marketplace 어디가 좋을까",
    description:
      "멜버른 중고 앱을 한눈에 비교 — PopOut Market vs Gumtree, Facebook Marketplace, Carousell — 범위, 탐색 방식, 언어, 안전, 비용 기준으로 정리했습니다.",
    h1: "멜버른 중고 앱 비교",
    intro:
      "멜버른에서 어디서 중고를 사고팔지 고민되시나요? PopOut Market과 주요 대안인 Gumtree, Facebook Marketplace, Carousell을 동네 거래가 실제로 성사되는지를 좌우하는 핵심 기준으로 나란히 비교했습니다.",
    inLanguage: "ko",
    featureHeader: "항목",
    rows: [
      { feature: "포커스 / 범위", values: ["멜버른 동네 기반", "호주 전역 분류 광고", "글로벌, 동네+배송", "아시아 중심, 호주 적음"] },
      { feature: "탐색 방식", values: ["주변 동네 매물 우선", "카테고리·지역 검색", "알고리즘 피드+지역", "카테고리·지역"] },
      { feature: "다국어 채팅", values: ["앱 내 채팅+번역", "기본 미지원", "제한적", "제한적"] },
      { feature: "더 안전한 직거래", values: ["가이드형 안전 만남 절차", "기본", "기본", "기본"] },
      { feature: "비용", values: ["무료", "무료+유료 홍보", "무료", "무료+유료 부스트"] },
      { feature: "가장 적합", values: ["멜버른 유학생·세입자·이사자", "호주 종합 분류 광고", "가벼운 동네 판매", "아시아 시장 구매자"] },
    ],
    faqHeading: "자주 묻는 질문",
    faq: [
      { q: "멜버른에서 어떤 중고 앱이 가장 좋나요?", a: "무엇을 중시하느냐에 따라 다릅니다. 동네 기반 거래, 다국어 채팅, 더 안전한 만남을 원한다면 PopOut Market은 멜버른에 맞춰 만들어졌습니다. Gumtree와 Facebook Marketplace는 더 크고 일반적이며, Carousell은 주로 아시아 시장에서 쓰입니다." },
      { q: "멜버른에서 Gumtree나 Facebook Marketplace를 대체할 무료 중고 플랫폼이 있나요?", a: "PopOut Market은 멜버른에 집중한 무료 동네 우선 대안입니다. 매물을 동네별로 보여주고, 앱 내 다국어 채팅을 지원하며, 더 안전한 만남을 안내합니다." },
      { q: "PopOut Market은 정말 무료인가요?", a: "네. PopOut Market은 등록과 구매 모두 무료이며 등록 수수료가 없습니다." },
    ],
  },
};

function contentFor(locale: Locale): Content {
  return CONTENT[locale] ?? CONTENT.en;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const c = contentFor(locale);
  const selfPath = toLocalePath(PATH, locale);
  return {
    title: { absolute: c.title },
    description: c.description,
    alternates: { canonical: selfPath, languages: localizedAlternates(PATH) },
    openGraph: {
      title: c.title,
      description: c.description,
      url: siteUrl().replace(/\/$/, "") + selfPath,
      type: "website",
      siteName: "PopOut Market",
    },
  };
}

export default async function ComparisonHubPage() {
  const locale = await getServerLocale();
  const c = contentFor(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: c.title,
        description: c.description,
        inLanguage: c.inLanguage,
        about: { "@type": "Thing", name: "Melbourne second-hand apps comparison" },
      },
      {
        "@type": "FAQPage",
        mainEntity: c.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <section className={SHELL_X + " flex flex-1 flex-col pt-10"}>
        <div className={INNER_MAX + " max-w-4xl"}>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            {c.h1}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-gray-700">{c.intro}</p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b border-gray-200 px-3 py-2.5 font-semibold text-gray-900">
                    {c.featureHeader}
                  </th>
                  {APPS.map((app, i) => (
                    <th
                      key={app}
                      className={
                        "border-b border-gray-200 px-3 py-2.5 font-semibold " +
                        (i === 0 ? "bg-brand-tint text-brand-700" : "text-gray-900")
                      }
                    >
                      {app}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row) => (
                  <tr key={row.feature} className="align-top">
                    <th
                      scope="row"
                      className="border-b border-gray-100 px-3 py-2.5 text-left font-semibold text-gray-900"
                    >
                      {row.feature}
                    </th>
                    {row.values.map((v, i) => (
                      <td
                        key={i}
                        className={
                          "border-b border-gray-100 px-3 py-2.5 text-gray-700 " +
                          (i === 0 ? "bg-brand-tint/40 font-medium text-gray-900" : "")
                        }
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">{c.faqHeading}</h2>
            <div className="mt-4 space-y-4">
              {c.faq.map((item) => (
                <article key={item.q} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <ComparisonHubContent />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
