/**
 * Configuration centrale du site : coordonnées, URL et métadonnées SEO.
 * Modifiez ce fichier pour mettre à jour les informations affichées
 * partout (pages, données structurées Google, sitemap, robots.txt).
 */

// URL publique du site, SANS slash final. Peut être surchargée au build
// avec la variable d'environnement SITE_URL (ex: SITE_URL=https://mon-domaine.fr npm run build).
// (la valeur est injectée par vite.config.ts au moment du build)
export const SITE_URL: string = (
  process.env.SITE_URL || "https://www.ines-mallaroni-kinesiologue.fr"
).replace(/\/+$/, "");

export const SITE = {
  name: "Inès Mallaroni – Kinésiologue à Porto-Vecchio",
  shortName: "Inès Mallaroni",
  practitioner: "Inès Mallaroni",
  jobTitle: "Kinésiologue",
  phoneDisplay: "06 83 57 17 84",
  phoneE164: "+33683571784",
  whatsappUrl: "https://wa.me/33683571784",
  googleUrl: "https://share.google/B5UulQr99RYjUFRgt",
  // Ajoutez ici l'URL de votre compte Instagram pour l'afficher sur le site.
  instagramUrl: "",
  bookingUrl: "https://bookingfast.pro/booking/bd1f360d-fa34-4604-a48c-6017f41eb6ef",
  address: {
    street: "41 rue Maréchal Juin",
    complement: "Immeuble Traiteur TORNERÓ",
    postalCode: "20137",
    city: "Porto-Vecchio",
    region: "Corse-du-Sud",
    country: "FR",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("41 rue Maréchal Juin, 20137 Porto-Vecchio"),
  areaServed: [
    "Porto-Vecchio",
    "Lecci",
    "Sainte-Lucie-de-Porto-Vecchio",
    "Zonza",
    "Sotta",
    "Figari",
    "Bonifacio",
    "Corse-du-Sud",
  ],
  defaultImage: "/og-image.jpg",
  /**
   * Informations obligatoires pour les mentions légales (loi LCEN).
   * ⚠️ À COMPLÉTER : les champs vides ne sont pas affichés sur le site.
   */
  legal: {
    status: "Entrepreneur individuel",
    siret: "", // ex : "123 456 789 00012"
    email: "", // ex : "contact@mon-domaine.fr"
    hostName: "", // ex : "OVH SAS"
    hostAddress: "", // ex : "2 rue Kellermann, 59100 Roubaix, France"
    hostPhone: "", // ex : "1007"
  },
  locale: "fr_FR",
} as const;

export const SERVICES = [
  {
    id: "adultes",
    number: "01",
    title: "Kinésiologie adultes",
    shortTitle: "Adultes",
    subtitle: "Libération & équilibre",
    desc: "Un accompagnement personnalisé pour libérer vos blocages et retrouver une harmonie globale dans votre vie quotidienne et professionnelle.",
    details: [
      "Gestion du stress, de l’anxiété et des émotions",
      "Amélioration de la confiance en soi",
      "Accompagnement lors de périodes de transition (burn-out, deuil, séparation)",
      "Douleurs physiques chroniques sans cause médicale identifiée",
      "Amélioration du sommeil et de la vitalité",
    ],
    price: 70,
    duration: "Séance de 1 h",
    durationIso: "PT1H",
    img: "/images/seance-kinesiologie-adulte",
    imgAlt: "Praticienne posant les mains sur le bras d’une personne allongée lors d’une séance de kinésiologie adulte",
  },
  {
    id: "enfants",
    number: "02",
    title: "Kinésiologie enfants (jusqu’à 12 ans)",
    shortTitle: "Enfants (jusqu’à 12 ans)",
    subtitle: "Épanouissement & apprentissage",
    desc: "Une approche ludique et bienveillante pour aider les plus jeunes à mieux comprendre leurs émotions et surmonter leurs difficultés.",
    details: [
      "Troubles de l'apprentissage et concentration",
      "Gestion des peurs et cauchemars",
      "Amélioration du sommeil",
      "Hypersensibilité et émotivité",
      "Confiance en soi et socialisation",
    ],
    price: 55,
    duration: "Séance de 45 min",
    durationIso: "PT45M",
    img: "/images/seance-kinesiologie-enfant",
    imgAlt: "Main d’enfant posée sur un drap en lin, moment de détente en séance de kinésiologie",
  },
] as const;

export type Service = (typeof SERVICES)[number];

export const FAQ = [
  {
    q: "Qu’est-ce que la kinésiologie ?",
    a: "La kinésiologie est une approche psycho-corporelle qui utilise le test musculaire pour identifier les sources de stress et les blocages émotionnels, physiques ou énergétiques. Elle aide ensuite à les libérer grâce à des techniques douces adaptées à chaque personne.",
  },
  {
    q: "Comment se déroule une séance de kinésiologie ?",
    a: "La séance commence par un échange pour définir votre objectif. Vous restez habillé(e), allongé(e) ou assis(e) ; je réalise des tests musculaires légers sur le bras afin de repérer ce qui bloque, puis nous procédons aux équilibrations (points réflexes, mouvements, visualisations…). Une séance dure environ 1 h pour un adulte et 45 min pour un enfant.",
  },
  {
    q: "Combien de séances sont nécessaires ?",
    a: "Cela dépend de chacun et de l’objectif. Souvent, une à trois séances espacées de trois à quatre semaines suffisent pour ressentir un changement durable. Nous faisons le point ensemble à la fin de chaque séance.",
  },
  {
    q: "La kinésiologie convient-elle aux enfants ?",
    a: "Oui. Les séances enfants (jusqu’à 12 ans) sont adaptées, ludiques et plus courtes. Elles peuvent aider en cas de difficultés d’apprentissage, de troubles du sommeil, de peurs, d’hypersensibilité ou de manque de confiance en soi. Un parent peut être présent pendant la séance.",
  },
  {
    q: "Quels sont les tarifs ? Les séances sont-elles remboursées ?",
    a: "La séance adulte (1 h) est à 70 € et la séance enfant (45 min) à 55 €. La kinésiologie n’est pas prise en charge par la Sécurité sociale, mais certaines mutuelles remboursent une partie des médecines douces : renseignez-vous auprès de la vôtre.",
  },
  {
    q: "La kinésiologie remplace-t-elle un suivi médical ?",
    a: "Non. La kinésiologie est une pratique de bien-être complémentaire : elle ne pose pas de diagnostic et ne remplace en aucun cas un avis, un traitement ou un suivi médical. N’interrompez jamais un traitement sans l’accord de votre médecin.",
  },
  {
    q: "Où se trouve le cabinet ?",
    a: "Le cabinet est situé au 41 rue Maréchal Juin (immeuble Traiteur TORNERÓ), 20137 Porto-Vecchio. Il accueille sur rendez-vous les habitants de Porto-Vecchio et des environs : Lecci, Sainte-Lucie-de-Porto-Vecchio, Zonza, Sotta, Figari, Bonifacio…",
  },
] as const;

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article" | "profile";
  jsonLd?: object[];
  publishedTime?: string;
}

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path === "/" ? "/" : path}`;

const businessId = `${SITE_URL}/#cabinet`;
const personId = `${SITE_URL}/#ines-mallaroni`;

