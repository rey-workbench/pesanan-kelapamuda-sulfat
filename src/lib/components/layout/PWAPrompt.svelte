<script lang="ts">
    import { onMount } from "svelte";
    import { Download, RefreshCw } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let showInstallPrompt = $state(false);
    let installPromptEvent = $state<any>(null);
    let needRefresh = $state(false);
    let offlineReady = $state(false);
    let updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined =
        $state(undefined);

    onMount(async () => {
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            installPromptEvent = e;
            showInstallPrompt = true;
        });

        window.addEventListener("appinstalled", () => {
            showInstallPrompt = false;
            installPromptEvent = null;
        });

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
            installPromptEvent = null;
            showInstallPrompt = false;
        }
    }
</script>

{#if showInstallPrompt}
    <div class="fixed bottom-24 left-0 right-0 px-4 z-50">
        <div
            class="max-w-md mx-auto bg-white p-4 rounded-2xl shadow-premium border border-slate-200 flex items-center justify-between animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0"
                >
                    <Download size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h3
                        class="font-bold text-slate-900 text-sm tracking-tight leading-tight mb-0.5"
                    >
                        Install Aplikasi
                    </h3>
                    <p class="text-xs font-medium text-slate-500">
                        Akses lebih kencang via homescreen
                    </p>
                </div>
            </div>
            <div class="flex gap-2 shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => (showInstallPrompt = false)}
                >
                    Batal
                </Button>
                <Button variant="emerald" size="sm" onclick={installApp}>
                    <Download size={14} strokeWidth={2.5} />
                    Install
                </Button>
            </div>
        </div>
    </div>
{/if}

{#if needRefresh}
    <div class="fixed bottom-24 left-0 right-0 px-4 z-50">
        <div
            class="max-w-md mx-auto bg-white p-4 rounded-2xl shadow-premium border border-slate-200 flex items-center justify-between animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
            <div class="flex items-center gap-3">
                <div
                    class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-900 border border-slate-200 shrink-0"
                >
                    <RefreshCw size={20} strokeWidth={2.5} />
                </div>
                <div>
                    <h3
                        class="font-bold text-slate-900 text-sm tracking-tight leading-tight mb-0.5"
                    >
                        Update Tersedia
                    </h3>
                    <p class="text-xs font-medium text-slate-500">
                        Versi terbaru sudah tersedia
                    </p>
                </div>
            </div>
            <div class="flex gap-2 shrink-0">
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => (needRefresh = false)}
                >
                    Nanti
                </Button>
                <Button
                    variant="slate"
                    size="sm"
                    onclick={() => updateSW?.(true)}
                >
                    <RefreshCw size={14} strokeWidth={2.5} />
                    Refresh
                </Button>
            </div>
        </div>
    </div>
{/if}
