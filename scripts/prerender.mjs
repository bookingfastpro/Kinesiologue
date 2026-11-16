/**
 * Pré-rendu statique (SEO) exécuté après `vite build` :
 *  - génère un fichier HTML complet (contenu + balises <head>) pour chaque page,
 *  - génère sitemap.xml, robots.txt et 404.html.
 *
 * Les robots des moteurs de recherche et des réseaux sociaux lisent ainsi
 * directement le texte, les titres et les descriptions, sans exécuter JavaScript.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const dist = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");

const { render, headTags, postPath, postMeta, toIsoDate, PAGES, SITE_URL } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");

let posts = [];
try {
  const raw = fs.readFileSync(path.join(root, "blog-data.json"), "utf-8").trim();
  posts = raw ? JSON.parse(raw).posts || [] : [];
} catch (e) {
  console.warn("⚠️  blog-data.json illisible, aucun article pré-généré :", e.message);
}

const jsonForScript = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

const pages = [
  { url: "/", file: "index.html", meta: PAGES.home, priority: "1.0", changefreq: "monthly" },
  { url: "/a-propos", file: "a-propos.html", meta: PAGES.about, priority: "0.8", changefreq: "yearly" },
  { url: "/blog", file: "blog.html", meta: PAGES.blog, priority: "0.7", changefreq: "weekly" },
  ...posts.map((p) => ({
    url: postPath(p),
    file: `${postPath(p).slice(1)}.html`,
    meta: postMeta(p),
    priority: "0.6",
    changefreq: "yearly",
    lastmod: toIsoDate(p.date),
  })),
  { url: "/mentions-legales", file: "mentions-legales.html", meta: PAGES.legal, priority: "0.2", changefreq: "yearly" },
  { url: "/confidentialite", file: "confidentialite.html", meta: PAGES.privacy, priority: "0.2", changefreq: "yearly" },
  { url: "/404", file: "404.html", meta: PAGES.notFound, sitemap: false },
];

const initialData = `<script>window.__INITIAL_POSTS__=${jsonForScript(posts)}</script>`;

for (const page of pages) {
  const html = render(page.url, posts);
  const out = template
    .replace("<!--app-head-->", headTags(page.meta))
    .replace(
      '<div id="root"><!--app-html--></div>',
      `<div id="root" data-route="${page.url}">${html}</div>\n    ${initialData}`,
    );
  const target = path.join(dist, page.file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, out);
  console.log(`✓ ${page.url.padEnd(28)} → dist/${page.file}`);
}

// Gabarit neutre pour les pages non pré-générées (ex : article publié après le build).
fs.writeFileSync(
  path.join(dist, "app.html"),
  template
    .replace("<!--app-head-->", `<title>Inès Mallaroni – Kinésiologue à Porto-Vecchio</title>`)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root"></div>\n    ${initialData}`),
);

/* ------------------------------- sitemap.xml ------------------------------ */
const today = new Date().toISOString().slice(0, 10);
const urls = pages
  .filter((p) => p.sitemap !== false && !p.meta.noindex)
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.url === "/" ? "/" : p.url}</loc>
    <lastmod>${p.lastmod || today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n");
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
);

/* -------------------------------- robots.txt ------------------------------ */
fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `# Robots – ${SITE_URL}
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`,
);

/* --------------------------------- llms.txt ------------------------------- */
fs.writeFileSync(
  path.join(dist, "llms.txt"),
  `# Inès Mallaroni – Kinésiologue à Porto-Vecchio

> Cabinet de kinésiologie au 41 rue Maréchal Juin, 20137 Porto-Vecchio (Corse-du-Sud). Séances adultes (1 h, 70 €) et enfants jusqu'à 12 ans (45 min, 55 €). Téléphone : 06 83 57 17 84. Réservation en ligne sur le site.

- [Accueil](${SITE_URL}/): présentation, prestations, tarifs, questions fréquentes, contact
- [À propos](${SITE_URL}/a-propos): parcours et approche d'Inès Mallaroni
- [Le Journal](${SITE_URL}/blog): articles bien-être
`,
);

fs.rmSync(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`✓ sitemap.xml, robots.txt, llms.txt générés pour ${SITE_URL}`);
