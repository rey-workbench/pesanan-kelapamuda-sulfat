<script lang="ts">
    import { CheckCircle2, UserCheck, Edit2 } from "lucide-svelte";
    import { formatCurrency, totalQuantity } from "$lib/utils";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import OrderItemDisplay from "./OrderItemDisplay.svelte";
    import OrderNote from "./OrderNote.svelte";
    import type { Order } from "$lib/models";
    import type { QueueState } from "$lib/state/queue.svelte";

    let { item, state } = $props<{
        item: Order;
        state: QueueState;
    }>();

    const isReady = $derived(state.activeTab === "ready");
    const totalQty = $derived(totalQuantity(item.items));
</script>

<Card class={isReady ? "border-emerald-200 bg-emerald-50/10" : ""}>
    <!-- Order Header -->
    <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-3">
            <div
                class="w-9 h-9 rounded-lg flex items-center justify-center font-black text-base border shadow-sm {isReady
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-900 border-slate-200'}"
            >
                #{item.id}
            </div>
            <div class="grow min-w-0">
                <h2
                    class="font-black text-base tracking-tight leading-tight mb-0.5 line-clamp-2 {isReady
                        ? 'text-emerald-950'
                        : 'text-slate-900'}"
                >
                    {item.customerName}
                </h2>
                <span
                    class="text-[10px] font-bold font-mono {isReady
                        ? 'text-emerald-600'
                        : 'text-slate-400'}"
                >
                    {item.date}
                </span>
            </div>
        </div>

        {#if !isReady}
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
            {totalQty} Porsi
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
            class="font-black font-mono text-base {isReady
                ? 'text-emerald-700'
                : 'text-slate-900'}"
        >
            {formatCurrency(item.total)}
        </span>
    </div>

    {#if !isReady}
        <Button
            variant="emerald"
            size="lg"
            class="w-full"
            onclick={() => state.handleStatusUpdate(item.id, "completed")}
        >
            <CheckCircle2 size={20} strokeWidth={2.5} /> Selesaikan Pesanan
        </Button>
    {:else}
        <Button
            variant="emerald"
            size="lg"
            class="w-full uppercase tracking-widest"
            onclick={() => state.handleStatusUpdate(item.id, "picked_up")}
        >
            <UserCheck size={20} strokeWidth={2.5} /> Tandai Sudah Diambil
        </Button>
    {/if}
</Card>
