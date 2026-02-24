<script lang="ts">
    let { status } = $props<{ status: string }>();

    function getStatusLabel(status: string) {
        if (status === "pending") return "Dibuat";
        if (status === "completed") return "Siap Ambil";
        if (status === "picked_up") return "Selesai";
        if (status === "cancelled") return "Dibatalkan";
        return status;
    }

    function getStatusClasses(status: string) {
        if (status === "picked_up") return "badge-emerald";
        if (status === "completed") return "badge-blue";
        if (status === "cancelled") return "badge-red";
        return "badge-slate";
    }
</script>

<div class="inline-flex items-center {getStatusClasses(status)}">
    {getStatusLabel(status)}
</div>
