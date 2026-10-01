const express = require("express");
const session = require("express-session");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "EPBLOGS2026";
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex");

// On hosting, set DATA_DIR=/data so posts and uploaded images survive restarts/deploys.
// Locally it defaults to ./data.
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(DATA_DIR, "uploads");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(POSTS_FILE)) fs.writeFileSync(POSTS_FILE, "[]");

function readPosts() {
  try { return JSON.parse(fs.readFileSync(POSTS_FILE, "utf8")); }
  catch { return []; }
}
function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (/^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG, WEBP and GIF images are allowed."));
  }
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 1000 * 60 * 60 * 8 }
}));

function requireAdmin(req, res, next) {
  if (req.session.admin) return next();
  res.status(401).json({ error: "Unauthorized" });
}

app.get("/health", (_, res) => res.json({ ok: true, service: "EP BLOGS" }));

app.get("/api/posts", (req, res) => {
  const posts = readPosts().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(posts);
});

app.post("/api/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.admin = true;
    return res.json({ ok: true });
  }
  res.status(401).json({ error: "Incorrect password" });
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/me", (req, res) => res.json({ admin: !!req.session.admin }));

app.post("/api/posts", requireAdmin, upload.single("image"), (req, res) => {
  const { title, category, excerpt, content, author, featured } = req.body;
  if (!title || !category || !content) return res.status(400).json({ error: "Title, category and content are required." });

  const posts = readPosts();
  const post = {
    id: crypto.randomUUID(),
    title: title.trim(),
    category: category.trim(),
    excerpt: (excerpt || "").trim(),
    content: content.trim(),
    author: (author || "EP BLOGS").trim(),
    image: req.file ? `/uploads/${req.file.filename}` : "",
    featured: featured === "true",
    createdAt: new Date().toISOString()
  };
  posts.push(post);
  writePosts(posts);
  res.json(post);
});

app.delete("/api/posts/:id", requireAdmin, (req, res) => {
  const posts = readPosts();
  const post = posts.find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });

  if (post.image) {
    const file = path.join(__dirname, "public", post.image.replace(/^\//, ""));
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  writePosts(posts.filter(p => p.id !== req.params.id));
  res.json({ ok: true });
});

app.use("/uploads", express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`EP BLOGS running at http://localhost:${PORT}`);
});
