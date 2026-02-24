<script lang="ts">
    import { onMount } from "svelte";
    import { Download, RefreshCw } from "lucide-svelte";

    let showInstallPrompt = $state(false);
    let installPromptEvent = $state<any>(null);

    let needRefresh = $state(false);
    let offlineReady = $state(false);
    let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined =
        $state(undefined);

    onMount(async () => {
        // 1. PWA Install Prompt (Add to Home Screen)
        window.addEventListener("beforeinstallprompt", (e) => {
            // Cegah prompt default dari browser
            e.preventDefault();
            // Simpan event sehingga bisa digunakan nanti
            installPromptEvent = e;
            // Tampilkan prompt custom kita
            showInstallPrompt = true;
        });

        window.addEventListener("appinstalled", () => {
            showInstallPrompt = false;
            installPromptEvent = null;
            console.log("PWA sudah terinstall");
        });

        // 2. PWA Update / Refresh mekanisme
        if ("serviceWorker" in navigator) {
            try {
                const { registerSW } = await import("virtual:pwa-register");
                updateSW = registerSW({
                    immediate: true,
                    onNeedRefresh() {
                        needRefresh = true;
                    },
                    onOfflineReady() {
                        offlineReady = true;
                    },
                    onRegistered(r: any) {
                        console.log("PWA SW Registered:", r);
                    },
                    onRegisterError(error: any) {
                        console.error("PWA SW registration error:", error);
                    },
                });
            } catch (err) {
                console.error("Gagal import virtual:pwa-register", err);
            }
        }
    });

    async function installApp() {
        if (installPromptEvent) {
            installPromptEvent.prompt();
            const { outcome } = await installPromptEvent.userChoice;
            if (outcome === "accepted") {
                console.log("User menerima install prompt");
            } else {
                console.log("User menolak install prompt");
            }
            installPromptEvent = null;
            showInstallPrompt = false;
        }
    }

    function closeInstallPrompt() {
        showInstallPrompt = false;
    }

    function closeRefreshPrompt() {
        needRefresh = false;
    }
</script>

{#if showInstallPrompt}
    <div
        class="fixed bottom-24 left-4 right-4 max-w-sm mx-auto bg-white p-4 rounded-xl shadow-lg shadow-slate-200/50 border-2 border-slate-200 z-50 flex items-center justify-between animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
        <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0"
            >
                <Download size={20} strokeWidth={2.5} />
            </div>
            <div>
                <h3
                    class="font-bold text-slate-900 text-sm tracking-tight leading-tight mb-0.5"
                >
                    Install Aplikasi
                </h3>
                <p class="text-xs font-medium text-slate-500 line-clamp-1">
                    Akses lebih kencang via homescreen
                </p>
            </div>
        </div>
        <div class="flex gap-2 shrink-0">
            <button
                onclick={closeInstallPrompt}
                class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all active:scale-95 border border-transparent"
                >Batal</button
            >
            <button
                onclick={installApp}
                class="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md shadow-emerald-600/20 border border-emerald-500 transition-all active:scale-95"
                >Install</button
            >
        </div>
    </div>
{/if}

{#if needRefresh}
    <div
        class="fixed bottom-24 left-4 right-4 max-w-sm mx-auto bg-white p-4 rounded-xl shadow-lg shadow-slate-200/50 border-2 border-slate-200 z-50 flex items-center justify-between animate-in slide-in-from-bottom-5 fade-in duration-300"
    >
        <div class="flex items-center gap-3">
            <div
                class="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-900 border border-slate-200 shrink-0"
            >
                <RefreshCw size={20} strokeWidth={2.5} />
            </div>
            <div>
                <h3
                    class="font-bold text-slate-900 text-sm tracking-tight leading-tight mb-0.5"
                >
                    Update Aplikasi
                </h3>
                <p class="text-xs font-medium text-slate-500 line-clamp-1">
                    Versi terbaru sudah tersedia
                </p>
            </div>
        </div>
        <div class="flex gap-2 shrink-0">
            <button
                onclick={closeRefreshPrompt}
                class="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-bold transition-all active:scale-95 border border-transparent"
                >Nanti</button
            >
            <button
                onclick={() => updateSW?.(true)}
                class="px-3 py-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-md transition-all active:scale-95 border border-slate-800"
                >Refresh</button
            >
        </div>
    </div>
{/if}
