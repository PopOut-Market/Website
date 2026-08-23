import type { Locale } from "@/lib/site-i18n";

/**
 * Copy for the Melbourne CBD Asian grocery guide.
 *
 * ## Why only four locales
 *
 * This page is mostly authored prose — a disclosure notice whose legal meaning
 * has to survive translation, and editorial about what the page deliberately
 * does not contain. Machine-translating that into four more languages would be
 * worse than not shipping it: Google's scaled-content-abuse policy names
 * "automated transformations like ... translating" explicitly, and an English
 * body under a Japanese title is the exact defect this site is fixing elsewhere.
 *
 * Data pages ship in all eight locales because the database has already
 * translated the data. Prose pages ship where the prose exists. These four were
 * chosen on demand: the Korean-language Melbourne SERP was the weakest found in
 * the whole audit, and the Chinese-language one is close behind.
 *
 * Adding a locale means writing every string below and adding it to
 * `GUIDE_LOCALES` — nothing else. `localizedAlternatesFor` reads that list, so
 * hreflang can never advertise a locale that does not exist.
 */

/** Locales this page actually ships in. Order is the hreflang order. */
export const GUIDE_LOCALES = ["en", "zh-Hans", "zh-Hant", "ko"] as const;

export type GuideLocale = (typeof GUIDE_LOCALES)[number];

export function isGuideLocale(locale: Locale): locale is GuideLocale {
  return (GUIDE_LOCALES as readonly string[]).includes(locale);
}

type GuideCopy = {
  title: string;
  description: string;
  h1: string;
  /** Carries {n} and {suburbList}. */
  intro: string;
  /** Paragraphs separated by a blank line. */
  disclosure: string;
  shopKindLabel: string;
  listLabel: string;
  orderingNote: string;
  photoCredit: string;
  /** Carries {email}. */
  correctionsBody: string;
  inAppBody: string;
  headings: {
    shopList: string;
    elsewhere: string;
    whatsMissing: string;
    aboutThisList: string;
    shopOwners: string;
    inApp: string;
    relatedLinks: string;
  };
  related: { cbd: string; docklands: string; market: string };
};

