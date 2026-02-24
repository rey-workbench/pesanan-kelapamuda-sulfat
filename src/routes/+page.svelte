<script lang="ts">
    import { onMount } from "svelte";
    import { dbService } from "$lib/db";
    import type { Order, AppSettings, ProductType } from "$lib/models";
    import { User, ChevronRight } from "lucide-svelte";
    import Header from "$lib/components/Header.svelte";
    import StatsBubble from "$lib/components/StatsBubble.svelte";
    import { goto } from "$app/navigation";

    let settings = $state<AppSettings | null>(null);
    let queue = $state<Order[]>([]);

    // New Order State
    let customerName = $state("");
    let selectedProduct = $state<ProductType | null>(null);
    let quantity = $state(1);
    let notes = $state("");
    let isSubmitting = $state(false);

    onMount(async () => {
        const s = await dbService.getSettings();
        settings = s;
        if (s.products.length > 0) selectedProduct = s.products[0];
        queue = await dbService.getTodayQueue();
    });

    async function handleAddOrder() {
        if (!customerName || !selectedProduct || !settings) return;
        isSubmitting = true;

        try {
            await dbService.addOrder({
                customerName,
                quantity,
                type: selectedProduct.name,
                price: selectedProduct.price,
                total: selectedProduct.price * quantity,
                notes,
                date: new Date().toISOString().split("T")[0],
            });

            customerName = "";
            notes = "";
            quantity = 1;
            goto("/queue");
        } finally {
            isSubmitting = false;
        }
    }

    function formatCurrency(val: number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(val);
    }
</script>

<Header title={settings?.storeName} subtitle="Pesanan Baru" />
<StatsBubble
    pending={queue.filter((q) => q.status === "pending").length}
    completed={queue.filter((q) => q.status === "completed").length}
/>

<div class="px-4 pb-24 space-y-6 animate-in">
    <section class="space-y-3">
        <label
            for="customerName"
            class="text-xs font-bold text-emerald-900/40 uppercase px-2"
            >Nama Pelanggan</label
        >
        <div class="relative">
            <User
                class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600"
                size={20}
            />
            <input
                id="customerName"
                type="text"
                bind:value={customerName}
                placeholder="Masukkan nama..."
                class="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
        </div>
    </section>

    <section class="space-y-3">
        <label class="text-xs font-bold text-emerald-900/40 uppercase px-2"
            >Pilih Produk</label
        >
        <div class="grid grid-cols-2 gap-3">
            {#each settings?.products || [] as product}
                <button
                    onclick={() => (selectedProduct = product)}
                    class="p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 {selectedProduct?.name ===
                    product.name
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                        : 'bg-white text-emerald-900 border-transparent shadow-sm'}"
                >
                    <span class="font-bold">{product.name}</span>
                    <span class="text-[10px] opacity-70 font-black"
                        >{formatCurrency(product.price)}</span
                    >
                </button>
            {/each}
        </div>
    </section>

    <div class="flex gap-4">
        <section class="w-1/3 space-y-3">
            <label
                for="quantity"
                class="text-xs font-bold text-emerald-900/40 uppercase px-2"
                >Jumlah</label
            >
            <input
                id="quantity"
                type="number"
                bind:value={quantity}
                min="1"
                class="w-full h-14 text-center bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-emerald-500 font-black text-xl"
            />
        </section>
        <section class="flex-grow space-y-3">
            <label
                for="notes"
                class="text-xs font-bold text-emerald-900/40 uppercase px-2"
                >Catatan</label
            >
            <input
                id="notes"
                type="text"
                bind:value={notes}
                placeholder="Es dikit, dll..."
                class="w-full h-14 px-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
        </section>
    </div>

    <button
        onclick={handleAddOrder}
        disabled={isSubmitting || !customerName || !selectedProduct}
        class="w-full h-16 bg-emerald-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-3"
    >
        {isSubmitting ? "Memproses..." : "Simpan Pesanan"}
        <ChevronRight size={24} />
    </button>
</div>
