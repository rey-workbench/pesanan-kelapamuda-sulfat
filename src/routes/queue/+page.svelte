<script lang="ts">
    import { Volume2, VolumeX, Clock, CheckCircle2 } from "lucide-svelte";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Modal from "$lib/components/layout/Modal.svelte";
    import QuantitySelector from "$lib/components/shared/QuantitySelector.svelte";
    import FilterTabs from "$lib/components/shared/FilterTabs.svelte";
    import { formatCurrency } from "$lib/utils";
    import { ui } from "$lib/ui.svelte";
    import { QueueState } from "$lib/state/queue.svelte";
    import OrderCard from "$lib/components/shared/OrderCard.svelte";
    import Textarea from "$lib/components/ui/Textarea.svelte";

    let { data } = $props();

    const state = new QueueState({
        get queue() {
            return data.queue || [];
        },
        get settings() {
            return data.settings!;
        },
    });

    $effect(() => {
        state.updateData({ queue: data.queue || [], settings: data.settings! });
    });

    $effect(() => {
        state.startPolling();
        return () => state.stopPolling();
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

    const tabItems = $derived([
        {
            label: "Dibuat",
            value: "pending",
            icon: Clock,
            badge: state.pendingOrders.length,
            badgeClass: "badge-blue",
        },
        {
            label: "Siap Ambil",
            value: "ready",
            icon: CheckCircle2,
            badge: state.readyOrders.length,
            badgeClass: "badge-emerald",
            iconClass: "text-emerald-500",
        },
    ]);
</script>

{#snippet emptyState(activeTab: "pending" | "ready")}
    <div class="flex flex-col items-center justify-center py-24 text-slate-400">
        <div
            class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6 bg-slate-50"
        >
            {#if activeTab === "pending"}
                <Clock size={40} class="opacity-50 text-slate-400" />
            {:else}
                <CheckCircle2 size={40} class="opacity-50 text-emerald-400" />
            {/if}
        </div>
        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">
            {activeTab === "pending"
                ? "Antrean Kosong"
                : "Tidak Ada Pesanan Menunggu Diambil"}
        </p>
    </div>
{/snippet}

<svelte:window onclick={() => state.initAudio()} />

<div class="container-sm pt-3 pb-28 animate-in">
    <div class="flex items-center justify-between mb-4">
        <FilterTabs
            items={tabItems}
            bind:activeValue={state.activeTab}
            class="grow shadow-sm"
        />

        <Button
            variant={state.audioUnlocked ? "emerald" : "danger"}
            size="sm"
            class="flex items-center justify-center w-11 h-11 p-0 rounded-xl shadow-sm border {state.audioUnlocked
                ? 'border-emerald-500'
                : 'border-red-100'} ml-2"
            onclick={() => state.initAudio()}
        >
            {#if state.audioUnlocked}
                <Volume2 size={18} strokeWidth={2.5} />
            {:else}
                <VolumeX size={18} strokeWidth={2.5} />
            {/if}
        </Button>
    </div>

    <div class="flex flex-col gap-4">
        {#each state.currentList as item (item.id)}
            <OrderCard {item} {state} />
        {:else}
            {@render emptyState(state.activeTab)}
        {/each}
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
                <Textarea
                    bind:value={state.editingOrder.catatan}
                    class="min-h-[80px]"
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
                            <select
                                value={it.type}
                                onchange={(e) =>
                                    state.updateItemType(
                                        idx,
                                        (e.target as HTMLSelectElement).value,
                                    )}
                                class="bg-transparent font-bold text-slate-900 text-sm border-none outline-none focus:ring-0 p-0 cursor-pointer pr-4"
                            >
                                {#each state.data?.settings?.products || [] as prod}
                                    <option value={prod.name}
                                        >{prod.name}</option
                                    >
                                {/each}
                            </select>
                            <div class="w-32">
                                <QuantitySelector bind:quantity={it.quantity} />
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
                                (acc, curr) => acc + curr.price * curr.quantity,
                                0,
                            ),
                        )}
                    </span>
                </div>
            </div>
        </div>
    {/if}
</Modal>
