import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { dataService } from '$lib/server/dataService';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { action, payload } = body;

        await dataService.init();

        switch (action) {
            case 'addOrder':
                await dataService.addOrder(payload);
                return json({ success: true });

            case 'updateStatus':
                await dataService.updateOrderStatus(payload.id, payload.status);
                return json({ success: true });

            case 'deleteOrder':
                await dataService.deleteOrder(payload.id);
                return json({ success: true });

            case 'saveSettings':
                await dataService.saveSettings(payload);
                return json({ success: true });

            default:
                return json({ error: 'Action not found' }, { status: 400 });
        }
    } catch (e: any) {
        console.error('API Error:', e);
        return json({ error: e.message }, { status: 500 });
    }
};
