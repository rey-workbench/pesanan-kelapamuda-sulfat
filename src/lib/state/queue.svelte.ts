import type { Order, OrderItem, AppSettings } from "$lib/models";
import { ui } from "$lib/state/ui.svelte";
import { apiCall } from "$lib/utils";
import { invalidateAll } from "$app/navigation";

export class QueueState {
    data = $state<{ queue: Order[]; settings: AppSettings }>();
    activeTab = $state<"pending" | "ready">("pending");

    showEditModal = $state(false);
    editingOrder = $state<Order | null>(null);
    editedItems = $state<OrderItem[]>([]);

    constructor(initialData: { queue: Order[]; settings: AppSettings }) {
        this.data = initialData;
    }

    updateData(newData: { queue: Order[]; settings: AppSettings }) {
        this.data = newData;
    }

    pendingOrders = $derived(
        this.data?.queue?.filter((q) => q.status === "pending") || []
    );

    readyOrders = $derived(
        this.data?.queue?.filter((q) => q.status === "completed") || []
    );

    currentList = $derived(
        this.activeTab === "pending" ? this.pendingOrders : this.readyOrders
    );

    async handleStatusUpdate(
        id: number | undefined,
        targetStatus: "completed" | "picked_up"
    ) {
        if (!id) return;

        const loadingTitle =
            targetStatus === "completed"
                ? "Menyelesaikan Pesanan"
                : "Menyerahkan Pesanan";
        const loadingMsg =
            targetStatus === "completed"
                ? "Sedang memindahkan ke Siap Ambil..."
                : "Sedang menandai pesanan selesai diambil...";

        ui.showLoading(loadingTitle, loadingMsg);
        try {
            await apiCall("updateStatus", { id, status: targetStatus });
            await invalidateAll();
        } finally {
            setTimeout(() => ui.hideLoading(), 500);
        }
    }

    openEditModal(order: Order) {
        this.editingOrder = { ...order };
        this.editedItems = order.items.map((it) => ({
            ...it,
            options: [...it.options],
        }));
        this.showEditModal = true;
    }

    updateItemQuantity(index: number, delta: number) {
        this.editedItems[index].quantity = Math.max(
            1,
            this.editedItems[index].quantity + delta
        );
    }

    toggleOption(itemIndex: number, opt: string) {
        const item = this.editedItems[itemIndex];
        if (item.options.includes(opt)) {
            item.options = item.options.filter((o) => o !== opt);
        } else {
            item.options = [...item.options, opt];
        }
    }

    async saveEdit() {
        if (!this.editingOrder?.id) return;

        const total = this.editedItems.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
        );
        const change =
            this.editingOrder.cash > 0
                ? Math.max(0, this.editingOrder.cash - total)
                : 0;

        ui.showLoading("Menyimpan Perubahan", "Sedang memperbarui data pesanan...");
        try {
            await apiCall("updateOrder", {
                id: this.editingOrder.id,
                order: {
                    items: this.editedItems,
                    total,
                    change,
                    catatan: this.editingOrder.catatan,
                },
            });
            await invalidateAll();
            this.showEditModal = false;
        } finally {
            setTimeout(() => ui.hideLoading(), 500);
        }
    }
}
