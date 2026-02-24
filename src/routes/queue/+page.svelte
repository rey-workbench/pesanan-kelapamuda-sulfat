<script lang="ts">
    import type { Order } from "$lib/models";
    import { CheckCircle2, UserCheck, Clock } from "lucide-svelte";
    import { invalidateAll } from "$app/navigation";
    import { formatCurrency, apiCall } from "$lib/utils";
    import { ui } from "$lib/ui.svelte";

    let { data } = $props();

    // Use server data
    let queue = $derived(data.queue || []);
    let pendingOrders = $derived(queue.filter((q) => q.status === "pending"));
    let readyOrders = $derived(queue.filter((q) => q.status === "completed"));

    let activeTab = $state<"pending" | "ready">("pending");
    let currentList = $derived(
        activeTab === "pending" ? pendingOrders : readyOrders,
    );

    // Sync Header
    $effect(() => {
        ui.setPage({
            title: data.settings?.storeName,
            subtitle: "Antrean Pesanan",
            pending: pendingOrders.length,
            completed: readyOrders.length,
            showBack: false,
        });
    });

    async function handleStatusUpdate(
        id: number | undefined,
        targetStatus: "completed" | "picked_up",
    ) {
        if (!id) return;

        let loadingTitle = "";
        let loadingMsg = "";

        if (targetStatus === "completed") {
            loadingTitle = "Menyelesaikan Pesanan";
            loadingMsg = "Sedang memindahkan ke Siap Ambil...";
        } else {
            loadingTitle = "Menyerahkan Pesanan";
            loadingMsg = "Sedang menandai pesanan selesai diambil...";
        }

        ui.showLoading(loadingTitle, loadingMsg);
        try {
            await apiCall("updateStatus", { id, status: targetStatus });
            await invalidateAll();
        } finally {
            setTimeout(() => {
                ui.hideLoading();
            }, 500);
        }
    }
</script>

<div class="px-5 pt-4 pb-28 animate-in max-w-md mx-auto">
    <!-- Tab Controls -->
    <div
        class="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200 shadow-sm"
    >
        <button
            onclick={() => (activeTab = "pending")}
            class="flex-1 flex justify-center items-center py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer {activeTab ===
            'pending'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'}"
        >
            <Clock
                size={16}
                strokeWidth={2.5}
                class="mr-2 {activeTab === 'pending'
                    ? 'text-blue-500'
                    : 'text-slate-400'}"
            />
            Sedang Dibuat
            {#if pendingOrders.length > 0}
                <span
                    class="ml-2 px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] min-w-5 h-5 flex items-center justify-center border border-blue-200"
                    >{pendingOrders.length}</span
                >
            {/if}
        </button>
        <button
            onclick={() => (activeTab = "ready")}
            class="flex-1 flex justify-center items-center py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer {activeTab ===
            'ready'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700'}"
        >
            <CheckCircle2
                size={16}
                strokeWidth={2.5}
                class="mr-2 {activeTab === 'ready'
                    ? 'text-emerald-500'
                    : 'text-slate-400'}"
            />
            Siap Ambil
            {#if readyOrders.length > 0}
                <span
                    class="ml-2 px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] min-w-5 h-5 flex items-center justify-center border border-emerald-200"
                    >{readyOrders.length}</span
                >
            {/if}
        </button>
    </div>

    <!-- Active List -->
    <div class="flex flex-col gap-5">
        {#each currentList as item, i (item.id)}
            <div
                class="simple-card animate-in slide-in-from-bottom-4 duration-300 {activeTab ===
                'ready'
                    ? 'border-emerald-200 bg-linear-to-br from-white to-emerald-50/20'
                    : ''}"
            >
                <!-- Order Header -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border shadow-sm {activeTab ===
                            'ready'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-900 border-slate-200'}"
                        >
                            #{i + 1}
                        </div>
                        <div>
                            <h2
                                class="font-black text-slate-900 text-2xl tracking-tight leading-none mb-1 {activeTab ===
                                'ready'
                                    ? 'text-emerald-950'
                                    : 'text-slate-900'}"
                            >
                                {item.customerName}
                            </h2>
                            <span
                                class="text-[10px] font-bold font-mono tracking-tight {activeTab ===
                                'ready'
                                    ? 'text-emerald-600'
                                    : 'text-slate-400'}"
                            >
                                {item.date}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Total Portions Badge -->
                <div
                    class="mb-5 inline-block text-[10px] font-bold px-3 py-1.5 rounded-lg border uppercase tracking-widest {activeTab ===
                    'ready'
                        ? 'bg-white border-emerald-200 text-emerald-700 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)]'
                        : 'bg-emerald-50 border-emerald-100 text-emerald-700'}"
                >
                    {item.items.reduce((acc, curr) => acc + curr.quantity, 0)} Porsi
                </div>

                <!-- Order Items -->
                <div class="space-y-3 mb-6">
                    {#each item.items as subItem}
                        <div
                            class="flex items-center justify-between p-4 rounded-xl border {activeTab ===
                            'ready'
                                ? 'bg-white border-emerald-100'
                                : 'bg-slate-50 border-slate-100'}"
                        >
                            <div class="flex flex-col">
                                <span
                                    class="text-sm font-bold {activeTab ===
                                    'ready'
                                        ? 'text-emerald-950'
                                        : 'text-slate-900'}"
                                    >{subItem.type}</span
                                >
                                <span
                                    class="text-[10px] font-bold uppercase tracking-widest mt-0.5 {activeTab ===
                                    'ready'
                                        ? 'text-emerald-600/70'
                                        : 'text-slate-400'}"
                                    >{subItem.option}</span
                                >
                            </div>
                            <span
                                class="text-lg font-black font-mono px-3 py-1.5 rounded-lg border {activeTab ===
                                'ready'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-100'
                                    : 'bg-white text-slate-900 border-slate-200'}"
                                >{subItem.quantity}x</span
                            >
                        </div>
                    {/each}
                </div>

                <!-- Actions -->
                {#if activeTab === "pending"}
                    <button
                        onclick={() => handleStatusUpdate(item.id, "completed")}
                        class="btn-primary"
                    >
                        <CheckCircle2
                            size={24}
                            strokeWidth={2.5}
                            class="mr-2"
                        />
                        Selesaikan Pesanan
                    </button>
                {:else}
                    <button
                        onclick={() => handleStatusUpdate(item.id, "picked_up")}
                        class="btn-primary flex items-center justify-center font-bold text-base h-14 uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 border-emerald-500 shadow-emerald-600/20 shadow-md text-white transition-all active:scale-95 border rounded-xl w-full"
                    >
                        <UserCheck size={24} strokeWidth={2.5} class="mr-2" />
                        Tandai Sudah Diambil
                    </button>
                {/if}
            </div>
        {/each}

        {#if currentList.length === 0}
            <div
                class="flex flex-col items-center justify-center py-24 text-slate-400"
            >
                <div
                    class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6 bg-slate-50"
                >
                    {#if activeTab === "pending"}
                        <Clock size={40} class="opacity-50 text-slate-400" />
                    {:else}
                        <CheckCircle2
                            size={40}
                            class="opacity-50 text-emerald-400"
                        />
                    {/if}
                </div>
                <p
                    class="text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                    {activeTab === "pending"
                        ? "Antrean Kosong"
                        : "Tidak Ada Pesanan Menunggu Diambil"}
                </p>
            </div>
        {/if}
    </div>
</div>
