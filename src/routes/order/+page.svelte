<script lang="ts">
    import { User, Plus, Send } from "lucide-svelte";
    import { ui } from "$lib/ui.svelte";
    import { formatCurrency } from "$lib/utils";
    import { goto } from "$app/navigation";
    import Modal from "$lib/components/layout/Modal.svelte";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Textarea from "$lib/components/ui/Textarea.svelte";
    import Toggle from "$lib/components/ui/Toggle.svelte";
    import QuantitySelector from "$lib/components/shared/QuantitySelector.svelte";
    import CartSummary from "$lib/components/shared/CartSummary.svelte";
    import { OrderState } from "$lib/state/order.svelte";

    let { data } = $props();

    const state = new OrderState({
        get settings() {
            return data.settings!;
        },
        get queue() {
            return data.queue || [];
        },
    });

    $effect(() => {
        state.updateData({ settings: data.settings!, queue: data.queue || [] });
    });

    $effect(() => {
        ui.setPage({
            title: state.data?.settings?.storeName || "Pesan",
            subtitle: "Order Baru",
            pending: state.pendingCount,
            completed: state.completedCount,
            showBack: false,
        });
    });
</script>

{#snippet menuSelection()}
    <section class="space-y-3">
        <div class="flex justify-between items-center px-1">
            <SectionHeader title="Pilih Menu" />
            {#if state.data?.settings?.products.length === 0}
                <Button
                    variant="ghost"
                    size="sm"
                    onclick={() => goto("/settings")}
                >
                    Input Menu &rarr;
                </Button>
            {/if}
        </div>
        <div class="grid grid-cols-2 gap-3">
            {#each state.data?.settings?.products || [] as product}
                <Button
                    variant="unstyled"
                    size="sm"
                    class="h-20 p-4 rounded-2xl flex flex-col items-center justify-center border-2 active:scale-[0.96] {state
                        .selectedProduct?.name === product.name
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                        : 'bg-emerald-100/70 border-emerald-200 text-slate-800 hover:border-emerald-400'}"
                    onclick={() => (state.selectedProduct = product)}
                >
                    <span class="text-sm font-black leading-tight mb-1"
                        >{product.name}</span
                    >
                    <span
                        class="text-xs font-mono font-bold {state
                            .selectedProduct?.name === product.name
                            ? 'text-emerald-100'
                            : 'text-emerald-700/70'}"
                    >
                        {formatCurrency(product.price)}
                    </span>
                </Button>
            {/each}
        </div>
    </section>
{/snippet}

<div class="container-sm pt-3 pb-28 space-y-5 animate-in">
    <!-- Customer name (optional) -->
    <section class="space-y-2">
        <SectionHeader title="Nama Pelanggan (Opsional)" />
        <Input
            id="customerName"
            placeholder="Pelanggan Umum..."
            bind:value={state.customerName}
            icon={User}
        />
    </section>

    <!-- Menu selection -->
    {@render menuSelection()}

    <!-- Options selector -->
    {#if state.data?.settings?.options && state.data.settings.options.length > 0}
        <section class="space-y-2">
            <SectionHeader title="Pilih Opsi" />
            <div class="flex flex-wrap gap-2.5">
                {#each state.data.settings.options as opt}
                    {@const isSelected = state.selectedOptions.includes(opt)}
                    <Button
                        variant="unstyled"
                        class="px-5 py-2.5 rounded-2xl border-2 text-sm font-bold transition-all active:scale-95 {isSelected
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'}"
                        onclick={() => state.toggleOption(opt)}
                    >
                        {opt}
                    </Button>
                {/each}
            </div>
        </section>
    {/if}

    <!-- Quantity -->
    <section class="space-y-2">
        <SectionHeader title="Jumlah" />
        <QuantitySelector bind:quantity={state.quantity} />
    </section>

    <!-- Add to cart -->
    <Button
        variant="emerald"
        size="md"
        class="w-full"
        disabled={!state.selectedProduct}
        onclick={() => state.handleAddToCart()}
    >
        <Plus size={18} strokeWidth={3} />
        Tambahkan ke Keranjang
    </Button>

    <!-- Cart summary -->
    {#if state.cart.length > 0}
        <CartSummary {state} />
    {/if}

    <!-- Catatan (optional) -->
    <section class="space-y-2">
        <SectionHeader title="Catatan (Opsional)" />
        <Textarea
            bind:value={state.catatan}
            placeholder="Catatan untuk pesanan ini..."
            class="min-h-[80px]"
        />
    </section>

    <!-- Cash payment toggle -->
    <section class="space-y-2">
        <Toggle
            bind:checked={state.showCashCard}
            label="Bayar Tunai"
            ariaLabel="Aktifkan pembayaran tunai"
        />

        {#if state.showCashCard}
            <Card
                variant="emerald"
                padding="md"
                class="space-y-4 animate-in slide-in-from-top-2 fade-in duration-200"
            >
                <div class="space-y-2">
                    <label
                        for="cashInput"
                        class="text-[9px] font-black text-emerald-700 uppercase tracking-widest"
                        >Uang Diterima (Rp)</label
                    >
                    <div class="relative">
                        <span
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-sm"
                            >Rp</span
                        >
                        <input
                            id="cashInput"
                            type="number"
                            inputmode="numeric"
                            bind:value={state.cash}
                            placeholder="0"
                            onfocus={(e) =>
                                (e.target as HTMLInputElement).select()}
                            class="w-full h-14 pl-12 pr-4 bg-white rounded-xl border-2 border-emerald-200 text-slate-900 font-black font-mono text-2xl outline-none focus:border-emerald-500 transition-colors"
                        />
                    </div>
                </div>
                {#if state.cash !== null && state.cash > 0}
                    <div
                        class="flex justify-between items-center pt-2 border-t border-emerald-200"
                    >
                        <span
                            class="text-xs font-bold text-emerald-700 uppercase tracking-widest"
                            >Kembalian</span
                        >
                        <span
                            class="text-xl font-black font-mono {state.change >=
                            0
                                ? 'text-emerald-700'
                                : 'text-red-600'}"
                        >
                            {state.change >= 0
                                ? "+"
                                : ""}{state.change.toLocaleString("id-ID")}
                        </span>
                    </div>
                {/if}
            </Card>
        {/if}
    </section>

    <!-- Submit -->
    <Button
        variant="emerald"
        size="md"
        class="w-full tracking-widest shadow-lg"
        onclick={() => (state.showConfirmModal = true)}
        disabled={state.cart.length === 0 ||
            (state.showCashCard &&
                state.cash !== null &&
                state.cash > 0 &&
                state.change < 0)}
    >
        <Send size={18} strokeWidth={3} />
        Simpan Pesanan
    </Button>
</div>

<Modal
    bind:show={state.showConfirmModal}
    title="Konfirmasi Pesanan"
    message="Pastikan semua item sudah benar sebelum menyimpan."
    confirmText="Ya, Simpan"
    onConfirm={() => state.submitOrder()}
/>
