<script lang="ts">
    import type { Order } from "$lib/models";
    import { Download, Trash2, Search } from "lucide-svelte";
    import * as XLSX from "xlsx";
    import Modal from "$lib/components/Modal.svelte";
    import { invalidateAll } from "$app/navigation";
    import { formatCurrency, apiCall } from "$lib/utils";
    import { ui } from "$lib/ui.svelte";

    let { data } = $props();

    // Use server data
    let history = $derived(data.history);
    let searchTerm = $state("");

    // Sync Header
    $effect(() => {
        ui.setPage({
            title: data.settings?.storeName,
            subtitle: "Riwayat Transaksi",
            pending: (data.queue || []).filter(
                (q: any) => q.status === "pending",
            ).length,
            completed: (data.queue || []).filter(
                (q: any) => q.status === "completed",
            ).length,
            showBack: false,
        });
    });

    let showDeleteModal = $state(false);
    let itemToDelete = $state<number | undefined>(undefined);

    function handleDelete(id: number | undefined) {
        if (!id) return;
        itemToDelete = id;
        showDeleteModal = true;
    }

    async function confirmDelete() {
        if (!itemToDelete) return;

        await apiCall("deleteOrder", { id: itemToDelete });
        await invalidateAll();
        itemToDelete = undefined;
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

<div class="px-5 pb-32 space-y-8 mt-4 max-w-md mx-auto">
    <!-- Controls -->
    <div class="flex flex-col gap-4">
        <div class="relative group">
            <Search class="input-pos-icon" size={20} strokeWidth={2.5} />
            <input
                type="text"
                bind:value={searchTerm}
                placeholder="Cari pelanggan atau menu..."
                class="input-pos pl-11"
            />
        </div>

        <button
            onclick={exportData}
            class="btn-secondary h-12 text-[10px] tracking-widest uppercase flex gap-2"
        >
            <Download size={18} strokeWidth={3} /> EXPORT LAPORAN
        </button>
    </div>

    <!-- History List -->
    <div class="space-y-4">
        <div class="flex items-center justify-between px-1">
            <h3
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
            >
                Semua Transaksi
            </h3>
            <span
                class="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100"
            >
                {filteredHistory.length} Record
            </span>
        </div>

        {#each filteredHistory as item (item.id)}
            <div class="simple-card group">
                <div class="flex justify-between items-start mb-5">
                    <div class="space-y-1.5 flex-grow min-w-0 mr-4">
                        <h4
                            class="font-bold text-slate-900 text-lg leading-tight truncate"
                        >
                            {item.customerName}
                        </h4>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span
                                class="text-[10px] font-bold text-slate-500 font-mono"
                            >
                                {item.date}
                            </span>
                            <span class="w-1 h-1 rounded-full bg-slate-300"
                            ></span>
                            <span
                                class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                            >
                                {item.items.reduce(
                                    (acc, curr) => acc + curr.quantity,
                                    0,
                                )} Item
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-col items-end gap-2 flex-none">
                        <div class="text-right">
                            <p
                                class="font-black text-slate-900 text-lg font-mono leading-none tracking-tight"
                            >
                                {formatCurrency(item.total)
                                    .replace("Rp", "")
                                    .trim()}
                            </p>
                        </div>
                        <div
                            class="inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border
                            {item.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-600 border-slate-200'}"
                        >
                            {item.status}
                        </div>
                    </div>
                </div>

                <div
                    class="flex flex-wrap gap-3 pt-4 border-t border-slate-100 justify-between items-center"
                >
                    <div
                        class="flex gap-2 min-w-0 flex-wrap flex-1 content-start"
                    >
                        {#each item.items as subItem}
                            <div
                                class="flex-none bg-slate-50 px-2 py-1 rounded-md border border-slate-200 text-[10px] font-bold text-slate-700 whitespace-nowrap"
                            >
                                {subItem.type}
                                <span class="text-slate-400 font-normal ml-0.5"
                                    >x{subItem.quantity}</span
                                >
                            </div>
                        {/each}
                    </div>
                    <button
                        onclick={() => handleDelete(item.id)}
                        class="w-10 h-10 flex-none flex items-center justify-center rounded-lg bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200"
                    >
                        <Trash2 size={18} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        {/each}

        {#if filteredHistory.length === 0}
            <div
                class="flex flex-col items-center justify-center py-24 text-slate-400"
            >
                <div
                    class="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-4 bg-slate-50"
                >
                    <Search size={28} class="opacity-50" strokeWidth={3} />
                </div>
                <p
                    class="text-[10px] font-bold uppercase tracking-widest text-slate-400"
                >
                    Tidak Ditemukan
                </p>
            </div>
        {/if}
    </div>
</div>

<Modal
    bind:show={showDeleteModal}
    title="Hapus Data"
    message="Apakah Anda yakin ingin menghapus data transaksi ini secara permanen?"
    confirmText="Hapus"
    cancelText="Batal"
    type="danger"
    onConfirm={confirmDelete}
/>

<style>
    :global(body) {
        background-color: #f1f5f9;
        color: #0f172a;
    }
</style>
