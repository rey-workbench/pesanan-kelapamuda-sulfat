import type { PageServerLoad } from './$types';
import { dataService } from '$lib/server/dataService';

export const load: PageServerLoad = async ({ parent, setHeaders }) => {
    // Data settings & queue sudah dari layout
    await parent();

    // Khusus Laporan butuh riwayat lengkap
    const history = await dataService.getOrders();

    // Historical reports can be cached slightly longer —
    // they only change when a new order is added
    setHeaders({
        'Cache-Control': 'no-cache',
        'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=60, stale-while-revalidate=120',
    });

    return { history };
};
