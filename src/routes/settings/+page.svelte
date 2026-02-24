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
        const newSettings: AppSettings = {
            storeName: editedStoreName,
            products: editedProducts,
            options: editedOptions,
        };
        await dbService.saveSettings(newSettings);
        alert("Pengaturan berhasil disimpan!");
        goto("/");
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

<div class="px-5 pb-32 space-y-10 animate-in mt-6 max-w-md mx-auto">
    <!-- Store Name -->
    <section class="space-y-4">
        <label
            for="storeName"
            class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1"
            >Nama Toko</label
        >
        <div class="relative">
            <input
                id="storeName"
                type="text"
                bind:value={editedStoreName}
                placeholder="Nama Toko..."
                class="w-full h-14 bg-white rounded-2xl px-5 border-2 border-slate-200 font-bold text-lg text-slate-950 shadow-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
            />
        </div>
    </section>

    <!-- Products & Pricing -->
    <section class="space-y-4">
        <div class="flex justify-between items-center px-1">
            <h2
                class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
            >
                Menu & Harga
            </h2>
            <button
                onclick={addProductField}
                class="flex items-center gap-2 px-4 py-2 bg-slate-950 text-white rounded-xl active:scale-95 transition-all shadow-md"
            >
                <Plus size={14} strokeWidth={4} />
                <span class="text-[10px] font-black uppercase tracking-widest"
                    >Tambah</span
                >
            </button>
        </div>

        <div class="space-y-6">
            {#each editedProducts as prod, i}
                <div
                    class="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200 border-2 border-slate-200 flex flex-col gap-5 relative animate-in zoom-in-95 duration-200"
                >
                    <div class="grid grid-cols-1 gap-5">
                        <div class="space-y-2">
                            <label
                                for="prod-name-{i}"
                                class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1"
                                >Nama Menu</label
                            >
                            <input
                                id="prod-name-{i}"
                                type="text"
                                placeholder="Contoh: Degan Ijo"
                                bind:value={prod.name}
                                class="w-full h-14 bg-slate-50 rounded-2xl px-5 border-2 border-slate-100 text-base font-black text-slate-950 outline-none focus:bg-white focus:border-emerald-600 transition-all shadow-inner"
                            />
                        </div>
                        <div class="space-y-2">
                            <label
                                for="prod-price-{i}"
                                class="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1"
                                >Harga (IDR)</label
                            >
                            <div class="relative">
                                <span
                                    class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900 font-black text-lg"
                                    >Rp</span
                                >
                                <input
                                    id="prod-price-{i}"
                                    type="number"
                                    placeholder="0"
                                    bind:value={prod.price}
                                    class="w-full h-14 pl-12 pr-5 bg-slate-50 rounded-2xl border-2 border-slate-100 text-lg font-black text-slate-950 outline-none focus:bg-white focus:border-emerald-600 transition-all font-mono shadow-inner"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onclick={() => removeProductField(i)}
                        class="h-12 w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-[0.98] transition-all border-2 border-red-100"
                    >
                        <X size={16} strokeWidth={3} /> Hapus Menu
                    </button>
                </div>
            {/each}
        </div>
    </section>

    <!-- Additional Options -->
    <section class="space-y-4">
        <div class="flex justify-between items-center px-1">
            <h2
                class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
            >
                Opsi Tambahan
            </h2>
            <button
                onclick={addOptionField}
                class="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-900 rounded-xl active:scale-95 transition-all border-2 border-slate-200"
            >
                <Plus size={14} strokeWidth={4} />
                <span class="text-[10px] font-black uppercase tracking-widest"
                    >Tambah</span
                >
            </button>
        </div>

        <div class="grid grid-cols-1 gap-4">
            {#each editedOptions as opt, i}
                <div
                    class="flex gap-3 items-center bg-white p-4 rounded-[1.5rem] shadow-md border-2 border-slate-200 animate-in slide-in-from-right-4 duration-200"
                >
                    <div class="flex-grow space-y-1">
                        <label for="opt-{i}" class="sr-only">Nama Opsi</label>
                        <input
                            id="opt-{i}"
                            type="text"
                            placeholder="Nama Opsi..."
                            bind:value={editedOptions[i]}
                            class="w-full h-12 bg-slate-50 rounded-xl px-4 border-2 border-slate-100 text-sm font-black text-slate-950 outline-none focus:bg-white focus:border-emerald-600 transition-all"
                        />
                    </div>
                    <button
                        onclick={() => removeOptionField(i)}
                        class="h-12 w-12 flex-none flex items-center justify-center bg-red-50 text-red-600 rounded-xl active:scale-90 transition-all border-2 border-red-100"
                    >
                        <X size={20} strokeWidth={4} />
                    </button>
                </div>
            {/each}
        </div>
    </section>

    <!-- Save Button -->
    <button
        onclick={saveSettings}
        class="w-full h-20 bg-emerald-600 text-white rounded-[2rem] font-black shadow-2xl shadow-emerald-200 flex items-center justify-center gap-4 active:scale-[0.96] transition-all uppercase tracking-[0.2em] text-sm border-b-4 border-emerald-800"
    >
        <Save size={24} strokeWidth={3} />
        Simpan Konfigurasi
    </button>
</div>

<style>
    :global(body) {
        background-color: #f8fafc;
    }
</style>
