FROM node:22-alpine

# Installation des dépendances système nécessaires
RUN apk add --no-cache openssl

WORKDIR /app

# Copie des fichiers de conf + patchs
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# Installation des dépendances (postinstall lancera patch-package)
RUN npm install

# Génération Prisma (patchs déjà appliqués si postinstall fonctionne)
RUN npx prisma generate

# Copie du code source
COPY src ./src

# Build TypeScript
RUN npm run build

# Variables d’environnement
ENV NODE_ENV=production

# Commande de démarrage
CMD ["npm", "start"]