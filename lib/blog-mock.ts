// Mock articles. In Phase 2 this is replaced with fetch('/v1/admin/articles').
// Mirrors the schema we'll use in Prisma so the UI never has to change.

export type ArticleStatus = "draft" | "published";

export type Article = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  emoji: string;
  color: string;
  readMinutes: number;
  publishedAt: string;            // ISO date
  status: ArticleStatus;
  author: string;
};

export const CATEGORIES = ["Conseil", "Témoignage", "Produit", "Actualité", "Coulisses"];

export const COLOR_PRESETS: { name: string; value: string }[] = [
  { name: "Coral", value: "#F4486F" },
  { name: "Indigo", value: "#41087B" },
  { name: "Mango", value: "#F9A01C" },
  { name: "Pink", value: "#ED4673" },
  { name: "Mint", value: "#5DBFA0" },
  { name: "Plum", value: "#7B278C" },
];

export const ARTICLES: Article[] = [
  {
    slug: "5-facons-celebrer-anniversaire-distance",
    title: "5 façons de célébrer un anniversaire à distance",
    category: "Conseil",
    excerpt: "Quand la famille est éparpillée sur 3 continents, la présence prend une autre forme.",
    content:
      "Quand la famille est éparpillée sur 3 continents, la présence prend une autre forme.\n\nVoici 5 idées pour rappeler à un proche qu'on pense à lui malgré la distance…\n\n1. La carte vidéo collective\n2. Le rituel WhatsApp\n3. La carte cadeau Donia avec un message vocal\n4. L'apéro Zoom à 3 fuseaux\n5. L'album photo surprise",
    emoji: "🎂",
    color: "#F4486F",
    readMinutes: 4,
    publishedAt: "2026-05-24",
    status: "published",
    author: "Équipe Donia",
  },
  {
    slug: "awa-cotonou-4-cartes-par-mois",
    title: "Awa, Cotonou : « J'envoie 4 cartes par mois »",
    category: "Témoignage",
    excerpt: "Portrait d'une utilisatrice qui a transformé sa façon d'être en lien avec ses proches.",
    content:
      "Awa a 32 ans, vit à Cotonou et travaille dans la communication.\n\nDepuis qu'elle a découvert Donia il y a 6 mois, elle a complètement changé sa façon d'être en lien avec ses proches restés à Lagos, Abidjan, Paris.\n\n« Avant je ratais les anniversaires. Maintenant chaque mois j'ai 3-4 occasions et c'est devenu un vrai rituel. »",
    emoji: "💝",
    color: "#41087B",
    readMinutes: 4,
    publishedAt: "2026-05-20",
    status: "published",
    author: "Équipe Donia",
  },
  {
    slug: "cartes-tabaski-2026-3-designs-exclusifs",
    title: "Cartes Tabaski 2026 : 3 designs exclusifs",
    category: "Produit",
    excerpt: "Notre studio a travaillé avec un illustrateur sénégalais. Découvre les coulisses.",
    content:
      "Cette année pour la Tabaski, nous avons collaboré avec Mamadou Sow, illustrateur basé à Dakar.\n\n3 designs : Le Mouton d'Or, Sous la Lune, La Famille Réunie.\n\nDisponibles dès le 1er juin dans l'app.",
    emoji: "🌙",
    color: "#F9A01C",
    readMinutes: 4,
    publishedAt: "2026-05-15",
    status: "published",
    author: "Équipe Donia",
  },
];

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
