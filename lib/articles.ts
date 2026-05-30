// Article DTOs and API helpers — replaces the mock data used in Phase 1.
import { api } from "./api";

export type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Article = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  emoji: string;
  color: string;
  readMinutes: number;
  author: string;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleInput = Omit<Article, "id" | "createdAt" | "updatedAt"> & {
  publishedAt?: string | null;
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

export function listArticles(status: "all" | ArticleStatus = "all") {
  return api.get<{ items: Article[]; total: number }>(`/v1/admin/articles?status=${status}`);
}

export function getArticle(slug: string) {
  return api.get<Article>(`/v1/admin/articles/${slug}`);
}

export function createArticle(input: ArticleInput) {
  return api.post<Article>("/v1/admin/articles", input);
}

export function updateArticle(slug: string, input: Partial<ArticleInput>) {
  return api.patch<Article>(`/v1/admin/articles/${slug}`, input);
}

export function deleteArticle(slug: string) {
  return api.del<{ deleted: true; slug: string }>(`/v1/admin/articles/${slug}`);
}
