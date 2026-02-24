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
    <!-- Date mode tabs: Hari Ini / Semua / Custom -->
    <div class="space-y-2">
        <div
            class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1"
        >
            <Button
                variant="unstyled"
                size="sm"
                class="flex-1 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap {state.filterDate ===
                new Date().toISOString().split('T')[0]
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500'}"
                onclick={() =>
                    (state.filterDate = new Date().toISOString().split("T")[0])}
            >
                Hari Ini
            </Button>
            <Button
                variant="unstyled"
                size="sm"
                class="flex-1 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap {!state.filterDate
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500'}"
                onclick={() => (state.filterDate = "")}
            >
                Semua
            </Button>
            <Button
                variant="unstyled"
                size="sm"
                class="flex-1 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap {state.filterDate &&
                state.filterDate !== new Date().toISOString().split('T')[0]
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-500'}"
                onclick={() => (state.showCalendar = true)}
            >
                {state.filterDate &&
                state.filterDate !== new Date().toISOString().split("T")[0]
                    ? state.filterDate.split("-").reverse().join("/")
                    : "Pilih Tanggal"}
            </Button>
        </div>

        <!-- Export -->
        <Button
            variant="emerald"
            size="sm"
            class="w-full h-11"
            onclick={() => state.exportToExcel()}
            disabled={state.filteredOrders.length === 0}
        >
            <Download size={16} strokeWidth={2.5} />
            Export Excel ({state.filteredOrders.length} Pesanan)
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
