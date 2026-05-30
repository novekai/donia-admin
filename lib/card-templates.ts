import { api } from "./api";

export type CardTemplate = {
  id: string;
  themeKey: string;
  name: string;
  emoji: string;
  color: string;
  ink: string;
  category: string;
  isLive: boolean;
  sortOrder: number;
  sentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CardTemplateInput = Omit<CardTemplate, "id" | "sentCount" | "createdAt" | "updatedAt">;

export function listTemplates() {
  return api.get<{ items: CardTemplate[] }>("/v1/admin/card-templates");
}

export function getTemplate(themeKey: string) {
  return api.get<CardTemplate>(`/v1/admin/card-templates/${themeKey}`);
}

export function createTemplate(input: CardTemplateInput) {
  return api.post<CardTemplate>("/v1/admin/card-templates", input);
}

export function updateTemplate(themeKey: string, input: Partial<CardTemplateInput>) {
  return api.patch<CardTemplate>(`/v1/admin/card-templates/${themeKey}`, input);
}

export function deleteTemplate(themeKey: string) {
  return api.del<{ deleted: true; themeKey: string }>(`/v1/admin/card-templates/${themeKey}`);
}

export const CATEGORIES = [
  "Famille · Fêtes",
  "Romantique",
  "Encouragement",
  "Solidarité",
  "Cadeaux",
  "Quotidien",
];

export const PRESET_COLORS = [
  { name: "Coral", value: "#F4486F", ink: "#FDF7F6" },
  { name: "Pink", value: "#ED4673", ink: "#FDF7F6" },
  { name: "Mango", value: "#F9A01C", ink: "#2A0F1A" },
  { name: "Indigo", value: "#41087B", ink: "#FDF7F6" },
  { name: "Indigo profond", value: "#2A0454", ink: "#FDF7F6" },
  { name: "Mint", value: "#5DBFA0", ink: "#FDF7F6" },
  { name: "Plum", value: "#7B278C", ink: "#FDF7F6" },
  { name: "Bleu ciel", value: "#6FB5D4", ink: "#FFFFFF" },
  { name: "Crème", value: "#FFFFFF", ink: "#2A0F1A" },
];
