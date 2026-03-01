import client from './db';
import type { Order, AppSettings, OrderItem } from '../models';
import { DEFAULT_SETTINGS } from '../models';

let cachedSettings: { data: AppSettings; timestamp: number } | null = null;
let cachedOrders: { data: Order[]; timestamp: number } | null = null;
let isFetchingOrders = false;

const SETTINGS_CACHE_TTL = 5 * 60 * 1000;  // 5 minutes
const ORDERS_CACHE_TTL = 5 * 1000; // 5 seconds stale-while-revalidate threshold

export const dbQueries = {
    async getSettings(): Promise<AppSettings> {
        const now = Date.now();
        if (cachedSettings && (now - cachedSettings.timestamp) < SETTINGS_CACHE_TTL) {
            return cachedSettings.data;
        }

        const res = await client.execute({
            sql: 'SELECT data FROM settings WHERE id = ?',
            args: ['current']
        });

        const parsed = res.rows[0] ? JSON.parse(res.rows[0].data as string) : DEFAULT_SETTINGS;
        cachedSettings = { data: parsed, timestamp: now };
        return parsed;
    },

    async saveSettings(settings: AppSettings) {
        const data = JSON.stringify(settings);
        await client.execute({
            sql: 'INSERT OR REPLACE INTO settings (id, data) VALUES (?, ?)',
            args: ['current', data],
        });
        cachedSettings = { data: settings, timestamp: Date.now() };
    },

    async getTodayQueue(): Promise<Order[]> {
        const today = new Date().toISOString().split('T')[0];
        const res = await client.execute({
            sql: 'SELECT * FROM orders WHERE date = ? ORDER BY createdAt ASC',
            args: [today]
        });

        return res.rows.map(row => this._mapOrder(row));
    },

    async getOrders(): Promise<Order[]> {
        const fetchOrders = async () => {
            if (isFetchingOrders) return;
            isFetchingOrders = true;
            try {
                const res = await client.execute('SELECT * FROM orders ORDER BY createdAt DESC');
                const parsed = res.rows.map(row => this._mapOrder(row));
                cachedOrders = { data: parsed, timestamp: Date.now() };
                return parsed;
            } finally {
                isFetchingOrders = false;
            }
        };

        if (cachedOrders && cachedOrders.data) {
            // Trigger background fetch if cache is stale (stale-while-revalidate)
            if (!isFetchingOrders && Date.now() - cachedOrders.timestamp > ORDERS_CACHE_TTL) {
                fetchOrders().catch(console.error);
            }
            return cachedOrders.data;
        }

        const data = await fetchOrders();
        return data || [];
    },

    _mapOrder(row: any): Order {
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
                options: Array.isArray(it.options) ? it.options : (it.option ? [it.option] : []),
            })),
            total: (row.total as number) || 0,
            cash: (row.cash as number) || 0,
            change: (row.change as number) || 0,
            date: (row.date as string) || '',
            status: (row.status as any) || 'pending',
            catatan: (row.catatan as string) || '',
            createdAt: (row.createdAt as number) || Date.now(),
        };
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

        this.invalidateOrdersCache();
        return res;
    },

    async updateOrderStatus(id: number, status: Order['status']) {
        await client.execute({
            sql: 'UPDATE orders SET status = ? WHERE id = ?',
            args: [status, id]
        });
        this.invalidateOrdersCache();
    },

    async updateOrder(id: number, updates: { items: OrderItem[]; total: number; change: number; catatan: string }) {
        await client.execute({
            sql: 'UPDATE orders SET items = ?, total = ?, `change` = ?, catatan = ? WHERE id = ?',
            args: [JSON.stringify(updates.items), updates.total, updates.change, updates.catatan, id],
        });
        this.invalidateOrdersCache();
    },

    async deleteOrder(id: number) {
        await client.execute({
            sql: 'DELETE FROM orders WHERE id = ?',
            args: [id]
        });
        this.invalidateOrdersCache();
    },

    // ── Manual cache invalidation 
    invalidateSettingsCache() {
        cachedSettings = null;
    },

    invalidateOrdersCache() {
        cachedOrders = null;
    },
};
