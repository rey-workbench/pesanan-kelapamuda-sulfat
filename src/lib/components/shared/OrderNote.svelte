<script lang="ts">
    let { catatan, variant = "inline" } = $props<{
        catatan?: string;
        variant?: "inline" | "box";
    }>();
</script>

{#if catatan}
    {#if variant === "box"}
        <div
            class="w-full mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100 text-sm text-amber-800 italic"
        >
            <strong class="uppercase tracking-widest mr-1 text-xs"
                >Catatan:</strong
            >
            {catatan}
        </div>
    {:else}
        <div
            class="px-1 text-sm text-amber-800 italic font-medium flex gap-2 items-start leading-snug"
        >
            <span
                class="font-black uppercase tracking-widest text-[10px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 mt-[2px] whitespace-nowrap"
                >Catatan</span
            >
            <span class="text-wrap min-w-0 flex-1">{catatan}</span>
        </div>
    {/if}
{/if}
