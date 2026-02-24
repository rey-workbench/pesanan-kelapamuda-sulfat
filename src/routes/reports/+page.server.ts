import type { PageServerLoad } from './$types';
import { dataService } from '$lib/server/dataService';

export const load: PageServerLoad = async ({ parent }) => {
    await parent(); // Ensure data from layout is loaded
    const history = await dataService.getOrders();

    return { history };
};
