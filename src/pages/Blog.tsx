import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Upload, 
  Lock, 
  X,
  Eye, 
  EyeOff, 
  ArrowLeft,
  FileText,
  Calendar,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/blog/posts?t=${Date.now()}`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdmin(true);
  };

  const savePosts = async (updatedPosts: BlogPost[]) => {
    try {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, posts: updatedPosts })
      });
      if (res.ok) {
        setPosts(updatedPosts);
        setStatus({ type: 'success', msg: 'Modifications enregistrées !' });
        setTimeout(() => setStatus(null), 3000);
      } else if (res.status === 401) {
        setStatus({ type: 'error', msg: 'Mot de passe incorrect' });
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      setStatus({ type: 'error', msg: 'Erreur lors de l\'enregistrement' });
    }
  };

  const addPost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: "Nouvel article",
      excerpt: "Résumé de l'article...",
      content: "Contenu détaillé...",
      date: new Date().toLocaleDateString('fr-FR'),
      image: "https://picsum.photos/seed/blog/800/600",
      category: "Bien-être"
    };
    const updated = [newPost, ...posts];
    savePosts(updated);
  };

  const deletePost = (id: string) => {
    if (window.confirm("Supprimer cet article ?")) {
      const updated = posts.filter(p => p.id !== id);
      savePosts(updated);
    }
  };

  const updatePost = (id: string, updates: Partial<BlogPost>) => {
    const updated = posts.map(p => p.id === id ? { ...p, ...updates } : p);
    savePosts(updated);
    setIsEditing(false);
  };

  const handleExport = () => {
    window.location.href = `/api/blog/export?password=${password}`;
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
          body: JSON.stringify({ password, data })
        });
        if (res.ok) {
          setPosts(data.posts);
          setStatus({ type: 'success', msg: 'Importation réussie !' });
        }
      } catch (error) {
        setStatus({ type: 'error', msg: 'Fichier invalide' });
      }
    };
    reader.readAsText(file);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-nude-50 flex items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-5xl font-serif text-deep-brown">Le Journal</h1>
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="p-3 glass rounded-full text-deep-brown/40 hover:text-deep-brown transition-colors"
            >
              <Lock size={20} />
            </button>
          </div>

          {showPassword && (
            <motion.form 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleLogin}
              className="mb-12 flex gap-4 max-w-md mx-auto"
            >
              <input 
                type="password" 
                placeholder="Mot de passe admin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 px-6 py-3 rounded-full border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-terracotta/20"
              />
              <button type="submit" className="btn-luxury py-3">Accéder</button>
            </motion.form>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-12 h-12 border-4 border-sand border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
                <p className="text-deep-brown/40 font-serif italic">Chargement du journal...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="col-span-full py-20 text-center glass rounded-[3rem]">
                <p className="text-deep-brown/40 font-serif italic">Aucun article pour le moment.</p>
              </div>
            ) : (
              posts.map((post) => (
                <motion.article 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-sand/30"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-terracotta px-3 py-1 bg-terracotta/5 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-deep-brown/40">{post.date}</span>
                    </div>
                    <h2 className="text-2xl font-serif text-deep-brown mb-4 leading-tight group-hover:text-terracotta transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-deep-brown/60 font-light line-clamp-3 mb-6">
                      {post.excerpt}
                    </p>
                    <button 
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-deep-brown group-hover:gap-4 transition-all"
                    >
                      Lire la suite <ArrowLeft className="rotate-180" size={14} />
                    </button>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>

        {/* Post Detail Modal */}
        <AnimatePresence>
          {selectedPost && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-deep-brown/40 backdrop-blur-md"
                onClick={() => setSelectedPost(null)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="overflow-y-auto">
                  <div className="aspect-video w-full relative">
                    <img src={selectedPost.image} alt={selectedPost.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-8 md:p-16 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-terracotta px-4 py-1.5 bg-terracotta/5 rounded-full">
                          {selectedPost.category}
                        </span>
                        <span className="text-xs uppercase tracking-[0.2em] text-deep-brown/40">{selectedPost.date}</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-serif text-deep-brown leading-tight">{selectedPost.title}</h1>
                    </div>
                    <div className="prose prose-xl prose-stone max-w-none text-deep-brown/70 font-light leading-relaxed whitespace-pre-wrap">
                      {selectedPost.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nude-50 pt-32 pb-20 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="micro-label !mb-0">Panel Administration</span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <h1 className="text-5xl font-serif text-deep-brown">Gestion du Blog</h1>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button onClick={handleExport} className="flex items-center gap-2 px-6 py-3 glass rounded-full text-sm font-bold hover:bg-white transition-all">
              <Download size={18} /> Export JSON
            </button>
            <label className="flex items-center gap-2 px-6 py-3 glass rounded-full text-sm font-bold hover:bg-white transition-all cursor-pointer">
              <Upload size={18} /> Import JSON
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <button onClick={addPost} className="btn-luxury flex items-center gap-2">
              <Plus size={20} /> Nouvel Article
            </button>
            <button onClick={() => setIsAdmin(false)} className="p-3 glass rounded-full text-deep-brown/40 hover:text-deep-brown transition-colors">
              <Lock size={20} />
            </button>
          </div>
        </div>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}
          >
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{status.msg}</span>
          </motion.div>
        )}

        <div className="space-y-6">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              layout
              className="bg-white rounded-[2rem] p-8 shadow-sm border border-sand/30 flex flex-col md:flex-row gap-8 items-center"
            >
              <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                <img src={post.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-terracotta">{post.category}</span>
                  <span className="text-[10px] uppercase tracking-widest text-deep-brown/40">{post.date}</span>
                </div>
                <h3 className="text-2xl font-serif text-deep-brown truncate">{post.title}</h3>
                <p className="text-sm text-deep-brown/60 line-clamp-1">{post.excerpt}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setCurrentPost(post);
                    setIsEditing(true);
                  }}
                  className="p-4 glass rounded-full text-deep-brown hover:bg-sand transition-colors"
                >
                  <FileText size={20} />
                </button>
                <button 
                  onClick={() => deletePost(post.id)}
                  className="p-4 glass rounded-full text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-deep-brown/40 backdrop-blur-md"
              onClick={() => setIsEditing(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 md:p-12 overflow-y-auto space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-serif text-deep-brown">Modifier l'article</h2>
                  <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-sand rounded-full transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="micro-label">Titre</label>
                    <input 
                      type="text" 
                      value={currentPost.title}
                      onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                      className="w-full px-6 py-3 rounded-2xl border border-sand bg-nude-50/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="micro-label">Catégorie</label>
                    <input 
                      type="text" 
                      value={currentPost.category}
                      onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                      className="w-full px-6 py-3 rounded-2xl border border-sand bg-nude-50/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="micro-label">Image URL</label>
                  <input 
                    type="text" 
                    value={currentPost.image}
                    onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                    className="w-full px-6 py-3 rounded-2xl border border-sand bg-nude-50/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                  />
                </div>

                <div className="space-y-4">
                  <label className="micro-label">Résumé</label>
                  <textarea 
                    value={currentPost.excerpt}
                    onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                    rows={3}
                    className="w-full px-6 py-3 rounded-2xl border border-sand bg-nude-50/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="micro-label">Contenu de l'article</label>
                  <textarea 
                    value={currentPost.content}
                    onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                    rows={10}
                    className="w-full px-6 py-3 rounded-2xl border border-sand bg-nude-50/50 focus:outline-none focus:ring-2 focus:ring-terracotta/20 resize-none"
                  />
                </div>
              </div>

              <div className="p-8 bg-nude-50 border-t border-sand flex justify-end gap-4">
                <button onClick={() => setIsEditing(false)} className="px-8 py-3 text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
                  Annuler
                </button>
                <button 
                  onClick={() => updatePost(currentPost.id!, currentPost)}
                  className="btn-luxury flex items-center gap-2"
                >
                  <Save size={18} /> Enregistrer les modifications
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
