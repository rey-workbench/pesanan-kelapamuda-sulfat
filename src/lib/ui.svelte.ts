export const ui = $state({
    title: 'Pesan Degan',
    subtitle: '',
    pending: null as number | null,
    completed: null as number | null,
    showBack: false,

    // Helper to reset and set new values
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
});
