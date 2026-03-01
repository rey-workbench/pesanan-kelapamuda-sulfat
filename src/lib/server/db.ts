import { createClient } from '@libsql/client';
import { env } from '$env/dynamic/private';

// Pastikan variabel lingkungan tersedia
const url = env.TURSO_DATABASE_URL;
const authToken = env.TURSO_AUTH_TOKEN;

if (!url) {
    throw new Error('TURSO_DATABASE_URL tidak ditemukan di environment variables');
}

const client = createClient({
    url: url,
    authToken: authToken,
});

let initialized = false;

export async function setupDatabaseTables() {
    if (initialized) return;

    // Turso / LibSQL menggunakan dialek SQLite
    await client.execute(`
        CREATE TABLE IF NOT EXISTS settings (
            id TEXT PRIMARY KEY,
            data TEXT NOT NULL
        );
    `);

    await client.execute(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customerName TEXT NOT NULL,
            items TEXT NOT NULL,
            total INTEGER NOT NULL,
            cash INTEGER NOT NULL,
            change INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'pending',
            catatan TEXT,
            createdAt INTEGER NOT NULL
        );
    `);

    initialized = true;
}

export default client;
