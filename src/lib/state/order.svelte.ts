import type { OrderItem, ProductType, AppSettings, Order } from "$lib/models";
import { ui } from "$lib/state/ui.svelte";
import { apiCall } from "$lib/utils";
import { invalidateAll } from "$app/navigation";

export class OrderState {
    // Reactive data sources
    data = $state<{ settings: AppSettings; queue: Order[] }>();

    // Form state
    selectedProduct = $state<ProductType | null>(null);
    quantity = $state(1);
    selectedOptions = $state<string[]>([]);

    customerName = $state("");
    catatan = $state("");
    cart = $state<OrderItem[]>([]);
    cash = $state<number | null>(null);
    showCashCard = $state(false);
    showConfirmModal = $state(false);

    constructor(initialData: { settings: AppSettings; queue: Order[] }) {
        this.data = initialData;

        if (initialData.settings?.products?.length > 0) {
            this.selectedProduct = initialData.settings.products[0];
        }
        if (initialData.settings?.options?.length > 0) {
            this.selectedOptions = [initialData.settings.options[0]];
        }
    }

    updateData(newData: { settings: AppSettings; queue: Order[] }) {
        this.data = newData;
    }

    total = $derived(
        this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    change = $derived(
        this.cash !== null ? Math.max(0, this.cash - this.total) : 0
    );

    pendingCount = $derived(
        this.data?.queue?.filter((q) => q.status === "pending").length || 0
    );

    completedCount = $derived(
        this.data?.queue?.filter((q) => q.status === "completed").length || 0
    );

    toggleOption(opt: string) {
        if (this.selectedOptions.includes(opt)) {
            this.selectedOptions = this.selectedOptions.filter((o) => o !== opt);
        } else {
            this.selectedOptions = [...this.selectedOptions, opt];
        }
    }

    handleAddToCart() {
        if (!this.selectedProduct) return;

        this.cart = [
            ...this.cart,
            {
                type: this.selectedProduct.name,
                price: this.selectedProduct.price,
                quantity: this.quantity,
                options: [...this.selectedOptions],
            },
        ];

        this.quantity = 1;
        const options = this.data?.settings?.options;
        if (options && options.length > 0) {
            this.selectedOptions = [options[0]];
        } else {
            this.selectedOptions = [];
        }
    }

    removeFromCart(index: number) {
        this.cart = this.cart.filter((_, i) => i !== index);
    }

    async submitOrder() {
        if (this.cart.length === 0) return;

        ui.showLoading(
            "Memproses Pesanan",
            "Mohon tunggu sebentar, sedang menyimpan data ke server...",
        );

        try {
            await apiCall("addOrder", {
                customerName: this.customerName.trim() || "Pelanggan Umum",
                items: $state.snapshot(this.cart),
                total: this.total,
                cash: this.showCashCard ? this.cash || 0 : 0,
                change: this.showCashCard ? this.change : 0,
                catatan: this.catatan.trim(),
                date: new Date().toISOString().split("T")[0],
            });

            this.resetForm();
            await invalidateAll();

            setTimeout(() => {
                ui.hideLoading();
                this.showConfirmModal = false;
            }, 500);
        } catch (e) {
            ui.hideLoading();
            console.error(e);
        }
    }

    resetForm() {
        this.customerName = "";
        this.catatan = "";
        this.cart = [];
        this.cash = null;
        this.showCashCard = false;
    }
}
