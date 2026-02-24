<script lang="ts">
    import type { OrderState } from "$lib/state/order.svelte";
    import SectionHeader from "$lib/components/shared/SectionHeader.svelte";
    import { formatCurrency } from "$lib/utils";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/Button.svelte";

    let { state } = $props<{ state: OrderState }>();
</script>

<section class="space-y-3">
    <div class="flex justify-between items-center px-1">
        <SectionHeader title="Pilih Menu" />
        {#if state.data?.settings?.products.length === 0}
            <Button variant="ghost" size="sm" onclick={() => goto("/settings")}>
                Input Menu &rarr;
            </Button>
        {/if}
    </div>
    <div class="grid grid-cols-2 gap-3">
        {#each state.data?.settings?.products || [] as product}
            <!-- Product selector: unstyled variant — active/inactive color fully controlled via class -->
            <Button
                variant="unstyled"
                size="sm"
                class="h-20 p-4 rounded-2xl flex flex-col items-center justify-center border-2 active:scale-[0.96] {state
                    .selectedProduct?.name === product.name
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'bg-emerald-100/70 border-emerald-200 text-slate-800 hover:border-emerald-400'}"
                onclick={() => (state.selectedProduct = product)}
            >
                <span class="text-sm font-black leading-tight mb-1"
                    >{product.name}</span
                >
                <span
                    class="text-xs font-mono font-bold {state.selectedProduct
                        ?.name === product.name
                        ? 'text-emerald-100'
                        : 'text-emerald-700/70'}"
                >
                    {formatCurrency(product.price)}
                </span>
            </Button>
        {/each}
    </div>
</section>
