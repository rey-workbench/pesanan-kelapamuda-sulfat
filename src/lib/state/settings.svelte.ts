import type { AppSettings } from "$lib/models";
import { ui } from "$lib/state/ui.svelte";
import { apiCall } from "$lib/utils";
import { invalidateAll } from "$app/navigation";

export class SettingsState {
    data = $state<{ settings: AppSettings }>();

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
        this.settings.products = this.settings.products.filter(
            (_, i) => i !== index
        );
    }

    addOption() {
        if (!this.settings) return;
        this.settings.options = [...this.settings.options, "Opsi Baru"];
    }

    removeOption(index: number) {
        if (!this.settings) return;
        this.settings.options = this.settings.options.filter(
            (_, i) => i !== index
        );
    }

    async saveSettings() {
        if (!this.settings) return;
        ui.showLoading(
            "Menyimpan Pengaturan",
            "Sedang memperbarui konfigurasi toko..."
        );
        try {
            await apiCall("saveSettings", $state.snapshot(this.settings));
            await invalidateAll();
        } finally {
            setTimeout(() => ui.hideLoading(), 500);
        }
    }
}
