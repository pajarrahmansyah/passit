import { notFound } from "next/navigation";
import { DocArticle } from "@/components/doc-article";
import { getDocBySlug } from "@/lib/docs";

export default function DocsIndex() {
  const doc = getDocBySlug("index");
  if (!doc) notFound();
  return <DocArticle doc={doc} />;
}
