import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocArticle } from "@/components/doc-article";
import { getAllDocs, getDocBySlug } from "@/lib/docs";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getAllDocs()
    .filter((doc) => doc.slug !== "index")
    .map((doc) => ({ slug: doc.slug.split("/") }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug.join("/"));

  if (!doc) return {};

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug.join("/"));

  if (!doc) notFound();

  return <DocArticle doc={doc} />;
}
