import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface FrontMatter {
  title: string;
  tags: string[];
  category: string;
  subcategory?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  timeframe?: string;
  summary?: string;
}

export interface ContentEntry {
  slug: string;
  filePath: string;
  frontMatter: FrontMatter;
  rawContent: string;
}

function walkDir(dir: string): string[] {
  const files: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }
  return files;
}

export function getAllContent(): ContentEntry[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = walkDir(contentDir);
  return files.map((filePath) => {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const relative = path.relative(contentDir, filePath);
    const slug = relative.replace(/\\/g, "/").replace(/\.mdx?$/, "");

    return {
      slug,
      filePath,
      frontMatter: data as FrontMatter,
      rawContent: content,
    };
  });
}

export function getContentByTags(tags: string[]): ContentEntry[] {
  const all = getAllContent();
  if (!tags || tags.length === 0) return all;
  return all.filter((entry) =>
    tags.some((tag) => entry.frontMatter.tags?.includes(tag))
  );
}

export function getContentBySlug(slug: string): ContentEntry | null {
  const all = getAllContent();
  return all.find((e) => e.slug === slug) ?? null;
}
