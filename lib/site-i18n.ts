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
  heroExploreCta: string;
  downloadLine: string;
  slogan: string;
  ratingAria: string;
  homeAria: string;
  appStoreAlt: string;
  googlePlayAlt: string;
  marketPageTitle: string;
  marketAreaModalTitle: string;
  marketAreaModalHint: string;
  marketAreaPickerAria: string;
  marketAreaCloseAria: string;
  marketPostNoImageAria: string;
  marketBadgeNew: string;
  marketKmShort: string;
  marketDemoSeller: string;
  marketFeedListAria: string;
  marketSupabaseNotConfiguredTitle: string;
  marketSupabaseNotConfiguredBody: string;
  marketSupabaseLoadError: string;
  marketSupabaseRetry: string;
  marketSupabaseEmpty: string;
  marketSupabaseLoadingAria: string;
  marketLocationDeniedHint: string;
  marketLocationUnsupportedHint: string;
  marketLocationRetry: string;
  marketPostBack: string;
  marketPostBackAria: string;
  marketPostNotFoundTitle: string;
  marketPostNotFoundBody: string;
  marketPostListedLabel: string;
  marketPostAreaLabel: string;
  marketPostCategoryLabel: string;
  marketPostStatusLabel: string;
  marketPostDeliveryLabel: string;
  marketPostNegotiableLabel: string;
  marketPostListingRef: string;
  /** Cyan badge when the listing supports delivery (replaces generic “Yes”). */
  marketPostDeliverableBadge: string;
  /** Shown to the right of the price when the price is not negotiable. */
  marketPostFixedPriceLabel: string;
  marketPostDetailLoadingAria: string;
  marketPostDescriptionHeading: string;
  marketPostPreferredMeetupLabel: string;
  marketPostOtherItemsHeading: string;
  marketPostSellerVerifiedLabel: string;
  marketYes: string;
  marketNo: string;
  marketUnknown: string;
  translationDemoTitle: string;
  translationDemoSubtitle: string;
  aiPostDemoTitle: string;
  aiPostDemoSubtitle: string;
  aiPostDemoPrice: string;
  aiPostDemoCondition: string;
  aiPostDemoYouFill: string;
  footerLegalNavAria: string;
  footerCopyright: string;
  footerAbn: string;
  footerNavAbout: string;
  footerNavTerms: string;
  footerNavPrivacy: string;
  footerNavContact: string;
  footerSocialRednoteAria: string;
  footerSocialInstagramAria: string;
  footerSocialLinkedInAria: string;
  footerLegalStub: string;
  footerBackHome: string;
  aboutPageTitle: string;
  aboutMainHeading: string;
  aboutOurStoryTitle: string;
  aboutOurStoryP1: string;
  aboutOurStoryP2: string;
  aboutWhyTitle: string;
  aboutWhyNeighbourhoodTitle: string;
  aboutWhyNeighbourhoodBody: string;
  aboutWhySafetyTitle: string;
  aboutWhySafetyBody: string;
  aboutWhyCommunicationTitle: string;
  aboutWhyCommunicationBody: string;
  aboutPrivacyTitle: string;
  aboutPrivacyLead: string;
  aboutPrivacyMinimalTitle: string;
  aboutPrivacyMinimalBody: string;
  aboutPrivacyStorageTitle: string;
  aboutPrivacyStorageBody: string;
  aboutPrivacyNoTracesTitle: string;
  aboutPrivacyNoTracesBody: string;
  aboutPrivacyLinkMore: string;
  aboutVisionTitle: string;
  aboutVisionP1: string;
  aboutVisionP2: string;
  aboutVisionP3: string;
  aboutFeedbackTitle: string;
  aboutFeedbackLead: string;
  aboutSupportEmail: string;
};

