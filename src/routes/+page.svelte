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

<div class="min-h-screen bg-slate-50 font-sans pb-32">
    <div class="sticky top-0 z-30">
        <Header
            title={settings?.storeName}
            subtitle="Order"
            pending={queue.filter((q) => q.status === "pending").length}
            completed={queue.filter((q) => q.status === "completed").length}
        />
    </div>

    <div class="p-5 space-y-10 max-w-md mx-auto">
        <!-- Customer Input -->
        <section class="space-y-4">
            <label
                for="customerName"
                class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1"
                >Informasi Pelanggan</label
            >
            <div class="relative">
                <div
                    class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"
                >
                    <User size={20} class="text-slate-400" strokeWidth={3} />
                </div>
                <input
                    id="customerName"
                    type="text"
                    bind:value={customerName}
                    placeholder="Nama Pelanggan..."
                    class="w-full h-14 pl-14 pr-5 bg-white rounded-2xl border-2 border-slate-200 font-black text-lg text-slate-950 shadow-sm focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10 transition-all outline-none"
                />
            </div>
        </section>

        <!-- Product Selection -->
        <section class="space-y-4">
            <div class="flex justify-between items-center px-1">
                <h2
                    class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
                >
                    Pilih Menu
                </h2>
                {#if settings?.products.length === 0}
                    <button
                        onclick={() => goto("/settings")}
                        class="text-[10px] font-black text-slate-950 uppercase italic"
                        >Input Menu &rarr;</button
                    >
                {/if}
            </div>
            <div class="grid grid-cols-2 gap-4">
                {#each settings?.products || [] as product}
                    <button
                        onclick={() => (selectedProduct = product)}
                        class="relative h-20 p-4 rounded-[2rem] flex flex-col items-center justify-center transition-all border-2 {selectedProduct?.name ===
                        product.name
                            ? 'bg-slate-950 border-slate-950 text-white shadow-xl scale-[0.98]'
                            : 'bg-white border-slate-200 text-slate-900 hover:border-slate-950 shadow-sm'}"
                    >
                        <span
                            class="text-xs font-black uppercase tracking-tight text-center leading-tight mb-1"
                            >{product.name}</span
                        >
                        <span
                            class="text-[11px] font-black {selectedProduct?.name ===
                            product.name
                                ? 'text-slate-300'
                                : 'text-slate-500'} font-mono"
                            >{formatCurrency(product.price)}</span
                        >
                        {#if selectedProduct?.name === product.name}
                            <div
                                class="absolute -top-2 -right-2 w-7 h-7 bg-white text-slate-950 rounded-full flex items-center justify-center shadow-xl border-2 border-slate-950 animate-in zoom-in"
                            >
                                <Plus size={14} strokeWidth={4} />
                            </div>
                        {/if}
                    </button>
                {/each}
            </div>
        </section>

        <!-- Options & Quantity -->
        <div class="grid grid-cols-2 gap-5">
            <section class="space-y-4">
                <h2
                    class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1"
                >
                    Pilih Opsi
                </h2>
                <div class="flex flex-col gap-3">
                    {#each settings?.options || [] as opt}
                        <button
                            onclick={() => (selectedOption = opt)}
                            class="h-12 text-[11px] font-black rounded-2xl border-2 transition-all {selectedOption ===
                            opt
                                ? 'bg-slate-950 border-slate-950 text-white shadow-lg'
                                : 'bg-white border-slate-200 text-slate-900 hover:border-slate-400 shadow-sm'}"
                        >
                            {opt}
                        </button>
                    {/each}
                </div>
            </section>

            <section class="space-y-4">
                <label
                    for="quantityInput"
                    class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1"
                    >Jumlah</label
                >
                <div
                    class="flex items-center bg-white rounded-3xl border-2 border-slate-200 px-5 h-12 shadow-sm shadow-inner group focus-within:border-slate-950 transition-all"
                >
                    <span class="text-[10px] font-black text-slate-400 mr-3"
                        >QTY</span
                    >
                    <input
                        id="quantityInput"
                        type="number"
                        bind:value={quantity}
                        min="1"
                        class="w-full bg-transparent border-none p-0 text-center font-black text-xl text-slate-950 focus:ring-0"
                    />
                </div>
            </section>
        </div>

        <button
            onclick={handleAddToCart}
            disabled={!selectedProduct}
            class="w-full h-16 bg-slate-100 text-slate-950 rounded-[2rem] font-black text-xs shadow-md active:scale-[0.97] transition-all hover:bg-slate-200 uppercase tracking-[0.2em] disabled:grayscale disabled:opacity-20 flex items-center justify-center gap-3 border-2 border-slate-200"
        >
            <Plus size={20} strokeWidth={4} />
            Tambahkan ke Keranjang
        </button>

        <!-- Order Table -->
        <section class="space-y-5 pt-4">
            <h2
                class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1"
            >
                Ringkasan Pesanan
            </h2>
            <div
                class="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
            >
                {#if cart.length > 0}
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead
                                class="bg-slate-950 text-[10px] font-black text-white uppercase tracking-widest border-b-2 border-slate-900"
                            >
                                <tr>
                                    <th class="px-6 py-5">Item</th>
                                    <th class="px-4 py-5 text-center">Qty</th>
                                    <th
                                        class="px-6 py-5 text-right border-l-2 border-slate-800"
                                        >Total</th
                                    >
                                    <th class="w-14"></th>
                                </tr>
                            </thead>
                            <tbody class="text-sm divide-y-2 divide-slate-50">
                                {#each cart as item, i}
                                    <tr
                                        class="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td class="px-6 py-5">
                                            <div
                                                class="font-black text-slate-950 uppercase tracking-tight text-base leading-none"
                                            >
                                                {item.type}
                                            </div>
                                            <div
                                                class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5"
                                            >
                                                {item.option}
                                            </div>
                                        </td>
                                        <td
                                            class="px-4 py-5 text-center font-mono font-black text-slate-950 text-lg"
                                        >
                                            <span
                                                class="bg-slate-100 px-2 py-1 rounded-lg"
                                                >{item.quantity}</span
                                            >
                                        </td>
                                        <td
                                            class="px-6 py-5 text-right font-mono font-black text-slate-950 text-base border-l-2 border-slate-50"
                                        >
                                            {formatCurrency(
                                                item.price * item.quantity,
                                            )
                                                .replace("Rp", "")
                                                .trim()}
                                        </td>
                                        <td class="px-3 py-5 text-center">
                                            <button
                                                onclick={() =>
                                                    removeFromCart(i)}
                                                class="w-10 h-10 flex items-center justify-center rounded-2xl bg-white text-red-600 hover:text-red-700 hover:bg-red-50 transition-all border-2 border-slate-200"
                                            >
                                                <X size={18} strokeWidth={4} />
                                            </button>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                {:else}
                    <div
                        class="py-20 flex flex-col items-center justify-center text-slate-300 space-y-4"
                    >
                        <div
                            class="w-16 h-16 rounded-[2rem] border-4 border-dashed border-slate-200 flex items-center justify-center"
                        >
                            <Plus
                                size={24}
                                class="opacity-30"
                                strokeWidth={3}
                            />
                        </div>
                        <p
                            class="font-black text-[11px] uppercase tracking-[0.3em] opacity-50 italic"
                        >
                            Keranjang Kosong
                        </p>
                    </div>
                {/if}
            </div>
        </section>

        <!-- Payment Section -->
        <section
            class="bg-slate-950 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group border-b-8 border-slate-900"
        >
            <div
                class="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl transition-transform group-hover:scale-110"
            ></div>

            <div class="space-y-10 relative z-10">
                <div class="grid grid-cols-1 gap-10">
                    <div class="space-y-4">
                        <label
                            for="cashInput"
                            class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] px-1"
                            >Uang Tunai</label
                        >
                        <div class="relative">
                            <span
                                class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl"
                                >Rp</span
                            >
                            <input
                                id="cashInput"
                                type="number"
                                bind:value={cash}
                                placeholder="0"
                                class="w-full h-20 pl-14 pr-6 bg-white rounded-[2rem] border-4 border-slate-800 font-black text-3xl text-slate-950 placeholder-slate-200 outline-none focus:ring-8 focus:ring-white/5 transition-all shadow-inner font-mono"
                            />
                        </div>
                    </div>
                    <div
                        class="flex justify-between items-end border-t border-white/10 pt-8"
                    >
                        <div class="flex flex-col">
                            <span
                                class="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2"
                                >Kembalian</span
                            >
                            <span
                                class="text-3xl font-black text-white font-mono tracking-tighter shadow-sm"
                                >{formatCurrency(change)}</span
                            >
                        </div>
                        <div class="text-right flex flex-col items-end">
                            <span
                                class="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2 px-2 py-1 bg-white/10 rounded"
                                >Total</span
                            >
                            <span
                                class="text-5xl font-black text-white font-mono tracking-tighter leading-none"
                            >
                                {formatCurrency(total)}
                            </span>
                        </div>
                    </div>
                </div>

                <div class="pt-4">
                    <button
                        onclick={handleAddOrder}
                        disabled={isSubmitting ||
                            !customerName ||
                            cart.length === 0 ||
                            !cash ||
                            cash < total}
                        class="w-full h-20 bg-white text-slate-950 rounded-[2rem] font-black text-base shadow-2xl active:scale-[0.98] hover:bg-slate-100 transition-all disabled:grayscale disabled:opacity-20 flex items-center justify-center gap-4 uppercase tracking-[0.3em] border-b-4 border-slate-300"
                    >
                        {isSubmitting ? "Memproses..." : "Simpan Pesanan"}
                        {#if !isSubmitting}
                            <ChevronRight size={24} strokeWidth={4} />
                        {/if}
                    </button>
                </div>
            </div>
        </section>
    </div>
</div>

<style>
    :global(body) {
        background-color: #f8fafc;
    }
</style>
