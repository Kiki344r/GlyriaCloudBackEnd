FROM node:22-alpine

# Installation des dépendances système + outils de build pour node-gyp (node-pty)
RUN apk add --no-cache \
    openssl \
    python3 \
    make \
    g++ \
    gcc

WORKDIR /app

# Copie des fichiers de conf
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma

# L'installation va maintenant réussir car node-gyp trouvera Python et le compilateur C++
RUN npm install

# Génération Prisma
RUN npx prisma generate

# Copie du code source
COPY src ./src

# Build TypeScript
RUN npm run build

# Variables d’environnement
ENV NODE_ENV=production

# Commande de démarrage
CMD ["npm", "start"]