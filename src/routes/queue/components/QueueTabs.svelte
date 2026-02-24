<script lang="ts">
    import { Clock, CheckCircle2 } from "lucide-svelte";
    import type { QueueState } from "$lib/state/queue.svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let { state } = $props<{ state: QueueState }>();
</script>

<div
    class="flex bg-slate-100 p-1 rounded-xl mb-5 border border-slate-200 shadow-sm"
>
    <Button
        variant="unstyled"
        size="sm"
        class="flex-1 flex justify-center items-center py-2.5 rounded-lg text-sm font-bold transition-all {state.activeTab ===
        'pending'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
            : 'text-slate-500 hover:text-slate-700'}"
        onclick={() => (state.activeTab = "pending")}
    >
        <Clock
            size={15}
            strokeWidth={2.5}
            class="mr-1.5 {state.activeTab === 'pending'
                ? 'text-blue-500'
                : 'text-slate-400'}"
        />
        Sedang Dibuat
        {#if state.pendingOrders.length > 0}
            <span class="ml-2 badge-blue h-5 px-1.5 min-w-5 shrink-0"
                >{state.pendingOrders.length}</span
            >
        {/if}
    </Button>
    <Button
        variant="unstyled"
        size="sm"
        class="flex-1 flex justify-center items-center py-2.5 rounded-lg text-sm font-bold transition-all {state.activeTab ===
        'ready'
            ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
            : 'text-slate-500 hover:text-slate-700'}"
        onclick={() => (state.activeTab = "ready")}
    >
        <CheckCircle2
            size={15}
            strokeWidth={2.5}
            class="mr-1.5 {state.activeTab === 'ready'
                ? 'text-emerald-500'
                : 'text-slate-400'}"
        />
        Siap Ambil
        {#if state.readyOrders.length > 0}
            <span class="ml-2 badge-emerald h-5 px-1.5 min-w-5 shrink-0"
                >{state.readyOrders.length}</span
            >
        {/if}
    </Button>
</div>
