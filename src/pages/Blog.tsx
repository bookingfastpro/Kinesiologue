import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo, usePosts, postPath, toIsoDate } from "../seo";
import { PAGES } from "../site";
import Breadcrumbs from "../components/Breadcrumbs";

const Blog = () => {
  const { posts, isLoading } = usePosts();

  return (
    <div className="min-h-screen bg-nude-50 pt-32 md:pt-40 pb-20 px-5 sm:px-8 md:px-16">
      <Seo meta={PAGES.blog} />
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ name: "Accueil", path: "/" }, { name: "Le Journal" }]} />
        <header className="mb-12 md:mb-16 max-w-3xl">
          <span className="micro-label">Conseils & inspirations</span>
          <h1 className="text-5xl md:text-7xl font-serif text-deep-brown mb-6">Le Journal</h1>
          <p className="text-lg md:text-xl text-deep-brown/80 font-light leading-relaxed">
            Articles, réflexions et conseils bien-être autour de la kinésiologie, de la gestion du stress, des émotions et
            de l’équilibre au quotidien.
          </p>
        </header>

        {isLoading && posts.length === 0 ? (
          <div className="py-20 text-center" role="status">
            <div
              aria-hidden="true"
              className="w-12 h-12 border-4 border-sand border-t-terracotta rounded-full animate-spin mx-auto mb-4"
            />
            <p className="text-deep-brown/75 font-serif italic text-xl">Chargement du journal…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 px-6 text-center glass rounded-[3rem]">
            <p className="text-deep-brown/80 font-serif italic text-2xl mb-6">Les premiers articles arrivent bientôt.</p>
            <Link to="/#faq" className="btn-luxury-outline">
              Lire les questions fréquentes
            </Link>
          </div>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.li
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-sand/40 focus-within:ring-4 focus-within:ring-terracotta/50"
              >
                <article>
                  <div className="aspect-[16/10] overflow-hidden bg-nude-100">
                    {post.image && (
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[11px] uppercase tracking-widest font-bold text-terracotta px-3 py-1 bg-terracotta/10 rounded-full">
                        {post.category}
                      </span>
                      <time dateTime={toIsoDate(post.date)} className="text-[11px] uppercase tracking-widest text-deep-brown/75">
                        {post.date}
                      </time>
                    </div>
                    <h2 className="text-2xl font-serif text-deep-brown mb-4 leading-tight group-hover:text-terracotta transition-colors">
                      <Link to={postPath(post)} className="after:absolute after:inset-0 after:content-[''] focus:outline-none">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-deep-brown/80 font-light line-clamp-3 mb-6">{post.excerpt}</p>
                    <span
                      aria-hidden="true"
                      className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-deep-brown group-hover:gap-4 transition-all"
                    >
                      Lire la suite <ArrowRight size={14} />
                    </span>
                  </div>
                </article>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Blog;
