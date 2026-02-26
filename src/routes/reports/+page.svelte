<script lang="ts">
    import { Download, History, TrendingUp, ShoppingBag } from "lucide-svelte";
    import { formatCurrency } from "$lib/utils";
    import { ui } from "$lib/ui.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CalendarPicker from "$lib/components/shared/CalendarPicker.svelte";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import FilterTabs from "$lib/components/shared/FilterTabs.svelte";
    import Modal from "$lib/components/layout/Modal.svelte";
    import { ReportsState } from "$lib/state/reports.svelte";
    import ReportItem from "$lib/components/shared/ReportItem.svelte";

    let { data } = $props();

    const state = new ReportsState({
        get orders() {
            return data.history || [];
        },
        get settings() {
            return data.settings!;
        },
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
    <!-- Date filter -->
    <div class="space-y-2">
        <FilterTabs
            items={state.tabItems}
            activeValue={state.activeTab}
            onUpdate={(val: string) => state.setFilterDate(val)}
        />

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
                <ReportItem {item} {state} />
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
    onSelect={(d: string) => (state.filterDate = d)}
    onClose={() => (state.showCalendar = false)}
/>

<Modal
    bind:show={state.showDeleteModal}
    title="Hapus Pesanan"
    message={`Yakin ingin menghapus pesanan #${state.deleteId}? Data yang sudah dihapus tidak dapat dikembalikan.`}
    confirmText="Hapus"
    cancelText="Batal"
    type="danger"
    onConfirm={() => state.confirmDelete()}
/>
