import type { Order, AppSettings } from "$lib/models";
import { ui } from "$lib/state/ui.svelte";
import { apiCall } from "$lib/utils";
import { invalidateAll } from "$app/navigation";
import * as XLSX from "xlsx";

export class ReportsState {
    data = $state<{ orders: Order[]; settings: AppSettings }>();
    filterDate = $state("");
    showCalendar = $state(false);

    showDeleteModal = $state(false);
    deleteId = $state<number | null>(null);

    constructor(initialData: { orders: Order[]; settings: AppSettings }) {
        this.data = initialData;
        this.filterDate = new Date().toISOString().split('T')[0];
    }

    updateData(newData: { orders: Order[]; settings: AppSettings }) {
        this.data = newData;
    }

    openDeleteModal(id: number) {
        this.deleteId = id;
        this.showDeleteModal = true;
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

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Laporan Pesanan");
            XLSX.writeFile(
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

    async confirmDelete() {
        if (!this.deleteId) return;

        ui.showLoading('Menghapus', 'Menghapus pesanan...');
        try {
            await apiCall("deleteOrder", { id: this.deleteId });
            await invalidateAll();
            this.showDeleteModal = false;
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setTimeout(() => ui.hideLoading(), 500);
        }
    }
}
