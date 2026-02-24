import client, { initDB } from './db';
import type { Order, AppSettings } from '../models';
import { DEFAULT_SETTINGS } from '../models';

// In-memory cache
let cachedSettings: AppSettings | null = null;
let cachedQueue: { data: Order[], timestamp: number } | null = null;
const QUEUE_CACHE_TTL = 5000; // 5 seconds cache for queue

export const dataService = {
    async init() {
        await initDB();
    },

    async getSettings(): Promise<AppSettings> {
        // Return from cache if available
        if (cachedSettings) return cachedSettings;

        const res = await client.execute({
            sql: 'SELECT data FROM settings WHERE id = ?',
            args: ['current']
        });

        cachedSettings = res.rows[0] ? JSON.parse(res.rows[0].data as string) : DEFAULT_SETTINGS;
        return cachedSettings as AppSettings;
    },

    async saveSettings(settings: AppSettings) {
        const data = JSON.stringify(settings);
        const existing = await client.execute({
            sql: 'SELECT id FROM settings WHERE id = ?',
            args: ['current']
        });

        if (existing.rows.length > 0) {
            await client.execute({
                sql: 'UPDATE settings SET data = ? WHERE id = ?',
                args: [data, 'current']
            });
        } else {
            await client.execute({
                sql: 'INSERT INTO settings (id, data) VALUES (?, ?)',
                args: ['current', data]
            });
        }

        // Invalidate settings cache
        cachedSettings = settings;
    },

    async getTodayQueue(): Promise<Order[]> {
        const now = Date.now();
        // Return from cache if fresh
        if (cachedQueue && (now - cachedQueue.timestamp) < QUEUE_CACHE_TTL) {
            return cachedQueue.data;
        }

        const today = new Date().toISOString().split('T')[0];
        const res = await client.execute({
            sql: 'SELECT * FROM orders WHERE date = ? ORDER BY createdAt ASC',
            args: [today]
        });

        const data = res.rows.map(row => {
            const items = (() => {
                try {
                    const parsed = JSON.parse(row.items as string || '[]');
                    return Array.isArray(parsed) ? parsed : [];
                } catch { return []; }
            })();
            return {
                id: row.id as number,
                customerName: (row.customerName as string) || 'Pelanggan',
                items: items.map((it: any) => ({
                    type: it.type,
                    quantity: it.quantity,
                    price: it.price,
                    options: Array.isArray(it.options) ? it.options
                        : it.option ? [it.option] : [],
                })),
                total: (row.total as number) || 0,
                cash: (row.cash as number) || 0,
                change: (row.change as number) || 0,
                date: (row.date as string) || '',
                status: (row.status as any) || 'pending',
                catatan: (row.catatan as string) || '',
                createdAt: (row.createdAt as number) || Date.now(),
            };
        });

        cachedQueue = { data, timestamp: now };
        return data;
    },

    async getOrders(): Promise<Order[]> {
        const res = await client.execute('SELECT * FROM orders ORDER BY createdAt DESC');
        return res.rows.map(row => {
            const items = (() => {
                try {
                    const parsed = JSON.parse(row.items as string || '[]');
                    return Array.isArray(parsed) ? parsed : [];
                } catch { return []; }
            })();
            return {
                id: row.id as number,
                customerName: (row.customerName as string) || 'Pelanggan',
                items: items.map((it: any) => ({
                    type: it.type,
                    quantity: it.quantity,
                    price: it.price,
                    options: Array.isArray(it.options) ? it.options
                        : it.option ? [it.option] : [],
                })),
                total: (row.total as number) || 0,
                cash: (row.cash as number) || 0,
                change: (row.change as number) || 0,
                date: (row.date as string) || '',
                status: (row.status as any) || 'pending',
                catatan: (row.catatan as string) || '',
                createdAt: (row.createdAt as number) || Date.now(),
            };
        });
    },

    async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>) {
        const res = await client.execute({
            sql: `INSERT INTO orders (customerName, items, total, cash, \`change\`, date, catatan, createdAt)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                order.customerName,
                JSON.stringify(order.items),
                order.total,
                order.cash,
                order.change,
                order.date,
                order.catatan || '',
                Date.now()
            ]
        });

        cachedQueue = null;
        return res;
    },

    async updateOrderStatus(id: number, status: Order['status']) {
        await client.execute({
            sql: 'UPDATE orders SET status = ? WHERE id = ?',
            args: [status, id]
        });

        // Invalidate queue cache
        cachedQueue = null;
    },

    async deleteOrder(id: number) {
        await client.execute({
            sql: 'DELETE FROM orders WHERE id = ?',
            args: [id]
        });

        // Invalidate queue cache
        cachedQueue = null;
    }
};
