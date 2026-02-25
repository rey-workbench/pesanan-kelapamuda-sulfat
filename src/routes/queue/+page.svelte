<script lang="ts">
    import {
        CheckCircle2,
        UserCheck,
        Edit2,
        Plus,
        Minus,
        Volume2,
        VolumeX,
    } from "lucide-svelte";
    import { ui } from "$lib/state/ui.svelte";
    import Modal from "$lib/components/layout/Modal.svelte";
    import SectionHeader from "$lib/components/shared/SectionHeader.svelte";
    import OrderItemDisplay from "$lib/components/shared/OrderItemDisplay.svelte";
    import OrderNote from "$lib/components/shared/OrderNote.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { formatCurrency } from "$lib/utils";
    import { invalidateAll } from "$app/navigation";

    import { QueueState } from "$lib/state/queue.svelte";
    import QueueTabs from "./components/QueueTabs.svelte";
    import QueueEmptyState from "./components/QueueEmptyState.svelte";

    let { data } = $props();

    const state = new QueueState({
        queue: data.queue || [],
        settings: data.settings!,
    });

    $effect(() => {
        state.updateData({ queue: data.queue || [], settings: data.settings! });
    });

    $effect(() => {
        const pollInterval = setInterval(() => {
            if (!state.showEditModal) {
                invalidateAll();
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    });

    $effect(() => {
        if (state.data?.settings) {
            ui.setPage({
                title: state.data.settings.storeName || "Antrean",
                subtitle: "Pesanan Hari Ini",
                pending: state.pendingOrders.length,
                completed: state.readyOrders.length,
                showBack: false,
            });
        }
    });
</script>

<svelte:window onclick={() => state.initAudio()} />

<div class="container-sm pt-3 pb-28 animate-in">
    <div class="flex items-center justify-between mb-4">
        <QueueTabs {state} />

        <div class="flex-none">
            {#if !state.audioUnlocked}
                <Button
                    variant="danger"
                    size="sm"
                    onclick={() => state.initAudio()}
                >
                    <VolumeX size={16} strokeWidth={2.5} class="mr-2" />
                    Bisu
                </Button>
            {:else}
                <div
                    class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-200"
                >
                    <Volume2 size={16} strokeWidth={2.5} />
                    Suara Aktif
                </div>
            {/if}
        </div>
    </div>

    <div class="flex flex-col gap-4">
        {#each state.currentList as item (item.id)}
            <Card
                class={state.activeTab === "ready"
                    ? "border-emerald-200 bg-emerald-50/10"
                    : ""}
            >
                <!-- Order Header -->
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base border shadow-sm {state.activeTab ===
                            'ready'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-900 border-slate-200'}"
                        >
                            #{item.id}
                        </div>
                        <div class="grow min-w-0">
                            <h2
                                class="font-black text-base tracking-tight leading-tight mb-0.5 line-clamp-2 {state.activeTab ===
                                'ready'
                                    ? 'text-emerald-950'
                                    : 'text-slate-900'}"
                            >
                                {item.customerName}
                            </h2>
                            <span
                                class="text-[10px] font-bold font-mono {state.activeTab ===
                                'ready'
                                    ? 'text-emerald-600'
                                    : 'text-slate-400'}"
                            >
                                {item.date}
                            </span>
                        </div>
                    </div>

                    {#if state.activeTab === "pending"}
                        <Button
                            variant="secondary"
                            size="sm"
                            class="w-9 h-9 p-0 rounded-lg flex-none"
                            onclick={() => state.openEditModal(item)}
                        >
                            <Edit2 size={16} strokeWidth={2.5} />
                        </Button>
                    {/if}
                </div>

                <div class="flex flex-col gap-1.5 mb-4">
                    <div
                        class="inline-block self-start badge-emerald px-3 py-1.5 border shadow-sm"
                    >
                        {item.items.reduce(
                            (acc: number, curr: { quantity: number }) =>
                                acc + curr.quantity,
                            0,
                        )} Porsi
                    </div>
                    <OrderNote catatan={item.catatan} />
                </div>

                <div class="space-y-2.5 mb-3">
                    {#each item.items as subItem}
                        <OrderItemDisplay item={subItem} status={item.status} />
                    {/each}
                </div>

                <!-- Total -->
                <div
                    class="flex justify-between items-center py-2.5 mb-3 border-t border-slate-100"
                >
                    <span
                        class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                        >Total</span
                    >
                    <span
                        class="font-black font-mono text-base {state.activeTab ===
                        'ready'
                            ? 'text-emerald-700'
                            : 'text-slate-900'}"
                    >
                        {formatCurrency(item.total)}
                    </span>
                </div>

                {#if state.activeTab === "pending"}
                    <Button
                        variant="emerald"
                        size="lg"
                        class="w-full"
                        onclick={() =>
                            state.handleStatusUpdate(item.id, "completed")}
                    >
                        <CheckCircle2 size={20} strokeWidth={2.5} />
                        Selesaikan Pesanan
                    </Button>
                {:else}
                    <Button
                        variant="emerald"
                        size="lg"
                        class="w-full uppercase tracking-widest"
                        onclick={() =>
                            state.handleStatusUpdate(item.id, "picked_up")}
                    >
                        <UserCheck size={20} strokeWidth={2.5} />
                        Tandai Sudah Diambil
                    </Button>
                {/if}
            </Card>
        {/each}

        {#if state.currentList.length === 0}
            <QueueEmptyState activeTab={state.activeTab} />
        {/if}
    </div>
</div>

<!-- Edit Modal -->
<Modal
    bind:show={state.showEditModal}
    title="Edit Pesanan #{state.editingOrder?.id}"
    message="Sesuaikan rincian pesanan jika ada perubahan."
    confirmText="Simpan"
    onConfirm={() => state.saveEdit()}
>
    {#if state.editingOrder}
        <div class="space-y-5 max-h-[60vh] overflow-y-auto px-1 py-1 text-left">
            <div class="space-y-2">
                <SectionHeader title="Catatan" />
                <input
                    type="text"
                    bind:value={state.editingOrder.catatan}
                    class="w-full h-11 bg-slate-50 rounded-xl px-4 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 transition-colors"
                    placeholder="Tambah catatan..."
                />
            </div>

            <div class="space-y-3">
                <SectionHeader title="Daftar Menu" />
                {#each state.editedItems as it, idx}
                    <div
                        class="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3"
                    >
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-slate-900 text-sm"
                                >{it.type}</span
                            >
                            <div class="flex items-center gap-2">
                                <!-- Qty +/- are inline spinner controls — unstyled for custom sizing -->
                                <Button
                                    variant="danger"
                                    size="sm"
                                    class="w-8 h-8 p-0 rounded-lg"
                                    onclick={() =>
                                        state.updateItemQuantity(idx, -1)}
                                >
                                    <Minus size={14} strokeWidth={3} />
                                </Button>
                                <span
                                    class="font-black font-mono text-base w-5 text-center"
                                    >{it.quantity}</span
                                >
                                <Button
                                    variant="emerald"
                                    size="sm"
                                    class="w-8 h-8 p-0 rounded-lg"
                                    onclick={() =>
                                        state.updateItemQuantity(idx, 1)}
                                >
                                    <Plus size={14} strokeWidth={3} />
                                </Button>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-1.5">
                            {#each state.data?.settings?.options || [] as opt}
                                <Button
                                    variant="unstyled"
                                    size="sm"
                                    class="px-3 py-1.5 rounded-lg border-2 text-[10px] font-bold transition-all {it.options.includes(
                                        opt,
                                    )
                                        ? 'bg-emerald-600 border-emerald-600 text-white'
                                        : 'bg-white border-slate-200 text-slate-600'}"
                                    onclick={() => state.toggleOption(idx, opt)}
                                >
                                    {opt}
                                </Button>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>

            <div
                class="pt-3 border-t border-slate-100 flex justify-between items-end"
            >
                <div class="flex flex-col">
                    <span
                        class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                        >Estimasi Total</span
                    >
                    <span class="text-lg font-black font-mono text-slate-900">
                        {formatCurrency(
                            state.editedItems.reduce(
                                (
                                    acc: number,
                                    curr: { price: number; quantity: number },
                                ) => acc + curr.price * curr.quantity,
                                0,
                            ),
                        )}
                    </span>
                </div>
            </div>
        </div>
    {/if}
</Modal>
