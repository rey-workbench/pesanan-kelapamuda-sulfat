import type { LayoutServerLoad } from './$types';
import { dataService } from '$lib/server/dataService';

export const load: LayoutServerLoad = async ({ setHeaders }) => {
    await dataService.init();
    const [settings, queue] = await Promise.all([
        dataService.getSettings(),
        dataService.getTodayQueue(),
    ]);

    // Tell Netlify's CDN: serve from edge cache for 30s,
    // then revalidate in background (stale-while-revalidate 60s).
    // Browser gets no-cache so it always asks the CDN (not its own stale copy).
    // `durable` stores the response in Netlify's global durable cache so
    // every edge node benefits — not just the one that generated the response.
    setHeaders({
        'Cache-Control': 'no-cache',
        'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=30, stale-while-revalidate=60',
    });

    return { settings, queue };
};
