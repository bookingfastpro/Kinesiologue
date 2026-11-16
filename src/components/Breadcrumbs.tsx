import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/** Fil d'Ariane (aide à la navigation et compris par Google). */
const Breadcrumbs = ({ items }: { items: { name: string; path?: string }[] }) => (
  <nav aria-label="Fil d’Ariane" className="mb-10">
    <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-deep-brown/75">
      {items.map((it, i) => (
        <li key={it.name} className="flex items-center gap-2">
          {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
          {it.path && i < items.length - 1 ? (
            <Link to={it.path} className="hover:text-deep-brown underline-offset-4 hover:underline">
              {it.name}
            </Link>
          ) : (
            <span aria-current="page" className="text-deep-brown font-bold line-clamp-1">
              {it.name}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
