import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedAlternates, siteUrl, OG_IMAGE } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/melbourne-second-hand-marketplace";
const ABOUT_NAME = "Melbourne, Victoria, Australia";

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
    title: "Mercado de segunda mano en Melbourne | Comprar y vender con PopOut Market",
    description:
      "PopOut Market es la app de segunda mano de Melbourne para comprar y vender cerca de ti. Explora muebles, electrodomésticos y artículos usados por barrio.",
    h1: "Mercado de segunda mano en Melbourne",
    inLanguage: "es",
    sections: [
      {
        heading: "Un mercado por barrios, no un muro único para toda la ciudad",
        paragraphs: [
          "PopOut Market es un mercado de segunda mano en Melbourne creado en torno a cómo ocurren de verdad los intercambios locales. La mayoría de las ventas de segunda mano que salen bien se reducen a una sola pregunta: ¿está el artículo lo bastante cerca para verlo, recogerlo y llevarlo a casa sin un viaje largo? PopOut pone eso en el centro y te muestra primero los anuncios cercanos a donde vives, estudias o trabajas.",
          "En lugar de tratar todo el estado como un muro interminable, esta plataforma de segunda mano en Melbourne prioriza la búsqueda por barrio, una comunicación más clara y un camino más fluido desde que ves un anuncio hasta que quedas con la otra persona. Para una ciudad tan extensa como Melbourne, ese enfoque local es lo que convierte el simple ojear en compras y ventas cerradas.",
        ],
      },
      {
        heading: "Cómo funciona el mercado de segunda mano",
        paragraphs: [
          "Comprar y vender de segunda mano en Melbourne con PopOut está pensado en torno a recogidas a corta distancia, en la misma zona, para que los intercambios se cierren rápido y sin complicaciones.",
        ],
        list: [
          "Publica en minutos: añade unas fotos y una descripción breve para poner un artículo a la venta.",
          "Descubre por barrio: los compradores miran primero lo que tienen cerca, así la distancia y el horario de recogida son realistas.",
          "Chatea en cualquier idioma: habla directamente con la otra persona gracias al chat multilingüe con traducción integrada y a la respuesta automática con IA.",
          "Quedad de forma segura: acuerda un lugar público y cómodo y confirma la entrega con un proceso más claro dentro de la app.",
        ],
      },
      {
        heading: "Qué compra y vende la gente",
        paragraphs: [
          "Las categorías más activas reflejan la vida real en Melbourne, sobre todo en torno a apartamentos, pisos compartidos y alojamiento estudiantil: muebles de segunda mano como camas, escritorios y sofás; electrodomésticos de segunda mano como neveras, microondas y lavadoras; menaje de cocina y artículos para el hogar; bicicletas y patinetes eléctricos; electrónica y rincones de estudio; y los lotes de mudanza o vaciado de estudiantes al entrar o salir de un piso. Esta mezcla convierte a PopOut en un auténtico mercado de segunda mano de Melbourne, a medio camino entre los anuncios clasificados locales y un mercadillo permanente.",
        ],
      },
      {
        heading: "Con epicentro en el CBD, útil en todo Melbourne",
        paragraphs: [
          "El CBD de Melbourne es nuestra zona más activa. La alta densidad de apartamentos, la actividad universitaria y los ciclos rápidos de mudanzas generan una demanda constante de muebles, electrodomésticos y artículos del día a día que se pueden recoger muy cerca.",
          "Pero la plataforma no se limita al CBD. Como el descubrimiento es por barrio, cualquier persona en Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, South Wharf y más allá puede usar la app para intercambiar rápido con gente cercana. Es una alternativa local y enfocada a los clasificados generalistas como Facebook Marketplace y Gumtree, ideal para el mercado de segunda mano en Melbourne, desde estudiantes hasta inquilinos.",
        ],
      },
    ],
    faq: [
      {
        q: "¿Cuál es la mejor app de segunda mano en Melbourne?",
        a: "PopOut Market es una app de segunda mano en Melbourne que prioriza el barrio. En vez de un único muro para todo el estado, te muestra los anuncios cercanos a donde realmente vives, estudias o trabajas, así que lo que encuentras está lo bastante cerca para verlo y recogerlo.",
      },
      {
        q: "¿Cómo comprar y vender de segunda mano en Melbourne?",
        a: "Los vendedores publican un artículo en pocos minutos con fotos y una descripción breve. Los compradores buscan por barrio, contactan al vendedor en el chat, acuerdan una hora y quedan cerca para cerrar el trato. Todo el proceso gira en torno a recogidas a corta distancia, en la misma zona.",
      },
      {
        q: "¿PopOut es una app de mercado de segunda mano gratis en Melbourne?",
        a: "Sí. PopOut Market es una app gratis para comprar y vender artículos usados por todo Melbourne, con descubrimiento por barrio, chat multilingüe integrado y un proceso de encuentro más seguro.",
      },
      {
        q: "¿Qué alternativa hay a Facebook Marketplace y Gumtree para segunda mano en Melbourne?",
        a: "PopOut está diseñado específicamente para el intercambio local en Melbourne: descubrimiento por barrio, chat multilingüe con traducción integrada y una coordinación de encuentros más clara y segura, sin tener que desplazarte por un muro infinito de anuncios clasificados generales.",
      },
      {
        q: "¿Dónde vender muebles y electrodomésticos de segunda mano en Melbourne?",
        a: "Puedes publicar muebles de segunda mano, electrodomésticos de segunda mano, menaje de cocina, bicicletas y electrónica en PopOut Market y llegar a compradores de tu propio barrio, lo que hace que los artículos voluminosos sean fáciles de ver y recoger cerca.",
      },
    ],
    faqHeading: "Preguntas frecuentes",
    relatedHeading: "Páginas relacionadas",
    related: [
      { href: "/market", label: "Explora anuncios de segunda mano en Melbourne" },
      { href: "/melbourne-second-hand-app", label: "App de segunda mano en Melbourne" },
      {
        href: "/melbourne-second-hand-market",
        label: "Cómo funciona el mercado de segunda mano en Melbourne",
      },
    ],
  },
  fr: {
    title: "Marché d'occasion à Melbourne | Acheter et vendre d'occasion avec PopOut Market",
    description:
      "PopOut Market est l'appli d'occasion à Melbourne pour acheter et vendre d'occasion près de chez vous. Parcourez meubles, électroménager et articles par quartier.",
    h1: "Marché d'occasion à Melbourne",
    inLanguage: "fr",
    sections: [
      {
        heading: "Un marché d'occasion par quartier, pas un fil unique pour toute la ville",
        paragraphs: [
          "PopOut Market est un marché d'occasion à Melbourne conçu autour de la façon dont les échanges locaux se passent vraiment. La plupart des ventes d'occasion réussies se résument à une seule question : l'article est-il assez proche pour être inspecté, récupéré et rapporté chez soi sans un long trajet ? PopOut place ce critère au centre en vous montrant d'abord les annonces près de l'endroit où vous vivez, étudiez ou travaillez.",
          "Plutôt que de traiter toute la région comme un fil sans fin, cette plateforme de seconde main à Melbourne privilégie la recherche par quartier, une communication plus claire et un parcours fluide entre la découverte d'une annonce et la rencontre. Pour une ville aussi étendue que Melbourne, c'est cette priorité locale qui transforme le simple fait de parcourir en transactions réellement conclues.",
        ],
      },
      {
        heading: "Comment fonctionne le marché d'occasion",
        paragraphs: [
          "Acheter et vendre d'occasion à Melbourne sur PopOut est pensé autour de remises en main propre à courte distance, dans le même secteur, pour que les échanges se concluent vite et facilement.",
        ],
        list: [
          "Publiez en quelques minutes : ajoutez quelques photos et une courte description pour mettre un article en ligne.",
          "Découvrez par quartier : les acheteurs parcourent d'abord ce qui se trouve à proximité, donc la distance et l'horaire de récupération restent réalistes.",
          "Discutez dans toutes les langues : échangez directement avec l'autre personne grâce au chat multilingue avec traduction intégrée et à la réponse automatique par IA.",
          "Rencontrez-vous en toute sécurité : convenez d'un lieu public et pratique, puis confirmez la remise grâce à un parcours clair dans l'appli.",
        ],
      },
      {
        heading: "Ce que les gens achètent et vendent",
        paragraphs: [
          "Les catégories les plus actives reflètent la vraie vie à Melbourne, surtout autour des appartements, des colocations et des logements étudiants : meubles d'occasion comme lits, bureaux et canapés ; électroménager d'occasion comme réfrigérateurs, micro-ondes et machines à laver ; articles de cuisine et accessoires pour la maison ; vélos et trottinettes électriques ; appareils électroniques et coins d'étude ; ainsi que les lots d'emménagement ou de débarras des étudiants. Ce mélange fait de PopOut un vrai marché d'occasion à Melbourne, à mi-chemin entre les petites annonces locales et un vide-grenier permanent.",
        ],
      },
      {
        heading: "Centré sur le CBD, utile dans tout Melbourne",
        paragraphs: [
          "Le CBD de Melbourne est notre quartier le plus actif. La forte densité d'appartements, l'activité universitaire et les cycles rapides d'emménagement et de déménagement créent une demande constante de meubles, d'électroménager et d'articles du quotidien que l'on peut récupérer tout près.",
          "Mais la plateforme ne se limite pas au CBD. Comme la découverte se fait par quartier, toute personne à Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, South Wharf et au-delà peut utiliser l'appli pour échanger rapidement avec des gens proches. C'est une alternative locale et ciblée aux petites annonces généralistes comme Facebook Marketplace et Gumtree, idéale pour le marché d'occasion à Melbourne, des étudiants aux locataires.",
        ],
      },
    ],
    faq: [
      {
        q: "Quelle est la meilleure appli d'occasion à Melbourne ?",
        a: "PopOut Market est une appli d'occasion à Melbourne qui privilégie le quartier. Au lieu d'un fil unique pour toute la région, elle vous montre les annonces près de l'endroit où vous vivez, étudiez ou travaillez, si bien que ce que vous trouvez est assez proche pour être inspecté et récupéré.",
      },
      {
        q: "Comment acheter et vendre d'occasion à Melbourne ?",
        a: "Les vendeurs publient un article en quelques minutes avec des photos et une courte description. Les acheteurs parcourent par quartier, contactent le vendeur dans le chat, conviennent d'un horaire et se rencontrent près de chez eux pour conclure. Tout le parcours repose sur des remises à courte distance, dans le même secteur.",
      },
      {
        q: "PopOut est-il une appli de marché d'occasion gratuite à Melbourne ?",
        a: "Oui. PopOut Market est une appli gratuite pour acheter et vendre des articles d'occasion partout à Melbourne, avec une découverte par quartier, un chat multilingue intégré et un parcours de rencontre plus sûr.",
      },
      {
        q: "Quelle alternative à Facebook Marketplace et Gumtree pour la seconde main à Melbourne ?",
        a: "PopOut est conçu spécialement pour les échanges locaux à Melbourne : découverte par quartier, chat multilingue avec traduction intégrée et organisation de rencontres plus claire et plus sûre, sans avoir à faire défiler un fil de petites annonces interminable.",
      },
      {
        q: "Où vendre des meubles et de l'électroménager d'occasion à Melbourne ?",
        a: "Vous pouvez publier meubles d'occasion, électroménager d'occasion, articles de cuisine, vélos et appareils électroniques sur PopOut Market et toucher des acheteurs de votre propre quartier, ce qui rend les objets volumineux faciles à inspecter et à récupérer tout près.",
      },
    ],
    faqHeading: "Questions fréquentes",
    relatedHeading: "Pages liées",
    related: [
      { href: "/market", label: "Parcourir les annonces d'occasion à Melbourne" },
      { href: "/melbourne-second-hand-app", label: "Appli d'occasion à Melbourne" },
      {
        href: "/melbourne-second-hand-market",
        label: "Comment fonctionne le marché de seconde main à Melbourne",
      },
    ],
  },
  vi: {
    title: "Chợ đồ cũ Melbourne | Mua bán đồ cũ tại địa phương với PopOut Market",
    description:
      "PopOut Market là app đồ cũ Melbourne giúp mua bán đồ cũ tại địa phương. Duyệt nội thất, đồ điện và đồ gia dụng theo khu, chat đa ngôn ngữ có dịch và gặp trực tiếp an toàn khắp Melbourne.",
    h1: "Chợ đồ cũ Melbourne",
    inLanguage: "vi",
    sections: [
      {
        heading: "Nền tảng đồ cũ ưu tiên khu vực, không phải một dòng tin tràn lan cả thành phố",
        paragraphs: [
          "PopOut Market là một chợ đồ cũ Melbourne được xây dựng dựa trên cách giao dịch thực tế tại địa phương. Hầu hết các vụ mua bán đồ cũ thành công đều quy về một câu hỏi: món đồ có đủ gần để xem tận nơi, nhận và mang về mà không phải đi xa hay không? PopOut đặt điều đó lên hàng đầu bằng cách hiển thị các tin đăng gần nơi bạn ở, học hay làm.",
          "Thay vì gộp cả tiểu bang thành một dòng tin bất tận, nền tảng mua bán đồ cũ Melbourne này chú trọng việc duyệt theo từng khu (suburb), trao đổi rõ ràng và một quy trình mượt mà từ lúc thấy tin đến lúc gặp nhau. Với một thành phố trải rộng như Melbourne, chính sự tập trung vào địa phương đó mới biến việc lướt xem thành những giao dịch hoàn tất.",
        ],
      },
      {
        heading: "Cách mua bán đồ cũ Melbourne diễn ra",
        paragraphs: [
          "Việc mua bán trên PopOut được thiết kế quanh việc nhận hàng cự ly ngắn, cùng khu vực, nên giao dịch hoàn tất nhanh chóng và tiện lợi.",
        ],
        list: [
          "Đăng tin trong vài phút: thêm vài tấm ảnh và một mô tả ngắn là đăng được món đồ.",
          "Khám phá theo khu: người mua duyệt những gì gần mình trước, nên khoảng cách và thời gian nhận hàng luôn thực tế.",
          "Chat đa ngôn ngữ: nhắn trực tiếp với người kia, có hỗ trợ dịch để vượt qua rào cản ngôn ngữ, cùng tính năng tự động trả lời bằng AI.",
          "Gặp trực tiếp an toàn: hẹn ở nơi công cộng, tiện lợi và xác nhận việc nhận hàng qua quy trình rõ ràng trong app.",
        ],
      },
      {
        heading: "Mọi người thường mua bán những gì",
        paragraphs: [
          "Những danh mục sôi động nhất phản ánh đúng cuộc sống thật ở Melbourne, đặc biệt quanh các căn hộ, nhà ở ghép (share house) và ký túc xá sinh viên: nội thất cũ như giường, bàn học và sofa; đồ điện cũ như tủ lạnh, lò vi sóng và máy giặt; đồ bếp và đồ gia dụng; xe đạp và xe scooter điện; đồ điện tử và bộ góc học tập; cùng các lô đồ du học sinh thanh lý khi chuyển vào hoặc dọn ra cuối kỳ.",
        ],
      },
      {
        heading: "Lấy CBD làm trung tâm, hữu ích khắp Melbourne",
        paragraphs: [
          "Khu CBD Melbourne là điểm nóng nhộn nhịp nhất của nền tảng. Mật độ sống căn hộ cao, hoạt động đại học sôi nổi cùng chu kỳ chuyển vào, chuyển ra nhanh tạo ra nhu cầu ổn định cho nội thất, đồ điện và đồ dùng hằng ngày có thể nhận ngay gần đó.",
          "Nhưng nền tảng không chỉ giới hạn ở CBD. Vì việc khám phá dựa trên từng khu, bất kỳ ai ở Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, South Wharf và xa hơn nữa đều có thể dùng app để giao dịch nhanh với người ở gần. Đây là lựa chọn tập trung vào địa phương, là chợ đồ cũ Melbourne thay thế gọn gàng cho các trang rao vặt rộng như Facebook Marketplace và Gumtree.",
        ],
      },
    ],
    faq: [
      {
        q: "app đồ cũ Melbourne nào tốt nhất?",
        a: "PopOut Market là app đồ cũ Melbourne ưu tiên khu vực. Thay vì một dòng tin chung cho cả tiểu bang, app hiển thị các tin đăng gần nơi bạn thực sự ở, học hay làm, nên những món bạn tìm thấy đều đủ gần để xem tận nơi và nhận hàng.",
      },
      {
        q: "mua bán đồ cũ Melbourne như thế nào?",
        a: "Người bán đăng món đồ trong vài phút với ảnh và mô tả ngắn. Người mua duyệt theo khu, nhắn tin cho người bán trong phần chat, hẹn giờ và gặp nhau tại địa phương để hoàn tất giao dịch. Toàn bộ quy trình xoay quanh việc nhận hàng cự ly ngắn, cùng khu vực.",
      },
      {
        q: "PopOut có phải app mua bán đồ cũ Melbourne miễn phí không?",
        a: "Có. PopOut Market là app miễn phí để mua bán đồ second-hand khắp Melbourne, với khám phá theo khu, chat đa ngôn ngữ trong app và quy trình gặp mặt an toàn hơn.",
      },
      {
        q: "có ứng dụng nào thay thế Facebook Marketplace và Gumtree để mua bán đồ cũ ở Melbourne không?",
        a: "PopOut được thiết kế riêng cho việc giao dịch đồ cũ tại địa phương ở Melbourne: khám phá ưu tiên theo khu, chat đa ngôn ngữ có dịch tích hợp và việc sắp xếp gặp mặt rõ ràng, an toàn hơn, thay vì phải lướt một dòng rao vặt chung bất tận.",
      },
      {
        q: "thanh lý đồ cũ Melbourne, bán nội thất và đồ điện ở đâu?",
        a: "Bạn có thể đăng nội thất cũ, đồ điện cũ, đồ bếp, xe đạp và đồ điện tử trên PopOut Market để tiếp cận người mua ngay trong khu của mình, giúp những món cồng kềnh dễ xem và nhận hàng gần nhà.",
      },
    ],
    faqHeading: "Câu hỏi thường gặp",
    relatedHeading: "Trang liên quan",
    related: [
      { href: "/market", label: "Duyệt tin đồ cũ Melbourne" },
      { href: "/melbourne-second-hand-app", label: "App đồ cũ Melbourne" },
      { href: "/melbourne-second-hand-market", label: "Chợ đồ cũ Melbourne hoạt động ra sao" },
    ],
  },
  "zh-Hant": {
    title: "墨爾本二手交易平台 | PopOut Market 本地二手買賣 App",
    description:
      "PopOut Market 是專為墨爾本打造的二手交易平台，可按社區瀏覽二手家具、電器與生活好物，內建多語言翻譯聊天、就近安全見面交易。免費本地二手 App，覆蓋全墨爾本，留學生與租屋族都愛用。",
    h1: "墨爾本二手交易平台",
    inLanguage: "zh-TW",
    sections: [
      {
        heading: "以社區為先的二手平台，而非雜亂的全城資訊流",
        paragraphs: [
          "PopOut Market 是一款貼近在地交易習慣的墨爾本二手平台。一筆墨爾本二手買賣能否順利成交，往往取決於一個問題：東西是不是夠近，方便當面查看、取貨、輕鬆搬回家？PopOut 把這一點放在核心，優先向你展示住處、學校或公司附近的中古好物。",
          "與其把整座城市堆成看不到盡頭的資訊流，這個墨爾本二手平台更看重按社區瀏覽、清楚溝通，以及從看中到見面的順暢流程。對於幅員遼闊的墨爾本而言，正是這種貼近在地的本地二手體驗，才讓瀏覽真正變成成交。",
        ],
      },
      {
        heading: "墨爾本二手買賣怎麼進行",
        paragraphs: [
          "在 PopOut 上做墨爾本二手交易，全程圍繞短距離、同社區取貨而設計，交易又快又省心。",
        ],
        list: [
          "幾分鐘上架：上傳幾張照片，配上簡短描述，就能把閒置物品刊登出去。",
          "按社區發現：買家優先瀏覽附近的中古好物，取貨距離與時間都很實際。",
          "多語言聊天：直接與對方溝通，內建翻譯功能，跨語言對話也毫無隔閡。",
          "就近安全見面：約在公開、便利的地點碰面，再透過更清楚的 App 內流程確認取貨。",
        ],
      },
      {
        heading: "大家都在買賣什麼",
        paragraphs: [
          "最熱門的分類真實反映了墨爾本的生活樣貌，尤其是公寓、合租房與學生宿舍周邊：床、書桌、沙發等二手家具；雪櫃、微波爐、洗衣機等二手電器；廚房用品與居家雜貨；單車與電動滑板車；電子產品與居家學習設備；以及搬入搬出季時，墨爾本留學生二手出清的整批好物。",
        ],
      },
      {
        heading: "立足 CBD，覆蓋全墨爾本",
        paragraphs: [
          "墨爾本 CBD 是平台最熱絡的核心區。密集的公寓生活、大學聚集，加上頻繁的搬入搬出週期，持續帶動對家具、電器與日常用品的墨爾本中古需求，這些都能就近取貨。",
          "但這個墨爾本二手拍賣平台並不只限於 CBD。由於採用按社區發現，無論你在 Carlton、Parkville、Southbank、Docklands、Fitzroy、North Melbourne、South Wharf 還是更遠的郊區，都能與身邊的人快速完成墨爾本二手交易。相較於 Facebook Marketplace、Gumtree 這類大而全的分類資訊網，它更聚焦在地，也是旋轉拍賣（Carousell）之外更專注墨爾本本地二手的替代選擇。",
        ],
      },
    ],
    faq: [
      {
        q: "墨爾本二手交易平台哪個好用？",
        a: "PopOut Market 是一款以社區為先的墨爾本二手交易平台。它不是把全州資訊全堆在一個清單裡，而是優先展示你住處、就學或工作附近的中古好物，因此你看到的東西都夠近，方便當面查看與取貨。",
      },
      {
        q: "在墨爾本要怎麼二手買賣？",
        a: "賣家只需幾分鐘，上傳照片與簡短描述就能上架物品；買家按社區瀏覽，在聊天中聯絡賣家、約好時間，就近見面完成墨爾本二手交易。整個流程都圍繞短距離、同社區取貨展開。",
      },
      {
        q: "墨爾本有免費的二手 App 嗎？",
        a: "有。PopOut Market 是一款免費的墨爾本二手 App，支援按社區發現、App 內聊天與更安全的見面流程，下載後即可在全墨爾本進行二手買賣。",
      },
      {
        q: "墨爾本二手平台有哪些可以取代旋轉拍賣或 Facebook Marketplace 的選擇？",
        a: "PopOut 專為墨爾本本地二手交易打造：社區優先發現、內建翻譯的多語言聊天，以及更清楚、更安全的見面協調，省去在大型分類資訊流或旋轉拍賣（Carousell）裡無止盡滑動的麻煩。",
      },
      {
        q: "墨爾本哪裡可以賣二手家具和電器？",
        a: "你可以在 PopOut Market 上刊登二手家具、二手電器、廚具、單車與電子產品，觸及同一社區的買家，讓笨重大件也能就近查看、輕鬆取貨。",
      },
    ],
    faqHeading: "常見問題",
    relatedHeading: "相關頁面",
    related: [
      { href: "/market", label: "瀏覽墨爾本二手好物" },
      { href: "/melbourne-second-hand-app", label: "墨爾本二手 App" },
      { href: "/melbourne-second-hand-market", label: "了解墨爾本二手市場怎麼運作" },
    ],
  },
  ja: {
    title: "メルボルンの中古売買アプリ | PopOut Market 地元のフリマアプリ",
    description:
      "PopOut Market はメルボルンの中古売買アプリ。家具・家電・生活用品を地域ごとに探して、多言語チャットでやり取りし、近くで安全に手渡しできます。メルボルン全域に対応した地元のフリマアプリです。",
    h1: "メルボルンの中古売買アプリ",
    inLanguage: "ja",
    sections: [
      {
        heading: "州全体のフィードではなく、地域に根ざした中古マーケット",
        paragraphs: [
          "PopOut Market は、実際の地元での取引のかたちに合わせて作られたメルボルンの中古売買アプリです。中古の取引がうまくいくかどうかは、結局ひとつの問いに集約されます。その品物は、直接見て、受け取って、家まで持ち帰れるくらい近いか。PopOut はこの点を中心に据え、あなたが暮らし、学び、働く場所の近くにある出品をまず表示します。",
          "州全体をひとつの果てしないフィードにまとめてしまうのではなく、このアプリは地域ごとの絞り込み、わかりやすいやり取り、そして出品を見つけてから待ち合わせるまでのスムーズな流れを大切にしています。広く分散したメルボルンでは、こうした地元中心の中古取引こそが、ただ眺めるだけだった行動を実際の成約へと変えてくれます。",
        ],
      },
      {
        heading: "メルボルンでの中古売買の流れ",
        paragraphs: [
          "PopOut での売買は、近場・同じエリア内での手渡しを軸に設計されているので、取引がすばやく手軽に完結します。",
        ],
        list: [
          "数分で出品: 写真を数枚と短い説明を添えるだけで、不用品を出品できます。",
          "地域で発見: 買い手はまず近くの出品から見るので、受け渡しの距離や時間が現実的です。",
          "多言語チャット: 翻訳機能を内蔵し、言語の壁を越えて相手と直接やり取りできます。",
          "安全に待ち合わせ: 公共の便利な場所で会い、わかりやすいアプリ内の手順にそって受け渡しを確認します。",
        ],
      },
      {
        heading: "みんなが売買しているもの",
        paragraphs: [
          "とくに活発なカテゴリは、アパートやシェアハウス、学生寮まわりを中心とした、リアルなメルボルン生活をそのまま映しています。ベッド・デスク・ソファなどの中古家具、冷蔵庫・電子レンジ・洗濯機などの中古家電、キッチン用品や生活雑貨、自転車や電動キックボード、パソコンなどの電子機器、勉強用のデスク環境、そして入居・退去シーズンに留学生がまとめて手放す不用品まで、幅広く取引されています。",
        ],
      },
      {
        heading: "CBD を中心に、メルボルン全域で",
        paragraphs: [
          "メルボルン CBD はもっとも活発なエリアです。密集したアパート暮らし、大学の活気、そして入居・退去の速いサイクルが、近くで受け取れる家具・家電・日用品への需要を絶え間なく生み出しています。",
          "ただし、このアプリが活躍するのは CBD だけではありません。地域ベースで探せるので、Carlton、Parkville、Southbank、Docklands、Fitzroy、North Melbourne、South Wharf、さらにその先の郊外にいても、近くの人とすばやく中古品の売買ができます。Facebook Marketplace や Gumtree のような幅広い分類掲示板にくらべて、より地元に絞り込めるのがこのアプリの特長です。",
        ],
      },
    ],
    faq: [
      {
        q: "メルボルンの中古アプリでおすすめはどれですか。",
        a: "PopOut Market は地域を最優先にしたメルボルンの中古売買アプリです。州全体の出品をひとつのリストに詰め込むのではなく、暮らし・学び・働く場所の近くの出品をまず表示するので、直接見て受け取れるくらい近い品物に出会えます。",
      },
      {
        q: "メルボルンで中古売買はどうやってするのですか。",
        a: "出品者は写真と短い説明を添えて数分で品物を出品し、買い手は地域ごとに探したうえでチャットで連絡を取り、時間を決めて近くで会って取引を済ませます。すべての流れが、近場・同じエリア内での手渡しを軸に設計されています。",
      },
      {
        q: "メルボルンの中古マーケットアプリは無料ですか。",
        a: "はい。PopOut Market はメルボルン全域で中古品を売買できる無料のフリマアプリで、地域ごとの発見、アプリ内チャット、より安全な手渡しの手順を備えています。",
      },
      {
        q: "メルボルンで Gumtree や Facebook Marketplace の代わりになる中古アプリはありますか。",
        a: "PopOut はメルボルンでの地元の直接取引に特化しています。地域優先の発見、翻訳機能を内蔵した多言語チャット、よりわかりやすく安全な待ち合わせの調整を備えているので、果てしない総合フィードをスクロールする必要がありません。",
      },
      {
        q: "メルボルンで中古家具や家電はどこで売れますか。",
        a: "PopOut Market に中古の家具・家電・キッチン用品・自転車・電子機器を出品すれば、同じ地域の買い手に届けられます。大きくて重い品物も、近くで実物を見て手軽に受け取ってもらえます。",
      },
    ],
    faqHeading: "よくある質問",
    relatedHeading: "関連ページ",
    related: [
      { href: "/market", label: "メルボルンの中古出品を見る" },
      { href: "/melbourne-second-hand-app", label: "メルボルンの中古アプリ" },
      { href: "/melbourne-second-hand-market", label: "メルボルンの中古市場の仕組み" },
    ],
  },
  en: {
    title: "Melbourne Second-Hand Marketplace | Buy & Sell Locally with PopOut Market",
    description:
      "PopOut Market is the Melbourne second-hand marketplace app for buying and selling locally. Browse furniture, appliances and home essentials by suburb, chat across languages, and meet up safely across the city.",
    h1: "Melbourne Second-Hand Marketplace",
    inLanguage: "en-AU",
    sections: [
      {
        heading: "A neighbourhood-first marketplace, not a flat city feed",
        paragraphs: [
          "PopOut Market is a Melbourne second-hand marketplace built around how local trading actually happens. Most successful second-hand trades come down to one question: is the item close enough to inspect, collect and carry home without a long trip? PopOut puts that front and centre by showing you listings near where you live, study or work.",
          "Instead of treating the whole state as one endless feed, the platform emphasises suburb-level browsing, clearer communication, and a smoother path from finding a listing to meeting up. For a city as spread out as Melbourne, that local focus is what turns browsing into completed trades.",
        ],
      },
      {
        heading: "How the marketplace works",
        paragraphs: [
          "Buying and selling on PopOut is built around short-distance, same-area pickups, so trades finish quickly and conveniently.",
        ],
        list: [
          "Post in minutes: add a few photos and a short description to list an item.",
          "Discover by suburb: buyers browse what is nearby first, so pickup distance and timing stay realistic.",
          "Chat across languages: message the other person directly, with support for communicating across languages.",
          "Meet up safely: arrange a public, convenient meetup and confirm the pickup with a clearer in-app flow.",
        ],
      },
      {
        heading: "What people buy and sell",
        paragraphs: [
          "The most active categories reflect real Melbourne living, especially around apartments, share houses and student accommodation: furniture like beds, desks and sofas; appliances such as fridges, microwaves and washing machines; kitchen and homewares; bikes and e-scooters; electronics and study setups; and student move-in and clear-out bundles.",
        ],
      },
      {
        heading: "Centred on the CBD, useful across the city",
        paragraphs: [
          "The Melbourne CBD is our busiest hub. Dense apartment living, university activity, and fast move-in and move-out cycles create steady demand for furniture, appliances and everyday essentials that can be collected nearby.",
          "But the platform is not limited to the CBD. Because discovery is suburb-based, anyone in Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, South Wharf and beyond can use the app to trade quickly with people close to them. It is a focused, local alternative to broad classifieds like Facebook Marketplace and Gumtree.",
        ],
      },
    ],
    faq: [
      {
        q: "what is the best second-hand marketplace in Melbourne?",
        a: "PopOut Market is a neighbourhood-first second-hand marketplace app for Melbourne. Instead of one flat, statewide feed, it shows you listings near where you actually live, study or work, so the things you find are realistically close enough to inspect and collect.",
      },
      {
        q: "how do I buy and sell second-hand stuff in Melbourne?",
        a: "Sellers post an item in a few minutes with photos and a quick description. Buyers browse by suburb, message the seller in the chat, agree on a time, and meet locally to complete the trade. The whole flow is built around short-distance, same-area pickups.",
      },
      {
        q: "is PopOut a free Melbourne marketplace app?",
        a: "Yes. PopOut Market is a free app for buying and selling second-hand items across Melbourne, with suburb-based discovery, in-app chat and a safer meetup flow.",
      },
      {
        q: "what is a good alternative to Facebook Marketplace and Gumtree in Melbourne?",
        a: "PopOut is designed specifically for local Melbourne trading: suburb-first discovery, multilingual chat with built-in translation, and clearer, safer meetup coordination, rather than scrolling an endless general classifieds feed.",
      },
      {
        q: "where can I sell used furniture and appliances in Melbourne?",
        a: "You can list furniture, appliances, kitchenware, bikes and electronics on PopOut Market and reach buyers in your own suburb, which makes heavy items easy to inspect and collect nearby.",
      },
    ],
    faqHeading: "FAQ",
    relatedHeading: "Related pages",
    related: [
      {
        href: "/market",
        label: "Browse Melbourne listings",
      },
      {
        href: "/melbourne-second-hand-app",
        label: "Melbourne second-hand app",
      },
      {
        href: "/melbourne-second-hand-market",
        label: "How the Melbourne second-hand market works",
      },
    ],
  },
  "zh-Hans": {
    title: "墨尔本二手交易平台 | PopOut Market 同城二手买卖",
    description:
      "PopOut Market 是面向墨尔本的二手交易平台，按社区浏览家具、电器与生活好物，多语言聊天、就近安全见面交易。同城二手买卖，覆盖全墨尔本。",
    h1: "墨尔本二手交易平台",
    inLanguage: "zh-CN",
    sections: [
      {
        heading: "以社区为先的二手平台，而非杂乱的全城信息流",
        paragraphs: [
          "PopOut Market 是一款贴合本地交易习惯的墨尔本二手交易平台。一笔二手买卖能否顺利成交，往往取决于一个问题：东西是不是足够近，方便当面查看、取货、轻松搬回家？PopOut 把这一点放在核心，优先向你展示居住地、学校或公司附近的闲置好物。",
          "与其把整座城市堆成看不到尽头的信息流，这个二手平台更看重按社区浏览、清晰沟通，以及从看中到见面的顺畅流程。对于幅员辽阔的墨尔本来说，正是这种同城二手交易的本地化，才让浏览真正变成成交。",
        ],
      },
      {
        heading: "墨尔本二手买卖怎么进行",
        paragraphs: ["在 PopOut 上买卖，全程围绕短距离、同城区取货而设计，交易又快又省心。"],
        list: [
          "几分钟发布：上传几张照片，配上简短描述即可挂出闲置物品。",
          "按社区发现：买家优先浏览附近的闲置好物，取货距离与时间都很现实。",
          "多语言聊天：直接与对方沟通，支持跨语言交流。",
          "就近安全见面：约在公共、便利的地点见面，并通过更清晰的应用内流程确认取货。",
        ],
      },
      {
        heading: "大家都在买卖什么",
        paragraphs: [
          "最活跃的分类真实反映了墨尔本的生活方式，尤其是公寓、合租房与学生公寓周边：床、书桌、沙发等二手家具；冰箱、微波炉、洗衣机等二手电器；厨房用品与家居杂货；自行车与电动滑板车；电子产品与居家学习设备；以及搬入搬出季的学生闲置打包出售。",
        ],
      },
      {
        heading: "立足 CBD，覆盖全墨尔本",
        paragraphs: [
          "墨尔本 CBD 是平台最活跃的核心区。密集的公寓生活、大学聚集，以及频繁的搬入搬出，持续催生对家具、电器和日常用品的同城二手需求。",
          "但这个二手买卖平台并不局限于 CBD。由于按社区发现，无论你在 Carlton、Parkville、Southbank、Docklands、Fitzroy、North Melbourne、South Wharf 还是更远的郊区，都能与身边的人快速完成墨尔本闲置交易。相比 Facebook Marketplace、Gumtree 等大而全的分类信息站，它是更聚焦本地的同城二手选择。",
        ],
      },
    ],
    faq: [
      {
        q: "墨尔本二手交易平台哪个好用？",
        a: "PopOut Market 是一款以社区为先的墨尔本二手交易平台。它不是把全州信息堆在一个列表里，而是优先展示你居住、学习或工作附近的闲置好物，因此你看到的东西都足够近，方便当面查看和取货。",
      },
      {
        q: "在墨尔本怎么二手买卖？",
        a: "卖家只需几分钟，上传照片和简短描述即可发布物品；买家按社区浏览，在聊天中联系卖家、约好时间，就近见面完成交易。整个流程都围绕短距离、同城区取货展开。",
      },
      {
        q: "墨尔本有免费的二手平台 App 吗？",
        a: "有。PopOut Market 是一款免费的墨尔本二手买卖平台，支持按社区发现、应用内聊天和更安全的见面流程，下载即可在全墨尔本买卖闲置。",
      },
      {
        q: "墨尔本二手交易网站有哪些替代 Facebook Marketplace 的选择？",
        a: "PopOut 专为墨尔本同城二手交易打造：按社区优先发现、内置翻译的多语言聊天，以及更清晰、更安全的见面协调，省去在大型分类信息流里无休止滑动的烦恼。",
      },
      {
        q: "墨尔本哪里可以卖二手家具和电器？",
        a: "你可以在 PopOut Market 上发布二手家具、电器、厨具、自行车和电子产品，触达同一社区的买家，让笨重大件也能就近查看、轻松取货。",
      },
    ],
    faqHeading: "常见问题",
    relatedHeading: "相关页面",
    related: [
      {
        href: "/market",
        label: "浏览墨尔本二手好物",
      },
      {
        href: "/melbourne-second-hand-app",
        label: "墨尔本二手 App",
      },
      {
        href: "/melbourne-second-hand-market",
        label: "了解墨尔本二手市场怎么运作",
      },
    ],
  },
  ko: {
    title: "멜버른 중고 거래 플랫폼 | PopOut Market 동네 직거래",
    description:
      "PopOut Market은 멜버른 중고 거래 플랫폼입니다. 동네별로 가구·가전·생활용품을 둘러보고, 다국어 채팅으로 대화하며, 가까운 곳에서 안전하게 직거래하세요.",
    h1: "멜버른 중고 거래 플랫폼",
    inLanguage: "ko",
    sections: [
      {
        heading: "전체 피드가 아닌, 동네 중심 중고마켓",
        paragraphs: [
          "PopOut Market은 실제 동네 거래 방식에 맞춰 만든 멜버른 중고 거래 플랫폼입니다. 중고 거래가 잘 성사되는지는 결국 한 가지로 정해집니다. 물건이 직접 보고, 받고, 들고 오기에 충분히 가까운가? PopOut은 바로 이 점을 중심에 두고 살고, 공부하고, 일하는 곳 근처의 매물을 먼저 보여줍니다.",
          "주 전체를 끝없는 목록 하나로 묶는 대신, 이 플랫폼은 동네 단위 탐색과 명확한 소통, 그리고 매물 발견에서 만남까지 이어지는 매끄러운 흐름을 중시합니다. 넓게 퍼진 멜버른에서는 이런 동네 중심의 직거래가 단순한 구경을 실제 거래로 바꿔 줍니다.",
        ],
      },
      {
        heading: "멜버른 중고 거래, 이렇게 진행돼요",
        paragraphs: [
          "PopOut에서의 사고팔기는 짧은 거리, 같은 지역 픽업을 중심으로 설계되어 빠르고 편리하게 거래가 끝납니다.",
        ],
        list: [
          "몇 분 만에 등록: 사진 몇 장과 짧은 설명만으로 물건을 올립니다.",
          "동네별 발견: 구매자가 가까운 매물을 먼저 보므로 픽업 거리와 시간이 현실적입니다.",
          "다국어 채팅: 언어를 넘나드는 대화 지원으로 상대와 직접 소통합니다.",
          "안전한 직거래: 공개되고 편리한 장소에서 만나고, 명확한 앱 내 절차로 픽업을 확인합니다.",
        ],
      },
      {
        heading: "사람들이 사고파는 것들",
        paragraphs: [
          "가장 활발한 카테고리는 아파트, 셰어하우스, 학생 숙소 등 실제 멜버른 생활을 그대로 보여줍니다. 침대·책상·소파 같은 중고 가구, 냉장고·전자레인지·세탁기 같은 중고 가전, 주방·생활용품, 자전거와 전동 킥보드, 전자기기와 공부방 학습 장비, 그리고 입주·퇴거 시즌의 학생 일괄 정리 물품까지 다양합니다.",
        ],
      },
      {
        heading: "CBD를 중심으로, 멜버른 전역에서",
        paragraphs: [
          "멜버른 CBD는 가장 활발한 거점입니다. 밀집된 아파트 생활, 대학가의 활기, 빠른 입주·퇴거 주기가 가까이서 받을 수 있는 가구·가전·생활용품에 대한 꾸준한 동네 중고 수요를 만들어 냅니다.",
          "하지만 이 직거래 플랫폼은 CBD에만 머물지 않습니다. 동네 기반 탐색 덕분에 Carlton, Parkville, Southbank, Docklands, Fitzroy, North Melbourne, South Wharf는 물론 더 외곽에서도 가까운 이웃과 빠르게 거래할 수 있습니다. Facebook Marketplace나 Gumtree 같은 광범위한 중고 사이트보다 더 동네에 집중한 대안입니다.",
        ],
      },
    ],
    faq: [
      {
        q: "멜버른 중고 거래 플랫폼 어디가 좋아요?",
        a: "PopOut Market은 동네 중심의 멜버른 중고 거래 플랫폼입니다. 주 전체 매물을 한 목록에 몰아넣는 대신, 살고 공부하고 일하는 곳 근처 매물을 먼저 보여 주어 직접 보고 받기에 충분히 가까운 물건을 만날 수 있습니다.",
      },
      {
        q: "멜버른에서 중고거래 어떻게 하나요?",
        a: "판매자는 사진과 짧은 설명으로 몇 분 만에 물건을 올리고, 구매자는 동네별로 둘러본 뒤 채팅으로 연락해 시간을 정하고 가까운 곳에서 만나 거래를 마칩니다. 모든 과정이 짧은 거리, 같은 지역 픽업을 중심으로 설계되어 있습니다.",
      },
      {
        q: "멜버른 중고마켓 앱 무료인가요?",
        a: "네. PopOut Market은 멜버른 전역에서 중고 물품을 사고팔 수 있는 무료 앱으로, 동네별 발견, 앱 내 채팅, 더 안전한 직거래 절차를 제공합니다.",
      },
      {
        q: "멜버른 중고거래 사이트 중 Gumtree나 Facebook Marketplace 대신 쓸 만한 곳은?",
        a: "PopOut은 멜버른 동네 직거래에 특화되어 있습니다. 동네 우선 탐색, 번역이 내장된 다국어 채팅, 더 명확하고 안전한 만남 조율을 제공해 끝없는 통합 중고 피드를 스크롤할 필요가 없습니다.",
      },
      {
        q: "멜버른에서 중고 가구랑 가전 어디서 팔아요?",
        a: "PopOut Market에 중고 가구, 가전, 주방용품, 자전거, 전자기기를 올려 같은 동네 구매자에게 닿을 수 있습니다. 덕분에 부피 큰 물건도 가까이서 보고 편하게 받을 수 있습니다.",
      },
    ],
    faqHeading: "자주 묻는 질문",
    relatedHeading: "관련 페이지",
    related: [
      {
        href: "/market",
        label: "멜버른 중고 매물 둘러보기",
      },
      {
        href: "/melbourne-second-hand-app",
        label: "멜버른 중고 앱",
      },
      {
        href: "/melbourne-second-hand-market",
        label: "멜버른 중고 시장 작동 방식",
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
