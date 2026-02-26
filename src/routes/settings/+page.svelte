<script lang="ts">
    import { Plus, X, Save, Volume2 } from "lucide-svelte";
    import Modal from "$lib/components/layout/Modal.svelte";
    import SectionHeader from "$lib/components/shared/SectionHeader.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { ui } from "$lib/state/ui.svelte";
    import { SettingsState } from "$lib/state/settings.svelte";

    let { data } = $props();

    const cfg = new SettingsState({
        settings: data.settings ?? { storeName: "", products: [], options: [] },
    });

    $effect(() => {
        if (data.settings) cfg.updateData({ settings: data.settings });
    });

    $effect(() => {
        ui.setPage({
            title: "Pengaturan",
            subtitle: "Konfigurasi Toko",
            showBack: true,
        });
    });

    const COLLAPSE_LIMIT = 3;

    let showAllProducts = $state(false);
    let showAllOptions = $state(false);

    const visibleProducts = $derived(
        showAllProducts
            ? cfg.settings?.products || []
            : (cfg.settings?.products || []).slice(0, COLLAPSE_LIMIT),
    );
    const visibleOptions = $derived(
        showAllOptions
            ? cfg.settings?.options || []
            : (cfg.settings?.options || []).slice(0, COLLAPSE_LIMIT),
    );
    const hiddenProductCount = $derived(
        Math.max(0, (cfg.settings?.products?.length || 0) - COLLAPSE_LIMIT),
    );
    const hiddenOptionCount = $derived(
        Math.max(0, (cfg.settings?.options?.length || 0) - COLLAPSE_LIMIT),
    );

    const availableSounds = [
        { name: "Standard (Masuk)", path: "notification/masuk.mp3" },
        { name: "Varian (Masuk 2)", path: "notification/masuk2.mp3" },
    ];

    function previewSound() {
        if (!cfg.settings?.notificationSound) return;
        const audio = new Audio(`/${cfg.settings.notificationSound}`);
        audio.play().catch(console.error);
    }
</script>

