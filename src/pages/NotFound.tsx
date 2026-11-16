import { Link } from "react-router-dom";
import { Seo } from "../seo";
import { PAGES } from "../site";

const NotFound = () => (
  <div className="min-h-[80vh] bg-nude-50 pt-40 pb-20 px-5 sm:px-8 flex items-center justify-center text-center">
    <Seo meta={PAGES.notFound} />
    <div className="max-w-xl">
      <span className="micro-label">Erreur 404</span>
      <h1 className="text-5xl md:text-7xl font-serif text-deep-brown mb-6">Page introuvable</h1>
      <p className="text-lg text-deep-brown/80 mb-10">
        La page que vous cherchez n’existe pas ou a été déplacée. Retrouvez votre chemin depuis l’accueil.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="btn-luxury">
          Retour à l’accueil
        </Link>
        <Link to="/#contact" className="btn-luxury-outline">
          Contact
        </Link>
      </div>
    </div>
  </div>
);

export default NotFound;
