<script lang="ts">
    import { Clock, CheckCircle2 } from "lucide-svelte";
    let { activeTab } = $props<{ activeTab: "pending" | "ready" }>();
</script>

<div class="flex flex-col items-center justify-center py-24 text-slate-400">
    <div
        class="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center mb-6 bg-slate-50"
    >
        {#if activeTab === "pending"}
            <Clock size={40} class="opacity-50 text-slate-400" />
        {:else}
            <CheckCircle2 size={40} class="opacity-50 text-emerald-400" />
        {/if}
    </div>
    <p class="text-xs font-bold uppercase tracking-widest text-slate-400">
        {activeTab === "pending"
            ? "Antrean Kosong"
            : "Tidak Ada Pesanan Menunggu Diambil"}
    </p>
</div>
