import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
    plugins: [
        tailwindcss(),
        sveltekit(),
        SvelteKitPWA({
            registerType: 'prompt',
            injectRegister: 'auto',
            manifest: {
                name: 'Es Kelapa Muda Sulfat',
                short_name: 'Sulfat',
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
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,mp4}'],
                navigateFallback: null,
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            },
            devOptions: {
                enabled: false,
                suppressWarnings: true,
                type: 'module',
            }
        })
    ]
});
