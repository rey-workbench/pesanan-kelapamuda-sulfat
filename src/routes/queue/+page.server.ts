import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    // Mengambil data queue hari ini dari layout
    const { settings, queue } = await parent();
    return { settings, queue };
};
