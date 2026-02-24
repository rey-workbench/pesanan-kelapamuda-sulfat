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
        const data = history.flatMap((o) =>
            o.items.map((item) => ({
                Tanggal: o.date,
                Nama: o.customerName,
                Produk: item.type,
                Opsi: item.option,
                Jumlah: item.quantity,
                Harga: item.price,
                Subtotal: item.price * item.quantity,
                "Total Transaksi": o.total,
                Status: o.status,
            })),
        );
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
                    o.items.some((i) =>
                        i.type.toLowerCase().includes(searchTerm.toLowerCase()),
                    ),
            )
            .sort((a, b) => b.createdAt - a.createdAt),
    );
</script>

<Header title={settings?.storeName} subtitle="Riwayat Transaksi" />

<div class="px-5 pb-32 space-y-10 animate-in mt-6 max-w-md mx-auto">
    <!-- Controls -->
    <div class="flex flex-col gap-6">
        <div class="relative group">
            <Search
                class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-950 transition-colors"
                size={20}
                strokeWidth={4}
            />
            <input
                type="text"
                bind:value={searchTerm}
                placeholder="Cari pelanggan atau menu..."
                class="w-full h-14 pl-14 pr-5 bg-white rounded-2xl border-2 border-slate-200 shadow-sm focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10 transition-all outline-none text-base font-black text-slate-950"
            />
        </div>

        <button
            onclick={exportData}
            class="h-14 w-full bg-slate-100 text-slate-950 rounded-2xl font-black flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] shadow-md hover:bg-slate-200 active:scale-[0.98] transition-all border-2 border-slate-200"
        >
            <Download size={20} class="text-slate-950" strokeWidth={4} /> EXPORT
            LAPORAN
        </button>
    </div>

    <!-- History List -->
    <div class="space-y-6">
        <div class="flex items-center justify-between px-1">
            <h3
                class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]"
            >
                Semua Transaksi
            </h3>
            <span
                class="text-[10px] font-black text-white bg-slate-950 px-3 py-1 rounded-lg border-2 border-slate-950"
            >
                {filteredHistory.length} Record
            </span>
        </div>

        {#each filteredHistory as item (item.id)}
            <div
                class="bg-white p-6 rounded-[2.5rem] border-2 border-slate-200 shadow-xl shadow-slate-200/40 group active:scale-[0.99] transition-all"
            >
                <div class="flex justify-between items-start mb-8">
                    <div class="space-y-2 flex-grow min-w-0 mr-4">
                        <h4
                            class="font-black text-slate-950 text-2xl leading-none tracking-tight truncate"
                        >
                            {item.customerName}
                        </h4>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span
                                class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
                                >{item.date}</span
                            >
                            <span class="w-1.5 h-1.5 rounded-full bg-slate-300"
                            ></span>
                            <div
                                class="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md border border-slate-200"
                            >
                                <div
                                    class="w-1.5 h-1.5 rounded-full bg-slate-950"
                                ></div>
                                <span
                                    class="text-[9px] font-black text-slate-950 uppercase tracking-widest"
                                >
                                    {item.items.reduce(
                                        (acc, curr) => acc + curr.quantity,
                                        0,
                                    )} Item
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col items-end gap-2 flex-none">
                        <div
                            class="bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-2 text-right"
                        >
                            <div
                                class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1"
                            >
                                Total
                            </div>
                            <p
                                class="font-black text-slate-950 text-xl font-mono tracking-tighter leading-none"
                            >
                                {formatCurrency(item.total)
                                    .replace("Rp", "")
                                    .trim()}
                            </p>
                        </div>
                        <div
                            class="inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm
                            {item.status === 'completed'
                                ? 'bg-slate-950 text-white border-slate-950'
                                : 'bg-white text-slate-950 border-slate-950'}"
                        >
                            {item.status}
                        </div>
                    </div>
                </div>

                <div
                    class="flex flex-wrap gap-3 pt-6 border-t-2 border-dashed border-slate-100 justify-between items-center"
                >
                    <div
                        class="flex gap-2 overflow-x-auto no-scrollbar max-w-[75%] py-1"
                    >
                        {#each item.items as subItem}
                            <div
                                class="flex-none bg-slate-50 px-3 py-2 rounded-xl border-2 border-slate-200 text-[10px] font-black text-slate-950 whitespace-nowrap shadow-sm"
                            >
                                {subItem.type}
                                <span class="text-slate-500 ml-1"
                                    >x{subItem.quantity}</span
                                >
                            </div>
                        {/each}
                    </div>
                    <button
                        onclick={() => handleDelete(item.id)}
                        class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white text-red-600 hover:text-red-700 hover:bg-red-50 transition-all border-2 border-slate-200 shadow-sm"
                    >
                        <Trash2 size={22} strokeWidth={4} />
                    </button>
                </div>
            </div>
        {/each}

        {#if filteredHistory.length === 0}
            <div
                class="flex flex-col items-center justify-center py-24 text-slate-300"
            >
                <div
                    class="w-20 h-20 rounded-[2.5rem] border-4 border-dashed border-slate-200 flex items-center justify-center mb-6"
                >
                    <Search size={32} class="opacity-20" strokeWidth={4} />
                </div>
                <p
                    class="text-[11px] font-black uppercase tracking-[0.4em] opacity-40"
                >
                    Tidak Ditemukan
                </p>
            </div>
        {/if}
    </div>
</div>

<style>
    :global(body) {
        background-color: #f1f5f9;
        color: #020617;
    }
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
