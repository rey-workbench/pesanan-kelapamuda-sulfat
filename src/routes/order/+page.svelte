<script lang="ts">
    import { User, Plus, Minus } from "lucide-svelte";
    import { ui } from "$lib/state/ui.svelte";
    import Modal from "$lib/components/layout/Modal.svelte";
    import SectionHeader from "$lib/components/shared/SectionHeader.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Toggle from "$lib/components/ui/Toggle.svelte";
    import CartSummary from "./components/CartSummary.svelte";
    import MenuSelection from "./components/MenuSelection.svelte";
    import { OrderState } from "$lib/state/order.svelte";

    let { data } = $props();

    const state = new OrderState({
        settings: data.settings!,
        queue: data.queue || [],
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
    <MenuSelection {state} />

    <!-- Options selector -->
    {#if state.data?.settings?.options && state.data.settings.options.length > 0}
        <section class="space-y-2">
            <SectionHeader title="Pilih Opsi" />
            <div class="flex flex-wrap gap-2">
                {#each state.data.settings.options as opt}
                    <Button
                        variant="unstyled"
                        size="sm"
                        class="px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all {state.selectedOptions.includes(
                            opt,
                        )
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-200 text-slate-700'}"
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
        <div class="flex items-center gap-3">
            <Button
                variant="secondary"
                size="sm"
                class="w-11 h-11 p-0 rounded-xl flex-none"
                disabled={state.quantity <= 1}
                onclick={() =>
                    (state.quantity = Math.max(1, state.quantity - 1))}
            >
                <Minus size={18} strokeWidth={3} />
            </Button>
            <span
                class="flex-1 text-center text-2xl font-black font-mono text-slate-900"
                >{state.quantity}</span
            >
            <Button
                variant="secondary"
                size="sm"
                class="w-11 h-11 p-0 rounded-xl flex-none"
                onclick={() => (state.quantity += 1)}
            >
                <Plus size={18} strokeWidth={3} />
            </Button>
        </div>
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
        <textarea
            bind:value={state.catatan}
            placeholder="Catatan untuk pesanan ini..."
            rows={2}
            class="w-full bg-white rounded-xl px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors resize-none"
        ></textarea>
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
        size="lg"
        class="w-full uppercase tracking-widest shadow-lg"
        onclick={() => (state.showConfirmModal = true)}
        disabled={state.cart.length === 0 ||
            (state.showCashCard &&
                state.cash !== null &&
                state.cash > 0 &&
                state.change < 0)}
    >
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
