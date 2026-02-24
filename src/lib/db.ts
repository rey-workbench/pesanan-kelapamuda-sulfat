import { browser } from '$app/environment';
import type { Order, AppSettings } from './models';
import { DEFAULT_SETTINGS } from './models';

let dbInstance: any = null;

async function getDB() {
    if (!browser) return null;
    if (dbInstance) return dbInstance;

    const mod = await import('db.js');
    const db = mod.default || mod;

    dbInstance = await db.open({
        server: 'kelapa_muda_sulfat',
        version: 1,
        schema: {
            orders: {
                key: { keyPath: 'id', autoIncrement: true },
                indexes: {
                    customerName: {},
                    date: {},
                    status: {},
                    createdAt: {}
                }
            },
            settings: {
                key: { keyPath: 'id' }
            }
        }
    });


    return dbInstance;
}

export const dbService = {
    async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>) {
        const db = await getDB();
        return db.orders.add({
            ...order,
            status: 'pending',
            createdAt: Date.now()
        });
    },
    async getTodayQueue() {
        const db = await getDB();
        if (!db) return [];
        const today = new Date().toISOString().split('T')[0];
        const orders = await db.orders.query('date').only(today).execute();
        // Today's orders, from oldest to newest (ascending createdAt)
        return orders.sort((a: Order, b: Order) => a.createdAt - b.createdAt);
    },
    async getOrders() {
        const db = await getDB();
        if (!db) return [];
        return db.orders.query().all().execute();
    },
    async updateOrderStatus(id: number, status: Order['status']) {
        const db = await getDB();
        if (!db) return;
        const order = await db.orders.get(id);
        if (order) {
            order.status = status;
            return db.orders.update(order);
        }
    },
    async deleteOrder(id: number) {
        const db = await getDB();
        if (!db) return;
        return db.orders.remove(id);
    },
    async getSettings(): Promise<AppSettings> {
        const db = await getDB();
        if (!db) return DEFAULT_SETTINGS;
        const settings = await db.settings.get('current');
        return settings || DEFAULT_SETTINGS;
    },
    async saveSettings(settings: AppSettings) {
        const db = await getDB();
        if (!db) return;

        // Deep clone to remove Svelte proxies/reactive state
        const plainSettings = JSON.parse(JSON.stringify(settings));

        const existing = await db.settings.get('current');
        if (existing) {
            return db.settings.update({ id: 'current', ...plainSettings });
        } else {
            return db.settings.add({ id: 'current', ...plainSettings });
        }
    }
};
