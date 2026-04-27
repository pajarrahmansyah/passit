import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  section: string;
  order: number;
  content: string;
};

const docsDirectory = path.join(process.cwd(), "content", "docs");

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function slugFromFile(filePath: string) {
  return filePath
    .replace(docsDirectory, "")
    .replace(/\\/g, "/")
    .replace(/^\//, "")
    .replace(/\.mdx$/, "");
}

export function getAllDocs(): DocPage[] {
  return walk(docsDirectory)
    .filter((filePath) => filePath.endsWith(".mdx"))
    .map((filePath) => {
      const { content, data } = matter(fs.readFileSync(filePath, "utf8"));

      return {
        slug: slugFromFile(filePath),
        title: String(data.title),
        description: String(data.description),
        section: String(data.section),
        order: Number(data.order),
        content,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function getDocBySlug(slug: string) {
  return getAllDocs().find((doc) => doc.slug === slug);
}

export function getDocsBySection() {
  return Object.entries(
    getAllDocs().reduce<Record<string, DocPage[]>>((sections, doc) => {
      sections[doc.section] = sections[doc.section] ?? [];
      sections[doc.section].push(doc);
      return sections;
    }, {}),
  );
}

export function getAdjacentDocs(slug: string) {
  const docs = getAllDocs();
  const index = docs.findIndex((doc) => doc.slug === slug);

  return {
    previous: index > 0 ? docs[index - 1] : null,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : null,
  };
}
