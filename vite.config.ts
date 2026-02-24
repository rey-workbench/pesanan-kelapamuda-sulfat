import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        SvelteKitPWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            manifest: {
                name: 'Pesan Degan',
                short_name: 'Degan',
                description: 'Aplikasi Pemesanan Kelapa Muda Sulfat',
                theme_color: '#10b981',
                background_color: '#f8fafc',
                display: 'standalone',
                icons: [
                    {
                        src: 'icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'icon-512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable'
                    }
                ]
            }
        })
    ]
});
