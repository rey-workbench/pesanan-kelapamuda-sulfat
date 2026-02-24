import { createClient } from '@libsql/client';
import { resolve } from 'path';

// Gunakan file lokal database.db
const dbPath = 'file:' + resolve('database.db');
const client = createClient({
    url: dbPath,
});

let initialized = false;

// Inisialisasi Tabel secara asinkron (akan dipanggil saat pertama kali dibutuhkan)
export async function initDB() {
    if (initialized) return;

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
            createdAt INTEGER NOT NULL
        );
    `);

    initialized = true;
}

export default client;
