import type { LayoutServerLoad } from './$types';
import { dataService } from '$lib/server/dataService';

export const load: LayoutServerLoad = async () => {
    await dataService.init();
    const [settings, queue] = await Promise.all([
        dataService.getSettings(),
        dataService.getTodayQueue(),
    ]);

    return { settings, queue };
};
