<script lang="ts">
    import { onMount } from "svelte";
    import { dbService } from "$lib/db";
    import type { Order, AppSettings } from "$lib/models";
    import { CheckCircle2 } from "lucide-svelte";
    import Header from "$lib/components/Header.svelte";

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

<Header
    title={settings?.storeName}
    subtitle="Antrean Berjalan"
    pending={queue.filter((q) => q.status === "pending").length}
    completed={queue.filter((q) => q.status === "completed").length}
/>

<div class="px-4 pt-6 pb-32 animate-in max-w-md mx-auto">
    <div class="flex items-center justify-between mb-6 px-2">
        <h2
            class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
        >
            Urutan Antrean
        </h2>
        <span
            class="text-[10px] font-black text-white bg-slate-950 px-3 py-1.5 rounded-xl border-2 border-slate-950 italic"
            >Geser Horizontal →</span
        >
    </div>

    <div
        class="flex flex-row gap-6 overflow-x-auto pb-10 px-2 snap-x no-scrollbar"
    >
        {#each queue.filter((q) => q.status === "pending") as item, i (item.id)}
            <div
                class="flex-none w-[88%] max-w-[340px] snap-center bg-white rounded-[3rem] shadow-2xl shadow-slate-300 border-2 border-slate-200 overflow-hidden group animate-in slide-in-from-right-8 fade-in duration-500"
            >
                <div class="p-8 h-full flex flex-col">
                    <!-- Order Index & Label -->
                    <div class="flex justify-between items-start mb-8">
                        <div
                            class="w-14 h-14 bg-slate-950 text-white rounded-[1.2rem] flex items-center justify-center font-black text-2xl shadow-xl border-2 border-slate-800"
                        >
                            #{i + 1}
                        </div>
                        <div class="text-right">
                            <div
                                class="flex items-center gap-2 justify-end mb-1"
                            >
                                <div
                                    class="w-2 h-2 rounded-full bg-slate-950 animate-pulse"
                                ></div>
                                <span
                                    class="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] leading-none"
                                    >Menunggu</span
                                >
                            </div>
                            <span
                                class="text-[10px] font-bold text-slate-400 font-mono tracking-tight"
                                >{item.date}</span
                            >
                        </div>
                    </div>

                    <!-- Customer Info -->
                    <div class="mb-10">
                        <h2
                            class="font-black text-slate-950 text-4xl tracking-tight mb-3 truncate leading-none"
                        >
                            {item.customerName}
                        </h2>
                        <div class="flex gap-2">
                            <span
                                class="text-[10px] font-black bg-slate-950 text-white px-4 py-2 rounded-xl border-2 border-slate-950 uppercase tracking-widest shadow-md"
                            >
                                {item.items.reduce(
                                    (acc, curr) => acc + curr.quantity,
                                    0,
                                )} Porsi
                            </span>
                        </div>
                    </div>

                    <!-- Order Items -->
                    <div class="flex-grow space-y-4 mb-10">
                        {#each item.items as subItem}
                            <div
                                class="flex items-center justify-between bg-slate-50 p-5 rounded-[2rem] border-2 border-slate-100 group-hover:bg-white transition-colors shadow-sm"
                            >
                                <div class="flex flex-col">
                                    <span
                                        class="text-xs font-black text-slate-950 uppercase tracking-tight"
                                        >{subItem.type}</span
                                    >
                                    <span
                                        class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1"
                                        >{subItem.option}</span
                                    >
                                </div>
                                <span
                                    class="text-xl font-black text-slate-950 font-mono bg-white px-4 py-2 rounded-xl border-2 border-slate-100 shadow-inner"
                                    >{subItem.quantity}x</span
                                >
                            </div>
                        {/each}
                    </div>

                    <!-- Actions -->
                    <div
                        class="mt-auto pt-8 border-t-2 border-dashed border-slate-100 text-center"
                    >
                        <button
                            onclick={() => handleComplete(item.id)}
                            class="w-full h-24 bg-slate-950 text-white rounded-[2.5rem] shadow-2xl active:scale-[0.96] transition-all hover:bg-black flex flex-col items-center justify-center gap-1 border-b-8 border-slate-800"
                        >
                            <CheckCircle2 size={36} strokeWidth={3} />
                            <span
                                class="font-black text-[11px] uppercase tracking-[0.3em] mt-2"
                                >Selesaikan Pesanan</span
                            >
                        </button>
                    </div>
                </div>
            </div>
        {/each}

        {#if queue.filter((q) => q.status === "pending").length === 0}
            <div
                class="flex-none w-full flex flex-col items-center justify-center py-48 text-slate-300"
            >
                <div
                    class="w-24 h-24 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex items-center justify-center mb-6"
                >
                    <CheckCircle2 size={48} class="opacity-20" />
                </div>
                <p
                    class="text-[11px] font-black uppercase tracking-[0.5em] opacity-40"
                >
                    Kosong
                </p>
            </div>
        {/if}
    </div>
</div>
