import type { AppSettings } from "$lib/models";
import { ui } from "$lib/state/ui.svelte";
import { apiCall } from "$lib/utils";
import { invalidateAll } from "$app/navigation";

export class SettingsState {
    data = $state<{ settings: AppSettings }>();

    // Modal state
    showModal = $state(false);
    modalTitle = $state("");
    modalMessage = $state("");
    modalType = $state<"confirm" | "info" | "danger">("confirm");
    private _onConfirm: (() => void) | null = null;

    constructor(initialData: { settings: AppSettings }) {
        this.data = initialData;
    }

    updateData(newData: { settings: AppSettings }) {
        this.data = newData;
    }

    get settings() {
        return this.data?.settings;
    }

    addProduct() {
        if (!this.settings) return;
        this.settings.products = [
            ...this.settings.products,
            { name: "Menu Baru", price: 0 },
        ];
    }

    removeProduct(index: number) {
        if (!this.settings) return;
        this.settings.products = this.settings.products.filter((_, i) => i !== index);
    }

    addOption() {
        if (!this.settings) return;
        this.settings.options = [...this.settings.options, "Opsi Baru"];
    }

    removeOption(index: number) {
        if (!this.settings) return;
        this.settings.options = this.settings.options.filter((_, i) => i !== index);
    }

    saveSettings() {
        if (!this.settings?.storeName?.trim()) {
            this.modalTitle = "Perhatian";
            this.modalMessage = "Nama toko tidak boleh kosong.";
            this.modalType = "info";
            this._onConfirm = null;
            this.showModal = true;
            return;
        }
        this.modalTitle = "Simpan Pengaturan?";
        this.modalMessage = "Apakah Anda yakin ingin menyimpan konfigurasi toko?";
        this.modalType = "confirm";
        this._onConfirm = () => this._doSave();
        this.showModal = true;
    }

    confirmSave() {
        if (this._onConfirm) this._onConfirm();
    }

    private async _doSave() {
        if (!this.settings) return;
        ui.showLoading("Menyimpan", "Sedang memperbarui konfigurasi toko...");
        try {
            await apiCall("saveSettings", $state.snapshot(this.settings));
            await invalidateAll();
        } finally {
            setTimeout(() => ui.hideLoading(), 500);
        }
    }
}
