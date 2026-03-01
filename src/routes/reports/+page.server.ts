import type { PageServerLoad } from './$types';
import { dbQueries } from '$lib/server/queries';

export const load: PageServerLoad = async ({ parent }) => {
    await parent(); // Ensure data from layout is loaded
    const history = await dbQueries.getOrders();

    return { history };
};
