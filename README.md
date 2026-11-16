# Inès Mallaroni – Kinésiologue à Porto-Vecchio

Site vitrine (React + Vite + Tailwind) avec pré-rendu statique pour le référencement.

## Commandes

```bash
npm install
npm run dev        # développement : http://localhost:3000
npm run build      # build de production + pré-rendu SEO
npm run start      # serveur de production (Express) : sert dist/ + API du journal
```

Variables d'environnement (production) :

| Variable         | Rôle                                                                 |
| ---------------- | -------------------------------------------------------------------- |
| `SITE_URL`       | **Domaine public du site** (ex. `https://www.mon-domaine.fr`). Utilisé pour les URL canoniques, le sitemap, robots.txt et les données structurées. À définir **au moment du build**. |
| `ADMIN_PASSWORD` | Mot de passe de l'espace `/admin` (gestion du journal). **Obligatoire en production.** |
| `PORT`           | Port du serveur Express (3000 par défaut).                            |

Avec Docker (nginx, site statique sans API d'administration) :

```bash
docker build --build-arg SITE_URL=https://www.mon-domaine.fr -t kinesiologue .
```

## Modifier les informations

Tout est centralisé dans **`src/site.ts`** : coordonnées, tarifs, prestations, FAQ, titres et descriptions des pages
pour Google, informations des mentions légales (SIRET, e-mail, hébergeur — **à compléter**), lien Instagram.

## Référencement (SEO) mis en place

- Pré-rendu HTML de chaque page au build (`scripts/prerender.mjs`) : Google et les réseaux sociaux lisent le contenu sans JavaScript.
- Balises `title`, `description`, `canonical`, Open Graph et Twitter propres à chaque page.
- Données structurées schema.org : `LocalBusiness` / `HealthAndBeautyBusiness` (adresse, téléphone, tarifs, zone desservie, réservation), `Person`, `WebSite`, `FAQPage`, `BreadcrumbList`, `BlogPosting`.
- `sitemap.xml`, `robots.txt` et `llms.txt` générés automatiquement (articles du journal inclus).
- Une URL propre par article (`/blog/titre-de-l-article-<id>`), vraie page 404, redirection des URL avec `/` final.
- Images WebP optimisées et responsives (≈ 17 Mo → < 500 Ko), noms de fichiers et textes alternatifs descriptifs.
- Polices auto-hébergées, favicon, icônes, manifeste, image de partage `og-image.jpg`.

Les photos d'origine sont conservées dans `photos-originales/` (non publiées).

## Après la mise en ligne

1. Déclarer le site dans [Google Search Console](https://search.google.com/search-console) et y soumettre `https://<votre-domaine>/sitemap.xml`.
2. Ajouter l'URL du site sur la fiche **Google Business Profile** (c'est le levier n°1 du référencement local).
3. Vérifier les données structurées avec le [test des résultats enrichis](https://search.google.com/test/rich-results).
4. Après chaque nouvel article publié depuis `/admin`, relancer `npm run build` pour l'ajouter au sitemap et au pré-rendu.
