<script lang="ts">
    import { Trash2, CheckSquare, Square } from "lucide-svelte";
    import { formatCurrency, totalQuantity } from "$lib/utils";
    import Button from "$lib/components/ui/Button.svelte";
    import StatusBadge from "./StatusBadge.svelte";
    import type { ReportsState } from "$lib/state/reports.svelte";
    import type { Order } from "$lib/models";

    let { item, state } = $props<{
        item: Order;
        state: ReportsState;
    }>();

    const isSelected = $derived(state.selectedIds.includes(item.id!));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="bg-white rounded-xl border px-4 py-3 flex flex-col gap-2 transition-all {state.isSelectionMode
        ? 'cursor-pointer'
        : ''} {isSelected
        ? 'border-emerald-500 bg-emerald-50/30'
        : 'border-slate-200'}"
    onclick={() => {
        if (state.isSelectionMode) state.toggleSelection(item.id!);
    }}
>
    <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2 min-w-0">
            <span class="text-[10px] font-black text-slate-400 font-mono"
                >#{item.id}</span
            >
            <span class="badge-slate shrink-0">
                {totalQuantity(item.items)} Item
            </span>
        </div>
        <div class="flex items-center gap-2">
            {#if state.isSelectionMode}
                <div class="text-emerald-600">
                    {#if isSelected}
                        <CheckSquare size={20} strokeWidth={2.5} />
                    {:else}
                        <Square
                            size={20}
                            class="text-slate-300"
                            strokeWidth={2.5}
                        />
                    {/if}
                </div>
            {:else}
                <Button
                    variant="unstyled"
                    size="sm"
                    class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    onclick={(e: Event) => {
                        e.stopPropagation();
                        state.openDeleteModal(item.id!);
                    }}
                >
                    <Trash2 size={14} strokeWidth={2.5} />
                </Button>
            {/if}
            <StatusBadge status={item.status} />
        </div>
    </div>
    <div class="flex items-center justify-between gap-2">
        <div class="min-w-0">
            <p class="font-bold text-slate-900 text-sm truncate leading-tight">
                {item.customerName}
            </p>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">
                {item.date}
            </p>
        </div>
        <p class="text-sm font-black font-mono text-emerald-600 shrink-0">
            {formatCurrency(item.total).replace("Rp", "").trim()}
        </p>
    </div>
    {#if item.catatan}
        <p
            class="text-[10px] text-amber-800 italic bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-100"
        >
            <span class="font-black not-italic opacity-60"
                >Note:
            </span>{item.catatan}
        </p>
    {/if}
</div>
