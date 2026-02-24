import type { LayoutServerLoad } from './$types';
import { dataService } from '$lib/server/dataService';

export const load: LayoutServerLoad = async () => {
    await dataService.init();
    const settings = await dataService.getSettings();
    const queue = await dataService.getTodayQueue();
    return { settings, queue };
};
