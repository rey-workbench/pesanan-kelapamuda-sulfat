<script lang="ts">
    import { onMount } from "svelte";
    import { dbService } from "$lib/db";
    import type { Order, AppSettings } from "$lib/models";
    import { CheckCircle2 } from "lucide-svelte";
    import Header from "$lib/components/Header.svelte";
    import StatsBubble from "$lib/components/StatsBubble.svelte";

    let settings = $state<AppSettings | null>(null);
    let queue = $state<Order[]>([]);

    onMount(async () => {
        settings = await dbService.getSettings();
        await refreshQueue();
    });

    async function refreshQueue() {
        queue = await dbService.getTodayQueue();
    }

    async function handleComplete(id: number | undefined) {
        if (!id) return;
        await dbService.updateOrderStatus(id, "completed");
        await refreshQueue();
    }

    function formatCurrency(val: number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(val);
    }
</script>

<Header title={settings?.storeName} subtitle="Antrean Hari Ini" />
<StatsBubble
    pending={queue.filter((q) => q.status === "pending").length}
    completed={queue.filter((q) => q.status === "completed").length}
/>

<div class="px-4 pb-24 space-y-4 animate-in">
    {#each queue.filter((q) => q.status === "pending") as item (item.id)}
        <div
            class="bg-white p-4 rounded-2xl shadow-sm border border-emerald-50 flex justify-between items-center"
        >
            <div class="flex-grow">
                <div class="flex items-center gap-2">
                    <span class="font-black text-emerald-950 text-lg"
                        >{item.customerName}</span
                    >
                    <span
                        class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold uppercase"
                        >{item.type}</span
                    >
                </div>
                <p class="text-emerald-700 font-bold text-sm">
                    {item.quantity} Biji &middot; {formatCurrency(item.total)}
                </p>
                {#if item.notes}
                    <p class="text-xs text-emerald-400 font-medium italic mt-1">
                        "{item.notes}"
                    </p>
                {/if}
            </div>
            <button
                onclick={() => handleComplete(item.id)}
                class="p-4 bg-emerald-600 text-white rounded-2xl shadow-md active:scale-95 transition-transform"
            >
                <CheckCircle2 size={24} />
            </button>
        </div>
    {/each}

    {#if queue.filter((q) => q.status === "pending").length === 0}
        <div class="text-center py-20">
            <p class="text-emerald-200 uppercase font-black tracking-widest">
                Antrean Kosong
            </p>
        </div>
    {/if}
</div>
