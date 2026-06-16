import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { localeFromParams, type LocaleParams } from "@/lib/server-locale";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/melbourne-second-hand-app";

type Section = { heading: string; paragraphs?: string[]; list?: string[] };

type PageContent = {
  title: string;
  description: string;
  h1: string;
  aboutThing: string;
  inLanguage: string;
  sections: Section[];
  faqHeading: string;
  faq: { q: string; a: string }[];
  relatedHeading: string;
  related: { href: string; label: string }[];
};

// en / zh-Hans / ko have full localized copy; other locales fall back to en.
const CONTENT: Partial<Record<Locale, PageContent>> & { en: PageContent } = {
    "es": {"title":"App de segunda mano Melbourne | Comprar y vender usado · PopOut Market","description":"PopOut Market es una app de segunda mano en Melbourne para comprar y vender cerca: muebles, electrodomésticos y bicis. Búsqueda por barrio, chat multilingüe con traducción y trato en persona más seguro, ideal para estudiantes.","h1":"App de segunda mano en Melbourne","inLanguage":"es","aboutThing":"app de segunda mano en Melbourne","sections":[{"heading":"Por qué una app local marca la diferencia en Melbourne","paragraphs":["En Melbourne, la compraventa de segunda mano ocurre sobre todo cerca de casa: edificios de apartamentos, zonas estudiantiles y barrios vecinos. Una app de segunda mano en Melbourne con enfoque local te ayuda a ver solo los anuncios que están lo bastante cerca para ir a verlos, recogerlos y cerrar el trato sin un viaje largo, aunque sea por un solo mueble.","En lugar de un único listado plano para todo el estado, PopOut prioriza la búsqueda por barrio (suburb), una comunicación más sencilla y un recorrido claro desde que encuentras el anuncio hasta que quedáis. Es a la vez una app de segunda mano en Melbourne, un mercado de segunda mano y una plataforma local de anuncios clasificados."]},{"heading":"Para quién es","list":["Estudiantes que montan o vacían su habitación cerca de universidades y campus.","Inquilinos y residentes de apartamentos por todo Melbourne que prefieren recoger cerca.","Compradores y vendedores locales que quieren chat multilingüe y una coordinación más clara.","Quienes se mudan en temporada de graduación y necesitan vender rápido sus artículos del día a día."]},{"heading":"Qué puedes comprar y vender","paragraphs":["Esta app de segunda mano en Melbourne es más activa con las cosas del día a día: lo que se necesita al mudarse, al dejar el piso o al renovar una habitación."],"list":["Muebles de segunda mano: camas, escritorios, sillas, sofás y armarios.","Electrodomésticos de segunda mano y menaje de cocina: neveras, microondas y utensilios.","Bicicletas, patinetes y equipo para estudiar o teletrabajar.","Lotes de mudanza y artículos usados para vaciar la casa en época de exámenes y graduación."]}],"faq":[{"q":"¿Qué app de segunda mano en Melbourne es buena para comprar y vender cerca de casa?","a":"Las apps más útiles te ayudan a ver anuncios cercanos, escribir con claridad y cerrar la recogida sin complicaciones. La búsqueda por barrio de PopOut es mucho más práctica que desplazarte por toda la ciudad sin rumbo: ideal para comprar y vender de segunda mano en Melbourne, justo al lado de casa."},{"q":"¿PopOut es una app gratis para vender de segunda mano en Melbourne?","a":"Sí. PopOut es una app de segunda mano en Melbourne gratuita y una plataforma local de anuncios de segunda mano: vendes y compras muebles, electrodomésticos, electrónica y bicicletas de segunda mano en todos los barrios de Melbourne."},{"q":"¿Es seguro hacer tratos de segunda mano en Melbourne?","a":"PopOut anima a quedar en persona en lugares públicos, concurridos y bien iluminados, y ofrece un proceso de cita y confirmación más claro para que ambas partes sepan qué esperar antes de verse. Así, el mercado de segunda mano en Melbourne resulta más tranquilo."},{"q":"¿Sirve para estudiantes que venden sus cosas usadas en Melbourne?","a":"Totalmente. Ya sea por una mudanza, el fin de los estudios o renovar el piso, los estudiantes pueden usar esta app de segunda mano en Melbourne para encontrar rápido un comprador o vendedor cercano, por barrio, con chat multilingüe y traducción automática que reduce la barrera del idioma."},{"q":"¿Cómo vender muebles y electrodomésticos de segunda mano en Melbourne?","a":"Solo tienes que publicar tu anuncio en PopOut: llegará a los compradores cercanos a tu barrio. Publicas muebles, electrodomésticos o bicicletas de segunda mano directamente en la app, acuerdas las condiciones por el chat multilingüe y luego quedáis para una recogida cercana y cerrar el trato de segunda mano en Melbourne."}],"faqHeading":"Preguntas frecuentes","relatedHeading":"Páginas relacionadas","related":[{"href":"/market","label":"Ver anuncios de segunda mano en Melbourne"},{"href":"/melbourne-second-hand-market","label":"Guía del mercado de segunda mano de Melbourne"},{"href":"/melbourne-second-hand-marketplace","label":"Plataforma de segunda mano de Melbourne"}]},
    "fr": {"title":"Appli d'occasion Melbourne | Acheter et vendre d'occasion · PopOut Market","description":"PopOut Market est une appli d'occasion à Melbourne pour acheter et vendre près de chez vous : meubles, électroménager, vélos. Recherche par quartier, chat multilingue traduit, transactions en main propre plus sûres, idéale pour les étudiants.","h1":"Appli d'occasion à Melbourne","inLanguage":"fr","aboutThing":"appli d'occasion à Melbourne","sections":[{"heading":"Pourquoi une appli locale change tout à Melbourne","paragraphs":["À Melbourne, la vente d'occasion se passe surtout près de chez soi : immeubles d'appartements, quartiers étudiants et faubourgs voisins. Une appli d'occasion à Melbourne axée sur le local vous aide à comparer uniquement les annonces assez proches pour être inspectées, récupérées et conclues sans long déplacement, ne serait-ce que pour un meuble d'occasion.","Plutôt qu'un seul fil interminable couvrant tout l'État, PopOut mise sur la recherche par quartier (suburb), une communication plus simple et un parcours clair, de la découverte de l'annonce jusqu'au rendez-vous. C'est à la fois une appli d'occasion à Melbourne, un marché de la seconde main et une plateforme de petites annonces locale."]},{"heading":"Pour qui c'est fait","list":["Les étudiants qui s'installent ou vident leur chambre près des universités et des campus.","Les locataires et résidents d'appartements partout à Melbourne qui préfèrent un retrait à proximité.","Les acheteurs et vendeurs locaux qui veulent un chat multilingue et une coordination plus claire.","Les personnes qui déménagent en fin d'année universitaire et veulent vendre vite leurs articles du quotidien."]},{"heading":"Ce que vous pouvez acheter et vendre","paragraphs":["Cette appli d'occasion à Melbourne est la plus active autour du quotidien : ce dont on a besoin quand on emménage, qu'on déménage ou qu'on rafraîchit une pièce."],"list":["Meubles d'occasion : lits, bureaux, chaises, canapés et armoires.","Électroménager d'occasion et matériel de cuisine : frigos, micro-ondes et ustensiles.","Vélos, trottinettes et équipements pour étudier ou télétravailler.","Lots d'emménagement et articles à liquider pendant les examens et la saison des diplômes."]}],"faq":[{"q":"Quelle appli d'occasion à Melbourne choisir pour acheter et vendre près de chez soi ?","a":"Les applis les plus utiles vous aident à parcourir les annonces à proximité, à échanger clairement et à finaliser le retrait sans complication. La recherche par quartier de PopOut est bien plus concrète qu'un défilement à l'échelle de toute la ville : idéale pour acheter et vendre d'occasion à Melbourne, tout près de chez vous."},{"q":"PopOut est-elle une appli gratuite pour vendre de la seconde main à Melbourne ?","a":"Oui. PopOut est une appli d'occasion à Melbourne gratuite et une plateforme locale de petites annonces : vous y vendez et achetez meubles d'occasion, électroménager d'occasion, électronique et vélos dans tous les quartiers de Melbourne."},{"q":"Les transactions d'occasion à Melbourne sont-elles sûres ?","a":"PopOut encourage les rencontres en main propre dans des lieux publics, fréquentés et bien éclairés, et propose un parcours de rendez-vous et de confirmation plus clair pour que les deux parties sachent à quoi s'attendre avant de se rencontrer, ce qui rend le marché de la seconde main à Melbourne plus rassurant."},{"q":"Cette appli convient-elle aux étudiants qui liquident leurs affaires à Melbourne ?","a":"Tout à fait. Que ce soit pour un déménagement, une fin d'études ou le réaménagement d'un appartement, les étudiants peuvent utiliser cette appli d'occasion à Melbourne pour trouver vite un acheteur ou un vendeur à proximité, par quartier, avec un chat multilingue traduit automatiquement qui réduit la barrière de la langue."},{"q":"Comment vendre des meubles d'occasion et de l'électroménager d'occasion à Melbourne ?","a":"Il suffit de publier votre annonce sur PopOut : elle touche les acheteurs proches de votre quartier. Vous publiez meubles d'occasion, électroménager d'occasion ou vélos directement dans l'appli, vous discutez des conditions via le chat multilingue, puis vous convenez d'un retrait à proximité pour conclure la transaction de seconde main à Melbourne."}],"faqHeading":"Questions fréquentes","relatedHeading":"Pages liées","related":[{"href":"/market","label":"Voir les annonces d'occasion à Melbourne"},{"href":"/melbourne-second-hand-market","label":"Guide du marché d'occasion de Melbourne"},{"href":"/melbourne-second-hand-marketplace","label":"Plateforme d'occasion de Melbourne"}]},
    "vi": {"title":"App đồ cũ Melbourne | Mua bán đồ cũ tại địa phương · PopOut Market","description":"PopOut Market là app đồ cũ Melbourne để mua bán đồ second-hand ngay gần bạn: nội thất cũ, đồ điện cũ, xe đạp. Tìm theo khu (suburb), chat đa ngôn ngữ có dịch tự động, giao dịch gặp mặt an toàn, hợp du học sinh thanh lý.","h1":"App đồ cũ Melbourne","inLanguage":"vi","aboutThing":"ứng dụng đồ cũ Melbourne","sections":[{"heading":"Vì sao nên dùng app đồ cũ Melbourne tại địa phương","paragraphs":["Tại Melbourne, việc mua bán đồ cũ phần lớn diễn ra ngay gần nơi bạn ở — các tòa căn hộ, khu sinh viên và những suburb lân cận. Một app đồ cũ Melbourne ưu tiên địa phương giúp bạn chỉ xem những tin đăng đủ gần để tới xem hàng, nhận đồ và hoàn tất giao dịch mà không phải đi xa chỉ vì một món nội thất cũ.","Thay vì dồn cả bang vào một danh sách dài lê thê, PopOut tập trung vào việc tìm kiếm theo khu (suburb), nhắn tin dễ dàng hơn và một quy trình rõ ràng từ lúc thấy tin đăng đến lúc hẹn gặp. Đây vừa là app đồ cũ Melbourne, vừa là chợ đồ cũ Melbourne và nền tảng mua bán đồ cũ Melbourne ngay tại địa phương."]},{"heading":"Phù hợp với ai","list":["Du học sinh cần sắm đồ hoặc thanh lý phòng gần các trường đại học và khu campus.","Người thuê nhà và cư dân căn hộ khắp Melbourne thích nhận đồ ở gần.","Người mua và người bán tại địa phương muốn chat đa ngôn ngữ và hẹn gặp rõ ràng hơn.","Người chuyển nhà mùa tốt nghiệp cần bán nhanh đồ gia dụng và nội thất."]},{"heading":"Có thể mua bán những gì","paragraphs":["App đồ second-hand Melbourne này sôi động nhất ở những món gắn với cuộc sống hằng ngày — những thứ người ta cần khi dọn vào, dọn ra hay làm mới căn phòng:"],"list":["Nội thất cũ: giường, bàn học, ghế, sofa, tủ quần áo.","Đồ điện cũ và đồ bếp: tủ lạnh, lò vi sóng, nồi niêu xoong chảo.","Xe đạp, xe scooter và đồ học tập / làm việc tại nhà.","Combo đồ dọn vào nhà và đồ thanh lý cuối kỳ vào mùa thi và mùa tốt nghiệp."]}],"faq":[{"q":"App đồ cũ Melbourne nào tốt để mua bán đồ second-hand tại địa phương?","a":"App đồ cũ hữu ích nhất là app giúp bạn xem được tin đăng ở gần, nhắn tin rõ ràng và nhận hàng nhẹ nhàng hơn. PopOut tìm đồ cũ theo từng khu (suburb) nên thực tế hơn nhiều so với việc lướt cả thành phố một cách mơ hồ, rất hợp cho ai muốn mua bán đồ cũ Melbourne ngay gần nhà."},{"q":"PopOut có phải là app mua bán đồ cũ Melbourne miễn phí không?","a":"Đúng vậy. PopOut là app đồ cũ Melbourne miễn phí và là nền tảng mua bán đồ cũ Melbourne tại địa phương, nơi bạn mua bán nội thất cũ, đồ điện cũ, đồ điện tử và xe đạp khắp các khu của Melbourne."},{"q":"Giao dịch đồ cũ ở Melbourne có an toàn không? Gặp mặt thế nào?","a":"PopOut khuyến khích gặp mặt giao dịch ở nơi công cộng, đông người và đủ ánh sáng, đồng thời cung cấp quy trình hẹn gặp và xác nhận rõ ràng hơn để cả hai bên đều nắm rõ kế hoạch trước khi gặp, giúp việc mua bán đồ cũ Melbourne yên tâm hơn."},{"q":"Du học sinh thanh lý đồ ở Melbourne có hợp dùng app này không?","a":"Rất hợp. Dù là chuyển nhà, thanh lý đồ cuối kỳ hay làm mới căn hộ, du học sinh đều có thể dùng app đồ cũ Melbourne này để nhanh chóng tìm người mua hoặc người bán ở gần theo từng khu, lại có chat đa ngôn ngữ kèm dịch tự động nên đỡ lo rào cản tiếng."},{"q":"Bán nội thất cũ và đồ điện cũ ở Melbourne thì làm sao?","a":"Bạn chỉ cần đăng tin trên PopOut là tin sẽ tới những người mua ở gần quanh khu bạn ở. Bạn đăng nội thất cũ, đồ điện cũ hay xe đạp ngay trên app, trao đổi điều kiện qua chat đa ngôn ngữ rồi hẹn nhận đồ gần nhà để hoàn tất giao dịch trong chợ đồ cũ Melbourne."}],"faqHeading":"Câu hỏi thường gặp","relatedHeading":"Trang liên quan","related":[{"href":"/market","label":"Xem đồ cũ đang bán ở Melbourne"},{"href":"/melbourne-second-hand-market","label":"Cẩm nang chợ đồ cũ Melbourne"},{"href":"/melbourne-second-hand-marketplace","label":"Nền tảng mua bán đồ cũ Melbourne"}]},
    "zh-Hant": {"title":"墨爾本二手 App | 二手交易平台與同城二手買賣 · PopOut Market","description":"PopOut Market 是墨爾本的二手 App 與同城二手平台：免費買賣二手家具、電器、數碼、單車等中古好物，按社區發現附近物品，支援多語言聊天與翻譯、更安全的當面交易，適合留學生搬家與畢業清倉，也是旋轉拍賣（Carousell）的在地替代。","h1":"墨爾本二手 App","inLanguage":"zh-TW","aboutThing":"墨爾本二手 App","sections":[{"heading":"為什麼要用本地的墨爾本二手 App","paragraphs":["在墨爾本，二手交易大多發生在你身邊——公寓大樓、學生區和鄰近社區。一個以在地為主的二手 App，能幫你只看那些距離合適、方便看貨和當面取貨的物品，不必為一件二手家具跑很遠。","PopOut 不會把全州混成一個又長又雜的清單，而是按社區（郊區）瀏覽，溝通更簡單，從看到物品到約見面取貨的流程也更清晰。它既是墨爾本二手交易 App，也是同城二手買賣平台，更是旋轉拍賣（Carousell）的在地替代選擇。"]},{"heading":"適合哪些人","list":["在大學和校園附近佈置或清空房間的留學生。","身處墨爾本各區、希望就近取貨的公寓租客和居民。","想要多語言溝通、約見更清楚的本地買家和賣家。","畢業季搬家、需要快速賣掉家具家電的人。"]},{"heading":"可以買賣什麼","paragraphs":["這款墨爾本二手買賣 App 最活躍的就是日常生活用品——搬入、搬出或換新時最常需要的東西："],"list":["二手家具：床、書桌、椅子、梳化、衣櫃等。","二手電器與廚房用品：雪櫃、微波爐、鍋具等。","單車、滑板車，以及讀書 / 在家工作的裝備。","入住套裝，以及考試季、畢業季的清倉中古閒置。"]}],"faq":[{"q":"墨爾本有哪些好用的二手 App 或二手平台？","a":"好用的墨爾本二手 App，關鍵是能瀏覽附近物品、溝通清楚、取貨省事。PopOut 按社區發現身邊的二手好物，比在全城範圍漫無目的地刷更實用，適合想就近做墨爾本同城二手買賣的人。"},{"q":"PopOut 是免費的墨爾本二手交易平台嗎？","a":"是的。PopOut 是一款免費的墨爾本二手 App 與同城二手平台，可以買賣二手家具、電器、數碼、單車等各種中古閒置，覆蓋墨爾本各個社區。"},{"q":"墨爾本二手交易安全嗎？要怎樣當面交易？","a":"PopOut 鼓勵在公共、光線充足的地點當面交易，並提供更清晰的約見與確認流程，讓買賣雙方在見面前就清楚安排，使墨爾本二手交易更放心。"},{"q":"適合留學生在墨爾本賣中古閒置嗎？","a":"很適合。無論是搬家、畢業清倉還是公寓換新，留學生都能用這款墨爾本二手 App 按社區快速找到附近的買家或賣家，多語言聊天也更省心。"},{"q":"PopOut 可以當作旋轉拍賣（Carousell）的墨爾本替代嗎？","a":"可以。如果你想找旋轉拍賣的在地替代，PopOut 是專為墨爾本打造的二手拍賣與二手買賣平台，按社區發現附近物品、支援多語言溝通，並有更安全的當面取貨流程，更貼近本地用家需求。"}],"faqHeading":"常見問題","relatedHeading":"相關頁面","related":[{"href":"/market","label":"瀏覽墨爾本在售二手"},{"href":"/melbourne-second-hand-market","label":"墨爾本二手市場介紹"},{"href":"/melbourne-second-hand-marketplace","label":"墨爾本二手交易平台"}]},
    "ja": {"title":"メルボルンの中古アプリ | 地元で売買できるフリマアプリ・PopOut Market","description":"PopOut Marketはメルボルンの中古アプリ・フリマアプリです。中古の家具や家電、自転車などを無料で売買でき、エリア別に近所の掘り出し物を探せます。多言語チャットと安全な手渡し取引に対応し、留学生の引っ越しや卒業前の不用品処分にもぴったりです。","h1":"メルボルンの中古アプリ","inLanguage":"ja","aboutThing":"メルボルンの中古アプリ","sections":[{"heading":"地元密着の中古アプリが便利な理由","paragraphs":["メルボルンでの中古売買は、その多くが自宅の近くで完結します。アパートが集まるエリア、大学周辺の学生街、すぐ隣の地区など、実際に足を運べる範囲が中心です。地元優先の中古アプリなら、無理なく見に行けて、その場で受け取って取引を終えられる、現実的な距離の出品だけを比べられます。家具ひとつのために遠くまで出かける必要はありません。","PopOut Marketは、州全体をひとつの長いリストにまとめて表示するのではなく、エリア（サバーブ）単位での閲覧、スムーズなやり取り、そして出品を見つけてから待ち合わせて受け渡すまでの流れのわかりやすさを大切にしています。メルボルンの中古売買アプリであり、地元のフリマアプリでもあります。"]},{"heading":"こんな方におすすめ","list":["大学やキャンパスの近くで、部屋の準備や片付けをしたい留学生の方。","近所での受け取りを好む、メルボルン各地のアパートや賃貸にお住まいの方。","多言語でのやり取りや、わかりやすい待ち合わせを求める地元の買い手・売り手の方。","卒業シーズンに引っ越しをして、生活用品をすばやく手放したい方。"]},{"heading":"売買できるもの","paragraphs":["このメルボルンの中古売買アプリでとくに活発なのは、日々の暮らしにまつわる品々です。入居や退去、模様替えのときに必要になるものが中心になっています。"],"list":["中古家具：ベッド、デスク、椅子、ソファ、ワードローブなど。","中古家電・キッチン用品：冷蔵庫、電子レンジ、調理器具など。","自転車、電動キックボード、勉強や在宅ワーク用のアイテム。","入居時のまとめ売りや、試験・卒業シーズンに出る不用品。"]}],"faq":[{"q":"メルボルンの中古アプリ・フリマアプリでおすすめはどれですか？","a":"使いやすい中古アプリの決め手は、近くの出品を手軽に見られること、相手とスムーズにやり取りできること、そして受け渡しを負担なく終えられることです。PopOut Marketはエリア別に近所の中古品を見つけられるので、街全体をあてもなくスクロールするより実用的で、近場で中古売買をしたい方に向いています。"},{"q":"PopOut Marketは無料で使えるメルボルンの中古売買アプリですか？","a":"はい。PopOut Marketは無料で使えるメルボルンの中古アプリで、地元の中古取引プラットフォームです。中古家具や家電、デジタル機器、自転車など、さまざまな不用品をメルボルン各エリアで売買できます。"},{"q":"メルボルンで中古品の手渡し・直接取引は安全ですか？","a":"PopOut Marketは、人目のある明るい公共の場所での直接取引をおすすめしており、待ち合わせや確認をわかりやすく進められる仕組みを用意しています。会う前に双方が段取りを把握できるので、地元での手渡し取引も安心して進められます。"},{"q":"留学生がメルボルンで不用品を売買するのに向いていますか？","a":"とても向いています。引っ越し、卒業前の片付け、部屋の模様替えなど、どんな場面でも、この中古アプリを使えばエリアごとに近くの買い手・売り手をすばやく見つけられます。多言語チャットにも対応しているので、言葉の心配も少なくて済みます。"},{"q":"メルボルンで中古の家具や家電を売るにはどうすればいいですか？","a":"PopOut Marketに出品すれば、お住まいのエリアを中心に近くの買い手へ届きます。中古の家具や家電、自転車などをアプリから手軽に出品でき、多言語チャットで条件を相談しながら、近場での手渡しで取引を完了できます。"}],"faqHeading":"よくある質問","relatedHeading":"関連ページ","related":[{"href":"/market","label":"メルボルンの中古品を見る"},{"href":"/melbourne-second-hand-market","label":"メルボルン中古マーケット案内"},{"href":"/melbourne-second-hand-marketplace","label":"メルボルンの中古取引プラットフォーム"}]},
  en: {
    title: "Melbourne Second-Hand App | Buy & Sell Locally with PopOut Market",
    description:
      "PopOut Market is a Melbourne second-hand app for local buying and selling, with suburb-based discovery, multilingual communication, and safer meetup workflows.",
    h1: "Melbourne Second-Hand App",
    aboutThing: "Melbourne second-hand app",
    inLanguage: "en-AU",
    sections: [
      {
        heading: "Why a local app matters in Melbourne",
        paragraphs: [
          "Melbourne second-hand trading mostly happens close to home — apartment towers, student areas and nearby suburbs. A local-first app helps you compare listings that are realistically close enough to inspect, collect and complete without a long trip.",
          "Instead of one flat, statewide feed, PopOut emphasises suburb-level browsing, easier communication and a clearer path from finding a listing to meeting up.",
        ],
      },
      {
        heading: "Who it is for",
        list: [
          "Students setting up or clearing out rooms near universities and campuses.",
          "Apartment residents and renters across Melbourne who prefer nearby pickup.",
          "Local buyers and sellers who want multilingual communication and clearer coordination.",
          "Graduation-season movers selling practical household items quickly.",
        ],
      },
      {
        heading: "What you can buy and sell",
        paragraphs: [
          "The app is most active around everyday Melbourne living — the things people need when they move in, move out, or refresh a room:",
        ],
        list: [
          "Furniture such as beds, desks, chairs, sofas and wardrobes.",
          "Appliances and kitchen gear like fridges, microwaves and cookware.",
          "Bikes, scooters and study or work-from-home setups.",
          "Move-in bundles and clear-out items around exam and graduation season.",
        ],
      },
    ],
    faqHeading: "FAQ",
    faq: [
      {
        q: "What makes a Melbourne second-hand app useful for local trading?",
        a: "The most useful apps help people browse nearby listings, message clearly, and finish pickups with less friction. Suburb-based discovery and clearer meetup coordination matter more than generic city-wide scrolling.",
      },
      {
        q: "Is PopOut a free buy-and-sell app for Melbourne?",
        a: "Yes. PopOut is a free second-hand app for buying and selling locally across Melbourne, from furniture and appliances to bikes and everyday essentials.",
      },
      {
        q: "Is PopOut designed only for students?",
        a: "No. PopOut is useful for students, apartment residents, recent movers and local households across Melbourne, not just one area.",
      },
    ],
    relatedHeading: "Related pages",
    related: [
      { href: "/market", label: "Browse Melbourne listings" },
      { href: "/melbourne-second-hand-market", label: "Melbourne second-hand market guide" },
      { href: "/melbourne-second-hand-marketplace", label: "Melbourne second-hand marketplace" },
    ],
  },

  "zh-Hans": {
    title: "墨尔本二手App | 二手交易软件与同城二手平台 · PopOut Market",
    description:
      "PopOut Market 是墨尔本的二手交易 App（二手软件 / 二手应用）和同城二手平台：免费买卖二手家具、电器、数码、自行车等闲置，按社区发现身边好物，多语言沟通 + 更安全的当面交易，适合留学生搬家和毕业清仓。",
    h1: "墨尔本二手 App",
    aboutThing: "墨尔本二手App",
    inLanguage: "zh-CN",
    sections: [
      {
        heading: "为什么用本地的墨尔本二手 App",
        paragraphs: [
          "在墨尔本，二手交易大多发生在你身边——公寓、学生区和附近社区。一个本地优先的二手 App（很多人也叫它二手软件、二手应用）能帮你只看那些距离合适、方便看货和当面取货的物品，不用为一件二手家具跑很远。",
          "PopOut 不是把全州混在一个长长的列表里，而是按社区 / 郊区浏览，沟通更简单，从看到商品到约见面取货的流程也更清晰。它既是墨尔本二手交易软件，也是同城二手买卖平台。",
        ],
      },
      {
        heading: "适合哪些人",
        list: [
          "在大学和校园附近布置或清空房间的留学生。",
          "墨尔本各区、希望就近取货的公寓租客和居民。",
          "想要多语言沟通、约见更清楚的本地买家和卖家。",
          "毕业季搬家、需要快速卖掉家具家电的人。",
        ],
      },
      {
        heading: "可以买卖什么",
        paragraphs: [
          "这款墨尔本二手买卖 App 最活跃的就是日常生活用品——搬入、搬出或换新时最常需要的东西：",
        ],
        list: [
          "二手家具：床、书桌、椅子、沙发、衣柜等。",
          "二手电器与厨房用品：冰箱、微波炉、锅具等。",
          "自行车、滑板车，以及学习 / 居家办公装备。",
          "入住套装，以及考试季、毕业季的清仓闲置。",
        ],
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        q: "墨尔本有哪些好用的二手 App 或二手软件？",
        a: "好用的墨尔本二手 App 关键是能浏览附近商品、沟通清楚、取货省事。PopOut 按社区发现身边二手好物，比在全城范围里漫无目的地刷更实用，适合想就近买卖二手的人。",
      },
      {
        q: "PopOut 是免费的墨尔本二手交易平台吗？",
        a: "是的。PopOut 是一款免费的墨尔本二手交易 App / 同城二手平台，可以买卖二手家具、电器、数码、自行车等各类闲置，覆盖墨尔本各个社区。",
      },
      {
        q: "墨尔本二手交易安全吗？怎么当面交易？",
        a: "PopOut 鼓励在公共、明亮的地点当面交易，并提供更清晰的约见与确认流程，让买卖双方在见面前就清楚安排，让墨尔本同城二手交易更放心。",
      },
      {
        q: "适合留学生在墨尔本卖闲置吗？",
        a: "很适合。无论是搬家、毕业清仓还是公寓换新，留学生都能用这款墨尔本二手软件按社区快速找到附近的买家或卖家，多语言沟通也更省心。",
      },
    ],
    relatedHeading: "相关页面",
    related: [
      { href: "/market", label: "浏览墨尔本在售二手" },
      { href: "/melbourne-second-hand-market", label: "墨尔本二手市场介绍" },
      { href: "/melbourne-second-hand-marketplace", label: "墨尔本二手交易平台" },
    ],
  },

  ko: {
    title: "멜버른 중고거래 앱 | 중고 거래 플랫폼·동네 중고마켓 · PopOut Market",
    description:
      "PopOut Market는 멜버른 중고거래 앱이자 동네 중고마켓·중고 거래 플랫폼입니다. 중고 가구, 가전, 전자기기, 자전거를 무료로 사고팔고, 동네별로 가까운 물건을 찾고, 다국어 채팅과 안전한 직거래로 거래하세요. 유학생 이사·졸업 정리에 딱 맞습니다.",
    h1: "멜버른 중고거래 앱",
    aboutThing: "멜버른 중고거래 앱",
    inLanguage: "ko",
    sections: [
      {
        heading: "왜 멜버른 중고거래 앱이 동네 기반이어야 할까요",
        paragraphs: [
          "멜버른에서 중고 거래는 대부분 집 근처에서 이루어집니다 — 아파트, 학생 밀집 지역, 가까운 동네. 동네 우선 중고 앱은 직접 보고 가져오기 좋은, 현실적으로 가까운 매물만 비교하게 해줘서 중고 가구 하나 때문에 멀리 갈 필요가 없습니다.",
          "PopOut은 주 전체를 하나의 긴 목록으로 보여주는 대신, 동네별 탐색과 더 쉬운 소통, 그리고 매물 발견부터 직거래 약속까지 더 명확한 과정을 제공합니다. 멜버른 중고 거래 플랫폼이자 동네 중고마켓입니다.",
        ],
      },
      {
        heading: "이런 분께 잘 맞아요",
        list: [
          "대학·캠퍼스 근처에서 방을 꾸미거나 정리하는 유학생.",
          "가까운 직거래를 선호하는 멜버른 전역의 아파트 거주자와 세입자.",
          "다국어 소통과 명확한 약속을 원하는 현지 구매자·판매자.",
          "졸업 시즌에 이사하며 생활용품을 빠르게 팔아야 하는 분.",
        ],
      },
      {
        heading: "무엇을 사고팔 수 있나요",
        paragraphs: [
          "이 멜버른 중고 거래 앱은 이사 들어오고 나갈 때, 방을 새로 꾸밀 때 필요한 일상용품 거래가 가장 활발합니다:",
        ],
        list: [
          "중고 가구: 침대, 책상, 의자, 소파, 옷장 등.",
          "중고 가전·주방용품: 냉장고, 전자레인지, 조리도구 등.",
          "자전거, 전동킥보드, 공부·재택근무 장비.",
          "입주 세트, 시험·졸업 시즌 정리 물품.",
        ],
      },
    ],
    faqHeading: "자주 묻는 질문",
    faq: [
      {
        q: "멜버른 중고거래 앱·중고 앱은 어떤 게 좋나요?",
        a: "좋은 멜버른 중고 앱은 가까운 매물을 둘러보고, 깔끔하게 소통하고, 직거래를 수월하게 마치도록 도와줍니다. PopOut은 동네별로 가까운 중고 물품을 보여줘서 도시 전체를 막연히 스크롤하는 것보다 실용적입니다.",
      },
      {
        q: "PopOut은 무료 멜버른 중고 거래 플랫폼인가요?",
        a: "네. PopOut은 무료 멜버른 중고거래 앱이자 동네 중고 거래 플랫폼으로, 중고 가구·가전·전자기기·자전거 등 다양한 물품을 멜버른 전역에서 사고팔 수 있습니다.",
      },
      {
        q: "멜버른 중고 직거래는 안전한가요?",
        a: "PopOut은 공공장소에서의 직거래를 권장하고, 약속과 확인을 더 명확하게 하는 흐름을 제공해서 만나기 전에 양쪽 모두 준비할 수 있도록 돕습니다.",
      },
      {
        q: "유학생이 멜버른에서 중고를 사고팔기에 좋나요?",
        a: "아주 좋습니다. 이사, 졸업 정리, 집 새단장 등 어떤 상황에서도 유학생은 이 멜버른 중고 거래 앱으로 동네에서 가까운 구매자·판매자를 빠르게 찾고 다국어로 소통할 수 있습니다.",
      },
    ],
    relatedHeading: "관련 페이지",
    related: [
      { href: "/market", label: "멜버른 중고 매물 둘러보기" },
      { href: "/melbourne-second-hand-market", label: "멜버른 중고 시장 안내" },
      { href: "/melbourne-second-hand-marketplace", label: "멜버른 중고마켓" },
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
    alternates: {
      canonical: selfPath,
      languages: localizedAlternates(PATH),
    },
    openGraph: {
      title: c.title,
      description: c.description,
      url: `${siteUrl().replace(/\/$/, "")}${selfPath}`,
      type: "website",
      siteName: "PopOut Market",
    },
  };
}

export default async function MelbourneSecondHandAppPage({ params }: LocaleParams) {
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
        about: { "@type": "Thing", name: c.aboutThing },
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
    <section className={`${SHELL_X} flex flex-1 flex-col py-10`}>
      <div className={`${INNER_MAX} max-w-4xl`}>
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
                <h3 className="text-sm font-semibold text-gray-900">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{item.a}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

export { localeStaticParams as generateStaticParams } from "@/lib/locale-static-params";
export const dynamic = "force-static";
