import type { PageServerLoad } from './$types';
import { dataService } from '$lib/server/dataService';

export const load: PageServerLoad = async ({ parent }) => {
    // Data settings & queue sudah dari layout
    await parent();

    // Khusus Laporan butuh riwayat lengkap
    const history = await dataService.getOrders();

    return { history };
};
