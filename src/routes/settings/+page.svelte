<script lang="ts">
    import type { AppSettings, ProductType } from "$lib/models";
    import { Plus, X, Save } from "lucide-svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import Modal from "$lib/components/layout/Modal.svelte";
    import SectionHeader from "$lib/components/shared/SectionHeader.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { apiCall } from "$lib/utils";
    import { ui } from "$lib/state/ui.svelte";
    import { SettingsState } from "$lib/state/settings.svelte";

    let { data } = $props();

    const state = new SettingsState({
        settings: data.settings ?? { storeName: "", products: [], options: [] },
    });

    $effect(() => {
        if (data.settings) state.updateData({ settings: data.settings });
    });

    $effect(() => {
        ui.setPage({
            title: "Pengaturan",
            subtitle: "Konfigurasi Toko",
            showBack: true,
        });
    });
</script>

<div class="container-sm pb-36 space-y-5 mt-3 animate-in">
    <!-- Store Name -->
    <section class="space-y-2">
        <SectionHeader title="Nama Toko" />
        <input
            id="storeName"
            type="text"
            bind:value={state.settings!.storeName}
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
                onclick={() => state.addProduct()}
            >
                <Plus size={14} strokeWidth={3} /> Tambah
            </Button>
        </div>

        <div class="space-y-3">
            {#each state.settings?.products || [] as prod, i}
                <Card padding="sm" class="space-y-3">
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
                        onclick={() => state.removeProduct(i)}
                    >
                        <X size={14} strokeWidth={2.5} /> Hapus Menu
                    </Button>
                </Card>
            {/each}
        </div>
    </section>

    <!-- Additional Options -->
    <section class="space-y-3">
        <div class="flex justify-between items-center px-1">
            <SectionHeader title="Opsi Tambahan" />
            <Button
                variant="secondary"
                size="sm"
                onclick={() => state.addOption()}
            >
                <Plus size={14} strokeWidth={3} /> Tambah
            </Button>
        </div>

        <div class="grid grid-cols-1 gap-2">
            {#each state.settings?.options || [] as opt, i}
                <div
                    class="flex gap-2 items-center bg-white p-2.5 rounded-xl border border-slate-200"
                >
                    <div class="grow">
                        <label for="opt-{i}" class="sr-only">Nama Opsi</label>
                        <input
                            id="opt-{i}"
                            type="text"
                            placeholder="Nama Opsi..."
                            bind:value={state.settings!.options[i]}
                            class="w-full h-10 bg-slate-50 rounded-lg px-3 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                    <Button
                        variant="danger"
                        size="sm"
                        class="w-10 h-10 p-0 flex-none rounded-lg"
                        onclick={() => state.removeOption(i)}
                    >
                        <X size={16} strokeWidth={2.5} />
                    </Button>
                </div>
            {/each}
        </div>
    </section>
</div>

<!-- Floating Save Button -->
<div class="fixed bottom-20 left-0 right-0 px-4 z-40 pointer-events-none">
    <div class="max-w-md mx-auto pointer-events-auto">
        <Button
            variant="emerald"
            size="lg"
            class="w-full shadow-2xl uppercase tracking-widest"
            onclick={() => state.saveSettings()}
        >
            <Save size={18} strokeWidth={3} />
            Simpan Konfigurasi
        </Button>
    </div>
</div>

<Modal
    bind:show={state.showModal}
    title={state.modalTitle}
    message={state.modalMessage}
    type={state.modalType}
    confirmText={state.modalType === "info" ? "Tutup" : "Ya, Simpan"}
    onConfirm={() => state.confirmSave()}
/>
