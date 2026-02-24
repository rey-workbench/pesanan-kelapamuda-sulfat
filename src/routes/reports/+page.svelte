<script lang="ts">
    import {
        Calendar as CalendarIcon,
        Download,
        History,
        TrendingUp,
        ShoppingBag,
        X,
    } from "lucide-svelte";
    import { formatCurrency } from "$lib/utils";
    import { ui } from "$lib/state/ui.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import StatusBadge from "$lib/components/shared/StatusBadge.svelte";
    import CalendarPicker from "$lib/components/shared/CalendarPicker.svelte";
    import SectionHeader from "$lib/components/shared/SectionHeader.svelte";
    import { ReportsState } from "$lib/state/reports.svelte";

    let { data } = $props();

    const state = new ReportsState({
        orders: data.history || [],
        settings: data.settings!,
    });

    $effect(() => {
        state.updateData({
            orders: data.history || [],
            settings: data.settings!,
        });
    });

    $effect(() => {
        ui.setPage({
            title: state.data?.settings?.storeName || "Laporan",
            subtitle: "Penjualan",
            showBack: false,
        });
    });
</script>

<div class="container-sm pb-28 space-y-5 mt-3 animate-in">
    <!-- Single-row controls -->
    <div class="flex gap-2 items-center">
        <!-- Filter chip -->
        <Button
            variant="unstyled"
            size="sm"
            class="flex-1 flex items-center gap-2 h-11 bg-white rounded-xl px-3 border border-slate-200 shadow-sm text-left min-w-0"
            onclick={() => (state.showCalendar = true)}
        >
            <History
                size={15}
                strokeWidth={2.5}
                class="text-slate-400 shrink-0"
            />
            <span class="text-xs font-bold text-slate-700 truncate">
                {state.filterDate
                    ? state.filterDate.split("-").reverse().join("/")
                    : "Semua Tanggal"}
            </span>
            {#if state.filterDate}
                <Button
                    variant="unstyled"
                    size="sm"
                    class="ml-auto w-5 h-5 p-0 flex-none flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                    onclick={(e) => {
                        e.stopPropagation();
                        state.filterDate = "";
                    }}
                >
                    <X size={10} strokeWidth={3} />
                </Button>
            {/if}
        </Button>

        <!-- Calendar trigger -->
        <Button
            variant={state.filterDate ? "emerald" : "secondary"}
            size="sm"
            class="flex-none w-11 h-11 p-0 rounded-xl"
            onclick={() => (state.showCalendar = true)}
        >
            <CalendarIcon size={18} strokeWidth={2.5} />
        </Button>

        <!-- Export -->
        <Button
            variant="emerald"
            size="sm"
            class="flex-none h-11 px-3 rounded-xl"
            onclick={() => state.exportToExcel()}
            disabled={state.filteredOrders.length === 0}
        >
            <Download size={16} strokeWidth={2.5} />
            <span class="hidden sm:inline text-xs">Export</span>
        </Button>
    </div>

    <!-- Summary -->
    <div class="grid grid-cols-2 gap-2.5">
        <Card variant="premium" padding="sm" class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-emerald-600">
                <TrendingUp size={12} strokeWidth={3} />
                <span class="text-[9px] font-black uppercase tracking-widest"
                    >Omzet</span
                >
            </div>
            <div class="text-base font-black font-mono text-slate-900 truncate">
                {formatCurrency(state.totalRevenue).replace("Rp", "").trim()}
            </div>
        </Card>
        <Card variant="premium" padding="sm" class="flex flex-col gap-1.5">
            <div class="flex items-center gap-1.5 text-blue-600">
                <ShoppingBag size={12} strokeWidth={3} />
                <span class="text-[9px] font-black uppercase tracking-widest"
                    >Terjual</span
                >
            </div>
            <div class="text-base font-black font-mono text-slate-900">
                {state.totalItems}
                <span class="text-[9px] font-bold text-slate-400">Degan</span>
            </div>
        </Card>
    </div>

    <!-- Order list -->
    <section class="space-y-2">
        <SectionHeader title="Pesanan ({state.filteredOrders.length})" />
        <div class="space-y-2">
            {#each state.filteredOrders as item (item.id)}
                <div
                    class="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-col gap-2"
                >
                    <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                            <span
                                class="text-[10px] font-black text-slate-400 font-mono"
                                >#{item.id}</span
                            >
                            <span class="badge-slate shrink-0">
                                {item.items.reduce(
                                    (a: number, c: { quantity: number }) =>
                                        a + c.quantity,
                                    0,
                                )} Item
                            </span>
                        </div>
                        <StatusBadge status={item.status} />
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <div class="min-w-0">
                            <p
                                class="font-bold text-slate-900 text-sm truncate leading-tight"
                            >
                                {item.customerName}
                            </p>
                            <p
                                class="text-[10px] text-slate-400 font-medium mt-0.5"
                            >
                                {item.date}
                            </p>
                        </div>
                        <p
                            class="text-sm font-black font-mono text-emerald-600 shrink-0"
                        >
                            {formatCurrency(item.total)
                                .replace("Rp", "")
                                .trim()}
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
            {:else}
                <div
                    class="py-16 text-center opacity-40 flex flex-col items-center gap-3"
                >
                    <History size={28} class="opacity-50" />
                    <p
                        class="text-[10px] font-bold uppercase tracking-widest text-slate-500"
                    >
                        Tidak Ada Riwayat
                    </p>
                </div>
            {/each}
        </div>
    </section>
</div>

<CalendarPicker
    bind:show={state.showCalendar}
    bind:value={state.filterDate}
    onSelect={(d) => (state.filterDate = d)}
    onClose={() => (state.showCalendar = false)}
/>
