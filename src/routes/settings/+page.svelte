<script lang="ts">
    import type { AppSettings, ProductType } from "$lib/models";
    import { X, Save, Plus } from "lucide-svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import Modal from "$lib/components/Modal.svelte";
    import { apiCall } from "$lib/utils";
    import { ui } from "$lib/ui.svelte";

    let { data } = $props();

    let editedStoreName = $state("");
    let editedProducts = $state<ProductType[]>([]);
    let editedOptions = $state<string[]>([]);

    let modal = $state({
        show: false,
        title: "",
        message: "",
        type: "confirm" as "confirm" | "info" | "danger",
        onConfirm: () => {},
    });

    function showModal(
        title: string,
        message: string,
        type: "confirm" | "info" | "danger" = "confirm",
        onConfirm: () => void = () => {},
    ) {
        modal = { show: true, title, message, type, onConfirm };
    }

    let isInitialized = false;
    $effect(() => {
        // Initialize once when data is ready
        if (data.settings && !isInitialized) {
            const s = data.settings;
            editedStoreName = s.storeName;
            editedProducts = s.products.map((p: any) => ({ ...p }));
            editedOptions = [...(s.options || [])];
            isInitialized = true;
        }
    });

    $effect(() => {
        // Sync Header (Always run, but doesn't depend on edited local state)
        ui.setPage({
            title: "Pengaturan",
            subtitle: "Konfigurasi Toko",
            showBack: true,
        });
    });

    function triggerSave() {
        if (!editedStoreName.trim()) {
            showModal("Info", "Nama toko tidak boleh kosong.", "info");
            return;
        }
        showModal(
            "Simpan Pengaturan?",
            "Apakah Anda yakin ingin menyimpan konfigurasi toko terbaru?",
            "confirm",
            saveSettings,
        );
    }

    async function saveSettings() {
        const newSettings: AppSettings = {
            storeName: editedStoreName,
            products: editedProducts.filter((p) => p.name.trim() !== ""),
            options: editedOptions.filter((o) => o.trim() !== ""),
        };

        // Show global loading modal
        ui.showLoading("Menyimpan", "Sedang menyimpan konfigurasi terbaru...");

        try {
            await apiCall("saveSettings", newSettings);
            await invalidateAll();

            // Sedikit delay agar transisi tidak terlalu kaget
            setTimeout(() => {
                ui.hideLoading();
                showModal(
                    "Berhasil",
                    "Pengaturan berhasil disimpan!",
                    "info",
                    () => goto("/"),
                );
            }, 500);
        } catch (error) {
            ui.hideLoading();
            console.error("Gagal menyimpan pengaturan:", error);
            showModal(
                "Terjadi Kesalahan",
                "Gagal menyimpan pengaturan. Pastikan data form valid.",
                "info",
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
                                    inputmode="numeric"
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
                    <div class="grow">
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
    <button onclick={triggerSave} class="btn-primary">
        <Save size={20} strokeWidth={2.5} class="mr-2" />
        Simpan Konfigurasi
    </button>
</div>

<Modal
    bind:show={modal.show}
    title={modal.title}
    message={modal.message}
    type={modal.type}
    confirmText={modal.type === "info" ? "Tutup" : "Ya"}
    cancelText="Batal"
    onConfirm={modal.onConfirm}
/>

<style>
    :global(body) {
        background-color: #f1f5f9;
        color: #0f172a;
    }
</style>
