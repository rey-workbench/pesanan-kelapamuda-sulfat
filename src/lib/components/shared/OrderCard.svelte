<script lang="ts">
    import { CheckCircle2, UserCheck, Edit2, Trash2 } from "lucide-svelte";
    import { formatCurrency, totalQuantity } from "$lib/utils";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import OrderItemDisplay from "./OrderItemDisplay.svelte";
    import OrderNote from "./OrderNote.svelte";
    import type { Order } from "$lib/models";
    import type { QueueState } from "$lib/state/queue.svelte";

    let { item, state: queueState } = $props<{
        item: Order;
        state: QueueState;
    }>();

    const isReady = $derived(queueState.activeTab === "ready");
    const totalQty = $derived(totalQuantity(item.items));

    let startX = $state(0);
    let currentX = $state(0);
    let isSwiping = $state(false);

    function handleTouchStart(e: TouchEvent) {
        startX = e.touches[0].clientX;
        isSwiping = true;
    }

    function handleTouchMove(e: TouchEvent) {
        if (!isSwiping) return;
        const x = e.touches[0].clientX;
        const diff = x - startX;

        if (diff > 100) currentX = 100;
        else if (diff < -100) currentX = -100;
        else currentX = diff;
    }

    function handleTouchEnd() {
        if (!isSwiping) return;
        isSwiping = false;

        if (currentX > 80) {
            queueState.handleStatusUpdate(
                item.id,
                isReady ? "picked_up" : "completed",
            );
        } else if (currentX < -80) {
            queueState.deleteOrder(item.id);
        }

        currentX = 0;
    }
</script>

{#snippet orderHeader()}
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
                onclick={() => queueState.openEditModal(item)}
            >
                <Edit2 size={16} strokeWidth={2.5} />
            </Button>
        {/if}
    </div>
{/snippet}

{#snippet actionButtons()}
    {#if !isReady}
        <Button
            variant="emerald"
            size="lg"
            class="w-full"
            onclick={() => queueState.handleStatusUpdate(item.id, "completed")}
        >
            <CheckCircle2 size={20} strokeWidth={2.5} /> Selesaikan Pesanan
        </Button>
    {:else}
        <Button
            variant="emerald"
            size="lg"
            class="w-full uppercase tracking-widest"
            onclick={() => queueState.handleStatusUpdate(item.id, "picked_up")}
        >
            <UserCheck size={20} strokeWidth={2.5} /> Tandai Sudah Diambil
        </Button>
    {/if}
{/snippet}

<div class="relative w-full rounded-2xl overflow-hidden group">
    <!-- Background Actions -->
    <div
        class="absolute inset-0 flex items-center justify-between px-6 bg-slate-100 rounded-2xl"
    >
        <div
            class="flex items-center gap-2 text-emerald-600 font-bold transition-opacity {currentX >
            20
                ? 'opacity-100'
                : 'opacity-0'}"
        >
            {#if isReady}
                <UserCheck size={24} strokeWidth={2.5} />
                <span class="text-sm">Diambil</span>
            {:else}
                <CheckCircle2 size={24} strokeWidth={2.5} />
                <span class="text-sm">Selesai</span>
            {/if}
        </div>
        <div
            class="flex items-center gap-2 text-red-500 font-bold transition-opacity {currentX <
            -20
                ? 'opacity-100'
                : 'opacity-0'}"
        >
            <span class="text-sm">Hapus</span>
            <Trash2 size={24} strokeWidth={2.5} />
        </div>
    </div>

    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="relative w-full touch-pan-y"
        style="transform: translateX({currentX}px); transition: {isSwiping
            ? 'none'
            : 'transform 300ms ease-out'};"
        ontouchstart={handleTouchStart}
        ontouchmove={handleTouchMove}
        ontouchend={handleTouchEnd}
        ontouchcancel={handleTouchEnd}
    >
        <Card
            class={isReady
                ? "border-emerald-200 bg-emerald-50/10 shadow-sm"
                : "shadow-[0_4px_20px_rgba(0,0,0,0.02)]"}
        >
            <!-- Order Header -->
            {@render orderHeader()}

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

            {@render actionButtons()}
        </Card>
    </div>
</div>
