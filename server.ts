import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "blog-data.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ posts: [] }, null, 2));
}

// API Routes
app.get("/api/blog/posts", (req, res) => {
  console.log("Fetch blog posts request received");
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    console.log(`Sending ${data.posts.length} posts to client`);
    res.json(data.posts);
  } catch (error) {
    console.error("Failed to read blog data:", error);
    res.status(500).json({ error: "Failed to read blog data" });
  }
});

app.post("/api/blog/posts", (req, res) => {
  const { password, posts } = req.body;
  console.log("Save request received. Password provided:", password === ADMIN_PASSWORD ? "Correct" : "Incorrect");
  
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ posts }, null, 2));
    console.log("Blog data saved successfully to", DATA_FILE);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to save blog data:", error);
    res.status(500).json({ error: "Failed to save blog data" });
  }
});

app.get("/api/blog/export", (req, res) => {
  const { password } = req.query;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.download(DATA_FILE, "blog-backup.json");
});

app.post("/api/blog/import", (req, res) => {
  const { password, data } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to import blog data" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
