import type { Locale } from "./site-i18n";

type DownloadCopy = {
  title: string;
  summary: string;
  heading: string;
  intro: string;
  iphone: string;
  android: string;
  scan: string;
  scanHelp: string;
  browserHelp: string;
  language: string;
  qrAlt: string;
};

export const downloadCopy: Record<Locale, DownloadCopy> = {
  en: {
    title: "PopOut · Good finds nearby",
    summary: "Second-hand finds, rooms and local deals.",
    heading: "Get PopOut",
    intro: "Buy and sell second-hand, find a room and discover deals in your neighbourhood.",
    iphone: "Download for iPhone",
    android: "Download for Android",
    scan: "Take it to your phone",
    scanHelp: "Open your phone camera and scan to choose your app store.",
    browserHelp: "If the store doesn’t open, try this page in Safari or Chrome.",
    language: "Language",
    qrAlt: "QR code for the English download page",
  },
  "zh-Hans": {
    title: "PopOut · 发现附近的好东西",
    summary: "逛二手、找房间、看看附近有什么优惠。",
    heading: "下载 PopOut",
    intro: "在附近买卖闲置、找房间，也能发现街区里的优惠。",
    iphone: "下载 iPhone 版",
    android: "下载 Android 版",
    scan: "用手机扫码下载",
    scanHelp: "打开手机相机扫码，然后选择应用商店。",
    browserHelp: "如果应用商店没有打开，可用 Safari 或 Chrome 打开此页。",
    language: "语言",
    qrAlt: "简体中文下载页二维码",
  },
  "zh-Hant": {
    title: "PopOut · 發現附近的好東西",
    summary: "逛二手、找房間、看看附近有哪些優惠。",
    heading: "下載 PopOut",
    intro: "在附近買賣二手物品、找房間，也能發現街區裡的優惠。",
    iphone: "下載 iPhone 版",
    android: "下載 Android 版",
    scan: "用手機掃碼下載",
    scanHelp: "開啟手機相機掃碼，再選擇應用程式商店。",
    browserHelp: "如果商店沒有開啟，可以用 Safari 或 Chrome 開啟此頁。",
    language: "語言",
    qrAlt: "繁體中文下載頁 QR Code",
  },
  ko: {
    title: "PopOut · 우리 동네 둘러보기",
    summary: "가까운 중고 물건부터 빈방과 동네 할인까지.",
    heading: "PopOut 다운로드",
    intro: "우리 동네에서 중고 물건을 사고팔고, 빈방과 가까운 가게의 할인 소식을 찾아보세요.",
    iphone: "iPhone용 다운로드",
    android: "Android용 다운로드",
    scan: "휴대폰으로 다운로드",
    scanHelp: "휴대폰 카메라로 QR 코드를 스캔한 뒤 앱 스토어를 선택하세요.",
    browserHelp: "스토어가 열리지 않으면 Safari나 Chrome에서 이 페이지를 열어 보세요.",
    language: "언어",
    qrAlt: "한국어 다운로드 페이지 QR 코드",
  },
  ja: {
    title: "PopOut · 近くで見つけよう",
    summary: "近所で中古品や部屋、お得な情報を探せます。",
    heading: "PopOut をダウンロード",
    intro: "近所で中古品を売買したり、部屋やお店のお得な情報を探したりできます。",
    iphone: "iPhone 版を入手",
    android: "Android 版を入手",
    scan: "スマートフォンでダウンロード",
    scanHelp: "スマートフォンのカメラでコードを読み取り、ストアを選んでください。",
    browserHelp: "ストアが開かない場合は Safari または Chrome でこのページを開いてください。",
    language: "言語",
    qrAlt: "日本語のダウンロードページの QR コード",
  },
  vi: {
    title: "PopOut · Khám phá quanh bạn",
    summary: "Tìm đồ cũ, phòng cho thuê và ưu đãi gần nhà.",
    heading: "Tải PopOut",
    intro: "Mua bán đồ cũ, tìm phòng và khám phá ưu đãi ở các cửa hàng quanh bạn.",
    iphone: "Tải cho iPhone",
    android: "Tải cho Android",
    scan: "Tải về điện thoại",
    scanHelp: "Mở camera điện thoại, quét mã rồi chọn cửa hàng ứng dụng.",
    browserHelp: "Nếu cửa hàng không mở, hãy mở trang này trong Safari hoặc Chrome.",
    language: "Ngôn ngữ",
    qrAlt: "Mã QR dẫn tới trang tải bằng tiếng Việt",
  },
  fr: {
    title: "PopOut · Les trouvailles du quartier",
    summary: "Objets d’occasion, chambres à louer et bons plans près de chez vous.",
    heading: "Télécharger PopOut",
    intro:
      "Achetez et vendez d’occasion, trouvez une chambre et profitez des offres de votre quartier.",
    iphone: "Télécharger pour iPhone",
    android: "Télécharger pour Android",
    scan: "Sur votre téléphone",
    scanHelp:
      "Scannez ce code avec l’appareil photo de votre téléphone, puis choisissez votre boutique.",
    browserHelp: "Si la boutique ne s’ouvre pas, ouvrez cette page dans Safari ou Chrome.",
    language: "Langue",
    qrAlt: "Code QR de la page de téléchargement en français",
  },
  es: {
    title: "PopOut · Descubre tu barrio",
    summary: "Encuentra artículos de segunda mano, habitaciones y ofertas cerca.",
    heading: "Descarga PopOut",
    intro: "Compra y vende de segunda mano, busca habitación y descubre ofertas en tu barrio.",
    iphone: "Descargar para iPhone",
    android: "Descargar para Android",
    scan: "Descarga en tu móvil",
    scanHelp: "Escanea el código con la cámara del móvil y elige tu tienda de aplicaciones.",
    browserHelp: "Si la tienda no se abre, abre esta página en Safari o Chrome.",
    language: "Idioma",
    qrAlt: "Código QR de la página de descarga en español",
  },
};
