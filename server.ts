import express from "express";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_FILE = path.join(process.cwd(), "blog-data.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

if (!process.env.ADMIN_PASSWORD) {
  console.warn("⚠️  ADMIN_PASSWORD n'est pas défini : mot de passe par défaut utilisé. Définissez-le en production !");
}

app.disable("x-powered-by");
app.use(bodyParser.json({ limit: "10mb" }));

// Crée (ou répare) le fichier de données s'il est absent ou vide.
const readData = (): { posts: unknown[] } => {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8").trim();
    const data = raw ? JSON.parse(raw) : { posts: [] };
    return Array.isArray(data.posts) ? data : { posts: [] };
  } catch {
    return { posts: [] };
  }
};
if (!fs.existsSync(DATA_FILE) || !fs.readFileSync(DATA_FILE, "utf-8").trim()) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ posts: [] }, null, 2));
}

const isAuthorized = (req: express.Request) =>
  (req.body?.password ?? req.get("x-admin-password")) === ADMIN_PASSWORD;

// ----------------------------------------------------------------- API ----
app.get("/api/blog/posts", (_req, res) => {
  res.set("Cache-Control", "no-store").json(readData().posts);
});

app.post("/api/blog/login", (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
  res.json({ success: true });
});

app.post("/api/blog/posts", (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
  const { posts } = req.body;
  if (!Array.isArray(posts)) return res.status(400).json({ error: "Invalid data" });
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ posts }, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to save blog data:", error);
    res.status(500).json({ error: "Failed to save blog data" });
  }
});

app.get("/api/blog/export", (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
  res.download(DATA_FILE, "blog-backup.json");
});

app.post("/api/blog/import", (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });
  const { data } = req.body;
  if (!data || !Array.isArray(data.posts)) return res.status(400).json({ error: "Invalid data" });
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ posts: data.posts }, null, 2));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to import blog data" });
  }
});

app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// -------------------------------------------------------------- Pages ----
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    // Redirige /page/ vers /page (une seule URL par page pour Google).
    app.use((req, res, next) => {
      if (req.path.length > 1 && req.path.endsWith("/")) {
        const q = req.url.slice(req.path.length);
        return res.redirect(301, req.path.replace(/\/+$/, "") + q);
      }
      next();
    });

    // Fichiers versionnés par Vite : mise en cache longue durée.
    app.use(
      "/assets",
      express.static(path.join(distPath, "assets"), { immutable: true, maxAge: "1y", fallthrough: false }),
    );
    app.use(express.static(distPath, { index: false, redirect: false, maxAge: "7d" }));

    // Pages pré-générées : /a-propos → dist/a-propos.html, etc.
    app.get("*", (req, res) => {
      const clean = decodeURIComponent(req.path).replace(/\.\.+/g, "");
      const file = clean === "/" ? "index.html" : `${clean.slice(1)}.html`;
      const candidate = path.join(distPath, file);
      res.set("Cache-Control", "no-cache");
      if (candidate.startsWith(distPath) && fs.existsSync(candidate)) return res.sendFile(candidate);
      // Article publié après le dernier build : rendu côté navigateur.
      if (clean.startsWith("/blog/") || clean === "/admin") return res.sendFile(path.join(distPath, "app.html"));
      res.status(404).sendFile(path.join(distPath, "404.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
