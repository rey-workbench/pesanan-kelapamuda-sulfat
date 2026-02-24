<script lang="ts">
    import { onMount } from "svelte";
    import { dbService } from "$lib/db";
    import type {
        Order,
        AppSettings,
        ProductType,
        OrderItem,
        OrderOption,
    } from "$lib/models";
    import { User, ChevronRight, X, Plus } from "lucide-svelte";
    import Header from "$lib/components/Header.svelte";
    import { goto } from "$app/navigation";

    let settings = $state<AppSettings | null>(null);
    let queue = $state<Order[]>([]);

    // Current Item State
    let selectedProduct = $state<ProductType | null>(null);
    let quantity = $state(1);
    let selectedOption = $state<OrderOption>("Polos");

    // Order/Cart State
    let customerName = $state("");
    let cart = $state<OrderItem[]>([]);
    let cash = $state<number | null>(null);
    let isSubmitting = $state(false);

    let total = $derived(
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );
    let change = $derived(cash !== null ? Math.max(0, cash - total) : 0);

    onMount(async () => {
        const s = await dbService.getSettings();
        settings = s;
        if (s.products.length > 0) selectedProduct = s.products[0];
        if (s.options && s.options.length > 0) selectedOption = s.options[0];
        queue = await dbService.getTodayQueue();
    });

    function handleAddToCart() {
        if (!selectedProduct) return;

        cart = [
            ...cart,
            {
                type: selectedProduct.name,
                price: selectedProduct.price,
                quantity,
                option: selectedOption,
            },
        ];

        // Reset current item selections
        quantity = 1;
        if (settings?.options && settings.options.length > 0) {
            selectedOption = settings.options[0];
        } else {
            selectedOption = "Polos";
        }
    }

    function removeFromCart(index: number) {
        cart = cart.filter((_, i) => i !== index);
    }

    async function handleAddOrder() {
        if (!customerName || cart.length === 0 || cash === null) return;

        isSubmitting = true;

        try {
            await dbService.addOrder({
                customerName,
                items: $state.snapshot(cart),
                total,
                cash: cash || 0,
                change,
                date: new Date().toISOString().split("T")[0],
            });

            customerName = "";
            cart = [];
            cash = null;
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

<div class="sticky top-0 z-30">
    <Header
        title={settings?.storeName}
        subtitle="Order Baru"
        pending={queue.filter((q) => q.status === "pending").length}
        completed={queue.filter((q) => q.status === "completed").length}
    />
</div>

<div class="px-5 pt-4 pb-32 space-y-8 max-w-md mx-auto">
    <!-- Customer Input -->
    <section class="space-y-3">
        <label
            for="customerName"
            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1"
            >Informasi Pelanggan</label
        >
        <div class="relative group">
            <User size={20} class="input-pos-icon" strokeWidth={2.5} />
            <input
                id="customerName"
                type="text"
                bind:value={customerName}
                placeholder="Nama Pelanggan..."
                class="input-pos pl-11"
            />
        </div>
    </section>

    <!-- Product Selection -->
    <section class="space-y-3">
        <div class="flex justify-between items-center px-1">
            <h2
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
                Pilih Menu
            </h2>
            {#if settings?.products.length === 0}
                <button
                    onclick={() => goto("/settings")}
                    class="text-[10px] font-bold text-emerald-600 uppercase"
                    >Input Menu &rarr;</button
                >
            {/if}
        </div>
        <div class="grid grid-cols-2 gap-3">
            {#each settings?.products || [] as product}
                <button
                    onclick={() => (selectedProduct = product)}
                    class="h-20 p-4 rounded-2xl flex flex-col items-center justify-center transition-colors border-2 {selectedProduct?.name ===
                    product.name
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'}"
                >
                    <span class="text-sm font-bold leading-tight mb-1"
                        >{product.name}</span
                    >
                    <span
                        class="text-xs font-mono {selectedProduct?.name ===
                        product.name
                            ? 'text-emerald-700'
                            : 'text-slate-500'}"
                        >{formatCurrency(product.price)}</span
                    >
                </button>
            {/each}
        </div>
    </section>

    <!-- Options & Quantity -->
    <div class="grid grid-cols-2 gap-4">
        <section class="space-y-3">
            <h2
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1"
            >
                Pilih Opsi
            </h2>
            <div class="flex flex-col gap-2">
                {#each settings?.options || [] as opt}
                    <button
                        onclick={() => (selectedOption = opt)}
                        class="h-12 text-sm font-bold rounded-xl border-2 transition-colors {selectedOption ===
                        opt
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'}"
                    >
                        {opt}
                    </button>
                {/each}
            </div>
        </section>

        <section class="space-y-3">
            <label
                for="quantityInput"
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1"
                >Jumlah</label
            >
            <div
                class="flex items-center bg-white rounded-xl border border-slate-300 px-4 h-12 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all"
            >
                <span class="text-xs font-bold text-slate-400 mr-2">QTY</span>
                <input
                    id="quantityInput"
                    type="number"
                    bind:value={quantity}
                    min="1"
                    class="w-full bg-transparent border-none p-0 text-center font-bold text-lg text-slate-900 outline-none"
                />
            </div>
        </section>
    </div>

    <button
        onclick={handleAddToCart}
        disabled={!selectedProduct}
        class="btn-secondary flex items-center justify-center gap-2 mt-2 h-14 disabled:opacity-50"
    >
        <Plus size={20} strokeWidth={3} />
        Tambahkan ke Keranjang
    </button>

    <!-- Order Table -->
    <section class="space-y-4 pt-4 border-t border-slate-200">
        <h2
            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1"
        >
            Ringkasan Pesanan
        </h2>
        <div class="simple-card p-0 overflow-hidden">
            {#if cart.length > 0}
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead
                            class="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-200"
                        >
                            <tr>
                                <th class="px-5 py-4">Item</th>
                                <th class="px-3 py-4 text-center">Qty</th>
                                <th class="px-5 py-4 text-right">Total</th>
                                <th class="w-12"></th>
                            </tr>
                        </thead>
                        <tbody class="text-sm divide-y divide-slate-100">
                            {#each cart as item, i}
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-5 py-4">
                                        <div
                                            class="font-bold text-slate-900 text-base"
                                        >
                                            {item.type}
                                        </div>
                                        <div
                                            class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1"
                                        >
                                            {item.option}
                                        </div>
                                    </td>
                                    <td
                                        class="px-3 py-4 text-center font-mono font-bold text-slate-900 text-lg"
                                    >
                                        <span
                                            class="bg-slate-100 px-2.5 py-1 rounded border border-slate-200"
                                            >{item.quantity}</span
                                        >
                                    </td>
                                    <td
                                        class="px-5 py-4 text-right font-mono font-bold text-slate-900 text-base"
                                    >
                                        {formatCurrency(
                                            item.price * item.quantity,
                                        )
                                            .replace("Rp", "")
                                            .trim()}
                                    </td>
                                    <td class="px-2 py-4 text-center">
                                        <button
                                            onclick={() => removeFromCart(i)}
                                            class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <X size={18} strokeWidth={3} />
                                        </button>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            {:else}
                <div
                    class="py-16 flex flex-col items-center justify-center text-slate-400"
                >
                    <div
                        class="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-3"
                    >
                        <Plus size={20} class="opacity-50" />
                    </div>
                    <p
                        class="text-[10px] font-bold uppercase tracking-widest opacity-80"
                    >
                        Keranjang Kosong
                    </p>
                </div>
            {/if}
        </div>
    </section>

    <!-- Payment Section -->
    <section class="simple-card bg-emerald-900 text-white p-6 md:p-8 mt-6">
        <div class="space-y-6">
            <div class="space-y-3">
                <label
                    for="cashInput"
                    class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest px-1"
                    >Uang Tunai</label
                >
                <div class="relative">
                    <span
                        class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl"
                        >Rp</span
                    >
                    <input
                        id="cashInput"
                        type="number"
                        bind:value={cash}
                        placeholder="0"
                        class="w-full h-16 pl-14 pr-5 bg-white rounded-xl border-none font-black text-2xl text-slate-900 outline-none focus:ring-4 focus:ring-emerald-500/30 transition-shadow font-mono"
                    />
                </div>
            </div>

            <div
                class="flex justify-between items-end border-t border-emerald-800 pt-6"
            >
                <div class="flex flex-col">
                    <span
                        class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1"
                        >Kembalian</span
                    >
                    <span class="text-2xl font-bold font-mono tracking-tighter"
                        >{formatCurrency(change)}</span
                    >
                </div>
                <div class="text-right flex flex-col items-end">
                    <span
                        class="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1"
                        >Total</span
                    >
                    <span
                        class="text-4xl font-black font-mono tracking-tighter leading-none text-emerald-400"
                    >
                        {formatCurrency(total)}
                    </span>
                </div>
            </div>

            <button
                onclick={handleAddOrder}
                disabled={isSubmitting ||
                    !customerName ||
                    cart.length === 0 ||
                    !cash ||
                    cash < total}
                class="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-sm shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 uppercase tracking-widest mt-4"
            >
                {isSubmitting ? "Memproses..." : "Simpan Pesanan"}
                {#if !isSubmitting}
                    <ChevronRight size={20} strokeWidth={3} />
                {/if}
            </button>
        </div>
    </section>
</div>
