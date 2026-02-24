<script lang="ts">
    import type { Order } from "$lib/models";
    import { CheckCircle2 } from "lucide-svelte";
    import { invalidateAll } from "$app/navigation";
    import { formatCurrency, apiCall } from "$lib/utils";
    import { ui } from "$lib/ui.svelte";

    let { data } = $props();

    // Use server data
    let queue = $derived(data.queue);
    let pendingOrders = $derived(queue.filter((q) => q.status === "pending"));
    let completedCount = $derived(
        queue.filter((q) => q.status === "completed").length,
    );

    // Sync Header
    $effect(() => {
        ui.setPage({
            title: data.settings?.storeName,
            subtitle: "Antrean Berjalan",
            pending: pendingOrders.length,
            completed: completedCount,
            showBack: false,
        });
    });

    async function handleComplete(id: number | undefined) {
        if (!id) return;

        await apiCall("updateStatus", { id, status: "completed" });
        await invalidateAll();
    }
</script>

<div class="px-5 pt-6 pb-28 animate-in max-w-md mx-auto">
    <div class="flex items-center justify-between mb-6 px-1">
        <h2
            class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
        >
            Urutan Antrean
        </h2>
    </div>

    <!-- Vertical Stack Layout -->
    <div class="flex flex-col gap-5">
        {#each pendingOrders as item, i (item.id)}
            <div
                class="simple-card animate-in slide-in-from-bottom-4 duration-300"
            >
                <!-- Order Header -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-black text-xl border border-slate-200"
                        >
                            #{i + 1}
                        </div>
                        <div>
                            <h2
                                class="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1"
                            >
                                {item.customerName}
                            </h2>
                            <span
                                class="text-[10px] font-bold text-slate-400 font-mono tracking-tight"
                            >
                                {item.date}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Total Portions Badge -->
                <div
                    class="mb-5 inline-block text-[10px] font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest"
                >
                    {item.items.reduce((acc, curr) => acc + curr.quantity, 0)} Porsi
                </div>

                <!-- Order Items -->
                <div class="space-y-3 mb-6">
                    {#each item.items as subItem}
                        <div
                            class="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100"
                        >
                            <div class="flex flex-col">
                                <span class="text-sm font-bold text-slate-900"
                                    >{subItem.type}</span
                                >
                                <span
                                    class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5"
                                    >{subItem.option}</span
                                >
                            </div>
                            <span
                                class="text-lg font-black text-slate-900 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200"
                                >{subItem.quantity}x</span
                            >
                        </div>
                    {/each}
                </div>

                <!-- Actions -->
                <button
                    onclick={() => handleComplete(item.id)}
                    class="btn-primary"
                >
                    <CheckCircle2 size={24} strokeWidth={2.5} class="mr-2" />
                    Selesaikan Pesanan
                </button>
            </div>
        {/each}

        {#if pendingOrders.length === 0}
            <div
                class="flex flex-col items-center justify-center py-32 text-slate-400"
            >
                <div
                    class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6 bg-slate-50"
                >
                    <CheckCircle2 size={40} class="opacity-50 text-slate-400" />
                </div>
                <p
                    class="text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                    Antrean Kosong
                </p>
            </div>
        {/if}
    </div>
</div>
