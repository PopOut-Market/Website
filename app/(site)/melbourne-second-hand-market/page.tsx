import { INNER_MAX, SHELL_X } from "@/lib/site-config";
import { getServerLocale } from "@/lib/server-locale";
import { localizedAlternates, siteUrl } from "@/lib/seo";
import { toLocalePath } from "@/lib/site-locale-routing";
import type { Locale } from "@/lib/site-i18n";
import type { Metadata } from "next";
import Link from "next/link";

const PATH = "/melbourne-second-hand-market";

type Section = { heading: string; paragraphs?: string[]; list?: string[] };

type PageContent = {
  title: string;
  description: string;
  h1: string;
  inLanguage: string;
  sections: Section[];
  faqHeading: string;
  faq: { q: string; a: string }[];
  relatedHeading: string;
  related: { href: string; label: string }[];
};

// en / zh-Hans / ko have full localized copy; other locales fall back to en.
const CONTENT: Partial<Record<Locale, PageContent>> & { en: PageContent } = {
    "es": {"title":"Mercado de segunda mano Melbourne | App local de compra y venta · PopOut Market","description":"Descubre cómo funciona el mercado de segunda mano en Melbourne: compra y vende artículos usados por barrio y encuentra muebles y electrodomésticos de segunda mano cerca de ti.","h1":"Mercado de segunda mano en Melbourne","inLanguage":"es","sections":[{"heading":"Cómo funciona la compra y venta de segunda mano en Melbourne","paragraphs":["En un mercado de segunda mano real en Melbourne, a la gente no solo le importa el precio. También influye lo fácil que sea recoger el artículo, si el vendedor está en el mismo barrio, si responde rápido a los mensajes y si la entrega llega a tiempo para una mudanza de entrada o de salida. Son esos factores prácticos los que deciden si un anuncio resulta realmente útil.","PopOut Market está pensado justo en torno a esas realidades: descubrimiento por barrio (suburb), chat multilingüe con traducción automática, respuestas sugeridas por IA y una organización más clara de las quedadas para quienes compran y venden de segunda mano dentro de Melbourne, en lugar de un listado nacional impersonal. Es a la vez un mercado de segunda mano en Melbourne y una plataforma de compraventa de artículos usados de proximidad."]},{"heading":"Los casos en los que mejor encaja","list":["Mudanza de estudiantes: camas, escritorios y utensilios de cocina son más fáciles de comparar y elegir cuando el punto de recogida queda cerca de donde vives, y comprar de segunda mano reduce el gasto.","Mudanza tras graduarse: una conexión local más rápida ayuda a los vendedores a vender sus artículos usados antes de que termine el contrato de alquiler o llegue el vuelo de vuelta.","Vida en apartamento: una distancia de recogida corta reduce las complicaciones de los muebles de segunda mano voluminosos y permite la entrega en mano el mismo día."]},{"heading":"En todo Melbourne, con el CBD como centro","paragraphs":["El CBD y los apartamentos del centro son la parte más animada del mercado de segunda mano local, impulsada por la alta densidad y los ciclos frecuentes de entrada y salida de inquilinos. Pero esta lógica de compraventa de proximidad funciona en todo Melbourne: como los anuncios se muestran por barrio, estés donde estés en la ciudad puedes encontrar muebles de segunda mano, electrodomésticos de segunda mano y otros artículos usados, y cerrar el trato rápido con alguien cercano. Tanto si quieres explorar los anuncios de segunda mano de Melbourne, buscar gangas estilo mercadillo o simplemente revender tus cosas, la app de segunda mano de Melbourne está hecha para ello."]}],"faq":[{"q":"¿Qué significa realmente \"mercado de segunda mano en Melbourne\"?","a":"Puede referirse a muchas cosas: plataformas de anuncios clasificados locales, apps de compra y venta, mercados de segunda mano por barrio o comunidades de artículos usados en general. La mayoría de la gente busca sobre todo un sitio práctico para ver e intercambiar artículos cercanos, más que un directorio genérico de clasificados. PopOut Market es justo ese tipo de plataforma de segunda mano en Melbourne."},{"q":"¿Dónde comprar y vender de segunda mano cerca de mí en Melbourne?","a":"PopOut Market muestra los anuncios de segunda mano por barrio (suburb): puedes explorar muebles de segunda mano, electrodomésticos de segunda mano y artículos del día a día cerca de donde vives y organizar una entrega en mano próxima. La app funciona en todo Melbourne."},{"q":"¿En qué se diferencia una app de segunda mano de Melbourne de Gumtree o un mercadillo?","a":"Un mercadillo tiene lugar y fecha fijos, y las plataformas de clasificados generales son muy amplias. Una app de segunda mano de Melbourne como PopOut Market se centra en el intercambio de proximidad: búsqueda por barrio, chat multilingüe con traducción automática, respuestas sugeridas por IA y prioridad a una entrega en mano más segura, para comprar y vender artículos usados de forma más flexible y eficaz."},{"q":"¿Cómo venden los estudiantes sus cosas de segunda mano en Melbourne?","a":"Al mudarse, irse tras graduarse o renovar muebles, los estudiantes usan PopOut Market para encontrar rápido a un comprador o vendedor cercano gracias a la búsqueda por barrio, y luego se comunican por el chat multilingüe con traducción automática, sin barrera del idioma. Así, revender de segunda mano en Melbourne resulta mucho más sencillo."},{"q":"¿PopOut Market es gratis y seguro?","a":"PopOut Market es una app de segunda mano de Melbourne totalmente gratuita. Como los anuncios son locales y tú mismo fijas la quedada en un lugar conocido cerca de tu casa, la entrega en mano es más cómoda y segura, lo que la hace ideal para estudiantes internacionales, inquilinos y quienes viven en apartamento."}],"faqHeading":"Preguntas frecuentes","relatedHeading":"Páginas relacionadas","related":[{"href":"/market","label":"Ver artículos de segunda mano en venta en Melbourne"},{"href":"/melbourne-second-hand-app","label":"App de segunda mano Melbourne"},{"href":"/melbourne-second-hand-marketplace","label":"Plataforma de segunda mano Melbourne"}]},
    "fr": {"title":"Marché d'occasion Melbourne | Plateforme locale d'achat-vente · PopOut Market","description":"Découvrez le marché d'occasion à Melbourne : achetez et vendez d'occasion par quartier, trouvez meubles et électroménager d'occasion près de chez vous, avec chat multilingue et remise en main propre.","h1":"Marché d'occasion à Melbourne","inLanguage":"fr","sections":[{"heading":"Comment fonctionne l'achat-vente d'occasion à Melbourne","paragraphs":["Sur un vrai marché d'occasion à Melbourne, les gens ne regardent pas que le prix. Ils tiennent aussi compte de la facilité de récupération, du fait d'habiter le même quartier, de la réactivité du vendeur et de savoir si l'article arrive à temps pour un emménagement ou un déménagement. Ce sont ces critères concrets qui déterminent si une petite annonce est vraiment utile.","PopOut Market est pensé autour de ces réalités : découverte par quartier (suburb), chat multilingue avec traduction automatique, réponses suggérées par l'IA et organisation plus claire des rendez-vous pour celles et ceux qui achètent et vendent d'occasion au sein même de Melbourne, plutôt qu'au milieu d'une liste nationale impersonnelle. C'est à la fois un marché d'occasion à Melbourne et une plateforme de seconde main de proximité."]},{"heading":"Les cas d'usage les plus adaptés","list":["Emménagement étudiant : lits, bureaux et ustensiles de cuisine sont plus faciles à comparer et à choisir quand le point de retrait reste proche de chez vous, et acheter d'occasion fait baisser la facture.","Déménagement après les études : une mise en relation locale plus rapide aide les vendeurs à écouler leurs articles d'occasion avant la fin du bail ou le vol retour.","Vie en appartement : une courte distance de récupération réduit la corvée des meubles d'occasion encombrants et permet une remise en main propre le jour même."]},{"heading":"Partout dans Melbourne, avec le CBD pour épicentre","paragraphs":["Le CBD et les appartements du centre forment la partie la plus animée du marché d'occasion local, portée par une forte densité et des cycles d'emménagement et de départ fréquents. Mais cette logique de seconde main de proximité fonctionne dans tout Melbourne : comme les annonces s'affichent par quartier, où que vous soyez dans la ville, vous pouvez trouver des meubles d'occasion, de l'électroménager d'occasion et d'autres articles d'occasion, puis conclure rapidement avec une personne proche. Que vous vouliez parcourir les petites annonces de Melbourne, dénicher de bonnes affaires façon vide-grenier ou simplement revendre vos affaires, l'appli d'occasion à Melbourne s'y prête."]}],"faq":[{"q":"Que désigne vraiment l'expression « marché d'occasion à Melbourne » ?","a":"Cette expression peut renvoyer à beaucoup de choses : plateformes de petites annonces locales, applis d'achat-vente, marchés d'occasion par quartier ou communautés de seconde main en général. La plupart des gens cherchent surtout un endroit pratique pour parcourir et échanger des articles à proximité, plutôt qu'un annuaire de petites annonces générique. PopOut Market est exactement ce type de plateforme d'occasion à Melbourne."},{"q":"Où acheter et vendre d'occasion près de chez moi à Melbourne ?","a":"PopOut Market affiche les annonces d'occasion par quartier (suburb) : vous pouvez parcourir les meubles d'occasion, l'électroménager d'occasion et les objets du quotidien proches de chez vous, puis organiser une remise en main propre à côté. L'appli fonctionne dans tout Melbourne."},{"q":"Quelle différence entre une appli d'occasion à Melbourne, Gumtree et un vide-grenier ?","a":"Un vide-grenier a un lieu et une date fixes, et les plateformes de petites annonces générales sont très larges. Une appli d'occasion à Melbourne comme PopOut Market se concentre sur les échanges de proximité : recherche par quartier, chat multilingue avec traduction automatique, réponses suggérées par l'IA et priorité à une remise en main propre plus sûre, pour acheter et vendre d'occasion de façon plus souple et efficace."},{"q":"Comment les étudiants vendent-ils leurs affaires d'occasion à Melbourne ?","a":"Lors d'un déménagement, d'un départ après les études ou d'un renouvellement, les étudiants utilisent PopOut Market pour trouver vite un acheteur ou un vendeur proche grâce à la recherche par quartier, puis échanger via le chat multilingue avec traduction automatique, sans barrière de la langue. La revente d'occasion à Melbourne devient ainsi bien plus simple."},{"q":"PopOut Market est-il gratuit et sûr ?","a":"PopOut Market est une appli d'occasion à Melbourne entièrement gratuite. Comme les annonces sont locales et que vous fixez vous-même le rendez-vous dans un lieu familier proche de chez vous, la remise en main propre est plus pratique et plus sûre, ce qui convient aux étudiants internationaux, aux locataires et aux personnes vivant en appartement."}],"faqHeading":"Questions fréquentes","relatedHeading":"Pages liées","related":[{"href":"/market","label":"Voir les articles d'occasion en vente à Melbourne"},{"href":"/melbourne-second-hand-app","label":"Appli d'occasion Melbourne"},{"href":"/melbourne-second-hand-marketplace","label":"Plateforme d'occasion Melbourne"}]},
    "vi": {"title":"Chợ đồ cũ Melbourne | Nền tảng mua bán đồ cũ địa phương · PopOut Market","description":"Tìm hiểu chợ đồ cũ Melbourne hoạt động ra sao: mua bán đồ cũ theo khu vực, tìm nội thất cũ và đồ điện cũ gần bạn, chat đa ngôn ngữ có dịch tự động và giao dịch trực tiếp an toàn hơn. App đồ cũ Melbourne miễn phí, phù hợp với du học sinh và cuộc sống căn hộ.","h1":"Chợ đồ cũ Melbourne","inLanguage":"vi","sections":[{"heading":"Mua bán đồ cũ ở Melbourne diễn ra như thế nào","paragraphs":["Trong một chợ đồ cũ Melbourne thực sự, người ta không chỉ quan tâm đến giá. Họ còn để ý việc lấy hàng có tiện không, có cùng khu vực hay không, người bán có trả lời tin nhắn nhanh không, và món đồ có kịp với lịch chuyển nhà hay không. Chính những yếu tố thực tế đó mới quyết định một tin đăng đồ cũ có thật sự hữu ích hay không.","PopOut Market được xây dựng quanh những nhu cầu thực tế đó: khám phá theo khu vực, chat đa ngôn ngữ có dịch tự động, gợi ý trả lời tự động bằng AI, và hẹn lấy hàng rõ ràng hơn cho những người mua bán đồ cũ ngay trong Melbourne, thay vì một danh sách chung chung trên toàn quốc. Đây vừa là chợ đồ cũ Melbourne, vừa là nền tảng mua bán đồ cũ cùng khu vực."]},{"heading":"Những trường hợp phù hợp nhất","list":["Du học sinh dọn vào nhà mới: giường, bàn học và đồ bếp dễ so sánh và lựa chọn hơn khi điểm lấy hàng ở gần nơi bạn ở, lại tiết kiệm chi phí khi sắm đồ second-hand.","Tốt nghiệp dọn đi: kết nối tại chỗ nhanh hơn giúp bạn thanh lý đồ cũ gọn gàng trước khi hết hạn hợp đồng thuê hoặc trước chuyến bay về nước.","Cuộc sống căn hộ: khoảng cách lấy hàng ngắn giúp giảm phiền phức khi mua nội thất cũ cồng kềnh và nhận hàng ngay trong ngày."]},{"heading":"Phủ khắp Melbourne, lấy trung tâm CBD làm điểm nhộn nhịp","paragraphs":["Khu CBD và các căn hộ nội đô là nơi sôi động nhất của chợ đồ cũ địa phương, do mật độ dân cư cao và chu kỳ chuyển vào, chuyển ra diễn ra liên tục. Nhưng việc mua bán đồ cũ theo kiểu cùng khu vực này áp dụng được cho cả thành phố: vì tin đăng được hiển thị theo suburb, nên dù bạn ở đâu tại Melbourne cũng có thể tìm nội thất cũ, đồ điện cũ và đồ second-hand, rồi giao dịch nhanh với người ở gần. Dù bạn muốn dạo chợ đồ cũ Melbourne, tìm món hời theo kiểu chợ trời, hay thanh lý đồ cũ trực tiếp, app đồ cũ Melbourne đều dùng được."]}],"faq":[{"q":"Chợ đồ cũ Melbourne thường được hiểu là gì?","a":"Cụm này có thể chỉ nhiều thứ: nền tảng đăng tin địa phương, app đồ cũ Melbourne, chợ đồ cũ theo khu vực, hay cộng đồng mua bán hàng cũ nói chung. Đa số mọi người muốn một nơi thực dụng để xem và giao dịch đồ ở gần, chứ không phải một danh mục rao vặt chung chung. PopOut Market chính là nền tảng mua bán đồ cũ Melbourne như vậy."},{"q":"Mua bán đồ cũ gần tôi ở Melbourne ở đâu?","a":"PopOut Market hiển thị tin đăng đồ cũ theo khu vực, nên bạn có thể xem nội thất cũ, đồ điện cũ và đồ second-hand ngay gần nơi mình ở rồi hẹn lấy hàng tại chỗ. App dùng được trên khắp Melbourne."},{"q":"App đồ cũ Melbourne khác chợ trời và Gumtree thế nào?","a":"Chợ trời ngoài trời cố định về thời gian và địa điểm, còn các nền tảng rao vặt chung lại quá rộng. App đồ cũ Melbourne như PopOut Market tập trung vào giao dịch cùng khu vực: tìm theo suburb, chat đa ngôn ngữ có dịch tự động, gợi ý trả lời bằng AI và coi trọng giao dịch trực tiếp an toàn hơn, giúp mua bán đồ cũ linh hoạt và hiệu quả hơn."},{"q":"Du học sinh thanh lý đồ cũ ở Melbourne như thế nào?","a":"Khi chuyển nhà, dọn đồ lúc tốt nghiệp hay đổi đồ mới, du học sinh có thể dùng PopOut Market để tìm nhanh người mua hoặc người bán ở gần theo khu vực, rồi trao đổi qua chat đa ngôn ngữ có dịch tự động mà không lo rào cản tiếng Anh, giúp việc thanh lý đồ cũ nhẹ nhàng hơn."},{"q":"PopOut Market có miễn phí và an toàn không?","a":"PopOut Market là app đồ cũ Melbourne hoàn toàn miễn phí. Vì tin đăng theo khu vực và bạn chủ động hẹn gặp ở nơi quen thuộc gần nhà, việc giao dịch trực tiếp trở nên thuận tiện và an toàn hơn, phù hợp với du học sinh, người thuê nhà và người sống ở căn hộ."}],"faqHeading":"Câu hỏi thường gặp","relatedHeading":"Trang liên quan","related":[{"href":"/market","label":"Xem đồ cũ đang bán ở Melbourne"},{"href":"/melbourne-second-hand-app","label":"App đồ cũ Melbourne"},{"href":"/melbourne-second-hand-marketplace","label":"Nền tảng mua bán đồ cũ Melbourne"}]},
    "zh-Hant": {"title":"墨爾本二手市場 | 同城二手交易市集與本地買賣 · PopOut Market","description":"了解墨爾本二手市場如何運作：墨爾本二手交易、同城二手買賣、二手拍賣與本地刊登，依社區發現身邊的二手家具、電器與中古好物，搭配多語言聊天與更安全的當面交易，適合留學生與公寓生活。","h1":"墨爾本二手市場","inLanguage":"zh-TW","sections":[{"heading":"墨爾本本地二手交易是怎麼運作的","paragraphs":["在真實的墨爾本二手市場裡，大家在意的不只是價格，還有取貨方不方便、是不是同一片社區、賣家會不會回訊息，以及東西能不能趕上搬家的時間。這些現實因素，才真正決定一則二手刊登好不好用。","PopOut Market 正是圍繞這些現實打造：依社區發現身邊好物、多語言聊天、更清楚的約見取貨流程，服務的是在墨爾本同城買賣二手的人，而不是面向全國的籠統清單。它既是墨爾本二手交易市集，也是同城二手買賣平台。"]},{"heading":"最適合的使用情境","list":["留學生入住：床、書桌與廚房用品在就近取貨時更好比較與挑選，新生添購中古家具也更省錢。","畢業搬走：更快的本地配對，幫賣家在退租或回國前清掉中古閒置。","公寓搬家：取貨距離近，大件二手家具與當天提貨都省心許多。"]},{"heading":"以社區為中心，全墨爾本都能用","paragraphs":["市中心與內城公寓是本地二手市場最熱鬧的地帶，因為居住密集，入住與退租的週期也都很快。但同樣的同城二手交易在整座城市都適用：因為刊登是依社區呈現，墨爾本各區的人都能就近買賣二手、快速和附近的人完成交易。不論你想逛墨爾本二手市集、找二手拍賣式的本地好物，還是直接做二手買賣，都派得上用場。"]}],"faq":[{"q":"墨爾本二手市場 / 二手市集一般是指什麼？","a":"它可以指很多東西：本地刊登平台、二手 app、依社區的二手市集，或綜合的中古閒置社區。多數人其實想要一個能就近瀏覽、就近交易的實用地方，而不是籠統的分類廣告目錄。PopOut Market 就是這樣的墨爾本二手平台。"},{"q":"在墨爾本怎麼找附近的二手買賣？","a":"PopOut Market 依社區呈現二手刊登，你可以瀏覽身邊的二手家具、電器與日常中古閒置，並就近約見取貨，墨爾本各區都能用。"},{"q":"墨爾本二手 app 和旋轉拍賣（Carousell）有什麼不同？","a":"相較於泛用的二手拍賣 app，PopOut Market 更聚焦在墨爾本同城交易：依社區搜尋、內建多語言聊天與翻譯，並重視更安全的當面交易，是適合本地使用的旋轉拍賣替代選擇。"},{"q":"留學生在墨爾本怎麼買賣二手？","a":"搬家、畢業清倉或換新時，留學生都能用 PopOut Market 依社區快速找到附近的買家或賣家，再透過多語言聊天溝通無障礙，讓墨爾本二手交易更省心。"}],"faqHeading":"常見問題","relatedHeading":"相關頁面","related":[{"href":"/market","label":"瀏覽墨爾本在售二手"},{"href":"/melbourne-second-hand-app","label":"墨爾本二手 app"},{"href":"/melbourne-second-hand-marketplace","label":"墨爾本二手交易平台"}]},
    "ja": {"title":"メルボルンの中古マーケット | 地元のフリマ・中古売買アプリで直接取引 · PopOut Market","description":"メルボルンの中古マーケットの仕組みをわかりやすく解説。中古家具や家電をエリア別に探し、近所の出品を多言語チャットと安全な手渡し（直接取引）で売買できます。フリマアプリ感覚で使えて、留学生やアパート暮らしの引っ越しにも便利。メルボルン全域に対応した無料の中古売買アプリです。","h1":"メルボルンの中古マーケット","inLanguage":"ja","sections":[{"heading":"メルボルンの地元中古取引はどう成り立っているのか","paragraphs":["メルボルンで中古品を探すとき、気になるのは価格だけではありません。受け渡しが楽かどうか、相手が同じエリアにいるか、出品者がちゃんと返信してくれるか、そして自分の引っ越しのタイミングに間に合うか。こうした現実的な条件こそが、その出品が本当に役立つかどうかを大きく左右します。","PopOut Marketは、まさにこうした実際の使われ方に合わせて作られています。エリア単位で出品を探せて、多言語でやり取りでき、待ち合わせと手渡しの流れもわかりやすい。全国向けの漠然とした出品一覧ではなく、メルボルンの街で中古を売り買いする人に寄り添う、地元密着の中古売買アプリです。"]},{"heading":"こんな場面で特に役立ちます","list":["留学生の入居時：ベッドや机、キッチン用品も、近所で受け取れる出品なら無理なく選べます。","卒業前の退去時：地元ですぐに買い手が見つかるので、退去の期限やフライト前に不用品をすっきり処分できます。","アパート暮らしの引っ越し：受け渡し場所が近いほど、大きな家具や当日引き取りの負担も軽くなります。"]},{"heading":"中心部はもちろん、メルボルン全域で使えます","paragraphs":["CBD（シティ中心部）やインナーシティのアパートは入退去のサイクルが早く、人口も密集しているため、地元の中古マーケットがもっとも活発なエリアです。とはいえ、同じような地元の中古取引はメルボルン全域で成り立ちます。出品はエリアごとに表示されるので、メルボルンのどこにいても近くの人とすぐに中古を売り買いできます。気軽に中古マーケットをのぞくのも、フリマ感覚で掘り出し物を探すのも、そのまま手渡しの直接取引につながります。"]}],"faq":[{"q":"メルボルンの中古マーケットやフリマアプリって、具体的に何を指すの？","a":"地元の出品プラットフォームや中古売買アプリ、エリア別の中古マーケット、不用品をやり取りするコミュニティなど、いろいろなものを含みます。多くの人が求めているのは、漠然とした分類広告の一覧ではなく、近くの相手と気軽に見て取引できる実用的な場所です。"},{"q":"メルボルンで近所の中古売買はどうやって探せばいい？","a":"PopOut Marketはエリア別に出品を表示するので、近くにある中古家具や家電、日用品をさっと探せて、近所での手渡しの待ち合わせもそのまま決められます。メルボルン全域でご利用いただけます。"},{"q":"メルボルンのフリマと中古アプリは何が違うの？","a":"会場で開かれるフリーマーケットは開催の日時と場所が決まっていますが、中古売買アプリならいつでもエリア別に検索でき、出品者と直接やり取りできます。地元の中古取引を、より柔軟にスムーズに進められるのが特徴です。"},{"q":"留学生はメルボルンで中古をどう売り買いしているの？","a":"引っ越しや卒業時の処分、買い替えなど、どんな場面でもPopOut Marketなら近くの買い手・売り手をエリア別にすぐ見つけられます。多言語チャットがあるので言葉の不安なくやり取りでき、メルボルンでの中古取引がぐっと手軽になります。"}],"faqHeading":"よくある質問","relatedHeading":"関連ページ","related":[{"href":"/market","label":"メルボルンの出品中の中古を見る"},{"href":"/melbourne-second-hand-app","label":"メルボルンの中古売買アプリ"},{"href":"/melbourne-second-hand-marketplace","label":"メルボルンのフリマ・中古マーケット"}]},
  en: {
    title: "Melbourne Second-Hand Market | Local Trading Platform and Listings",
    description:
      "Explore how a Melbourne second-hand market works across suburbs, with local listings, multilingual communication, and practical trading workflows through PopOut Market.",
    h1: "Melbourne Second-Hand Market",
    inLanguage: "en-AU",
    sections: [
      {
        heading: "How local trading works in Melbourne",
        paragraphs: [
          "In a real Melbourne second-hand market, people rarely care only about price. They also care about pickup convenience, suburb familiarity, seller responsiveness, and whether the item fits a short move-in or move-out timeline. Those practical factors decide whether a listing is truly useful.",
          "PopOut is built around those realities. It supports neighbourhood-level discovery, multilingual communication, and clearer meetup planning for people buying and selling inside Melbourne rather than across an abstract national feed.",
        ],
      },
      {
        heading: "Strong-fit use cases",
        list: [
          "Student move-in: beds, desks and kitchen items are easier to compare when pickup stays close to where you live.",
          "Graduation move-out: faster local matching helps sellers clear items before lease deadlines or flights.",
          "Apartment living: short pickup distance lowers the hassle of bulky furniture and same-day collection.",
        ],
      },
      {
        heading: "Across Melbourne, centred on the CBD",
        paragraphs: [
          "The CBD and inner-city apartments are the busiest part of the local second-hand market, driven by dense living and frequent move-in and move-out cycles. But the same local trading works across the wider city: because listings are discovered by suburb, people anywhere in Melbourne can buy and sell quickly with others nearby.",
        ],
      },
    ],
    faqHeading: "FAQ",
    faq: [
      {
        q: "What does Melbourne second-hand market usually mean online?",
        a: "It can mean many things: local listing platforms, buy-and-sell apps, suburb-based marketplaces, or general used-goods communities. People usually want a practical place to browse and trade nearby items rather than a generic classifieds directory.",
      },
      {
        q: "Where can I buy and sell second-hand near me in Melbourne?",
        a: "PopOut shows second-hand listings by suburb, so you can browse furniture, appliances and everyday items close to where you live and arrange a nearby pickup, anywhere across Melbourne.",
      },
      {
        q: "Why is suburb-based browsing important in Melbourne?",
        a: "Melbourne is spread across many distinct suburbs. A suburb-first view makes second-hand discovery more useful because pickup distance, timing and convenience strongly affect whether a trade actually happens.",
      },
    ],
    relatedHeading: "Related pages",
    related: [
      { href: "/market", label: "Open Melbourne market listings" },
      { href: "/melbourne-second-hand-app", label: "Melbourne second-hand app" },
      { href: "/melbourne-second-hand-marketplace", label: "Melbourne second-hand marketplace" },
    ],
  },

  "zh-Hans": {
    title: "墨尔本二手市场 | 同城二手交易市集与本地买卖 · PopOut Market",
    description:
      "了解墨尔本二手市场怎么运作：墨尔本二手交易、同城二手买卖、二手市集与本地挂牌，按社区发现身边的二手家具、电器与闲置，多语言沟通 + 更安全的当面交易，适合留学生与公寓生活。",
    h1: "墨尔本二手市场",
    inLanguage: "zh-CN",
    sections: [
      {
        heading: "墨尔本本地二手交易是怎么运作的",
        paragraphs: [
          "真实的墨尔本二手市场里，大家在意的不只是价格，还有取货是否方便、是不是同一片社区、卖家回不回消息，以及东西能不能赶上搬家的时间。这些现实因素，才决定一条二手信息是否真的好用。",
          "PopOut 正是围绕这些现实打造：按社区发现身边好物、多语言沟通、更清晰的约见取货流程，服务的是在墨尔本同城买卖二手的人，而不是面向全国的笼统列表。它既是墨尔本二手交易市集，也是同城二手买卖平台。",
        ],
      },
      {
        heading: "最适合的场景",
        list: [
          "留学生入住：床、书桌、厨房用品在就近取货时更好比较和挑选。",
          "毕业搬走：更快的本地配对，帮卖家在退租或回国前清掉闲置。",
          "公寓生活：取货距离近，大件二手家具与当天提货省心很多。",
        ],
      },
      {
        heading: "以社区为中心，全墨尔本可用",
        paragraphs: [
          "墨尔本市区和内城公寓是本地二手市场最活跃的部分，但同样的同城二手交易在全城都适用：因为信息按社区展示，墨尔本各区的人都能就近买卖二手、快速和附近的人完成交易。无论你想逛墨尔本二手市集、找墨尔本跳蚤市场式的本地好物，还是直接做二手买卖，都用得上。",
        ],
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        q: "墨尔本二手市场 / 二手市集一般指什么？",
        a: "它可以指很多东西：本地挂牌平台、二手买卖 App、按社区的二手市集，或综合的闲置社区。大多数人其实想要一个能就近浏览、就近交易的实用地方，而不是笼统的分类信息目录。",
      },
      {
        q: "在墨尔本怎么找附近的二手买卖？",
        a: "PopOut 按社区展示二手信息，你可以浏览身边的二手家具、电器和日常闲置，并就近约见取货，墨尔本各个区都能用。",
      },
      {
        q: "墨尔本跳蚤市场和二手 App 有什么区别？",
        a: "线下跳蚤市场时间地点固定、品类随缘；而墨尔本二手交易 App 能随时按社区搜索、和卖家直接沟通，把同城二手买卖安排得更灵活、更高效。",
      },
      {
        q: "留学生在墨尔本怎么买卖二手？",
        a: "搬家、毕业清仓或换新时，留学生都能用 PopOut 按社区快速找到附近的买家或卖家，多语言沟通，让墨尔本二手交易更省心。",
      },
    ],
    relatedHeading: "相关页面",
    related: [
      { href: "/market", label: "浏览墨尔本在售二手" },
      { href: "/melbourne-second-hand-app", label: "墨尔本二手 App" },
      { href: "/melbourne-second-hand-marketplace", label: "墨尔本二手交易平台" },
    ],
  },

  ko: {
    title: "멜버른 중고 시장 | 동네 중고거래·중고 장터와 직거래 · PopOut Market",
    description:
      "멜버른 중고 시장이 어떻게 돌아가는지 알아보세요. 멜버른 중고거래, 동네 중고 장터, 중고마켓과 현지 매물을 동네별로 찾고, 중고 가구·가전을 다국어 채팅과 안전한 직거래로 거래하세요. 유학생과 아파트 생활에 적합합니다.",
    h1: "멜버른 중고 시장",
    inLanguage: "ko",
    sections: [
      {
        heading: "멜버른 현지 중고 거래는 어떻게 이루어지나요",
        paragraphs: [
          "실제 멜버른 중고 시장에서 사람들이 신경 쓰는 것은 가격만이 아닙니다. 가져오기 편한지, 같은 동네인지, 판매자가 답을 잘 하는지, 이사 일정에 맞는지도 중요합니다. 이런 현실적인 요소가 매물이 정말 쓸모 있는지를 결정합니다.",
          "PopOut은 바로 이런 현실에 맞춰 만들어졌습니다. 동네별 탐색, 다국어 소통, 더 명확한 약속과 직거래 과정으로 멜버른 안에서 중고를 사고파는 사람들을 위한 서비스입니다. 멜버른 중고거래 장터이자 동네 중고 거래 플랫폼입니다.",
        ],
      },
      {
        heading: "이런 상황에 잘 맞아요",
        list: [
          "유학생 입주: 침대·책상·주방용품은 가까이에서 가져올 때 비교하고 고르기 쉽습니다.",
          "졸업 이사: 더 빠른 현지 매칭으로 임대 만료나 출국 전에 물건을 정리하기 좋습니다.",
          "아파트 생활: 가까운 직거래로 큰 가구와 당일 수령의 번거로움을 줄입니다.",
        ],
      },
      {
        heading: "동네 중심, 멜버른 전역에서",
        paragraphs: [
          "시내와 도심 아파트가 현지 중고 시장에서 가장 활발하지만, 같은 동네 중고 거래는 멜버른 전역에서 통합니다. 매물이 동네별로 보이기 때문에 멜버른 어느 지역에 있든 가까운 사람과 빠르게 중고를 사고팔 수 있습니다. 멜버른 중고 장터든 벼룩시장 같은 현지 물건이든, 바로 직거래로 이어집니다.",
        ],
      },
    ],
    faqHeading: "자주 묻는 질문",
    faq: [
      {
        q: "멜버른 중고 시장·중고 장터는 보통 무엇을 말하나요?",
        a: "현지 매물 플랫폼, 중고 거래 앱, 동네 기반 중고마켓, 종합 중고 커뮤니티 등 여러 가지를 뜻할 수 있습니다. 대부분은 막연한 분류 광고 디렉터리보다, 가까이에서 둘러보고 거래할 수 있는 실용적인 곳을 원합니다.",
      },
      {
        q: "멜버른에서 가까운 중고 거래는 어떻게 찾나요?",
        a: "PopOut은 동네별로 중고 매물을 보여주므로, 가까운 중고 가구·가전·생활용품을 둘러보고 근처에서 직거래 약속을 잡을 수 있습니다. 멜버른 전역에서 사용할 수 있습니다.",
      },
      {
        q: "멜버른 벼룩시장과 중고 앱은 무엇이 다른가요?",
        a: "오프라인 벼룩시장은 시간·장소가 정해져 있지만, 멜버른 중고 거래 앱은 언제든 동네별로 검색하고 판매자와 바로 소통하며 동네 중고 거래를 더 유연하고 효율적으로 할 수 있습니다.",
      },
      {
        q: "유학생은 멜버른에서 중고를 어떻게 사고파나요?",
        a: "이사, 졸업 정리, 집 새단장 등 어떤 상황에서도 유학생은 PopOut으로 동네에서 가까운 구매자·판매자를 빠르게 찾고 다국어로 소통하여 멜버른 중고 거래를 편하게 할 수 있습니다.",
      },
    ],
    relatedHeading: "관련 페이지",
    related: [
      { href: "/market", label: "멜버른 중고 매물 둘러보기" },
      { href: "/melbourne-second-hand-app", label: "멜버른 중고거래 앱" },
      { href: "/melbourne-second-hand-marketplace", label: "멜버른 중고마켓" },
    ],
  },
};

function contentFor(locale: Locale): PageContent {
  return CONTENT[locale] ?? CONTENT.en;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
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

export default async function MelbourneSecondHandMarketPage() {
  const locale = await getServerLocale();
  const c = contentFor(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: c.title,
        description: c.description,
        inLanguage: c.inLanguage,
        about: { "@type": "Place", name: "Melbourne, Victoria, Australia" },
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
