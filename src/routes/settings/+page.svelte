<script lang="ts">
    import { onMount } from "svelte";
    import { dbService } from "$lib/db";
    import Header from "$lib/components/Header.svelte";
    import type { AppSettings, ProductType } from "$lib/models";
    import { X, Save, Plus } from "lucide-svelte";
    import { goto } from "$app/navigation";

    let editedStoreName = $state("");
    let editedProducts = $state<ProductType[]>([]);
    let editedOptions = $state<string[]>([]);

    onMount(async () => {
        const s = await dbService.getSettings();
        editedStoreName = s.storeName;
        editedProducts = s.products.map((p) => ({ ...p }));
        editedOptions = [...(s.options || [])];
    });

    async function saveSettings() {
        // Prevent empty names
        if (!editedStoreName.trim()) {
            alert("Nama toko tidak boleh kosong.");
            return;
        }

        const newSettings: AppSettings = {
            storeName: editedStoreName,
            products: editedProducts.filter((p) => p.name.trim() !== ""),
            options: editedOptions.filter((o) => o.trim() !== ""),
        };

        try {
            // Check if settings are valid before saving to avoid DataCloneError
            JSON.stringify(newSettings);
            await dbService.saveSettings(newSettings);
            alert("Pengaturan berhasil disimpan!");
            goto("/");
        } catch (error) {
            console.error("Gagal menyimpan pengaturan:", error);
            alert(
                "Terjadi kesalahan saat menyimpan pengaturan. Pastikan data yang dimasukkan valid.",
            );
        }
    }

    function addProductField() {
        editedProducts = [...editedProducts, { name: "", price: 0 }];
    }

    function removeProductField(index: number) {
        editedProducts = editedProducts.filter((_, i) => i !== index);
    }

    function addOptionField() {
        editedOptions = [...editedOptions, ""];
    }

    function removeOptionField(index: number) {
        editedOptions = editedOptions.filter((_, i) => i !== index);
    }
</script>

<Header title="Pengaturan" subtitle="Konfigurasi Toko" showBack={true} />

<div class="px-5 pb-32 space-y-8 mt-4 max-w-md mx-auto">
    <!-- Store Name -->
    <section class="space-y-3">
        <label
            for="storeName"
            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1"
            >Nama Toko</label
        >
        <div class="relative">
            <input
                id="storeName"
                type="text"
                bind:value={editedStoreName}
                placeholder="Nama Toko..."
                class="input-pos"
            />
        </div>
    </section>

    <!-- Products & Pricing -->
    <section class="space-y-4">
        <div class="flex justify-between items-center px-1">
            <h2
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
                Menu & Harga
            </h2>
            <button
                onclick={addProductField}
                class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg active:scale-95 transition-colors border border-emerald-200 shadow-sm"
            >
                <Plus size={14} strokeWidth={3} />
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Tambah</span
                >
            </button>
        </div>

        <div class="space-y-4">
            {#each editedProducts as prod, i}
                <div
                    class="simple-card flex flex-col gap-4 relative animate-in zoom-in-95 duration-200"
                >
                    <div class="grid grid-cols-1 gap-4">
                        <div class="space-y-2">
                            <label
                                for="prod-name-{i}"
                                class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1"
                                >Nama Menu</label
                            >
                            <input
                                id="prod-name-{i}"
                                type="text"
                                placeholder="Contoh: Degan Ijo"
                                bind:value={prod.name}
                                class="w-full h-12 bg-slate-50 rounded-xl px-4 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 transition-colors"
                            />
                        </div>
                        <div class="space-y-2">
                            <label
                                for="prod-price-{i}"
                                class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1"
                                >Harga (IDR)</label
                            >
                            <div class="relative">
                                <span
                                    class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold text-sm"
                                    >Rp</span
                                >
                                <input
                                    id="prod-price-{i}"
                                    type="number"
                                    placeholder="0"
                                    bind:value={prod.price}
                                    class="w-full h-12 pl-10 pr-4 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 transition-colors font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onclick={() => removeProductField(i)}
                        class="h-10 w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-widest active:scale-[0.98] transition-colors border border-red-100"
                    >
                        <X size={14} strokeWidth={2.5} /> Hapus Menu
                    </button>
                </div>
            {/each}
        </div>
    </section>

    <!-- Additional Options -->
    <section class="space-y-4">
        <div class="flex justify-between items-center px-1">
            <h2
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
                Opsi Tambahan
            </h2>
            <button
                onclick={addOptionField}
                class="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg active:scale-95 transition-colors border border-slate-200 shadow-sm"
            >
                <Plus size={14} strokeWidth={3} />
                <span class="text-[10px] font-bold uppercase tracking-widest"
                    >Tambah</span
                >
            </button>
        </div>

        <div class="grid grid-cols-1 gap-3">
            {#each editedOptions as opt, i}
                <div
                    class="flex gap-2 items-center bg-white p-3 rounded-xl shadow-sm border border-slate-200 animate-in slide-in-from-right-4 duration-200"
                >
                    <div class="flex-grow">
                        <label for="opt-{i}" class="sr-only">Nama Opsi</label>
                        <input
                            id="opt-{i}"
                            type="text"
                            placeholder="Nama Opsi..."
                            bind:value={editedOptions[i]}
                            class="w-full h-10 bg-slate-50 rounded-lg px-3 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 transition-colors"
                        />
                    </div>
                    <button
                        onclick={() => removeOptionField(i)}
                        class="h-10 w-10 flex-none flex items-center justify-center bg-red-50 text-red-600 rounded-lg active:scale-95 transition-colors border border-red-100"
                    >
                        <X size={16} strokeWidth={2.5} />
                    </button>
                </div>
            {/each}
        </div>
    </section>

    <!-- Save Button -->
    <button onclick={saveSettings} class="btn-primary">
        <Save size={20} strokeWidth={2.5} class="mr-2" />
        Simpan Konfigurasi
    </button>
</div>

<style>
    :global(body) {
        background-color: #f1f5f9;
        color: #0f172a;
    }
</style>
