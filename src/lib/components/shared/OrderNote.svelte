<script lang="ts">
    let { catatan, variant = "inline" } = $props<{
        catatan?: string;
        variant?: "inline" | "box";
    }>();
</script>

{#if catatan}
    {#if variant === "box"}
        <div
            class="w-full mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100 text-[10px] text-amber-800 italic"
        >
            <strong class="uppercase tracking-widest mr-1">Catatan:</strong>
            {catatan}
        </div>
    {:else}
        <div
            class="px-1 text-[10px] text-amber-800 italic font-medium flex gap-1.5 items-start"
        >
            <span
                class="font-black uppercase tracking-widest text-[9px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 mt-0.5"
                >Catatan</span
            >
            <span class="pt-0.5">{catatan}</span>
        </div>
    {/if}
{/if}