export const GUIDE_COPY: Record<GuideLocale, GuideCopy> = {
  en: {
    title: "Asian grocery stores and supermarkets in Melbourne CBD | PopOut Market",
    description:
      "The independent Asian grocery stores in PopOut Market’s Melbourne CBD shop directory — each one’s name, street address and shopfront photograph. No prices, no ratings, no rankings.",
    h1: "Independent Asian grocery stores in Melbourne CBD",
    intro:
      "PopOut Market’s shop directory lists {n} independent Asian grocery stores in {suburbList}. Here is each one, with its street address and a photograph of its shopfront taken from the street.",
    disclosure:
      "PopOut Market is independent. We are not affiliated with, endorsed by, or connected to any shop on this page, and no shop has paid to be included.\n\nThese are the independent Asian grocery stores in PopOut Market’s own shop directory for Melbourne CBD. It is not a list of every Asian grocery store in the city, and it is not a ranking.\n\nEach shop’s name and street address are read live from that directory every time this page is served. This page does not show prices. Shops move, change hands and close, so please check with the shop before you travel.",
    shopKindLabel: "Asian grocery store",
    listLabel: "{n} shops in PopOut Market's Melbourne CBD directory",
    orderingNote: "Listed alphabetically within each street. This is not a ranking.",
    photoCredit: "Photographs taken from the street by PopOut Market.",
    correctionsBody:
      "Names and addresses are read live from PopOut Market's shop directory. If something here is wrong, or you run one of these shops and would rather not be listed, email {email} and we will correct or remove it.",
    inAppBody:
      "Inside PopOut Market these shops appear as pins on a map you open from the Community feed. Neighbours walk them, post what they find, and the product name and price are written on the photo and translated into every language the app speaks. Those posts stay in the app.",
    headings: {
      shopList: "The shops, street by street",
      elsewhere: "Elsewhere in the CBD",
      whatsMissing: "What this page doesn’t have, and why",
      aboutThisList: "About this list",
      shopOwners: "If you own or run one of these shops",
      inApp: "These shops on the map in PopOut Market",
      relatedLinks: "Related pages",
    },
    related: {
      cbd: "Second-hand in Melbourne CBD",
      docklands: "Second-hand in Docklands",
      market: "Browse the marketplace",
    },
  },
  "zh-Hans": {
    title: "墨尔本 CBD 的亚洲超市与亚洲食品店 | PopOut Market",
    description:
      "PopOut Market 墨尔本 CBD 店铺目录中独立经营的亚洲超市：每一家的店名、街道地址，以及我们在街边拍下的店面照片。不含价格、评分和排名。",
    h1: "墨尔本 CBD 独立经营的亚洲超市",
    intro:
      "本页列出 PopOut Market 店铺目录中位于 {suburbList} 的 {n} 家独立经营的亚洲超市，并给出每一家的店名、街道地址，以及 PopOut Market 在街边拍下的店面照片。店名和地址在你打开页面时从目录实时读取，本页不显示价格。",
    disclosure:
      "PopOut Market 是独立运营的。我们与本页出现的任何店铺都没有从属、合作或获得其认可的关系，也没有任何一家店铺付费出现在这里。\n\n本页列出的，是 PopOut Market 自有店铺目录中位于墨尔本 CBD、独立经营的亚洲超市。它并不是墨尔本 CBD 所有亚洲超市的完整名录，也不是排行榜。\n\n每一家的店名和街道地址都是从这份目录实时读取的，目录本页不显示价格。店铺会搬迁、转手或结业，出门前请先与店家确认。",
    shopKindLabel: "亚洲超市",
    listLabel: "PopOut Market 墨尔本 CBD 商铺名录中的 {n} 家店铺",
    orderingNote: "同一条街内按字母顺序排列。这不是排名。",
    photoCredit: "照片由 PopOut Market 在街边拍摄。",
    correctionsBody:
      "店名和地址实时读取自 PopOut Market 的商铺名录。如果这里有错误，或者你是其中一家店的经营者、不希望被列出，请发邮件到 {email}，我们会更正或移除。",
    inAppBody:
      "在 PopOut Market 里，这些店铺是社区（Community）版块里那张地图上的一个个图钉。邻居们逛完店把发现发上来，商品名和价格直接写在照片上，并翻译成 App 支持的每一种语言。那些帖子只在 App 内。",
    headings: {
      shopList: "店铺列表（按街道分组）",
      elsewhere: "CBD 内的其他街道",
      whatsMissing: "这个页面没有的信息，以及为什么",
      aboutThisList: "关于这份列表",
      shopOwners: "如果你是这些店铺的老板或经营者",
      inApp: "在 PopOut 的地图上找到这些店铺",
      relatedLinks: "相关页面",
    },
    related: {
      cbd: "墨尔本 CBD 二手",
      docklands: "Docklands 二手",
      market: "浏览二手市场",
    },
  },
  "zh-Hant": {
    title: "墨爾本 CBD 的亞洲超市與雜貨店 | PopOut Market",
    description:
      "PopOut Market 墨爾本 CBD 店家名錄中的獨立亞洲超市：名錄裡每一家的店名、街道地址，以及店門口實拍照片。不列價格，沒有評分，也不做排名。",
    h1: "墨爾本 CBD 獨立經營的亞洲超市",
    intro:
      "這是 PopOut Market 店家名錄中位於 {suburbList} 的 {n} 家獨立經營亞洲超市。名錄裡每一家都附上街道地址，以及由 PopOut Market 從街上拍下的店門口照片。",
    disclosure:
      "PopOut Market 為獨立營運。本頁列出的店家與我們沒有任何從屬、背書或合作關係，也沒有任何一家店付費登上這一頁。\n\n以下是 PopOut Market 自有店家名錄中，位於墨爾本 CBD 的獨立經營亞洲超市。這不是市區內亞洲超市的完整名單，也不是排行榜。\n\n每一家的店名與街道地址都是每次開啟本頁時即時讀自該名錄。本頁不顯示價格。店家會搬遷、易主或結束營業，出發前請先向店家確認。",
    shopKindLabel: "亞洲超市",
    listLabel: "PopOut Market 墨爾本 CBD 店家名錄中的 {n} 家店",
    orderingNote: "同一條街內依英文字母順序排列。這不是排名。",
    photoCredit: "照片由 PopOut Market 在街上拍攝。",
    correctionsBody:
      "店名與地址即時讀取自 PopOut Market 的店家名錄。如果這裡有任何錯誤，或你經營其中一家店、不希望被列出，請寄信到 {email}，我們會更正或移除。",
    inAppBody:
      "在 PopOut Market 裡，這些店家是社群（Community）版塊那張地圖上的一個個圖釘。鄰居逛完店把發現發上來，商品名與價格直接寫在照片上，並翻譯成 App 支援的每一種語言。那些貼文只留在 App 內。",
    headings: {
      shopList: "名錄中的店家，依街道排列",
      elsewhere: "CBD 其他地點",
      whatsMissing: "這一頁沒有哪些資訊，以及為什麼",
      aboutThisList: "關於這份名單",
      shopOwners: "如果你是這些店家的老闆或經營者",
      inApp: "這些店家，就在 PopOut 的地圖上",
      relatedLinks: "相關頁面",
    },
    related: {
      cbd: "墨爾本 CBD 二手",
      docklands: "Docklands 二手",
      market: "瀏覽二手市場",
    },
  },
  ko: {
    title: "멜버른 CBD 아시안 식료품점과 마트 | PopOut Market",
    description:
      "PopOut Market의 멜버른 CBD 가게 목록에 있는 개인 운영 아시안 식료품점 — 이름, 도로명 주소, 직접 찍은 가게 외관 사진. 가격도 평점도 순위도 없습니다.",
    h1: "멜버른 CBD의 개인 운영 아시안 식료품점",
    intro:
      "PopOut Market의 {suburbList} 가게 목록에서, 개인이 운영하는 아시안 식료품점 {n}곳을 모았습니다. 가게마다 도로명 주소와 저희가 길에서 직접 찍은 가게 외관 사진을 함께 실었습니다. ",
    disclosure:
      "PopOut Market은 독립적으로 운영됩니다. 이 페이지에 실린 어느 가게와도 제휴 관계나 후원 관계가 없고, 어떤 형태로도 연결되어 있지 않습니다. 어느 가게도 이 목록에 실리기 위해 비용을 낸 적이 없습니다.\n\n여기 실린 가게는 PopOut Market에서 직접 정리한 멜버른 CBD 가게 목록에 있는, 개인이 운영하는 아시안 식료품점입니다. 이 도시의 아시안 식료품점을 빠짐없이 담은 목록이 아니며, 순위를 매긴 것도 아닙니다.\n\n가게 이름과 도로명 주소는 이 페이지를 열 때마다 그 목록에서 실시간으로 읽어 옵니다. 이 페이지에는 가격이 없습니다. 가게는 자리를 옮기기도 하고 주인이 바뀌거나 문을 닫기도 하니, 찾아가기 전에 가게에 미리 확인해 보세요.",
    shopKindLabel: "아시안 식료품점",
    listLabel: "PopOut Market 멜버른 CBD 가게 목록의 {n}곳",
    orderingNote: "같은 거리 안에서는 알파벳순으로 정렬했습니다. 순위가 아닙니다.",
    photoCredit: "PopOut Market이 길에서 찍은 사진입니다.",
    correctionsBody:
      "가게 이름과 주소는 PopOut Market 가게 목록에서 실시간으로 가져옵니다. 잘못된 내용이 있거나, 이 가게들 중 한 곳을 운영하시면서 목록에 실리기를 원하지 않으시면 {email}로 메일을 보내 주세요. 수정하거나 삭제하겠습니다.",
    inAppBody:
      "PopOut Market 안에서는 이 가게들이 커뮤니티 피드에서 여는 지도 위의 핀으로 나타납니다. 이웃들이 직접 다녀와서 발견한 것을 올리고, 상품 이름과 가격은 사진 위에 적혀 앱이 지원하는 모든 언어로 번역됩니다. 그 글들은 앱 안에만 있습니다.",
    headings: {
      shopList: "거리별 가게 목록",
      elsewhere: "그 밖의 CBD 주소",
      whatsMissing: "이 페이지에 없는 것, 그리고 그 이유",
      aboutThisList: "이 목록에 대하여",
      shopOwners: "이 가게를 운영하고 계신다면",
      inApp: "PopOut 앱의 동네 가게 지도",
      relatedLinks: "함께 보면 좋은 페이지",
    },
    related: {
      cbd: "멜버른 CBD 중고거래",
      docklands: "Docklands 중고거래",
      market: "중고 마켓 둘러보기",
    },
  },
};
