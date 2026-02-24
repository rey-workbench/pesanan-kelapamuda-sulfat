<script lang="ts">
    import { onMount } from "svelte";
    import { dbService } from "$lib/db";
    import type { Order, AppSettings } from "$lib/models";
    import { Download, Trash2, Search } from "lucide-svelte";
    import Header from "$lib/components/Header.svelte";
    import * as XLSX from "xlsx";

    let settings = $state<AppSettings | null>(null);
    let history = $state<Order[]>([]);
    let searchTerm = $state("");

    onMount(async () => {
        settings = await dbService.getSettings();
        history = await dbService.getOrders();
    });

    async function handleDelete(id: number | undefined) {
        if (!id || !confirm("Hapus data permanen?")) return;
        await dbService.deleteOrder(id);
        history = await dbService.getOrders();
    }

    function exportData() {
        const data = history.map((o) => ({
            Tanggal: o.date,
            Nama: o.customerName,
            Produk: o.type,
            Jumlah: o.quantity,
            Harga: o.price,
            Total: o.total,
            Status: o.status,
            Catatan: o.notes,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Laporan");
        XLSX.writeFile(
            wb,
            `laporan-${new Date().toISOString().split("T")[0]}.xlsx`,
        );
    }

    function formatCurrency(val: number) {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(val);
    }

    const filteredHistory = $derived(
        history
            .filter(
                (o) =>
                    o.customerName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    o.type.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .sort((a, b) => b.createdAt - a.createdAt),
    );
</script>

<Header title={settings?.storeName} subtitle="Laporan & Riwayat" />

<div class="px-4 pb-24 space-y-4 animate-in">
    <div class="flex justify-between items-center gap-4 mt-4">
        <div class="relative flex-grow">
            <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300"
                size={16}
            />
            <input
                type="text"
                bind:value={searchTerm}
                placeholder="Cari pelanggan..."
                class="w-full h-10 pl-10 pr-4 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-emerald-500 text-sm"
            />
        </div>
        <button
            onclick={exportData}
            class="h-10 px-4 bg-emerald-100 text-emerald-700 rounded-xl font-bold flex items-center gap-2 text-sm"
        >
            <Download size={16} /> EXCEL
        </button>
    </div>

    <div class="space-y-2">
        {#each filteredHistory as item (item.id)}
            <div
                class="bg-white p-3 rounded-xl border border-emerald-50 relative overflow-hidden flex justify-between items-center"
            >
                <div>
                    <p class="font-bold text-emerald-950">
                        {item.customerName}
                    </p>
                    <p class="text-[10px] text-emerald-500 font-medium">
                        {item.date} &middot; {item.type} (x{item.quantity})
                    </p>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <p class="font-black text-emerald-900 text-sm">
                            {formatCurrency(item.total)}
                        </p>
                        <span
                            class="text-[9px] uppercase font-black {item.status ===
                            'completed'
                                ? 'text-emerald-500'
                                : 'text-orange-400'}">{item.status}</span
                        >
                    </div>
                    <button
                        onclick={() => handleDelete(item.id)}
                        class="p-2 text-red-200 active:text-red-500"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        {/each}

        {#if filteredHistory.length === 0}
            <p
                class="text-center py-10 text-emerald-200 font-bold uppercase tracking-widest text-xs"
            >
                Tidak ada data
            </p>
        {/if}
    </div>
</div>
