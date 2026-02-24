import type { Order, AppSettings } from "$lib/models";
import { ui } from "$lib/state/ui.svelte";

export class ReportsState {
    data = $state<{ orders: Order[]; settings: AppSettings }>();
    filterDate = $state("");
    showCalendar = $state(false);

    constructor(initialData: { orders: Order[]; settings: AppSettings }) {
        this.data = initialData;
    }

    updateData(newData: { orders: Order[]; settings: AppSettings }) {
        this.data = newData;
    }

    filteredOrders = $derived(
        this.filterDate
            ? (this.data?.orders || []).filter((o) => o.date === this.filterDate)
            : (this.data?.orders || [])
    );

    totalRevenue = $derived(
        this.filteredOrders.reduce((sum, o) => sum + o.total, 0)
    );

    totalItems = $derived(
        this.filteredOrders.reduce(
            (sum, o) =>
                sum + o.items.reduce((itemSum, it) => itemSum + it.quantity, 0),
            0
        )
    );

    async exportToExcel() {
        ui.showLoading("Mengekspor Data", "Sedang menyiapkan file Excel...");
        try {
            const xlsxUrl = /* @ts-ignore */ "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const { utils, writeFile } = await import(xlsxUrl as any);

            const exportData = this.filteredOrders.map((o) => ({
                ID: o.id,
                Tanggal: o.date,
                Pelanggan: o.customerName,
                Menu: o.items
                    .map((it) => `${it.type} (x${it.quantity})`)
                    .join(", "),
                Total: o.total,
                Status: o.status,
                Catatan: o.catatan || "-",
            }));

            const ws = utils.json_to_sheet(exportData);
            const wb = utils.book_new();
            utils.book_append_sheet(wb, ws, "Laporan Pesanan");
            writeFile(
                wb,
                `Laporan_Pesan_Degan_${this.filterDate || "Semua"}.xlsx`
            );
        } catch (e) {
            console.error("Export Error:", e);
            alert("Gagal mengekspor data. Pastikan koneksi internet stabil.");
        } finally {
            ui.hideLoading();
        }
    }
}
