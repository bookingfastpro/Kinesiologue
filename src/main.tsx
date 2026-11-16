import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { PostsProvider, type BlogPost } from "./seo";
import "./fonts";
import "./index.css";

declare global {
  interface Window {
    __INITIAL_POSTS__?: BlogPost[];
  }
}

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <BrowserRouter>
      <PostsProvider initialPosts={window.__INITIAL_POSTS__}>
        <App />
      </PostsProvider>
    </BrowserRouter>
  </StrictMode>
);

// Si la page a été pré-générée au build pour cette URL, on « hydrate » le HTML existant ;
// sinon (développement, nouvel article…) on effectue un rendu classique.
const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
const prerenderedRoute = container.dataset.route;
if (prerenderedRoute && normalize(prerenderedRoute) === normalize(decodeURI(window.location.pathname))) {
  hydrateRoot(container, app);
} else {
  container.innerHTML = "";
  createRoot(container).render(app);
}
