import type { MarketProduct } from "@/lib/market-product";
import type { Locale } from "@/lib/site-i18n";

const TITLE_PARTS: Record<Locale, readonly string[]> = {
  en: [
    "Desk lamp",
    "Ceramic mug",
    "Road bike",
    "Study chair",
    "Wireless earbuds",
    "Coffee grinder",
    "Vintage jacket",
    "Board game set",
    "LED desk strip",
    "Leather wallet",
    "Mini tripod",
    "Camping mat",
  ],
  "zh-Hans": [
    "台灯",
    "陶瓷杯",
    "公路车",
    "学习椅",
    "无线耳机",
    "磨豆机",
    "复古夹克",
    "桌游套装",
    "桌边灯带",
    "皮质钱包",
    "迷你三脚架",
    "露营垫",
  ],
  "zh-Hant": [
    "檯燈",
    "陶瓷杯",
    "公路車",
    "讀書椅",
    "無線耳機",
    "磨豆機",
    "復古夾克",
    "桌遊套組",
    "桌邊燈帶",
    "皮質錢包",
    "迷你腳架",
    "露營墊",
  ],
  ko: [
    "데스크 램프",
    "도자기 머그",
    "로드 바이크",
    "공부 의자",
    "무선 이어버드",
    "커피 그라인더",
    "빈티지 재킷",
    "보드게임 세트",
    "LED 스트립",
    "가죽 지갑",
    "미니 삼각대",
    "캠핑 매트",
  ],
  ja: [
    "デスクライト",
    "陶器マグ",
    "ロードバイク",
    "学習椅子",
    "ワイヤレスイヤホン",
    "コーヒーミル",
    "ヴィンテージジャケット",
    "ボードゲームセット",
    "LEDテープ",
    "革財布",
    "ミニ三脚",
    "キャンプマット",
  ],
  vi: [
    "Đèn bàn",
    "Cốc gốm",
    "Xe đạp đường trường",
    "Ghế học",
    "Tai nghe không dây",
    "Máy xay cà phê",
    "Áo khoác vintage",
    "Bộ board game",
    "Dải LED",
    "Ví da",
    "Chân máy mini",
    "Tấm cắm trại",
  ],
  fr: [
    "Lampe de bureau",
    "Mug en céramique",
    "Vélo de route",
    "Chaise d’étude",
    "Écouteurs sans fil",
    "Moulin à café",
    "Veste vintage",
    "Jeu de société",
    "Bandeau LED",
    "Portefeuille en cuir",
    "Mini trépied",
    "Tapis de camping",
  ],
  es: [
    "Lámpara de escritorio",
    "Taza de cerámica",
    "Bicicleta de carretera",
    "Silla de estudio",
    "Auriculares inalámbricos",
    "Molinillo de café",
    "Chaqueta vintage",
    "Juego de mesa",
    "Tira LED",
    "Cartera de cuero",
    "Mini trípode",
    "Esterilla de camping",
  ],
};

const NUMBER_LOCALE: Record<Locale, string> = {
  en: "en-AU",
  "zh-Hans": "zh-CN",
  "zh-Hant": "zh-TW",
  ko: "ko-KR",
  ja: "ja-JP",
  vi: "vi-VN",
  fr: "fr-FR",
  es: "es-ES",
};

function pickTitle(locale: Locale, index: number): string {
  const parts = TITLE_PARTS[locale];
  const a = parts[index % parts.length]!;
  let b = parts[(index * 7 + 3) % parts.length]!;
  if (b === a) {
    b = parts[(index * 7 + 4) % parts.length]!;
  }
  return `${a} · ${b}`;
}

function formatAud(locale: Locale, cents: number): string {
  return new Intl.NumberFormat(NUMBER_LOCALE[locale], {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Deterministic demo feed (30 items). */
export function createMockMarketProducts(
  locale: Locale,
  sellerPrefix: string,
  kmSuffix: string,
): MarketProduct[] {
  return Array.from({ length: 30 }, (_, i) => {
    const cents = 1_200 + ((i * 437) % 380) * 100 + (i * 61) % 9700;
    const km = 0.4 + ((i * 19) % 87) / 10;
    const distanceLabel = `${km.toFixed(1)} ${kmSuffix}`;
    return {
      id: `demo-${i + 1}`,
      title: pickTitle(locale, i),
      priceLabel: formatAud(locale, cents),
      distanceLabel,
      sellerLabel: `${sellerPrefix} ${(i % 9) + 1}`,
      isNew: i % 5 === 0,
      imageUrl: null,
    };
  });
}
