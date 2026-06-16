import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedAlternates, siteUrl, OG_IMAGE } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/melbourne-cbd-second-hand-marketplace";
const ABOUT_NAME = "Melbourne CBD, Victoria, Australia";

type Section = { heading: string; paragraphs?: string[]; list?: string[] };
type PageContent = {
  title: string;
  description: string;
  h1: string;
  inLanguage: string;
  sections: Section[];
  faq: { q: string; a: string }[];
  faqHeading: string;
  relatedHeading: string;
  related: { href: string; label: string }[];
};

const CONTENT: Partial<Record<Locale, PageContent>> & { en: PageContent } = {
  es: {
    title:
      "Mercado de segunda mano en Melbourne CBD | PopOut Market, la app de compraventa local más segura",
    description:
      "PopOut Market es un mercado de segunda mano gratis en Melbourne, ideal para residentes, estudiantes e inquilinos del CBD. Compra y vende artículos usados cerca de ti, en toda Melbourne.",
    h1: "Mercado de segunda mano en Melbourne CBD",
    inLanguage: "es",
    sections: [
      {
        heading: "Qué busca de verdad la gente del centro",
        paragraphs: [
          "Las búsquedas de segunda mano en el CBD de Melbourne casi siempre son prácticas: amueblar un estudio rápido, reemplazar lo básico del día a día, vender cosas antes de una mudanza o comparar opciones cercanas sin desplazarse lejos. Quien vive en el centro quiere recoger cerca, recibir respuestas rápidas y ver anuncios fáciles de evaluar por las fotos y la descripción.",
          "PopOut Market es gratis y gira en torno al descubrimiento por barrio (suburb): cuanto más cerca esté un anuncio de tu día a día, más fácil resulta comprar y vender de segunda mano en Melbourne. El CBD es la zona más activa, pero PopOut funciona en toda Melbourne, no solo en el centro.",
        ],
      },
      {
        heading: "Por qué el CBD es una zona fuerte de segunda mano",
        paragraphs: [
          "El CBD de Melbourne combina una gran densidad de apartamentos, mucho movimiento universitario y ciclos rápidos de entrada y salida de inquilinos. Eso genera una demanda constante de muebles de segunda mano, electrodomésticos pequeños y artículos del hogar que puedes recoger muy cerca.",
        ],
        list: [
          "Mercado de segunda mano del centro de Melbourne y anuncios del CBD",
          "Muebles de segunda mano y básicos para estrenar apartamento en el CBD",
          "Recogidas cercanas en Carlton, Southbank, Docklands y North Melbourne",
          "Compraventa en el centro que se extiende a todos los barrios de Melbourne",
        ],
      },
      {
        heading: "Compra y vende con seguridad y chatea en tu idioma",
        paragraphs: [
          "PopOut Market incluye un chat multilingüe con traducción dentro de la app, así que puedes acordar el precio, el estado y la hora de recogida en el idioma con el que te sientas más cómodo, con una respuesta automática por IA que facilita el primer contacto. Un proceso de encuentro en persona más seguro ayuda a que compradores y vendedores queden en puntos concurridos y bien iluminados.",
          "Muy popular entre estudiantes internacionales, inquilinos y quienes cambian de apartamento, PopOut mantiene sencilla la compraventa de artículos usados en el centro y en toda Melbourne.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Dónde comprar muebles de segunda mano en el CBD de Melbourne?",
        a: "En PopOut Market puedes ver muebles de segunda mano y artículos usados en el CBD de Melbourne publicados por gente cercana y luego acordar una recogida cómoda en el centro. Como el descubrimiento es por barrio, también ves opciones en el resto de Melbourne.",
      },
      {
        q: "¿Hay una app de segunda mano gratis para Melbourne?",
        a: "Sí. PopOut Market es una app gratis para comprar y vender de segunda mano en el CBD de Melbourne y en todos los demás barrios de la ciudad, sin comisiones por publicar anuncios.",
      },
      {
        q: "¿Cómo vendo mis cosas antes de mudarme de un apartamento del CBD?",
        a: "Publica tus artículos en PopOut Market con fotos claras y una hora de recogida realista. Los apartamentos del CBD cambian de inquilino con frecuencia, así que los electrodomésticos de segunda mano y los artículos prácticos del hogar suelen venderse rápido a compradores cercanos.",
      },
      {
        q: "¿El mercado de segunda mano del CBD de Melbourne funciona fuera del centro?",
        a: "Por supuesto. PopOut Market funciona en toda Melbourne. Las búsquedas del CBD suelen solaparse con Carlton, Southbank, Docklands y North Melbourne, y puedes comprar y vender en cualquier barrio.",
      },
      {
        q: "¿Dónde pueden los estudiantes comprar y vender de segunda mano en Melbourne?",
        a: "PopOut Market ofrece un chat multilingüe con traducción, muy útil para estudiantes internacionales y recién llegados. Puedes hablar con los vendedores en tu idioma y comprar o revender artículos usados con facilidad, tanto en el centro como en toda Melbourne.",
      },
    ],
    faqHeading: "Preguntas frecuentes",
    relatedHeading: "Páginas relacionadas",
    related: [
      { href: "/market", label: "Explorar el mercado de segunda mano" },
      { href: "/melbourne-second-hand-marketplace", label: "Mercado de segunda mano en Melbourne" },
      { href: "/melbourne-suburbs/melbourne-cbd", label: "Melbourne CBD" },
    ],
  },
  fr: {
    title:
      "Marché d'occasion Melbourne CBD | PopOut Market - Appli d'occasion Melbourne et transactions locales sûres",
    description:
      "PopOut Market est un marché d'occasion gratuit à Melbourne CBD pour résidents, étudiants et locataires. Achetez et vendez d'occasion près de chez vous, partout à Melbourne.",
    h1: "Marché d'occasion Melbourne CBD",
    inLanguage: "fr",
    sections: [
      {
        heading: "Ce que recherchent vraiment les habitants du centre-ville",
        paragraphs: [
          "Les recherches d'articles d'occasion à Melbourne CBD sont presque toujours très concrètes : meubler un studio rapidement, remplacer des essentiels du quotidien, vendre ses affaires avant un déménagement ou comparer les offres proches sans avoir à se déplacer loin. Les habitants du centre veulent un retrait à proximité, des réponses rapides et des annonces faciles à évaluer grâce aux photos et aux descriptions.",
          "PopOut Market est gratuit et conçu autour d'une découverte par quartier : plus une annonce est proche de vos trajets quotidiens, plus l'achat et la vente d'occasion à Melbourne se déroulent simplement. Le CBD est le secteur le plus animé, mais PopOut fonctionne dans tout Melbourne, et pas seulement au centre-ville.",
        ],
      },
      {
        heading: "Pourquoi le CBD est un secteur fort pour la seconde main",
        paragraphs: [
          "Melbourne CBD réunit une forte densité d'appartements, un public étudiant nombreux et des cycles rapides d'emménagement et de départ. Cela crée une demande constante de meubles d'occasion, de petit électroménager d'occasion et d'articles du quotidien que l'on peut récupérer tout près.",
        ],
        list: [
          "Marché d'occasion du centre de Melbourne et petites annonces du CBD",
          "Meubles d'occasion et essentiels pour emménager en appartement au CBD",
          "Retraits à proximité à Carlton, Southbank, Docklands et North Melbourne",
          "Des échanges en centre-ville qui s'étendent à tous les quartiers de Melbourne",
        ],
      },
      {
        heading: "Échangez en toute sécurité et discutez dans votre langue",
        paragraphs: [
          "PopOut Market intègre une messagerie multilingue avec traduction directement dans l'appli : vous pouvez convenir du prix, de l'état et de l'heure de retrait dans la langue qui vous convient le mieux, avec une réponse automatique par IA pour faciliter le premier contact. Un parcours de rencontre en personne plus sûr aide acheteurs et vendeurs à se retrouver dans des lieux fréquentés et bien éclairés du CBD.",
          "Plébiscité par les étudiants internationaux, les locataires et les personnes qui changent d'appartement, PopOut simplifie les transactions au centre-ville tout en couvrant l'ensemble de Melbourne.",
        ],
      },
    ],
    faq: [
      {
        q: "Où acheter des meubles d'occasion à Melbourne CBD ?",
        a: "Sur PopOut Market, vous pouvez parcourir les meubles d'occasion et les essentiels de seconde main à Melbourne CBD publiés par des personnes proches de vous, puis convenir d'un retrait pratique en centre-ville. Comme la découverte se fait par quartier, vous voyez aussi des offres partout ailleurs à Melbourne.",
      },
      {
        q: "Existe-t-il une appli d'occasion gratuite pour Melbourne ?",
        a: "Oui. PopOut Market est une appli gratuite pour acheter et vendre d'occasion à Melbourne CBD et dans tous les autres quartiers de Melbourne, sans frais de publication d'annonces.",
      },
      {
        q: "Comment vendre mes affaires avant de quitter un appartement du CBD ?",
        a: "Publiez vos articles sur PopOut Market avec des photos nettes et un créneau de retrait réaliste. Les appartements du CBD changent souvent d'occupants : l'électroménager d'occasion et les articles pratiques se vendent vite à des acheteurs proches.",
      },
      {
        q: "Le marché d'occasion de Melbourne CBD fonctionne-t-il en dehors du centre-ville ?",
        a: "Tout à fait. PopOut Market fonctionne dans tout Melbourne. Les recherches autour du CBD recoupent souvent Carlton, Southbank, Docklands et North Melbourne, et vous pouvez échanger dans n'importe quel quartier.",
      },
      {
        q: "Où les étudiants peuvent-ils acheter et vendre d'occasion à Melbourne ?",
        a: "PopOut Market propose une messagerie multilingue avec traduction, particulièrement pratique pour les étudiants internationaux et les nouveaux arrivants. Vous pouvez échanger avec les vendeurs dans votre langue et acheter ou revendre facilement des articles d'occasion au centre-ville comme dans tout Melbourne.",
      },
    ],
    faqHeading: "Questions fréquentes",
    relatedHeading: "Pages liées",
    related: [
      { href: "/market", label: "Parcourir le marché d'occasion" },
      { href: "/melbourne-second-hand-marketplace", label: "Marché d'occasion Melbourne" },
      { href: "/melbourne-suburbs/melbourne-cbd", label: "Melbourne CBD" },
    ],
  },
  vi: {
    title: "Chợ đồ cũ Melbourne CBD | PopOut Market - App mua bán đồ cũ Melbourne an toàn",
    description:
      "PopOut Market là app đồ cũ Melbourne miễn phí: mua bán đồ cũ Melbourne CBD theo khu vực, chat đa ngôn ngữ có dịch, giao dịch trực tiếp an toàn, dùng được khắp Melbourne.",
    h1: "Chợ đồ cũ Melbourne CBD",
    inLanguage: "vi",
    sections: [
      {
        heading: "Người ở khu trung tâm thường cần gì",
        paragraphs: [
          "Nhu cầu tìm đồ second-hand ở trung tâm Melbourne thường rất thực tế: sắm nhanh đồ cho căn studio, thay mới đồ dùng sinh hoạt, thanh lý đồ cũ trước khi chuyển nhà, hay so sánh các món gần nhà mà không phải đi xa. Người ở khu CBD muốn nhận hàng gần, được trả lời nhanh và có những tin đăng dễ đánh giá qua hình ảnh lẫn mô tả.",
          "PopOut Market hoàn toàn miễn phí và được xây dựng quanh việc khám phá theo khu vực, nên món đồ càng gần lộ trình hằng ngày của bạn thì việc mua bán đồ cũ ở Melbourne càng diễn ra suôn sẻ. CBD là khu sầm uất nhất, nhưng PopOut hoạt động khắp Melbourne chứ không chỉ riêng khu trung tâm.",
        ],
      },
      {
        heading: "Vì sao CBD là khu mua bán đồ cũ sôi động",
        paragraphs: [
          "Melbourne CBD có mật độ căn hộ dày đặc, lượng sinh viên đông và chu kỳ chuyển vào - chuyển ra nhanh. Điều đó tạo nên nhu cầu ổn định cho nội thất cũ, đồ điện tử cũ và đồ gia dụng hằng ngày mà bạn có thể lấy ngay ở gần đó.",
        ],
        list: [
          "Chợ đồ cũ khu trung tâm Melbourne và các tin đăng tại CBD",
          "Nội thất cũ và đồ cần thiết khi mới dọn vào căn hộ",
          "Nhận hàng gần ở Carlton, Southbank, Docklands và North Melbourne",
          "Giao dịch đồ second-hand từ nội đô lan ra mọi khu vực khác của Melbourne",
        ],
      },
      {
        heading: "Giao dịch an toàn và chat bằng ngôn ngữ của bạn",
        paragraphs: [
          "PopOut Market tích hợp chat đa ngôn ngữ có dịch ngay trong app, nên bạn có thể thống nhất giá cả, tình trạng và giờ nhận hàng bằng ngôn ngữ mình thoải mái nhất, cùng tính năng AI tự động trả lời hỗ trợ việc liên hệ. Quy trình gặp mặt trực tiếp an toàn hơn giúp người mua và người bán hẹn nhau tại những điểm đông người, sáng sủa trong khu CBD.",
          "Được du học sinh, người thuê nhà và người chuyển căn hộ ưa chuộng, PopOut là nền tảng mua bán đồ cũ ở Melbourne giúp việc giao dịch tại trung tâm luôn đơn giản, đồng thời phủ khắp toàn Melbourne.",
        ],
      },
    ],
    faq: [
      {
        q: "Mua nội thất cũ ở Melbourne CBD ở đâu?",
        a: "Trên PopOut Market, bạn có thể xem nội thất cũ và đồ dùng second-hand ở Melbourne CBD do người gần bạn đăng, rồi hẹn điểm nhận hàng thuận tiện ngay trong khu trung tâm. Vì việc khám phá dựa theo khu vực, bạn cũng thấy được nhiều lựa chọn ở những khu khác của Melbourne.",
      },
      {
        q: "Có app đồ cũ Melbourne miễn phí không?",
        a: "Có. PopOut Market là app mua bán đồ cũ Melbourne miễn phí, dùng được ở Melbourne CBD và mọi khu vực khác của Melbourne, không tính phí đăng tin.",
      },
      {
        q: "Làm sao thanh lý đồ cũ trước khi chuyển khỏi căn hộ ở CBD?",
        a: "Hãy đăng món đồ lên PopOut Market kèm hình rõ ràng và giờ nhận hàng hợp lý. Căn hộ ở CBD thay người ở rất nhanh, nên đồ điện tử cũ và đồ gia dụng thiết thực thường được người mua ở gần lấy rất nhanh.",
      },
      {
        q: "Chợ đồ cũ Melbourne CBD có dùng được ngoài khu trung tâm không?",
        a: "Hoàn toàn được. PopOut Market hoạt động khắp Melbourne. Nhu cầu tìm đồ cũ ở CBD thường trùng với Carlton, Southbank, Docklands và North Melbourne, và bạn có thể giao dịch ở bất kỳ khu vực nào.",
      },
      {
        q: "Du học sinh thanh lý đồ cũ ở Melbourne tiện nhất qua đâu?",
        a: "PopOut Market có sẵn chat đa ngôn ngữ kèm dịch, đặc biệt tiện cho du học sinh và người mới đến Melbourne. Bạn có thể trao đổi với người bán bằng tiếng mẹ đẻ và dễ dàng thanh lý hay mua đồ second-hand ở khu trung tâm.",
      },
    ],
    faqHeading: "Câu hỏi thường gặp",
    relatedHeading: "Trang liên quan",
    related: [
      { href: "/market", label: "Xem chợ đồ cũ" },
      { href: "/melbourne-second-hand-marketplace", label: "Chợ đồ cũ Melbourne" },
      { href: "/melbourne-suburbs/melbourne-cbd", label: "Melbourne CBD" },
    ],
  },
  "zh-Hant": {
    title: "墨爾本CBD二手市場 | PopOut Market 市區二手買賣與更安心的本地當面交易",
    description:
      "PopOut Market 是免費的墨爾本CBD二手交易平台，讓市區住戶、留學生與搬家族就近買賣二手家具與生活用品。以社區配對、內建多語聊天，是旋轉拍賣(Carousell)的好替代，覆蓋整個墨爾本，不限市中心。",
    h1: "墨爾本CBD二手市場",
    inLanguage: "zh-TW",
    sections: [
      {
        heading: "市中心用戶最在意的事",
        paragraphs: [
          "墨爾本市中心的搜尋需求往往很實際：想快速布置套房、更換生活必需品、搬家前出清物品，或在不用跑遠的情況下比較附近的選擇。市區用戶最看重的是就近自取、回覆迅速，以及能單憑照片與描述就判斷商品狀況的刊登內容。",
          "PopOut Market 完全免費，並以社區、街區為核心進行配對。商品離你的日常活動範圍越近，墨爾本的本地二手交易通常就越順暢。CBD 是最熱鬧的核心地帶，但 PopOut Market 適用於整個墨爾本，並不只限於市中心。",
        ],
      },
      {
        heading: "為什麼 CBD 是活躍的二手區域",
        paragraphs: [
          "墨爾本CBD公寓密集、鄰近多所大學，入住與退租的週期都很快。這讓墨爾本市區的二手買賣需求持續旺盛，無論是二手家具、小型電器還是日常用品，都能就近完成中古交易。",
        ],
        list: [
          "墨爾本市中心二手與墨爾本CBD二手拍賣資訊",
          "墨爾本CBD二手家具與公寓入住必備好物",
          "卡爾頓、南岸、碼頭區與北墨爾本的就近自取",
          "從城區一路延伸到全墨爾本各區的二手買賣",
        ],
      },
      {
        heading: "用母語溝通，當面交易更安心",
        paragraphs: [
          "PopOut Market 內建多語言聊天與翻譯，你可以用最習慣的語言確認價格、成色與自取時間，還有 AI 自動回覆協助接洽。更安全的當面交易流程，讓買賣雙方在 CBD 人流密集、明亮的地點碰面完成交易。",
          "PopOut Market 深受留學生、租屋族與搬家族喜愛，是旋轉拍賣(Carousell)之外實用的墨爾本二手 app 與二手平台；它讓墨爾本市區的中古買賣保持簡單，同時觸及整個墨爾本。",
        ],
      },
    ],
    faq: [
      {
        q: "墨爾本CBD哪裡可以買二手家具？",
        a: "在 PopOut Market 上，你可以瀏覽附近用戶刊登的墨爾本CBD二手家具與生活用品，再約定方便的市區自取地點。由於配對以街區為基礎，你也能一併看到墨爾本其他區域的選擇。",
      },
      {
        q: "有沒有免費的墨爾本二手 app？",
        a: "有。PopOut Market 是一款免費的墨爾本二手 app，可在墨爾本CBD以及各個社區買賣二手物品，刊登完全不收費，是旋轉拍賣(Carousell)之外的好選擇。",
      },
      {
        q: "退租前如何在 CBD 公寓出清二手物品？",
        a: "在 PopOut Market 上刊登物品，附上清晰照片與合理的自取時間即可。CBD 公寓換租頻繁，實用的二手家電與家居用品常常很快就被附近的買家收走。",
      },
      {
        q: "墨爾本CBD二手市場在市中心以外也能用嗎？",
        a: "當然可以。PopOut Market 適用於整個墨爾本。墨爾本市中心的二手交易需求常與卡爾頓、南岸、碼頭區與北墨爾本重疊，你可以在任何一個社區進行本地二手買賣。",
      },
      {
        q: "墨爾本留學生在哪裡做二手交易最方便？",
        a: "PopOut Market 內建多語言聊天與翻譯，對剛到墨爾本的留學生與新住戶特別友善，能用母語直接和賣家溝通，輕鬆完成市區的中古二手交易。",
      },
    ],
    faqHeading: "常見問題",
    relatedHeading: "相關頁面",
    related: [
      { href: "/market", label: "瀏覽二手市場" },
      { href: "/melbourne-second-hand-marketplace", label: "墨爾本二手市場" },
      { href: "/melbourne-suburbs/melbourne-cbd", label: "墨爾本CBD" },
    ],
  },
  ja: {
    title: "メルボルンCBDの中古マーケット | PopOut Market 安心の地元手渡し取引",
    description:
      "PopOut Marketは無料で使えるメルボルンの中古アプリ。シティ在住の方や留学生、引っ越し中の方が、近くで中古家具や生活用品を売買できるフリマアプリです。CBDだけでなくメルボルン全域でご利用いただけます。",
    h1: "メルボルンCBDの中古マーケット",
    inLanguage: "ja",
    sections: [
      {
        heading: "シティで暮らす人が本当に求めていること",
        paragraphs: [
          "メルボルン中心部での「中古を探したい」というニーズは、とても実用的なものばかりです。ワンルームを手早く整えたい、生活用品を買い替えたい、引っ越し前に不用品を売りたい、遠くまで行かずに近くの出品を比べたい——多くはそんな目的です。シティで暮らす方は、近場での手渡し、すばやい返信、そして写真と説明だけで状態を判断できる出品を求めています。",
          "PopOut Marketは無料で、住んでいるエリア（サバーブ）を軸にしたマッチングを大切にしています。出品が自分の生活圏に近いほど、中古品の売買はスムーズに進みます。CBDはいちばんにぎやかな拠点ですが、PopOut Marketは市中心部に限らずメルボルン全域でお使いいただけます。",
        ],
      },
      {
        heading: "CBDで中古取引が活発な理由",
        paragraphs: [
          "メルボルンCBDはアパートが密集し、近くにいくつもの大学があり、入居と退去のサイクルが速いエリアです。そのため、近場で受け取れる中古家具や小型家電、日用品への需要が安定して続いています。",
        ],
        list: [
          "シティで見つかる中古家具やアパートの入居グッズ",
          "退去時にまとめて手放したい生活用品",
          "カールトン・サウスバンク・ドックランズ・ノースメルボルンでの近場の手渡し",
          "シティから周辺サバーブへ広がる中古売買",
        ],
      },
      {
        heading: "自分の言葉でやり取りでき、対面取引も安心",
        paragraphs: [
          "PopOut Marketには翻訳機能つきのアプリ内チャットがあり、いちばん使いやすい言語で価格や状態、受け渡しの時間を相談できます。待ち合わせは人通りが多く明るい場所を選びやすいので、買い手と売り手が安心して落ち合えます。",
          "留学生や賃貸住まいの方、引っ越し中の方に人気のPopOut Marketは、シティでの中古売買をシンプルに保ちながら、メルボルン全域までしっかり対応しています。",
        ],
      },
    ],
    faq: [
      {
        q: "メルボルンCBDで中古家具はどこで買えますか？",
        a: "PopOut Marketなら、近くの人が出品した中古家具や生活用品をチェックして、便利な手渡し場所を相談できます。住んでいるエリアを軸にしたマッチングなので、メルボルンのほかの地域の出品も一緒に見つかります。",
      },
      {
        q: "メルボルン向けの無料の中古アプリはありますか？",
        a: "あります。PopOut MarketはCBDをはじめメルボルンのどのサバーブでも中古品を売買できる無料のフリマアプリで、出品手数料はかかりません。",
      },
      {
        q: "退去前にCBDのアパートで不用品を売るには？",
        a: "鮮明な写真と無理のない受け渡し時間を添えて、PopOut Marketに出品するだけです。CBDのアパートは入れ替わりが速いので、使いやすい日用品は近くの買い手にすぐ売れることもよくあります。",
      },
      {
        q: "PopOut MarketはCBDの外でも使えますか？",
        a: "もちろんです。PopOut Marketはメルボルン全域でお使いいただけます。シティでの取引はカールトンやサウスバンク、ドックランズ、ノースメルボルンとも重なりやすく、どのサバーブでも取引できます。",
      },
      {
        q: "出品者と自分の言語でチャットできますか？",
        a: "はい。PopOut Marketは多言語チャットを標準で備えているので、メルボルンに来たばかりの方や留学生にも安心してお使いいただけます。",
      },
    ],
    faqHeading: "よくある質問",
    relatedHeading: "関連ページ",
    related: [
      { href: "/market", label: "マーケットを見る" },
      { href: "/melbourne-second-hand-marketplace", label: "メルボルンの中古マーケット" },
      { href: "/melbourne-suburbs/melbourne-cbd", label: "メルボルンCBD" },
    ],
  },
  en: {
    title:
      "Melbourne CBD Second-Hand Marketplace | PopOut Market City Listings & Safer Local Trading",
    description:
      "PopOut Market is a free Melbourne CBD second-hand marketplace for city residents, students and apartment movers. Buy and sell nearby furniture and essentials across all of Melbourne.",
    h1: "Melbourne CBD Second-Hand Marketplace",
    inLanguage: "en-AU",
    sections: [
      {
        heading: "What city-centre users usually need",
        paragraphs: [
          "Melbourne CBD search intent is almost always practical: furnishing a studio fast, replacing household basics, selling items before a move, or comparing nearby options without travelling far. City users want close-by pickup, quick replies, and listings that are easy to judge from photos and descriptions.",
          "PopOut Market is free to use and built around suburb-based discovery, so the closer a listing sits to your daily movement, the more smoothly the trade tends to go. The CBD is the busiest hub, but PopOut works across all of Melbourne, not the city centre alone.",
        ],
      },
      {
        heading: "Why the CBD is a strong second-hand area",
        paragraphs: [
          "Melbourne CBD combines apartment density, university traffic, and fast move-in and move-out cycles. That creates steady demand for second-hand furniture, small appliances, and everyday household goods you can collect close by.",
        ],
        list: [
          "Melbourne city second-hand market and CBD listings",
          "CBD furniture and apartment move-in essentials",
          "Carlton, Southbank, Docklands and North Melbourne pickups",
          "Inner-city trading that extends to every Melbourne suburb",
        ],
      },
      {
        heading: "Trade safely and chat in your language",
        paragraphs: [
          "PopOut Market includes in-app multilingual chat, so you can agree on price, condition and pickup time in the language you are most comfortable with. A safer in-person meetup flow helps buyers and sellers connect in busy, well-trafficked CBD spots.",
          "Popular with international students, renters and apartment movers, PopOut keeps city-centre trading simple while reaching the whole of Melbourne.",
        ],
      },
    ],
    faq: [
      {
        q: "Where can I buy second-hand furniture in Melbourne CBD?",
        a: "On PopOut Market you can browse Melbourne CBD second-hand furniture and essentials listed by people nearby, then arrange a convenient city pickup. Because discovery is suburb-based, you also see options across the rest of Melbourne.",
      },
      {
        q: "Is there a free second-hand marketplace app for Melbourne CBD?",
        a: "Yes. PopOut Market is a free app for buying and selling second-hand goods in Melbourne CBD and every other Melbourne suburb, with no listing fees.",
      },
      {
        q: "How do I sell my stuff before moving out of a CBD apartment?",
        a: "List your items on PopOut Market with clear photos and a realistic pickup time. CBD apartment turnover is high, so practical household goods often sell quickly to buyers close by.",
      },
      {
        q: "Does the Melbourne CBD marketplace work outside the city centre?",
        a: "Absolutely. PopOut Market works across all of Melbourne. CBD search intent often overlaps with Carlton, Southbank, Docklands and North Melbourne, and you can trade in any suburb.",
      },
      {
        q: "Can I chat with sellers in my own language on PopOut Market?",
        a: "Yes. PopOut Market has built-in multilingual chat, which is especially handy for international students and new arrivals trading in the Melbourne CBD area.",
      },
    ],
    faqHeading: "FAQ",
    relatedHeading: "Related pages",
    related: [
      {
        href: "/market",
        label: "Browse the marketplace",
      },
      {
        href: "/melbourne-second-hand-marketplace",
        label: "Melbourne second-hand marketplace",
      },
      {
        href: "/melbourne-suburbs/melbourne-cbd",
        label: "Melbourne CBD",
      },
    ],
  },
  "zh-Hans": {
    title: "墨尔本CBD二手市场 | PopOut Market 市区二手买卖与更安全的本地交易",
    description:
      "PopOut Market 是免费的墨尔本CBD二手交易平台，方便市区居民、留学生与搬家人群就近买卖二手家具与生活用品，覆盖整个墨尔本，不限于市中心。",
    h1: "墨尔本CBD二手市场",
    inLanguage: "zh-CN",
    sections: [
      {
        heading: "市中心用户最看重什么",
        paragraphs: [
          "墨尔本市中心的搜索需求往往很实际：快速布置公寓、更换生活必需品、搬家前出手物品，或在不远行的情况下比较附近的选择。市区用户希望就近自提、回复迅速，并且能从照片和描述中轻松判断商品状况。",
          "PopOut Market 完全免费，以社区和街区为核心进行匹配。商品离你的日常活动范围越近，同城二手交易通常就越顺畅。CBD 是最繁忙的核心，但 PopOut 覆盖整个墨尔本，并不局限于市中心。",
        ],
      },
      {
        heading: "为何 CBD 是活跃的二手区域",
        paragraphs: [
          "墨尔本CBD公寓密集、临近多所大学，入住与退租周期都很快。这让墨尔本市区的二手买卖需求持续旺盛，二手家具、小家电和日常用品都能就近完成交易。",
        ],
        list: [
          "墨尔本市中心二手与墨尔本CBD二手市场信息",
          "墨尔本CBD二手家具与公寓入住必备",
          "卡尔顿、南岸、码头区与北墨尔本就近自提",
          "从城区延伸至全墨尔本各区的二手交易",
        ],
      },
      {
        heading: "用母语沟通，更安心地交易",
        paragraphs: [
          "PopOut Market 内置多语言聊天，你可以用最习惯的语言确认价格、成色与自提时间。更安全的当面交易流程，帮助买卖双方在 CBD 人流密集、明亮安全的地点见面完成交易。",
          "PopOut 深受留学生、租房者和搬家人群欢迎，让墨尔本市区的二手买卖简单顺畅，同时触达整个墨尔本。",
        ],
      },
    ],
    faq: [
      {
        q: "墨尔本CBD哪里可以买二手家具？",
        a: "在 PopOut Market 上，你可以浏览附近用户发布的墨尔本CBD二手家具和生活用品，再约定方便的市区自提地点。由于匹配以街区为基础，你还能看到墨尔本其他区域的选择。",
      },
      {
        q: "有没有免费的墨尔本CBD二手交易App？",
        a: "有。PopOut Market 是一款免费App，可在墨尔本CBD以及墨尔本各个社区买卖二手物品，发布信息不收任何费用。",
      },
      {
        q: "退租前如何在 CBD 公寓出手二手物品？",
        a: "在 PopOut Market 上发布物品，配上清晰照片和合理的自提时间即可。CBD 公寓换租频繁，实用的家居用品常常很快就被附近买家收走。",
      },
      {
        q: "墨尔本CBD二手市场在市中心以外也能用吗？",
        a: "当然可以。PopOut Market 覆盖整个墨尔本。墨尔本市中心的二手搜索需求常与卡尔顿、南岸、码头区和北墨尔本重叠，你可以在任意社区交易。",
      },
      {
        q: "在 PopOut Market 上能用自己的语言和卖家沟通吗？",
        a: "可以。PopOut Market 内置多语言聊天，对在墨尔本城区进行二手交易的留学生和新到墨尔本的人尤其方便。",
      },
    ],
    faqHeading: "常见问题",
    relatedHeading: "相关页面",
    related: [
      {
        href: "/market",
        label: "浏览二手市场",
      },
      {
        href: "/melbourne-second-hand-marketplace",
        label: "墨尔本二手市场",
      },
      {
        href: "/melbourne-suburbs/melbourne-cbd",
        label: "墨尔本CBD",
      },
    ],
  },
  ko: {
    title: "멜버른 CBD 중고마켓 | PopOut Market 시티 중고거래와 더 안전한 동네 직거래",
    description:
      "PopOut Market은 무료 멜버른 CBD 중고거래 플랫폼입니다. 시내 거주자, 유학생, 이사하는 분들이 가까운 곳에서 중고 가구와 생활용품을 사고팔며, 멜버른 전역에서 이용할 수 있습니다.",
    h1: "멜버른 CBD 중고마켓",
    inLanguage: "ko",
    sections: [
      {
        heading: "시내 이용자가 정말 필요로 하는 것",
        paragraphs: [
          "멜버른 시내 검색은 대체로 매우 실용적입니다. 원룸을 빠르게 채우거나, 생활필수품을 교체하거나, 이사 전에 물건을 정리하거나, 멀리 가지 않고 근처 매물을 비교하려는 경우가 많습니다. 시티 이용자는 가까운 직거래, 빠른 답장, 그리고 사진과 설명만으로 상태를 판단하기 쉬운 매물을 원합니다.",
          "PopOut Market은 무료이며 동네 기반 탐색을 중심으로 만들어졌습니다. 매물이 내 생활 동선에 가까울수록 멜버른 중고거래는 더 매끄럽게 이뤄집니다. CBD가 가장 붐비는 거점이지만, PopOut은 시내에만 한정되지 않고 멜버른 전역에서 이용할 수 있습니다.",
        ],
      },
      {
        heading: "CBD가 활발한 중고거래 지역인 이유",
        paragraphs: [
          "멜버른 CBD는 아파트 밀집도, 대학가 유동 인구, 빠른 입주·퇴거 주기가 맞물려 있습니다. 그래서 가까이서 받을 수 있는 중고 가구, 소형 가전, 생활용품에 대한 멜버른 도심 중고 수요가 꾸준합니다.",
        ],
        list: [
          "멜버른 시티 중고거래와 CBD 중고마켓 매물",
          "멜버른 CBD 중고 가구와 입주 필수품",
          "칼튼, 사우스뱅크, 도클랜즈, 노스 멜버른 근거리 직거래",
          "도심을 넘어 멜버른 모든 동네로 이어지는 중고 거래",
        ],
      },
      {
        heading: "내 언어로 대화하며 더 안전하게 거래",
        paragraphs: [
          "PopOut Market에는 앱 내 다국어 채팅이 있어 가장 편한 언어로 가격, 상태, 직거래 시간을 정할 수 있습니다. 더 안전한 대면 거래 절차는 사람이 많고 밝은 CBD 장소에서 구매자와 판매자가 만나도록 돕습니다.",
          "유학생, 세입자, 이사하는 분들에게 인기 있는 PopOut은 멜버른 시내 중고거래를 간편하게 유지하면서 멜버른 전역까지 닿습니다.",
        ],
      },
    ],
    faq: [
      {
        q: "멜버른 CBD에서 중고 가구는 어디서 사나요?",
        a: "PopOut Market에서 가까운 이웃이 올린 멜버른 CBD 중고 가구와 생활용품을 둘러보고 편한 시티 직거래 장소를 정할 수 있습니다. 동네 기반 탐색이라 멜버른 다른 지역 매물도 함께 볼 수 있습니다.",
      },
      {
        q: "멜버른 CBD 중고거래용 무료 앱이 있나요?",
        a: "네. PopOut Market은 멜버른 CBD를 비롯해 멜버른 모든 동네에서 중고 물품을 사고팔 수 있는 무료 앱이며, 등록 수수료가 없습니다.",
      },
      {
        q: "CBD 아파트에서 이사 가기 전에 물건을 어떻게 파나요?",
        a: "PopOut Market에 선명한 사진과 현실적인 직거래 시간을 적어 매물을 올리면 됩니다. CBD 아파트는 회전이 빨라 실용적인 생활용품은 근처 구매자에게 금방 팔리는 경우가 많습니다.",
      },
      {
        q: "멜버른 CBD 중고마켓은 시내 밖에서도 쓸 수 있나요?",
        a: "물론입니다. PopOut Market은 멜버른 전역에서 이용할 수 있습니다. 멜버른 시내 중고거래 검색은 칼튼, 사우스뱅크, 도클랜즈, 노스 멜버른과 자주 겹치며 어느 동네에서나 거래할 수 있습니다.",
      },
      {
        q: "PopOut Market에서 내 언어로 판매자와 채팅할 수 있나요?",
        a: "네. PopOut Market은 다국어 채팅을 기본 지원하여, 멜버른 도심에서 중고 거래를 하는 유학생과 새로 온 분들에게 특히 편리합니다.",
      },
    ],
    faqHeading: "자주 묻는 질문",
    relatedHeading: "관련 페이지",
    related: [
      {
        href: "/market",
        label: "중고마켓 둘러보기",
      },
      {
        href: "/melbourne-second-hand-marketplace",
        label: "멜버른 중고마켓",
      },
      {
        href: "/melbourne-suburbs/melbourne-cbd",
        label: "멜버른 CBD",
      },
    ],
  },
};

function contentFor(locale: Locale): PageContent {
  return CONTENT[locale] ?? CONTENT.en;
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await localeFromParams(params);
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
      images: [OG_IMAGE],
      siteName: "PopOut Market",
    },
  };
}

