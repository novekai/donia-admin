import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/ArticleEditor";
import { findArticle } from "@/lib/blog-mock";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();
  return <ArticleEditor mode="edit" initial={article} />;
}
