import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    // Mengambil data dari layout (settings & queue) agar konsisten
    const { settings, queue } = await parent();
    return { settings, queue };
};
