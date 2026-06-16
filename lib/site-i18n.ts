export type Locale = "en" | "zh-Hans" | "zh-Hant" | "ko" | "ja" | "vi" | "fr" | "es";

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
  heroSecondarySuffix: string;
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
  /** Empty-suburb notice; {suburb} is replaced with the suburb name. */
  marketNearbyNotice: string;
  marketLocationDeniedHint: string;
  marketLocationUnsupportedHint: string;
  marketLocationRetry: string;
  marketPostBack: string;
  marketPostBackAria: string;
  marketPostNotFoundTitle: string;
  marketPostNotFoundBody: string;
  marketPostListedLabel: string;
  marketPostAreaLabel: string;
  marketPostContactSellerCta: string;
  marketPostListedInOn: string;
  marketPostListedIn: string;
  marketPostListedOn: string;
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
  autoReplyDemoTitle: string;
  autoReplyDemoSubtitle: string;
  autoReplyDemoInboxTitle: string;
  autoReplyDemoTabBuying: string;
  autoReplyDemoTabSelling: string;
  autoReplyDemoBadge: string;
  autoReplyDemoTimeNow: string;
  autoReplyDemoTime1Min: string;
  autoReplyDemoMsgMeet: string;
  autoReplyDemoMsgPrice: string;
  autoReplyDemoMsgSelling: string;
  autoReplyDemoMsgGreeting: string;
  aiPostDemoPrice: string;
  aiPostDemoCondition: string;
  aiPostDemoYouFill: string;
  scheduleDemoTitle: string;
  scheduleDemoSubtitle: string;
  scheduleDemoDate: string;
  scheduleDemoTime: string;
  scheduleDemoLocation: string;
  scheduleDemoScheduled: string;
  scheduleDemoScanHint: string;
  scheduleDemoVerified: string;
  studentVerifyTitle: string;
  studentVerifySubtitle: string;
  studentVerifyEmailLabel: string;
  studentVerifyUniversity: string;
  studentVerifyVerifying: string;
  studentVerifyVerified: string;
  studentVerifyBadge: string;
  safetyZoneTitle: string;
  safetyZoneSubtitle: string;
  safetyZoneNearLabel: string;
  safetyZoneFinding: string;
  safetyZoneListTitle: string;
  safetyZoneBadgeCctv: string;
  safetyZoneBadgeBusy: string;
  safetyZoneBadgeLit: string;
  footerLegalNavAria: string;
  footerCopyright: string;
  footerAcn: string;
  footerNavAbout: string;
  footerNavTerms: string;
  footerNavPrivacy: string;
  footerNavChildSafety: string;
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
  legalEnglishAuthoritative: string;
  languageModalCloseAria: string;
  carouselGoToItemAria: string;
  demoListingWoodenDiningChair: string;
  demoListingMountainBike: string;
  demoListingAcousticGuitar: string;
  demoListingWirelessHeadphones: string;
  demoListingTextbookBundle: string;
  demoListingSmartWatch: string;
  demoListingGameController: string;
  heroNowInConnector: string;
  heroLocationSuffix: string;
  heroTitleTemplate: string;
  heroRotatingItems: string[];
  contactBack: string;
  contactHint: string;
  contactTitlePlaceholder: string;
  contactMainPlaceholder: string;
  contactSend: string;
  contactSending: string;
  contactSuccess: string;
  contactErrorRequired: string;
  contactErrorFallback: string;
  faqTitle: string;
  faqIntro: string;
  faqDisclaimerTitle: string;
  faqDisclaimerBody: string;
  faqComparisonCta: string;
  marketSeoIntroPrefix: string;
  marketSeoIntroNearLabel: string;
  marketSuburbMapTitle: string;
  marketPostMeetupMapAlt: string;
  aiPostDemoFieldTitle: string;
  suburbBackToHub: string;
  comparisonHubTitle: string;
  comparisonHubIntro: string;
  comparisonHubPurposeTitle: string;
  comparisonHubPurposeBody: string;
  comparisonHubDisclaimerTitle: string;
  comparisonHubDisclaimerBody: string;
  comparisonHubCardsTitle: string;
  comparisonHubCardsHint: string;
  comparisonHubCardFbBody: string;
  comparisonHubCardFbCta: string;
  comparisonHubCardGumtreeBody: string;
  comparisonHubCardGumtreeCta: string;
  comparisonGumtreeH1: string;
  comparisonGumtreeLead: string;
  comparisonGumtreeDisclaimer: string;
  comparisonGumtreeSection1Title: string;
  comparisonGumtreeSection1Body: string;
  comparisonGumtreeSection2Title: string;
  comparisonGumtreeSection2Body: string;
  comparisonGumtreeSection3Title: string;
  comparisonGumtreeSection3Body: string;
  comparisonGumtreeSection4Title: string;
  comparisonGumtreeSection4Body: string;
  comparisonGumtreeTableTitle: string;
  comparisonGumtreeTableNote: string;
  comparisonGumtreeFeature1Title: string;
  comparisonGumtreeFeature1Popout: string;
  comparisonGumtreeFeature1Other: string;
  comparisonGumtreeFeature2Title: string;
  comparisonGumtreeFeature2Popout: string;
  comparisonGumtreeFeature2Other: string;
  comparisonGumtreeFeature3Title: string;
  comparisonGumtreeFeature3Popout: string;
  comparisonGumtreeFeature3Other: string;
  comparisonGumtreeFeature4Title: string;
  comparisonGumtreeFeature4Popout: string;
  comparisonGumtreeFeature4Other: string;
  comparisonGumtreeFinalTitle: string;
  comparisonGumtreeFinalBody: string;
  comparisonBackLabel: string;
  comparisonGumtreeCard1Title: string;
  comparisonGumtreeCard1Body: string;
  comparisonGumtreeCard2Title: string;
  comparisonGumtreeCard2Body: string;
  comparisonGumtreeCard3Title: string;
  comparisonGumtreeCard3Body: string;
  comparisonFbH1: string;
  comparisonFbLead: string;
  comparisonFbDisclaimer: string;
  comparisonFbSection1Title: string;
  comparisonFbSection1Body: string;
  comparisonFbSection2Title: string;
  comparisonFbSection2Body: string;
  comparisonFbSection3Title: string;
  comparisonFbSection3Body: string;
  comparisonFbSection4Title: string;
  comparisonFbSection4Body: string;
  comparisonFbTableTitle: string;
  comparisonFbTableNote: string;
  comparisonFbFeature1Title: string;
  comparisonFbFeature1Popout: string;
  comparisonFbFeature1Other: string;
  comparisonFbFeature2Title: string;
  comparisonFbFeature2Popout: string;
  comparisonFbFeature2Other: string;
  comparisonFbFeature3Title: string;
  comparisonFbFeature3Popout: string;
  comparisonFbFeature3Other: string;
  comparisonFbFeature4Title: string;
  comparisonFbFeature4Popout: string;
  comparisonFbFeature4Other: string;
  comparisonFbFinalTitle: string;
  comparisonFbFinalBody: string;
  comparisonFbCard1Title: string;
  comparisonFbCard1Body: string;
  comparisonFbCard2Title: string;
  comparisonFbCard2Body: string;
  comparisonFbCard3Title: string;
  comparisonFbCard3Body: string;
  notFoundTitle: string;
  notFoundDescription: string;
};

