import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Seo, usePosts, findPostBySlug, postMeta, toIsoDate } from "../seo";
import { useBooking } from "../components/booking";
import Breadcrumbs from "../components/Breadcrumbs";
import NotFound from "./NotFound";

const BlogPostPage = () => {
  const { slug = "" } = useParams();
  const { posts, isLoading } = usePosts();
  const { open: openBooking } = useBooking();
  const post = findPostBySlug(posts, slug);

  const meta = useMemo(() => (post ? postMeta(post) : null), [post]);

  if (!post) {
    if (isLoading) {
      return (
        <div className="min-h-screen pt-40 text-center" role="status">
          <p className="font-serif italic text-xl text-deep-brown/75">Chargement de l’article…</p>
        </div>
      );
    }
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-nude-50 pt-32 md:pt-40 pb-20 px-5 sm:px-8 md:px-16">
      {meta && <Seo meta={meta} />}
      <article className="max-w-3xl mx-auto">
        <Breadcrumbs items={[{ name: "Accueil", path: "/" }, { name: "Le Journal", path: "/blog" }, { name: post.title }]} />
        <header className="space-y-6 mb-10">
          <div className="flex items-center gap-4">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-terracotta px-4 py-1.5 bg-terracotta/10 rounded-full">
              {post.category}
            </span>
            <time dateTime={toIsoDate(post.date)} className="text-xs uppercase tracking-[0.2em] text-deep-brown/75">
              {post.date}
            </time>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-deep-brown leading-tight">{post.title}</h1>
          {post.excerpt && <p className="text-xl md:text-2xl text-deep-brown/80 font-light leading-relaxed">{post.excerpt}</p>}
        </header>
        {post.image && (
          <img
            src={post.image}
            alt=""
            className="w-full aspect-video object-cover rounded-[2rem] md:rounded-[3rem] shadow-xl mb-12"
          />
        )}
        <div className="article-content text-lg md:text-xl text-deep-brown/85 font-light leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        <aside className="mt-16 p-8 md:p-12 bg-deep-brown text-nude-50 rounded-[2.5rem] text-center space-y-6">
          <h2 className="text-3xl font-serif">Envie d’en parler lors d’une séance ?</h2>
          <p className="text-nude-50/80">Cabinet de kinésiologie à Porto-Vecchio – adultes et enfants.</p>
          <button type="button" onClick={openBooking} className="btn-luxury !bg-white !text-deep-brown">
            Prendre rendez-vous
          </button>
        </aside>

        <Link
          to="/blog"
          className="mt-12 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-deep-brown hover:text-terracotta py-2"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Tous les articles
        </Link>
      </article>
    </div>
  );
};

export default BlogPostPage;
