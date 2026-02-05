// config/redis.ts
import {createClient} from 'redis';

// Instance directe
export const redis = createClient({
    url: process.env.REDIS_URL
});

// Gestion des événements
redis.on('error', (err) => console.error('Redis Error:', err));
redis.on('connect', () => console.log('Connecté à Redis'));

// Connexion automatique
redis.connect();

// Optionnel : fonction de fermeture
export async function closeRedis(): Promise<void> {
    await redis.quit();
}