<div class="container-sm pb-36 space-y-5 mt-3 animate-in">
    <!-- Store Name -->
    <section class="space-y-2">
        <SectionHeader title="Nama Toko" />
        <input
            id="storeName"
            type="text"
            bind:value={cfg.settings!.storeName}
            placeholder="Nama Toko..."
            class="input-pos w-full"
        />
    </section>

    <!-- Products & Pricing -->
    <section class="space-y-3">
        <div class="flex justify-between items-center px-1">
            <SectionHeader title="Menu & Harga" />
            <Button
                variant="emerald"
                size="sm"
                onclick={() => cfg.addProduct()}
            >
                <Plus size={14} strokeWidth={3} /> Tambah
            </Button>
        </div>

        <div class="space-y-3">
            {#each visibleProducts as prod, i}
                <Card
                    padding="sm"
                    class="space-y-3 animate-in zoom-in-95 duration-150"
                >
                    <div class="grid grid-cols-2 gap-3">
                        <div class="space-y-1.5">
                            <label
                                for="prod-name-{i}"
                                class="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1"
                                >Nama Menu</label
                            >
                            <input
                                id="prod-name-{i}"
                                type="text"
                                placeholder="Degan Ijo"
                                bind:value={prod.name}
                                class="w-full h-11 bg-slate-50 rounded-xl px-3 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div class="space-y-1.5">
                            <label
                                for="prod-price-{i}"
                                class="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1"
                                >Harga (Rp)</label
                            >
                            <div class="relative">
                                <span
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-sm"
                                    >Rp</span
                                >
                                <input
                                    id="prod-price-{i}"
                                    type="number"
                                    inputmode="numeric"
                                    placeholder="0"
                                    bind:value={prod.price}
                                    class="w-full h-11 pl-9 pr-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 transition-colors font-mono"
                                />
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="danger"
                        size="sm"
                        class="w-full"
                        onclick={() =>
                            cfg.removeProduct(
                                cfg.settings!.products.indexOf(prod),
                            )}
                    >
                        <X size={14} strokeWidth={2.5} /> Hapus Menu
                    </Button>
                </Card>
            {/each}

            {#if !showAllProducts && hiddenProductCount > 0}
                <Button
                    variant="ghost"
                    size="sm"
                    class="w-full text-slate-500"
                    onclick={() => (showAllProducts = true)}
                >
                    Tampilkan {hiddenProductCount} menu lainnya ›
                </Button>
            {:else if showAllProducts && hiddenProductCount > 0}
                <Button
                    variant="ghost"
                    size="sm"
                    class="w-full text-slate-400"
                    onclick={() => (showAllProducts = false)}
                >
                    Sembunyikan ‹
                </Button>
            {/if}
        </div>
    </section>

    <!-- Additional Options -->
    <section class="space-y-3">
        <div class="flex justify-between items-center px-1">
            <SectionHeader title="Opsi Tambahan" />
            <Button variant="emerald" size="sm" onclick={() => cfg.addOption()}>
                <Plus size={14} strokeWidth={3} /> Tambah
            </Button>
        </div>

        <div class="grid grid-cols-1 gap-2">
            {#each visibleOptions as opt, i}
                <div
                    class="flex gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200 animate-in zoom-in-95 duration-150"
                >
                    <div class="grow">
                        <label for="opt-{i}" class="sr-only">Nama Opsi</label>
                        <input
                            id="opt-{i}"
                            type="text"
                            placeholder="Nama Opsi..."
                            bind:value={cfg.settings!.options[i]}
                            class="w-full h-10 bg-slate-50 rounded-lg px-3 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                    <Button
                        variant="danger"
                        size="sm"
                        class="w-10 h-10 p-0 flex-none rounded-lg"
                        onclick={() =>
                            cfg.removeOption(
                                cfg.settings!.options.indexOf(opt),
                            )}
                    >
                        <X size={16} strokeWidth={2.5} />
                    </Button>
                </div>
            {/each}

            {#if !showAllOptions && hiddenOptionCount > 0}
                <Button
                    variant="ghost"
                    size="sm"
                    class="w-full text-slate-500"
                    onclick={() => (showAllOptions = true)}
                >
                    Tampilkan {hiddenOptionCount} opsi lainnya ›
                </Button>
            {:else if showAllOptions && hiddenOptionCount > 0}
                <Button
                    variant="ghost"
                    size="sm"
                    class="w-full text-slate-400"
                    onclick={() => (showAllOptions = false)}
                >
                    Sembunyikan ‹
                </Button>
            {/if}
        </div>
    </section>

    <!-- Notification Sound -->
    <section class="space-y-3">
        <SectionHeader title="Notifikasi" />
        <Card padding="sm" class="space-y-4">
            <div class="space-y-1.5">
                <label
                    for="notif-sound"
                    class="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1"
                    >Suara Pesanan Masuk</label
                >
                <div class="flex gap-2">
                    <select
                        id="notif-sound"
                        bind:value={cfg.settings!.notificationSound}
                        class="grow h-11 bg-slate-50 rounded-xl px-3 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 transition-colors"
                    >
                        {#each availableSounds as sound}
                            <option value={sound.path}>{sound.name}</option>
                        {/each}
                    </select>
                    <Button
                        variant="ghost"
                        size="md"
                        class="bg-slate-50 border border-slate-200 rounded-xl w-11 h-11 p-0 flex items-center justify-center text-slate-600 hover:text-emerald-600"
                        onclick={previewSound}
                    >
                        <Volume2 size={20} />
                    </Button>
                </div>
            </div>
        </Card>
    </section>
</div>

<!-- Compact floating save -->
<div class="fixed bottom-20 left-0 right-0 px-8 z-40 pointer-events-none">
    <div class="max-w-sm mx-auto pointer-events-auto">
        <Button
            variant="emerald"
            size="md"
            class="w-full shadow-xl rounded-2xl"
            onclick={() => cfg.saveSettings()}
        >
            <Save size={16} strokeWidth={3} />
            Simpan Konfigurasi
        </Button>
    </div>
</div>

<Modal
    bind:show={cfg.showModal}
    title={cfg.modalTitle}
    message={cfg.modalMessage}
    type={cfg.modalType}
    confirmText={cfg.modalType === "info" ? "Tutup" : "Ya, Simpan"}
    onConfirm={() => cfg.confirmSave()}
/>
