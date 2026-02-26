<script lang="ts">
    import Button from "$lib/components/ui/Button.svelte";
    import type { Snippet } from "svelte";

    let {
        items,
        limit = 3,
        label = "item",
        renderItem,
        class: className = "",
    } = $props<{
        items: any[];
        limit?: number;
        label?: string;
        renderItem: Snippet<[any, number]>;
        class?: string;
    }>();

    let showAll = $state(false);

    const visibleItems = $derived(showAll ? items : items.slice(0, limit));
    const hiddenCount = $derived(Math.max(0, items.length - limit));
</script>

<div class="space-y-3 {className}">
    {#each visibleItems as item, i}
        {@render renderItem(item, i)}
    {/each}

    {#if !showAll && hiddenCount > 0}
        <Button
            variant="ghost"
            size="sm"
            class="w-full text-slate-500"
            onclick={() => (showAll = true)}
        >
            Tampilkan {hiddenCount}
            {label} lainnya ›
        </Button>
    {:else if showAll && hiddenCount > 0}
        <Button
            variant="ghost"
            size="sm"
            class="w-full text-slate-400"
            onclick={() => (showAll = false)}
        >
            Sembunyikan ‹
        </Button>
    {/if}
</div>