export const COPY: Record<Locale, SiteCopy> = {
  en: {
    topDownload: "Download",
    topLanguage: "Language",
    languageModalTitle: "Choose your language",
    languageModalHint: "PopOut supports local communities in multiple languages.",
    heroSecondaryPrefix: "Buy and sell second-hand items nearby, in",
    heroSecondaryLink: "your language",
    heroExploreCta: "Explore more products",
    downloadLine: "Download the PopOut Market app for iOS or Android",
    slogan: "buy and sell with people around you",
    ratingAria: "Rating 4.5 out of 5 stars",
    homeAria: "PopOut home",
    appStoreAlt: "Download on the App Store",
    googlePlayAlt: "Get it on Google Play",
    marketPageTitle: "Market",
    marketAreaModalTitle: "Choose your area",
    marketAreaModalHint: "Tap a suburb to update the area shown above.",
    marketAreaPickerAria: "Change area",
    marketAreaCloseAria: "Close",
    marketPostNoImageAria: "No photo yet",
    marketBadgeNew: "New",
    marketKmShort: "km",
    marketDemoSeller: "Seller",
    marketFeedListAria: "Listings in this area",
    marketSupabaseNotConfiguredTitle: "Sample listings",
    marketSupabaseNotConfiguredBody:
      "These are example items for browsing the layout. Your real listings will show here once the catalog is connected.",
    marketSupabaseLoadError: "We couldn’t load listings right now. Please try again in a moment.",
    marketSupabaseRetry: "Try again",
    marketSupabaseEmpty: "No listings in this area yet.",
    marketSupabaseLoadingAria: "Loading listings",
    marketLocationDeniedHint:
      "Allow location in your browser to see straight-line distance to each item’s meet-up point.",
    marketLocationUnsupportedHint: "This browser does not support location, so distances cannot be shown.",
    marketLocationRetry: "Ask for location again",
    marketPostBack: "Back",
    marketPostBackAria: "Back to Market",
    marketPostNotFoundTitle: "Listing not found",
    marketPostNotFoundBody: "It may have been removed, or the link may be incorrect.",
    marketPostListedLabel: "Listed",
    marketPostAreaLabel: "Area",
    marketPostCategoryLabel: "Category",
    marketPostStatusLabel: "Status",
    marketPostDeliveryLabel: "Delivery",
    marketPostNegotiableLabel: "Negotiable",
    marketPostListingRef: "Listing ref.",
    marketPostDeliverableBadge: "Delivery available",
    marketPostFixedPriceLabel: "Fixed price",
    marketPostDetailLoadingAria: "Loading listing",
    marketPostDescriptionHeading: "Description",
    marketPostPreferredMeetupLabel: "Preferred meet-up point",
    marketPostOtherItemsHeading: "More from this seller",
    marketPostSellerVerifiedLabel: "Verified in",
    marketYes: "Yes",
    marketNo: "No",
    marketUnknown: "Unknown",
    translationDemoTitle: "Say it once. Everyone understands.",
    translationDemoSubtitle: "Your messages are translated instantly — type in your language, they read in theirs.",
    aiPostDemoTitle: "Snap a photo. AI does the rest.",
    aiPostDemoSubtitle: "Take a photo and AI generates the title, category, and description — you just set the price.",
    aiPostDemoPrice: "Price",
    aiPostDemoCondition: "Condition",
    aiPostDemoYouFill: "You fill in",
    footerLegalNavAria: "Policies and contact",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAbn: "ABN: 12345678901",
    footerNavAbout: "About PopOut Market",
    footerNavTerms: "Terms of Use",
    footerNavPrivacy: "Privacy Policy",
    footerNavContact: "Contact Us",
    footerSocialRednoteAria: "PopOut Market on Xiaohongshu (RED)",
    footerSocialInstagramAria: "PopOut Market on Instagram",
    footerSocialLinkedInAria: "PopOut Market on LinkedIn",
    footerLegalStub: "This page will be updated soon.",
    footerBackHome: "Back to home",
    aboutPageTitle: "About",
    aboutMainHeading: "About PopOut: Making Life in Melbourne Simpler & Warmer",
    aboutOurStoryTitle: "Our Story",
    aboutOurStoryP1:
      "Everyone who crosses the ocean to Australia carries a heart full of hope for the future — and perhaps a touch of loneliness from being far from home. We understand that, as an international student or someone building a new life overseas, buying everyday essentials and dealing with second-hand items should be easy. But language barriers, distance, and concerns about transaction safety often make it anything but.",
    aboutOurStoryP2:
      "PopOut was born from this. We are more than a second-hand marketplace — we want to be your \"first stop\" when you arrive in Melbourne.",
    aboutWhyTitle: "Why PopOut?",
    aboutWhyNeighbourhoodTitle: "True \"Neighbourhood\" Trading",
    aboutWhyNeighbourhoodBody:
      "Precise location-based recommendations in Melbourne help you discover hidden gems right on your doorstep. Knowing the seller might live on the next street over gives every transaction a foundation of trust you can see.",
    aboutWhySafetyTitle: "Safety Is Our Core Principle",
    aboutWhySafetyBody:
      "Your safety comes first. We've hand-picked the safest public spots across Melbourne for in-person trades, and we encourage users to verify their student identity. Every transaction on PopOut comes with an extra layer of assurance.",
    aboutWhyCommunicationTitle: "Communication Without Borders",
    aboutWhyCommunicationBody:
      "Language should never be a barrier to connection. PopOut features a powerful real-time bilingual translation system. Chat in your native language — the other person receives an automatic translation. Even if your English isn't perfect, you can trade freely and make like-minded friends here.",
    aboutPrivacyTitle: "We Protect Your Privacy",
    aboutPrivacyLead: "At PopOut, we treat privacy as a fundamental right.",
    aboutPrivacyMinimalTitle: "Minimal Data Collection",
    aboutPrivacyMinimalBody:
      "We only collect essential information like your phone number and email for login verification.",
    aboutPrivacyStorageTitle: "High-Standard Storage",
    aboutPrivacyStorageBody:
      "Your sensitive data is stored in world-class encrypted databases.",
    aboutPrivacyNoTracesTitle: "No Traces Left",
    aboutPrivacyNoTracesBody:
      "We promise never to store or misuse your private location data. Explore with peace of mind.",
    aboutPrivacyLinkMore: "More detailed privacy information",
    aboutVisionTitle: "Our Vision",
    aboutVisionP1:
      'The name PopOut means "step outside, connect with your neighbours." Through this little app, we hope to break the cold indifference of big-city life and fill every Melbourne neighbourhood with the warmth of mutual help.',
    aboutVisionP2:
      "Whether you're a new student setting up your first home, or a professional embarking on the next chapter, PopOut is here by your side.",
    aboutVisionP3:
      "Thank you for choosing PopOut. Together, let us build a safer, closer-knit Melbourne community.",
    aboutFeedbackTitle: "Suggestions & Feedback",
    aboutFeedbackLead:
      "We're always evolving. If you have any ideas, or simply want to say hello, feel free to reach out:",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
  "zh-Hans": {
    topDownload: "下载",
    topLanguage: "语言",
    languageModalTitle: "选择你的语言",
    languageModalHint: "PopOut 以多语言连接本地社区。",
    heroSecondaryPrefix: "用你的语言，在附近买卖二手好物，点击",
    heroSecondaryLink: "你的语言",
    heroExploreCta: "探索更多商品",
    downloadLine: "下载 PopOut Market 应用，支持 iOS 和 Android",
    slogan: "与身边的人轻松买卖",
    ratingAria: "评分 4.5（满分 5 分）",
    homeAria: "PopOut 首页",
    appStoreAlt: "在 App Store 下载",
    googlePlayAlt: "在 Google Play 获取",
    marketPageTitle: "市集",
    marketAreaModalTitle: "选择区域",
    marketAreaModalHint: "点选郊区名称即可更新左上角显示的区域。",
    marketAreaPickerAria: "更改区域",
    marketAreaCloseAria: "关闭",
    marketPostNoImageAria: "暂无照片",
    marketBadgeNew: "新品",
    marketKmShort: "公里",
    marketDemoSeller: "卖家",
    marketFeedListAria: "本区域商品列表",
    marketSupabaseNotConfiguredTitle: "示例商品",
    marketSupabaseNotConfiguredBody:
      "当前为示例内容，仅用于展示页面布局；正式商品接入后会自动显示在这里。",
    marketSupabaseLoadError: "暂时无法加载商品，请稍后再试。",
    marketSupabaseRetry: "重试",
    marketSupabaseEmpty: "该区域暂时没有上架商品。",
    marketSupabaseLoadingAria: "正在加载列表",
    marketLocationDeniedHint: "在浏览器中允许位置权限后，可显示到见面地点的直线距离。",
    marketLocationUnsupportedHint: "当前浏览器不支持定位，无法显示距离。",
    marketLocationRetry: "再次请求位置",
    marketPostBack: "返回",
    marketPostBackAria: "返回市集",
    marketPostNotFoundTitle: "找不到该商品",
    marketPostNotFoundBody: "可能已下架，或链接不正确。",
    marketPostListedLabel: "发布时间",
    marketPostAreaLabel: "区域",
    marketPostCategoryLabel: "分类",
    marketPostStatusLabel: "状态",
    marketPostDeliveryLabel: "可配送",
    marketPostNegotiableLabel: "可议价",
    marketPostListingRef: "编号",
    marketPostDeliverableBadge: "可配送",
    marketPostFixedPriceLabel: "价格固定",
    marketPostDetailLoadingAria: "正在加载详情",
    marketPostDescriptionHeading: "描述",
    marketPostPreferredMeetupLabel: "首选见面地点",
    marketPostOtherItemsHeading: "该卖家的其他商品",
    marketPostSellerVerifiedLabel: "已在以下区域认证",
    marketYes: "是",
    marketNo: "否",
    marketUnknown: "未知",
    translationDemoTitle: "说一次，所有人都能懂。",
    translationDemoSubtitle: "你用你的语言发消息，对方用他的语言收到——翻译全自动。",
    aiPostDemoTitle: "拍张照，AI 帮你搞定。",
    aiPostDemoSubtitle: "拍照后 AI 自动生成标题、分类和描述，你只需填价格和状态。",
    aiPostDemoPrice: "价格",
    aiPostDemoCondition: "成色",
    aiPostDemoYouFill: "你来填",
    footerLegalNavAria: "条款与联系",
    footerCopyright: "版权所有 © 2026 PopOut Market Pty Ltd。保留所有权利。",
    footerAbn: "ABN：12345678901",
    footerNavAbout: "关于 PopOut Market",
    footerNavTerms: "使用条款",
    footerNavPrivacy: "隐私政策",
    footerNavContact: "联系我们",
    footerSocialRednoteAria: "PopOut Market 小红书",
    footerSocialInstagramAria: "PopOut Market Instagram",
    footerSocialLinkedInAria: "PopOut Market LinkedIn",
    footerLegalStub: "本页面内容即将更新。",
    footerBackHome: "返回首页",
    aboutPageTitle: "关于",
    aboutMainHeading: "关于 PopOut：让墨尔本的生活更简单、更温暖",
    aboutOurStoryTitle: "我们的初衷",
    aboutOurStoryP1:
      "每一个跨越大洋来到澳洲的人，心中都带着对未来的憧憬，也难免藏着身处异乡的孤独。我们深知，作为留学生或海外奋斗者，置办生活所需、处理闲置物品本该是一件轻松的事，但不熟悉的语言、距离的隔阂以及对交易安全的担忧，往往让这件事变得复杂。",
    aboutOurStoryP2:
      "PopOut 由此诞生。我们不仅仅是一个二手交易平台，我们希望成为你来到墨尔本后的「第一站」。",
    aboutWhyTitle: "为什么选择 PopOut？",
    aboutWhyNeighbourhoodTitle: "真正的「邻里」交易",
    aboutWhyNeighbourhoodBody:
      "基于墨尔本精准的地理位置推荐，帮你发现家门口的好物。知道卖家可能就住在隔壁街，让每一次交易都多一份看得见的信任。",
    aboutWhySafetyTitle: "安全，是我们的核心理念",
    aboutWhySafetyBody:
      "你的安全高于一切。我们精选了墨尔本最安全的公共场所作为面交地点，并鼓励用户完成学生身份验证。在 PopOut 上的每一笔交易，都多一层安心保障。",
    aboutWhyCommunicationTitle: "沟通，再无国界",
    aboutWhyCommunicationBody:
      "语言不该成为连接的障碍。PopOut 配备强大的实时双语翻译系统。用你的母语聊天——对方会收到自动翻译。即使英语还不够流利，你也可以在这里自由交易、结识志同道合的朋友。",
    aboutPrivacyTitle: "我们守护您的隐私",
    aboutPrivacyLead: "在 PopOut，我们视隐私为基本权利。",
    aboutPrivacyMinimalTitle: "极简数据采集",
    aboutPrivacyMinimalBody: "我们只收集登录验证所必需的信息，例如手机号与邮箱。",
    aboutPrivacyStorageTitle: "高标准存储",
    aboutPrivacyStorageBody: "你的敏感数据存放在世界一流的加密数据库中。",
    aboutPrivacyNoTracesTitle: "不留痕迹",
    aboutPrivacyNoTracesBody: "我们承诺绝不存储或滥用你的私人位置数据。请放心探索。",
    aboutPrivacyLinkMore: "更多详细的隐私介绍",
    aboutVisionTitle: "我们的愿景",
    aboutVisionP1:
      "PopOut 的名字寓意着「走出家门，连结邻里」。通过这款小小的应用，我们希望打破大城市中的冷漠，让墨尔本的每一个社区都充满互助的温度。",
    aboutVisionP2:
      "无论你是初来乍到布置第一个家的新生，还是开启人生下一章的职场人，PopOut 都愿陪在你身边。",
    aboutVisionP3: "感谢你选择 PopOut。让我们一起，建设更安全、更紧密的墨尔本社区。",
    aboutFeedbackTitle: "建议与反馈",
    aboutFeedbackLead: "我们始终在进化。如果你有任何想法，或仅仅是想和我们打个招呼，请随时联络：",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
  "zh-Hant": {
    topDownload: "下載",
    topLanguage: "語言",
    languageModalTitle: "選擇你的語言",
    languageModalHint: "PopOut 以多語言連結在地社群。",
    heroSecondaryPrefix: "用你的語言，在附近買賣二手好物，點擊",
    heroSecondaryLink: "你的語言",
    heroExploreCta: "探索更多商品",
    downloadLine: "下載 PopOut Market 應用，支援 iOS 與 Android",
    slogan: "與身邊的人輕鬆買賣",
    ratingAria: "評分 4.5（滿分 5 分）",
    homeAria: "PopOut 首頁",
    appStoreAlt: "在 App Store 下載",
    googlePlayAlt: "在 Google Play 取得",
    marketPageTitle: "市集",
    marketAreaModalTitle: "選擇區域",
    marketAreaModalHint: "點選郊區名稱即可更新左上角顯示的區域。",
    marketAreaPickerAria: "變更區域",
    marketAreaCloseAria: "關閉",
    marketPostNoImageAria: "暫無照片",
    marketBadgeNew: "新品",
    marketKmShort: "公里",
    marketDemoSeller: "賣家",
    marketFeedListAria: "本區商品列表",
    marketSupabaseNotConfiguredTitle: "範例商品",
    marketSupabaseNotConfiguredBody:
      "目前為範例內容，僅供預覽版面；正式商品接上後會顯示於此。",
    marketSupabaseLoadError: "暫時無法載入列表，請稍後再試。",
    marketSupabaseRetry: "再試一次",
    marketSupabaseEmpty: "此區域尚無刊登項目。",
    marketSupabaseLoadingAria: "載入列表中",
    marketLocationDeniedHint: "請在瀏覽器允許位置，以顯示到面交點的直線距離。",
    marketLocationUnsupportedHint: "此瀏覽器不支援定位，無法顯示距離。",
    marketLocationRetry: "再次要求位置",
    marketPostBack: "返回",
    marketPostBackAria: "返回市集",
    marketPostNotFoundTitle: "找不到刊登",
    marketPostNotFoundBody: "可能已移除，或連結不正確。",
    marketPostListedLabel: "刊登時間",
    marketPostAreaLabel: "區域",
    marketPostCategoryLabel: "分類",
    marketPostStatusLabel: "狀態",
    marketPostDeliveryLabel: "可配送",
    marketPostNegotiableLabel: "可議價",
    marketPostListingRef: "編號",
    marketPostDeliverableBadge: "可配送",
    marketPostFixedPriceLabel: "價格固定",
    marketPostDetailLoadingAria: "載入詳情中",
    marketPostDescriptionHeading: "說明",
    marketPostPreferredMeetupLabel: "首選面交地點",
    marketPostOtherItemsHeading: "該賣家的其他商品",
    marketPostSellerVerifiedLabel: "已在以下區域驗證",
    marketYes: "是",
    marketNo: "否",
    marketUnknown: "未知",
    translationDemoTitle: "說一次，所有人都能懂。",
    translationDemoSubtitle: "你用你的語言發訊息，對方用他的語言收到——翻譯全自動。",
    aiPostDemoTitle: "拍張照，AI 幫你搞定。",
    aiPostDemoSubtitle: "拍照後 AI 自動產生標題、分類和描述，你只需填價格和狀態。",
    aiPostDemoPrice: "價格",
    aiPostDemoCondition: "成色",
    aiPostDemoYouFill: "你來填",
    footerLegalNavAria: "條款與聯絡",
    footerCopyright: "版權所有 © 2026 PopOut Market Pty Ltd。保留所有權利。",
    footerAbn: "ABN：12345678901",
    footerNavAbout: "關於 PopOut Market",
    footerNavTerms: "使用條款",
    footerNavPrivacy: "隱私權政策",
    footerNavContact: "聯絡我們",
    footerSocialRednoteAria: "PopOut Market 小紅書",
    footerSocialInstagramAria: "PopOut Market Instagram",
    footerSocialLinkedInAria: "PopOut Market LinkedIn",
    footerLegalStub: "本頁面內容即將更新。",
    footerBackHome: "返回首頁",
    aboutPageTitle: "關於",
    aboutMainHeading: "關於 PopOut：讓墨爾本的生活更簡單、更溫暖",
    aboutOurStoryTitle: "我們的初衷",
    aboutOurStoryP1:
      "每一個跨越大洋來到澳洲的人，心中都帶著對未來的憧憬，也難免藏著一絲身處異鄉的孤獨。我們深知，作為留學生或海外奮鬥者，置辦生活所需、處理閒置物品本該是一件輕鬆的事，但不熟悉的語言、距離的隔閡以及對交易安全的擔憂，往往讓這件事變得複雜。",
    aboutOurStoryP2:
      "PopOut 由此誕生。我們不僅僅是一個二手交易平台，我們希望成為你來到墨爾本後的「第一站」。",
    aboutWhyTitle: "為什麼選擇 PopOut？",
    aboutWhyNeighbourhoodTitle: "真正的「鄰里」交易",
    aboutWhyNeighbourhoodBody:
      "基於墨爾本精準的地理位置推薦，幫你發現家門口的好物。知道賣家可能就住在隔壁街，讓每一次交易都多一份看得見的信任。",
    aboutWhySafetyTitle: "安全，是我們的核心理念",
    aboutWhySafetyBody:
      "你的安全高於一切。我們精選了墨爾本最安全的公共場所作為面交地點，並鼓勵使用者完成學生身份驗證。在 PopOut 上的每一筆交易，都多一層安心保障。",
    aboutWhyCommunicationTitle: "溝通，再無國界",
    aboutWhyCommunicationBody:
      "語言不該成為連結的障礙。PopOut 配備強大的即時雙語翻譯系統。用你的母語聊天——對方會收到自動翻譯。即使英文還不夠流利，你也可以在這裡自由交易、結識志同道合的朋友。",
    aboutPrivacyTitle: "我們守護您的隱私",
    aboutPrivacyLead: "在 PopOut，我們視隱私為基本權利。",
    aboutPrivacyMinimalTitle: "極簡資料採集",
    aboutPrivacyMinimalBody: "我們只收集登入驗證所必需的資訊，例如手機號碼與電子郵件。",
    aboutPrivacyStorageTitle: "高標準儲存",
    aboutPrivacyStorageBody: "你的敏感資料存放在世界一流的加密資料庫中。",
    aboutPrivacyNoTracesTitle: "不留痕跡",
    aboutPrivacyNoTracesBody: "我們承諾絕不儲存或濫用你的私人位置資料。請放心探索。",
    aboutPrivacyLinkMore: "更多詳細的隱私介紹",
    aboutVisionTitle: "我們的願景",
    aboutVisionP1:
      "PopOut 的名字寓意著「走出家門，連結鄰里」。透過這款小小的應用，我們希望打破大城市中的冷漠，讓墨爾本的每一個社區都充滿互助的溫度。",
    aboutVisionP2:
      "無論你是初來乍到佈置第一個家的新生，還是開啟人生下一章的職場人，PopOut 都願陪在你身邊。",
    aboutVisionP3: "感謝你選擇 PopOut。讓我們一起，建設更安全、更緊密的墨爾本社區。",
    aboutFeedbackTitle: "建議與回饋",
    aboutFeedbackLead: "我們始終在進化。如果你有任何想法，或僅僅是想和我們打個招呼，請隨時聯絡：",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
  ko: {
    topDownload: "다운로드",
    topLanguage: "언어",
    languageModalTitle: "언어 선택",
    languageModalHint: "PopOut은 다양한 언어로 지역 커뮤니티를 연결합니다.",
    heroSecondaryPrefix: "내 주변에서 중고 거래를,",
    heroSecondaryLink: "내 언어로",
    heroExploreCta: "더 많은 상품 둘러보기",
    downloadLine: "iOS 및 Android용 PopOut Market 앱을 다운로드하세요",
    slogan: "주변 사람들과 쉽고 빠르게 거래하세요",
    ratingAria: "별점 5점 만점에 4.5점",
    homeAria: "PopOut 홈",
    appStoreAlt: "App Store에서 다운로드",
    googlePlayAlt: "Google Play에서 다운로드",
    marketPageTitle: "마켓",
    marketAreaModalTitle: "지역 선택",
    marketAreaModalHint: "교외 이름을 누르면 왼쪽 위에 표시되는 지역이 바뀝니다.",
    marketAreaPickerAria: "지역 변경",
    marketAreaCloseAria: "닫기",
    marketPostNoImageAria: "사진 없음",
    marketBadgeNew: "NEW",
    marketKmShort: "km",
    marketDemoSeller: "판매자",
    marketFeedListAria: "이 지역 상품 목록",
    marketSupabaseNotConfiguredTitle: "샘플 상품",
    marketSupabaseNotConfiguredBody:
      "레이아웃 미리보기용 예시입니다. 실제 상품이 연결되면 여기에 표시됩니다.",
    marketSupabaseLoadError: "목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    marketSupabaseRetry: "다시 시도",
    marketSupabaseEmpty: "이 지역에 아직 게시물이 없습니다.",
    marketSupabaseLoadingAria: "목록 불러오는 중",
    marketLocationDeniedHint: "브라우저에서 위치를 허용하면 만남 장소까지의 직선 거리를 볼 수 있습니다.",
    marketLocationUnsupportedHint: "이 브라우저는 위치 정보를 지원하지 않아 거리를 표시할 수 없습니다.",
    marketLocationRetry: "위치 다시 요청",
    marketPostBack: "뒤로",
    marketPostBackAria: "마켓으로 돌아가기",
    marketPostNotFoundTitle: "게시글을 찾을 수 없습니다",
    marketPostNotFoundBody: "삭제되었거나 링크가 잘못되었을 수 있습니다.",
    marketPostListedLabel: "게시 시각",
    marketPostAreaLabel: "지역",
    marketPostCategoryLabel: "카테고리",
    marketPostStatusLabel: "상태",
    marketPostDeliveryLabel: "배송 가능",
    marketPostNegotiableLabel: "가격 제안 가능",
    marketPostListingRef: "참조 번호",
    marketPostDeliverableBadge: "배송 가능",
    marketPostFixedPriceLabel: "고정 가격",
    marketPostDetailLoadingAria: "상세 정보 불러오는 중",
    marketPostDescriptionHeading: "설명",
    marketPostPreferredMeetupLabel: "선호 만남 장소",
    marketPostOtherItemsHeading: "이 판매자의 다른 상품",
    marketPostSellerVerifiedLabel: "다음 지역 인증",
    marketYes: "예",
    marketNo: "아니오",
    marketUnknown: "알 수 없음",
    translationDemoTitle: "한 번 말하면, 모두가 이해합니다.",
    translationDemoSubtitle: "내 언어로 보내면, 상대방은 자기 언어로 받아요. 번역은 자동입니다.",
    aiPostDemoTitle: "사진 한 장이면 AI가 알아서.",
    aiPostDemoSubtitle: "사진을 찍으면 AI가 제목, 카테고리, 설명을 자동 생성 — 가격만 입력하세요.",
    aiPostDemoPrice: "가격",
    aiPostDemoCondition: "상태",
    aiPostDemoYouFill: "직접 입력",
    footerLegalNavAria: "약관 및 문의",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAbn: "ABN: 12345678901",
    footerNavAbout: "PopOut Market 소개",
    footerNavTerms: "이용약관",
    footerNavPrivacy: "개인정보 처리방침",
    footerNavContact: "문의하기",
    footerSocialRednoteAria: "PopOut Market 샤오홍슈(RED)",
    footerSocialInstagramAria: "PopOut Market 인스타그램",
    footerSocialLinkedInAria: "PopOut Market 링크드인",
    footerLegalStub: "이 페이지는 곧 업데이트됩니다.",
    footerBackHome: "홈으로 돌아가기",
    aboutPageTitle: "소개",
    aboutMainHeading: "PopOut 소개: 멜버른 생활을 더 간단하고 따뜻하게",
    aboutOurStoryTitle: "우리의 이야기",
    aboutOurStoryP1:
      "바다를 건너 호주에 온 모든 이는 미래에 대한 희망을 품고, 고향에서 멀리 떨어진 외로움도 조금은 안고 옵니다. 유학생이든 새 삶을 시작하는 분이든, 생활용품을 사고 중고 물건을 다루는 일은 쉬워야 합니다. 하지만 언어 장벽, 거리, 거래 안전에 대한 걱정은 그렇게 쉽지 않게 만듭니다.",
    aboutOurStoryP2:
      "PopOut은 이런 고민에서 시작했습니다. 우리는 단순한 중고 마켓이 아니라, 멜버른에 도착했을 때 당신의 ‘첫 번째 정거장’이 되고 싶습니다.",
    aboutWhyTitle: "왜 PopOut인가요?",
    aboutWhyNeighbourhoodTitle: "진짜 ‘이웃’ 거래",
    aboutWhyNeighbourhoodBody:
      "멜버른 기반의 정확한 위치 추천으로 집 앞에서 보물 같은 물건을 발견하세요. 판매자가 바로 옆 거리에 살 수 있다는 걸 알면, 모든 거래에 눈에 보이는 신뢰가 생깁니다.",
    aboutWhySafetyTitle: "안전이 우리의 핵심 원칙",
    aboutWhySafetyBody:
      "당신의 안전이 최우선입니다. 멜버른 전역에서 안전한 공공 장소를 엄선해 대면 거래를 돕고, 학생 신원 인증을 권장합니다. PopOut의 모든 거래에 한 겹 더 안심이 더해집니다.",
    aboutWhyCommunicationTitle: "국경 없는 소통",
    aboutWhyCommunicationBody:
      "언어는 연결의 장벽이 되어서는 안 됩니다. PopOut에는 강력한 실시간 이중 언어 번역이 있습니다. 모국어로 채팅하면 상대에게는 자동으로 번역됩니다. 영어가 완벽하지 않아도 자유롭게 거래하고 마음이 맞는 친구를 만나세요.",
    aboutPrivacyTitle: "개인정보를 지킵니다",
    aboutPrivacyLead: "PopOut에서는 개인정보를 기본권으로 대합니다.",
    aboutPrivacyMinimalTitle: "최소 수집",
    aboutPrivacyMinimalBody: "로그인 확인을 위해 전화번호와 이메일 등 필수 정보만 수집합니다.",
    aboutPrivacyStorageTitle: "높은 수준의 저장",
    aboutPrivacyStorageBody: "민감한 데이터는 세계 수준의 암호화 데이터베이스에 보관됩니다.",
    aboutPrivacyNoTracesTitle: "흔적 없음",
    aboutPrivacyNoTracesBody: "개인 위치 데이터를 저장하거나 남용하지 않겠습니다. 안심하고 이용하세요.",
    aboutPrivacyLinkMore: "자세한 개인정보 안내",
    aboutVisionTitle: "비전",
    aboutVisionP1:
      "PopOut은 ‘밖으로 나와 이웃과 연결하라’는 뜻을 담고 있습니다. 이 작은 앱으로 대도시의 차가움을 깨고, 멜버른 모든 동네에 서로 돕는 따뜻함을 채우고자 합니다.",
    aboutVisionP2:
      "첫 집을 꾸미는 신입 유학생이든, 새 장을 여는 직장인이든 PopOut이 곁에 있습니다.",
    aboutVisionP3:
      "PopOut을 선택해 주셔서 감사합니다. 함께 더 안전하고 밀접한 멜버른 커뮤니티를 만들어 갑시다.",
    aboutFeedbackTitle: "제안 및 피드백",
    aboutFeedbackLead: "우리는 끊임없이 발전합니다. 아이디어가 있거나 인사만 하고 싶어도 언제든 연락 주세요:",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
  ja: {
    topDownload: "ダウンロード",
    topLanguage: "言語",
    languageModalTitle: "言語を選択",
    languageModalHint: "PopOut は多言語で地域コミュニティをつなぎます。",
    heroSecondaryPrefix: "近くの人と中古品を売り買い、",
    heroSecondaryLink: "あなたの言語で",
    heroExploreCta: "もっと商品を見る",
    downloadLine: "iOS / Android 向け PopOut Market アプリをダウンロード",
    slogan: "近くの人と手軽に売り買いしよう",
    ratingAria: "評価は 5 点中 4.5",
    homeAria: "PopOut ホーム",
    appStoreAlt: "App Storeでダウンロード",
    googlePlayAlt: "Google Playで手に入れよう",
    marketPageTitle: "マーケット",
    marketAreaModalTitle: "エリアを選ぶ",
    marketAreaModalHint: "郊外の名前をタップすると、左上に表示されるエリアが切り替わります。",
    marketAreaPickerAria: "エリアを変更",
    marketAreaCloseAria: "閉じる",
    marketPostNoImageAria: "写真なし",
    marketBadgeNew: "新着",
    marketKmShort: "km",
    marketDemoSeller: "出品者",
    marketFeedListAria: "このエリアの商品一覧",
    marketSupabaseNotConfiguredTitle: "サンプル商品",
    marketSupabaseNotConfiguredBody:
      "レイアウト確認用の例です。本番の商品データがつながるとここに表示されます。",
    marketSupabaseLoadError: "一覧を読み込めませんでした。しばらくしてからもう一度お試しください。",
    marketSupabaseRetry: "再試行",
    marketSupabaseEmpty: "このエリアにはまだ出品がありません。",
    marketSupabaseLoadingAria: "一覧を読み込み中",
    marketLocationDeniedHint: "ブラウザで位置情報を許可すると、受け渡し地点までの直線距離を表示できます。",
    marketLocationUnsupportedHint: "このブラウザは位置情報に対応していないため、距離を表示できません。",
    marketLocationRetry: "位置情報を再リクエスト",
    marketPostBack: "戻る",
    marketPostBackAria: "マーケットに戻る",
    marketPostNotFoundTitle: "出品が見つかりません",
    marketPostNotFoundBody: "削除されたか、リンクが間違っている可能性があります。",
    marketPostListedLabel: "掲載日時",
    marketPostAreaLabel: "エリア",
    marketPostCategoryLabel: "カテゴリ",
    marketPostStatusLabel: "状態",
    marketPostDeliveryLabel: "配送対応",
    marketPostNegotiableLabel: "価格交渉",
    marketPostListingRef: "出品番号",
    marketPostDeliverableBadge: "配送可",
    marketPostFixedPriceLabel: "価格固定",
    marketPostDetailLoadingAria: "詳細を読み込み中",
    marketPostDescriptionHeading: "説明",
    marketPostPreferredMeetupLabel: "希望受け渡し場所",
    marketPostOtherItemsHeading: "この出品者の他の商品",
    marketPostSellerVerifiedLabel: "認証済みエリア",
    marketYes: "はい",
    marketNo: "いいえ",
    marketUnknown: "不明",
    translationDemoTitle: "一度言えば、みんなに伝わる。",
    translationDemoSubtitle: "あなたの言語で送ると、相手は自分の言語で受け取ります。翻訳は自動です。",
    aiPostDemoTitle: "写真を撮るだけ。あとはAIにおまかせ。",
    aiPostDemoSubtitle: "写真を撮ると、AIがタイトル・カテゴリ・説明を自動生成。価格と状態だけ入力すればOK。",
    aiPostDemoPrice: "価格",
    aiPostDemoCondition: "状態",
    aiPostDemoYouFill: "あなたが入力",
    footerLegalNavAria: "ポリシーとお問い合わせ",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAbn: "ABN: 12345678901",
    footerNavAbout: "PopOut Market について",
    footerNavTerms: "利用規約",
    footerNavPrivacy: "プライバシーポリシー",
    footerNavContact: "お問い合わせ",
    footerSocialRednoteAria: "PopOut Market 小紅書（RED）",
    footerSocialInstagramAria: "PopOut Market Instagram",
    footerSocialLinkedInAria: "PopOut Market LinkedIn",
    footerLegalStub: "このページは近日更新予定です。",
    footerBackHome: "ホームに戻る",
    aboutPageTitle: "について",
    aboutMainHeading: "PopOutについて：メルボルンの暮らしを、もっとシンプルに、もっとあたたかく",
    aboutOurStoryTitle: "私たちのストーリー",
    aboutOurStoryP1:
      "海を渡ってオーストラリアに来る人には、未来への希望と、故郷から離れた寂しさの両方があるかもしれません。留学生や新しい生活を築く方にとって、日用品の購入や中古取引は簡単であるべきです。しかし言葉の壁、距離、安全性への不安が、それを難しくすることがよくあります。",
    aboutOurStoryP2:
      "PopOutはそこから生まれました。私たちは単なる中古マーケットではなく、メルボルンに着いたときの「最初の立ち寄り先」でありたいと考えています。",
    aboutWhyTitle: "なぜ PopOut？",
    aboutWhyNeighbourhoodTitle: "本当の「近所」取引",
    aboutWhyNeighbourhoodBody:
      "メルボルンに基づく位置情報のおすすめで、家のすぐそばの掘り出し物を見つけられます。売り手が隣の通りに住んでいるかもしれないと分かれば、取引に目に見える信頼が生まれます。",
    aboutWhySafetyTitle: "安全が私たちの核",
    aboutWhySafetyBody:
      "あなたの安全が最優先です。対面取引用にメルボルン中の安全な公共スポットを厳選し、学生身分の確認も推奨しています。PopOut上の取引には、さらに一層の安心があります。",
    aboutWhyCommunicationTitle: "国境のないコミュニケーション",
    aboutWhyCommunicationBody:
      "言語がつながりの障壁になるべきではありません。PopOutには強力なリアルタイム二言語翻訳があります。母語でチャットすれば、相手には自動翻訳が届きます。英語が完璧でなくても、自由に取引し、気の合う友だちを作れます。",
    aboutPrivacyTitle: "プライバシーを守ります",
    aboutPrivacyLead: "PopOutではプライバシーを基本権として扱います。",
    aboutPrivacyMinimalTitle: "最小限のデータ収集",
    aboutPrivacyMinimalBody: "ログイン確認のため、電話番号やメールなど必要な情報だけを収集します。",
    aboutPrivacyStorageTitle: "高水準の保管",
    aboutPrivacyStorageBody: "機微なデータは世界水準の暗号化データベースに保存されます。",
    aboutPrivacyNoTracesTitle: "痕跡を残さない",
    aboutPrivacyNoTracesBody: "個人の位置データを保存・悪用することはありません。安心してご利用ください。",
    aboutPrivacyLinkMore: "プライバシーの詳細",
    aboutVisionTitle: "ビジョン",
    aboutVisionP1:
      "PopOutは「外に出て、近所とつながる」という意味を込めています。この小さなアプリで、大都市の冷たさを和らげ、メルボルンのあらゆる地域に助け合いの温かさを広げたいと考えています。",
    aboutVisionP2:
      "初めての住まいを整える新入生も、次の章に進むプロフェッショナルも、PopOutはそばにいます。",
    aboutVisionP3:
      "PopOutを選んでくださりありがとうございます。より安全で、より結びつきの強いメルボルンのコミュニティを一緒に築きましょう。",
    aboutFeedbackTitle: "ご提案・フィードバック",
    aboutFeedbackLead: "私たちは常に進化しています。アイデアや、ご挨拶だけでもお気軽にご連絡ください:",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
  vi: {
    topDownload: "Tải xuống",
    topLanguage: "Ngôn ngữ",
    languageModalTitle: "Chọn ngôn ngữ của bạn",
    languageModalHint: "PopOut hỗ trợ cộng đồng địa phương với nhiều ngôn ngữ.",
    heroSecondaryPrefix: "Mua bán đồ cũ quanh bạn, bằng",
    heroSecondaryLink: "ngôn ngữ của bạn",
    heroExploreCta: "Khám phá thêm sản phẩm",
    downloadLine: "Tải ứng dụng PopOut Market cho iOS và Android",
    slogan: "mua và bán với những người xung quanh bạn",
    ratingAria: "Đánh giá 4.5 trên 5 sao",
    homeAria: "Trang chủ PopOut",
    appStoreAlt: "Tải trên App Store",
    googlePlayAlt: "Tải trên Google Play",
    marketPageTitle: "Chợ",
    marketAreaModalTitle: "Chọn khu vực",
    marketAreaModalHint: "Chạm vào tên vùng ngoại ô để đổi khu vực hiển thị ở góc trên bên trái.",
    marketAreaPickerAria: "Đổi khu vực",
    marketAreaCloseAria: "Đóng",
    marketPostNoImageAria: "Chưa có ảnh",
    marketBadgeNew: "Mới",
    marketKmShort: "km",
    marketDemoSeller: "Người bán",
    marketFeedListAria: "Danh sách trong khu vực",
    marketSupabaseNotConfiguredTitle: "Tin mẫu",
    marketSupabaseNotConfiguredBody:
      "Đây là nội dung ví dụ để xem giao diện. Khi kết nối dữ liệu thật, tin sẽ hiển thị tại đây.",
    marketSupabaseLoadError: "Không tải được danh sách. Vui lòng thử lại sau.",
    marketSupabaseRetry: "Thử lại",
    marketSupabaseEmpty: "Khu vực này chưa có tin đăng.",
    marketSupabaseLoadingAria: "Đang tải danh sách",
    marketLocationDeniedHint:
      "Cho phép truy cập vị trí trên trình duyệt để xem khoảng cách đường thẳng đến điểm giao hàng.",
    marketLocationUnsupportedHint: "Trình duyệt này không hỗ trợ định vị nên không thể hiển thị khoảng cách.",
    marketLocationRetry: "Yêu cầu vị trí lại",
    marketPostBack: "Quay lại",
    marketPostBackAria: "Quay lại chợ",
    marketPostNotFoundTitle: "Không tìm thấy tin",
    marketPostNotFoundBody: "Tin có thể đã bị gỡ hoặc liên kết không đúng.",
    marketPostListedLabel: "Đăng lúc",
    marketPostAreaLabel: "Khu vực",
    marketPostCategoryLabel: "Danh mục",
    marketPostStatusLabel: "Trạng thái",
    marketPostDeliveryLabel: "Có giao hàng",
    marketPostNegotiableLabel: "Có thể thương lượng",
    marketPostListingRef: "Mã tin",
    marketPostDeliverableBadge: "Có giao hàng",
    marketPostFixedPriceLabel: "Giá cố định",
    marketPostDetailLoadingAria: "Đang tải chi tiết",
    marketPostDescriptionHeading: "Mô tả",
    marketPostPreferredMeetupLabel: "Điểm gặp ưu tiên",
    marketPostOtherItemsHeading: "Các tin khác của người bán",
    marketPostSellerVerifiedLabel: "Đã xác minh tại",
    marketYes: "Có",
    marketNo: "Không",
    marketUnknown: "Không rõ",
    translationDemoTitle: "Nói một lần, ai cũng hiểu.",
    translationDemoSubtitle: "Bạn gửi bằng ngôn ngữ của bạn, đối phương nhận bằng ngôn ngữ của họ — dịch tự động.",
    aiPostDemoTitle: "Chụp ảnh. AI lo phần còn lại.",
    aiPostDemoSubtitle: "Chụp ảnh, AI tự tạo tiêu đề, danh mục và mô tả — bạn chỉ cần nhập giá.",
    aiPostDemoPrice: "Giá",
    aiPostDemoCondition: "Tình trạng",
    aiPostDemoYouFill: "Bạn nhập",
    footerLegalNavAria: "Điều khoản và liên hệ",
    footerCopyright: "Bản quyền © 2026 PopOut Market Pty Ltd. Mọi quyền được bảo lưu.",
    footerAbn: "ABN: 12345678901",
    footerNavAbout: "Giới thiệu PopOut Market",
    footerNavTerms: "Điều khoản sử dụng",
    footerNavPrivacy: "Chính sách quyền riêng tư",
    footerNavContact: "Liên hệ",
    footerSocialRednoteAria: "PopOut Market trên Xiaohongshu (RED)",
    footerSocialInstagramAria: "PopOut Market trên Instagram",
    footerSocialLinkedInAria: "PopOut Market trên LinkedIn",
    footerLegalStub: "Trang này sẽ được cập nhật sớm.",
    footerBackHome: "Về trang chủ",
    aboutPageTitle: "Giới thiệu",
    aboutMainHeading: "Về PopOut: Cuộc sống ở Melbourne đơn giản và ấm áp hơn",
    aboutOurStoryTitle: "Câu chuyện của chúng tôi",
    aboutOurStoryP1:
      "Ai vượt đại dương đến Úc cũng mang trong lòng hy vọng về tương lai — và có lẽ chút cô đơn khi xa nhà. Chúng tôi hiểu rằng, với du học sinh hay người đang xây dựng cuộc sống mới, mua đồ dùng hằng ngày và xử lý đồ cũ lẽ ra phải dễ dàng. Nhưng rào cản ngôn ngữ, khoảng cách và lo ngại về an toàn giao dịch thường khiến mọi thứ phức tạp hơn.",
    aboutOurStoryP2:
      "PopOut ra đời từ đó. Chúng tôi không chỉ là chợ đồ cũ — chúng tôi muốn là \"điểm dừng đầu tiên\" của bạn khi đến Melbourne.",
    aboutWhyTitle: "Vì sao chọn PopOut?",
    aboutWhyNeighbourhoodTitle: "Giao dịch \"hàng xóm\" thật sự",
    aboutWhyNeighbourhoodBody:
      "Gợi ý theo vị trí chính xác tại Melbourne giúp bạn khám phá món hời ngay trước cửa. Biết người bán có thể ở ngay phố bên cạnh tạo nền tảng tin cậy cho mỗi giao dịch.",
    aboutWhySafetyTitle: "An toàn là nguyên tắc cốt lõi",
    aboutWhySafetyBody:
      "Sự an toàn của bạn được đặt lên hàng đầu. Chúng tôi chọn các điểm gặp công cộng an toàn nhất khắp Melbourne và khuyến khích xác minh danh tính sinh viên. Mỗi giao dịch trên PopOut có thêm một lớp đảm bảo.",
    aboutWhyCommunicationTitle: "Kết nối không biên giới",
    aboutWhyCommunicationBody:
      "Ngôn ngữ không nên là rào cản. PopOut có dịch song ngữ thời gian thực mạnh. Trò chuyện bằng tiếng mẹ đẻ — đối phương nhận bản dịch tự động. Dù tiếng Anh chưa hoàn hảo, bạn vẫn có thể giao dịch tự do và kết bạn.",
    aboutPrivacyTitle: "Chúng tôi bảo vệ quyền riêng tư",
    aboutPrivacyLead: "Tại PopOut, quyền riêng tư là quyền cơ bản.",
    aboutPrivacyMinimalTitle: "Thu thập tối thiểu",
    aboutPrivacyMinimalBody:
      "Chúng tôi chỉ thu thập thông tin cần thiết như số điện thoại và email để xác minh đăng nhập.",
    aboutPrivacyStorageTitle: "Lưu trữ tiêu chuẩn cao",
    aboutPrivacyStorageBody: "Dữ liệu nhạy cảm được lưu trong cơ sở dữ liệu mã hóa hàng đầu. ",
    aboutPrivacyNoTracesTitle: "Không lưu dấu vết",
    aboutPrivacyNoTracesBody:
      "Chúng tôi cam kết không lưu trữ hay lạm dụng dữ liệu vị trí riêng tư của bạn. Hãy khám phá với an tâm.",
    aboutPrivacyLinkMore: "Thông tin chi tiết về quyền riêng tư",
    aboutVisionTitle: "Tầm nhìn",
    aboutVisionP1:
      "PopOut có nghĩa là \"bước ra ngoài, kết nối với hàng xóm\". Qua ứng dụng nhỏ này, chúng tôi hy vọng xóa tan sự lạnh lẽo của đô thị và lấp đầy mỗi khu phố Melbourne bằng sự giúp đỡ lẫn nhau.",
    aboutVisionP2:
      "Dù bạn là sinh viên mới dựng nhà, hay người đi làm bắt đầu chương mới, PopOut luôn bên bạn.",
    aboutVisionP3:
      "Cảm ơn bạn đã chọn PopOut. Cùng nhau xây một cộng đồng Melbourne an toàn và gắn kết hơn.",
    aboutFeedbackTitle: "Góp ý & phản hồi",
    aboutFeedbackLead:
      "Chúng tôi luôn phát triển. Nếu bạn có ý tưởng hoặc chỉ muốn chào hỏi, hãy liên hệ:",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
  fr: {
    topDownload: "Télécharger",
    topLanguage: "Langue",
    languageModalTitle: "Choisissez votre langue",
    languageModalHint: "PopOut soutient les communautés locales en plusieurs langues.",
    heroSecondaryPrefix: "Achetez et vendez d'occasion près de vous, dans",
    heroSecondaryLink: "votre langue",
    heroExploreCta: "Explorer plus d'articles",
    downloadLine: "Téléchargez l'application PopOut Market pour iOS et Android",
    slogan: "achetez et vendez avec les personnes autour de vous",
    ratingAria: "Note de 4,5 sur 5 étoiles",
    homeAria: "Accueil PopOut",
    appStoreAlt: "Télécharger sur l'App Store",
    googlePlayAlt: "Obtenir sur Google Play",
    marketPageTitle: "Marché",
    marketAreaModalTitle: "Choisir votre zone",
    marketAreaModalHint: "Appuyez sur une banlieue pour mettre à jour la zone affichée en haut à gauche.",
    marketAreaPickerAria: "Changer de zone",
    marketAreaCloseAria: "Fermer",
    marketPostNoImageAria: "Pas encore de photo",
    marketBadgeNew: "Neuf",
    marketKmShort: "km",
    marketDemoSeller: "Vendeur",
    marketFeedListAria: "Annonces dans la zone",
    marketSupabaseNotConfiguredTitle: "Annonces d’exemple",
    marketSupabaseNotConfiguredBody:
      "Il s’agit d’un aperçu pour la mise en page. Les vraies annonces s’afficheront ici une fois le catalogue connecté.",
    marketSupabaseLoadError: "Impossible de charger les annonces pour le moment. Réessayez dans un instant.",
    marketSupabaseRetry: "Réessayer",
    marketSupabaseEmpty: "Aucune annonce dans cette zone pour le moment.",
    marketSupabaseLoadingAria: "Chargement des annonces",
    marketLocationDeniedHint:
      "Autorisez la localisation dans le navigateur pour voir la distance à vol d’oiseau jusqu’au point de remise.",
    marketLocationUnsupportedHint:
      "Ce navigateur ne prend pas en charge la géolocalisation, la distance ne peut pas s’afficher.",
    marketLocationRetry: "Redemander la position",
    marketPostBack: "Retour",
    marketPostBackAria: "Retour au marché",
    marketPostNotFoundTitle: "Annonce introuvable",
    marketPostNotFoundBody: "Elle a peut-être été retirée, ou le lien est incorrect.",
    marketPostListedLabel: "Publiée le",
    marketPostAreaLabel: "Zone",
    marketPostCategoryLabel: "Catégorie",
    marketPostStatusLabel: "Statut",
    marketPostDeliveryLabel: "Livraison",
    marketPostNegotiableLabel: "Négociable",
    marketPostListingRef: "Réf.",
    marketPostDeliverableBadge: "Livraison possible",
    marketPostFixedPriceLabel: "Prix fixe",
    marketPostDetailLoadingAria: "Chargement de l’annonce",
    marketPostDescriptionHeading: "Description",
    marketPostPreferredMeetupLabel: "Point de remise préféré",
    marketPostOtherItemsHeading: "Autres annonces du vendeur",
    marketPostSellerVerifiedLabel: "Vérifié à",
    marketYes: "Oui",
    marketNo: "Non",
    marketUnknown: "Inconnu",
    translationDemoTitle: "Dites-le une fois. Tout le monde comprend.",
    translationDemoSubtitle: "Envoyez dans votre langue, l'autre reçoit dans la sienne — traduction instantanée.",
    aiPostDemoTitle: "Prenez une photo. L'IA fait le reste.",
    aiPostDemoSubtitle: "Photographiez l'objet et l'IA génère titre, catégorie et description — vous n'avez qu'à fixer le prix.",
    aiPostDemoPrice: "Prix",
    aiPostDemoCondition: "État",
    aiPostDemoYouFill: "À vous",
    footerLegalNavAria: "Politiques et contact",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. Tous droits réservés.",
    footerAbn: "ABN : 12345678901",
    footerNavAbout: "À propos de PopOut Market",
    footerNavTerms: "Conditions d’utilisation",
    footerNavPrivacy: "Politique de confidentialité",
    footerNavContact: "Nous contacter",
    footerSocialRednoteAria: "PopOut Market sur Xiaohongshu (RED)",
    footerSocialInstagramAria: "PopOut Market sur Instagram",
    footerSocialLinkedInAria: "PopOut Market sur LinkedIn",
    footerLegalStub: "Cette page sera mise à jour prochainement.",
    footerBackHome: "Retour à l’accueil",
    aboutPageTitle: "À propos",
    aboutMainHeading: "À propos de PopOut : une vie à Melbourne plus simple et plus chaleureuse",
    aboutOurStoryTitle: "Notre histoire",
    aboutOurStoryP1:
      "Tous ceux qui traversent l’océan pour venir en Australie portent en eux l’espoir d’un avenir — et peut‑être une pointe de solitude loin du pays. Nous savons qu’en tant qu’étudiant international ou nouvel arrivant, acheter l’essentiel et gérer l’occasion devrait être simple. Mais la barrière de la langue, la distance et les craintes pour la sécurité compliquent souvent les choses.",
    aboutOurStoryP2:
      "PopOut est né de ce constat. Nous sommes plus qu’une place de marché d’occasion — nous voulons être votre « premier arrêt » à votre arrivée à Melbourne.",
    aboutWhyTitle: "Pourquoi PopOut ?",
    aboutWhyNeighbourhoodTitle: "Un vrai commerce de « voisinage »",
    aboutWhyNeighbourhoodBody:
      "Des recommandations précises basées sur la localisation à Melbourne vous aident à découvrir des pépites près de chez vous. Savoir que le vendeur habite peut‑être la rue suivante donne à chaque échange une confiance visible.",
    aboutWhySafetyTitle: "La sécurité est notre principe fondamental",
    aboutWhySafetyBody:
      "Votre sécurité passe avant tout. Nous avons sélectionné les lieux publics les plus sûrs pour les remises en main propre et encourageons la vérification du statut étudiant. Chaque transaction sur PopOut comporte une assurance supplémentaire.",
    aboutWhyCommunicationTitle: "Communiquer sans frontières",
    aboutWhyCommunicationBody:
      "La langue ne doit pas être un obstacle. PopOut propose une traduction bilingue en temps réel. Écrivez dans votre langue — l’autre reçoit une traduction automatique. Même si votre anglais n’est pas parfait, vous pouvez échanger et vous faire des amis.",
    aboutPrivacyTitle: "Nous protégeons votre vie privée",
    aboutPrivacyLead: "Chez PopOut, la confidentialité est un droit fondamental.",
    aboutPrivacyMinimalTitle: "Collecte minimale",
    aboutPrivacyMinimalBody:
      "Nous ne collectons que l’essentiel — téléphone et e‑mail pour la vérification de connexion.",
    aboutPrivacyStorageTitle: "Stockage exigeant",
    aboutPrivacyStorageBody: "Vos données sensibles sont stockées dans des bases chiffrées de niveau mondial.",
    aboutPrivacyNoTracesTitle: "Aucune trace",
    aboutPrivacyNoTracesBody:
      "Nous ne conservons ni n’abusons jamais de vos données de localisation privées. Explorez l’appli en toute sérénité.",
    aboutPrivacyLinkMore: "Plus d’informations sur la confidentialité",
    aboutVisionTitle: "Notre vision",
    aboutVisionP1:
      "PopOut signifie « sortez, connectez‑vous avec vos voisins ». Avec cette petite appli, nous voulons briser la froideur des grandes villes et remplir chaque quartier de Melbourne d’entraide.",
    aboutVisionP2:
      "Étudiant qui aménage son premier chez‑soi ou professionnel qui ouvre un nouveau chapitre, PopOut est à vos côtés.",
    aboutVisionP3:
      "Merci d’avoir choisi PopOut. Construisons ensemble une communauté melbournoise plus sûre et plus proche.",
    aboutFeedbackTitle: "Suggestions et retours",
    aboutFeedbackLead:
      "Nous évoluons en permanence. Pour toute idée ou simplement pour dire bonjour, écrivez‑nous :",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
  es: {
    topDownload: "Descargar",
    topLanguage: "Idioma",
    languageModalTitle: "Elige tu idioma",
    languageModalHint: "PopOut conecta comunidades locales en varios idiomas.",
    heroSecondaryPrefix: "Compra y vende artículos de segunda mano cerca de ti, en",
    heroSecondaryLink: "tu idioma",
    heroExploreCta: "Explorar más productos",
    downloadLine: "Descarga la app PopOut Market para iOS y Android",
    slogan: "compra y vende con personas cerca de ti",
    ratingAria: "Valoración de 4,5 de 5 estrellas",
    homeAria: "Inicio de PopOut",
    appStoreAlt: "Descargar en App Store",
    googlePlayAlt: "Consíguelo en Google Play",
    marketPageTitle: "Mercado",
    marketAreaModalTitle: "Elige tu zona",
    marketAreaModalHint: "Toca un suburbio para actualizar la zona que se muestra arriba a la izquierda.",
    marketAreaPickerAria: "Cambiar zona",
    marketAreaCloseAria: "Cerrar",
    marketPostNoImageAria: "Sin foto por ahora",
    marketBadgeNew: "Nuevo",
    marketKmShort: "km",
    marketDemoSeller: "Vendedor",
    marketFeedListAria: "Anuncios en la zona",
    marketSupabaseNotConfiguredTitle: "Anuncios de ejemplo",
    marketSupabaseNotConfiguredBody:
      "Esto es contenido de muestra para ver el diseño. Los anuncios reales aparecerán aquí cuando el catálogo esté conectado.",
    marketSupabaseLoadError: "No se pudieron cargar los anuncios ahora. Inténtalo de nuevo en un momento.",
    marketSupabaseRetry: "Reintentar",
    marketSupabaseEmpty: "Aún no hay anuncios en esta zona.",
    marketSupabaseLoadingAria: "Cargando anuncios",
    marketLocationDeniedHint:
      "Permite la ubicación en el navegador para ver la distancia en línea recta hasta el punto de entrega.",
    marketLocationUnsupportedHint:
      "Este navegador no admite ubicación, así que no se pueden mostrar las distancias.",
    marketLocationRetry: "Volver a pedir ubicación",
    marketPostBack: "Volver",
    marketPostBackAria: "Volver al mercado",
    marketPostNotFoundTitle: "Anuncio no encontrado",
    marketPostNotFoundBody: "Puede haberse eliminado o el enlace no es correcto.",
    marketPostListedLabel: "Publicado",
    marketPostAreaLabel: "Zona",
    marketPostCategoryLabel: "Categoría",
    marketPostStatusLabel: "Estado",
    marketPostDeliveryLabel: "Entrega",
    marketPostNegotiableLabel: "Negociable",
    marketPostListingRef: "Ref.",
    marketPostDeliverableBadge: "Con envío",
    marketPostFixedPriceLabel: "Precio fijo",
    marketPostDetailLoadingAria: "Cargando anuncio",
    marketPostDescriptionHeading: "Descripción",
    marketPostPreferredMeetupLabel: "Punto de encuentro preferido",
    marketPostOtherItemsHeading: "Otros anuncios de este vendedor",
    marketPostSellerVerifiedLabel: "Verificado en",
    marketYes: "Sí",
    marketNo: "No",
    marketUnknown: "Desconocido",
    translationDemoTitle: "Dilo una vez. Todos entienden.",
    translationDemoSubtitle: "Envía en tu idioma, el otro lo recibe en el suyo — traducción instantánea.",
    aiPostDemoTitle: "Haz una foto. La IA hace el resto.",
    aiPostDemoSubtitle: "Toma una foto y la IA genera título, categoría y descripción — tú solo pones el precio.",
    aiPostDemoPrice: "Precio",
    aiPostDemoCondition: "Estado",
    aiPostDemoYouFill: "Tú rellenas",
    footerLegalNavAria: "Políticas y contacto",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. Todos los derechos reservados.",
    footerAbn: "ABN: 12345678901",
    footerNavAbout: "Acerca de PopOut Market",
    footerNavTerms: "Términos de uso",
    footerNavPrivacy: "Política de privacidad",
    footerNavContact: "Contáctanos",
    footerSocialRednoteAria: "PopOut Market en Xiaohongshu (RED)",
    footerSocialInstagramAria: "PopOut Market en Instagram",
    footerSocialLinkedInAria: "PopOut Market en LinkedIn",
    footerLegalStub: "Esta página se actualizará pronto.",
    footerBackHome: "Volver al inicio",
    aboutPageTitle: "Acerca de",
    aboutMainHeading: "Acerca de PopOut: una vida en Melbourne más simple y cálida",
    aboutOurStoryTitle: "Nuestra historia",
    aboutOurStoryP1:
      "Quien cruza el océano hacia Australia lleva esperanza en el futuro — y quizá un poco de soledad lejos de casa. Entendemos que, como estudiante internacional o persona que construye una vida nueva, comprar lo esencial y gestionar lo de segunda mano debería ser fácil. Pero la barrera del idioma, la distancia y la preocupación por la seguridad a menudo lo complican.",
    aboutOurStoryP2:
      "PopOut nació de ahí. Somos más que un mercado de segunda mano — queremos ser tu «primera parada» al llegar a Melbourne.",
    aboutWhyTitle: "¿Por qué PopOut?",
    aboutWhyNeighbourhoodTitle: "Comercio de verdad de «vecindario»",
    aboutWhyNeighbourhoodBody:
      "Recomendaciones precisas por ubicación en Melbourne te ayudan a descubrir joyas a la vuelta de la esquina. Saber que el vendedor puede vivir en la calle de al lado da a cada intercambio una confianza visible.",
    aboutWhySafetyTitle: "La seguridad es nuestro principio central",
    aboutWhySafetyBody:
      "Tu seguridad es lo primero. Hemos elegido los lugares públicos más seguros de Melbourne para las entregas en persona y animamos a verificar la condición de estudiante. Cada transacción en PopOut lleva una capa extra de tranquilidad.",
    aboutWhyCommunicationTitle: "Comunicación sin fronteras",
    aboutWhyCommunicationBody:
      "El idioma no debe ser una barrera. PopOut ofrece traducción bilingüe en tiempo real. Escribe en tu lengua — la otra persona recibe traducción automática. Aunque tu inglés no sea perfecto, puedes comerciar con libertad y hacer amigos.",
    aboutPrivacyTitle: "Protegemos tu privacidad",
    aboutPrivacyLead: "En PopOut, la privacidad es un derecho fundamental.",
    aboutPrivacyMinimalTitle: "Recopilación mínima",
    aboutPrivacyMinimalBody:
      "Solo recopilamos lo esencial, como teléfono y correo, para verificar el inicio de sesión.",
    aboutPrivacyStorageTitle: "Almacenamiento de alto nivel",
    aboutPrivacyStorageBody: "Tus datos sensibles se guardan en bases cifradas de primer nivel.",
    aboutPrivacyNoTracesTitle: "Sin rastros",
    aboutPrivacyNoTracesBody:
      "Prometemos no almacenar ni abusar de tus datos de ubicación privados. Explora con tranquilidad.",
    aboutPrivacyLinkMore: "Más información sobre privacidad",
    aboutVisionTitle: "Nuestra visión",
    aboutVisionP1:
      "PopOut significa «sal fuera, conecta con tus vecinos». Con esta pequeña app queremos romper la indiferencia de la gran ciudad y llenar cada barrio de Melbourne con la calidez de la ayuda mutua.",
    aboutVisionP2:
      "Si eres estudiante montando tu primer hogar o profesional abriendo un nuevo capítulo, PopOut está a tu lado.",
    aboutVisionP3:
      "Gracias por elegir PopOut. Juntos construyamos una comunidad en Melbourne más segura y unida.",
    aboutFeedbackTitle: "Sugerencias y comentarios",
    aboutFeedbackLead:
      "Seguimos evolucionando. Si tienes ideas o solo quieres saludar, escríbenos:",
    aboutSupportEmail: "ContactUs@popoutmarket.com.au",
  },
};
