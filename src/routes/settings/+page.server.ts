import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
    // Settings sudah diambil di layout utama
    const { settings } = await parent();
    return { settings };
};
