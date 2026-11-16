import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SITE, absoluteUrl, breadcrumbJsonLd, type PageMeta } from "./site";

/* -------------------------------------------------------------------------- */
/*  Balises <head> : générées en HTML statique au build (prerender) et        */
/*  mises à jour côté navigateur lors de la navigation.                       */
/* -------------------------------------------------------------------------- */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const jsonForScript = (o: unknown) => JSON.stringify(o).replace(/</g, "\\u003c");

export const headTags = (meta: PageMeta): string => {
  const url = absoluteUrl(meta.path);
  const image = absoluteUrl(meta.image || SITE.defaultImage);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />`,
    meta.noindex ? "" : `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${meta.type || "website"}" />`,
    `<meta property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta property="og:locale" content="${SITE.locale}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    meta.publishedTime ? `<meta property="article:published_time" content="${esc(meta.publishedTime)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    ...(meta.jsonLd || []).map(
      (o) => `<script type="application/ld+json" data-seo>${jsonForScript(o)}</script>`,
    ),
  ];
  return tags.filter(Boolean).join("\n    ");
};

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
};

/** Met à jour les balises <head> de la page courante (côté navigateur). */
export const Seo = ({ meta }: { meta: PageMeta }) => {
  useEffect(() => {
    const url = absoluteUrl(meta.path);
    const image = absoluteUrl(meta.image || SITE.defaultImage);
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("name", "robots", meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large");
    setMeta("property", "og:type", meta.type || "website");
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);
    setMeta("name", "twitter:image", image);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (meta.noindex) {
      canonical?.remove();
    } else {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = url;
    }

    document.head.querySelectorAll("script[data-seo]").forEach((s) => s.remove());
    (meta.jsonLd || []).forEach((o) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.seo = "";
      s.textContent = JSON.stringify(o);
      document.head.appendChild(s);
    });
  }, [meta]);
  return null;
};

/* -------------------------------------------------------------------------- */
/*  Articles du journal                                                        */
/* -------------------------------------------------------------------------- */

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
}

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const postSlug = (p: BlogPost) => `${slugify(p.title) || "article"}-${p.id}`;
export const postPath = (p: BlogPost) => `/blog/${postSlug(p)}`;
export const findPostBySlug = (posts: BlogPost[], slug: string) =>
  posts.find((p) => postSlug(p) === slug) || posts.find((p) => slug.endsWith(`-${p.id}`) || slug === p.id);

/** Convertit une date "jj/mm/aaaa" (format fr-FR) en ISO 8601. */
export const toIsoDate = (d: string): string | undefined => {
  const m = d?.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const t = Date.parse(d);
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10);
};

/** Métadonnées SEO d'un article (balises <head> + données structurées BlogPosting). */
export const postMeta = (post: BlogPost): PageMeta => {
  const path = postPath(post);
  const iso = toIsoDate(post.date);
  const description = (post.excerpt || post.content || "").replace(/\s+/g, " ").trim().slice(0, 158);
  return {
    path,
    title: `${post.title} | Le Journal d’Inès Mallaroni`,
    description,
    image: post.image || undefined,
    type: "article",
    publishedTime: iso,
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description,
        image: absoluteUrl(post.image || SITE.defaultImage),
        datePublished: iso,
        dateModified: iso,
        inLanguage: "fr-FR",
        articleSection: post.category,
        mainEntityOfPage: absoluteUrl(path),
        author: { "@type": "Person", name: SITE.practitioner, url: absoluteUrl("/a-propos") },
        publisher: { "@type": "Organization", name: SITE.name, logo: absoluteUrl("/icon-512.png") },
      },
      breadcrumbJsonLd([
        { name: "Accueil", path: "/" },
        { name: "Le Journal", path: "/blog" },
        { name: post.title, path },
      ]),
    ],
  };
};

interface PostsState {
  posts: BlogPost[];
  isLoading: boolean;
  setPosts: (p: BlogPost[]) => void;
  refresh: () => Promise<void>;
}

const PostsContext = createContext<PostsState>({
  posts: [],
  isLoading: false,
  setPosts: () => {},
  refresh: async () => {},
});

export const PostsProvider = ({ initialPosts, children }: { initialPosts?: BlogPost[]; children: ReactNode }) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts);

  const refresh = async () => {
    try {
      const res = await fetch(`/api/blog/posts?t=${Date.now()}`);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (Array.isArray(data)) setPosts(data);
    } catch {
      // Pas d'API disponible (hébergement statique) : on garde les articles générés au build.
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, isLoading, setPosts, refresh }}>{children}</PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);