export default async function Page({ params }: LocaleParams) {
  const locale = await localeFromParams(params);
  const c = contentFor(locale);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: c.title,
        description: c.description,
        inLanguage: c.inLanguage,
        about: { "@type": "Place", name: ABOUT_NAME },
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
    <section className={SHELL_X + " flex flex-1 flex-col py-10"}>
      <div className={INNER_MAX + " max-w-4xl"}>
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {c.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-700">{c.description}</p>

        {c.sections.map((s) => (
          <section
            key={s.heading}
            className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm first:mt-8"
          >
            <h2 className="text-lg font-semibold text-gray-900">{s.heading}</h2>
            {s.paragraphs?.map((p, i) => (
              <p key={i} className="mt-3 text-sm leading-relaxed text-gray-700">
                {p}
              </p>
            ))}
            {s.list ? (
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-700">
                {s.list.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.relatedHeading}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {c.related.map((r) => (
              <Link
                key={r.href}
                href={toLocalePath(r.href, locale)}
                className="inline-flex items-center rounded-xl border border-black/5 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:border-brand-500"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{c.faqHeading}</h2>
          <div className="mt-4 space-y-4">
            {c.faq.map((item) => (
              <article key={item.q} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.q.charAt(0).toUpperCase() + item.q.slice(1)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
              </article>
            ))}
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

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
