import type { LayoutServerLoad } from './$types';
import { dbQueries } from '$lib/server/queries';

export const load: LayoutServerLoad = async () => {
    const [settings, queue] = await Promise.all([
        dbQueries.getSettings(),
        dbQueries.getTodayQueue(),
    ]);

    return { settings, queue };
};
