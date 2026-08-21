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
  downloadLine: string;
  slogan: string;
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
  marketPostListingRef: string;
  /** Shown to the right of the price when the price is not negotiable. */
  marketPostFixedPriceLabel: string;
  marketPostDetailLoadingAria: string;
  marketPostDescriptionHeading: string;
  marketPostPreferredMeetupLabel: string;
  marketPostOtherItemsHeading: string;
  marketYes: string;
  marketNo: string;
  marketUnknown: string;
  translationDemoTitle: string;
  translationDemoSubtitle: string;
  aiPostDemoTitle: string;
  aiPostDemoSubtitle: string;
  aiPostDemoPrice: string;
  aiPostDemoYouFill: string;
  footerLegalNavAria: string;
  footerCopyright: string;
  footerAcn: string;
  footerNavAbout: string;
  footerNavTerms: string;
  footerNavPrivacy: string;
  footerNavChildSafety: string;
  footerNavContact: string;
  footerSocialRednoteAria: string;
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
  heroTitle: string;
  heroLead: string;
  heroTrustLine: string;
  heroGetAppCta: string;
  heroBrowseCta: string;
  homeMarketTitle: string;
  homeMarketSubtitle: string;
  homeMarketBrowseAll: string;
  homeMarketFilterAll: string;
  homeMarketFilterGiveaway: string;
  homeMarketFilterUnder20: string;
  homeBulkListingLine: string;
  homeShopsTitle: string;
  homeShopsSubtitle: string;
  homeShopsCta: string;
  homeCommunityTitle: string;
  homeCommunitySubtitle: string;
  homeCommunityTopics: string;
  homeTrustTitle: string;
  homeTrustSubtitle: string;
  homeCoverageTitle: string;
  homeCoverageCta: string;
  notFoundTitle: string;
  notFoundDescription: string;
};