export const businessJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": ["HealthAndBeautyBusiness", "LocalBusiness"],
  "@id": businessId,
  name: "Inès Mallaroni – Kinésiologue",
  description:
    "Cabinet de kinésiologie à Porto-Vecchio (Corse-du-Sud) : séances pour adultes et enfants, gestion du stress, des émotions, du sommeil, confiance en soi et difficultés d’apprentissage.",
  url: `${SITE_URL}/`,
  telephone: SITE.phoneE164,
  image: absoluteUrl("/images/cabinet-kinesiologie-porto-vecchio.webp"),
  logo: absoluteUrl("/icon-512.png"),
  priceRange: "55 € – 70 €",
  currenciesAccepted: "EUR",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.address.street} (${SITE.address.complement})`,
    postalCode: SITE.address.postalCode,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    addressCountry: SITE.address.country,
  },
  hasMap: SITE.mapsUrl,
  areaServed: SITE.areaServed.map((name) => ({ "@type": "Place", name })),
  founder: { "@id": personId },
  sameAs: [SITE.googleUrl, SITE.instagramUrl].filter(Boolean),
  potentialAction: {
    "@type": "ReserveAction",
    target: SITE.bookingUrl,
    name: "Prendre rendez-vous en ligne",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Séances de kinésiologie",
    itemListElement: SERVICES.map((s) => ({
      "@type": "Offer",
      price: s.price,
      priceCurrency: "EUR",
      itemOffered: {
        "@type": "Service",
        name: s.title,
        description: s.desc,
        serviceType: "Kinésiologie",
      },
    })),
  },
});

export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": personId,
  name: SITE.practitioner,
  jobTitle: SITE.jobTitle,
  worksFor: { "@id": businessId },
  url: `${SITE_URL}/a-propos`,
  telephone: SITE.phoneE164,
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.address.city,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: SITE.name,
  inLanguage: "fr-FR",
  publisher: { "@id": businessId },
});

export const faqJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

export const PAGES = {
  home: {
    path: "/",
    title: "Kinésiologue à Porto-Vecchio – Inès Mallaroni | Adultes & enfants",
    description:
      "Inès Mallaroni, kinésiologue à Porto-Vecchio (Corse-du-Sud). Séances adultes (70 €) et enfants (55 €) : stress, émotions, sommeil, confiance en soi, apprentissages. Réservation en ligne.",
    jsonLd: [websiteJsonLd(), businessJsonLd(), faqJsonLd()],
  },
  about: {
    path: "/a-propos",
    title: "À propos d’Inès Mallaroni, kinésiologue à Porto-Vecchio",
    description:
      "Découvrez le parcours d’Inès Mallaroni, kinésiologue certifiée à Porto-Vecchio, et son approche bienveillante du corps, du mental et de l’énergie.",
    type: "profile",
    jsonLd: [
      personJsonLd(),
      breadcrumbJsonLd([
        { name: "Accueil", path: "/" },
        { name: "À propos", path: "/a-propos" },
      ]),
    ],
  },
  blog: {
    path: "/blog",
    title: "Le Journal – Conseils bien-être & kinésiologie | Inès Mallaroni",
    description:
      "Articles et conseils bien-être d’Inès Mallaroni, kinésiologue à Porto-Vecchio : stress, émotions, sommeil, enfants et équilibre au quotidien.",
    jsonLd: [
      breadcrumbJsonLd([
        { name: "Accueil", path: "/" },
        { name: "Le Journal", path: "/blog" },
      ]),
    ],
  },
  legal: {
    path: "/mentions-legales",
    title: "Mentions légales | Inès Mallaroni, kinésiologue",
    description: "Mentions légales du site d’Inès Mallaroni, kinésiologue à Porto-Vecchio.",
  },
  privacy: {
    path: "/confidentialite",
    title: "Politique de confidentialité | Inès Mallaroni, kinésiologue",
    description:
      "Politique de confidentialité et gestion des données personnelles du site d’Inès Mallaroni, kinésiologue à Porto-Vecchio.",
  },
  admin: {
    path: "/admin",
    title: "Administration du journal",
    description: "Espace d’administration.",
    noindex: true,
  },
  notFound: {
    path: "/404",
    title: "Page introuvable | Inès Mallaroni, kinésiologue",
    description: "Cette page n’existe pas ou a été déplacée.",
    noindex: true,
  },
} satisfies Record<string, PageMeta>;
