<script lang="ts">
    import { onMount } from "svelte";
    import { dbService } from "$lib/db";
    import type { AppSettings, ProductType } from "$lib/models";
    import { X, ChevronLeft, Save, Plus } from "lucide-svelte";
    import { goto } from "$app/navigation";

    let editedStoreName = $state("");
    let editedProducts = $state<ProductType[]>([]);

    onMount(async () => {
        const s = await dbService.getSettings();
        editedStoreName = s.storeName;
        editedProducts = s.products.map((p) => ({ ...p }));
    });

    async function saveSettings() {
        const newSettings: AppSettings = {
            storeName: editedStoreName,
            products: editedProducts,
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
</script>

<div
    class="bg-emerald-700 text-white p-4 pb-12 rounded-b-[40px] shadow-lg mb-8"
>
    <div class="flex items-center gap-4">
        <button
            onclick={() => goto("/")}
            class="p-2 bg-emerald-600/50 rounded-full"
        >
            <ChevronLeft size={20} />
        </button>
        <h1 class="text-xl font-black lowercase tracking-tight">
            Pengaturan Toko
        </h1>
    </div>
</div>

<div class="px-4 pb-24 space-y-6 animate-in">
    <section class="space-y-2">
        <label
            for="storeName"
            class="text-xs font-bold text-emerald-900/40 uppercase px-2"
            >Nama Toko</label
        >
        <input
            id="storeName"
            type="text"
            bind:value={editedStoreName}
            class="w-full h-14 bg-white rounded-2xl px-4 border-none font-bold outline-none ring-inset focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
    </section>

    <section class="space-y-4">
        <div class="flex justify-between items-center px-2">
            <label class="text-xs font-bold text-emerald-900/40 uppercase"
                >Produk & Harga</label
            >
            <button
                onclick={addProductField}
                class="text-xs font-bold text-emerald-600 flex items-center gap-1"
            >
                <Plus size={14} /> Tambah
            </button>
        </div>

        <div class="space-y-3">
            {#each editedProducts as prod, i}
                <div
                    class="flex gap-2 items-end bg-white p-3 rounded-2xl shadow-sm border border-emerald-50"
                >
                    <div class="flex-grow space-y-1">
                        <label
                            class="text-[10px] text-emerald-300 font-bold uppercase"
                            >Nama Produk</label
                        >
                        <input
                            type="text"
                            placeholder="Nama"
                            bind:value={prod.name}
                            class="w-full h-10 bg-emerald-50/50 rounded-xl px-3 border-none text-sm font-bold outline-none"
                        />
                    </div>
                    <div class="w-24 space-y-1">
                        <label
                            class="text-[10px] text-emerald-300 font-bold uppercase"
                            >Harga</label
                        >
                        <input
                            type="number"
                            placeholder="Harga"
                            bind:value={prod.price}
                            class="w-full h-10 bg-emerald-50/50 rounded-xl px-3 border-none text-sm font-bold outline-none"
                        />
                    </div>
                    <button
                        onclick={() => removeProductField(i)}
                        class="h-10 w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl mb-0.5"
                    >
                        <X size={18} />
                    </button>
                </div>
            {/each}
        </div>
    </section>

    <button
        onclick={saveSettings}
        class="w-full h-16 bg-emerald-900 text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
    >
        <Save size={20} /> Simpan Pengaturan
    </button>
</div>
