<script lang="ts">
    import Badge from "$lib/components/ui/Badge.svelte";

    let { status } = $props<{ status: string }>();

    function getStatusLabel(status: string) {
        if (status === "pending") return "Dibuat";
        if (status === "completed") return "Siap Ambil";
        if (status === "picked_up") return "Selesai";
        if (status === "cancelled") return "Dibatalkan";
        return status;
    }

    function getVariant(status: string) {
        if (status === "picked_up") return "emerald";
        if (status === "completed") return "blue";
        if (status === "cancelled") return "danger";
        return "slate";
    }
</script>

<Badge variant={getVariant(status)}>
    {getStatusLabel(status)}
</Badge>
