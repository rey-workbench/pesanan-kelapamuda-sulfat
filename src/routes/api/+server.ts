import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dbQueries } from '$lib/server/queries';
import { setupDatabaseTables } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { action, payload } = body;

        switch (action) {
            case 'initdb':
                await setupDatabaseTables();
                return json({ success: true, message: 'Database berhasil disiapkan!' });

            case 'addOrder':
                await dbQueries.addOrder(payload);
                return json({ success: true });

            case 'updateStatus':
                await dbQueries.updateOrderStatus(payload.id, payload.status);
                return json({ success: true });

            case 'updateOrder':
                await dbQueries.updateOrder(payload.id, payload.order);
                return json({ success: true });

            case 'deleteOrder':
                await dbQueries.deleteOrder(payload.id);
                return json({ success: true });

            case 'saveSettings':
                await dbQueries.saveSettings(payload);
                return json({ success: true });

            default:
                return json({ error: 'Action not found' }, { status: 400 });
        }
    } catch (e: any) {
        console.error('API Error:', e);
        return json({ error: e.message }, { status: 500 });
    }
};
