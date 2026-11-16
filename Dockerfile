# Étape 1 : build (pré-rendu SEO inclus)
FROM node:20-slim AS build
WORKDIR /app
# URL publique du site, utilisée pour les balises canonical, le sitemap et robots.txt
ARG SITE_URL=https://kinesiologue-corse.com
ENV SITE_URL=$SITE_URL
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 2 : production (serveur statique nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
