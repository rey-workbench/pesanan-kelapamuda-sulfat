import type { AppSettings } from "$lib/models";
import { ui } from "$lib/ui.svelte";
import { apiCall } from "$lib/utils";

export class SettingsState {
    data = $state<{ settings: AppSettings }>();

    // Modal state
    showModal = $state(false);
    modalTitle = $state("");
    modalMessage = $state("");
    modalType = $state<"confirm" | "info" | "danger">("confirm");
    private _onConfirm: (() => void) | null = null;

    availableSounds = [
        { name: "Standard (Masuk)", path: "notification/masuk.mp3" },
        { name: "Varian (Masuk 2)", path: "notification/masuk2.mp3" },
    ];

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
            { name: "", price: 0 },
            ...this.settings.products,
        ];
    }

    removeProduct(index: number) {
        if (!this.settings) return;
        this.settings.products = this.settings.products.filter((_, i) => i !== index);
    }

    addOption() {
        if (!this.settings) return;
        this.settings.options = ["", ...this.settings.options];
    }

    removeOption(index: number) {
        if (!this.settings) return;
        this.settings.options = this.settings.options.filter((_, i) => i !== index);
    }

    showAlert(title: string, message: string, type: "info" | "danger" = "info") {
        this.modalTitle = title;
        this.modalMessage = message;
        this.modalType = type;
        this._onConfirm = null;
        this.showModal = true;
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
        await ui.withLoading("Menyimpan", "Sedang memperbarui konfigurasi toko...", () =>
            apiCall("saveSettings", $state.snapshot(this.settings!))
        );
    }

    previewSound() {
        if (!this.settings?.notificationSound) return;
        const audio = new Audio(`/${this.settings.notificationSound}`);
        audio.play().catch(console.error);
    }

}
