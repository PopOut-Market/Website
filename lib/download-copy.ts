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
  helpLabel: string;
  browserHelp: string;
  language: string;
  qrAlt: string;
};

export const downloadCopy: Record<Locale, DownloadCopy> = {
  en: {
    title: "PopOut · Good finds nearby",
    summary: "Second-hand finds, rooms and local deals.",
    heading: "Explore your neighbourhood",
    intro:
      "On PopOut, find a second-hand sofa, a room to rent or a deal at the shop around the corner.",
    iphone: "Download for iPhone",
    android: "Download for Android",
    scan: "Scan to get PopOut",
    scanHelp: "Open your phone camera and point it at the code.",
    helpLabel: "Store won’t open?",
    browserHelp: "Open this page in Safari or Chrome, then tap your store again.",
    language: "Language",
    qrAlt: "QR code for the English download page",
  },
  "zh-Hans": {
    title: "PopOut · 发现附近的好东西",
    summary: "逛二手、找房间、看看附近有什么优惠。",
    heading: "逛逛你的街区",
    intro: "在 PopOut 淘张二手沙发、找个房间，也能发现街角小店的优惠。",
    iphone: "下载 iPhone 版",
    android: "下载 Android 版",
    scan: "扫码下载 PopOut",
    scanHelp: "打开手机相机，对准二维码。",
    helpLabel: "应用商店打不开？",
    browserHelp: "用 Safari 或 Chrome 打开此页，再点一次下载按钮。",
    language: "语言",
    qrAlt: "简体中文下载页二维码",
  },
  "zh-Hant": {
    title: "PopOut · 發現附近的好東西",
    summary: "逛二手、找房間、看看附近有哪些優惠。",
    heading: "逛逛你的街區",
    intro: "在 PopOut 找張二手沙發、看看出租的房間，或逛逛街角小店的優惠。",
    iphone: "下載 iPhone 版",
    android: "下載 Android 版",
    scan: "掃碼下載 PopOut",
    scanHelp: "打開手機相機，對準 QR Code。",
    helpLabel: "打不開應用程式商店？",
    browserHelp: "請用 Safari 或 Chrome 開啟此頁，再點一次下載按鈕。",
    language: "語言",
    qrAlt: "繁體中文下載頁 QR Code",
  },
  ko: {
    title: "PopOut · 우리 동네 둘러보기",
    summary: "가까운 중고 물건부터 빈방과 동네 할인까지.",
    heading: "우리 동네를 둘러보세요",
    intro: "PopOut에서 중고 소파와 빈방을 찾아보고, 동네 가게의 할인 소식도 확인해 보세요.",
    iphone: "iPhone용 다운로드",
    android: "Android용 다운로드",
    scan: "QR 코드로 다운로드",
    scanHelp: "휴대폰 카메라를 열고 코드를 비춰 주세요.",
    helpLabel: "스토어가 열리지 않나요?",
    browserHelp: "Safari나 Chrome에서 이 페이지를 연 다음 스토어 버튼을 다시 눌러 주세요.",
    language: "언어",
    qrAlt: "한국어 다운로드 페이지 QR 코드",
  },
  ja: {
    title: "PopOut · 近くで見つけよう",
    summary: "近所で中古品や部屋、お得な情報を探せます。",
    heading: "近所をのぞいてみよう",
    intro:
      "PopOutで中古のソファや貸し出し中の部屋を探したり、街角のお店のお得な情報をチェックしたりできます。",
    iphone: "iPhone 版を入手",
    android: "Android 版を入手",
    scan: "QRコードでダウンロード",
    scanHelp: "スマートフォンのカメラをコードに向けてください。",
    helpLabel: "ストアが開かない場合",
    browserHelp:
      "SafariまたはChromeでこのページを開き、ストアのボタンをもう一度タップしてください。",
    language: "言語",
    qrAlt: "日本語のダウンロードページの QR コード",
  },
  vi: {
    title: "PopOut · Khám phá quanh bạn",
    summary: "Tìm đồ cũ, phòng cho thuê và ưu đãi gần nhà.",
    heading: "Khám phá khu phố của bạn",
    intro:
      "Trên PopOut, bạn có thể tìm một chiếc sofa cũ, một phòng trọ hoặc xem ưu đãi ở cửa hàng góc phố.",
    iphone: "Tải cho iPhone",
    android: "Tải cho Android",
    scan: "Quét mã để tải PopOut",
    scanHelp: "Mở camera điện thoại và hướng vào mã QR.",
    helpLabel: "Cửa hàng ứng dụng không mở?",
    browserHelp: "Mở trang này bằng Safari hoặc Chrome rồi nhấn lại vào nút tải.",
    language: "Ngôn ngữ",
    qrAlt: "Mã QR dẫn tới trang tải bằng tiếng Việt",
  },
  fr: {
    title: "PopOut · Les trouvailles du quartier",
    summary: "Objets d’occasion, chambres à louer et bons plans près de chez vous.",
    heading: "Explorez votre quartier",
    intro:
      "Sur PopOut, trouvez un canapé d’occasion, une chambre à louer ou une offre dans la boutique du coin.",
    iphone: "Télécharger pour iPhone",
    android: "Télécharger pour Android",
    scan: "Scannez pour télécharger",
    scanHelp: "Ouvrez l’appareil photo de votre téléphone et visez le code.",
    helpLabel: "Le store ne s’ouvre pas ?",
    browserHelp:
      "Ouvrez cette page dans Safari ou Chrome, puis touchez à nouveau le badge de téléchargement.",
    language: "Langue",
    qrAlt: "Code QR de la page de téléchargement en français",
  },
  es: {
    title: "PopOut · Descubre tu barrio",
    summary: "Encuentra artículos de segunda mano, habitaciones y ofertas cerca.",
    heading: "Explora tu barrio",
    intro:
      "Encuentra en PopOut un sofá de segunda mano, una habitación en alquiler o una oferta en la tienda de la esquina.",
    iphone: "Descargar para iPhone",
    android: "Descargar para Android",
    scan: "Escanea para descargar",
    scanHelp: "Abre la cámara del móvil y apunta al código.",
    helpLabel: "¿No se abre la tienda?",
    browserHelp: "Abre esta página en Safari o Chrome y vuelve a tocar el botón de descarga.",
    language: "Idioma",
    qrAlt: "Código QR de la página de descarga en español",
  },
};
