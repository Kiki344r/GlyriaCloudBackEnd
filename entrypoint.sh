echo "🚀 Démarrage du bot Vaelis Administration..."

# Attendre que la base de données soit disponible (optionnel)
echo "📡 Vérification de la connexion à la base de données..."

# Exécuter les migrations Prisma
echo "🔄 Exécution des migrations Prisma..."
npx prisma migrate deploy

# Générer le client Prisma (au cas où)
echo "⚙️ Génération du client Prisma..."
npx prisma generate

# Démarrer l'application
echo "✅ Démarrage du bot..."
exec node dist/index.js