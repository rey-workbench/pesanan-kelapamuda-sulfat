import type { Order, AppSettings } from "$lib/models";
import { ui } from "$lib/ui.svelte";
import { apiCall, totalQuantity } from "$lib/utils";
import * as XLSX from "xlsx";

export class ReportsState {
    data = $state<{ orders: Order[]; settings: AppSettings }>();
    filterDate = $state("");
    showCalendar = $state(false);

    showDeleteModal = $state(false);
    deleteId = $state<number | null>(null);

    isSelectionMode = $state(false);
    selectedIds = $state<number[]>([]);
    showBulkDeleteModal = $state(false);

    constructor(initialData: { orders: Order[]; settings: AppSettings }) {
        this.data = initialData;
        this.filterDate = this.today;
    }

    get today() {
        return new Date().toISOString().split('T')[0];
    }

    get tabItems() {
        const today = this.today;
        return [
            { label: "Hari Ini", value: today },
            { label: "Semua", value: "" },
            {
                label: this.filterDate && this.filterDate !== today
                    ? this.filterDate.split("-").reverse().join("/")
                    : "Pilih Tanggal",
                value: "custom",
                onclick: () => (this.showCalendar = true)
            }
        ];
    }

    get activeTab() {
        if (this.filterDate === this.today) return this.today;
        if (this.filterDate === "") return "";
        return "custom";
    }

    setFilterDate(val: string) {
        if (val !== "custom") this.filterDate = val;
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
            (sum, o) => sum + totalQuantity(o.items),
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

        await ui.withLoading('Menghapus', 'Menghapus pesanan...', async () => {
            await apiCall("deleteOrder", { id: this.deleteId });
            this.showDeleteModal = false;
        });
    }

    toggleSelectionMode() {
        this.isSelectionMode = !this.isSelectionMode;
        if (!this.isSelectionMode) {
            this.selectedIds = [];
        }
    }

    toggleSelection(id: number) {
        if (this.selectedIds.includes(id)) {
            this.selectedIds = this.selectedIds.filter(i => i !== id);
        } else {
            this.selectedIds = [...this.selectedIds, id];
        }
    }

    selectAll() {
        if (this.selectedIds.length === this.filteredOrders.length) {
            this.selectedIds = [];
        } else {
            this.selectedIds = this.filteredOrders.map(o => o.id!);
        }
    }

    openBulkDeleteModal() {
        if (this.selectedIds.length > 0) {
            this.showBulkDeleteModal = true;
        }
    }

    async confirmBulkDelete() {
        if (this.selectedIds.length === 0) return;

        await ui.withLoading('Menghapus', `Menghapus ${this.selectedIds.length} pesanan...`, async () => {
            const promises = this.selectedIds.map(id => apiCall("deleteOrder", { id }));
            await Promise.all(promises);
            this.showBulkDeleteModal = false;
            this.isSelectionMode = false;
            this.selectedIds = [];
        });
    }
}