export const COPY: Record<Locale, SiteCopy> = {
  en: {
    topDownload: "Download",
    topLanguage: "Language",
    languageModalTitle: "Choose your language",
    languageModalHint: "PopOut supports local communities in multiple languages.",
    heroSecondaryPrefix: "Buy and sell with neighbours nearby",
    heroSecondaryLink: "",
    heroSecondarySuffix: "",
    heroExploreCta: "Explore more items near you",
    downloadLine: "Download the PopOut Market app for iOS or Android",
    slogan: "buy and sell with people around you",
    ratingAria: "Rating 5.0 out of 5 on the App Store",
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
    marketNearbyNotice: "No listings in {suburb} yet, showing nearby",
    marketLocationDeniedHint:
      "Allow location in your browser to see straight-line distance to each item’s meet-up point.",
    marketLocationUnsupportedHint:
      "This browser does not support location, so distances cannot be shown.",
    marketLocationRetry: "Ask for location again",
    marketPostBack: "Back",
    marketPostBackAria: "Back to Market",
    marketPostNotFoundTitle: "Listing not found",
    marketPostNotFoundBody: "It may have been removed, or the link may be incorrect.",
    marketPostListedLabel: "Listed",
    marketPostAreaLabel: "Area",
    marketPostContactSellerCta: "Contact the seller in the app",
    marketPostListedInOn: "Listed in {suburb} on {date}",
    marketPostListedIn: "Listed in {suburb}",
    marketPostListedOn: "Listed on {date}",
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
    translationDemoTitle: "Say it once. *Everyone* understands",
    translationDemoSubtitle:
      "Your messages are translated instantly — type in your language, they read in theirs.",
    aiPostDemoTitle: "Snap a photo. AI does the *rest*",
    aiPostDemoSubtitle:
      "Take a photo and AI generates the title, category, and description — you just set the price.",
    autoReplyDemoTitle: "No more *time wasters*",
    autoReplyDemoSubtitle: 'AI answers "Is it still available?"',
    autoReplyDemoInboxTitle: "Messages",
    autoReplyDemoTabBuying: "Buying",
    autoReplyDemoTabSelling: "Selling",
    autoReplyDemoBadge: "Auto-reply on",
    autoReplyDemoTimeNow: "just now",
    autoReplyDemoTime1Min: "1 min",
    autoReplyDemoMsgMeet: "What time should we meet?",
    autoReplyDemoMsgPrice: "It's $50. Are you interested?",
    autoReplyDemoMsgSelling: "Selling for $30. Interested?",
    autoReplyDemoMsgGreeting: "Hi! The leather office chair is still available.",
    aiPostDemoPrice: "Price",
    aiPostDemoCondition: "Condition",
    aiPostDemoYouFill: "You fill in",
    scheduleDemoTitle: "Meet with confidence.",
    scheduleDemoSubtitle:
      "Pick a time and place, meet your buyer, and scan their QR code to confirm — reducing no-shows and building a trusted community.",
    scheduleDemoDate: "Date",
    scheduleDemoTime: "Time",
    scheduleDemoLocation: "Meet-up spot",
    scheduleDemoScheduled: "Scheduled",
    scheduleDemoScanHint: "Scan to verify",
    scheduleDemoVerified: "Meetup Verified",
    studentVerifyTitle: "Verified students. Trusted trades.",
    studentVerifySubtitle:
      "Verify your student email to earn a trust badge — making every transaction in the community safer and more reliable.",
    studentVerifyEmailLabel: "Student email",
    studentVerifyUniversity: "University",
    studentVerifyVerifying: "Verifying…",
    studentVerifyVerified: "Email Verified",
    studentVerifyBadge: "Verified Student",
    safetyZoneTitle: "Safer meetups. By design.",
    safetyZoneSubtitle:
      "When you choose where to meet, we suggest nearby Safety Zones — busy, well-lit spots with cameras — so trades feel calmer and our community stays stronger.",
    safetyZoneNearLabel: "Meet-up area",
    safetyZoneFinding: "Scanning for Safety Zones…",
    safetyZoneListTitle: "Suggested spots",
    safetyZoneBadgeCctv: "CCTV",
    safetyZoneBadgeBusy: "Busy",
    safetyZoneBadgeLit: "Well-lit",
    footerLegalNavAria: "Policies and contact",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "About PopOut Market",
    footerNavTerms: "Terms of Use",
    footerNavPrivacy: "Privacy Policy",
    footerNavChildSafety: "Child Safety",
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
      'PopOut was born from this. We are more than a second-hand marketplace — we want to be your "first stop" when you arrive in Melbourne.',
    aboutWhyTitle: "Why PopOut?",
    aboutWhyNeighbourhoodTitle: 'True "Neighbourhood" Trading',
    aboutWhyNeighbourhoodBody:
      "Precise location-based recommendations in Melbourne help you discover hidden gems right on your doorstep. Knowing the seller might live on the next street over gives every transaction a foundation of trust you can see.",
    aboutWhySafetyTitle: "Safety Is Our Core Principle",
    aboutWhySafetyBody:
      "Your safety comes first. We suggest busy, well-lit public spots across Melbourne as safer places for in-person trades, and we encourage users to verify their student identity. Every transaction on PopOut comes with an extra layer of assurance.",
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
      "Your sensitive data is stored in encrypted databases, in transit and at rest.",
    aboutPrivacyNoTracesTitle: "No Traces Left",
    aboutPrivacyNoTracesBody:
      "We don't track or retain your location history — GPS is used only briefly to verify your suburb and is then deleted. Explore with peace of mind.",
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
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "The English version of this document is authoritative.",
    languageModalCloseAria: "Close language picker",
    carouselGoToItemAria: "Go to item {index}",
    demoListingWoodenDiningChair: "Wooden Dining Chair",
    demoListingMountainBike: "Mountain Bike",
    demoListingAcousticGuitar: "Acoustic Guitar",
    demoListingWirelessHeadphones: "Wireless Headphones",
    demoListingTextbookBundle: "Textbook Bundle",
    demoListingSmartWatch: "Smart Watch",
    demoListingGameController: "Game Controller",
    heroNowInConnector: ", now in ",
    heroTitleTemplate: "Find used {item} in {brand}",
    heroRotatingItems: ["furniture", "electronics", "bikes", "textbooks", "kitchenware", "clothes"],
    heroLocationSuffix: "",
    contactBack: "Back Home",
    contactHint: "Tell us your question or partnership request and we will reply by email.",
    contactTitlePlaceholder: "Enter a short title",
    contactMainPlaceholder: "Write your message",
    contactSend: "Send",
    contactSending: "Sending...",
    contactSuccess: "Sent successfully. We will get back to you soon.",
    contactErrorRequired: "Please fill in both Title and Main.",
    contactErrorFallback: "Unable to send right now. Please try again.",
    faqTitle: "PopOut FAQ",
    faqIntro:
      "These eight FAQs explain how PopOut supports faster posting, multilingual communication, safer transactions, and graduation season selling in Melbourne.",
    faqDisclaimerTitle: "Official note",
    faqDisclaimerBody:
      "This page is for product information only and does not constitute legal, financial, or safety guarantees. Features may vary by app version, region, and account context.",
    faqComparisonCta: "Compare with other markets",
    marketSeoIntroPrefix: "Buy and sell used items in",
    marketSeoIntroNearLabel: "Showing items in",
    marketSuburbMapTitle: "Map of {suburb}",
    marketPostMeetupMapAlt: "Meet-up location map",
    aiPostDemoFieldTitle: "Title",
    suburbBackToHub: "Back to Melbourne suburbs",
    comparisonHubTitle: "Comparison with Other Second-Hand Markets",
    comparisonHubIntro:
      "This page helps users understand practical differences between PopOut and other commonly used second-hand marketplaces. The goal is a friendly, transparent guide so you can choose what fits your workflow.",
    comparisonHubPurposeTitle: "Why this page exists",
    comparisonHubPurposeBody:
      "Many users struggle with repetitive form filling, language barriers, and handling a high volume of repetitive buyer messages. We present PopOut's core experience in a structured format so feature differences are easier to evaluate.",
    comparisonHubDisclaimerTitle: "Official note and disclaimer",
    comparisonHubDisclaimerBody:
      "This page is for product education only. It is not legal advice and does not intend to discredit any third-party platform. Third-party trademarks and product names belong to their respective owners. Features can change over time; please verify current details on each platform's official channels.",
    comparisonHubCardsTitle: "Open detailed comparisons",
    comparisonHubCardsHint: "Choose a platform below for full article-style comparison",
    comparisonHubCardFbBody: "Compare listing speed, multilingual messaging, and AI auto-reply.",
    comparisonHubCardFbCta: "Read PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "Compare AI listing setup, student verification, and AI auto-reply.",
    comparisonHubCardGumtreeCta: "Read PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree: Experience Comparison",
    comparisonGumtreeLead:
      "This page compares real-world workflow differences around listing setup, multilingual communication, and AI auto-reply in Melbourne second-hand use cases.",
    comparisonGumtreeDisclaimer:
      "Disclaimer: this page is for user education and product communication only. It is not legal advice. Gumtree and related marks belong to their respective owners. Third-party features may change over time.",
    comparisonGumtreeSection1Title: "1) AI-assisted listing setup",
    comparisonGumtreeSection1Body:
      "PopOut can draft title, description, and category suggestions from item photos. Users then review, set condition and target price, and choose options like delivery and negotiation to publish more quickly.",
    comparisonGumtreeSection2Title: "2) Built-in multilingual flow",
    comparisonGumtreeSection2Body:
      "PopOut supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese across posting and messaging, reducing language friction in a diverse city environment.",
    comparisonGumtreeSection3Title: "3) AI auto-reply that saves sellers time",
    comparisonGumtreeSection3Body:
      "PopOut includes an AI auto-reply feature. It is simple for now and we are actively improving it, with stronger capabilities coming soon. Today it handles the high volume of repetitive, low-value messages and answers questions already covered in your listing. For anything uncertain or not written in your post, the AI does not guess — it leaves those for you to answer the buyer yourself, so you can focus on the questions that genuinely matter.",
    comparisonGumtreeSection4Title: "4) Student verification for campus communities",
    comparisonGumtreeSection4Body:
      "A student verification pathway helps improve trust and matching quality for university and accommodation-based transactions in Melbourne.",
    comparisonGumtreeTableTitle: "Feature snapshot (user-oriented)",
    comparisonGumtreeTableNote:
      "Note: the right column describes broad public usage patterns and may vary by account, region, or product updates.",
    comparisonGumtreeFeature1Title: "Time to prepare a listing",
    comparisonGumtreeFeature1Popout: "AI drafts key fields first, user finalizes details",
    comparisonGumtreeFeature1Other: "Commonly more manual from-start form work",
    comparisonGumtreeFeature2Title: "Language support in trading flow",
    comparisonGumtreeFeature2Popout: "Multilingual understanding across posts and chat",
    comparisonGumtreeFeature2Other:
      "Cross-language communication often depends on user-side translation",
    comparisonGumtreeFeature3Title: "AI auto-reply",
    comparisonGumtreeFeature3Popout:
      "AI handles repetitive questions and details already in your listing; leaves uncertain ones for you",
    comparisonGumtreeFeature3Other:
      "Replies are fully manual, with no AI help to filter repetitive messages",
    comparisonGumtreeFeature4Title: "Student-specific trust mechanism",
    comparisonGumtreeFeature4Popout: "Student verification helps campus-related matching",
    comparisonGumtreeFeature4Other: "Dedicated student identity pathway may be limited",
    comparisonGumtreeFinalTitle: "Recommendation",
    comparisonGumtreeFinalBody:
      "If your priorities are posting speed, multilingual clarity, and AI auto-reply that saves time, PopOut may be the better fit. Validate current features based on your own region and usage.",
    comparisonBackLabel: "Back to comparisons",
    comparisonGumtreeCard1Title: "Fast AI Posting",
    comparisonGumtreeCard1Body: "Less category hunting and form repetition",
    comparisonGumtreeCard2Title: "Multilingual Trade",
    comparisonGumtreeCard2Body: "Supports key cross-language transaction flows",
    comparisonGumtreeCard3Title: "AI auto-reply",
    comparisonGumtreeCard3Body: "AI answers repetitive questions to save your time",
    comparisonFbH1: "PopOut vs Facebook Marketplace: Experience Comparison",
    comparisonFbLead:
      "This article compares practical workflow differences in listing setup, multilingual communication, and AI auto-reply. The intent is to help users choose a marketplace flow that fits everyday needs.",
    comparisonFbDisclaimer:
      "Disclaimer: this page is for product education only, not legal advice or a negative statement about any third-party platform. Facebook Marketplace and related marks belong to their respective owners. Feature availability may vary by region, account type, and product updates.",
    comparisonFbSection1Title: "1) AI-assisted listing from photos",
    comparisonFbSection1Body:
      "On PopOut, uploading item photos can generate draft title, description, and category suggestions. Users review, add context, set condition and price, then publish faster with fewer manual steps.",
    comparisonFbSection2Title: "2) Real-time multilingual communication",
    comparisonFbSection2Body:
      "PopOut supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese. Posts and chats can be read in each user's preferred language flow.",
    comparisonFbSection3Title: "3) AI auto-reply that saves sellers time",
    comparisonFbSection3Body:
      "PopOut includes an AI auto-reply feature. It is simple for now and we are actively improving it, with stronger capabilities coming soon. Today it handles repetitive, low-value messages and answers questions already covered in your listing. For anything uncertain or not written in your post, the AI does not guess — it leaves those for you to reply to the buyer personally, so your time goes to the questions that genuinely matter.",
    comparisonFbSection4Title: "4) Student verification pathway in Melbourne",
    comparisonFbSection4Body:
      "For student communities and accommodation clusters, PopOut includes a student verification channel to improve trust and discoverability in campus-related transactions.",
    comparisonFbTableTitle: "Feature snapshot (user-oriented)",
    comparisonFbTableNote:
      "Note: the right column reflects common public usage patterns and may change over time.",
    comparisonFbFeature1Title: "Listing start speed",
    comparisonFbFeature1Popout: "AI drafts title/description/category from photos",
    comparisonFbFeature1Other: "Often relies on manual form filling and category selection",
    comparisonFbFeature2Title: "Multilingual messaging",
    comparisonFbFeature2Popout:
      "Post and chat content can be understood across supported languages",
    comparisonFbFeature2Other: "Cross-language communication often depends on self-translation",
    comparisonFbFeature3Title: "AI auto-reply",
    comparisonFbFeature3Popout:
      "AI replies to repetitive questions and listing details; uncertain ones wait for you",
    comparisonFbFeature3Other:
      "Messaging is fully manual, with no AI help to handle repetitive questions",
    comparisonFbFeature4Title: "Student-focused trust layer",
    comparisonFbFeature4Popout: "Student verification pathway for campus/accommodation matching",
    comparisonFbFeature4Other: "Student-specific identity flow is commonly limited or unavailable",
    comparisonFbFinalTitle: "How to use this comparison",
    comparisonFbFinalBody:
      "If your priorities are faster posting, smoother multilingual communication, and AI auto-reply that handles repetitive questions, PopOut's workflow may fit better. Always verify current feature details in your own usage context.",
    comparisonFbCard1Title: "AI Listing Assist",
    comparisonFbCard1Body: "Photo-based draft title and description",
    comparisonFbCard2Title: "Live Translation",
    comparisonFbCard2Body: "Smoother cross-language posts and chat",
    comparisonFbCard3Title: "AI auto-reply",
    comparisonFbCard3Body: "AI handles repetitive questions so you focus on real ones",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you requested does not exist or is not publicly accessible.",
  },
  "zh-Hans": {
    topDownload: "下载",
    topLanguage: "语言",
    languageModalTitle: "选择你的语言",
    languageModalHint: "PopOut 以多语言连接本地社区。",
    heroSecondaryPrefix: "用",
    heroSecondaryLink: "中文",
    heroSecondarySuffix: "，和身边的邻居轻松买卖二手好物",
    heroExploreCta: "探索更多商品",
    downloadLine: "下载 PopOut Market 应用，支持 iOS 和 Android",
    slogan: "与身边的人轻松买卖",
    ratingAria: "App Store 评分 5.0（满分 5 分）",
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
    marketNearbyNotice: "{suburb}暂时没有商品，正在显示附近的商品",
    marketLocationDeniedHint: "在浏览器中允许位置权限后，可显示到见面地点的直线距离。",
    marketLocationUnsupportedHint: "当前浏览器不支持定位，无法显示距离。",
    marketLocationRetry: "再次请求位置",
    marketPostBack: "返回",
    marketPostBackAria: "返回市集",
    marketPostNotFoundTitle: "找不到该商品",
    marketPostNotFoundBody: "可能已下架，或链接不正确。",
    marketPostListedLabel: "发布时间",
    marketPostAreaLabel: "区域",
    marketPostContactSellerCta: "在 App 里联系卖家",
    marketPostListedInOn: "{date} 发布于 {suburb}",
    marketPostListedIn: "发布于 {suburb}",
    marketPostListedOn: "{date} 发布",
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
    translationDemoTitle: "说一次，*所有人*都能懂",
    translationDemoSubtitle: "你用你的语言发消息，对方用他的语言收到——翻译全自动。",
    aiPostDemoTitle: "拍张照，AI 帮你*搞定*",
    aiPostDemoSubtitle: "拍照后 AI 自动生成标题、分类和描述，你只需填价格和状态。",
    autoReplyDemoTitle: "常见问题交给 AI *真正买家*由你来聊",
    autoReplyDemoSubtitle: "买家一问，AI 立刻回复",
    autoReplyDemoInboxTitle: "消息",
    autoReplyDemoTabBuying: "我买的",
    autoReplyDemoTabSelling: "我卖的",
    autoReplyDemoBadge: "自动回复已开",
    autoReplyDemoTimeNow: "刚刚",
    autoReplyDemoTime1Min: "1分钟前",
    autoReplyDemoMsgMeet: "我们几点见面呀？",
    autoReplyDemoMsgPrice: "$50，有兴趣吗？",
    autoReplyDemoMsgSelling: "$30出，有兴趣吗？",
    autoReplyDemoMsgGreeting: "你好！这把真皮办公椅还在的哦。",
    aiPostDemoPrice: "价格",
    aiPostDemoCondition: "成色",
    aiPostDemoYouFill: "你来填",
    scheduleDemoTitle: "每一次见面，都安心。",
    scheduleDemoSubtitle: "选好时间和地点，见面后扫码确认——减少爽约，共建信任社区。",
    scheduleDemoDate: "日期",
    scheduleDemoTime: "时间",
    scheduleDemoLocation: "见面地点",
    scheduleDemoScheduled: "已预约",
    scheduleDemoScanHint: "扫码验证",
    scheduleDemoVerified: "见面已确认",
    studentVerifyTitle: "认证学生，可信交易。",
    studentVerifySubtitle: "通过学生邮箱验证获取信任徽章——让社区里的每一笔交易更安全、更放心。",
    studentVerifyEmailLabel: "学生邮箱",
    studentVerifyUniversity: "所属大学",
    studentVerifyVerifying: "验证中…",
    studentVerifyVerified: "邮箱已验证",
    studentVerifyBadge: "已认证学生",
    safetyZoneTitle: "更安心的见面，从选址开始。",
    safetyZoneSubtitle:
      "选定见面区域后，我们会推荐附近的安全区域——人流多、光线好、有监控的公共场所，让交易更踏实，社区更可信。",
    safetyZoneNearLabel: "见面区域",
    safetyZoneFinding: "正在扫描安全区域…",
    safetyZoneListTitle: "推荐地点",
    safetyZoneBadgeCctv: "监控",
    safetyZoneBadgeBusy: "人流多",
    safetyZoneBadgeLit: "光线好",
    footerLegalNavAria: "条款与联系",
    footerCopyright: "版权所有 © 2026 PopOut Market Pty Ltd。保留所有权利。",
    footerAcn: "ACN：696 464 945",
    footerNavAbout: "关于 PopOut Market",
    footerNavTerms: "使用条款",
    footerNavPrivacy: "隐私政策",
    footerNavChildSafety: "儿童安全",
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
      "你的安全高于一切。我们会推荐墨尔本人多、明亮的公共场所作为更安全的面交地点，并鼓励用户完成学生身份验证。在 PopOut 上的每一笔交易，都多一层安心保障。",
    aboutWhyCommunicationTitle: "沟通，再无国界",
    aboutWhyCommunicationBody:
      "语言不该成为连接的障碍。PopOut 配备强大的实时双语翻译系统。用你的母语聊天——对方会收到自动翻译。即使英语还不够流利，你也可以在这里自由交易、结识志同道合的朋友。",
    aboutPrivacyTitle: "我们守护您的隐私",
    aboutPrivacyLead: "在 PopOut，我们视隐私为基本权利。",
    aboutPrivacyMinimalTitle: "极简数据采集",
    aboutPrivacyMinimalBody: "我们只收集登录验证所必需的信息，例如手机号与邮箱。",
    aboutPrivacyStorageTitle: "高标准存储",
    aboutPrivacyStorageBody: "你的敏感数据存放在加密数据库中（传输与存储均加密）。",
    aboutPrivacyNoTracesTitle: "不留痕迹",
    aboutPrivacyNoTracesBody:
      "我们不会追踪或保留你的位置历史——GPS 仅用于短暂验证你所在的城区，之后即删除。请放心探索。",
    aboutPrivacyLinkMore: "更多详细的隐私介绍",
    aboutVisionTitle: "我们的愿景",
    aboutVisionP1:
      "PopOut 的名字寓意着「走出家门，连结邻里」。通过这款小小的应用，我们希望打破大城市中的冷漠，让墨尔本的每一个社区都充满互助的温度。",
    aboutVisionP2:
      "无论你是初来乍到布置第一个家的新生，还是开启人生下一章的职场人，PopOut 都愿陪在你身边。",
    aboutVisionP3: "感谢你选择 PopOut。让我们一起，建设更安全、更紧密的墨尔本社区。",
    aboutFeedbackTitle: "建议与反馈",
    aboutFeedbackLead: "我们始终在进化。如果你有任何想法，或仅仅是想和我们打个招呼，请随时联络：",
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "本文件以英文版本为准。",
    languageModalCloseAria: "关闭语言选择",
    carouselGoToItemAria: "跳转到第 {index} 项",
    demoListingWoodenDiningChair: "实木餐椅",
    demoListingMountainBike: "山地自行车",
    demoListingAcousticGuitar: "原声吉他",
    demoListingWirelessHeadphones: "无线耳机",
    demoListingTextbookBundle: "教材套装",
    demoListingSmartWatch: "智能手表",
    demoListingGameController: "游戏手柄",
    heroNowInConnector: "，现已上线 ",
    heroTitleTemplate: "在 {brand} 淘二手{item}",
    heroRotatingItems: ["家具", "电子产品", "自行车", "教材", "厨具", "衣物"],
    heroLocationSuffix: "",
    contactBack: "返回首页",
    contactHint: "留下你的问题或合作需求，我们会尽快通过邮箱回复。",
    contactTitlePlaceholder: "请输入标题",
    contactMainPlaceholder: "请输入详细内容",
    contactSend: "发送",
    contactSending: "发送中...",
    contactSuccess: "已发送成功，我们会尽快回复你。",
    contactErrorRequired: "请先填写 Title 和 Main。",
    contactErrorFallback: "发送失败，请稍后重试。",
    faqTitle: "PopOut 常见问题",
    faqIntro:
      "这里整理了用户最常问的 8 个问题，帮助你快速理解 PopOut 在发帖效率、多语言沟通、交易安全与毕业季出货上的核心能力。",
    faqDisclaimerTitle: "官方说明",
    faqDisclaimerBody:
      "本页用于产品信息说明，不构成法律、财务或安全承诺。不同地区与版本的功能可能存在差异，请以 App 内实际页面和官方公告为准。",
    faqComparisonCta: "查看与其他平台对比",
    marketSeoIntroPrefix: "买卖二手物品 ·",
    marketSeoIntroNearLabel: "正在显示",
    marketSuburbMapTitle: "{suburb}地图",
    marketPostMeetupMapAlt: "交易地点地图",
    aiPostDemoFieldTitle: "标题",
    suburbBackToHub: "返回墨尔本区域页",
    comparisonHubTitle: "对比其他二手平台",
    comparisonHubIntro:
      "这个页面用于帮助你快速理解 PopOut 与其他常见二手平台在功能体验上的区别。我们希望提供清晰、友善、可执行的信息，帮助你根据自己的交易习惯选择合适的平台。",
    comparisonHubPurposeTitle: "为什么做这个页面",
    comparisonHubPurposeBody:
      "许多用户在反复填写表单、应对语言障碍，以及处理大量重复的买家咨询时感到吃力。我们以结构化的方式呈现 PopOut Market 的核心体验，让你更容易评估各项功能的差异。",
    comparisonHubDisclaimerTitle: "官方说明与免责声明",
    comparisonHubDisclaimerBody:
      "本页面仅用于用户教育与产品说明，不构成对任何第三方平台的贬损或法律判断。文中提及的第三方名称属于其各自权利人；功能状态可能随第三方版本更新而变化，请以对方官方说明为准。",
    comparisonHubCardsTitle: "查看具体对比",
    comparisonHubCardsHint: "选择一个平台查看完整对比文章",
    comparisonHubCardFbBody: "对比发布速度、多语言沟通和 AI 自动回复。",
    comparisonHubCardFbCta: "查看与 Facebook Marketplace 对比",
    comparisonHubCardGumtreeBody: "对比 AI 发布设置、学生认证和 AI 自动回复。",
    comparisonHubCardGumtreeCta: "查看与 Gumtree 对比",
    comparisonGumtreeH1: "PopOut vs Gumtree：功能体验对比",
    comparisonGumtreeLead:
      "本页围绕墨尔本二手交易场景，对比发布设置、多语言沟通和 AI 自动回复在实际使用流程中的差异。",
    comparisonGumtreeDisclaimer:
      "免责声明：本页仅用于用户教育和产品说明，不构成法律意见。Gumtree 及相关名称属于其权利人。第三方平台功能可能变化，请以其官方信息为准。",
    comparisonGumtreeSection1Title: "1) AI 帮你完成初稿，缩短发布路径",
    comparisonGumtreeSection1Body:
      "PopOut 支持图片生成标题、描述与分类建议，用户只需要核对并补充即可。完成成色、价格、配送与议价选项后，就能更快发布，避免在大量分类中反复查找。",
    comparisonGumtreeSection2Title: "2) 多语言买卖沟通，覆盖墨尔本多民族用户",
    comparisonGumtreeSection2Body:
      "用户使用英语、简体中文、繁体中文、韩语、日语、法语、西班牙语、越南语输入后，可在帖子和聊天场景中按不同语言实时理解，降低沟通误解与等待成本。",
    comparisonGumtreeSection3Title: "3）AI 自动回复，帮卖家省时间",
    comparisonGumtreeSection3Body:
      "PopOut 内置了 AI 自动回复功能。目前功能还比较简单，我们正在持续优化，更强大的能力很快就会上线。现在它可以应对大量重复、价值不高的消息，并回答你在商品描述中已经写明的问题。对于不确定或描述里没有提到的内容，AI 不会贸然作答，而是留给你亲自回复买家，让你把精力集中在真正重要的问题上。",
    comparisonGumtreeSection4Title: "4) 学生身份验证，服务校园与宿舍交易",
    comparisonGumtreeSection4Body:
      "针对墨尔本学生群体，PopOut 提供身份验证通道，帮助同校、同宿舍或相近学习生活圈用户更快建立信任并完成交易。",
    comparisonGumtreeTableTitle: "核心能力对照（用户视角）",
    comparisonGumtreeTableNote:
      "注：右侧内容为常见公开体验概述，具体功能会因版本和地区更新而变化。",
    comparisonGumtreeFeature1Title: "发帖准备时间",
    comparisonGumtreeFeature1Popout: "AI 先生成主要文案和分类建议，人工做最后确认",
    comparisonGumtreeFeature1Other: "更多依赖从零手动填写与筛选",
    comparisonGumtreeFeature2Title: "语言覆盖与翻译体验",
    comparisonGumtreeFeature2Popout: "多语言输入与阅读链路一体化，覆盖发帖和聊天场景",
    comparisonGumtreeFeature2Other: "常见方式是用户自行切换语言或外部翻译",
    comparisonGumtreeFeature3Title: "AI 自动回复",
    comparisonGumtreeFeature3Popout: "AI 处理重复问题和描述中已有的细节，不确定的留给你来答",
    comparisonGumtreeFeature3Other: "全程手动回复，没有 AI 帮你过滤重复消息",
    comparisonGumtreeFeature4Title: "学生圈层交易效率",
    comparisonGumtreeFeature4Popout: "学生验证帮助提升校园场景匹配效率",
    comparisonGumtreeFeature4Other: "通常没有专门的学生身份识别流程",
    comparisonGumtreeFinalTitle: "选择建议",
    comparisonGumtreeFinalBody:
      "如果你更看重发布速度、多语言沟通的清晰度，以及能节省时间的 AI 自动回复，那么 PopOut Market 可能更适合你。请结合你所在地区和使用习惯，自行确认当前的功能。",
    comparisonBackLabel: "返回对比总览",
    comparisonGumtreeCard1Title: "AI 快速发布",
    comparisonGumtreeCard1Body: "减少分类查找和重复填写时间",
    comparisonGumtreeCard2Title: "多语言交易",
    comparisonGumtreeCard2Body: "覆盖主要跨语言买卖场景",
    comparisonGumtreeCard3Title: "AI 自动回复",
    comparisonGumtreeCard3Body: "AI 回答重复问题，帮你节省时间",
    comparisonFbH1: "PopOut vs Facebook Marketplace：功能体验对比",
    comparisonFbLead:
      "本文对比发布设置、多语言沟通和 AI 自动回复在实际使用流程中的差异，旨在帮助用户选择更契合日常需求的交易流程。",
    comparisonFbDisclaimer:
      "免责声明：本页仅用于产品信息说明，不构成法律意见，也不对第三方平台作价值判断。Facebook Marketplace 及相关名称为其权利人所有；功能会随版本调整，请以官方信息为准。",
    comparisonFbSection1Title: "1) AI 图片发帖，减少第一步的重复劳动",
    comparisonFbSection1Body:
      "在 PopOut，你上传图片后可自动生成标题、描述和类别建议。你只需快速检查并补充细节，再选择成色和价格即可发布。对于新用户或分类不熟悉的用户，这能显著减少初次发帖耗时。",
    comparisonFbSection2Title: "2) 多语言实时翻译，降低沟通门槛",
    comparisonFbSection2Body:
      "PopOut 支持英语、简体中文、繁体中文、韩语、日语、法语、西班牙语、越南语的输入与理解。帖子与聊天可以按用户语言实时展示，适合墨尔本多语言社区场景。",
    comparisonFbSection3Title: "3）AI 自动回复，帮卖家省时间",
    comparisonFbSection3Body:
      "PopOut 内置了 AI 自动回复功能。目前功能还比较简单，我们正在持续优化，更强大的能力很快就会上线。现在它可以应对大量重复、价值不高的消息，并回答你在商品描述中已经写明的问题。对于不确定或描述里没有提到的内容，AI 不会贸然作答，而是留给你亲自回复买家，把时间花在真正重要的问题上。",
    comparisonFbSection4Title: "4) 面向学生群体的身份验证通道",
    comparisonFbSection4Body:
      "针对墨尔本学生与学生公寓用户，PopOut 提供学生身份验证能力，帮助用户更容易识别同校或同住宿圈层的交易对象，提升交易匹配效率与信任感。",
    comparisonFbTableTitle: "核心功能对照（用户视角）",
    comparisonFbTableNote:
      "注：右侧为公开可观察到的通用体验描述，具体能力可能因地区、账号类型和产品版本而变化。",
    comparisonFbFeature1Title: "发帖启动效率",
    comparisonFbFeature1Popout: "图片上传后由 AI 生成标题/描述/类别建议，用户补充即可完成",
    comparisonFbFeature1Other: "通常需要手动填写多个字段并自行选择分类",
    comparisonFbFeature2Title: "跨语言沟通",
    comparisonFbFeature2Popout: "帖子和聊天支持多语言实时理解与呈现",
    comparisonFbFeature2Other: "多语言沟通一般依赖用户自行翻译",
    comparisonFbFeature3Title: "AI 自动回复",
    comparisonFbFeature3Popout: "AI 回复重复问题和描述中的细节，不确定的等你来答",
    comparisonFbFeature3Other: "消息全程手动回复，没有 AI 帮你处理重复问题",
    comparisonFbFeature4Title: "学生场景支持",
    comparisonFbFeature4Popout: "提供学生验证通道，便于校园与宿舍圈层匹配",
    comparisonFbFeature4Other: "通常没有面向学生交易链路的专门身份流程",
    comparisonFbFinalTitle: "如何使用这页信息",
    comparisonFbFinalBody:
      "如果你更看重更快的发布、更顺畅的多语言沟通，以及能帮你处理重复提问的 AI 自动回复，那么 PopOut Market 的使用流程可能更适合你。请务必结合你自身的使用场景，确认当前的具体功能细节。",
    comparisonFbCard1Title: "AI 发帖引导",
    comparisonFbCard1Body: "上传图片后自动给出标题与描述建议",
    comparisonFbCard2Title: "实时翻译沟通",
    comparisonFbCard2Body: "多语言帖子与聊天更顺畅",
    comparisonFbCard3Title: "AI 自动回复",
    comparisonFbCard3Body: "AI 处理重复问题，让你专注于真正重要的问题",
    notFoundTitle: "页面未找到",
    notFoundDescription: "您请求的页面不存在或无法公开访问。",
  },
  "zh-Hant": {
    topDownload: "下載",
    topLanguage: "語言",
    languageModalTitle: "選擇你的語言",
    languageModalHint: "PopOut 以多語言連結在地社群。",
    heroSecondaryPrefix: "用",
    heroSecondaryLink: "中文",
    heroSecondarySuffix: "輕鬆和附近的鄰居買賣二手好物",
    heroExploreCta: "探索更多商品",
    downloadLine: "下載 PopOut Market 應用，支援 iOS 與 Android",
    slogan: "與身邊的人輕鬆買賣",
    ratingAria: "App Store 評分 5.0（滿分 5 分）",
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
    marketSupabaseNotConfiguredBody: "目前為範例內容，僅供預覽版面；正式商品接上後會顯示於此。",
    marketSupabaseLoadError: "暫時無法載入列表，請稍後再試。",
    marketSupabaseRetry: "再試一次",
    marketSupabaseEmpty: "此區域尚無刊登項目。",
    marketSupabaseLoadingAria: "載入列表中",
    marketNearbyNotice: "{suburb}尚無刊登項目，正在顯示附近的商品",
    marketLocationDeniedHint: "請在瀏覽器允許位置，以顯示到面交點的直線距離。",
    marketLocationUnsupportedHint: "此瀏覽器不支援定位，無法顯示距離。",
    marketLocationRetry: "再次要求位置",
    marketPostBack: "返回",
    marketPostBackAria: "返回市集",
    marketPostNotFoundTitle: "找不到刊登",
    marketPostNotFoundBody: "可能已移除，或連結不正確。",
    marketPostListedLabel: "刊登時間",
    marketPostAreaLabel: "區域",
    marketPostContactSellerCta: "用 App 聯絡賣家",
    marketPostListedInOn: "{date} 於 {suburb} 刊登",
    marketPostListedIn: "於 {suburb} 刊登",
    marketPostListedOn: "{date} 刊登",
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
    translationDemoTitle: "說一次，*所有人*都能懂",
    translationDemoSubtitle: "你用你的語言發訊息，對方用他的語言收到——翻譯全自動。",
    aiPostDemoTitle: "拍張照，AI 幫你*搞定*",
    aiPostDemoSubtitle: "拍照後 AI 自動產生標題、分類和描述，你只需填價格和狀態。",
    autoReplyDemoTitle: "常見問題交給 AI *真正買家*由你來聊",
    autoReplyDemoSubtitle: "買家一問，AI 立刻回覆",
    autoReplyDemoInboxTitle: "訊息",
    autoReplyDemoTabBuying: "購買",
    autoReplyDemoTabSelling: "販售",
    autoReplyDemoBadge: "自動回覆開啟",
    autoReplyDemoTimeNow: "剛剛",
    autoReplyDemoTime1Min: "1 分鐘前",
    autoReplyDemoMsgMeet: "我們約幾點碰面呢？",
    autoReplyDemoMsgPrice: "這個 $50 喔，有興趣嗎？",
    autoReplyDemoMsgSelling: "$30 出售，有興趣嗎？",
    autoReplyDemoMsgGreeting: "嗨！這張皮革辦公椅還在喔。",
    aiPostDemoPrice: "價格",
    aiPostDemoCondition: "成色",
    aiPostDemoYouFill: "你來填",
    scheduleDemoTitle: "每一次見面，都安心。",
    scheduleDemoSubtitle: "選好時間和地點，見面後掃碼確認——減少爽約，共建信任社區。",
    scheduleDemoDate: "日期",
    scheduleDemoTime: "時間",
    scheduleDemoLocation: "見面地點",
    scheduleDemoScheduled: "已預約",
    scheduleDemoScanHint: "掃碼驗證",
    scheduleDemoVerified: "見面已確認",
    studentVerifyTitle: "認證學生，可信交易。",
    studentVerifySubtitle: "透過學生信箱驗證取得信任徽章——讓社區中的每一筆交易更安全、更放心。",
    studentVerifyEmailLabel: "學生信箱",
    studentVerifyUniversity: "所屬大學",
    studentVerifyVerifying: "驗證中…",
    studentVerifyVerified: "信箱已驗證",
    studentVerifyBadge: "已認證學生",
    safetyZoneTitle: "更安心的見面，從選址開始。",
    safetyZoneSubtitle:
      "選定見面區域後，我們會推薦附近的安全區域——人流多、光線佳、有監視器的公共場所，讓交易更踏實，社區更可信。",
    safetyZoneNearLabel: "見面區域",
    safetyZoneFinding: "正在掃描安全區域…",
    safetyZoneListTitle: "推薦地點",
    safetyZoneBadgeCctv: "監視器",
    safetyZoneBadgeBusy: "人潮多",
    safetyZoneBadgeLit: "光線佳",
    footerLegalNavAria: "條款與聯絡",
    footerCopyright: "版權所有 © 2026 PopOut Market Pty Ltd。保留所有權利。",
    footerAcn: "ACN：696 464 945",
    footerNavAbout: "關於 PopOut Market",
    footerNavTerms: "使用條款",
    footerNavPrivacy: "隱私權政策",
    footerNavChildSafety: "兒童安全",
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
      "你的安全高於一切。我們會推薦墨爾本人多、明亮的公共場所作為更安全的面交地點，並鼓勵使用者完成學生身份驗證。在 PopOut 上的每一筆交易，都多一層安心保障。",
    aboutWhyCommunicationTitle: "溝通，再無國界",
    aboutWhyCommunicationBody:
      "語言不該成為連結的障礙。PopOut 配備強大的即時雙語翻譯系統。用你的母語聊天——對方會收到自動翻譯。即使英文還不夠流利，你也可以在這裡自由交易、結識志同道合的朋友。",
    aboutPrivacyTitle: "我們守護您的隱私",
    aboutPrivacyLead: "在 PopOut，我們視隱私為基本權利。",
    aboutPrivacyMinimalTitle: "極簡資料採集",
    aboutPrivacyMinimalBody: "我們只收集登入驗證所必需的資訊，例如手機號碼與電子郵件。",
    aboutPrivacyStorageTitle: "高標準儲存",
    aboutPrivacyStorageBody: "你的敏感資料存放在加密資料庫中（傳輸與儲存均加密）。",
    aboutPrivacyNoTracesTitle: "不留痕跡",
    aboutPrivacyNoTracesBody:
      "我們不會追蹤或保留你的位置歷史——GPS 僅用於短暫驗證你所在的城區，之後即刪除。請放心探索。",
    aboutPrivacyLinkMore: "更多詳細的隱私介紹",
    aboutVisionTitle: "我們的願景",
    aboutVisionP1:
      "PopOut 的名字寓意著「走出家門，連結鄰里」。透過這款小小的應用，我們希望打破大城市中的冷漠，讓墨爾本的每一個社區都充滿互助的溫度。",
    aboutVisionP2:
      "無論你是初來乍到佈置第一個家的新生，還是開啟人生下一章的職場人，PopOut 都願陪在你身邊。",
    aboutVisionP3: "感謝你選擇 PopOut。讓我們一起，建設更安全、更緊密的墨爾本社區。",
    aboutFeedbackTitle: "建議與回饋",
    aboutFeedbackLead: "我們始終在進化。如果你有任何想法，或僅僅是想和我們打個招呼，請隨時聯絡：",
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "本文件以英文版本為準。",
    languageModalCloseAria: "關閉語言選擇",
    carouselGoToItemAria: "跳至第 {index} 項",
    demoListingWoodenDiningChair: "實木餐椅",
    demoListingMountainBike: "登山自行車",
    demoListingAcousticGuitar: "木吉他",
    demoListingWirelessHeadphones: "無線耳機",
    demoListingTextbookBundle: "教材套組",
    demoListingSmartWatch: "智慧手錶",
    demoListingGameController: "遊戲手把",
    heroNowInConnector: "，現已上線 ",
    heroTitleTemplate: "在 {brand} 尋找二手{item}",
    heroRotatingItems: ["家具", "電子產品", "單車", "教科書", "廚房用品", "衣物"],
    heroLocationSuffix: "",
    contactBack: "返回首頁",
    contactHint: "留下你的問題或合作需求，我們會盡快透過信箱回覆。",
    contactTitlePlaceholder: "請輸入標題",
    contactMainPlaceholder: "請輸入詳細內容",
    contactSend: "送出",
    contactSending: "送出中...",
    contactSuccess: "已成功送出，我們會盡快回覆你。",
    contactErrorRequired: "請先填寫 Title 與 Main。",
    contactErrorFallback: "送出失敗，請稍後再試。",
    faqTitle: "PopOut 常見問題",
    faqIntro:
      "這裡整理了 8 個最常見問題，幫助你快速理解 PopOut 在發文效率、多語言溝通、交易安全與畢業季出貨上的核心能力。",
    faqDisclaimerTitle: "官方說明",
    faqDisclaimerBody:
      "本頁僅供產品資訊參考，不構成法律、財務或安全承諾。不同地區與版本的功能可能有所差異，請以 App 內實際功能與官方公告為準。",
    faqComparisonCta: "查看與其他平台比較",
    marketSeoIntroPrefix: "買賣二手物品 ·",
    marketSeoIntroNearLabel: "正在顯示",
    marketSuburbMapTitle: "{suburb}地圖",
    marketPostMeetupMapAlt: "交易地點地圖",
    aiPostDemoFieldTitle: "標題",
    suburbBackToHub: "返回墨爾本區域頁",
    comparisonHubTitle: "比較其他二手平台",
    comparisonHubIntro:
      "此頁面用於幫助你快速理解 PopOut 與其他常見二手平台在功能體驗上的差異。我們希望提供清楚、友善、可執行的資訊，協助你依照自己的交易習慣做選擇。",
    comparisonHubPurposeTitle: "為什麼做這個頁面",
    comparisonHubPurposeBody:
      "許多使用者常為重複填寫表單、語言隔閡，以及應付大量重複的買家訊息所困擾。我們以結構化的方式呈現 PopOut 的核心體驗，讓功能差異更容易評估與比較。",
    comparisonHubDisclaimerTitle: "官方說明與免責聲明",
    comparisonHubDisclaimerBody:
      "本頁面僅用於使用者教育與產品資訊，不構成對任何第三方平台的貶抑或法律判斷。文中提及第三方名稱屬於其各自權利人；功能可能隨版本更新變動，請以各平台官方資訊為準。",
    comparisonHubCardsTitle: "查看詳細對比",
    comparisonHubCardsHint: "選擇一個平台查看完整對比文章",
    comparisonHubCardFbBody: "比較刊登速度、多語訊息溝通，以及 AI 自動回覆。",
    comparisonHubCardFbCta: "查看與 Facebook Marketplace 對比",
    comparisonHubCardGumtreeBody: "比較 AI 刊登設定、學生身分驗證，以及 AI 自動回覆。",
    comparisonHubCardGumtreeCta: "查看與 Gumtree 對比",
    comparisonGumtreeH1: "PopOut vs Gumtree：功能體驗比較",
    comparisonGumtreeLead:
      "本頁以墨爾本二手交易的實際情境，比較刊登設定、多語溝通，以及 AI 自動回覆在實務操作流程上的差異。",
    comparisonGumtreeDisclaimer:
      "免責聲明：本頁僅供使用者教育與產品資訊參考，不構成法律意見。Gumtree 及相關名稱屬其權利人；功能可能隨版本更新調整，請以官方資訊為準。",
    comparisonGumtreeSection1Title: "1) AI 協助完成初稿，縮短發佈路徑",
    comparisonGumtreeSection1Body:
      "PopOut 可由圖片生成標題、描述與分類建議，使用者只需檢查補充，再設定成色、價格、配送與議價選項，即可更快完成發佈。",
    comparisonGumtreeSection2Title: "2) 多語言買賣溝通，適配多元社群",
    comparisonGumtreeSection2Body:
      "支援英語、簡中、繁中、韓語、日語、法語、西班牙語、越南語。貼文與聊天可依不同語言即時理解，降低溝通落差。",
    comparisonGumtreeSection3Title: "3) 為賣家省時的 AI 自動回覆",
    comparisonGumtreeSection3Body:
      "PopOut Market 內建 AI 自動回覆功能。目前功能還算簡單，我們也正持續優化，更強大的能力即將推出。現階段它能處理大量重複、價值不高的訊息，並回答你已寫在商品說明裡的問題。至於不確定或商品說明中沒有提到的內容，AI 不會貿然猜測作答，而是留給你親自回覆買家，讓你能把心力放在真正重要的問題上。",
    comparisonGumtreeSection4Title: "4) 學生驗證支援校園與宿舍交易",
    comparisonGumtreeSection4Body:
      "針對墨爾本學生族群，PopOut 提供身份驗證通道，讓同校或同宿舍圈層更容易互相發現與建立交易信任。",
    comparisonGumtreeTableTitle: "核心能力對照（使用者視角）",
    comparisonGumtreeTableNote: "註：右側為常見公開體驗概述，實際功能可能因地區與版本變動。",
    comparisonGumtreeFeature1Title: "發文準備時間",
    comparisonGumtreeFeature1Popout: "AI 先生成文案與分類建議，使用者做最後確認",
    comparisonGumtreeFeature1Other: "較依賴手動填寫與自行篩選",
    comparisonGumtreeFeature2Title: "語言覆蓋與翻譯體驗",
    comparisonGumtreeFeature2Popout: "發文與聊天具備多語言理解流程",
    comparisonGumtreeFeature2Other: "常需使用者自行翻譯或切換語言",
    comparisonGumtreeFeature3Title: "AI 自動回覆",
    comparisonGumtreeFeature3Popout:
      "AI 負責回答重複問題與商品說明中已有的資訊，不確定的則留給你處理",
    comparisonGumtreeFeature3Other: "訊息需全程手動回覆，沒有 AI 協助篩選重複訊息",
    comparisonGumtreeFeature4Title: "學生圈層交易效率",
    comparisonGumtreeFeature4Popout: "學生驗證提升校園場景匹配效率",
    comparisonGumtreeFeature4Other: "通常缺少學生身份識別流程",
    comparisonGumtreeFinalTitle: "選擇建議",
    comparisonGumtreeFinalBody:
      "如果你重視刊登速度、多語溝通的清晰度，以及能節省時間的 AI 自動回覆，PopOut 可能更適合你。請依你所在地區與實際使用情況，確認目前的功能內容。",
    comparisonBackLabel: "返回比較總覽",
    comparisonGumtreeCard1Title: "AI 快速發佈",
    comparisonGumtreeCard1Body: "減少分類查找與重複填寫時間",
    comparisonGumtreeCard2Title: "多語言交易",
    comparisonGumtreeCard2Body: "覆蓋主要跨語買賣場景",
    comparisonGumtreeCard3Title: "AI 自動回覆",
    comparisonGumtreeCard3Body: "AI 替你回答重複問題，為你省下時間",
    comparisonFbH1: "PopOut vs Facebook Marketplace：功能體驗比較",
    comparisonFbLead:
      "本文比較刊登設定、多語溝通，以及 AI 自動回覆在實務操作流程上的差異，目的是協助使用者選擇真正貼合日常需求的交易流程。",
    comparisonFbDisclaimer:
      "免責聲明：本頁僅供產品資訊參考，不構成法律意見，也不對第三方平台作價值判斷。Facebook Marketplace 及相關名稱屬其權利人所有；功能可能隨版本調整，請以官方資訊為準。",
    comparisonFbSection1Title: "1) AI 圖片發文，減少重複填寫",
    comparisonFbSection1Body:
      "在 PopOut，上傳圖片後可自動生成標題、描述與分類建議。你只需快速檢查與補充，再填入成色與價格即可發佈，可有效縮短初次上架時間。",
    comparisonFbSection2Title: "2) 多語言即時翻譯，降低溝通門檻",
    comparisonFbSection2Body:
      "PopOut 支援英語、簡中、繁中、韓語、日語、法語、西班牙語、越南語。貼文與聊天可依使用者語言即時呈現，適合墨爾本多語社群。",
    comparisonFbSection3Title: "3) 為賣家省時的 AI 自動回覆",
    comparisonFbSection3Body:
      "PopOut Market 內建 AI 自動回覆功能。目前功能還算簡單，我們也正持續優化，更強大的能力即將推出。現階段它能處理重複、價值不高的訊息，並回答你已寫在商品說明裡的問題。至於不確定或商品說明中沒有提到的內容，AI 不會貿然猜測作答，而是留給你親自回覆買家，讓你把時間花在真正重要的問題上。",
    comparisonFbSection4Title: "4) 面向學生族群的身份驗證",
    comparisonFbSection4Body:
      "對於墨爾本學生與學生公寓族群，PopOut 提供學生驗證能力，讓同校或同住宿圈層更容易互相發現與交易。",
    comparisonFbTableTitle: "核心功能對照（使用者視角）",
    comparisonFbTableNote: "註：右側為常見公開體驗描述，實際能力可能因地區、帳號與版本而異。",
    comparisonFbFeature1Title: "發文啟動效率",
    comparisonFbFeature1Popout: "圖片上傳後由 AI 生成標題/描述/分類建議",
    comparisonFbFeature1Other: "通常需手動填寫多個欄位並自行選分類",
    comparisonFbFeature2Title: "跨語言溝通",
    comparisonFbFeature2Popout: "貼文與聊天支援多語言即時理解與呈現",
    comparisonFbFeature2Other: "多語溝通常仰賴使用者自行翻譯",
    comparisonFbFeature3Title: "AI 自動回覆",
    comparisonFbFeature3Popout: "AI 回覆重複問題與商品說明細節，不確定的則等你來處理",
    comparisonFbFeature3Other: "訊息需全程手動回覆，沒有 AI 協助處理重複問題",
    comparisonFbFeature4Title: "學生場景支援",
    comparisonFbFeature4Popout: "提供學生驗證通道，提升校園圈層匹配效率",
    comparisonFbFeature4Other: "通常缺少學生交易鏈路的專門身份流程",
    comparisonFbFinalTitle: "如何使用這頁資訊",
    comparisonFbFinalBody:
      "如果你重視更快的刊登速度、更順暢的多語溝通，以及能處理重複問題的 AI 自動回覆，PopOut 的操作流程可能更適合你。請務必依你自身的使用情境，確認目前的功能細節。",
    comparisonFbCard1Title: "AI 發文引導",
    comparisonFbCard1Body: "上傳圖片後自動產生標題與描述建議",
    comparisonFbCard2Title: "即時翻譯溝通",
    comparisonFbCard2Body: "多語貼文與聊天更順暢",
    comparisonFbCard3Title: "AI 自動回覆",
    comparisonFbCard3Body: "AI 處理重複問題，讓你專注於真正重要的提問",
    notFoundTitle: "找不到頁面",
    notFoundDescription: "您請求的頁面不存在或無法公開存取。",
  },
  ko: {
    topDownload: "다운로드",
    topLanguage: "언어",
    languageModalTitle: "언어 선택",
    languageModalHint: "PopOut은 다양한 언어로 지역 커뮤니티를 연결합니다.",
    heroSecondaryPrefix: "동네 이웃과, ",
    heroSecondaryLink: "한국어로",
    heroSecondarySuffix: " 편하게 사고파세요",
    heroExploreCta: "더 많은 상품 둘러보기",
    downloadLine: "iOS 및 Android용 PopOut Market 앱을 다운로드하세요",
    slogan: "주변 사람들과 쉽고 빠르게 거래하세요",
    ratingAria: "App Store 별점 5점 만점에 5.0점",
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
    marketNearbyNotice: "{suburb}에는 아직 상품이 없어 근처 상품을 보여드려요",
    marketLocationDeniedHint:
      "브라우저에서 위치를 허용하면 만남 장소까지의 직선 거리를 볼 수 있습니다.",
    marketLocationUnsupportedHint:
      "이 브라우저는 위치 정보를 지원하지 않아 거리를 표시할 수 없습니다.",
    marketLocationRetry: "위치 다시 요청",
    marketPostBack: "뒤로",
    marketPostBackAria: "마켓으로 돌아가기",
    marketPostNotFoundTitle: "게시글을 찾을 수 없습니다",
    marketPostNotFoundBody: "삭제되었거나 링크가 잘못되었을 수 있습니다.",
    marketPostListedLabel: "게시 시각",
    marketPostAreaLabel: "지역",
    marketPostContactSellerCta: "앱에서 판매자에게 연락하기",
    marketPostListedInOn: "{date}, {suburb}에서 올라왔어요",
    marketPostListedIn: "{suburb}에서 올라왔어요",
    marketPostListedOn: "{date}에 올라왔어요",
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
    translationDemoTitle: "한 번 말하면, *모두가* 이해합니다",
    translationDemoSubtitle: "내 언어로 보내면, 상대방은 자기 언어로 받아요. 번역은 자동입니다.",
    aiPostDemoTitle: "사진 한 장이면 AI가 *알아서*",
    aiPostDemoSubtitle: "사진을 찍으면 AI가 제목, 카테고리, 설명을 자동 생성 — 가격만 입력하세요.",
    autoReplyDemoTitle: "뻔한 질문은 AI가 *중요한 답변*만 내가",
    autoReplyDemoSubtitle: "포스트에 있는 내용은 AI가 자동 답변",
    autoReplyDemoInboxTitle: "채팅",
    autoReplyDemoTabBuying: "구매",
    autoReplyDemoTabSelling: "판매",
    autoReplyDemoBadge: "자동응답 켜짐",
    autoReplyDemoTimeNow: "방금 전",
    autoReplyDemoTime1Min: "1분 전",
    autoReplyDemoMsgMeet: "몇 시에 만날까요?",
    autoReplyDemoMsgPrice: "$50이에요. 구매 원하세요?",
    autoReplyDemoMsgSelling: "$30에 판매해요. 관심 있으세요?",
    autoReplyDemoMsgGreeting: "안녕하세요! 가죽 사무용 의자 아직 판매 중이에요.",
    aiPostDemoPrice: "가격",
    aiPostDemoCondition: "상태",
    aiPostDemoYouFill: "직접 입력",
    scheduleDemoTitle: "약속은 확실하게.",
    scheduleDemoSubtitle:
      "시간과 장소를 정하고, 만나서 QR을 스캔하면 확인 완료 — 노쇼를 줄이고 신뢰를 쌓아요.",
    scheduleDemoDate: "날짜",
    scheduleDemoTime: "시간",
    scheduleDemoLocation: "만남 장소",
    scheduleDemoScheduled: "예약 완료",
    scheduleDemoScanHint: "스캔하여 확인",
    scheduleDemoVerified: "만남 확인됨",
    studentVerifyTitle: "인증된 학생, 신뢰할 수 있는 거래.",
    studentVerifySubtitle:
      "학생 이메일을 인증하고 신뢰 배지를 받으세요 — 커뮤니티의 모든 거래를 더 안전하게.",
    studentVerifyEmailLabel: "학생 이메일",
    studentVerifyUniversity: "대학교",
    studentVerifyVerifying: "인증 중…",
    studentVerifyVerified: "이메일 인증됨",
    studentVerifyBadge: "인증된 학생",
    safetyZoneTitle: "더 안심되는 만남, 장소부터.",
    safetyZoneSubtitle:
      "만남 지역을 고르면 근처 세이프티 존을 추천해요 — 유동 인구가 많고 밝으며 CCTV가 있는 공공장소로, 거래는 더 편안하게, 커뮤니티는 더 믿을 만하게.",
    safetyZoneNearLabel: "만남 지역",
    safetyZoneFinding: "세이프티 존 검색 중…",
    safetyZoneListTitle: "추천 장소",
    safetyZoneBadgeCctv: "CCTV",
    safetyZoneBadgeBusy: "유동 인구",
    safetyZoneBadgeLit: "조명 양호",
    footerLegalNavAria: "약관 및 문의",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "PopOut Market 소개",
    footerNavTerms: "이용약관",
    footerNavPrivacy: "개인정보 처리방침",
    footerNavChildSafety: "아동 안전",
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
      "당신의 안전이 최우선입니다. 멜버른에서 사람이 많고 밝은 공공장소를 더 안전한 대면 거래 장소로 추천하고, 학생 신원 인증을 권장합니다. PopOut의 모든 거래에 한 겹 더 안심이 더해집니다.",
    aboutWhyCommunicationTitle: "국경 없는 소통",
    aboutWhyCommunicationBody:
      "언어는 연결의 장벽이 되어서는 안 됩니다. PopOut에는 강력한 실시간 이중 언어 번역이 있습니다. 모국어로 채팅하면 상대에게는 자동으로 번역됩니다. 영어가 완벽하지 않아도 자유롭게 거래하고 마음이 맞는 친구를 만나세요.",
    aboutPrivacyTitle: "개인정보를 지킵니다",
    aboutPrivacyLead: "PopOut에서는 개인정보를 기본권으로 대합니다.",
    aboutPrivacyMinimalTitle: "최소 수집",
    aboutPrivacyMinimalBody: "로그인 확인을 위해 전화번호와 이메일 등 필수 정보만 수집합니다.",
    aboutPrivacyStorageTitle: "높은 수준의 저장",
    aboutPrivacyStorageBody:
      "민감한 데이터는 전송 구간과 저장 모두 암호화된 데이터베이스에 보관됩니다.",
    aboutPrivacyNoTracesTitle: "흔적 없음",
    aboutPrivacyNoTracesBody:
      "위치 기록을 추적하거나 보관하지 않습니다. GPS는 거주 지역(서버브) 확인을 위해 잠깐만 사용된 뒤 삭제됩니다. 안심하고 이용하세요.",
    aboutPrivacyLinkMore: "자세한 개인정보 안내",
    aboutVisionTitle: "비전",
    aboutVisionP1:
      "PopOut은 ‘밖으로 나와 이웃과 연결하라’는 뜻을 담고 있습니다. 이 작은 앱으로 대도시의 차가움을 깨고, 멜버른 모든 동네에 서로 돕는 따뜻함을 채우고자 합니다.",
    aboutVisionP2:
      "첫 집을 꾸미는 신입 유학생이든, 새 장을 여는 직장인이든 PopOut이 곁에 있습니다.",
    aboutVisionP3:
      "PopOut을 선택해 주셔서 감사합니다. 함께 더 안전하고 밀접한 멜버른 커뮤니티를 만들어 갑시다.",
    aboutFeedbackTitle: "제안 및 피드백",
    aboutFeedbackLead:
      "우리는 끊임없이 발전합니다. 아이디어가 있거나 인사만 하고 싶어도 언제든 연락 주세요:",
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "이 문서는 영어 버전이 기준입니다.",
    languageModalCloseAria: "언어 선택 닫기",
    carouselGoToItemAria: "{index}번 항목으로 이동",
    demoListingWoodenDiningChair: "원목 식탁 의자",
    demoListingMountainBike: "산악자전거",
    demoListingAcousticGuitar: "어쿠스틱 기타",
    demoListingWirelessHeadphones: "무선 헤드폰",
    demoListingTextbookBundle: "교재 묶음",
    demoListingSmartWatch: "스마트워치",
    demoListingGameController: "게임 컨트롤러",
    heroNowInConnector: ", 이제 ",
    heroTitleTemplate: "{brand}에서 중고 {item} 찾기",
    heroRotatingItems: ["가구", "전자제품", "자전거", "교재", "주방용품", "옷"],
    heroLocationSuffix: "에도",
    contactBack: "홈으로 돌아가기",
    contactHint: "문의 사항이나 제휴 요청을 남겨 주시면 이메일로 회신해 드립니다.",
    contactTitlePlaceholder: "제목을 입력하세요",
    contactMainPlaceholder: "내용을 입력하세요",
    contactSend: "보내기",
    contactSending: "보내는 중...",
    contactSuccess: "전송되었습니다. 곧 답변드리겠습니다.",
    contactErrorRequired: "제목과 내용을 모두 입력해 주세요.",
    contactErrorFallback: "지금은 전송할 수 없습니다. 다시 시도해 주세요.",
    faqTitle: "PopOut 자주 묻는 질문",
    faqIntro:
      "이 여덟 가지 FAQ는 PopOut이 멜버른에서 더 빠른 게시, 다국어 소통, 더 안전한 거래, 졸업 시즌 판매를 어떻게 지원하는지 설명합니다.",
    faqDisclaimerTitle: "공식 안내",
    faqDisclaimerBody:
      "이 페이지는 제품 정보 제공 목적이며 법률·재무·안전을 보장하지 않습니다. 기능은 앱 버전, 지역, 계정 상황에 따라 다를 수 있습니다.",
    faqComparisonCta: "다른 마켓과 비교하기",
    marketSeoIntroPrefix: "중고 거래 ·",
    marketSeoIntroNearLabel: "표시 중인 지역",
    marketSuburbMapTitle: "{suburb} 지도",
    marketPostMeetupMapAlt: "거래 장소 지도",
    aiPostDemoFieldTitle: "제목",
    suburbBackToHub: "멜버른 지역 페이지로 돌아가기",
    comparisonHubTitle: "다른 중고 거래 플랫폼과 비교",
    comparisonHubIntro:
      "이 페이지는 PopOut과 자주 쓰이는 다른 중고 마켓의 실질적인 차이를 이해하도록 돕습니다. 친근하고 투명한 안내를 통해 본인 방식에 맞는 플랫폼을 고르도록 하는 것이 목표입니다.",
    comparisonHubPurposeTitle: "이 페이지를 만든 이유",
    comparisonHubPurposeBody:
      "많은 사용자가 반복적인 양식 입력, 언어 장벽, 그리고 쏟아지는 비슷한 구매자 문의 처리에 어려움을 겪습니다. 기능 차이를 더 쉽게 평가할 수 있도록 PopOut의 핵심 경험을 체계적으로 정리해 소개합니다.",
    comparisonHubDisclaimerTitle: "공식 안내 및 면책 고지",
    comparisonHubDisclaimerBody:
      "이 페이지는 제품 안내 목적으로만 제공되며 법률 자문이 아니고 어떤 제3자 플랫폼도 폄하하려는 의도가 없습니다. 제3자 상표와 제품명은 각 권리자에게 귀속됩니다. 기능은 시간이 지나며 바뀔 수 있으니 각 플랫폼의 공식 채널에서 최신 정보를 확인하세요.",
    comparisonHubCardsTitle: "상세 비교 보기",
    comparisonHubCardsHint: "아래에서 플랫폼을 선택해 전체 비교 글을 확인하세요",
    comparisonHubCardFbBody: "등록 속도, 다국어 메시지, AI 자동 응답을 비교해 보세요.",
    comparisonHubCardFbCta: "PopOut vs Facebook Marketplace 보기",
    comparisonHubCardGumtreeBody: "등록 설정, 학생 인증, AI 자동 응답을 비교해 보세요.",
    comparisonHubCardGumtreeCta: "PopOut vs Gumtree 보기",
    comparisonGumtreeH1: "PopOut vs Gumtree: 사용 경험 비교",
    comparisonGumtreeLead:
      "이 페이지는 멜버른 중고 거래 사용 사례를 중심으로 등록 설정, 다국어 소통, AI 자동 응답에서 나타나는 실제 사용 흐름의 차이를 비교합니다.",
    comparisonGumtreeDisclaimer:
      "면책 고지: 이 페이지는 사용자 안내와 제품 설명 목적으로만 제공되며 법률 자문이 아닙니다. Gumtree 및 관련 상표는 각 권리자에게 귀속됩니다. 제3자 기능은 시간이 지나며 바뀔 수 있습니다.",
    comparisonGumtreeSection1Title: "1) AI가 돕는 등록 설정",
    comparisonGumtreeSection1Body:
      "PopOut은 물품 사진을 바탕으로 제목, 설명, 카테고리 제안을 작성해 줍니다. 사용자는 이를 검토하고 상태와 희망 가격을 정한 뒤 배송이나 흥정 같은 옵션을 선택해 더 빠르게 등록할 수 있습니다.",
    comparisonGumtreeSection2Title: "2) 내장된 다국어 흐름",
    comparisonGumtreeSection2Body:
      "PopOut은 영어, 중국어 간체, 중국어 번체, 한국어, 일본어, 프랑스어, 스페인어, 베트남어를 등록과 메시지에서 지원해, 다양한 도시 환경에서 언어 장벽을 줄여 줍니다.",
    comparisonGumtreeSection3Title: "3) 판매자의 시간을 아껴주는 AI 자동 응답",
    comparisonGumtreeSection3Body:
      "PopOut Market에는 AI 자동 응답 기능이 있습니다. 아직은 단순한 수준이지만 지금도 꾸준히 개선하고 있으며, 더 강력한 기능도 곧 추가될 예정입니다. 현재는 반복적이고 사소한 문의를 대신 처리하고, 게시글에 이미 적어 둔 내용에 관한 질문에 답해 줍니다. 확실하지 않거나 게시글에 없는 내용은 AI가 함부로 추측해 답하지 않고, 판매자가 직접 구매자에게 답할 수 있도록 남겨 둡니다. 덕분에 판매자는 정말 중요한 질문에만 집중할 수 있습니다.",
    comparisonGumtreeSection4Title: "4) 캠퍼스 커뮤니티를 위한 학생 인증",
    comparisonGumtreeSection4Body:
      "학생 인증 절차는 멜버른의 대학 및 숙소 기반 거래에서 신뢰와 매칭 품질을 높이는 데 도움이 됩니다.",
    comparisonGumtreeTableTitle: "기능 요약 (사용자 관점)",
    comparisonGumtreeTableNote:
      "참고: 오른쪽 열은 일반적인 공개 이용 양상을 설명하며 계정, 지역, 제품 업데이트에 따라 달라질 수 있습니다.",
    comparisonGumtreeFeature1Title: "등록 준비 시간",
    comparisonGumtreeFeature1Popout: "AI가 주요 항목을 먼저 작성하고 사용자가 세부 내용을 마무리",
    comparisonGumtreeFeature1Other: "대체로 처음부터 수동으로 양식을 작성",
    comparisonGumtreeFeature2Title: "거래 흐름에서의 언어 지원",
    comparisonGumtreeFeature2Popout: "게시물과 채팅 전반에서 다국어 이해 지원",
    comparisonGumtreeFeature2Other: "언어 간 소통은 보통 사용자가 직접 번역해야 함",
    comparisonGumtreeFeature3Title: "AI 자동 응답",
    comparisonGumtreeFeature3Popout:
      "반복되는 질문과 게시글에 이미 있는 정보는 AI가 답하고, 확실하지 않은 질문은 판매자에게 남깁니다",
    comparisonGumtreeFeature3Other:
      "모든 답변을 직접 입력해야 하며, 반복 문의를 걸러 줄 AI 기능이 없습니다",
    comparisonGumtreeFeature4Title: "학생 전용 신뢰 장치",
    comparisonGumtreeFeature4Popout: "학생 인증으로 캠퍼스 관련 매칭 개선",
    comparisonGumtreeFeature4Other: "전용 학생 신원 확인 절차가 제한적일 수 있음",
    comparisonGumtreeFinalTitle: "추천",
    comparisonGumtreeFinalBody:
      "등록 속도, 다국어 소통의 명확함, 그리고 시간을 절약해 주는 AI 자동 응답이 중요하다면 PopOut이 더 잘 맞을 수 있습니다. 현재 제공되는 기능은 본인의 지역과 사용 환경을 기준으로 직접 확인해 보세요.",
    comparisonBackLabel: "비교 목록으로 돌아가기",
    comparisonGumtreeCard1Title: "빠른 AI 등록",
    comparisonGumtreeCard1Body: "카테고리 찾기와 반복 입력을 줄여 줍니다",
    comparisonGumtreeCard2Title: "다국어 거래",
    comparisonGumtreeCard2Body: "주요 언어 간 거래 흐름을 지원합니다",
    comparisonGumtreeCard3Title: "AI 자동 응답",
    comparisonGumtreeCard3Body: "반복되는 질문에 AI가 답해 판매자의 시간을 아껴 줍니다",
    comparisonFbH1: "PopOut vs Facebook Marketplace: 사용 경험 비교",
    comparisonFbLead:
      "이 글은 등록 설정, 다국어 소통, AI 자동 응답에서 나타나는 실질적인 사용 흐름의 차이를 비교합니다. 일상적인 필요에 맞는 마켓플레이스 사용 흐름을 선택하시는 데 도움을 드리는 것이 목적입니다.",
    comparisonFbDisclaimer:
      "면책 고지: 이 페이지는 제품 안내 목적으로만 제공되며 법률 자문이 아니고 어떤 제3자 플랫폼에 대한 부정적 평가도 아닙니다. Facebook Marketplace 및 관련 상표는 각 권리자에게 귀속됩니다. 기능 제공 여부는 지역, 계정 유형, 제품 업데이트에 따라 달라질 수 있습니다.",
    comparisonFbSection1Title: "1) 사진으로 시작하는 AI 등록",
    comparisonFbSection1Body:
      "PopOut에서는 물품 사진을 올리면 제목, 설명, 카테고리 초안을 만들어 줍니다. 사용자는 이를 검토하고 내용을 보완한 뒤 상태와 가격을 정하면, 수동 단계를 줄이며 더 빠르게 등록할 수 있습니다.",
    comparisonFbSection2Title: "2) 실시간 다국어 소통",
    comparisonFbSection2Body:
      "PopOut은 영어, 중국어 간체, 중국어 번체, 한국어, 일본어, 프랑스어, 스페인어, 베트남어를 지원합니다. 게시물과 채팅을 각 사용자가 선호하는 언어로 읽을 수 있습니다.",
    comparisonFbSection3Title: "3) 판매자의 시간을 아껴주는 AI 자동 응답",
    comparisonFbSection3Body:
      "PopOut Market에는 AI 자동 응답 기능이 있습니다. 아직은 단순한 수준이지만 지금도 꾸준히 개선하고 있으며, 더 강력한 기능도 곧 추가될 예정입니다. 현재는 반복적이고 사소한 문의를 대신 처리하고, 게시글에 이미 적어 둔 내용에 관한 질문에 답해 줍니다. 확실하지 않거나 게시글에 없는 내용은 AI가 함부로 추측해 답하지 않고, 판매자가 직접 구매자에게 답할 수 있도록 남겨 둡니다. 그래서 판매자는 정말 중요한 질문에만 시간을 쓸 수 있습니다.",
    comparisonFbSection4Title: "4) 멜버른 학생 인증 절차",
    comparisonFbSection4Body:
      "학생 커뮤니티와 숙소 밀집 지역을 위해 PopOut은 학생 인증 채널을 제공해, 캠퍼스 관련 거래에서 신뢰와 노출을 높입니다.",
    comparisonFbTableTitle: "기능 요약 (사용자 관점)",
    comparisonFbTableNote:
      "참고: 오른쪽 열은 일반적인 공개 이용 양상을 반영하며 시간이 지나며 바뀔 수 있습니다.",
    comparisonFbFeature1Title: "등록 시작 속도",
    comparisonFbFeature1Popout: "AI가 사진으로 제목/설명/카테고리를 작성",
    comparisonFbFeature1Other: "대체로 수동 양식 작성과 카테고리 선택에 의존",
    comparisonFbFeature2Title: "다국어 메시지",
    comparisonFbFeature2Popout: "지원 언어 전반에서 게시물과 채팅 내용을 이해 가능",
    comparisonFbFeature2Other: "언어 간 소통은 보통 직접 번역에 의존",
    comparisonFbFeature3Title: "AI 자동 응답",
    comparisonFbFeature3Popout:
      "반복되는 질문과 게시글에 있는 정보는 AI가 답하고, 확실하지 않은 질문은 판매자에게 남깁니다",
    comparisonFbFeature3Other:
      "메시지를 전부 직접 보내야 하며, 반복 문의를 처리해 줄 AI 기능이 없습니다",
    comparisonFbFeature4Title: "학생 중심 신뢰 계층",
    comparisonFbFeature4Popout: "캠퍼스/숙소 매칭을 위한 학생 인증 절차",
    comparisonFbFeature4Other: "학생 전용 신원 확인 절차가 대체로 제한적이거나 없음",
    comparisonFbFinalTitle: "이 비교를 활용하는 방법",
    comparisonFbFinalBody:
      "더 빠른 등록, 더 매끄러운 다국어 소통, 그리고 반복되는 질문을 처리해 주는 AI 자동 응답이 중요하다면 PopOut의 사용 흐름이 더 잘 맞을 수 있습니다. 현재 기능의 세부 사항은 항상 본인의 사용 환경에서 직접 확인하시기 바랍니다.",
    comparisonFbCard1Title: "AI 등록 도우미",
    comparisonFbCard1Body: "사진을 바탕으로 제목과 설명 초안 작성",
    comparisonFbCard2Title: "실시간 번역",
    comparisonFbCard2Body: "언어 간 게시물과 채팅이 더 매끄럽게",
    comparisonFbCard3Title: "AI 자동 응답",
    comparisonFbCard3Body: "반복되는 질문은 AI가 처리해 정말 중요한 질문에 집중할 수 있습니다",
    notFoundTitle: "페이지를 찾을 수 없습니다",
    notFoundDescription: "요청하신 페이지가 존재하지 않거나 공개적으로 접근할 수 없습니다.",
  },
  ja: {
    topDownload: "ダウンロード",
    topLanguage: "言語",
    languageModalTitle: "言語を選択",
    languageModalHint: "PopOut は多言語で地域コミュニティをつなぎます。",
    heroSecondaryPrefix: "ご近所さんと安心して売り買い、ぜんぶ",
    heroSecondaryLink: "日本語で",
    heroSecondarySuffix: "どうぞ",
    heroExploreCta: "もっと商品を見る",
    downloadLine: "iOS / Android 向け PopOut Market アプリをダウンロード",
    slogan: "近くの人と手軽に売り買いしよう",
    ratingAria: "App Store の評価は 5 点中 5.0",
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
    marketNearbyNotice: "{suburb}にはまだ出品がありません、近くの商品を表示しています",
    marketLocationDeniedHint:
      "ブラウザで位置情報を許可すると、受け渡し地点までの直線距離を表示できます。",
    marketLocationUnsupportedHint:
      "このブラウザは位置情報に対応していないため、距離を表示できません。",
    marketLocationRetry: "位置情報を再リクエスト",
    marketPostBack: "戻る",
    marketPostBackAria: "マーケットに戻る",
    marketPostNotFoundTitle: "出品が見つかりません",
    marketPostNotFoundBody: "削除されたか、リンクが間違っている可能性があります。",
    marketPostListedLabel: "掲載日時",
    marketPostAreaLabel: "エリア",
    marketPostContactSellerCta: "アプリで出品者に問い合わせる",
    marketPostListedInOn: "{date}に{suburb}で出品",
    marketPostListedIn: "{suburb}で出品",
    marketPostListedOn: "{date}に出品",
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
    translationDemoTitle: "一度言えば、*みんな*に伝わる",
    translationDemoSubtitle:
      "あなたの言語で送ると、相手は自分の言語で受け取ります。翻訳は自動です。",
    aiPostDemoTitle: "写真を撮るだけ。あとはAIに*おまかせ*",
    aiPostDemoSubtitle:
      "写真を撮ると、AIがタイトル・カテゴリ・説明を自動生成。価格と状態だけ入力すればOK。",
    autoReplyDemoTitle: "*冷やかし*はもう来ない",
    autoReplyDemoSubtitle: "「まだありますか？」もAIが返事",
    autoReplyDemoInboxTitle: "メッセージ",
    autoReplyDemoTabBuying: "買う",
    autoReplyDemoTabSelling: "売る",
    autoReplyDemoBadge: "自動返信オン",
    autoReplyDemoTimeNow: "たった今",
    autoReplyDemoTime1Min: "1分前",
    autoReplyDemoMsgMeet: "何時に待ち合わせますか？",
    autoReplyDemoMsgPrice: "$50です。ご興味ありますか？",
    autoReplyDemoMsgSelling: "$30で出品中です。いかがですか？",
    autoReplyDemoMsgGreeting: "こんにちは！レザーのオフィスチェア、まだありますよ。",
    aiPostDemoPrice: "価格",
    aiPostDemoCondition: "状態",
    aiPostDemoYouFill: "あなたが入力",
    scheduleDemoTitle: "確かな約束を、毎回。",
    scheduleDemoSubtitle:
      "日時と場所を決めて、会ったらQRをスキャン——ノーショーを減らし、信頼あるコミュニティへ。",
    scheduleDemoDate: "日時",
    scheduleDemoTime: "時間",
    scheduleDemoLocation: "受け渡し場所",
    scheduleDemoScheduled: "予約済み",
    scheduleDemoScanHint: "スキャンして確認",
    scheduleDemoVerified: "確認済み",
    studentVerifyTitle: "認証済み学生。信頼ある取引。",
    studentVerifySubtitle:
      "学生メールを認証して信頼バッジを獲得——コミュニティの取引をより安全・安心に。",
    studentVerifyEmailLabel: "学生メール",
    studentVerifyUniversity: "大学",
    studentVerifyVerifying: "認証中…",
    studentVerifyVerified: "メール認証済み",
    studentVerifyBadge: "認証済み学生",
    safetyZoneTitle: "安心の取引は、場所選びから。",
    safetyZoneSubtitle:
      "待ち合わせエリアを選ぶと、近くのセーフティゾーンを提案します。人通りが多く明るく、防犯カメラのある公共の場所で、より落ち着いた取引と、より良いコミュニティを。",
    safetyZoneNearLabel: "待ち合わせエリア",
    safetyZoneFinding: "セーフティゾーンを検索中…",
    safetyZoneListTitle: "おすすめスポット",
    safetyZoneBadgeCctv: "防犯カメラ",
    safetyZoneBadgeBusy: "人通り多め",
    safetyZoneBadgeLit: "明るい",
    footerLegalNavAria: "ポリシーとお問い合わせ",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "PopOut Market について",
    footerNavTerms: "利用規約",
    footerNavPrivacy: "プライバシーポリシー",
    footerNavChildSafety: "子どもの安全",
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
      "あなたの安全が最優先です。対面取引には、メルボルンの人通りが多く明るい公共スポットをより安全な場所としておすすめし、学生身分の確認も推奨しています。PopOut上の取引には、さらに一層の安心があります。",
    aboutWhyCommunicationTitle: "国境のないコミュニケーション",
    aboutWhyCommunicationBody:
      "言語がつながりの障壁になるべきではありません。PopOutには強力なリアルタイム二言語翻訳があります。母語でチャットすれば、相手には自動翻訳が届きます。英語が完璧でなくても、自由に取引し、気の合う友だちを作れます。",
    aboutPrivacyTitle: "プライバシーを守ります",
    aboutPrivacyLead: "PopOutではプライバシーを基本権として扱います。",
    aboutPrivacyMinimalTitle: "最小限のデータ収集",
    aboutPrivacyMinimalBody: "ログイン確認のため、電話番号やメールなど必要な情報だけを収集します。",
    aboutPrivacyStorageTitle: "高水準の保管",
    aboutPrivacyStorageBody:
      "機微なデータは、通信時も保存時も暗号化されたデータベースに保管されます。",
    aboutPrivacyNoTracesTitle: "痕跡を残さない",
    aboutPrivacyNoTracesBody:
      "位置情報の履歴を追跡・保存することはありません。GPSはお住まいのサバーブ確認のために短時間だけ使用し、その後削除します。安心してご利用ください。",
    aboutPrivacyLinkMore: "プライバシーの詳細",
    aboutVisionTitle: "ビジョン",
    aboutVisionP1:
      "PopOutは「外に出て、近所とつながる」という意味を込めています。この小さなアプリで、大都市の冷たさを和らげ、メルボルンのあらゆる地域に助け合いの温かさを広げたいと考えています。",
    aboutVisionP2:
      "初めての住まいを整える新入生も、次の章に進むプロフェッショナルも、PopOutはそばにいます。",
    aboutVisionP3:
      "PopOutを選んでくださりありがとうございます。より安全で、より結びつきの強いメルボルンのコミュニティを一緒に築きましょう。",
    aboutFeedbackTitle: "ご提案・フィードバック",
    aboutFeedbackLead:
      "私たちは常に進化しています。アイデアや、ご挨拶だけでもお気軽にご連絡ください:",
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "本書類は英語版を正文とします。",
    languageModalCloseAria: "言語選択を閉じる",
    carouselGoToItemAria: "{index} 番目の項目へ移動",
    demoListingWoodenDiningChair: "木製ダイニングチェア",
    demoListingMountainBike: "マウンテンバイク",
    demoListingAcousticGuitar: "アコースティックギター",
    demoListingWirelessHeadphones: "ワイヤレスヘッドホン",
    demoListingTextbookBundle: "教科書セット",
    demoListingSmartWatch: "スマートウォッチ",
    demoListingGameController: "ゲームコントローラー",
    heroNowInConnector: "、ただいま ",
    heroTitleTemplate: "{brand}で中古{item}探し",
    heroRotatingItems: ["家具", "電化製品", "自転車", "教科書", "キッチン用品", "古着"],
    heroLocationSuffix: "にも",
    contactBack: "ホームに戻る",
    contactHint: "ご質問や提携のご相談をお寄せください。メールにて返信いたします。",
    contactTitlePlaceholder: "タイトルを入力",
    contactMainPlaceholder: "内容を入力",
    contactSend: "送信",
    contactSending: "送信中...",
    contactSuccess: "送信が完了しました。追ってご連絡いたします。",
    contactErrorRequired: "タイトルと内容の両方を入力してください。",
    contactErrorFallback: "現在送信できません。もう一度お試しください。",
    faqTitle: "PopOut よくある質問",
    faqIntro:
      "この8つのFAQでは、PopOutがメルボルンでの素早い出品、多言語コミュニケーション、より安全な取引、卒業シーズンの販売をどのように支えるかを説明します。",
    faqDisclaimerTitle: "公式の注意事項",
    faqDisclaimerBody:
      "このページは製品情報のみを目的としており、法的・財務的・安全上の保証を行うものではありません。機能はアプリのバージョン、地域、アカウントの状況により異なる場合があります。",
    faqComparisonCta: "他のマーケットと比較する",
    marketSeoIntroPrefix: "中古品を売買 ·",
    marketSeoIntroNearLabel: "表示中のエリア",
    marketSuburbMapTitle: "{suburb}の地図",
    marketPostMeetupMapAlt: "取引場所の地図",
    aiPostDemoFieldTitle: "タイトル",
    suburbBackToHub: "メルボルンの地域一覧に戻る",
    comparisonHubTitle: "他の中古マーケットとの比較",
    comparisonHubIntro:
      "このページは、PopOut とよく使われる他の中古マーケットの実用的な違いを理解するのに役立ちます。あなたの使い方に合うものを選べるよう、わかりやすく公正な案内を目指しています。",
    comparisonHubPurposeTitle: "このページを設けた理由",
    comparisonHubPurposeBody:
      "多くのユーザーは、繰り返しのフォーム入力、言葉の壁、そして似たような内容で大量に寄せられる購入希望者からのメッセージへの対応に悩んでいます。PopOutの中核となる体験を整理してご紹介することで、機能の違いを評価しやすくしています。",
    comparisonHubDisclaimerTitle: "公式の注記および免責事項",
    comparisonHubDisclaimerBody:
      "このページは製品の説明のみを目的としており、法的助言ではなく、いかなる第三者プラットフォームをも貶める意図はありません。第三者の商標および製品名はそれぞれの権利者に帰属します。機能は変更される場合がありますので、各プラットフォームの公式情報で最新の内容をご確認ください。",
    comparisonHubCardsTitle: "詳細な比較を開く",
    comparisonHubCardsHint: "下からプラットフォームを選ぶと、記事形式の詳しい比較が見られます",
    comparisonHubCardFbBody: "出品のスピード、多言語メッセージ、AI自動返信を比較します。",
    comparisonHubCardFbCta: "PopOut vs Facebook Marketplace を読む",
    comparisonHubCardGumtreeBody: "AIによる出品設定、学生認証、AI自動返信を比較します。",
    comparisonHubCardGumtreeCta: "PopOut vs Gumtree を読む",
    comparisonGumtreeH1: "PopOut vs Gumtree：使用体験の比較",
    comparisonGumtreeLead:
      "このページでは、メルボルンでの中古品取引を想定し、出品設定、多言語コミュニケーション、AI自動返信における実際のワークフローの違いを比較します。",
    comparisonGumtreeDisclaimer:
      "免責事項：このページはユーザー向けの説明と製品紹介のみを目的としており、法的助言ではありません。Gumtree および関連する商標はそれぞれの権利者に帰属します。第三者の機能は変更される場合があります。",
    comparisonGumtreeSection1Title: "1) AI による出品作成のサポート",
    comparisonGumtreeSection1Body:
      "PopOut は商品写真からタイトル・説明・カテゴリの提案を作成できます。ユーザーはそれを確認し、状態や希望価格を設定し、配送や値引きなどのオプションを選ぶことで、より早く出品できます。",
    comparisonGumtreeSection2Title: "2) 多言語に対応した一連の流れ",
    comparisonGumtreeSection2Body:
      "PopOut は英語、簡体字中国語、繁体字中国語、韓国語、日本語、フランス語、スペイン語、ベトナム語に出品とメッセージで対応し、多様な都市環境での言語の壁を減らします。",
    comparisonGumtreeSection3Title: "3）出品者の時間を節約するAI自動返信",
    comparisonGumtreeSection3Body:
      "PopOut MarketにはAI自動返信機能が搭載されています。現時点ではシンプルな機能ですが、現在も改良を重ねており、さらに便利な機能を近日中に追加する予定です。今のところ、繰り返し寄せられる簡単なメッセージや、出品情報にすでに記載されている内容についての質問にAIが対応します。判断が難しいことや投稿に書かれていないことについては、AIが推測で答えることはなく、出品者ご自身が購入希望者に直接お答えいただけるよう残しておきます。これにより、本当に大切な質問に集中していただけます。",
    comparisonGumtreeSection4Title: "4) キャンパスコミュニティ向けの学生認証",
    comparisonGumtreeSection4Body:
      "学生認証の仕組みは、メルボルンの大学や住居を中心とした取引における信頼性とマッチングの質を高めるのに役立ちます。",
    comparisonGumtreeTableTitle: "機能の概要（ユーザー視点）",
    comparisonGumtreeTableNote:
      "注：右の列は一般的な利用傾向を示したもので、アカウント、地域、製品の更新によって異なる場合があります。",
    comparisonGumtreeFeature1Title: "出品準備にかかる時間",
    comparisonGumtreeFeature1Popout: "AI が主要項目を下書きし、ユーザーが詳細を仕上げる",
    comparisonGumtreeFeature1Other: "最初から手動で入力する作業が多くなりがち",
    comparisonGumtreeFeature2Title: "取引の流れにおける言語サポート",
    comparisonGumtreeFeature2Popout: "投稿とチャットの両方で多言語に対応",
    comparisonGumtreeFeature2Other: "言語をまたぐやり取りはユーザー側の翻訳に頼りがち",
    comparisonGumtreeFeature3Title: "AI自動返信",
    comparisonGumtreeFeature3Popout:
      "繰り返しの質問や出品情報に記載済みの内容にはAIが対応し、判断が難しいものは出品者にお任せします",
    comparisonGumtreeFeature3Other:
      "返信はすべて手動で、繰り返しのメッセージを振り分けるAIのサポートはありません",
    comparisonGumtreeFeature4Title: "学生向けの信頼の仕組み",
    comparisonGumtreeFeature4Popout: "学生認証でキャンパス関連のマッチングを支援",
    comparisonGumtreeFeature4Other: "学生専用の本人確認の仕組みは限られる場合がある",
    comparisonGumtreeFinalTitle: "おすすめ",
    comparisonGumtreeFinalBody:
      "出品のスピード、多言語でのわかりやすさ、そして時間を節約できるAI自動返信を重視するなら、PopOutのほうが適しているかもしれません。最新の機能については、ご自身の地域や利用状況に合わせてご確認ください。",
    comparisonBackLabel: "比較一覧に戻る",
    comparisonGumtreeCard1Title: "AI で素早く出品",
    comparisonGumtreeCard1Body: "カテゴリ探しや繰り返しの入力を削減",
    comparisonGumtreeCard2Title: "多言語での取引",
    comparisonGumtreeCard2Body: "主要な多言語取引の流れに対応",
    comparisonGumtreeCard3Title: "AI自動返信",
    comparisonGumtreeCard3Body: "繰り返しの質問にはAIが回答し、あなたの時間を節約します",
    comparisonFbH1: "PopOut vs Facebook Marketplace：使用体験の比較",
    comparisonFbLead:
      "この記事では、出品設定、多言語コミュニケーション、AI自動返信における実際のワークフローの違いを比較します。日々のニーズに合ったマーケットプレイスの選び方をサポートすることを目的としています。",
    comparisonFbDisclaimer:
      "免責事項：このページは製品の説明のみを目的としており、法的助言や第三者プラットフォームに対する否定的な評価ではありません。Facebook Marketplace および関連する商標はそれぞれの権利者に帰属します。機能の提供状況は地域、アカウントの種類、製品の更新によって異なる場合があります。",
    comparisonFbSection1Title: "1) 写真からの AI 出品サポート",
    comparisonFbSection1Body:
      "PopOut では、商品写真をアップロードするとタイトル・説明・カテゴリの下書きが生成されます。ユーザーはそれを確認して情報を補い、状態と価格を設定するだけで、手作業を減らしてより早く出品できます。",
    comparisonFbSection2Title: "2) リアルタイムの多言語コミュニケーション",
    comparisonFbSection2Body:
      "PopOut は英語、簡体字中国語、繁体字中国語、韓国語、日本語、フランス語、スペイン語、ベトナム語に対応しています。投稿やチャットを各ユーザーの好みの言語で読むことができます。",
    comparisonFbSection3Title: "3）出品者の時間を節約するAI自動返信",
    comparisonFbSection3Body:
      "PopOut MarketにはAI自動返信機能が搭載されています。現時点ではシンプルな機能ですが、現在も改良を重ねており、さらに便利な機能を近日中に追加する予定です。今のところ、繰り返し寄せられる簡単なメッセージや、出品情報にすでに記載されている内容についての質問にAIが対応します。判断が難しいことや投稿に書かれていないことについては、AIが推測で答えることはなく、出品者ご自身が購入希望者に直接お答えいただけるよう残しておきます。これにより、本当に大切な質問に時間を使っていただけます。",
    comparisonFbSection4Title: "4) メルボルンの学生認証の仕組み",
    comparisonFbSection4Body:
      "学生コミュニティや住居が集まる地域に向けて、PopOut は学生認証の仕組みを備えており、キャンパス関連の取引における信頼性と見つけやすさを高めます。",
    comparisonFbTableTitle: "機能の概要（ユーザー視点）",
    comparisonFbTableNote:
      "注：右の列は一般的な利用傾向を反映したもので、時間とともに変わる場合があります。",
    comparisonFbFeature1Title: "出品開始のスピード",
    comparisonFbFeature1Popout: "AI が写真からタイトル・説明・カテゴリを下書き",
    comparisonFbFeature1Other: "通常は手動での入力とカテゴリ選択に依存",
    comparisonFbFeature2Title: "多言語メッセージ",
    comparisonFbFeature2Popout: "対応言語をまたいで投稿やチャットの内容を理解できる",
    comparisonFbFeature2Other: "言語をまたぐやり取りは自分での翻訳に頼りがち",
    comparisonFbFeature3Title: "AI自動返信",
    comparisonFbFeature3Popout:
      "繰り返しの質問や出品情報に記載済みの内容にはAIが対応し、判断が難しいものは出品者にお任せします",
    comparisonFbFeature3Other:
      "メッセージのやり取りはすべて手動で、繰り返しの質問に対応するAIのサポートはありません",
    comparisonFbFeature4Title: "学生向けの信頼レイヤー",
    comparisonFbFeature4Popout: "キャンパスや住居のマッチング向けの学生認証の仕組み",
    comparisonFbFeature4Other:
      "学生専用の本人確認の流れは限られているか、提供されていないことが多い",
    comparisonFbFinalTitle: "この比較の使い方",
    comparisonFbFinalBody:
      "より速い出品、よりスムーズな多言語コミュニケーション、そして繰り返し寄せられる質問に対応するAI自動返信を重視するなら、PopOutのワークフローのほうが合っているかもしれません。最新の機能の詳細は、必ずご自身の利用状況に合わせてご確認ください。",
    comparisonFbCard1Title: "AI 出品アシスト",
    comparisonFbCard1Body: "写真をもとにタイトルと説明を下書き",
    comparisonFbCard2Title: "リアルタイム翻訳",
    comparisonFbCard2Body: "言語をまたぐ投稿やチャットがよりスムーズに",
    comparisonFbCard3Title: "AI自動返信",
    comparisonFbCard3Body: "繰り返しの質問にはAIが対応するので、本当に大切な質問に集中できます",
    notFoundTitle: "ページが見つかりません",
    notFoundDescription: "リクエストされたページは存在しないか、公開されていません。",
  },
  vi: {
    topDownload: "Tải xuống",
    topLanguage: "Ngôn ngữ",
    languageModalTitle: "Chọn ngôn ngữ của bạn",
    languageModalHint: "PopOut hỗ trợ cộng đồng địa phương với nhiều ngôn ngữ.",
    heroSecondaryPrefix: "Mua bán thoải mái với hàng xóm quanh đây, trò chuyện bằng ",
    heroSecondaryLink: "tiếng Việt",
    heroSecondarySuffix: " của bạn",
    heroExploreCta: "Khám phá thêm sản phẩm",
    downloadLine: "Tải ứng dụng PopOut Market cho iOS và Android",
    slogan: "mua và bán với những người xung quanh bạn",
    ratingAria: "Đánh giá 5.0 trên 5 sao trên App Store",
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
    marketNearbyNotice: "Chưa có tin đăng ở {suburb}, đang hiển thị khu vực lân cận",
    marketLocationDeniedHint:
      "Cho phép truy cập vị trí trên trình duyệt để xem khoảng cách đường thẳng đến điểm giao hàng.",
    marketLocationUnsupportedHint:
      "Trình duyệt này không hỗ trợ định vị nên không thể hiển thị khoảng cách.",
    marketLocationRetry: "Yêu cầu vị trí lại",
    marketPostBack: "Quay lại",
    marketPostBackAria: "Quay lại chợ",
    marketPostNotFoundTitle: "Không tìm thấy tin",
    marketPostNotFoundBody: "Tin có thể đã bị gỡ hoặc liên kết không đúng.",
    marketPostListedLabel: "Đăng lúc",
    marketPostAreaLabel: "Khu vực",
    marketPostContactSellerCta: "Liên hệ người bán trên ứng dụng",
    marketPostListedInOn: "Đăng tại {suburb} vào ngày {date}",
    marketPostListedIn: "Đăng tại {suburb}",
    marketPostListedOn: "Đăng vào ngày {date}",
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
    translationDemoTitle: "Nói một lần, *ai cũng* hiểu",
    translationDemoSubtitle:
      "Bạn gửi bằng ngôn ngữ của bạn, đối phương nhận bằng ngôn ngữ của họ — dịch tự động.",
    aiPostDemoTitle: "Chụp ảnh. AI lo *phần còn lại*",
    aiPostDemoSubtitle: "Chụp ảnh, AI tự tạo tiêu đề, danh mục và mô tả — bạn chỉ cần nhập giá.",
    autoReplyDemoTitle: "Chỉ người *thật sự* muốn mua",
    autoReplyDemoSubtitle: 'AI trả lời "Còn không bạn?"',
    autoReplyDemoInboxTitle: "Tin nhắn",
    autoReplyDemoTabBuying: "Đang mua",
    autoReplyDemoTabSelling: "Đang bán",
    autoReplyDemoBadge: "Bật trả lời tự động",
    autoReplyDemoTimeNow: "vừa xong",
    autoReplyDemoTime1Min: "1 phút",
    autoReplyDemoMsgMeet: "Mình hẹn gặp lúc mấy giờ vậy?",
    autoReplyDemoMsgPrice: "Giá $50 nha. Bạn quan tâm không?",
    autoReplyDemoMsgSelling: "Mình bán $30 thôi. Bạn thấy sao?",
    autoReplyDemoMsgGreeting: "Chào bạn! Cái ghế văn phòng bọc da vẫn còn nha.",
    aiPostDemoPrice: "Giá",
    aiPostDemoCondition: "Tình trạng",
    aiPostDemoYouFill: "Bạn nhập",
    scheduleDemoTitle: "Gặp nhau, luôn đúng hẹn.",
    scheduleDemoSubtitle:
      "Chọn thời gian và địa điểm, gặp mặt rồi quét mã QR xác nhận — giảm vắng mặt, xây dựng cộng đồng tin cậy.",
    scheduleDemoDate: "Ngày",
    scheduleDemoTime: "Giờ",
    scheduleDemoLocation: "Điểm hẹn",
    scheduleDemoScheduled: "Đã hẹn",
    scheduleDemoScanHint: "Quét mã xác nhận",
    scheduleDemoVerified: "Đã xác nhận gặp mặt",
    studentVerifyTitle: "Sinh viên xác minh. Giao dịch tin cậy.",
    studentVerifySubtitle:
      "Xác minh email sinh viên để nhận huy hiệu tin cậy — mỗi giao dịch trong cộng đồng đều an toàn hơn.",
    studentVerifyEmailLabel: "Email sinh viên",
    studentVerifyUniversity: "Trường đại học",
    studentVerifyVerifying: "Đang xác minh…",
    studentVerifyVerified: "Email đã xác minh",
    studentVerifyBadge: "Sinh viên đã xác minh",
    safetyZoneTitle: "Gặp gỡ an toàn hơn, từ địa điểm.",
    safetyZoneSubtitle:
      "Khi bạn chọn khu vực hẹn gặp, ứng dụng gợi ý các Vùng an toàn gần đó — nơi đông người, sáng sủa, có camera — để giao dịch yên tâm hơn và cộng đồng gắn kết hơn.",
    safetyZoneNearLabel: "Khu vực hẹn",
    safetyZoneFinding: "Đang quét vùng an toàn…",
    safetyZoneListTitle: "Địa điểm gợi ý",
    safetyZoneBadgeCctv: "CCTV",
    safetyZoneBadgeBusy: "Đông người",
    safetyZoneBadgeLit: "Sáng sủa",
    footerLegalNavAria: "Điều khoản và liên hệ",
    footerCopyright: "Bản quyền © 2026 PopOut Market Pty Ltd. Mọi quyền được bảo lưu.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "Giới thiệu PopOut Market",
    footerNavTerms: "Điều khoản sử dụng",
    footerNavPrivacy: "Chính sách quyền riêng tư",
    footerNavChildSafety: "An toàn trẻ em",
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
      'PopOut ra đời từ đó. Chúng tôi không chỉ là chợ đồ cũ — chúng tôi muốn là "điểm dừng đầu tiên" của bạn khi đến Melbourne.',
    aboutWhyTitle: "Vì sao chọn PopOut?",
    aboutWhyNeighbourhoodTitle: 'Giao dịch "hàng xóm" thật sự',
    aboutWhyNeighbourhoodBody:
      "Gợi ý theo vị trí chính xác tại Melbourne giúp bạn khám phá món hời ngay trước cửa. Biết người bán có thể ở ngay phố bên cạnh tạo nền tảng tin cậy cho mỗi giao dịch.",
    aboutWhySafetyTitle: "An toàn là nguyên tắc cốt lõi",
    aboutWhySafetyBody:
      "Sự an toàn của bạn được đặt lên hàng đầu. Chúng tôi gợi ý những điểm gặp công cộng đông người, đủ ánh sáng khắp Melbourne làm nơi giao dịch trực tiếp an toàn hơn, và khuyến khích xác minh danh tính sinh viên. Mỗi giao dịch trên PopOut có thêm một lớp đảm bảo.",
    aboutWhyCommunicationTitle: "Kết nối không biên giới",
    aboutWhyCommunicationBody:
      "Ngôn ngữ không nên là rào cản. PopOut có dịch song ngữ thời gian thực mạnh. Trò chuyện bằng tiếng mẹ đẻ — đối phương nhận bản dịch tự động. Dù tiếng Anh chưa hoàn hảo, bạn vẫn có thể giao dịch tự do và kết bạn.",
    aboutPrivacyTitle: "Chúng tôi bảo vệ quyền riêng tư",
    aboutPrivacyLead: "Tại PopOut, quyền riêng tư là quyền cơ bản.",
    aboutPrivacyMinimalTitle: "Thu thập tối thiểu",
    aboutPrivacyMinimalBody:
      "Chúng tôi chỉ thu thập thông tin cần thiết như số điện thoại và email để xác minh đăng nhập.",
    aboutPrivacyStorageTitle: "Lưu trữ tiêu chuẩn cao",
    aboutPrivacyStorageBody:
      "Dữ liệu nhạy cảm được lưu trong cơ sở dữ liệu mã hóa, cả khi truyền và khi lưu trữ.",
    aboutPrivacyNoTracesTitle: "Không lưu dấu vết",
    aboutPrivacyNoTracesBody:
      "Chúng tôi không theo dõi hay lưu giữ lịch sử vị trí của bạn — GPS chỉ được dùng trong giây lát để xác minh khu vực (suburb) của bạn rồi xóa ngay. Hãy khám phá với an tâm.",
    aboutPrivacyLinkMore: "Thông tin chi tiết về quyền riêng tư",
    aboutVisionTitle: "Tầm nhìn",
    aboutVisionP1:
      'PopOut có nghĩa là "bước ra ngoài, kết nối với hàng xóm". Qua ứng dụng nhỏ này, chúng tôi hy vọng xóa tan sự lạnh lẽo của đô thị và lấp đầy mỗi khu phố Melbourne bằng sự giúp đỡ lẫn nhau.',
    aboutVisionP2:
      "Dù bạn là sinh viên mới dựng nhà, hay người đi làm bắt đầu chương mới, PopOut luôn bên bạn.",
    aboutVisionP3:
      "Cảm ơn bạn đã chọn PopOut. Cùng nhau xây một cộng đồng Melbourne an toàn và gắn kết hơn.",
    aboutFeedbackTitle: "Góp ý & phản hồi",
    aboutFeedbackLead:
      "Chúng tôi luôn phát triển. Nếu bạn có ý tưởng hoặc chỉ muốn chào hỏi, hãy liên hệ:",
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "Bản tiếng Anh của tài liệu này là bản có hiệu lực.",
    languageModalCloseAria: "Đóng bộ chọn ngôn ngữ",
    carouselGoToItemAria: "Đến mục {index}",
    demoListingWoodenDiningChair: "Ghế ăn gỗ",
    demoListingMountainBike: "Xe đạp leo núi",
    demoListingAcousticGuitar: "Đàn guitar acoustic",
    demoListingWirelessHeadphones: "Tai nghe không dây",
    demoListingTextbookBundle: "Bộ sách giáo khoa",
    demoListingSmartWatch: "Đồng hồ thông minh",
    demoListingGameController: "Tay cầm chơi game",
    heroNowInConnector: ", nay đã có tại ",
    heroTitleTemplate: "Tìm {item} cũ trên {brand}",
    heroRotatingItems: ["nội thất", "đồ điện tử", "xe đạp", "sách giáo khoa", "đồ bếp", "quần áo"],
    heroLocationSuffix: "",
    contactBack: "Về trang chủ",
    contactHint: "Hãy để lại câu hỏi hoặc đề nghị hợp tác, chúng tôi sẽ phản hồi qua email.",
    contactTitlePlaceholder: "Nhập tiêu đề ngắn",
    contactMainPlaceholder: "Viết nội dung của bạn",
    contactSend: "Gửi",
    contactSending: "Đang gửi...",
    contactSuccess: "Đã gửi thành công. Chúng tôi sẽ phản hồi bạn sớm.",
    contactErrorRequired: "Vui lòng điền cả Tiêu đề và Nội dung.",
    contactErrorFallback: "Hiện không thể gửi. Vui lòng thử lại.",
    faqTitle: "Câu hỏi thường gặp về PopOut",
    faqIntro:
      "Tám câu hỏi thường gặp này giải thích cách PopOut hỗ trợ đăng tin nhanh hơn, giao tiếp đa ngôn ngữ, giao dịch an toàn hơn và bán đồ mùa tốt nghiệp tại Melbourne.",
    faqDisclaimerTitle: "Lưu ý chính thức",
    faqDisclaimerBody:
      "Trang này chỉ cung cấp thông tin sản phẩm và không cấu thành bảo đảm về pháp lý, tài chính hay an toàn. Tính năng có thể khác nhau theo phiên bản ứng dụng, khu vực và tài khoản.",
    faqComparisonCta: "So sánh với các nền tảng khác",
    marketSeoIntroPrefix: "Mua bán đồ cũ tại",
    marketSeoIntroNearLabel: "Đang hiển thị tại",
    marketSuburbMapTitle: "Bản đồ {suburb}",
    marketPostMeetupMapAlt: "Bản đồ địa điểm gặp mặt",
    aiPostDemoFieldTitle: "Tiêu đề",
    suburbBackToHub: "Quay lại các khu vực Melbourne",
    comparisonHubTitle: "So sánh với các chợ đồ cũ khác",
    comparisonHubIntro:
      "Trang này giúp bạn hiểu những khác biệt thực tế giữa PopOut và các chợ đồ cũ phổ biến khác. Mục tiêu là một hướng dẫn thân thiện, minh bạch để bạn chọn nền tảng phù hợp với cách dùng của mình.",
    comparisonHubPurposeTitle: "Vì sao có trang này",
    comparisonHubPurposeBody:
      "Nhiều người dùng gặp khó khăn với việc điền biểu mẫu lặp đi lặp lại, rào cản ngôn ngữ và việc xử lý một lượng lớn tin nhắn trùng lặp từ người mua. Chúng tôi trình bày trải nghiệm cốt lõi của PopOut theo một định dạng có cấu trúc để bạn dễ dàng đánh giá những khác biệt về tính năng.",
    comparisonHubDisclaimerTitle: "Lưu ý chính thức và miễn trừ trách nhiệm",
    comparisonHubDisclaimerBody:
      "Trang này chỉ nhằm giới thiệu sản phẩm. Đây không phải là tư vấn pháp lý và không nhằm hạ thấp bất kỳ nền tảng bên thứ ba nào. Thương hiệu và tên sản phẩm của bên thứ ba thuộc về chủ sở hữu tương ứng. Tính năng có thể thay đổi theo thời gian; vui lòng kiểm tra thông tin mới nhất trên kênh chính thức của từng nền tảng.",
    comparisonHubCardsTitle: "Xem so sánh chi tiết",
    comparisonHubCardsHint: "Chọn một nền tảng bên dưới để xem bài so sánh đầy đủ",
    comparisonHubCardFbBody:
      "So sánh tốc độ đăng tin, nhắn tin đa ngôn ngữ và tính năng trả lời tự động bằng AI.",
    comparisonHubCardFbCta: "Đọc PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "So sánh quy trình đăng tin bằng AI, tính năng xác minh sinh viên và trả lời tự động bằng AI.",
    comparisonHubCardGumtreeCta: "Đọc PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree: So sánh trải nghiệm",
    comparisonGumtreeLead:
      "Trang này so sánh những khác biệt trong quy trình thực tế liên quan đến việc đăng tin, giao tiếp đa ngôn ngữ và tính năng trả lời tự động bằng AI trong các trường hợp mua bán đồ cũ tại Melbourne.",
    comparisonGumtreeDisclaimer:
      "Miễn trừ trách nhiệm: trang này chỉ nhằm giới thiệu cho người dùng và sản phẩm, không phải tư vấn pháp lý. Gumtree và các nhãn hiệu liên quan thuộc về chủ sở hữu tương ứng. Tính năng của bên thứ ba có thể thay đổi theo thời gian.",
    comparisonGumtreeSection1Title: "1) Thiết lập đăng tin có AI hỗ trợ",
    comparisonGumtreeSection1Body:
      "PopOut có thể soạn gợi ý tiêu đề, mô tả và danh mục từ ảnh sản phẩm. Người dùng chỉ cần xem lại, đặt tình trạng và giá mong muốn, rồi chọn các tùy chọn như giao hàng và thương lượng để đăng nhanh hơn.",
    comparisonGumtreeSection2Title: "2) Luồng đa ngôn ngữ tích hợp sẵn",
    comparisonGumtreeSection2Body:
      "PopOut hỗ trợ tiếng Anh, tiếng Trung giản thể, tiếng Trung phồn thể, tiếng Hàn, tiếng Nhật, tiếng Pháp, tiếng Tây Ban Nha và tiếng Việt khi đăng tin và nhắn tin, giúp giảm rào cản ngôn ngữ trong một thành phố đa dạng.",
    comparisonGumtreeSection3Title: "3) Tự động trả lời bằng AI giúp người bán tiết kiệm thời gian",
    comparisonGumtreeSection3Body:
      "PopOut Market có tính năng tự động trả lời bằng AI. Hiện tại tính năng còn đơn giản và chúng tôi đang tích cực cải thiện, với nhiều khả năng mạnh mẽ hơn sẽ sớm ra mắt. Ngay bây giờ, AI có thể xử lý lượng lớn tin nhắn lặp đi lặp lại, ít quan trọng và trả lời những câu hỏi đã có sẵn trong tin đăng của bạn. Với những thông tin còn chưa chắc chắn hoặc không được nêu trong tin đăng, AI sẽ không đoán bừa mà nhường lại cho bạn tự trả lời người mua, nhờ vậy bạn có thể tập trung vào những câu hỏi thực sự quan trọng.",
    comparisonGumtreeSection4Title: "4) Xác minh sinh viên cho cộng đồng trường học",
    comparisonGumtreeSection4Body:
      "Quy trình xác minh sinh viên giúp nâng cao mức độ tin cậy và chất lượng kết nối cho các giao dịch quanh trường học và nơi ở tại Melbourne.",
    comparisonGumtreeTableTitle: "Tóm tắt tính năng (theo góc nhìn người dùng)",
    comparisonGumtreeTableNote:
      "Lưu ý: cột bên phải mô tả các mẫu sử dụng phổ biến và có thể khác nhau tùy tài khoản, khu vực hoặc bản cập nhật sản phẩm.",
    comparisonGumtreeFeature1Title: "Thời gian chuẩn bị đăng tin",
    comparisonGumtreeFeature1Popout:
      "AI soạn các trường chính trước, người dùng hoàn thiện chi tiết",
    comparisonGumtreeFeature1Other: "Thường phải nhập biểu mẫu thủ công từ đầu",
    comparisonGumtreeFeature2Title: "Hỗ trợ ngôn ngữ trong quá trình giao dịch",
    comparisonGumtreeFeature2Popout: "Hiểu đa ngôn ngữ trong cả bài đăng và trò chuyện",
    comparisonGumtreeFeature2Other:
      "Giao tiếp khác ngôn ngữ thường phụ thuộc vào việc người dùng tự dịch",
    comparisonGumtreeFeature3Title: "Tự động trả lời bằng AI",
    comparisonGumtreeFeature3Popout:
      "AI trả lời các câu hỏi lặp lại và thông tin đã có trong tin đăng; những câu chưa chắc chắn thì để lại cho bạn",
    comparisonGumtreeFeature3Other:
      "Mọi phản hồi đều phải làm thủ công, không có AI hỗ trợ lọc tin nhắn lặp lại",
    comparisonGumtreeFeature4Title: "Cơ chế tin cậy dành riêng cho sinh viên",
    comparisonGumtreeFeature4Popout: "Xác minh sinh viên giúp kết nối quanh trường học",
    comparisonGumtreeFeature4Other:
      "Quy trình xác minh danh tính sinh viên riêng có thể bị hạn chế",
    comparisonGumtreeFinalTitle: "Gợi ý lựa chọn",
    comparisonGumtreeFinalBody:
      "Nếu ưu tiên của bạn là tốc độ đăng tin, sự rõ ràng khi giao tiếp đa ngôn ngữ và tính năng trả lời tự động bằng AI giúp tiết kiệm thời gian, thì PopOut có thể là lựa chọn phù hợp hơn. Hãy tự kiểm chứng các tính năng hiện có dựa trên khu vực và cách sử dụng của riêng bạn.",
    comparisonBackLabel: "Quay lại trang so sánh",
    comparisonGumtreeCard1Title: "Đăng tin nhanh bằng AI",
    comparisonGumtreeCard1Body: "Giảm việc tìm danh mục và nhập lại biểu mẫu",
    comparisonGumtreeCard2Title: "Giao dịch đa ngôn ngữ",
    comparisonGumtreeCard2Body: "Hỗ trợ các luồng giao dịch khác ngôn ngữ chính",
    comparisonGumtreeCard3Title: "Tự động trả lời bằng AI",
    comparisonGumtreeCard3Body: "AI trả lời các câu hỏi lặp lại để tiết kiệm thời gian cho bạn",
    comparisonFbH1: "PopOut vs Facebook Marketplace: So sánh trải nghiệm",
    comparisonFbLead:
      "Bài viết này so sánh những khác biệt thực tế trong quy trình đăng tin, giao tiếp đa ngôn ngữ và tính năng trả lời tự động bằng AI. Mục đích là giúp người dùng chọn được một quy trình mua bán phù hợp với nhu cầu hằng ngày.",
    comparisonFbDisclaimer:
      "Miễn trừ trách nhiệm: trang này chỉ nhằm giới thiệu sản phẩm, không phải tư vấn pháp lý hay tuyên bố tiêu cực về bất kỳ nền tảng bên thứ ba nào. Facebook Marketplace và các nhãn hiệu liên quan thuộc về chủ sở hữu tương ứng. Khả năng có tính năng có thể khác nhau tùy khu vực, loại tài khoản và bản cập nhật sản phẩm.",
    comparisonFbSection1Title: "1) Đăng tin bằng AI từ ảnh",
    comparisonFbSection1Body:
      "Trên PopOut, tải ảnh sản phẩm lên có thể tạo bản nháp tiêu đề, mô tả và gợi ý danh mục. Người dùng xem lại, bổ sung thông tin, đặt tình trạng và giá, rồi đăng nhanh hơn với ít thao tác thủ công.",
    comparisonFbSection2Title: "2) Giao tiếp đa ngôn ngữ theo thời gian thực",
    comparisonFbSection2Body:
      "PopOut hỗ trợ tiếng Anh, tiếng Trung giản thể, tiếng Trung phồn thể, tiếng Hàn, tiếng Nhật, tiếng Pháp, tiếng Tây Ban Nha và tiếng Việt. Bài đăng và trò chuyện có thể đọc bằng ngôn ngữ ưa thích của từng người dùng.",
    comparisonFbSection3Title: "3) Tự động trả lời bằng AI giúp người bán tiết kiệm thời gian",
    comparisonFbSection3Body:
      "PopOut Market có tính năng tự động trả lời bằng AI. Hiện tại tính năng còn đơn giản và chúng tôi đang tích cực cải thiện, với nhiều khả năng mạnh mẽ hơn sẽ sớm ra mắt. Ngay bây giờ, AI có thể xử lý các tin nhắn lặp đi lặp lại, ít quan trọng và trả lời những câu hỏi đã có sẵn trong tin đăng của bạn. Với những thông tin còn chưa chắc chắn hoặc không được nêu trong tin đăng, AI sẽ không đoán bừa mà nhường lại cho bạn tự trả lời người mua, nhờ vậy bạn có thể dành thời gian cho những câu hỏi thực sự quan trọng.",
    comparisonFbSection4Title: "4) Quy trình xác minh sinh viên tại Melbourne",
    comparisonFbSection4Body:
      "Đối với cộng đồng sinh viên và các khu nhà ở, PopOut có kênh xác minh sinh viên để tăng độ tin cậy và khả năng được tìm thấy trong các giao dịch quanh trường học.",
    comparisonFbTableTitle: "Tóm tắt tính năng (theo góc nhìn người dùng)",
    comparisonFbTableNote:
      "Lưu ý: cột bên phải phản ánh các mẫu sử dụng phổ biến và có thể thay đổi theo thời gian.",
    comparisonFbFeature1Title: "Tốc độ bắt đầu đăng tin",
    comparisonFbFeature1Popout: "AI soạn tiêu đề/mô tả/danh mục từ ảnh",
    comparisonFbFeature1Other: "Thường phải tự nhập biểu mẫu và chọn danh mục",
    comparisonFbFeature2Title: "Nhắn tin đa ngôn ngữ",
    comparisonFbFeature2Popout:
      "Nội dung bài đăng và trò chuyện có thể hiểu được qua các ngôn ngữ được hỗ trợ",
    comparisonFbFeature2Other: "Giao tiếp khác ngôn ngữ thường phụ thuộc vào việc tự dịch",
    comparisonFbFeature3Title: "Tự động trả lời bằng AI",
    comparisonFbFeature3Popout:
      "AI trả lời các câu hỏi lặp lại và thông tin đã có trong tin đăng; những câu chưa chắc chắn sẽ chờ bạn xử lý",
    comparisonFbFeature3Other:
      "Việc nhắn tin hoàn toàn thủ công, không có AI hỗ trợ xử lý các câu hỏi lặp lại",
    comparisonFbFeature4Title: "Lớp tin cậy hướng đến sinh viên",
    comparisonFbFeature4Popout: "Quy trình xác minh sinh viên để kết nối quanh trường/nơi ở",
    comparisonFbFeature4Other:
      "Quy trình xác minh danh tính sinh viên riêng thường hạn chế hoặc không có",
    comparisonFbFinalTitle: "Cách sử dụng phần so sánh này",
    comparisonFbFinalBody:
      "Nếu ưu tiên của bạn là đăng tin nhanh hơn, giao tiếp đa ngôn ngữ mượt mà hơn và tính năng trả lời tự động bằng AI giúp xử lý những câu hỏi lặp đi lặp lại, thì quy trình của PopOut có thể phù hợp hơn với bạn. Hãy luôn tự xác minh chi tiết các tính năng hiện có trong bối cảnh sử dụng của riêng bạn.",
    comparisonFbCard1Title: "Trợ lý đăng tin AI",
    comparisonFbCard1Body: "Soạn nháp tiêu đề và mô tả từ ảnh",
    comparisonFbCard2Title: "Dịch trực tiếp",
    comparisonFbCard2Body: "Bài đăng và trò chuyện khác ngôn ngữ mượt mà hơn",
    comparisonFbCard3Title: "Tự động trả lời bằng AI",
    comparisonFbCard3Body:
      "AI xử lý các câu hỏi lặp lại để bạn tập trung vào những câu hỏi thực sự quan trọng",
    notFoundTitle: "Không tìm thấy trang",
    notFoundDescription: "Trang bạn yêu cầu không tồn tại hoặc không được công khai.",
  },
  fr: {
    topDownload: "Télécharger",
    topLanguage: "Langue",
    languageModalTitle: "Choisissez votre langue",
    languageModalHint: "PopOut soutient les communautés locales en plusieurs langues.",
    heroSecondaryPrefix: "Achetez et vendez près de chez vous, entre voisins, tout en ",
    heroSecondaryLink: "français",
    heroSecondarySuffix: "",
    heroExploreCta: "Explorer plus d'articles",
    downloadLine: "Téléchargez l'application PopOut Market pour iOS et Android",
    slogan: "achetez et vendez avec les personnes autour de vous",
    ratingAria: "Note de 5,0 sur 5 sur l'App Store",
    homeAria: "Accueil PopOut",
    appStoreAlt: "Télécharger sur l'App Store",
    googlePlayAlt: "Obtenir sur Google Play",
    marketPageTitle: "Marché",
    marketAreaModalTitle: "Choisir votre zone",
    marketAreaModalHint:
      "Appuyez sur une banlieue pour mettre à jour la zone affichée en haut à gauche.",
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
    marketSupabaseLoadError:
      "Impossible de charger les annonces pour le moment. Réessayez dans un instant.",
    marketSupabaseRetry: "Réessayer",
    marketSupabaseEmpty: "Aucune annonce dans cette zone pour le moment.",
    marketSupabaseLoadingAria: "Chargement des annonces",
    marketNearbyNotice: "Aucune annonce à {suburb} pour l’instant, affichage des environs",
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
    marketPostContactSellerCta: "Contacter le vendeur dans l'appli",
    marketPostListedInOn: "Publié à {suburb} le {date}",
    marketPostListedIn: "Publié à {suburb}",
    marketPostListedOn: "Publié le {date}",
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
    translationDemoTitle: "Dites-le une fois. *Tout le monde* comprend",
    translationDemoSubtitle:
      "Envoyez dans votre langue, l'autre reçoit dans la sienne — traduction instantanée.",
    aiPostDemoTitle: "Prenez une photo. L'IA fait le *reste*",
    aiPostDemoSubtitle:
      "Photographiez l'objet et l'IA génère titre, catégorie et description — vous n'avez qu'à fixer le prix.",
    autoReplyDemoTitle: "Fini les *pertes de temps*",
    autoReplyDemoSubtitle: "L'IA répond : « C'est toujours dispo ? »",
    autoReplyDemoInboxTitle: "Messages",
    autoReplyDemoTabBuying: "Achats",
    autoReplyDemoTabSelling: "Ventes",
    autoReplyDemoBadge: "Réponse auto activée",
    autoReplyDemoTimeNow: "à l'instant",
    autoReplyDemoTime1Min: "1 min",
    autoReplyDemoMsgMeet: "À quelle heure nous rencontrons-nous ?",
    autoReplyDemoMsgPrice: "Le prix est de 50 $. Êtes-vous intéressé(e) ?",
    autoReplyDemoMsgSelling: "Je le vends 30 $. Intéressé(e) ?",
    autoReplyDemoMsgGreeting: "Bonjour ! La chaise de bureau en cuir est toujours disponible.",
    aiPostDemoPrice: "Prix",
    aiPostDemoCondition: "État",
    aiPostDemoYouFill: "À vous",
    scheduleDemoTitle: "Des rendez-vous en toute confiance.",
    scheduleDemoSubtitle:
      "Choisissez un créneau et un lieu, retrouvez l'acheteur et scannez le QR pour confirmer — moins de faux bonds, plus de confiance.",
    scheduleDemoDate: "Date",
    scheduleDemoTime: "Heure",
    scheduleDemoLocation: "Point de rencontre",
    scheduleDemoScheduled: "Planifié",
    scheduleDemoScanHint: "Scanner pour vérifier",
    scheduleDemoVerified: "Rencontre vérifiée",
    studentVerifyTitle: "Étudiants vérifiés. Échanges de confiance.",
    studentVerifySubtitle:
      "Vérifiez votre e-mail étudiant pour obtenir un badge de confiance — chaque transaction dans la communauté plus sûre.",
    studentVerifyEmailLabel: "E-mail étudiant",
    studentVerifyUniversity: "Université",
    studentVerifyVerifying: "Vérification…",
    studentVerifyVerified: "E-mail vérifié",
    studentVerifyBadge: "Étudiant vérifié",
    safetyZoneTitle: "Des rencontres plus sûres, dès le lieu choisi.",
    safetyZoneSubtitle:
      "Lorsque vous choisissez où vous retrouver, nous suggérons des zones sécurisées à proximité — lieux fréquentés, bien éclairés, avec caméras — pour des échanges plus sereins et une communauté plus solide.",
    safetyZoneNearLabel: "Zone de rendez-vous",
    safetyZoneFinding: "Recherche de zones sécurisées…",
    safetyZoneListTitle: "Suggestions",
    safetyZoneBadgeCctv: "Vidéosurveillance",
    safetyZoneBadgeBusy: "Fréquenté",
    safetyZoneBadgeLit: "Bien éclairé",
    footerLegalNavAria: "Politiques et contact",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. Tous droits réservés.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "À propos de PopOut Market",
    footerNavTerms: "Conditions d’utilisation",
    footerNavPrivacy: "Politique de confidentialité",
    footerNavChildSafety: "Sécurité des enfants",
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
      "Votre sécurité passe avant tout. Nous suggérons des lieux publics fréquentés et bien éclairés à Melbourne comme endroits plus sûrs pour les remises en main propre, et encourageons la vérification du statut étudiant. Chaque transaction sur PopOut comporte une assurance supplémentaire.",
    aboutWhyCommunicationTitle: "Communiquer sans frontières",
    aboutWhyCommunicationBody:
      "La langue ne doit pas être un obstacle. PopOut propose une traduction bilingue en temps réel. Écrivez dans votre langue — l’autre reçoit une traduction automatique. Même si votre anglais n’est pas parfait, vous pouvez échanger et vous faire des amis.",
    aboutPrivacyTitle: "Nous protégeons votre vie privée",
    aboutPrivacyLead: "Chez PopOut, la confidentialité est un droit fondamental.",
    aboutPrivacyMinimalTitle: "Collecte minimale",
    aboutPrivacyMinimalBody:
      "Nous ne collectons que l’essentiel — téléphone et e‑mail pour la vérification de connexion.",
    aboutPrivacyStorageTitle: "Stockage exigeant",
    aboutPrivacyStorageBody:
      "Vos données sensibles sont stockées dans des bases chiffrées, en transit comme au repos.",
    aboutPrivacyNoTracesTitle: "Aucune trace",
    aboutPrivacyNoTracesBody:
      "Nous ne suivons ni ne conservons votre historique de localisation : le GPS sert uniquement, brièvement, à vérifier votre quartier (suburb), puis il est supprimé. Explorez l’appli en toute sérénité.",
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
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "La version anglaise de ce document fait foi.",
    languageModalCloseAria: "Fermer le sélecteur de langue",
    carouselGoToItemAria: "Aller à l'élément {index}",
    demoListingWoodenDiningChair: "Chaise de salle à manger en bois",
    demoListingMountainBike: "Vélo tout terrain",
    demoListingAcousticGuitar: "Guitare acoustique",
    demoListingWirelessHeadphones: "Casque sans fil",
    demoListingTextbookBundle: "Lot de manuels",
    demoListingSmartWatch: "Montre connectée",
    demoListingGameController: "Manette de jeu",
    heroNowInConnector: ", désormais à ",
    heroTitleTemplate: "Trouvez {item} d'occasion sur {brand}",
    heroRotatingItems: [
      "meubles",
      "électronique",
      "vélos",
      "manuels scolaires",
      "ustensiles de cuisine",
      "vêtements",
    ],
    heroLocationSuffix: "",
    contactBack: "Retour à l’accueil",
    contactHint:
      "Indiquez votre question ou votre demande de partenariat, nous vous répondrons par e-mail.",
    contactTitlePlaceholder: "Saisissez un titre court",
    contactMainPlaceholder: "Écrivez votre message",
    contactSend: "Envoyer",
    contactSending: "Envoi en cours...",
    contactSuccess: "Envoyé avec succès. Nous vous répondrons bientôt.",
    contactErrorRequired: "Veuillez remplir le titre et le message.",
    contactErrorFallback: "Impossible d’envoyer pour le moment. Veuillez réessayer.",
    faqTitle: "FAQ PopOut",
    faqIntro:
      "Ces huit questions fréquentes expliquent comment PopOut facilite la publication rapide, la communication multilingue, des transactions plus sûres et les ventes de fin d’études à Melbourne.",
    faqDisclaimerTitle: "Note officielle",
    faqDisclaimerBody:
      "Cette page est fournie à titre informatif sur le produit et ne constitue aucune garantie juridique, financière ou de sécurité. Les fonctionnalités peuvent varier selon la version de l’application, la région et le compte.",
    faqComparisonCta: "Comparer avec d’autres plateformes",
    marketSeoIntroPrefix: "Achetez et vendez des articles d’occasion à",
    marketSeoIntroNearLabel: "Articles affichés à",
    marketSuburbMapTitle: "Carte de {suburb}",
    marketPostMeetupMapAlt: "Carte du lieu de rencontre",
    aiPostDemoFieldTitle: "Titre",
    suburbBackToHub: "Retour aux quartiers de Melbourne",
    comparisonHubTitle: "Comparaison avec d'autres marchés de seconde main",
    comparisonHubIntro:
      "Cette page vous aide à comprendre les différences concrètes entre PopOut et d'autres marchés de seconde main courants. L'objectif est un guide clair et transparent pour choisir ce qui convient à votre usage.",
    comparisonHubPurposeTitle: "Pourquoi cette page",
    comparisonHubPurposeBody:
      "De nombreux utilisateurs peinent à remplir des formulaires répétitifs, se heurtent à la barrière de la langue et doivent gérer un grand volume de messages d'acheteurs récurrents. Nous présentons l'expérience essentielle de PopOut dans un format structuré afin de faciliter l'évaluation des différences entre les fonctionnalités.",
    comparisonHubDisclaimerTitle: "Note officielle et avertissement",
    comparisonHubDisclaimerBody:
      "Cette page sert uniquement à présenter le produit. Il ne s'agit pas d'un conseil juridique et elle ne vise à discréditer aucune plateforme tierce. Les marques et noms de produits tiers appartiennent à leurs propriétaires respectifs. Les fonctionnalités peuvent évoluer ; veuillez vérifier les détails actuels sur les canaux officiels de chaque plateforme.",
    comparisonHubCardsTitle: "Ouvrir les comparaisons détaillées",
    comparisonHubCardsHint: "Choisissez une plateforme ci-dessous pour la comparaison complète",
    comparisonHubCardFbBody:
      "Comparez la rapidité de publication, la messagerie multilingue et la réponse automatique par IA.",
    comparisonHubCardFbCta: "Lire PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "Comparez la création d'annonces par IA, la vérification du statut étudiant et la réponse automatique par IA.",
    comparisonHubCardGumtreeCta: "Lire PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree : comparaison de l'expérience",
    comparisonGumtreeLead:
      "Cette page compare les différences concrètes de flux de travail concernant la création d'annonces, la communication multilingue et la réponse automatique par IA, dans des cas d'usage de seconde main à Melbourne.",
    comparisonGumtreeDisclaimer:
      "Avertissement : cette page sert uniquement à informer les utilisateurs et à présenter le produit. Il ne s'agit pas d'un conseil juridique. Gumtree et les marques associées appartiennent à leurs propriétaires respectifs. Les fonctionnalités tierces peuvent évoluer.",
    comparisonGumtreeSection1Title: "1) Mise en ligne assistée par IA",
    comparisonGumtreeSection1Body:
      "PopOut peut générer un brouillon de titre, de description et de suggestions de catégorie à partir des photos de l'article. L'utilisateur les vérifie, indique l'état et le prix souhaité, puis choisit des options comme la livraison et la négociation pour publier plus vite.",
    comparisonGumtreeSection2Title: "2) Parcours multilingue intégré",
    comparisonGumtreeSection2Body:
      "PopOut prend en charge l'anglais, le chinois simplifié, le chinois traditionnel, le coréen, le japonais, le français, l'espagnol et le vietnamien pour la publication et la messagerie, réduisant les frictions linguistiques dans une ville diverse.",
    comparisonGumtreeSection3Title:
      "3) La réponse automatique par IA qui fait gagner du temps aux vendeurs",
    comparisonGumtreeSection3Body:
      "PopOut Market intègre une fonctionnalité de réponse automatique par IA. Elle reste simple pour le moment et nous l'améliorons activement, avec des capacités plus poussées qui arrivent bientôt. Aujourd'hui, elle prend en charge le grand volume de messages répétitifs et peu utiles, et répond aux questions déjà traitées dans votre annonce. Pour tout ce qui est incertain ou qui ne figure pas dans votre annonce, l'IA ne se hasarde pas à deviner : elle vous laisse répondre vous-même à l'acheteur, afin que vous puissiez vous concentrer sur les questions qui comptent vraiment.",
    comparisonGumtreeSection4Title: "4) Vérification étudiante pour les communautés de campus",
    comparisonGumtreeSection4Body:
      "Un parcours de vérification étudiante aide à renforcer la confiance et la qualité des mises en relation pour les transactions liées aux universités et aux logements à Melbourne.",
    comparisonGumtreeTableTitle: "Aperçu des fonctionnalités (point de vue utilisateur)",
    comparisonGumtreeTableNote:
      "Remarque : la colonne de droite décrit des usages publics généraux et peut varier selon le compte, la région ou les mises à jour du produit.",
    comparisonGumtreeFeature1Title: "Temps de préparation d'une annonce",
    comparisonGumtreeFeature1Popout:
      "L'IA rédige d'abord les champs clés, l'utilisateur finalise les détails",
    comparisonGumtreeFeature1Other: "Plus de saisie manuelle dès le départ, en général",
    comparisonGumtreeFeature2Title: "Prise en charge des langues dans le parcours de transaction",
    comparisonGumtreeFeature2Popout: "Compréhension multilingue dans les annonces et la messagerie",
    comparisonGumtreeFeature2Other:
      "La communication entre langues dépend souvent de la traduction par l'utilisateur",
    comparisonGumtreeFeature3Title: "Réponse automatique par IA",
    comparisonGumtreeFeature3Popout:
      "L'IA traite les questions répétitives et les détails déjà présents dans votre annonce, et vous laisse les cas incertains",
    comparisonGumtreeFeature3Other:
      "Les réponses sont entièrement manuelles, sans aide de l'IA pour filtrer les messages répétitifs",
    comparisonGumtreeFeature4Title: "Mécanisme de confiance dédié aux étudiants",
    comparisonGumtreeFeature4Popout:
      "La vérification étudiante facilite les mises en relation sur le campus",
    comparisonGumtreeFeature4Other: "Le parcours d'identité étudiante dédié peut être limité",
    comparisonGumtreeFinalTitle: "Recommandation",
    comparisonGumtreeFinalBody:
      "Si vos priorités sont la rapidité de publication, la clarté multilingue et une réponse automatique par IA qui vous fait gagner du temps, PopOut peut être le meilleur choix. Vérifiez les fonctionnalités actuelles en fonction de votre propre région et de votre usage.",
    comparisonBackLabel: "Retour aux comparaisons",
    comparisonGumtreeCard1Title: "Publication rapide par IA",
    comparisonGumtreeCard1Body: "Moins de recherche de catégorie et de saisie répétée",
    comparisonGumtreeCard2Title: "Transactions multilingues",
    comparisonGumtreeCard2Body:
      "Prend en charge les principaux parcours de transaction multilingues",
    comparisonGumtreeCard3Title: "Réponse automatique par IA",
    comparisonGumtreeCard3Body:
      "L'IA répond aux questions répétitives pour vous faire gagner du temps",
    comparisonFbH1: "PopOut vs Facebook Marketplace : comparaison de l'expérience",
    comparisonFbLead:
      "Cet article compare les différences pratiques de flux de travail dans la création d'annonces, la communication multilingue et la réponse automatique par IA. L'objectif est d'aider les utilisateurs à choisir un flux de marketplace adapté à leurs besoins quotidiens.",
    comparisonFbDisclaimer:
      "Avertissement : cette page sert uniquement à présenter le produit, et non un conseil juridique ni une déclaration négative sur une plateforme tierce. Facebook Marketplace et les marques associées appartiennent à leurs propriétaires respectifs. La disponibilité des fonctionnalités peut varier selon la région, le type de compte et les mises à jour du produit.",
    comparisonFbSection1Title: "1) Mise en ligne assistée par IA à partir de photos",
    comparisonFbSection1Body:
      "Sur PopOut, le téléchargement des photos de l'article peut générer un brouillon de titre, de description et des suggestions de catégorie. L'utilisateur vérifie, complète, indique l'état et le prix, puis publie plus vite avec moins d'étapes manuelles.",
    comparisonFbSection2Title: "2) Communication multilingue en temps réel",
    comparisonFbSection2Body:
      "PopOut prend en charge l'anglais, le chinois simplifié, le chinois traditionnel, le coréen, le japonais, le français, l'espagnol et le vietnamien. Les annonces et les conversations peuvent être lues dans la langue préférée de chaque utilisateur.",
    comparisonFbSection3Title:
      "3) La réponse automatique par IA qui fait gagner du temps aux vendeurs",
    comparisonFbSection3Body:
      "PopOut Market intègre une fonctionnalité de réponse automatique par IA. Elle reste simple pour le moment et nous l'améliorons activement, avec des capacités plus poussées qui arrivent bientôt. Aujourd'hui, elle prend en charge les messages répétitifs et peu utiles, et répond aux questions déjà traitées dans votre annonce. Pour tout ce qui est incertain ou qui ne figure pas dans votre annonce, l'IA ne se hasarde pas à deviner : elle vous laisse répondre personnellement à l'acheteur, afin que vous puissiez consacrer votre temps aux questions qui comptent vraiment.",
    comparisonFbSection4Title: "4) Parcours de vérification étudiante à Melbourne",
    comparisonFbSection4Body:
      "Pour les communautés étudiantes et les regroupements de logements, PopOut inclut un canal de vérification étudiante afin de renforcer la confiance et la visibilité dans les transactions liées au campus.",
    comparisonFbTableTitle: "Aperçu des fonctionnalités (point de vue utilisateur)",
    comparisonFbTableNote:
      "Remarque : la colonne de droite reflète des usages publics courants et peut évoluer avec le temps.",
    comparisonFbFeature1Title: "Rapidité de démarrage d'une annonce",
    comparisonFbFeature1Popout:
      "L'IA rédige le titre/la description/la catégorie à partir des photos",
    comparisonFbFeature1Other:
      "Repose souvent sur la saisie manuelle du formulaire et le choix de la catégorie",
    comparisonFbFeature2Title: "Messagerie multilingue",
    comparisonFbFeature2Popout:
      "Le contenu des annonces et des conversations est compréhensible dans les langues prises en charge",
    comparisonFbFeature2Other: "La communication entre langues dépend souvent de l'auto-traduction",
    comparisonFbFeature3Title: "Réponse automatique par IA",
    comparisonFbFeature3Popout:
      "L'IA répond aux questions répétitives et aux détails de l'annonce ; les cas incertains vous reviennent",
    comparisonFbFeature3Other:
      "La messagerie est entièrement manuelle, sans aide de l'IA pour gérer les questions répétitives",
    comparisonFbFeature4Title: "Couche de confiance axée sur les étudiants",
    comparisonFbFeature4Popout:
      "Parcours de vérification étudiante pour les mises en relation campus/logement",
    comparisonFbFeature4Other:
      "Le parcours d'identité spécifique aux étudiants est souvent limité ou indisponible",
    comparisonFbFinalTitle: "Comment utiliser cette comparaison",
    comparisonFbFinalBody:
      "Si vos priorités sont une publication plus rapide, une communication multilingue plus fluide et une réponse automatique par IA qui gère les questions répétitives, le flux de travail de PopOut peut mieux vous convenir. Vérifiez toujours les détails actuels des fonctionnalités dans votre propre contexte d'utilisation.",
    comparisonFbCard1Title: "Assistant d'annonce IA",
    comparisonFbCard1Body: "Brouillon de titre et de description à partir des photos",
    comparisonFbCard2Title: "Traduction en direct",
    comparisonFbCard2Body: "Annonces et conversations entre langues plus fluides",
    comparisonFbCard3Title: "Réponse automatique par IA",
    comparisonFbCard3Body:
      "L'IA gère les questions répétitives pour que vous puissiez vous concentrer sur les vraies",
    notFoundTitle: "Page introuvable",
    notFoundDescription: "La page demandée n’existe pas ou n’est pas accessible publiquement.",
  },
  es: {
    topDownload: "Descargar",
    topLanguage: "Idioma",
    languageModalTitle: "Elige tu idioma",
    languageModalHint: "PopOut conecta comunidades locales en varios idiomas.",
    heroSecondaryPrefix:
      "Compra y vende con tus vecinos sin complicaciones, entendiéndote con todos en ",
    heroSecondaryLink: "español",
    heroSecondarySuffix: "",
    heroExploreCta: "Explorar más productos",
    downloadLine: "Descarga la app PopOut Market para iOS y Android",
    slogan: "compra y vende con personas cerca de ti",
    ratingAria: "Valoración de 5,0 de 5 en la App Store",
    homeAria: "Inicio de PopOut",
    appStoreAlt: "Descargar en App Store",
    googlePlayAlt: "Consíguelo en Google Play",
    marketPageTitle: "Mercado",
    marketAreaModalTitle: "Elige tu zona",
    marketAreaModalHint:
      "Toca un suburbio para actualizar la zona que se muestra arriba a la izquierda.",
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
    marketSupabaseLoadError:
      "No se pudieron cargar los anuncios ahora. Inténtalo de nuevo en un momento.",
    marketSupabaseRetry: "Reintentar",
    marketSupabaseEmpty: "Aún no hay anuncios en esta zona.",
    marketSupabaseLoadingAria: "Cargando anuncios",
    marketNearbyNotice: "Aún no hay anuncios en {suburb}, mostrando alrededores",
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
    marketPostContactSellerCta: "Contacta al vendedor en la app",
    marketPostListedInOn: "Publicado en {suburb} el {date}",
    marketPostListedIn: "Publicado en {suburb}",
    marketPostListedOn: "Publicado el {date}",
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
    translationDemoTitle: "Dilo una vez. *Todos* entienden",
    translationDemoSubtitle:
      "Envía en tu idioma, el otro lo recibe en el suyo — traducción instantánea.",
    aiPostDemoTitle: "Haz una foto. La IA hace el *resto*",
    aiPostDemoSubtitle:
      "Toma una foto y la IA genera título, categoría y descripción — tú solo pones el precio.",
    autoReplyDemoTitle: "Solo compradores *de verdad*",
    autoReplyDemoSubtitle: 'La IA responde "¿Sigue disponible?"',
    autoReplyDemoInboxTitle: "Mensajes",
    autoReplyDemoTabBuying: "Compras",
    autoReplyDemoTabSelling: "Ventas",
    autoReplyDemoBadge: "Respuesta automática",
    autoReplyDemoTimeNow: "ahora mismo",
    autoReplyDemoTime1Min: "1 min",
    autoReplyDemoMsgMeet: "¿A qué hora quedamos?",
    autoReplyDemoMsgPrice: "Son $50. ¿Te interesa?",
    autoReplyDemoMsgSelling: "Lo vendo por $30. ¿Te interesa?",
    autoReplyDemoMsgGreeting: "¡Hola! La silla de oficina de cuero sigue disponible.",
    aiPostDemoPrice: "Precio",
    aiPostDemoCondition: "Estado",
    aiPostDemoYouFill: "Tú rellenas",
    scheduleDemoTitle: "Queda con confianza.",
    scheduleDemoSubtitle:
      "Elige hora y lugar, encuentra al comprador y escanea su QR para confirmar — menos plantones y más confianza en tu comunidad.",
    scheduleDemoDate: "Fecha",
    scheduleDemoTime: "Hora",
    scheduleDemoLocation: "Punto de encuentro",
    scheduleDemoScheduled: "Programado",
    scheduleDemoScanHint: "Escanear para verificar",
    scheduleDemoVerified: "Encuentro verificado",
    studentVerifyTitle: "Estudiantes verificados. Intercambios de confianza.",
    studentVerifySubtitle:
      "Verifica tu correo estudiantil para obtener una insignia de confianza — cada operación en la comunidad más segura.",
    studentVerifyEmailLabel: "Correo estudiantil",
    studentVerifyUniversity: "Universidad",
    studentVerifyVerifying: "Verificando…",
    studentVerifyVerified: "Correo verificado",
    studentVerifyBadge: "Estudiante verificado",
    safetyZoneTitle: "Encuentros más seguros, desde el lugar.",
    safetyZoneSubtitle:
      "Al elegir dónde quedar, sugerimos zonas seguras cercanas — concurridas, bien iluminadas y con cámaras — para intercambios más tranquilos y una comunidad más fuerte.",
    safetyZoneNearLabel: "Zona de encuentro",
    safetyZoneFinding: "Buscando zonas seguras…",
    safetyZoneListTitle: "Lugares sugeridos",
    safetyZoneBadgeCctv: "Cámaras",
    safetyZoneBadgeBusy: "Concurrido",
    safetyZoneBadgeLit: "Bien iluminado",
    footerLegalNavAria: "Políticas y contacto",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. Todos los derechos reservados.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "Acerca de PopOut Market",
    footerNavTerms: "Términos de uso",
    footerNavPrivacy: "Política de privacidad",
    footerNavChildSafety: "Seguridad infantil",
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
      "Tu seguridad es lo primero. Sugerimos lugares públicos concurridos y bien iluminados de Melbourne como puntos más seguros para las entregas en persona, y animamos a verificar la condición de estudiante. Cada transacción en PopOut lleva una capa extra de tranquilidad.",
    aboutWhyCommunicationTitle: "Comunicación sin fronteras",
    aboutWhyCommunicationBody:
      "El idioma no debe ser una barrera. PopOut ofrece traducción bilingüe en tiempo real. Escribe en tu lengua — la otra persona recibe traducción automática. Aunque tu inglés no sea perfecto, puedes comerciar con libertad y hacer amigos.",
    aboutPrivacyTitle: "Protegemos tu privacidad",
    aboutPrivacyLead: "En PopOut, la privacidad es un derecho fundamental.",
    aboutPrivacyMinimalTitle: "Recopilación mínima",
    aboutPrivacyMinimalBody:
      "Solo recopilamos lo esencial, como teléfono y correo, para verificar el inicio de sesión.",
    aboutPrivacyStorageTitle: "Almacenamiento de alto nivel",
    aboutPrivacyStorageBody:
      "Tus datos sensibles se guardan en bases de datos cifradas, tanto en tránsito como en reposo.",
    aboutPrivacyNoTracesTitle: "Sin rastros",
    aboutPrivacyNoTracesBody:
      "No rastreamos ni conservamos tu historial de ubicación: el GPS solo se usa brevemente para verificar tu barrio (suburb) y luego se elimina. Explora con tranquilidad.",
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
    aboutSupportEmail: "contact@popoutmarket.com.au",
    legalEnglishAuthoritative: "La versión en inglés de este documento es la auténtica.",
    languageModalCloseAria: "Cerrar el selector de idioma",
    carouselGoToItemAria: "Ir al elemento {index}",
    demoListingWoodenDiningChair: "Silla de comedor de madera",
    demoListingMountainBike: "Bicicleta de montaña",
    demoListingAcousticGuitar: "Guitarra acústica",
    demoListingWirelessHeadphones: "Auriculares inalámbricos",
    demoListingTextbookBundle: "Paquete de libros de texto",
    demoListingSmartWatch: "Reloj inteligente",
    demoListingGameController: "Mando de juego",
    heroNowInConnector: ", ahora en ",
    heroTitleTemplate: "Encuentra {item} de segunda mano en {brand}",
    heroRotatingItems: [
      "muebles",
      "electrónica",
      "bicicletas",
      "libros de texto",
      "menaje de cocina",
      "ropa",
    ],
    heroLocationSuffix: "",
    contactBack: "Volver al inicio",
    contactHint:
      "Cuéntanos tu pregunta o solicitud de colaboración y te responderemos por correo electrónico.",
    contactTitlePlaceholder: "Escribe un título breve",
    contactMainPlaceholder: "Escribe tu mensaje",
    contactSend: "Enviar",
    contactSending: "Enviando...",
    contactSuccess: "Enviado correctamente. Te responderemos pronto.",
    contactErrorRequired: "Completa el título y el mensaje.",
    contactErrorFallback: "No se pudo enviar ahora. Inténtalo de nuevo.",
    faqTitle: "Preguntas frecuentes de PopOut",
    faqIntro:
      "Estas ocho preguntas frecuentes explican cómo PopOut facilita publicar más rápido, la comunicación multilingüe, transacciones más seguras y las ventas de temporada de graduación en Melbourne.",
    faqDisclaimerTitle: "Nota oficial",
    faqDisclaimerBody:
      "Esta página es solo informativa sobre el producto y no constituye ninguna garantía legal, financiera ni de seguridad. Las funciones pueden variar según la versión de la app, la región y la cuenta.",
    faqComparisonCta: "Comparar con otros mercados",
    marketSeoIntroPrefix: "Compra y vende artículos usados en",
    marketSeoIntroNearLabel: "Mostrando artículos en",
    marketSuburbMapTitle: "Mapa de {suburb}",
    marketPostMeetupMapAlt: "Mapa del punto de encuentro",
    aiPostDemoFieldTitle: "Título",
    suburbBackToHub: "Volver a los barrios de Melbourne",
    comparisonHubTitle: "Comparación con otros mercados de segunda mano",
    comparisonHubIntro:
      "Esta página te ayuda a entender las diferencias prácticas entre PopOut y otros mercados de segunda mano habituales. El objetivo es una guía clara y transparente para que elijas lo que mejor se adapte a tu forma de usarlo.",
    comparisonHubPurposeTitle: "Por qué existe esta página",
    comparisonHubPurposeBody:
      "Muchos usuarios tienen dificultades con el llenado repetitivo de formularios, las barreras idiomáticas y la gestión de un gran volumen de mensajes repetitivos de los compradores. Presentamos la experiencia esencial de PopOut en un formato estructurado para que sea más fácil evaluar las diferencias entre funciones.",
    comparisonHubDisclaimerTitle: "Nota oficial y aviso legal",
    comparisonHubDisclaimerBody:
      "Esta página tiene fines únicamente informativos sobre el producto. No constituye asesoramiento legal ni pretende desacreditar a ninguna plataforma de terceros. Las marcas y nombres de productos de terceros pertenecen a sus respectivos propietarios. Las funciones pueden cambiar con el tiempo; verifica los detalles actuales en los canales oficiales de cada plataforma.",
    comparisonHubCardsTitle: "Abrir comparaciones detalladas",
    comparisonHubCardsHint: "Elige una plataforma abajo para ver la comparación completa",
    comparisonHubCardFbBody:
      "Compara la rapidez para publicar, la mensajería multilingüe y la respuesta automática con IA.",
    comparisonHubCardFbCta: "Leer PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "Compara la configuración de anuncios con IA, la verificación de estudiantes y la respuesta automática con IA.",
    comparisonHubCardGumtreeCta: "Leer PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree: comparación de la experiencia",
    comparisonGumtreeLead:
      "Esta página compara las diferencias reales de flujo de trabajo en la configuración de anuncios, la comunicación multilingüe y la respuesta automática con IA en casos de uso de segunda mano en Melbourne.",
    comparisonGumtreeDisclaimer:
      "Aviso: esta página tiene fines únicamente informativos para el usuario y el producto. No constituye asesoramiento legal. Gumtree y las marcas relacionadas pertenecen a sus respectivos propietarios. Las funciones de terceros pueden cambiar con el tiempo.",
    comparisonGumtreeSection1Title: "1) Creación de anuncios asistida por IA",
    comparisonGumtreeSection1Body:
      "PopOut puede redactar sugerencias de título, descripción y categoría a partir de las fotos del artículo. El usuario las revisa, indica el estado y el precio deseado, y elige opciones como la entrega y la negociación para publicar más rápido.",
    comparisonGumtreeSection2Title: "2) Flujo multilingüe integrado",
    comparisonGumtreeSection2Body:
      "PopOut admite inglés, chino simplificado, chino tradicional, coreano, japonés, francés, español y vietnamita al publicar y mensajear, reduciendo las barreras de idioma en una ciudad diversa.",
    comparisonGumtreeSection3Title:
      "3) Respuesta automática con IA que ahorra tiempo a los vendedores",
    comparisonGumtreeSection3Body:
      "PopOut Market incluye una función de respuesta automática con IA. Por ahora es sencilla y la estamos mejorando de forma constante, con funciones más potentes en camino. Hoy se encarga del gran volumen de mensajes repetitivos y de poco valor, y responde las preguntas que ya están cubiertas en tu publicación. Ante cualquier duda o algo que no esté escrito en tu anuncio, la IA no improvisa: deja esos casos para que los respondas tú mismo, así puedes concentrarte en las preguntas que de verdad importan.",
    comparisonGumtreeSection4Title:
      "4) Verificación de estudiantes para comunidades universitarias",
    comparisonGumtreeSection4Body:
      "Una vía de verificación de estudiantes ayuda a mejorar la confianza y la calidad de las coincidencias en las transacciones vinculadas a universidades y alojamientos en Melbourne.",
    comparisonGumtreeTableTitle: "Resumen de funciones (desde el punto de vista del usuario)",
    comparisonGumtreeTableNote:
      "Nota: la columna de la derecha describe patrones de uso públicos generales y puede variar según la cuenta, la región o las actualizaciones del producto.",
    comparisonGumtreeFeature1Title: "Tiempo para preparar un anuncio",
    comparisonGumtreeFeature1Popout:
      "La IA redacta primero los campos clave y el usuario finaliza los detalles",
    comparisonGumtreeFeature1Other:
      "Por lo general, más trabajo manual del formulario desde el inicio",
    comparisonGumtreeFeature2Title: "Soporte de idiomas en el flujo de transacción",
    comparisonGumtreeFeature2Popout: "Comprensión multilingüe en publicaciones y chat",
    comparisonGumtreeFeature2Other:
      "La comunicación entre idiomas suele depender de la traducción del propio usuario",
    comparisonGumtreeFeature3Title: "Respuesta automática con IA",
    comparisonGumtreeFeature3Popout:
      "La IA se encarga de las preguntas repetitivas y de los detalles que ya están en tu anuncio; las dudas las deja para ti",
    comparisonGumtreeFeature3Other:
      "Las respuestas son totalmente manuales, sin ninguna IA que filtre los mensajes repetitivos",
    comparisonGumtreeFeature4Title: "Mecanismo de confianza específico para estudiantes",
    comparisonGumtreeFeature4Popout:
      "La verificación de estudiantes facilita las coincidencias en el campus",
    comparisonGumtreeFeature4Other: "La vía dedicada de identidad estudiantil puede ser limitada",
    comparisonGumtreeFinalTitle: "Recomendación",
    comparisonGumtreeFinalBody:
      "Si tus prioridades son la rapidez al publicar, la claridad multilingüe y una respuesta automática con IA que te ahorre tiempo, PopOut puede ser la mejor opción. Comprueba las funciones disponibles actualmente según tu región y tu forma de uso.",
    comparisonBackLabel: "Volver a las comparaciones",
    comparisonGumtreeCard1Title: "Publicación rápida con IA",
    comparisonGumtreeCard1Body: "Menos búsqueda de categorías y repetición de formularios",
    comparisonGumtreeCard2Title: "Comercio multilingüe",
    comparisonGumtreeCard2Body: "Admite los principales flujos de transacción entre idiomas",
    comparisonGumtreeCard3Title: "Respuesta automática con IA",
    comparisonGumtreeCard3Body: "La IA responde las preguntas repetitivas para ahorrarte tiempo",
    comparisonFbH1: "PopOut vs Facebook Marketplace: comparación de la experiencia",
    comparisonFbLead:
      "Este artículo compara las diferencias prácticas de flujo de trabajo en la configuración de anuncios, la comunicación multilingüe y la respuesta automática con IA. La intención es ayudar a los usuarios a elegir un marketplace cuyo flujo de trabajo se adapte a sus necesidades cotidianas.",
    comparisonFbDisclaimer:
      "Aviso: esta página tiene fines únicamente informativos sobre el producto, no constituye asesoramiento legal ni una declaración negativa sobre ninguna plataforma de terceros. Facebook Marketplace y las marcas relacionadas pertenecen a sus respectivos propietarios. La disponibilidad de funciones puede variar según la región, el tipo de cuenta y las actualizaciones del producto.",
    comparisonFbSection1Title: "1) Creación de anuncios con IA a partir de fotos",
    comparisonFbSection1Body:
      "En PopOut, subir las fotos del artículo puede generar un borrador de título, descripción y sugerencias de categoría. El usuario revisa, añade contexto, indica el estado y el precio, y publica más rápido con menos pasos manuales.",
    comparisonFbSection2Title: "2) Comunicación multilingüe en tiempo real",
    comparisonFbSection2Body:
      "PopOut admite inglés, chino simplificado, chino tradicional, coreano, japonés, francés, español y vietnamita. Las publicaciones y los chats pueden leerse en el idioma preferido de cada usuario.",
    comparisonFbSection3Title: "3) Respuesta automática con IA que ahorra tiempo a los vendedores",
    comparisonFbSection3Body:
      "PopOut Market incluye una función de respuesta automática con IA. Por ahora es sencilla y la estamos mejorando de forma constante, con funciones más potentes en camino. Hoy se encarga de los mensajes repetitivos y de poco valor, y responde las preguntas que ya están cubiertas en tu publicación. Ante cualquier duda o algo que no esté escrito en tu anuncio, la IA no improvisa: deja esos casos para que los respondas tú mismo, así dedicas tu tiempo a las preguntas que de verdad importan.",
    comparisonFbSection4Title: "4) Vía de verificación de estudiantes en Melbourne",
    comparisonFbSection4Body:
      "Para las comunidades estudiantiles y los conjuntos de alojamiento, PopOut incluye un canal de verificación de estudiantes para mejorar la confianza y la visibilidad en las transacciones vinculadas al campus.",
    comparisonFbTableTitle: "Resumen de funciones (desde el punto de vista del usuario)",
    comparisonFbTableNote:
      "Nota: la columna de la derecha refleja patrones de uso públicos comunes y puede cambiar con el tiempo.",
    comparisonFbFeature1Title: "Rapidez para empezar un anuncio",
    comparisonFbFeature1Popout:
      "La IA redacta el título/la descripción/la categoría a partir de las fotos",
    comparisonFbFeature1Other:
      "A menudo depende del llenado manual del formulario y la selección de categoría",
    comparisonFbFeature2Title: "Mensajes multilingües",
    comparisonFbFeature2Popout:
      "El contenido de publicaciones y chats puede entenderse en los idiomas admitidos",
    comparisonFbFeature2Other:
      "La comunicación entre idiomas suele depender de la traducción propia",
    comparisonFbFeature3Title: "Respuesta automática con IA",
    comparisonFbFeature3Popout:
      "La IA responde las preguntas repetitivas y los detalles que ya están en tu anuncio; las dudas quedan a la espera de tu respuesta",
    comparisonFbFeature3Other:
      "La mensajería es totalmente manual, sin ninguna IA que gestione las preguntas repetitivas",
    comparisonFbFeature4Title: "Capa de confianza enfocada en estudiantes",
    comparisonFbFeature4Popout:
      "Vía de verificación de estudiantes para coincidencias de campus/alojamiento",
    comparisonFbFeature4Other:
      "El flujo de identidad específico para estudiantes suele ser limitado o no estar disponible",
    comparisonFbFinalTitle: "Cómo usar esta comparación",
    comparisonFbFinalBody:
      "Si tus prioridades son publicar más rápido, una comunicación multilingüe más fluida y una respuesta automática con IA que gestione las preguntas repetitivas, el flujo de trabajo de PopOut puede encajar mejor. Comprueba siempre los detalles actuales de las funciones según tu propio contexto de uso.",
    comparisonFbCard1Title: "Asistente de anuncios con IA",
    comparisonFbCard1Body: "Borrador de título y descripción a partir de fotos",
    comparisonFbCard2Title: "Traducción en vivo",
    comparisonFbCard2Body: "Publicaciones y chats entre idiomas más fluidos",
    comparisonFbCard3Title: "Respuesta automática con IA",
    comparisonFbCard3Body:
      "La IA se encarga de las preguntas repetitivas para que te centres en las que de verdad importan",
    notFoundTitle: "Página no encontrada",
    notFoundDescription: "La página que solicitaste no existe o no es de acceso público.",
  },
};
