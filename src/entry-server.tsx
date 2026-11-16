import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";
import { PostsProvider, headTags, postPath, postMeta, toIsoDate, type BlogPost } from "./seo";
import { PAGES, SITE_URL } from "./site";

export { headTags, postPath, postMeta, toIsoDate, PAGES, SITE_URL };

/** Rendu HTML d'une URL (utilisé par scripts/prerender.mjs au moment du build). */
export const render = (url: string, posts: BlogPost[]) =>
  renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <PostsProvider initialPosts={posts}>
          <App />
        </PostsProvider>
      </StaticRouter>
    </StrictMode>,
  );
