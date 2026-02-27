import { invalidateAll } from "$app/navigation";
import type { AppSettings, Order, OrderItem } from "$lib/models";
import { ui } from "$lib/ui.svelte";
import { apiCall } from "$lib/utils";

export class QueueState {
    data = $state<{ queue: Order[]; settings: AppSettings }>();
    activeTab = $state<"pending" | "ready">("pending");

    showEditModal = $state(false);
    editingOrder = $state<Order | null>(null);
    editedItems = $state<OrderItem[]>([]);

    lastMaxId = 0;
    audioUnlocked = $state(false);
    private audioPlayer: HTMLAudioElement | null = null;
    private pollInterval: any = null;

    constructor(initialData: { queue: Order[]; settings: AppSettings }) {
        this.data = initialData;
        this.lastMaxId = this.getMaxId(initialData.queue);
        if (typeof Audio !== 'undefined') {
            this.audioPlayer = new Audio('/' + this.notificationSound);
        }
    }

    private get notificationSound() {
        return this.data?.settings?.notificationSound || 'notification/masuk.mp3';
    }

    private getMaxId(queue: Order[]) {
        if (!queue || queue.length === 0) return 0;
        return Math.max(...queue.map((q) => q.id || 0));
    }

    initAudio() {
        if (!this.audioUnlocked && this.audioPlayer) {
            try {
                this.audioPlayer.volume = 0;
                this.audioPlayer.play().then(() => {
                    this.audioPlayer!.pause();
                    this.audioPlayer!.volume = 1;
                    this.audioUnlocked = true;
                }).catch(e => console.log("Unlock required interaction", e));
            } catch (e) { }
        }
    }

    updateData(newData: { queue: Order[]; settings: AppSettings }) {
        this.data = newData;

        const currentMaxId = this.getMaxId(newData.queue);
        if (currentMaxId > this.lastMaxId) {
            this.lastMaxId = currentMaxId;

            try {
                if (this.audioUnlocked && this.audioPlayer) {
                    const soundPath = this.notificationSound;

                    if (this.audioPlayer.src.indexOf(soundPath) === -1) {
                        this.audioPlayer.src = '/' + soundPath;
                    }

                    this.audioPlayer.currentTime = 0;
                    this.audioPlayer.play().catch(e => console.error("Play error", e));
                }
            } catch (e) {
                console.error("Audio playback error", e);
            }
        }
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



    async handleStatusUpdate(id: number | undefined, targetStatus: "completed" | "picked_up") {
        if (!id) return;

        const config = {
            completed: { title: "Menyelesaikan Pesanan", msg: "Sedang memindahkan ke Siap Ambil..." },
            picked_up: { title: "Menyerahkan Pesanan", msg: "Sedang menandai pesanan selesai diambil..." }
        }[targetStatus];

        await ui.withLoading(config.title, config.msg, () =>
            apiCall("updateStatus", { id, status: targetStatus })
        );
    }

    async deleteOrder(id: number | undefined) {
        if (!id) return;
        await ui.withLoading("Menghapus Pesanan", "Sedang menghapus...", () =>
            apiCall("deleteOrder", { id })
        );
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

        const total = this.editedItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
        const change = this.editingOrder.cash > 0 ? Math.max(0, this.editingOrder.cash - total) : 0;

        await ui.withLoading("Menyimpan Perubahan", "Sedang memperbarui data pesanan...", () =>
            apiCall("updateOrder", {
                id: this.editingOrder!.id!,
                order: {
                    items: this.editedItems,
                    total,
                    change,
                    catatan: this.editingOrder!.catatan,
                },
            })
        );
        this.showEditModal = false;
    }

    startPolling() {
        if (this.pollInterval) return;
        this.pollInterval = setInterval(() => {
            if (!this.showEditModal) {
                invalidateAll();
            }
        }, 3000);
    }

    stopPolling() {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }
}
