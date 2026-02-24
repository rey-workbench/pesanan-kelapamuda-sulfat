<script lang="ts">
    import type { OrderItem } from "$lib/models";

    let {
        item,
        variant = "default",
        status = "pending",
    } = $props<{
        item: OrderItem;
        variant?: "default" | "badge";
        status?: "pending" | "completed" | "picked_up" | "cancelled";
    }>();

    const isReady = $derived(status === "completed" || status === "picked_up");
</script>

{#if variant === "badge"}
    <div
        class="flex-none badge {isReady
            ? 'badge-emerald bg-emerald-50/50'
            : 'badge-slate'}"
    >
        {item.type}
        {#if item.options.length > 0}
            <span class="font-normal ml-1 opacity-60"
                >({item.options.join(", ")})</span
            >
        {/if}
        <span class="font-normal ml-1 opacity-60">x{item.quantity}</span>
    </div>
{:else}
    <div
        class="flex items-center justify-between p-4 rounded-xl border {isReady
            ? 'bg-white border-emerald-100'
            : 'bg-slate-50 border-slate-100'}"
    >
        <div class="flex flex-col">
            <span
                class="text-sm font-bold {isReady
                    ? 'text-emerald-950'
                    : 'text-slate-900'}">{item.type}</span
            >
            <span
                class="text-[10px] font-bold uppercase tracking-widest mt-0.5 {isReady
                    ? 'text-emerald-600/70'
                    : 'text-slate-400'}"
            >
                {item.options.join(", ") || "-"}
            </span>
        </div>
        <span
            class="text-lg font-black font-mono px-3 py-1.5 rounded-lg border {isReady
                ? 'bg-emerald-50 text-emerald-900 border-emerald-100'
                : 'bg-white text-slate-900 border-slate-200'}"
        >
            {item.quantity}x
        </span>
    </div>
{/if}
