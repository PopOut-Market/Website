export type Locale =
  | "en"
  | "zh-Hans"
  | "zh-Hant"
  | "ko"
  | "ja"
  | "vi"
  | "fr"
  | "es";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "zh-Hans", label: "简体中文" },
  { code: "zh-Hant", label: "繁體中文" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

export const LANGUAGE_LIBRARY: {
  code: Locale;
  display: string;
  native: string;
  short: string;
}[] = [
  { code: "en", display: "English", native: "English", short: "EN" },
  { code: "zh-Hans", display: "简体中文", native: "Simplified Chinese", short: "ZH-CN" },
  { code: "zh-Hant", display: "繁體中文", native: "Traditional Chinese", short: "ZH-TW" },
  { code: "ko", display: "한국어", native: "Korean", short: "KO" },
  { code: "ja", display: "日本語", native: "Japanese", short: "JA" },
  { code: "vi", display: "Tiếng Việt", native: "Vietnamese", short: "VI" },
  { code: "fr", display: "Français", native: "French", short: "FR" },
  { code: "es", display: "Español", native: "Spanish", short: "ES" },
];

export type SiteCopy = {
  topDownload: string;
  topLanguage: string;
  languageModalTitle: string;
  languageModalHint: string;
  heroSecondaryPrefix: string;
  heroSecondaryLink: string;
  downloadLine: string;
  slogan: string;
  ratingAria: string;
  homeAria: string;
  appStoreAlt: string;
  googlePlayAlt: string;
};

export const COPY: Record<Locale, SiteCopy> = {
  en: {
    topDownload: "Download",
    topLanguage: "Language",
    languageModalTitle: "Choose your language",
    languageModalHint: "Popout supports local communities in multiple languages.",
    heroSecondaryPrefix: "Buy and sell second-hand items nearby, in",
    heroSecondaryLink: "your language",
    downloadLine: "Download the Popout Market app for iOS or Android",
    slogan: "buy and sell with people around you",
    ratingAria: "Rating 4.5 out of 5 stars",
    homeAria: "Popout home",
    appStoreAlt: "Download on the App Store",
    googlePlayAlt: "Get it on Google Play",
  },
  "zh-Hans": {
    topDownload: "下载",
    topLanguage: "语言",
    languageModalTitle: "选择你的语言",
    languageModalHint: "Popout 以多语言连接本地社区。",
    heroSecondaryPrefix: "用你的语言，在附近买卖二手好物，点击",
    heroSecondaryLink: "你的语言",
    downloadLine: "下载 Popout Market 应用，支持 iOS 和 Android",
    slogan: "与身边的人轻松买卖",
    ratingAria: "评分 4.5（满分 5 分）",
    homeAria: "Popout 首页",
    appStoreAlt: "在 App Store 下载",
    googlePlayAlt: "在 Google Play 获取",
  },
  "zh-Hant": {
    topDownload: "下載",
    topLanguage: "語言",
    languageModalTitle: "選擇你的語言",
    languageModalHint: "Popout 以多語言連結在地社群。",
    heroSecondaryPrefix: "用你的語言，在附近買賣二手好物，點擊",
    heroSecondaryLink: "你的語言",
    downloadLine: "下載 Popout Market 應用，支援 iOS 與 Android",
    slogan: "與身邊的人輕鬆買賣",
    ratingAria: "評分 4.5（滿分 5 分）",
    homeAria: "Popout 首頁",
    appStoreAlt: "在 App Store 下載",
    googlePlayAlt: "在 Google Play 取得",
  },
  ko: {
    topDownload: "다운로드",
    topLanguage: "언어",
    languageModalTitle: "언어 선택",
    languageModalHint: "Popout은 다양한 언어로 지역 커뮤니티를 연결합니다.",
    heroSecondaryPrefix: "내 주변에서 중고 거래를,",
    heroSecondaryLink: "내 언어로",
    downloadLine: "iOS 및 Android용 Popout Market 앱을 다운로드하세요",
    slogan: "주변 사람들과 쉽고 빠르게 거래하세요",
    ratingAria: "별점 5점 만점에 4.5점",
    homeAria: "Popout 홈",
    appStoreAlt: "App Store에서 다운로드",
    googlePlayAlt: "Google Play에서 다운로드",
  },
  ja: {
    topDownload: "ダウンロード",
    topLanguage: "言語",
    languageModalTitle: "言語を選択",
    languageModalHint: "Popout は多言語で地域コミュニティをつなぎます。",
    heroSecondaryPrefix: "近くの人と中古品を売り買い、",
    heroSecondaryLink: "あなたの言語で",
    downloadLine: "iOS / Android 向け Popout Market アプリをダウンロード",
    slogan: "近くの人と手軽に売り買いしよう",
    ratingAria: "評価は 5 点中 4.5",
    homeAria: "Popout ホーム",
    appStoreAlt: "App Storeでダウンロード",
    googlePlayAlt: "Google Playで手に入れよう",
  },
  vi: {
    topDownload: "Tải xuống",
    topLanguage: "Ngôn ngữ",
    languageModalTitle: "Chọn ngôn ngữ của bạn",
    languageModalHint: "Popout hỗ trợ cộng đồng địa phương với nhiều ngôn ngữ.",
    heroSecondaryPrefix: "Mua bán đồ cũ quanh bạn, bằng",
    heroSecondaryLink: "ngôn ngữ của bạn",
    downloadLine: "Tải ứng dụng Popout Market cho iOS và Android",
    slogan: "mua và bán với những người xung quanh bạn",
    ratingAria: "Đánh giá 4.5 trên 5 sao",
    homeAria: "Trang chủ Popout",
    appStoreAlt: "Tải trên App Store",
    googlePlayAlt: "Tải trên Google Play",
  },
  fr: {
    topDownload: "Télécharger",
    topLanguage: "Langue",
    languageModalTitle: "Choisissez votre langue",
    languageModalHint: "Popout soutient les communautés locales en plusieurs langues.",
    heroSecondaryPrefix: "Achetez et vendez d'occasion près de vous, dans",
    heroSecondaryLink: "votre langue",
    downloadLine: "Téléchargez l'application Popout Market pour iOS et Android",
    slogan: "achetez et vendez avec les personnes autour de vous",
    ratingAria: "Note de 4,5 sur 5 étoiles",
    homeAria: "Accueil Popout",
    appStoreAlt: "Télécharger sur l'App Store",
    googlePlayAlt: "Obtenir sur Google Play",
  },
  es: {
    topDownload: "Descargar",
    topLanguage: "Idioma",
    languageModalTitle: "Elige tu idioma",
    languageModalHint: "Popout conecta comunidades locales en varios idiomas.",
    heroSecondaryPrefix: "Compra y vende artículos de segunda mano cerca de ti, en",
    heroSecondaryLink: "tu idioma",
    downloadLine: "Descarga la app Popout Market para iOS y Android",
    slogan: "compra y vende con personas cerca de ti",
    ratingAria: "Valoración de 4,5 de 5 estrellas",
    homeAria: "Inicio de Popout",
    appStoreAlt: "Descargar en App Store",
    googlePlayAlt: "Consíguelo en Google Play",
  },
};
