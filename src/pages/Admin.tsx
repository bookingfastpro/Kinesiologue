import React, { useState, useId } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Save, Download, Upload, Lock, X, Pencil, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo, usePosts, postPath, type BlogPost } from "../seo";
import { PAGES } from "../site";
import { useDialog } from "../components/ui";

const inputClass =
  "w-full px-5 py-3 rounded-2xl border border-sand bg-nude-50/50 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta";

const Field = ({
  label,
  value,
  onChange,
  textarea,
  rows,
  hint,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
  hint?: string;
}) => {
  const id = useId();
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="micro-label !mb-0">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-deep-brown/70">
          {hint}
        </p>
      )}
      {textarea ? (
        <textarea
          id={id}
          value={value || ""}
          rows={rows || 3}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value || ""}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        />
      )}
    </div>
  );
};

const Admin = () => {
  const { posts, setPosts } = usePosts();
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const editRef = useDialog(!!currentPost, () => setCurrentPost(null));

  const flash = (type: "success" | "error", msg: string) => {
    setStatus({ type, msg });
    if (type === "success") window.setTimeout(() => setStatus(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/blog/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) setIsAdmin(true);
      else if (res.status === 401) setLoginError("Mot de passe incorrect.");
      else setLoginError("Le serveur d’administration est indisponible.");
    } catch {
      setLoginError("Le serveur d’administration est indisponible.");
    }
  };

  const savePosts = async (updatedPosts: BlogPost[]) => {
    try {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, posts: updatedPosts }),
      });
      if (res.ok) {
        setPosts(updatedPosts);
        flash("success", "Modifications enregistrées !");
        return true;
      }
      flash("error", res.status === 401 ? "Mot de passe incorrect" : "Erreur lors de l'enregistrement");
    } catch {
      flash("error", "Erreur lors de l'enregistrement");
    }
    return false;
  };

  const addPost = () => {
    setCurrentPost({
      id: Date.now().toString(),
      title: "Nouvel article",
      excerpt: "",
      content: "",
      date: new Date().toLocaleDateString("fr-FR"),
      image: "/images/kinesiologie-bien-etre-corse.webp",
      category: "Bien-être",
    });
  };

  const deletePost = (post: BlogPost) => {
    if (window.confirm(`Supprimer l’article « ${post.title} » ?`)) {
      savePosts(posts.filter((p) => p.id !== post.id));
    }
  };

  const submitPost = async () => {
    if (!currentPost) return;
    const exists = posts.some((p) => p.id === currentPost.id);
    const updated = exists ? posts.map((p) => (p.id === currentPost.id ? currentPost : p)) : [currentPost, ...posts];
    if (await savePosts(updated)) setCurrentPost(null);
  };

  const handleExport = async () => {
    const res = await fetch("/api/blog/export", { headers: { "x-admin-password": password } });
    if (!res.ok) return flash("error", "Export impossible");
    const url = URL.createObjectURL(await res.blob());
    const a = document.createElement("a");
    a.href = url;
    a.download = "blog-backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const res = await fetch("/api/blog/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, data }),
        });
        if (res.ok) {
          setPosts(data.posts || []);
          flash("success", "Importation réussie !");
        } else flash("error", "Importation refusée");
      } catch {
        flash("error", "Fichier invalide");
      }
    };
    reader.readAsText(file);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-nude-50 pt-40 pb-20 px-5 flex justify-center">
        <Seo meta={PAGES.admin} />
        <form onSubmit={handleLogin} className="w-full max-w-md glass rounded-[2.5rem] p-8 md:p-10 space-y-6 h-fit">
          <div className="flex items-center gap-3">
            <Lock className="text-terracotta" aria-hidden="true" />
            <h1 className="text-3xl font-serif">Administration du journal</h1>
          </div>
          <div className="space-y-2">
            <label htmlFor="admin-password" className="micro-label !mb-0">
              Mot de passe
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              aria-invalid={!!loginError}
              aria-describedby={loginError ? "login-error" : undefined}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
            {loginError && (
              <p id="login-error" role="alert" className="text-sm text-red-700">
                {loginError}
              </p>
            )}
          </div>
          <button type="submit" className="btn-luxury w-full">
            Accéder
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude-50 pt-32 md:pt-40 pb-20 px-5 sm:px-8 md:px-16">
      <Seo meta={PAGES.admin} />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <p className="micro-label !mb-2">Panneau d’administration</p>
            <h1 className="text-5xl font-serif text-deep-brown">Gestion du journal</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleExport} className="flex items-center gap-2 px-5 py-3 glass rounded-full text-sm font-bold hover:bg-white">
              <Download size={18} aria-hidden="true" /> Exporter
            </button>
            <label className="flex items-center gap-2 px-5 py-3 glass rounded-full text-sm font-bold hover:bg-white cursor-pointer focus-within:ring-2 focus-within:ring-terracotta">
              <Upload size={18} aria-hidden="true" /> Importer
              <input type="file" accept=".json,application/json" onChange={handleImport} className="sr-only" />
            </label>
            <button type="button" onClick={addPost} className="btn-luxury flex items-center gap-2">
              <Plus size={18} aria-hidden="true" /> Nouvel article
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdmin(false);
                setPassword("");
              }}
              aria-label="Se déconnecter"
              className="w-12 h-12 glass rounded-full flex items-center justify-center text-deep-brown/80 hover:text-deep-brown"
            >
              <Lock size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div aria-live="polite">
          {status && (
            <div
              role={status.type === "error" ? "alert" : "status"}
              className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
                status.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {status.type === "success" ? <CheckCircle2 size={20} aria-hidden="true" /> : <AlertCircle size={20} aria-hidden="true" />}
              <span className="text-sm font-medium">{status.msg}</span>
            </div>
          )}
        </div>

        {posts.length === 0 && <p className="text-deep-brown/80 font-serif italic text-xl">Aucun article pour le moment.</p>}

        <ul className="space-y-6">
          {posts.map((post) => (
            <li
              key={post.id}
              className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-sand/40 flex flex-col md:flex-row gap-6 md:gap-8 items-center"
            >
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 bg-nude-100">
                {post.image && <img src={post.image} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0 space-y-2 w-full">
                <p className="flex items-center gap-3 text-[11px] uppercase tracking-widest">
                  <span className="font-bold text-terracotta">{post.category}</span>
                  <span className="text-deep-brown/75">{post.date}</span>
                </p>
                <h2 className="text-2xl font-serif text-deep-brown truncate">{post.title}</h2>
                <p className="text-sm text-deep-brown/75 line-clamp-1">{post.excerpt}</p>
              </div>
              <div className="flex gap-3">
                <Link
                  to={postPath(post)}
                  aria-label={`Voir l’article « ${post.title} »`}
                  className="w-12 h-12 glass rounded-full flex items-center justify-center text-deep-brown hover:bg-sand"
                >
                  <ExternalLink size={20} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setCurrentPost(post)}
                  aria-label={`Modifier l’article « ${post.title} »`}
                  className="w-12 h-12 glass rounded-full flex items-center justify-center text-deep-brown hover:bg-sand"
                >
                  <Pencil size={20} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => deletePost(post)}
                  aria-label={`Supprimer l’article « ${post.title} »`}
                  className="w-12 h-12 glass rounded-full flex items-center justify-center text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={20} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {currentPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
              className="absolute inset-0 bg-deep-brown/50 backdrop-blur-md"
              onClick={() => setCurrentPost(null)}
            />
            <motion.div
              ref={editRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-title"
              tabIndex={-1}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[94vh] outline-none"
            >
              <div className="p-6 md:p-12 overflow-y-auto space-y-6">
                <div className="flex justify-between items-center">
                  <h2 id="edit-title" className="text-3xl font-serif text-deep-brown">
                    {posts.some((p) => p.id === currentPost.id) ? "Modifier l'article" : "Nouvel article"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setCurrentPost(null)}
                    aria-label="Fermer sans enregistrer"
                    className="w-12 h-12 flex items-center justify-center hover:bg-sand rounded-full"
                  >
                    <X size={24} aria-hidden="true" />
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Titre" value={currentPost.title} onChange={(v) => setCurrentPost({ ...currentPost, title: v })} />
                  <Field label="Catégorie" value={currentPost.category} onChange={(v) => setCurrentPost({ ...currentPost, category: v })} />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Field
                    label="Image (URL)"
                    hint="Ex. /images/kinesiologie-bien-etre-corse.webp ou une adresse https://"
                    value={currentPost.image}
                    onChange={(v) => setCurrentPost({ ...currentPost, image: v })}
                  />
                  <Field
                    label="Date"
                    hint="Format jj/mm/aaaa"
                    value={currentPost.date}
                    onChange={(v) => setCurrentPost({ ...currentPost, date: v })}
                  />
                </div>
                <Field
                  label="Résumé"
                  hint="1 à 2 phrases (environ 150 caractères) : il sert aussi de description pour Google."
                  textarea
                  value={currentPost.excerpt}
                  onChange={(v) => setCurrentPost({ ...currentPost, excerpt: v })}
                />
                <Field
                  label="Contenu de l'article"
                  textarea
                  rows={12}
                  value={currentPost.content}
                  onChange={(v) => setCurrentPost({ ...currentPost, content: v })}
                />
              </div>
              <div className="p-5 md:p-8 bg-nude-50 border-t border-sand flex flex-wrap justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentPost(null)}
                  className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-deep-brown/80 hover:text-deep-brown"
                >
                  Annuler
                </button>
                <button type="button" onClick={submitPost} className="btn-luxury flex items-center gap-2">
                  <Save size={18} aria-hidden="true" /> Enregistrer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