export const COPY: Record<Locale, SiteCopy> = {
  en: {
    topDownload: "Download",
    topLanguage: "Language",
    languageModalTitle: "Choose your language",
    languageModalHint: "PopOut supports local communities in multiple languages.",
    downloadLine: "Download the PopOut Market app for iOS or Android",
    slogan: "buy and sell with neighbours nearby",
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
    marketPostListingRef: "Listing ref.",
    marketPostFixedPriceLabel: "Fixed price",
    marketPostDetailLoadingAria: "Loading listing",
    marketPostDescriptionHeading: "Description",
    marketPostPreferredMeetupLabel: "Preferred meet-up point",
    marketPostOtherItemsHeading: "More from this seller",
    marketYes: "Yes",
    marketNo: "No",
    marketUnknown: "Unknown",
    translationDemoTitle: "Say it once. *Everyone* understands",
    translationDemoSubtitle:
      "Your messages are translated instantly — type in your language, they read in theirs.",
    aiPostDemoTitle: "Snap a photo. AI does the *rest*",
    aiPostDemoSubtitle:
      "Take a photo and AI generates the title, category, and description — you just set the price.",
    aiPostDemoPrice: "Price",
    aiPostDemoYouFill: "You fill in",
    footerLegalNavAria: "Policies and contact",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "About PopOut Market",
    footerNavTerms: "Terms of Use",
    footerNavPrivacy: "Privacy Policy",
    footerNavChildSafety: "Child Safety",
    footerNavContact: "Contact Us",
    footerSocialRednoteAria: "PopOut Market on Xiaohongshu (RED)",
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
      "Your safety comes first. Every PopOut account is verified with an Australian mobile number and a one-time location check that confirms your suburb and is then discarded. Meetups happen in public places the seller picks when they post, and the PopOut Market Rules are published in eight languages and readable without an account. Anything can be reported, and a restricted listing can be appealed.",
    aboutWhyCommunicationTitle: "Communication Without Borders",
    aboutWhyCommunicationBody:
      "Language should never be a barrier to connection. PopOut features a powerful real-time bilingual translation system. Chat in your native language — the other person receives an automatic translation. Even if your English isn't perfect, you can trade freely and make like-minded friends here.",
    aboutPrivacyTitle: "We Protect Your Privacy",
    aboutPrivacyLead: "At PopOut, we treat privacy as a fundamental right.",
    aboutPrivacyMinimalTitle: "Minimal Data Collection",
    aboutPrivacyMinimalBody:
      "A PopOut account needs a verified Australian mobile number, a verified suburb, and a nickname you choose. There is no email address, no password and no legal name on a PopOut account.",
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
    comparisonHubCardFbBody:
      "Compare listing speed, multilingual messaging, and how each app verifies who you are trading with.",
    comparisonHubCardFbCta: "Read PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "Compare AI listing setup, multilingual chat translation, and account verification.",
    comparisonHubCardGumtreeCta: "Read PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree: Experience Comparison",
    comparisonGumtreeLead:
      "This page compares real-world workflow differences around listing setup, multilingual communication, and account verification in Melbourne second-hand use cases.",
    comparisonGumtreeDisclaimer:
      "Disclaimer: this page is for user education and product communication only. It is not legal advice. Gumtree and related marks belong to their respective owners. Third-party features may change over time.",
    comparisonGumtreeSection1Title: "1) AI-assisted listing setup",
    comparisonGumtreeSection1Body:
      "PopOut can draft a title, description and category from photos of the item. The seller reviews the draft, sets the price and picks a public meetup spot, then publishes. Photos of a whole room can be added at once, and PopOut sorts them into separate draft listings.",
    comparisonGumtreeSection2Title: "2) Built-in multilingual flow",
    comparisonGumtreeSection2Body:
      "PopOut supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese across posting and messaging, reducing language friction in a diverse city environment.",
    comparisonGumtreeSection3Title: "3) Verified neighbours, not anonymous accounts",
    comparisonGumtreeSection3Body:
      "Every PopOut account is verified with an Australian mobile number and a one-time location check, repeated every 30 days for people who keep chatting and posting. The check confirms the suburb only; GPS is not stored. The PopOut Market Rules are published in eight languages and readable without an account.",
    comparisonGumtreeSection4Title: "4) Meeting up in a public place",
    comparisonGumtreeSection4Body:
      "Selling on PopOut means handing the item to a neighbour in person. The seller picks a recognisable public place from a list when they post, and the buyer sees that spot on the listing. There is no postage and no courier step.",
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
    comparisonGumtreeFeature3Title: "Account verification",
    comparisonGumtreeFeature3Popout:
      "Australian mobile number plus a one-time location check, re-checked every 30 days",
    comparisonGumtreeFeature3Other: "Typically an email or social sign-in, with no location check",
    comparisonGumtreeFeature4Title: "Where the handover happens",
    comparisonGumtreeFeature4Popout:
      "A public meetup spot is chosen when the listing is created and shown to the buyer",
    comparisonGumtreeFeature4Other: "Arranged privately in chat, if at all",
    comparisonGumtreeFinalTitle: "Recommendation",
    comparisonGumtreeFinalBody:
      "If your priorities are posting speed, multilingual clarity, and knowing that the person on the other end is a verified neighbour, PopOut may be the better fit. Validate current features based on your own region and usage.",
    comparisonBackLabel: "Back to comparisons",
    comparisonGumtreeCard1Title: "Fast AI Posting",
    comparisonGumtreeCard1Body: "Less category hunting and form repetition",
    comparisonGumtreeCard2Title: "Multilingual Trade",
    comparisonGumtreeCard2Body: "Supports key cross-language transaction flows",
    comparisonGumtreeCard3Title: "Verified neighbours",
    comparisonGumtreeCard3Body: "Australian mobile number plus a one-time location check",
    comparisonFbH1: "PopOut vs Facebook Marketplace: Experience Comparison",
    comparisonFbLead:
      "This article compares practical workflow differences in listing setup, multilingual communication, and account verification. The intent is to help users choose a marketplace flow that fits everyday needs.",
    comparisonFbDisclaimer:
      "Disclaimer: this page is for product education only, not legal advice or a negative statement about any third-party platform. Facebook Marketplace and related marks belong to their respective owners. Feature availability may vary by region, account type, and product updates.",
    comparisonFbSection1Title: "1) AI-assisted listing from photos",
    comparisonFbSection1Body:
      "On PopOut, uploading item photos can generate a draft title, description and category. The seller reviews, adds context, sets the price and picks a public meetup spot, then publishes with fewer manual steps.",
    comparisonFbSection2Title: "2) Real-time multilingual communication",
    comparisonFbSection2Body:
      "PopOut supports English, Simplified Chinese, Traditional Chinese, Korean, Japanese, French, Spanish, and Vietnamese. Posts and chats can be read in each user's preferred language flow.",
    comparisonFbSection3Title: "3) Verified neighbours, not anonymous accounts",
    comparisonFbSection3Body:
      "Every PopOut account is verified with an Australian mobile number and a one-time location check, repeated every 30 days for people who keep chatting and posting. The check confirms the suburb only; GPS is not stored. Listings and messages can be reported, and a restricted listing can be appealed once.",
    comparisonFbSection4Title: "4) Meeting up in a public place",
    comparisonFbSection4Body:
      "Selling on PopOut means handing the item to a neighbour in person. The seller picks a recognisable public place from a list when they post, and the buyer sees that spot on the listing. There is no postage and no courier step.",
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
    comparisonFbFeature3Title: "Account verification",
    comparisonFbFeature3Popout:
      "Australian mobile number plus a one-time location check, re-checked every 30 days",
    comparisonFbFeature3Other: "Typically an existing social account, with no location check",
    comparisonFbFeature4Title: "Where the handover happens",
    comparisonFbFeature4Popout:
      "A public meetup spot is chosen when the listing is created and shown to the buyer",
    comparisonFbFeature4Other: "Arranged privately in chat, if at all",
    comparisonFbFinalTitle: "How to use this comparison",
    comparisonFbFinalBody:
      "If your priorities are faster posting, smoother multilingual communication, and knowing that the person on the other end is a verified neighbour, PopOut's workflow may fit better. Always verify current feature details in your own usage context.",
    comparisonFbCard1Title: "AI Listing Assist",
    comparisonFbCard1Body: "Photo-based draft title and description",
    comparisonFbCard2Title: "Live Translation",
    comparisonFbCard2Body: "Smoother cross-language posts and chat",
    comparisonFbCard3Title: "Verified neighbours",
    comparisonFbCard3Body: "Australian mobile number plus a one-time location check",
    heroTitle: "Everything in your Melbourne suburb, in one feed",
    heroLead:
      "PopOut Market is the neighbourhood app for Melbourne. Buy and sell second-hand with verified neighbours nearby, see current specials at local shops on the map, and ask your neighbours anything — each of you writing in your own language.",
    heroTrustLine:
      "Verified by an Australian mobile number and a one-time location check. Free on iOS and Android. Live in {count} Melbourne suburbs.",
    heroGetAppCta: "Get the app",
    heroBrowseCta: "Browse second-hand near you",
    homeMarketTitle: "Buy and sell second-hand with *neighbours nearby*",
    homeMarketSubtitle:
      "Every listing comes from someone who lives near you, and you hand it over in person. Filter by Giveaway or Under $20, or browse by category.",
    homeMarketBrowseAll: "Browse all listings",
    homeMarketFilterAll: "All",
    homeMarketFilterGiveaway: "Giveaway",
    homeMarketFilterUnder20: "Under $20",
    homeBulkListingLine:
      "Add a whole room's photos at once — PopOut sorts them into separate drafts.",
    homeShopsTitle: "Local shops on the *map*",
    homeShopsSubtitle:
      "Neighbours walk the shops nearby and post what they find, with the product name and price written on the photo and translated into every language the app speaks. The map covers 16 shops in Melbourne CBD and Docklands, 14 of them independent Asian grocers.",
    homeShopsCta: "See the Melbourne CBD Asian grocery guide",
    homeCommunityTitle: "Ask your neighbours *anything*",
    homeCommunitySubtitle:
      "The Community tab is where neighbourhood life happens: local deals, questions about your area, recommendations, and people looking to buy. Write in your language, they read it in theirs.",
    homeCommunityTopics: "Local deals · Ask & News · Local life · Looking to buy · Other",
    homeTrustTitle: "Real neighbours, *not anonymous accounts*",
    homeTrustSubtitle:
      "Every account is verified with an Australian mobile number and a one-time location check that confirms your suburb and is then discarded, re-checked every 30 days. The PopOut Market Rules are published in eight languages and readable without an account, and anything can be reported, restricted and appealed.",
    homeCoverageTitle: "Live in *{count} Melbourne suburbs*",
    homeCoverageCta: "See every Melbourne suburb",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you requested does not exist or is not publicly accessible.",
  },
  "zh-Hans": {
    topDownload: "下载",
    topLanguage: "语言",
    languageModalTitle: "选择你的语言",
    languageModalHint: "PopOut 以多语言连接本地社区。",
    downloadLine: "下载 PopOut Market 应用，支持 iOS 和 Android",
    slogan: "与身边的邻居轻松买卖",
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
    marketPostListingRef: "编号",
    marketPostFixedPriceLabel: "价格固定",
    marketPostDetailLoadingAria: "正在加载详情",
    marketPostDescriptionHeading: "描述",
    marketPostPreferredMeetupLabel: "首选见面地点",
    marketPostOtherItemsHeading: "该卖家的其他商品",
    marketYes: "是",
    marketNo: "否",
    marketUnknown: "未知",
    translationDemoTitle: "说一次，*所有人*都能懂",
    translationDemoSubtitle: "你用你的语言发消息，对方用他的语言收到——翻译全自动。",
    aiPostDemoTitle: "拍张照，AI 帮你*搞定*",
    aiPostDemoSubtitle: "拍照后 AI 自动生成标题、分类和描述，你只需填价格和状态。",
    aiPostDemoPrice: "价格",
    aiPostDemoYouFill: "你来填",
    footerLegalNavAria: "条款与联系",
    footerCopyright: "版权所有 © 2026 PopOut Market Pty Ltd。保留所有权利。",
    footerAcn: "ACN：696 464 945",
    footerNavAbout: "关于 PopOut Market",
    footerNavTerms: "使用条款",
    footerNavPrivacy: "隐私政策",
    footerNavChildSafety: "儿童安全",
    footerNavContact: "联系我们",
    footerSocialRednoteAria: "PopOut Market 小红书",
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
      "你的安全高于一切。每个 PopOut 账号都要通过澳洲手机号验证和一次性定位核验，定位只用来确认你所在的城区，确认后立即丢弃。见面地点由卖家在发布商品时从公共场所中选定；《PopOut Market 社区规则》以八种语言发布，不注册也能查看。任何内容都可以举报，被限制的商品也可以申诉。",
    aboutWhyCommunicationTitle: "沟通，再无国界",
    aboutWhyCommunicationBody:
      "语言不该成为连接的障碍。PopOut 配备强大的实时双语翻译系统。用你的母语聊天——对方会收到自动翻译。即使英语还不够流利，你也可以在这里自由交易、结识志同道合的朋友。",
    aboutPrivacyTitle: "我们守护您的隐私",
    aboutPrivacyLead: "在 PopOut，我们视隐私为基本权利。",
    aboutPrivacyMinimalTitle: "极简数据采集",
    aboutPrivacyMinimalBody:
      "一个 PopOut 账号只需要三样东西：通过验证的澳洲手机号、通过核验的所在城区，以及你自己取的昵称。账号里没有邮箱、没有密码，也没有真实姓名。",
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
    comparisonHubCardFbBody: "对比发布速度、多语言沟通，以及各自如何核验交易对象的账号。",
    comparisonHubCardFbCta: "查看与 Facebook Marketplace 对比",
    comparisonHubCardGumtreeBody: "对比 AI 发布设置、多语言聊天翻译和账号验证。",
    comparisonHubCardGumtreeCta: "查看与 Gumtree 对比",
    comparisonGumtreeH1: "PopOut vs Gumtree：功能体验对比",
    comparisonGumtreeLead:
      "本页围绕墨尔本二手交易场景，对比发布设置、多语言沟通和账号验证在实际使用流程中的差异。",
    comparisonGumtreeDisclaimer:
      "免责声明：本页仅用于用户教育和产品说明，不构成法律意见。Gumtree 及相关名称属于其权利人。第三方平台功能可能变化，请以其官方信息为准。",
    comparisonGumtreeSection1Title: "1) AI 帮你完成初稿，缩短发布路径",
    comparisonGumtreeSection1Body:
      "PopOut 可以根据商品照片生成标题、描述与分类初稿。卖家核对初稿、设置价格，再选好一个公共见面地点，就能发布。你也可以一次性上传整间房的照片，PopOut 会把它们拆成一条条独立的商品草稿。",
    comparisonGumtreeSection2Title: "2) 多语言买卖沟通，覆盖墨尔本多民族用户",
    comparisonGumtreeSection2Body:
      "用户使用英语、简体中文、繁体中文、韩语、日语、法语、西班牙语、越南语输入后，可在帖子和聊天场景中按不同语言实时理解，降低沟通误解与等待成本。",
    comparisonGumtreeSection3Title: "3) 认证过的邻居，不是匿名账号",
    comparisonGumtreeSection3Body:
      "每个 PopOut 账号都要通过澳洲手机号验证和一次性定位核验；只要你还在继续聊天和发帖，每 30 天会重新核验一次。核验只确认你所在的城区，不会保存 GPS 记录。《PopOut Market 社区规则》以八种语言发布，不注册也能查看。",
    comparisonGumtreeSection4Title: "4) 在公共场所当面交易",
    comparisonGumtreeSection4Body:
      "在 PopOut 卖东西，就是把物品当面交到邻居手上。卖家发布时会从列表里选一个好找的公共场所，买家在商品页上就能看到这个地点。没有邮寄，也没有快递环节。",
    comparisonGumtreeTableTitle: "核心能力对照（用户视角）",
    comparisonGumtreeTableNote:
      "注：右侧内容为常见公开体验概述，具体功能会因版本和地区更新而变化。",
    comparisonGumtreeFeature1Title: "发帖准备时间",
    comparisonGumtreeFeature1Popout: "AI 先生成主要文案和分类建议，人工做最后确认",
    comparisonGumtreeFeature1Other: "更多依赖从零手动填写与筛选",
    comparisonGumtreeFeature2Title: "语言覆盖与翻译体验",
    comparisonGumtreeFeature2Popout: "多语言输入与阅读链路一体化，覆盖发帖和聊天场景",
    comparisonGumtreeFeature2Other: "常见方式是用户自行切换语言或外部翻译",
    comparisonGumtreeFeature3Title: "账号验证方式",
    comparisonGumtreeFeature3Popout: "澳洲手机号 + 一次性定位核验，每 30 天重新核验一次",
    comparisonGumtreeFeature3Other: "通常是邮箱或社交账号登录，没有定位核验",
    comparisonGumtreeFeature4Title: "交易在哪里完成",
    comparisonGumtreeFeature4Popout: "发布商品时就选好公共见面地点，并展示给买家",
    comparisonGumtreeFeature4Other: "通常在私聊里自行约定，也可能根本没有约定",
    comparisonGumtreeFinalTitle: "选择建议",
    comparisonGumtreeFinalBody:
      "如果你更看重发布速度、多语言沟通的清晰度，以及确认对面是一位通过认证的邻居，那么 PopOut Market 可能更适合你。请结合你所在地区和使用习惯，自行确认当前的功能。",
    comparisonBackLabel: "返回对比总览",
    comparisonGumtreeCard1Title: "AI 快速发布",
    comparisonGumtreeCard1Body: "减少分类查找和重复填写时间",
    comparisonGumtreeCard2Title: "多语言交易",
    comparisonGumtreeCard2Body: "覆盖主要跨语言买卖场景",
    comparisonGumtreeCard3Title: "认证过的邻居",
    comparisonGumtreeCard3Body: "澳洲手机号 + 一次性定位核验",
    comparisonFbH1: "PopOut vs Facebook Marketplace：功能体验对比",
    comparisonFbLead:
      "本文对比发布设置、多语言沟通和账号验证在实际使用流程中的差异，旨在帮助用户选择更契合日常需求的交易流程。",
    comparisonFbDisclaimer:
      "免责声明：本页仅用于产品信息说明，不构成法律意见，也不对第三方平台作价值判断。Facebook Marketplace 及相关名称为其权利人所有；功能会随版本调整，请以官方信息为准。",
    comparisonFbSection1Title: "1) AI 图片发帖，减少第一步的重复劳动",
    comparisonFbSection1Body:
      "在 PopOut，你上传商品照片后就能自动生成标题、描述和分类初稿。卖家核对并补充细节、设置价格，再选好一个公共见面地点，就能用更少的手动步骤完成发布。",
    comparisonFbSection2Title: "2) 多语言实时翻译，降低沟通门槛",
    comparisonFbSection2Body:
      "PopOut 支持英语、简体中文、繁体中文、韩语、日语、法语、西班牙语、越南语的输入与理解。帖子与聊天可以按用户语言实时展示，适合墨尔本多语言社区场景。",
    comparisonFbSection3Title: "3) 认证过的邻居，不是匿名账号",
    comparisonFbSection3Body:
      "每个 PopOut 账号都要通过澳洲手机号验证和一次性定位核验；只要你还在继续聊天和发帖，每 30 天会重新核验一次。核验只确认你所在的城区，不会保存 GPS 记录。商品和消息都可以举报，被限制的商品还有一次申诉机会。",
    comparisonFbSection4Title: "4) 在公共场所当面交易",
    comparisonFbSection4Body:
      "在 PopOut 卖东西，就是把物品当面交到邻居手上。卖家发布时会从列表里选一个好找的公共场所，买家在商品页上就能看到这个地点。没有邮寄，也没有快递环节。",
    comparisonFbTableTitle: "核心功能对照（用户视角）",
    comparisonFbTableNote:
      "注：右侧为公开可观察到的通用体验描述，具体能力可能因地区、账号类型和产品版本而变化。",
    comparisonFbFeature1Title: "发帖启动效率",
    comparisonFbFeature1Popout: "图片上传后由 AI 生成标题/描述/类别建议，用户补充即可完成",
    comparisonFbFeature1Other: "通常需要手动填写多个字段并自行选择分类",
    comparisonFbFeature2Title: "跨语言沟通",
    comparisonFbFeature2Popout: "帖子和聊天支持多语言实时理解与呈现",
    comparisonFbFeature2Other: "多语言沟通一般依赖用户自行翻译",
    comparisonFbFeature3Title: "账号验证方式",
    comparisonFbFeature3Popout: "澳洲手机号 + 一次性定位核验，每 30 天重新核验一次",
    comparisonFbFeature3Other: "通常沿用已有的社交账号，没有定位核验",
    comparisonFbFeature4Title: "交易在哪里完成",
    comparisonFbFeature4Popout: "发布商品时就选好公共见面地点，并展示给买家",
    comparisonFbFeature4Other: "通常在私聊里自行约定，也可能根本没有约定",
    comparisonFbFinalTitle: "如何使用这页信息",
    comparisonFbFinalBody:
      "如果你更看重更快的发布、更顺畅的多语言沟通，以及确认对面是一位通过认证的邻居，那么 PopOut Market 的使用流程可能更适合你。请务必结合你自身的使用场景，确认当前的具体功能细节。",
    comparisonFbCard1Title: "AI 发帖引导",
    comparisonFbCard1Body: "上传图片后自动给出标题与描述建议",
    comparisonFbCard2Title: "实时翻译沟通",
    comparisonFbCard2Body: "多语言帖子与聊天更顺畅",
    comparisonFbCard3Title: "认证过的邻居",
    comparisonFbCard3Body: "澳洲手机号 + 一次性定位核验",
    heroTitle: "你所在的墨尔本城区，一切尽在同一个信息流",
    heroLead:
      "PopOut Market 是墨尔本的邻里生活 App：和身边通过认证的邻居买卖二手好物，在地图上看到本地商铺正在打折的商品，还能随时向邻居提问——你用你的语言写，对方用他的语言读。",
    heroTrustLine:
      "澳洲手机号 + 一次性定位核验完成认证。iOS 与 Android 免费下载。已覆盖墨尔本 {count} 个城区。",
    heroGetAppCta: "下载 App",
    heroBrowseCta: "看看附近的二手好物",
    homeMarketTitle: "和*身边的邻居*买卖二手好物",
    homeMarketSubtitle:
      "每一件商品都来自住在你附近的人，交易全部当面完成。可以按「免费送」或「$20 以内」筛选，也可以按分类慢慢逛。",
    homeMarketBrowseAll: "浏览全部商品",
    homeMarketFilterAll: "全部",
    homeMarketFilterGiveaway: "免费送",
    homeMarketFilterUnder20: "$20 以内",
    homeBulkListingLine: "一次性上传整间房的照片——PopOut 会自动帮你拆成一条条商品草稿。",
    homeShopsTitle: "本地商铺，都在*地图*上",
    homeShopsSubtitle:
      "邻居逛完附近的店，就把发现的好价发上来：商品名和价格直接标在照片上，并翻译成 App 支持的每一种语言。地图目前覆盖墨尔本 CBD 与 Docklands 的 16 家店铺，其中 14 家是独立经营的亚洲超市。",
    homeShopsCta: "查看墨尔本 CBD 亚洲超市指南",
    homeCommunityTitle: "邻里之间，*什么都能问*",
    homeCommunitySubtitle:
      "「社区」页汇集了邻里生活的一切：本地优惠、关于你所在城区的提问、生活推荐，还有正在求购的邻居。你用你的语言写，他们用自己的语言读。",
    homeCommunityTopics: "本地优惠 · 提问与资讯 · 本地生活 · 求购 · 其他",
    homeTrustTitle: "真实的邻居，*不是匿名账号*",
    homeTrustSubtitle:
      "每个账号都要通过澳洲手机号验证和一次性定位核验：定位只用来确认你所在的城区，确认后立即丢弃，每 30 天重新核验一次。《PopOut Market 社区规则》以八种语言发布，不注册也能查看；任何内容都可以举报、限制，也都可以申诉。",
    homeCoverageTitle: "已覆盖*墨尔本 {count} 个城区*",
    homeCoverageCta: "查看全部墨尔本城区",
    notFoundTitle: "页面未找到",
    notFoundDescription: "您请求的页面不存在或无法公开访问。",
  },
  "zh-Hant": {
    topDownload: "下載",
    topLanguage: "語言",
    languageModalTitle: "選擇你的語言",
    languageModalHint: "PopOut 以多語言連結在地社群。",
    downloadLine: "下載 PopOut Market 應用，支援 iOS 與 Android",
    slogan: "與附近的鄰居輕鬆買賣二手",
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
    marketPostListingRef: "編號",
    marketPostFixedPriceLabel: "價格固定",
    marketPostDetailLoadingAria: "載入詳情中",
    marketPostDescriptionHeading: "說明",
    marketPostPreferredMeetupLabel: "首選面交地點",
    marketPostOtherItemsHeading: "該賣家的其他商品",
    marketYes: "是",
    marketNo: "否",
    marketUnknown: "未知",
    translationDemoTitle: "說一次，*所有人*都能懂",
    translationDemoSubtitle: "你用你的語言發訊息，對方用他的語言收到——翻譯全自動。",
    aiPostDemoTitle: "拍張照，AI 幫你*搞定*",
    aiPostDemoSubtitle: "拍照後 AI 自動產生標題、分類和描述，你只需填價格和狀態。",
    aiPostDemoPrice: "價格",
    aiPostDemoYouFill: "你來填",
    footerLegalNavAria: "條款與聯絡",
    footerCopyright: "版權所有 © 2026 PopOut Market Pty Ltd。保留所有權利。",
    footerAcn: "ACN：696 464 945",
    footerNavAbout: "關於 PopOut Market",
    footerNavTerms: "使用條款",
    footerNavPrivacy: "隱私權政策",
    footerNavChildSafety: "兒童安全",
    footerNavContact: "聯絡我們",
    footerSocialRednoteAria: "PopOut Market 小紅書",
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
      "你的安全高於一切。每個 PopOut 帳號都需要通過澳洲手機號碼驗證，並完成一次性的位置確認——位置僅用來確認你所在的城區，確認後隨即刪除，之後每 30 天再確認一次。面交地點由賣家在刊登時挑選，都是公共場所；PopOut Market 使用守則以八種語言公開，不需帳號也能閱讀。任何內容都可以檢舉，刊登被限制時也可以提出申訴。",
    aboutWhyCommunicationTitle: "溝通，再無國界",
    aboutWhyCommunicationBody:
      "語言不該成為連結的障礙。PopOut 配備強大的即時雙語翻譯系統。用你的母語聊天——對方會收到自動翻譯。即使英文還不夠流利，你也可以在這裡自由交易、結識志同道合的朋友。",
    aboutPrivacyTitle: "我們守護您的隱私",
    aboutPrivacyLead: "在 PopOut，我們視隱私為基本權利。",
    aboutPrivacyMinimalTitle: "極簡資料採集",
    aboutPrivacyMinimalBody:
      "一個 PopOut 帳號只需要一組已驗證的澳洲手機號碼、一個已驗證的所在城區，以及一個你自己取的暱稱。帳號上沒有電子郵件、沒有密碼，也沒有你的法定姓名。",
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
    comparisonHubCardFbBody: "比較刊登速度、多語訊息溝通，以及各平台如何驗證你的交易對象。",
    comparisonHubCardFbCta: "查看與 Facebook Marketplace 對比",
    comparisonHubCardGumtreeBody: "比較 AI 刊登設定、多語聊天翻譯，以及帳號驗證方式。",
    comparisonHubCardGumtreeCta: "查看與 Gumtree 對比",
    comparisonGumtreeH1: "PopOut vs Gumtree：功能體驗比較",
    comparisonGumtreeLead:
      "本頁以墨爾本二手交易的實際情境，比較刊登設定、多語溝通，以及帳號驗證在實務操作流程上的差異。",
    comparisonGumtreeDisclaimer:
      "免責聲明：本頁僅供使用者教育與產品資訊參考，不構成法律意見。Gumtree 及相關名稱屬其權利人；功能可能隨版本更新調整，請以官方資訊為準。",
    comparisonGumtreeSection1Title: "1) AI 協助完成初稿，縮短發佈路徑",
    comparisonGumtreeSection1Body:
      "PopOut 可由物品照片生成標題、描述與分類初稿。賣家只需檢查內容、設定價格並挑選一處公共面交地點，即可發佈。你也可以一次上傳整個房間的照片，PopOut 會自動整理成一則則獨立的刊登初稿。",
    comparisonGumtreeSection2Title: "2) 多語言買賣溝通，適配多元社群",
    comparisonGumtreeSection2Body:
      "支援英語、簡中、繁中、韓語、日語、法語、西班牙語、越南語。貼文與聊天可依不同語言即時理解，降低溝通落差。",
    comparisonGumtreeSection3Title: "3) 經過驗證的鄰居，而非匿名帳號",
    comparisonGumtreeSection3Body:
      "每個 PopOut 帳號都需要通過澳洲手機號碼驗證與一次性的位置確認；持續聊天與發文的使用者每 30 天會再確認一次。位置只用來確認城區，不會保存 GPS 紀錄。PopOut Market 使用守則以八種語言公開，不需帳號也能閱讀。",
    comparisonGumtreeSection4Title: "4) 在公共場所當面完成交付",
    comparisonGumtreeSection4Body:
      "在 PopOut 賣東西，就是親手把物品交給鄰居。賣家刊登時會從清單中挑選一處好認的公共場所，買家在刊登頁上就能看到這個地點。沒有郵寄，也沒有快遞環節。",
    comparisonGumtreeTableTitle: "核心能力對照（使用者視角）",
    comparisonGumtreeTableNote: "註：右側為常見公開體驗概述，實際功能可能因地區與版本變動。",
    comparisonGumtreeFeature1Title: "發文準備時間",
    comparisonGumtreeFeature1Popout: "AI 先生成文案與分類建議，使用者做最後確認",
    comparisonGumtreeFeature1Other: "較依賴手動填寫與自行篩選",
    comparisonGumtreeFeature2Title: "語言覆蓋與翻譯體驗",
    comparisonGumtreeFeature2Popout: "發文與聊天具備多語言理解流程",
    comparisonGumtreeFeature2Other: "常需使用者自行翻譯或切換語言",
    comparisonGumtreeFeature3Title: "帳號驗證",
    comparisonGumtreeFeature3Popout: "澳洲手機號碼加上一次性位置確認，每 30 天重新確認",
    comparisonGumtreeFeature3Other: "通常以電子郵件或社群帳號登入，沒有位置確認",
    comparisonGumtreeFeature4Title: "面交地點如何決定",
    comparisonGumtreeFeature4Popout: "刊登時就選定公共面交地點，並顯示給買家",
    comparisonGumtreeFeature4Other: "多半在聊天中私下約定，甚至沒有約定",
    comparisonGumtreeFinalTitle: "選擇建議",
    comparisonGumtreeFinalBody:
      "如果你重視刊登速度、多語溝通的清晰度，也在意對方是不是經過驗證的鄰居，PopOut 可能更適合你。請依你所在地區與實際使用情況，確認目前的功能內容。",
    comparisonBackLabel: "返回比較總覽",
    comparisonGumtreeCard1Title: "AI 快速發佈",
    comparisonGumtreeCard1Body: "減少分類查找與重複填寫時間",
    comparisonGumtreeCard2Title: "多語言交易",
    comparisonGumtreeCard2Body: "覆蓋主要跨語買賣場景",
    comparisonGumtreeCard3Title: "經驗證的鄰居",
    comparisonGumtreeCard3Body: "澳洲手機號碼加上一次性位置確認",
    comparisonFbH1: "PopOut vs Facebook Marketplace：功能體驗比較",
    comparisonFbLead:
      "本文比較刊登設定、多語溝通，以及帳號驗證在實務操作流程上的差異，目的是協助使用者選擇真正貼合日常需求的交易流程。",
    comparisonFbDisclaimer:
      "免責聲明：本頁僅供產品資訊參考，不構成法律意見，也不對第三方平台作價值判斷。Facebook Marketplace 及相關名稱屬其權利人所有；功能可能隨版本調整，請以官方資訊為準。",
    comparisonFbSection1Title: "1) AI 圖片發文，減少重複填寫",
    comparisonFbSection1Body:
      "在 PopOut，上傳物品照片後可自動生成標題、描述與分類初稿。賣家只需檢查與補充內容、設定價格並挑選一處公共面交地點，就能用更少的手動步驟完成發佈。",
    comparisonFbSection2Title: "2) 多語言即時翻譯，降低溝通門檻",
    comparisonFbSection2Body:
      "PopOut 支援英語、簡中、繁中、韓語、日語、法語、西班牙語、越南語。貼文與聊天可依使用者語言即時呈現，適合墨爾本多語社群。",
    comparisonFbSection3Title: "3) 經過驗證的鄰居，而非匿名帳號",
    comparisonFbSection3Body:
      "每個 PopOut 帳號都需要通過澳洲手機號碼驗證與一次性的位置確認；持續聊天與發文的使用者每 30 天會再確認一次。位置只用來確認城區，不會保存 GPS 紀錄。刊登與訊息都可以檢舉，刊登被限制時也可以提出一次申訴。",
    comparisonFbSection4Title: "4) 在公共場所當面完成交付",
    comparisonFbSection4Body:
      "在 PopOut 賣東西，就是親手把物品交給鄰居。賣家刊登時會從清單中挑選一處好認的公共場所，買家在刊登頁上就能看到這個地點。沒有郵寄，也沒有快遞環節。",
    comparisonFbTableTitle: "核心功能對照（使用者視角）",
    comparisonFbTableNote: "註：右側為常見公開體驗描述，實際能力可能因地區、帳號與版本而異。",
    comparisonFbFeature1Title: "發文啟動效率",
    comparisonFbFeature1Popout: "圖片上傳後由 AI 生成標題/描述/分類建議",
    comparisonFbFeature1Other: "通常需手動填寫多個欄位並自行選分類",
    comparisonFbFeature2Title: "跨語言溝通",
    comparisonFbFeature2Popout: "貼文與聊天支援多語言即時理解與呈現",
    comparisonFbFeature2Other: "多語溝通常仰賴使用者自行翻譯",
    comparisonFbFeature3Title: "帳號驗證",
    comparisonFbFeature3Popout: "澳洲手機號碼加上一次性位置確認，每 30 天重新確認",
    comparisonFbFeature3Other: "通常沿用既有的社群帳號，沒有位置確認",
    comparisonFbFeature4Title: "面交地點如何決定",
    comparisonFbFeature4Popout: "刊登時就選定公共面交地點，並顯示給買家",
    comparisonFbFeature4Other: "多半在聊天中私下約定，甚至沒有約定",
    comparisonFbFinalTitle: "如何使用這頁資訊",
    comparisonFbFinalBody:
      "如果你重視更快的刊登速度、更順暢的多語溝通，也在意對方是不是經過驗證的鄰居，PopOut 的操作流程可能更適合你。請務必依你自身的使用情境，確認目前的功能細節。",
    comparisonFbCard1Title: "AI 發文引導",
    comparisonFbCard1Body: "上傳圖片後自動產生標題與描述建議",
    comparisonFbCard2Title: "即時翻譯溝通",
    comparisonFbCard2Body: "多語貼文與聊天更順暢",
    comparisonFbCard3Title: "經驗證的鄰居",
    comparisonFbCard3Body: "澳洲手機號碼加上一次性位置確認",
    heroTitle: "你所在的墨爾本社區，大小事全在同一個動態",
    heroLead:
      "PopOut Market 是專為墨爾本打造的社區生活 App。和附近經過驗證的鄰居買賣二手好物，在地圖上看見在地店家的最新優惠，還能向鄰居打聽任何事——各自用自己的語言就好。",
    heroTrustLine:
      "以澳洲手機號碼與一次性位置確認完成驗證。iOS 與 Android 免費下載。已上線墨爾本 {count} 個區域。",
    heroGetAppCta: "下載 App",
    heroBrowseCta: "瀏覽附近的二手好物",
    homeMarketTitle: "和*附近的鄰居*買賣二手好物",
    homeMarketSubtitle:
      "每一則刊登都來自住在你附近的人，物品由雙方親手面交。可以用「免費贈送」或「$20 以下」快速篩選，也可以依分類瀏覽。",
    homeMarketBrowseAll: "瀏覽全部刊登",
    homeMarketFilterAll: "全部",
    homeMarketFilterGiveaway: "免費贈送",
    homeMarketFilterUnder20: "$20 以下",
    homeBulkListingLine: "一次上傳整個房間的照片——PopOut 會自動整理成一則則刊登初稿。",
    homeShopsTitle: "在地店家，就在*地圖上*",
    homeShopsSubtitle:
      "鄰居逛過附近的店家後把發現貼上來，商品名稱與價格直接標在照片上，並翻譯成 App 支援的每一種語言。地圖目前收錄墨爾本 CBD 與 Docklands 共 16 家店，其中 14 家是獨立經營的亞洲超市。",
    homeShopsCta: "查看墨爾本 CBD 亞洲超市指南",
    homeCommunityTitle: "有問題，*儘管問鄰居*",
    homeCommunitySubtitle:
      "社群分頁就是鄰里生活的所在：在地優惠、社區大小事、私房推薦，還有正在徵求物品的鄰居。你用你的語言寫，他們用自己的語言讀。",
    homeCommunityTopics: "在地優惠 · 提問與消息 · 在地生活 · 徵求物品 · 其他",
    homeTrustTitle: "真實的鄰居，*不是匿名帳號*",
    homeTrustSubtitle:
      "每個帳號都需要通過澳洲手機號碼驗證，以及一次性的位置確認——僅用來確認你所在的城區，確認後隨即刪除，之後每 30 天再確認一次。PopOut Market 使用守則以八種語言公開，不需帳號也能閱讀；任何內容都可以檢舉、限制與申訴。",
    homeCoverageTitle: "已在*墨爾本 {count} 個區域*上線",
    homeCoverageCta: "查看所有墨爾本區域",
    notFoundTitle: "找不到頁面",
    notFoundDescription: "您請求的頁面不存在或無法公開存取。",
  },
  ko: {
    topDownload: "다운로드",
    topLanguage: "언어",
    languageModalTitle: "언어 선택",
    languageModalHint: "PopOut은 다양한 언어로 지역 커뮤니티를 연결합니다.",
    downloadLine: "iOS 및 Android용 PopOut Market 앱을 다운로드하세요",
    slogan: "가까운 동네 이웃과 사고파세요",
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
    marketPostListingRef: "참조 번호",
    marketPostFixedPriceLabel: "고정 가격",
    marketPostDetailLoadingAria: "상세 정보 불러오는 중",
    marketPostDescriptionHeading: "설명",
    marketPostPreferredMeetupLabel: "선호 만남 장소",
    marketPostOtherItemsHeading: "이 판매자의 다른 상품",
    marketYes: "예",
    marketNo: "아니오",
    marketUnknown: "알 수 없음",
    translationDemoTitle: "한 번 말하면, *모두가* 이해합니다",
    translationDemoSubtitle: "내 언어로 보내면, 상대방은 자기 언어로 받아요. 번역은 자동입니다.",
    aiPostDemoTitle: "사진 한 장이면 AI가 *알아서*",
    aiPostDemoSubtitle: "사진을 찍으면 AI가 제목, 카테고리, 설명을 자동 생성 — 가격만 입력하세요.",
    aiPostDemoPrice: "가격",
    aiPostDemoYouFill: "직접 입력",
    footerLegalNavAria: "약관 및 문의",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "PopOut Market 소개",
    footerNavTerms: "이용약관",
    footerNavPrivacy: "개인정보 처리방침",
    footerNavChildSafety: "아동 안전",
    footerNavContact: "문의하기",
    footerSocialRednoteAria: "PopOut Market 샤오홍슈(RED)",
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
      "당신의 안전이 최우선입니다. 모든 PopOut 계정은 호주 휴대폰 번호와 한 번의 위치 확인으로 인증합니다. 위치 정보는 거주 지역만 확인한 뒤 바로 삭제됩니다. 만남은 판매자가 게시할 때 직접 고른 공공장소에서 이루어지고, PopOut Market 이용 규칙은 8개 언어로 공개되어 계정 없이도 읽을 수 있습니다. 무엇이든 신고할 수 있고, 제한된 게시글은 이의를 제기할 수 있습니다.",
    aboutWhyCommunicationTitle: "국경 없는 소통",
    aboutWhyCommunicationBody:
      "언어는 연결의 장벽이 되어서는 안 됩니다. PopOut에는 강력한 실시간 이중 언어 번역이 있습니다. 모국어로 채팅하면 상대에게는 자동으로 번역됩니다. 영어가 완벽하지 않아도 자유롭게 거래하고 마음이 맞는 친구를 만나세요.",
    aboutPrivacyTitle: "개인정보를 지킵니다",
    aboutPrivacyLead: "PopOut에서는 개인정보를 기본권으로 대합니다.",
    aboutPrivacyMinimalTitle: "최소 수집",
    aboutPrivacyMinimalBody:
      "PopOut 계정에는 인증된 호주 휴대폰 번호, 인증된 거주 지역, 그리고 직접 정한 닉네임만 있으면 됩니다. 이메일 주소도, 비밀번호도, 실명도 필요하지 않습니다.",
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
    comparisonHubCardFbBody:
      "등록 속도, 다국어 메시지, 그리고 거래 상대를 어떻게 인증하는지 비교해 보세요.",
    comparisonHubCardFbCta: "PopOut vs Facebook Marketplace 보기",
    comparisonHubCardGumtreeBody: "AI 등록 설정, 다국어 채팅 번역, 계정 인증을 비교해 보세요.",
    comparisonHubCardGumtreeCta: "PopOut vs Gumtree 보기",
    comparisonGumtreeH1: "PopOut vs Gumtree: 사용 경험 비교",
    comparisonGumtreeLead:
      "이 페이지는 멜버른 중고 거래 사용 사례를 중심으로 등록 설정, 다국어 소통, 계정 인증에서 나타나는 실제 사용 흐름의 차이를 비교합니다.",
    comparisonGumtreeDisclaimer:
      "면책 고지: 이 페이지는 사용자 안내와 제품 설명 목적으로만 제공되며 법률 자문이 아닙니다. Gumtree 및 관련 상표는 각 권리자에게 귀속됩니다. 제3자 기능은 시간이 지나며 바뀔 수 있습니다.",
    comparisonGumtreeSection1Title: "1) AI가 돕는 등록 설정",
    comparisonGumtreeSection1Body:
      "PopOut은 물품 사진을 바탕으로 제목, 설명, 카테고리 초안을 만들어 줍니다. 판매자는 초안을 검토하고 가격을 정한 뒤 공공장소 만남 지점을 골라 등록하면 됩니다. 방 안 물건을 한꺼번에 찍어 올리면 PopOut이 사진을 물건별로 나눠 각각의 등록 초안으로 정리해 줍니다.",
    comparisonGumtreeSection2Title: "2) 내장된 다국어 흐름",
    comparisonGumtreeSection2Body:
      "PopOut은 영어, 중국어 간체, 중국어 번체, 한국어, 일본어, 프랑스어, 스페인어, 베트남어를 등록과 메시지에서 지원해, 다양한 도시 환경에서 언어 장벽을 줄여 줍니다.",
    comparisonGumtreeSection3Title: "3) 익명 계정이 아닌, 인증된 이웃",
    comparisonGumtreeSection3Body:
      "모든 PopOut 계정은 호주 휴대폰 번호와 한 번의 위치 확인으로 인증하며, 계속 대화하고 게시하는 사용자는 30일마다 다시 확인합니다. 이 확인은 거주 지역만 파악할 뿐 GPS 기록은 저장하지 않습니다. PopOut Market 이용 규칙은 8개 언어로 공개되어 계정 없이도 읽을 수 있습니다.",
    comparisonGumtreeSection4Title: "4) 만남은 공공장소에서",
    comparisonGumtreeSection4Body:
      "PopOut에서 판매한다는 건 이웃에게 물건을 직접 건네준다는 뜻입니다. 판매자는 게시할 때 목록에서 찾기 쉬운 공공장소를 고르고, 구매자는 게시글에서 그 장소를 확인합니다. 우편 발송도, 택배 단계도 없습니다.",
    comparisonGumtreeTableTitle: "기능 요약 (사용자 관점)",
    comparisonGumtreeTableNote:
      "참고: 오른쪽 열은 일반적인 공개 이용 양상을 설명하며 계정, 지역, 제품 업데이트에 따라 달라질 수 있습니다.",
    comparisonGumtreeFeature1Title: "등록 준비 시간",
    comparisonGumtreeFeature1Popout: "AI가 주요 항목을 먼저 작성하고 사용자가 세부 내용을 마무리",
    comparisonGumtreeFeature1Other: "대체로 처음부터 수동으로 양식을 작성",
    comparisonGumtreeFeature2Title: "거래 흐름에서의 언어 지원",
    comparisonGumtreeFeature2Popout: "게시물과 채팅 전반에서 다국어 이해 지원",
    comparisonGumtreeFeature2Other: "언어 간 소통은 보통 사용자가 직접 번역해야 함",
    comparisonGumtreeFeature3Title: "계정 인증",
    comparisonGumtreeFeature3Popout: "호주 휴대폰 번호와 한 번의 위치 확인, 30일마다 재확인",
    comparisonGumtreeFeature3Other: "대체로 이메일이나 소셜 로그인만 하며 위치 확인은 없음",
    comparisonGumtreeFeature4Title: "물건을 건네는 장소",
    comparisonGumtreeFeature4Popout: "등록할 때 공공장소 만남 지점을 골라 구매자에게 표시",
    comparisonGumtreeFeature4Other: "정한다 해도 대개 채팅에서 개인적으로 조율",
    comparisonGumtreeFinalTitle: "추천",
    comparisonGumtreeFinalBody:
      "등록 속도, 다국어 소통의 명확함, 그리고 상대가 인증된 이웃이라는 확신이 중요하다면 PopOut이 더 잘 맞을 수 있습니다. 현재 제공되는 기능은 본인의 지역과 사용 환경을 기준으로 직접 확인해 보세요.",
    comparisonBackLabel: "비교 목록으로 돌아가기",
    comparisonGumtreeCard1Title: "빠른 AI 등록",
    comparisonGumtreeCard1Body: "카테고리 찾기와 반복 입력을 줄여 줍니다",
    comparisonGumtreeCard2Title: "다국어 거래",
    comparisonGumtreeCard2Body: "주요 언어 간 거래 흐름을 지원합니다",
    comparisonGumtreeCard3Title: "인증된 이웃",
    comparisonGumtreeCard3Body: "호주 휴대폰 번호와 한 번의 위치 확인",
    comparisonFbH1: "PopOut vs Facebook Marketplace: 사용 경험 비교",
    comparisonFbLead:
      "이 글은 등록 설정, 다국어 소통, 계정 인증에서 나타나는 실질적인 사용 흐름의 차이를 비교합니다. 일상적인 필요에 맞는 마켓플레이스 사용 흐름을 선택하시는 데 도움을 드리는 것이 목적입니다.",
    comparisonFbDisclaimer:
      "면책 고지: 이 페이지는 제품 안내 목적으로만 제공되며 법률 자문이 아니고 어떤 제3자 플랫폼에 대한 부정적 평가도 아닙니다. Facebook Marketplace 및 관련 상표는 각 권리자에게 귀속됩니다. 기능 제공 여부는 지역, 계정 유형, 제품 업데이트에 따라 달라질 수 있습니다.",
    comparisonFbSection1Title: "1) 사진으로 시작하는 AI 등록",
    comparisonFbSection1Body:
      "PopOut에서는 물품 사진을 올리면 제목, 설명, 카테고리 초안을 만들어 줍니다. 판매자는 이를 검토하고 내용을 보완한 뒤 가격을 정하고 공공장소 만남 지점을 고르면, 수동 단계를 줄이며 더 빠르게 등록할 수 있습니다.",
    comparisonFbSection2Title: "2) 실시간 다국어 소통",
    comparisonFbSection2Body:
      "PopOut은 영어, 중국어 간체, 중국어 번체, 한국어, 일본어, 프랑스어, 스페인어, 베트남어를 지원합니다. 게시물과 채팅을 각 사용자가 선호하는 언어로 읽을 수 있습니다.",
    comparisonFbSection3Title: "3) 익명 계정이 아닌, 인증된 이웃",
    comparisonFbSection3Body:
      "모든 PopOut 계정은 호주 휴대폰 번호와 한 번의 위치 확인으로 인증하며, 계속 대화하고 게시하는 사용자는 30일마다 다시 확인합니다. 이 확인은 거주 지역만 파악할 뿐 GPS 기록은 저장하지 않습니다. 게시글과 메시지는 언제든 신고할 수 있고, 제한된 게시글은 한 번 이의를 제기할 수 있습니다.",
    comparisonFbSection4Title: "4) 만남은 공공장소에서",
    comparisonFbSection4Body:
      "PopOut에서 판매한다는 건 이웃에게 물건을 직접 건네준다는 뜻입니다. 판매자는 게시할 때 목록에서 찾기 쉬운 공공장소를 고르고, 구매자는 게시글에서 그 장소를 확인합니다. 우편 발송도, 택배 단계도 없습니다.",
    comparisonFbTableTitle: "기능 요약 (사용자 관점)",
    comparisonFbTableNote:
      "참고: 오른쪽 열은 일반적인 공개 이용 양상을 반영하며 시간이 지나며 바뀔 수 있습니다.",
    comparisonFbFeature1Title: "등록 시작 속도",
    comparisonFbFeature1Popout: "AI가 사진으로 제목/설명/카테고리를 작성",
    comparisonFbFeature1Other: "대체로 수동 양식 작성과 카테고리 선택에 의존",
    comparisonFbFeature2Title: "다국어 메시지",
    comparisonFbFeature2Popout: "지원 언어 전반에서 게시물과 채팅 내용을 이해 가능",
    comparisonFbFeature2Other: "언어 간 소통은 보통 직접 번역에 의존",
    comparisonFbFeature3Title: "계정 인증",
    comparisonFbFeature3Popout: "호주 휴대폰 번호와 한 번의 위치 확인, 30일마다 재확인",
    comparisonFbFeature3Other: "대체로 기존 소셜 계정으로 가입하며 위치 확인은 없음",
    comparisonFbFeature4Title: "물건을 건네는 장소",
    comparisonFbFeature4Popout: "등록할 때 공공장소 만남 지점을 골라 구매자에게 표시",
    comparisonFbFeature4Other: "정한다 해도 대개 채팅에서 개인적으로 조율",
    comparisonFbFinalTitle: "이 비교를 활용하는 방법",
    comparisonFbFinalBody:
      "더 빠른 등록, 더 매끄러운 다국어 소통, 그리고 상대가 인증된 이웃이라는 확신이 중요하다면 PopOut의 사용 흐름이 더 잘 맞을 수 있습니다. 현재 기능의 세부 사항은 항상 본인의 사용 환경에서 직접 확인하시기 바랍니다.",
    comparisonFbCard1Title: "AI 등록 도우미",
    comparisonFbCard1Body: "사진을 바탕으로 제목과 설명 초안 작성",
    comparisonFbCard2Title: "실시간 번역",
    comparisonFbCard2Body: "언어 간 게시물과 채팅이 더 매끄럽게",
    comparisonFbCard3Title: "인증된 이웃",
    comparisonFbCard3Body: "호주 휴대폰 번호와 한 번의 위치 확인",
    heroTitle: "멜버른 우리 동네의 모든 것, 피드 하나에",
    heroLead:
      "PopOut Market은 멜버른을 위한 동네 생활 앱입니다. 가까이 사는 인증된 이웃과 중고를 사고팔고, 지도에서 동네 가게의 지금 할인 정보를 확인하고, 이웃에게 무엇이든 물어보세요 — 각자 자기 언어로 쓰면 됩니다.",
    heroTrustLine:
      "호주 휴대폰 번호와 한 번의 위치 확인으로 인증합니다. iOS와 Android에서 무료. 멜버른 {count}개 지역에서 이용할 수 있습니다.",
    heroGetAppCta: "앱 다운로드",
    heroBrowseCta: "내 주변 중고 상품 둘러보기",
    homeMarketTitle: "*가까운 이웃*과 중고를 사고파세요",
    homeMarketSubtitle:
      "모든 상품은 가까이 사는 이웃이 올린 것이고, 물건은 직접 만나서 건넵니다. 무료 나눔이나 $20 이하로 걸러 보거나 카테고리별로 둘러보세요.",
    homeMarketBrowseAll: "전체 상품 둘러보기",
    homeMarketFilterAll: "전체",
    homeMarketFilterGiveaway: "무료 나눔",
    homeMarketFilterUnder20: "$20 이하",
    homeBulkListingLine:
      "방 안 물건을 한꺼번에 찍어 올려 보세요 — PopOut이 물건별 등록 초안으로 나눠 줍니다.",
    homeShopsTitle: "*지도*로 보는 동네 가게",
    homeShopsSubtitle:
      "이웃들이 근처 가게를 직접 둘러보고 찾은 정보를 올립니다. 사진 위에 상품명과 가격이 적혀 있고, 앱이 지원하는 모든 언어로 번역됩니다. 지도에는 멜버른 CBD와 Docklands의 가게 16곳이 있고, 그중 14곳은 개인이 운영하는 아시안 식료품점입니다.",
    homeShopsCta: "멜버른 CBD 아시안 식료품점 가이드 보기",
    homeCommunityTitle: "이웃에게 *무엇이든* 물어보세요",
    homeCommunitySubtitle:
      "커뮤니티 탭에는 동네 생활이 모입니다. 동네 할인 정보, 우리 동네에 대한 궁금증, 추천, 그리고 물건을 구하는 사람들까지. 내 언어로 쓰면 상대는 자기 언어로 읽습니다.",
    homeCommunityTopics: "동네 할인 · 질문과 소식 · 동네 생활 · 삽니다 · 기타",
    homeTrustTitle: "익명 계정이 아니라 *진짜 이웃*입니다",
    homeTrustSubtitle:
      "모든 계정은 호주 휴대폰 번호와 한 번의 위치 확인으로 인증합니다. 위치 정보는 거주 지역만 확인한 뒤 바로 삭제되고, 30일마다 다시 확인합니다. PopOut Market 이용 규칙은 8개 언어로 공개되어 계정 없이도 읽을 수 있으며, 무엇이든 신고하고 제한할 수 있고 이의도 제기할 수 있습니다.",
    homeCoverageTitle: "지금 *멜버른 {count}개 지역*에서 이용할 수 있어요",
    homeCoverageCta: "멜버른 전체 지역 보기",
    notFoundTitle: "페이지를 찾을 수 없습니다",
    notFoundDescription: "요청하신 페이지가 존재하지 않거나 공개적으로 접근할 수 없습니다.",
  },
  ja: {
    topDownload: "ダウンロード",
    topLanguage: "言語",
    languageModalTitle: "言語を選択",
    languageModalHint: "PopOut は多言語で地域コミュニティをつなぎます。",
    downloadLine: "iOS / Android 向け PopOut Market アプリをダウンロード",
    slogan: "ご近所さんと手軽に売り買いしよう",
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
    marketPostListingRef: "出品番号",
    marketPostFixedPriceLabel: "価格固定",
    marketPostDetailLoadingAria: "詳細を読み込み中",
    marketPostDescriptionHeading: "説明",
    marketPostPreferredMeetupLabel: "希望受け渡し場所",
    marketPostOtherItemsHeading: "この出品者の他の商品",
    marketYes: "はい",
    marketNo: "いいえ",
    marketUnknown: "不明",
    translationDemoTitle: "一度言えば、*みんな*に伝わる",
    translationDemoSubtitle:
      "あなたの言語で送ると、相手は自分の言語で受け取ります。翻訳は自動です。",
    aiPostDemoTitle: "写真を撮るだけ。あとはAIに*おまかせ*",
    aiPostDemoSubtitle:
      "写真を撮ると、AIがタイトル・カテゴリ・説明を自動生成。価格と状態だけ入力すればOK。",
    aiPostDemoPrice: "価格",
    aiPostDemoYouFill: "あなたが入力",
    footerLegalNavAria: "ポリシーとお問い合わせ",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. All rights reserved.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "PopOut Market について",
    footerNavTerms: "利用規約",
    footerNavPrivacy: "プライバシーポリシー",
    footerNavChildSafety: "子どもの安全",
    footerNavContact: "お問い合わせ",
    footerSocialRednoteAria: "PopOut Market 小紅書（RED）",
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
      "あなたの安全が最優先です。PopOut のアカウントはすべて、オーストラリアの携帯電話番号と、お住まいのサバーブを確認したらすぐに破棄される一度きりの位置情報チェックで認証されます。受け渡しは、出品時に出品者が選んだ公共の場所で行います。PopOut Market のルールは8言語で公開されており、アカウントがなくても読めます。気になることはいつでも通報でき、制限された出品には異議を申し立てられます。",
    aboutWhyCommunicationTitle: "国境のないコミュニケーション",
    aboutWhyCommunicationBody:
      "言語がつながりの障壁になるべきではありません。PopOutには強力なリアルタイム二言語翻訳があります。母語でチャットすれば、相手には自動翻訳が届きます。英語が完璧でなくても、自由に取引し、気の合う友だちを作れます。",
    aboutPrivacyTitle: "プライバシーを守ります",
    aboutPrivacyLead: "PopOutではプライバシーを基本権として扱います。",
    aboutPrivacyMinimalTitle: "最小限のデータ収集",
    aboutPrivacyMinimalBody:
      "PopOut のアカウントに必要なのは、認証済みのオーストラリアの携帯電話番号、確認済みのサバーブ、そしてご自身で決めたニックネームだけです。メールアドレスもパスワードも、本名も登録しません。",
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
    comparisonHubCardFbBody:
      "出品のスピード、多言語メッセージ、そして取引相手をどう確認しているかを比較します。",
    comparisonHubCardFbCta: "PopOut vs Facebook Marketplace を読む",
    comparisonHubCardGumtreeBody:
      "AIによる出品設定、多言語チャット翻訳、アカウント認証を比較します。",
    comparisonHubCardGumtreeCta: "PopOut vs Gumtree を読む",
    comparisonGumtreeH1: "PopOut vs Gumtree：使用体験の比較",
    comparisonGumtreeLead:
      "このページでは、メルボルンでの中古品取引を想定し、出品設定、多言語コミュニケーション、アカウント認証における実際のワークフローの違いを比較します。",
    comparisonGumtreeDisclaimer:
      "免責事項：このページはユーザー向けの説明と製品紹介のみを目的としており、法的助言ではありません。Gumtree および関連する商標はそれぞれの権利者に帰属します。第三者の機能は変更される場合があります。",
    comparisonGumtreeSection1Title: "1) AI による出品作成のサポート",
    comparisonGumtreeSection1Body:
      "PopOut は商品写真からタイトル・説明・カテゴリの下書きを作成できます。出品者はその下書きを確認し、価格を決め、公共の受け渡し場所を選んで公開するだけです。部屋全体の写真をまとめて追加すれば、PopOut がそれぞれ別の出品の下書きに振り分けます。",
    comparisonGumtreeSection2Title: "2) 多言語に対応した一連の流れ",
    comparisonGumtreeSection2Body:
      "PopOut は英語、簡体字中国語、繁体字中国語、韓国語、日本語、フランス語、スペイン語、ベトナム語に出品とメッセージで対応し、多様な都市環境での言語の壁を減らします。",
    comparisonGumtreeSection3Title: "3) 匿名アカウントではなく、認証済みのご近所さん",
    comparisonGumtreeSection3Body:
      "PopOut のアカウントはすべて、オーストラリアの携帯電話番号と一度きりの位置情報チェックで認証されます。チャットや出品を続けている方には、30日ごとに再確認が行われます。確認するのはサバーブだけで、GPS の情報が保存されることはありません。PopOut Market のルールは8言語で公開されており、アカウントがなくても読めます。",
    comparisonGumtreeSection4Title: "4) 受け渡しは公共の場所で",
    comparisonGumtreeSection4Body:
      "PopOut で売るということは、ご近所さんに直接手渡しするということです。出品者は投稿時に、わかりやすい公共の場所をリストから選び、その場所は出品ページで購入希望者にも表示されます。郵送も宅配便も一切ありません。",
    comparisonGumtreeTableTitle: "機能の概要（ユーザー視点）",
    comparisonGumtreeTableNote:
      "注：右の列は一般的な利用傾向を示したもので、アカウント、地域、製品の更新によって異なる場合があります。",
    comparisonGumtreeFeature1Title: "出品準備にかかる時間",
    comparisonGumtreeFeature1Popout: "AI が主要項目を下書きし、ユーザーが詳細を仕上げる",
    comparisonGumtreeFeature1Other: "最初から手動で入力する作業が多くなりがち",
    comparisonGumtreeFeature2Title: "取引の流れにおける言語サポート",
    comparisonGumtreeFeature2Popout: "投稿とチャットの両方で多言語に対応",
    comparisonGumtreeFeature2Other: "言語をまたぐやり取りはユーザー側の翻訳に頼りがち",
    comparisonGumtreeFeature3Title: "アカウント認証",
    comparisonGumtreeFeature3Popout:
      "オーストラリアの携帯電話番号と一度きりの位置情報チェック、30日ごとに再確認",
    comparisonGumtreeFeature3Other:
      "通常はメールまたはSNSアカウントでのログインのみで、位置情報の確認はなし",
    comparisonGumtreeFeature4Title: "受け渡しが行われる場所",
    comparisonGumtreeFeature4Popout: "出品時に公共の受け渡し場所を選び、購入希望者にも表示される",
    comparisonGumtreeFeature4Other: "チャットで個別に決めるだけで、決まらないことも多い",
    comparisonGumtreeFinalTitle: "おすすめ",
    comparisonGumtreeFinalBody:
      "出品のスピード、多言語でのわかりやすさ、そして相手が認証済みのご近所さんだという安心感を重視するなら、PopOutのほうが適しているかもしれません。最新の機能については、ご自身の地域や利用状況に合わせてご確認ください。",
    comparisonBackLabel: "比較一覧に戻る",
    comparisonGumtreeCard1Title: "AI で素早く出品",
    comparisonGumtreeCard1Body: "カテゴリ探しや繰り返しの入力を削減",
    comparisonGumtreeCard2Title: "多言語での取引",
    comparisonGumtreeCard2Body: "主要な多言語取引の流れに対応",
    comparisonGumtreeCard3Title: "認証済みのご近所さん",
    comparisonGumtreeCard3Body: "オーストラリアの携帯電話番号と一度きりの位置情報チェック",
    comparisonFbH1: "PopOut vs Facebook Marketplace：使用体験の比較",
    comparisonFbLead:
      "この記事では、出品設定、多言語コミュニケーション、アカウント認証における実際のワークフローの違いを比較します。日々のニーズに合ったマーケットプレイスの選び方をサポートすることを目的としています。",
    comparisonFbDisclaimer:
      "免責事項：このページは製品の説明のみを目的としており、法的助言や第三者プラットフォームに対する否定的な評価ではありません。Facebook Marketplace および関連する商標はそれぞれの権利者に帰属します。機能の提供状況は地域、アカウントの種類、製品の更新によって異なる場合があります。",
    comparisonFbSection1Title: "1) 写真からの AI 出品サポート",
    comparisonFbSection1Body:
      "PopOut では、商品写真をアップロードするとタイトル・説明・カテゴリの下書きが生成されます。出品者はそれを確認して情報を補い、価格を決め、公共の受け渡し場所を選ぶだけ。手作業を減らして出品できます。",
    comparisonFbSection2Title: "2) リアルタイムの多言語コミュニケーション",
    comparisonFbSection2Body:
      "PopOut は英語、簡体字中国語、繁体字中国語、韓国語、日本語、フランス語、スペイン語、ベトナム語に対応しています。投稿やチャットを各ユーザーの好みの言語で読むことができます。",
    comparisonFbSection3Title: "3) 匿名アカウントではなく、認証済みのご近所さん",
    comparisonFbSection3Body:
      "PopOut のアカウントはすべて、オーストラリアの携帯電話番号と一度きりの位置情報チェックで認証されます。チャットや出品を続けている方には、30日ごとに再確認が行われます。確認するのはサバーブだけで、GPS の情報が保存されることはありません。出品もメッセージも通報でき、制限された出品には一度だけ異議を申し立てられます。",
    comparisonFbSection4Title: "4) 受け渡しは公共の場所で",
    comparisonFbSection4Body:
      "PopOut で売るということは、ご近所さんに直接手渡しするということです。出品者は投稿時に、わかりやすい公共の場所をリストから選び、その場所は出品ページで購入希望者にも表示されます。郵送も宅配便も一切ありません。",
    comparisonFbTableTitle: "機能の概要（ユーザー視点）",
    comparisonFbTableNote:
      "注：右の列は一般的な利用傾向を反映したもので、時間とともに変わる場合があります。",
    comparisonFbFeature1Title: "出品開始のスピード",
    comparisonFbFeature1Popout: "AI が写真からタイトル・説明・カテゴリを下書き",
    comparisonFbFeature1Other: "通常は手動での入力とカテゴリ選択に依存",
    comparisonFbFeature2Title: "多言語メッセージ",
    comparisonFbFeature2Popout: "対応言語をまたいで投稿やチャットの内容を理解できる",
    comparisonFbFeature2Other: "言語をまたぐやり取りは自分での翻訳に頼りがち",
    comparisonFbFeature3Title: "アカウント認証",
    comparisonFbFeature3Popout:
      "オーストラリアの携帯電話番号と一度きりの位置情報チェック、30日ごとに再確認",
    comparisonFbFeature3Other: "通常は既存のSNSアカウントを利用するのみで、位置情報の確認はなし",
    comparisonFbFeature4Title: "受け渡しが行われる場所",
    comparisonFbFeature4Popout: "出品時に公共の受け渡し場所を選び、購入希望者にも表示される",
    comparisonFbFeature4Other: "チャットで個別に決めるだけで、決まらないことも多い",
    comparisonFbFinalTitle: "この比較の使い方",
    comparisonFbFinalBody:
      "より速い出品、よりスムーズな多言語コミュニケーション、そして相手が認証済みのご近所さんだという安心感を重視するなら、PopOutのワークフローのほうが合っているかもしれません。最新の機能の詳細は、必ずご自身の利用状況に合わせてご確認ください。",
    comparisonFbCard1Title: "AI 出品アシスト",
    comparisonFbCard1Body: "写真をもとにタイトルと説明を下書き",
    comparisonFbCard2Title: "リアルタイム翻訳",
    comparisonFbCard2Body: "言語をまたぐ投稿やチャットがよりスムーズに",
    comparisonFbCard3Title: "認証済みのご近所さん",
    comparisonFbCard3Body: "オーストラリアの携帯電話番号と一度きりの位置情報チェック",
    heroTitle: "メルボルンのご近所のすべてが、ひとつのフィードに",
    heroLead:
      "PopOut Market は、メルボルンのご近所アプリです。認証済みの近所の人と中古品を売り買いしたり、近くのお店のいまのお買い得情報を地図で見つけたり、ご近所さんに何でも聞いてみたり——しかも、それぞれが自分の言語で書けば伝わります。",
    heroTrustLine:
      "オーストラリアの携帯電話番号と一度きりの位置情報チェックで認証。iOS / Android で無料。メルボルンの{count}の地域で利用できます。",
    heroGetAppCta: "アプリを入手",
    heroBrowseCta: "近くの中古品を見る",
    homeMarketTitle: "*すぐ近くのご近所さん*と中古品を売り買い",
    homeMarketSubtitle:
      "出品しているのは、みんな近所に住んでいる人。受け渡しは直接手渡しです。「あげます」や「$20以下」で絞り込んだり、カテゴリから探したりできます。",
    homeMarketBrowseAll: "すべての出品を見る",
    homeMarketFilterAll: "すべて",
    homeMarketFilterGiveaway: "あげます",
    homeMarketFilterUnder20: "$20以下",
    homeBulkListingLine:
      "部屋全体の写真をまとめて追加すれば、PopOut がそれぞれ別の下書きに振り分けます。",
    homeShopsTitle: "近くのお店が*地図*でわかる",
    homeShopsSubtitle:
      "近所の人が実際にお店を歩いて見つけたものを投稿。商品名と価格は写真に書き込まれ、アプリが対応するすべての言語に翻訳されます。地図にはメルボルン CBD とドックランズの16店舗が掲載されていて、そのうち14店舗は個人経営のアジア系食料品店です。",
    homeShopsCta: "メルボルン CBD のアジア食材店ガイドを見る",
    homeCommunityTitle: "ご近所さんに*なんでも*聞いてみよう",
    homeCommunitySubtitle:
      "コミュニティタブは、ご近所の暮らしが集まる場所。お買い得情報、エリアについての質問やお知らせ、暮らしの話題、そして「探しています」の投稿まで。あなたは自分の言語で書き、相手は自分の言語で読みます。",
    homeCommunityTopics: "お買い得情報 · 質問・お知らせ · 暮らしの話題 · 探しています · その他",
    homeTrustTitle: "*匿名アカウントではなく*、本物のご近所さん",
    homeTrustSubtitle:
      "アカウントはすべて、オーストラリアの携帯電話番号と、お住まいのサバーブを確認したらすぐに破棄される一度きりの位置情報チェックで認証され、30日ごとに再確認されます。PopOut Market のルールは8言語で公開されていてアカウントがなくても読め、気になることはいつでも通報でき、出品の制限や異議申し立ての仕組みも整っています。",
    homeCoverageTitle: "*メルボルンの{count}の地域*に広がっています",
    homeCoverageCta: "メルボルンの地域をすべて見る",
    notFoundTitle: "ページが見つかりません",
    notFoundDescription: "リクエストされたページは存在しないか、公開されていません。",
  },
  vi: {
    topDownload: "Tải xuống",
    topLanguage: "Ngôn ngữ",
    languageModalTitle: "Chọn ngôn ngữ của bạn",
    languageModalHint: "PopOut hỗ trợ cộng đồng địa phương với nhiều ngôn ngữ.",
    downloadLine: "Tải ứng dụng PopOut Market cho iOS và Android",
    slogan: "mua bán cùng hàng xóm quanh đây",
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
    marketPostListingRef: "Mã tin",
    marketPostFixedPriceLabel: "Giá cố định",
    marketPostDetailLoadingAria: "Đang tải chi tiết",
    marketPostDescriptionHeading: "Mô tả",
    marketPostPreferredMeetupLabel: "Điểm gặp ưu tiên",
    marketPostOtherItemsHeading: "Các tin khác của người bán",
    marketYes: "Có",
    marketNo: "Không",
    marketUnknown: "Không rõ",
    translationDemoTitle: "Nói một lần, *ai cũng* hiểu",
    translationDemoSubtitle:
      "Bạn gửi bằng ngôn ngữ của bạn, đối phương nhận bằng ngôn ngữ của họ — dịch tự động.",
    aiPostDemoTitle: "Chụp ảnh. AI lo *phần còn lại*",
    aiPostDemoSubtitle: "Chụp ảnh, AI tự tạo tiêu đề, danh mục và mô tả — bạn chỉ cần nhập giá.",
    aiPostDemoPrice: "Giá",
    aiPostDemoYouFill: "Bạn nhập",
    footerLegalNavAria: "Điều khoản và liên hệ",
    footerCopyright: "Bản quyền © 2026 PopOut Market Pty Ltd. Mọi quyền được bảo lưu.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "Giới thiệu PopOut Market",
    footerNavTerms: "Điều khoản sử dụng",
    footerNavPrivacy: "Chính sách quyền riêng tư",
    footerNavChildSafety: "An toàn trẻ em",
    footerNavContact: "Liên hệ",
    footerSocialRednoteAria: "PopOut Market trên Xiaohongshu (RED)",
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
      "Sự an toàn của bạn được đặt lên hàng đầu. Mọi tài khoản PopOut đều được xác minh bằng số điện thoại di động Úc cùng một lần kiểm tra vị trí duy nhất — chỉ để xác nhận khu vực (suburb) của bạn rồi xóa ngay. Việc gặp mặt diễn ra tại địa điểm công cộng do người bán chọn khi đăng tin, và Quy tắc PopOut Market được công bố bằng tám ngôn ngữ, ai cũng đọc được mà không cần tài khoản. Mọi nội dung đều có thể được báo cáo, và tin đăng bị hạn chế có thể khiếu nại.",
    aboutWhyCommunicationTitle: "Kết nối không biên giới",
    aboutWhyCommunicationBody:
      "Ngôn ngữ không nên là rào cản. PopOut có dịch song ngữ thời gian thực mạnh. Trò chuyện bằng tiếng mẹ đẻ — đối phương nhận bản dịch tự động. Dù tiếng Anh chưa hoàn hảo, bạn vẫn có thể giao dịch tự do và kết bạn.",
    aboutPrivacyTitle: "Chúng tôi bảo vệ quyền riêng tư",
    aboutPrivacyLead: "Tại PopOut, quyền riêng tư là quyền cơ bản.",
    aboutPrivacyMinimalTitle: "Thu thập tối thiểu",
    aboutPrivacyMinimalBody:
      "Một tài khoản PopOut chỉ cần số điện thoại di động Úc đã xác minh, khu vực (suburb) đã xác minh và một biệt danh do bạn tự chọn. Tài khoản PopOut không có địa chỉ email, không có mật khẩu và không có tên thật trên giấy tờ.",
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
      "So sánh tốc độ đăng tin, nhắn tin đa ngôn ngữ và cách mỗi ứng dụng xác minh người bạn đang giao dịch cùng.",
    comparisonHubCardFbCta: "Đọc PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "So sánh quy trình đăng tin bằng AI, dịch trò chuyện đa ngôn ngữ và cách xác minh tài khoản.",
    comparisonHubCardGumtreeCta: "Đọc PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree: So sánh trải nghiệm",
    comparisonGumtreeLead:
      "Trang này so sánh những khác biệt trong quy trình thực tế liên quan đến việc đăng tin, giao tiếp đa ngôn ngữ và cách xác minh tài khoản trong các trường hợp mua bán đồ cũ tại Melbourne.",
    comparisonGumtreeDisclaimer:
      "Miễn trừ trách nhiệm: trang này chỉ nhằm giới thiệu cho người dùng và sản phẩm, không phải tư vấn pháp lý. Gumtree và các nhãn hiệu liên quan thuộc về chủ sở hữu tương ứng. Tính năng của bên thứ ba có thể thay đổi theo thời gian.",
    comparisonGumtreeSection1Title: "1) Thiết lập đăng tin có AI hỗ trợ",
    comparisonGumtreeSection1Body:
      "PopOut có thể soạn sẵn tiêu đề, mô tả và danh mục từ ảnh món đồ. Người bán xem lại bản nháp, đặt giá và chọn một điểm hẹn công cộng, rồi đăng tin. Bạn cũng có thể tải ảnh cả căn phòng lên cùng lúc, PopOut sẽ tự tách thành từng tin đăng nháp riêng.",
    comparisonGumtreeSection2Title: "2) Luồng đa ngôn ngữ tích hợp sẵn",
    comparisonGumtreeSection2Body:
      "PopOut hỗ trợ tiếng Anh, tiếng Trung giản thể, tiếng Trung phồn thể, tiếng Hàn, tiếng Nhật, tiếng Pháp, tiếng Tây Ban Nha và tiếng Việt khi đăng tin và nhắn tin, giúp giảm rào cản ngôn ngữ trong một thành phố đa dạng.",
    comparisonGumtreeSection3Title: "3) Hàng xóm đã xác minh, không phải tài khoản ẩn danh",
    comparisonGumtreeSection3Body:
      "Mọi tài khoản PopOut đều được xác minh bằng số điện thoại di động Úc cùng một lần kiểm tra vị trí duy nhất, và được kiểm tra lại mỗi 30 ngày với những người tiếp tục nhắn tin và đăng tin. Lần kiểm tra này chỉ xác nhận khu vực (suburb); dữ liệu GPS không được lưu lại. Quy tắc PopOut Market được công bố bằng tám ngôn ngữ và ai cũng đọc được mà không cần tài khoản.",
    comparisonGumtreeSection4Title: "4) Gặp mặt tại nơi công cộng",
    comparisonGumtreeSection4Body:
      "Bán trên PopOut nghĩa là trao món đồ tận tay hàng xóm. Khi đăng tin, người bán chọn một địa điểm công cộng dễ nhận biết từ danh sách có sẵn, và người mua nhìn thấy điểm hẹn đó ngay trên tin đăng. Không gửi bưu điện, không qua đơn vị vận chuyển.",
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
    comparisonGumtreeFeature3Title: "Xác minh tài khoản",
    comparisonGumtreeFeature3Popout:
      "Số điện thoại di động Úc cùng một lần kiểm tra vị trí duy nhất, kiểm tra lại mỗi 30 ngày",
    comparisonGumtreeFeature3Other:
      "Thường chỉ đăng nhập bằng email hoặc mạng xã hội, không kiểm tra vị trí",
    comparisonGumtreeFeature4Title: "Nơi trao món đồ",
    comparisonGumtreeFeature4Popout:
      "Điểm hẹn công cộng được chọn ngay khi đăng tin và hiển thị cho người mua",
    comparisonGumtreeFeature4Other: "Tự hẹn riêng trong tin nhắn, nếu có hẹn",
    comparisonGumtreeFinalTitle: "Gợi ý lựa chọn",
    comparisonGumtreeFinalBody:
      "Nếu ưu tiên của bạn là tốc độ đăng tin, sự rõ ràng khi giao tiếp đa ngôn ngữ và việc biết chắc người ở đầu bên kia là một hàng xóm đã xác minh, thì PopOut có thể là lựa chọn phù hợp hơn. Hãy tự kiểm chứng các tính năng hiện có dựa trên khu vực và cách sử dụng của riêng bạn.",
    comparisonBackLabel: "Quay lại trang so sánh",
    comparisonGumtreeCard1Title: "Đăng tin nhanh bằng AI",
    comparisonGumtreeCard1Body: "Giảm việc tìm danh mục và nhập lại biểu mẫu",
    comparisonGumtreeCard2Title: "Giao dịch đa ngôn ngữ",
    comparisonGumtreeCard2Body: "Hỗ trợ các luồng giao dịch khác ngôn ngữ chính",
    comparisonGumtreeCard3Title: "Hàng xóm đã xác minh",
    comparisonGumtreeCard3Body: "Số điện thoại di động Úc cùng một lần kiểm tra vị trí duy nhất",
    comparisonFbH1: "PopOut vs Facebook Marketplace: So sánh trải nghiệm",
    comparisonFbLead:
      "Bài viết này so sánh những khác biệt thực tế trong quy trình đăng tin, giao tiếp đa ngôn ngữ và cách xác minh tài khoản. Mục đích là giúp người dùng chọn được một quy trình mua bán phù hợp với nhu cầu hằng ngày.",
    comparisonFbDisclaimer:
      "Miễn trừ trách nhiệm: trang này chỉ nhằm giới thiệu sản phẩm, không phải tư vấn pháp lý hay tuyên bố tiêu cực về bất kỳ nền tảng bên thứ ba nào. Facebook Marketplace và các nhãn hiệu liên quan thuộc về chủ sở hữu tương ứng. Khả năng có tính năng có thể khác nhau tùy khu vực, loại tài khoản và bản cập nhật sản phẩm.",
    comparisonFbSection1Title: "1) Đăng tin bằng AI từ ảnh",
    comparisonFbSection1Body:
      "Trên PopOut, chỉ cần tải ảnh món đồ lên là có ngay bản nháp tiêu đề, mô tả và danh mục. Người bán xem lại, bổ sung thông tin, đặt giá và chọn một điểm hẹn công cộng, rồi đăng tin với ít thao tác thủ công hơn.",
    comparisonFbSection2Title: "2) Giao tiếp đa ngôn ngữ theo thời gian thực",
    comparisonFbSection2Body:
      "PopOut hỗ trợ tiếng Anh, tiếng Trung giản thể, tiếng Trung phồn thể, tiếng Hàn, tiếng Nhật, tiếng Pháp, tiếng Tây Ban Nha và tiếng Việt. Bài đăng và trò chuyện có thể đọc bằng ngôn ngữ ưa thích của từng người dùng.",
    comparisonFbSection3Title: "3) Hàng xóm đã xác minh, không phải tài khoản ẩn danh",
    comparisonFbSection3Body:
      "Mọi tài khoản PopOut đều được xác minh bằng số điện thoại di động Úc cùng một lần kiểm tra vị trí duy nhất, và được kiểm tra lại mỗi 30 ngày với những người tiếp tục nhắn tin và đăng tin. Lần kiểm tra này chỉ xác nhận khu vực (suburb); dữ liệu GPS không được lưu lại. Bạn có thể báo cáo tin đăng và tin nhắn, còn tin đăng bị hạn chế có thể khiếu nại một lần.",
    comparisonFbSection4Title: "4) Gặp mặt tại nơi công cộng",
    comparisonFbSection4Body:
      "Bán trên PopOut nghĩa là trao món đồ tận tay hàng xóm. Khi đăng tin, người bán chọn một địa điểm công cộng dễ nhận biết từ danh sách có sẵn, và người mua nhìn thấy điểm hẹn đó ngay trên tin đăng. Không gửi bưu điện, không qua đơn vị vận chuyển.",
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
    comparisonFbFeature3Title: "Xác minh tài khoản",
    comparisonFbFeature3Popout:
      "Số điện thoại di động Úc cùng một lần kiểm tra vị trí duy nhất, kiểm tra lại mỗi 30 ngày",
    comparisonFbFeature3Other: "Thường dùng sẵn một tài khoản mạng xã hội, không kiểm tra vị trí",
    comparisonFbFeature4Title: "Nơi trao món đồ",
    comparisonFbFeature4Popout:
      "Điểm hẹn công cộng được chọn ngay khi đăng tin và hiển thị cho người mua",
    comparisonFbFeature4Other: "Tự hẹn riêng trong tin nhắn, nếu có hẹn",
    comparisonFbFinalTitle: "Cách sử dụng phần so sánh này",
    comparisonFbFinalBody:
      "Nếu ưu tiên của bạn là đăng tin nhanh hơn, giao tiếp đa ngôn ngữ mượt mà hơn và việc biết chắc người ở đầu bên kia là một hàng xóm đã xác minh, thì quy trình của PopOut có thể phù hợp hơn với bạn. Hãy luôn tự xác minh chi tiết các tính năng hiện có trong bối cảnh sử dụng của riêng bạn.",
    comparisonFbCard1Title: "Trợ lý đăng tin AI",
    comparisonFbCard1Body: "Soạn nháp tiêu đề và mô tả từ ảnh",
    comparisonFbCard2Title: "Dịch trực tiếp",
    comparisonFbCard2Body: "Bài đăng và trò chuyện khác ngôn ngữ mượt mà hơn",
    comparisonFbCard3Title: "Hàng xóm đã xác minh",
    comparisonFbCard3Body: "Số điện thoại di động Úc cùng một lần kiểm tra vị trí duy nhất",
    heroTitle: "Cả khu phố Melbourne của bạn, gói gọn trong một bảng tin",
    heroLead:
      "PopOut Market là ứng dụng khu phố dành cho Melbourne. Mua bán đồ cũ với hàng xóm đã xác minh quanh đây, xem ưu đãi đang có tại các cửa hàng địa phương ngay trên bản đồ, và hỏi hàng xóm bất cứ điều gì — mỗi người cứ viết bằng ngôn ngữ của mình.",
    heroTrustLine:
      "Xác minh bằng số điện thoại di động Úc và một lần kiểm tra vị trí duy nhất. Miễn phí trên iOS và Android. Đã có mặt tại {count} khu vực ở Melbourne.",
    heroGetAppCta: "Tải ứng dụng",
    heroBrowseCta: "Xem đồ cũ gần bạn",
    homeMarketTitle: "Mua bán đồ cũ cùng *hàng xóm quanh đây*",
    homeMarketSubtitle:
      "Mỗi tin đăng đều đến từ một người sống gần bạn, và món đồ được trao tận tay. Lọc theo Cho tặng hoặc Dưới $20, hoặc xem theo danh mục.",
    homeMarketBrowseAll: "Xem tất cả tin đăng",
    homeMarketFilterAll: "Tất cả",
    homeMarketFilterGiveaway: "Cho tặng",
    homeMarketFilterUnder20: "Dưới $20",
    homeBulkListingLine:
      "Tải ảnh cả căn phòng lên một lượt — PopOut tự tách thành từng tin đăng nháp riêng.",
    homeShopsTitle: "Cửa hàng địa phương ngay trên *bản đồ*",
    homeShopsSubtitle:
      "Hàng xóm dạo quanh các cửa hàng gần nhà rồi đăng lại những gì họ thấy, kèm tên sản phẩm và giá ghi ngay trên ảnh, được dịch sang mọi ngôn ngữ mà ứng dụng hỗ trợ. Bản đồ hiện có 16 cửa hàng ở Melbourne CBD và Docklands, trong đó 14 là tiệm tạp hóa châu Á tư nhân.",
    homeShopsCta: "Xem cẩm nang tiệm tạp hóa châu Á ở Melbourne CBD",
    homeCommunityTitle: "Hỏi hàng xóm *bất cứ điều gì*",
    homeCommunitySubtitle:
      "Tab Cộng đồng là nơi đời sống khu phố diễn ra: ưu đãi địa phương, câu hỏi về khu bạn ở, gợi ý hay ho và cả những người đang cần mua. Bạn viết bằng ngôn ngữ của mình, họ đọc bằng ngôn ngữ của họ.",
    homeCommunityTopics:
      "Ưu đãi địa phương · Hỏi đáp & Tin tức · Đời sống khu phố · Cần mua · Khác",
    homeTrustTitle: "Hàng xóm thật, *không phải tài khoản ẩn danh*",
    homeTrustSubtitle:
      "Mọi tài khoản đều được xác minh bằng số điện thoại di động Úc và một lần kiểm tra vị trí duy nhất — chỉ để xác nhận khu vực (suburb) của bạn rồi xóa ngay, và được kiểm tra lại mỗi 30 ngày. Quy tắc PopOut Market được công bố bằng tám ngôn ngữ, ai cũng đọc được mà không cần tài khoản; mọi nội dung đều có thể được báo cáo, hạn chế và khiếu nại.",
    homeCoverageTitle: "Đã có mặt tại *{count} khu vực ở Melbourne*",
    homeCoverageCta: "Xem tất cả khu vực ở Melbourne",
    notFoundTitle: "Không tìm thấy trang",
    notFoundDescription: "Trang bạn yêu cầu không tồn tại hoặc không được công khai.",
  },
  fr: {
    topDownload: "Télécharger",
    topLanguage: "Langue",
    languageModalTitle: "Choisissez votre langue",
    languageModalHint: "PopOut soutient les communautés locales en plusieurs langues.",
    downloadLine: "Téléchargez l'application PopOut Market pour iOS et Android",
    slogan: "achetez et vendez entre voisins, près de chez vous",
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
    marketPostListingRef: "Réf.",
    marketPostFixedPriceLabel: "Prix fixe",
    marketPostDetailLoadingAria: "Chargement de l’annonce",
    marketPostDescriptionHeading: "Description",
    marketPostPreferredMeetupLabel: "Point de remise préféré",
    marketPostOtherItemsHeading: "Autres annonces du vendeur",
    marketYes: "Oui",
    marketNo: "Non",
    marketUnknown: "Inconnu",
    translationDemoTitle: "Dites-le une fois. *Tout le monde* comprend",
    translationDemoSubtitle:
      "Envoyez dans votre langue, l'autre reçoit dans la sienne — traduction instantanée.",
    aiPostDemoTitle: "Prenez une photo. L'IA fait le *reste*",
    aiPostDemoSubtitle:
      "Photographiez l'objet et l'IA génère titre, catégorie et description — vous n'avez qu'à fixer le prix.",
    aiPostDemoPrice: "Prix",
    aiPostDemoYouFill: "À vous",
    footerLegalNavAria: "Politiques et contact",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. Tous droits réservés.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "À propos de PopOut Market",
    footerNavTerms: "Conditions d’utilisation",
    footerNavPrivacy: "Politique de confidentialité",
    footerNavChildSafety: "Sécurité des enfants",
    footerNavContact: "Nous contacter",
    footerSocialRednoteAria: "PopOut Market sur Xiaohongshu (RED)",
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
      "Votre sécurité passe avant tout. Chaque compte PopOut est vérifié par un numéro de mobile australien et un contrôle de localisation ponctuel : il confirme votre quartier, puis la position est supprimée. Les remises se font dans un lieu public choisi par le vendeur au moment de la publication, et les Règles de PopOut Market sont publiées en huit langues et consultables sans compte. Tout peut être signalé, et une annonce restreinte peut faire l’objet d’un recours.",
    aboutWhyCommunicationTitle: "Communiquer sans frontières",
    aboutWhyCommunicationBody:
      "La langue ne doit pas être un obstacle. PopOut propose une traduction bilingue en temps réel. Écrivez dans votre langue — l’autre reçoit une traduction automatique. Même si votre anglais n’est pas parfait, vous pouvez échanger et vous faire des amis.",
    aboutPrivacyTitle: "Nous protégeons votre vie privée",
    aboutPrivacyLead: "Chez PopOut, la confidentialité est un droit fondamental.",
    aboutPrivacyMinimalTitle: "Collecte minimale",
    aboutPrivacyMinimalBody:
      "Un compte PopOut demande un numéro de mobile australien vérifié, un quartier vérifié et un pseudo que vous choisissez. Aucune adresse e-mail, aucun mot de passe et aucun nom légal ne figurent sur un compte PopOut.",
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
      "Comparez la rapidité de publication, la messagerie multilingue et la façon dont chaque appli vérifie la personne avec qui vous échangez.",
    comparisonHubCardFbCta: "Lire PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "Comparez la création d'annonces par IA, la traduction des conversations en plusieurs langues et la vérification des comptes.",
    comparisonHubCardGumtreeCta: "Lire PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree : comparaison de l'expérience",
    comparisonGumtreeLead:
      "Cette page compare les différences concrètes de flux de travail concernant la création d'annonces, la communication multilingue et la vérification des comptes, dans des cas d'usage de seconde main à Melbourne.",
    comparisonGumtreeDisclaimer:
      "Avertissement : cette page sert uniquement à informer les utilisateurs et à présenter le produit. Il ne s'agit pas d'un conseil juridique. Gumtree et les marques associées appartiennent à leurs propriétaires respectifs. Les fonctionnalités tierces peuvent évoluer.",
    comparisonGumtreeSection1Title: "1) Mise en ligne assistée par IA",
    comparisonGumtreeSection1Body:
      "PopOut peut rédiger un titre, une description et une catégorie à partir des photos de l'article. Le vendeur relit le brouillon, fixe le prix et choisit un lieu de rencontre public, puis publie. Vous pouvez aussi ajouter d'un coup les photos de toute une pièce : PopOut les répartit en brouillons d'annonces distincts.",
    comparisonGumtreeSection2Title: "2) Parcours multilingue intégré",
    comparisonGumtreeSection2Body:
      "PopOut prend en charge l'anglais, le chinois simplifié, le chinois traditionnel, le coréen, le japonais, le français, l'espagnol et le vietnamien pour la publication et la messagerie, réduisant les frictions linguistiques dans une ville diverse.",
    comparisonGumtreeSection3Title: "3) Des voisins vérifiés, pas des comptes anonymes",
    comparisonGumtreeSection3Body:
      "Chaque compte PopOut est vérifié par un numéro de mobile australien et un contrôle de localisation ponctuel, renouvelé tous les 30 jours pour celles et ceux qui continuent à discuter et à publier. Ce contrôle confirme uniquement le quartier ; aucune donnée GPS n'est conservée. Les Règles de PopOut Market sont publiées en huit langues et consultables sans compte.",
    comparisonGumtreeSection4Title: "4) Une remise en main propre, dans un lieu public",
    comparisonGumtreeSection4Body:
      "Vendre sur PopOut, c'est remettre l'article à un voisin en main propre. Au moment de publier, le vendeur choisit dans une liste un lieu public facile à repérer, et l'acheteur le voit sur l'annonce. Ni envoi postal, ni coursier.",
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
    comparisonGumtreeFeature3Title: "Vérification du compte",
    comparisonGumtreeFeature3Popout:
      "Numéro de mobile australien et contrôle de localisation ponctuel, renouvelé tous les 30 jours",
    comparisonGumtreeFeature3Other:
      "En général, une inscription par e-mail ou via un réseau social, sans contrôle de localisation",
    comparisonGumtreeFeature4Title: "Lieu de la remise",
    comparisonGumtreeFeature4Popout:
      "Un lieu de rencontre public est choisi à la création de l'annonce et affiché à l'acheteur",
    comparisonGumtreeFeature4Other: "À convenir en privé dans la conversation, voire pas du tout",
    comparisonGumtreeFinalTitle: "Recommandation",
    comparisonGumtreeFinalBody:
      "Si vos priorités sont la rapidité de publication, la clarté multilingue et la certitude que la personne en face est un voisin vérifié, PopOut peut être le meilleur choix. Vérifiez les fonctionnalités actuelles en fonction de votre propre région et de votre usage.",
    comparisonBackLabel: "Retour aux comparaisons",
    comparisonGumtreeCard1Title: "Publication rapide par IA",
    comparisonGumtreeCard1Body: "Moins de recherche de catégorie et de saisie répétée",
    comparisonGumtreeCard2Title: "Transactions multilingues",
    comparisonGumtreeCard2Body:
      "Prend en charge les principaux parcours de transaction multilingues",
    comparisonGumtreeCard3Title: "Voisins vérifiés",
    comparisonGumtreeCard3Body: "Numéro de mobile australien et contrôle de localisation ponctuel",
    comparisonFbH1: "PopOut vs Facebook Marketplace : comparaison de l'expérience",
    comparisonFbLead:
      "Cet article compare les différences pratiques de flux de travail dans la création d'annonces, la communication multilingue et la vérification des comptes. L'objectif est d'aider les utilisateurs à choisir un flux de marketplace adapté à leurs besoins quotidiens.",
    comparisonFbDisclaimer:
      "Avertissement : cette page sert uniquement à présenter le produit, et non un conseil juridique ni une déclaration négative sur une plateforme tierce. Facebook Marketplace et les marques associées appartiennent à leurs propriétaires respectifs. La disponibilité des fonctionnalités peut varier selon la région, le type de compte et les mises à jour du produit.",
    comparisonFbSection1Title: "1) Mise en ligne assistée par IA à partir de photos",
    comparisonFbSection1Body:
      "Sur PopOut, le téléchargement des photos de l'article peut générer un brouillon de titre, de description et de catégorie. Le vendeur relit, complète, fixe le prix et choisit un lieu de rencontre public, puis publie avec moins d'étapes manuelles.",
    comparisonFbSection2Title: "2) Communication multilingue en temps réel",
    comparisonFbSection2Body:
      "PopOut prend en charge l'anglais, le chinois simplifié, le chinois traditionnel, le coréen, le japonais, le français, l'espagnol et le vietnamien. Les annonces et les conversations peuvent être lues dans la langue préférée de chaque utilisateur.",
    comparisonFbSection3Title: "3) Des voisins vérifiés, pas des comptes anonymes",
    comparisonFbSection3Body:
      "Chaque compte PopOut est vérifié par un numéro de mobile australien et un contrôle de localisation ponctuel, renouvelé tous les 30 jours pour celles et ceux qui continuent à discuter et à publier. Ce contrôle confirme uniquement le quartier ; aucune donnée GPS n'est conservée. Les annonces et les messages peuvent être signalés, et une annonce restreinte peut faire l'objet d'un recours, une seule fois.",
    comparisonFbSection4Title: "4) Une remise en main propre, dans un lieu public",
    comparisonFbSection4Body:
      "Vendre sur PopOut, c'est remettre l'article à un voisin en main propre. Au moment de publier, le vendeur choisit dans une liste un lieu public facile à repérer, et l'acheteur le voit sur l'annonce. Ni envoi postal, ni coursier.",
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
    comparisonFbFeature3Title: "Vérification du compte",
    comparisonFbFeature3Popout:
      "Numéro de mobile australien et contrôle de localisation ponctuel, renouvelé tous les 30 jours",
    comparisonFbFeature3Other:
      "En général, un compte de réseau social existant, sans contrôle de localisation",
    comparisonFbFeature4Title: "Lieu de la remise",
    comparisonFbFeature4Popout:
      "Un lieu de rencontre public est choisi à la création de l'annonce et affiché à l'acheteur",
    comparisonFbFeature4Other: "À convenir en privé dans la conversation, voire pas du tout",
    comparisonFbFinalTitle: "Comment utiliser cette comparaison",
    comparisonFbFinalBody:
      "Si vos priorités sont une publication plus rapide, une communication multilingue plus fluide et la certitude que la personne en face est un voisin vérifié, le flux de travail de PopOut peut mieux vous convenir. Vérifiez toujours les détails actuels des fonctionnalités dans votre propre contexte d'utilisation.",
    comparisonFbCard1Title: "Assistant d'annonce IA",
    comparisonFbCard1Body: "Brouillon de titre et de description à partir des photos",
    comparisonFbCard2Title: "Traduction en direct",
    comparisonFbCard2Body: "Annonces et conversations entre langues plus fluides",
    comparisonFbCard3Title: "Voisins vérifiés",
    comparisonFbCard3Body: "Numéro de mobile australien et contrôle de localisation ponctuel",
    heroTitle: "Tout ce qui se passe dans votre quartier de Melbourne, dans un seul fil",
    heroLead:
      "PopOut Market, c'est l'appli de quartier de Melbourne. Achetez et vendez d'occasion avec des voisins vérifiés près de chez vous, repérez sur la carte les promos du moment dans les commerces du coin, et posez toutes vos questions à vos voisins — chacun écrivant dans sa propre langue.",
    heroTrustLine:
      "Vérification par numéro de mobile australien et contrôle de localisation ponctuel. Gratuit sur iOS et Android. Disponible dans {count} quartiers de Melbourne.",
    heroGetAppCta: "Télécharger l'appli",
    heroBrowseCta: "Voir les articles d'occasion près de chez vous",
    homeMarketTitle: "Achetez et vendez d'occasion *entre voisins*",
    homeMarketSubtitle:
      "Chaque annonce vient de quelqu'un qui habite près de chez vous, et la remise se fait en main propre. Filtrez par « À donner » ou « Moins de 20 $ », ou parcourez par catégorie.",
    homeMarketBrowseAll: "Voir toutes les annonces",
    homeMarketFilterAll: "Tout",
    homeMarketFilterGiveaway: "À donner",
    homeMarketFilterUnder20: "Moins de 20 $",
    homeBulkListingLine:
      "Ajoutez d'un coup les photos de toute une pièce — PopOut les répartit en brouillons distincts.",
    homeShopsTitle: "Les commerces du quartier, sur la *carte*",
    homeShopsSubtitle:
      "Des voisins font le tour des commerces du coin et publient leurs trouvailles : le nom du produit et son prix sont inscrits sur la photo et traduits dans toutes les langues de l'appli. La carte couvre 16 commerces du CBD de Melbourne et de Docklands, dont 14 épiceries asiatiques indépendantes.",
    homeShopsCta: "Voir le guide des épiceries asiatiques du CBD de Melbourne",
    homeCommunityTitle: "Demandez *tout ce que vous voulez* à vos voisins",
    homeCommunitySubtitle:
      "L'onglet Communauté, c'est là que se passe la vie du quartier : bons plans, questions sur votre secteur, recommandations et objets recherchés. Écrivez dans votre langue, chacun vous lit dans la sienne.",
    homeCommunityTopics: "Bons plans · Questions & actus · Vie du quartier · Je recherche · Autre",
    homeTrustTitle: "De vrais voisins, *pas des comptes anonymes*",
    homeTrustSubtitle:
      "Chaque compte est vérifié par un numéro de mobile australien et un contrôle de localisation ponctuel : il confirme votre quartier, puis la position est supprimée ; le contrôle est renouvelé tous les 30 jours. Les Règles de PopOut Market sont publiées en huit langues et consultables sans compte, et tout peut être signalé, restreint, puis contesté.",
    homeCoverageTitle: "Déjà présent dans *{count} quartiers de Melbourne*",
    homeCoverageCta: "Voir tous les quartiers de Melbourne",
    notFoundTitle: "Page introuvable",
    notFoundDescription: "La page demandée n’existe pas ou n’est pas accessible publiquement.",
  },
  es: {
    topDownload: "Descargar",
    topLanguage: "Idioma",
    languageModalTitle: "Elige tu idioma",
    languageModalHint: "PopOut conecta comunidades locales en varios idiomas.",
    downloadLine: "Descarga la app PopOut Market para iOS y Android",
    slogan: "compra y vende con vecinos cerca de ti",
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
    marketPostListingRef: "Ref.",
    marketPostFixedPriceLabel: "Precio fijo",
    marketPostDetailLoadingAria: "Cargando anuncio",
    marketPostDescriptionHeading: "Descripción",
    marketPostPreferredMeetupLabel: "Punto de encuentro preferido",
    marketPostOtherItemsHeading: "Otros anuncios de este vendedor",
    marketYes: "Sí",
    marketNo: "No",
    marketUnknown: "Desconocido",
    translationDemoTitle: "Dilo una vez. *Todos* entienden",
    translationDemoSubtitle:
      "Envía en tu idioma, el otro lo recibe en el suyo — traducción instantánea.",
    aiPostDemoTitle: "Haz una foto. La IA hace el *resto*",
    aiPostDemoSubtitle:
      "Toma una foto y la IA genera título, categoría y descripción — tú solo pones el precio.",
    aiPostDemoPrice: "Precio",
    aiPostDemoYouFill: "Tú rellenas",
    footerLegalNavAria: "Políticas y contacto",
    footerCopyright: "Copyright © 2026 PopOut Market Pty Ltd. Todos los derechos reservados.",
    footerAcn: "ACN 696 464 945",
    footerNavAbout: "Acerca de PopOut Market",
    footerNavTerms: "Términos de uso",
    footerNavPrivacy: "Política de privacidad",
    footerNavChildSafety: "Seguridad infantil",
    footerNavContact: "Contáctanos",
    footerSocialRednoteAria: "PopOut Market en Xiaohongshu (RED)",
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
      "Tu seguridad es lo primero. Cada cuenta de PopOut se verifica con un número de móvil australiano y una única comprobación de ubicación que confirma tu barrio y después se descarta. Los encuentros se hacen en lugares públicos que elige el vendedor al publicar, y las Normas de PopOut Market están publicadas en ocho idiomas y se pueden leer sin tener cuenta. Todo se puede denunciar, y un anuncio restringido se puede apelar.",
    aboutWhyCommunicationTitle: "Comunicación sin fronteras",
    aboutWhyCommunicationBody:
      "El idioma no debe ser una barrera. PopOut ofrece traducción bilingüe en tiempo real. Escribe en tu lengua — la otra persona recibe traducción automática. Aunque tu inglés no sea perfecto, puedes comerciar con libertad y hacer amigos.",
    aboutPrivacyTitle: "Protegemos tu privacidad",
    aboutPrivacyLead: "En PopOut, la privacidad es un derecho fundamental.",
    aboutPrivacyMinimalTitle: "Recopilación mínima",
    aboutPrivacyMinimalBody:
      "Una cuenta de PopOut necesita un número de móvil australiano verificado, un barrio verificado y un apodo que eliges tú. En una cuenta de PopOut no hay dirección de correo, ni contraseña, ni nombre legal.",
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
      "Compara la rapidez para publicar, la mensajería multilingüe y cómo verifica cada app a la persona con la que intercambias.",
    comparisonHubCardFbCta: "Leer PopOut vs Facebook Marketplace",
    comparisonHubCardGumtreeBody:
      "Compara la creación de anuncios con IA, la traducción del chat multilingüe y la verificación de cuentas.",
    comparisonHubCardGumtreeCta: "Leer PopOut vs Gumtree",
    comparisonGumtreeH1: "PopOut vs Gumtree: comparación de la experiencia",
    comparisonGumtreeLead:
      "Esta página compara las diferencias reales de flujo de trabajo en la creación de anuncios, la comunicación multilingüe y la verificación de cuentas en casos de uso de segunda mano en Melbourne.",
    comparisonGumtreeDisclaimer:
      "Aviso: esta página tiene fines únicamente informativos para el usuario y el producto. No constituye asesoramiento legal. Gumtree y las marcas relacionadas pertenecen a sus respectivos propietarios. Las funciones de terceros pueden cambiar con el tiempo.",
    comparisonGumtreeSection1Title: "1) Creación de anuncios asistida por IA",
    comparisonGumtreeSection1Body:
      "PopOut puede redactar un título, una descripción y una categoría a partir de las fotos del artículo. El vendedor revisa el borrador, pone el precio y elige un punto de encuentro público, y publica. Se pueden añadir de una vez las fotos de una habitación entera y PopOut las separa en borradores de anuncios distintos.",
    comparisonGumtreeSection2Title: "2) Flujo multilingüe integrado",
    comparisonGumtreeSection2Body:
      "PopOut admite inglés, chino simplificado, chino tradicional, coreano, japonés, francés, español y vietnamita al publicar y mensajear, reduciendo las barreras de idioma en una ciudad diversa.",
    comparisonGumtreeSection3Title: "3) Vecinos verificados, no cuentas anónimas",
    comparisonGumtreeSection3Body:
      "Cada cuenta de PopOut se verifica con un número de móvil australiano y una única comprobación de ubicación, que se repite cada 30 días para quienes siguen chateando y publicando. La comprobación solo confirma el barrio; el GPS no se guarda. Las Normas de PopOut Market están publicadas en ocho idiomas y se pueden leer sin tener cuenta.",
    comparisonGumtreeSection4Title: "4) El encuentro, siempre en un lugar público",
    comparisonGumtreeSection4Body:
      "Vender en PopOut significa entregar el artículo a un vecino en persona. Al publicar, el vendedor elige de una lista un lugar público reconocible, y el comprador ve ese punto en el anuncio. No hay envío postal ni mensajería.",
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
    comparisonGumtreeFeature3Title: "Verificación de la cuenta",
    comparisonGumtreeFeature3Popout:
      "Número de móvil australiano y una única comprobación de ubicación, que se repite cada 30 días",
    comparisonGumtreeFeature3Other:
      "Normalmente un correo o un inicio de sesión con redes sociales, sin comprobación de ubicación",
    comparisonGumtreeFeature4Title: "Dónde se hace la entrega",
    comparisonGumtreeFeature4Popout:
      "Se elige un punto de encuentro público al crear el anuncio y el comprador lo ve",
    comparisonGumtreeFeature4Other: "Se acuerda por privado en el chat, si es que se acuerda",
    comparisonGumtreeFinalTitle: "Recomendación",
    comparisonGumtreeFinalBody:
      "Si tus prioridades son la rapidez al publicar, la claridad multilingüe y saber que al otro lado hay un vecino verificado, PopOut puede ser la mejor opción. Comprueba las funciones disponibles actualmente según tu región y tu forma de uso.",
    comparisonBackLabel: "Volver a las comparaciones",
    comparisonGumtreeCard1Title: "Publicación rápida con IA",
    comparisonGumtreeCard1Body: "Menos búsqueda de categorías y repetición de formularios",
    comparisonGumtreeCard2Title: "Comercio multilingüe",
    comparisonGumtreeCard2Body: "Admite los principales flujos de transacción entre idiomas",
    comparisonGumtreeCard3Title: "Vecinos verificados",
    comparisonGumtreeCard3Body: "Número de móvil australiano y una única comprobación de ubicación",
    comparisonFbH1: "PopOut vs Facebook Marketplace: comparación de la experiencia",
    comparisonFbLead:
      "Este artículo compara las diferencias prácticas de flujo de trabajo en la creación de anuncios, la comunicación multilingüe y la verificación de cuentas. La intención es ayudar a los usuarios a elegir un marketplace cuyo flujo de trabajo se adapte a sus necesidades cotidianas.",
    comparisonFbDisclaimer:
      "Aviso: esta página tiene fines únicamente informativos sobre el producto, no constituye asesoramiento legal ni una declaración negativa sobre ninguna plataforma de terceros. Facebook Marketplace y las marcas relacionadas pertenecen a sus respectivos propietarios. La disponibilidad de funciones puede variar según la región, el tipo de cuenta y las actualizaciones del producto.",
    comparisonFbSection1Title: "1) Creación de anuncios con IA a partir de fotos",
    comparisonFbSection1Body:
      "En PopOut, subir las fotos del artículo puede generar un borrador de título, descripción y categoría. El vendedor revisa, añade contexto, pone el precio y elige un punto de encuentro público, y publica con menos pasos manuales.",
    comparisonFbSection2Title: "2) Comunicación multilingüe en tiempo real",
    comparisonFbSection2Body:
      "PopOut admite inglés, chino simplificado, chino tradicional, coreano, japonés, francés, español y vietnamita. Las publicaciones y los chats pueden leerse en el idioma preferido de cada usuario.",
    comparisonFbSection3Title: "3) Vecinos verificados, no cuentas anónimas",
    comparisonFbSection3Body:
      "Cada cuenta de PopOut se verifica con un número de móvil australiano y una única comprobación de ubicación, que se repite cada 30 días para quienes siguen chateando y publicando. La comprobación solo confirma el barrio; el GPS no se guarda. Los anuncios y los mensajes se pueden denunciar, y un anuncio restringido se puede apelar una vez.",
    comparisonFbSection4Title: "4) El encuentro, siempre en un lugar público",
    comparisonFbSection4Body:
      "Vender en PopOut significa entregar el artículo a un vecino en persona. Al publicar, el vendedor elige de una lista un lugar público reconocible, y el comprador ve ese punto en el anuncio. No hay envío postal ni mensajería.",
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
    comparisonFbFeature3Title: "Verificación de la cuenta",
    comparisonFbFeature3Popout:
      "Número de móvil australiano y una única comprobación de ubicación, que se repite cada 30 días",
    comparisonFbFeature3Other:
      "Normalmente una cuenta de redes sociales ya existente, sin comprobación de ubicación",
    comparisonFbFeature4Title: "Dónde se hace la entrega",
    comparisonFbFeature4Popout:
      "Se elige un punto de encuentro público al crear el anuncio y el comprador lo ve",
    comparisonFbFeature4Other: "Se acuerda por privado en el chat, si es que se acuerda",
    comparisonFbFinalTitle: "Cómo usar esta comparación",
    comparisonFbFinalBody:
      "Si tus prioridades son publicar más rápido, una comunicación multilingüe más fluida y saber que al otro lado hay un vecino verificado, el flujo de trabajo de PopOut puede encajar mejor. Comprueba siempre los detalles actuales de las funciones según tu propio contexto de uso.",
    comparisonFbCard1Title: "Asistente de anuncios con IA",
    comparisonFbCard1Body: "Borrador de título y descripción a partir de fotos",
    comparisonFbCard2Title: "Traducción en vivo",
    comparisonFbCard2Body: "Publicaciones y chats entre idiomas más fluidos",
    comparisonFbCard3Title: "Vecinos verificados",
    comparisonFbCard3Body: "Número de móvil australiano y una única comprobación de ubicación",
    heroTitle: "Todo lo que pasa en tu barrio de Melbourne, en un solo feed",
    heroLead:
      "PopOut Market es la app de barrio de Melbourne. Compra y vende de segunda mano con vecinos verificados cerca de ti, mira en el mapa las ofertas del momento en las tiendas del barrio y pregunta a tus vecinos lo que quieras — cada uno escribiendo en su propio idioma.",
    heroTrustLine:
      "Verificación con número de móvil australiano y una única comprobación de ubicación. Gratis en iOS y Android. Ya disponible en {count} barrios de Melbourne.",
    heroGetAppCta: "Descargar la app",
    heroBrowseCta: "Ver artículos de segunda mano cerca de ti",
    homeMarketTitle: "Compra y vende de segunda mano con *vecinos cerca de ti*",
    homeMarketSubtitle:
      "Cada anuncio es de alguien que vive cerca y la entrega es siempre en persona. Filtra por Regalo o Menos de $20, o explora por categoría.",
    homeMarketBrowseAll: "Ver todos los anuncios",
    homeMarketFilterAll: "Todos",
    homeMarketFilterGiveaway: "Regalo",
    homeMarketFilterUnder20: "Menos de $20",
    homeBulkListingLine:
      "Añade de una vez las fotos de toda una habitación — PopOut las separa en borradores distintos.",
    homeShopsTitle: "Las tiendas del barrio, en el *mapa*",
    homeShopsSubtitle:
      "Los vecinos recorren las tiendas cercanas y publican lo que encuentran, con el nombre del producto y el precio escritos sobre la foto y traducidos a todos los idiomas de la app. El mapa cubre 16 tiendas del CBD de Melbourne y Docklands, 14 de ellas supermercados asiáticos independientes.",
    homeShopsCta: "Ver la guía de supermercados asiáticos del CBD de Melbourne",
    homeCommunityTitle: "Pregunta a tus vecinos *lo que quieras*",
    homeCommunitySubtitle:
      "La pestaña Comunidad es donde ocurre la vida del barrio: ofertas locales, preguntas sobre tu zona, recomendaciones y gente que busca comprar. Tú escribes en tu idioma y ellos lo leen en el suyo.",
    homeCommunityTopics:
      "Ofertas locales · Preguntas y noticias · Vida local · Busco comprar · Otros",
    homeTrustTitle: "Vecinos de verdad, *no cuentas anónimas*",
    homeTrustSubtitle:
      "Cada cuenta se verifica con un número de móvil australiano y una única comprobación de ubicación que confirma tu barrio y después se descarta, y se repite cada 30 días. Las Normas de PopOut Market están publicadas en ocho idiomas y se pueden leer sin tener cuenta; todo se puede denunciar, restringir y apelar.",
    homeCoverageTitle: "Ya disponible en *{count} barrios de Melbourne*",
    homeCoverageCta: "Ver todos los barrios de Melbourne",
    notFoundTitle: "Página no encontrada",
    notFoundDescription: "La página que solicitaste no existe o no es de acceso público.",
  },
};
