class UIState {
    title = $state('Pesan Degan');
    subtitle = $state('');
    pending = $state<number | null>(null);
    completed = $state<number | null>(null);
    showBack = $state(false);

    loading = $state({
        show: false,
        title: '',
        message: ''
    });

    setPage(config: {
        title?: string,
        subtitle?: string,
        pending?: number | null,
        completed?: number | null,
        showBack?: boolean
    }) {
        this.title = config.title ?? 'Pesan Degan';
        this.subtitle = config.subtitle ?? '';
        this.pending = config.pending ?? null;
        this.completed = config.completed ?? null;
        this.showBack = config.showBack ?? false;
    }

    showLoading(title: string = 'Mohon Tunggu', message: string = 'Sedang memproses data...') {
        this.loading = { show: true, title, message };
    }

    hideLoading() {
        this.loading.show = false;
    }

    async withLoading(title: string, message: string, action: () => Promise<void>) {
        const { invalidateAll } = await import('$app/navigation');
        this.showLoading(title, message);
        try {
            await action();
            await invalidateAll();
        } finally {
            setTimeout(() => this.hideLoading(), 500);
        }
    }
}

export const ui = new UIState();
