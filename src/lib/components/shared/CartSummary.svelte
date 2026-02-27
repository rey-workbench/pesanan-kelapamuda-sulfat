<script lang="ts">
    import type { OrderState } from "$lib/state/order.svelte";
    import SectionHeader from "$lib/components/ui/SectionHeader.svelte";
    import { formatCurrency, totalQuantity } from "$lib/utils";
    import { X, Plus } from "lucide-svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let { state } = $props<{ state: OrderState }>();
</script>

{#snippet cartRow(item: any, i: number)}
    <tr class="hover:bg-slate-50 transition-colors">
        <td class="px-5 py-4">
            <div class="font-bold text-slate-900 text-base">
                {item.type}
            </div>
            <div
                class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1"
            >
                {item.options.join(", ") || "-"}
            </div>
        </td>
        <td
            class="px-3 py-4 text-center font-mono font-bold text-slate-900 text-lg"
        >
            <span
                class="bg-slate-100 px-2.5 py-1 rounded border border-slate-200"
            >
                {item.quantity}
            </span>
        </td>
        <td
            class="px-5 py-4 text-right font-mono font-bold text-slate-900 text-base"
        >
            {formatCurrency(item.price * item.quantity)
                .replace("Rp", "")
                .trim()}
        </td>
        <td class="px-2 py-4 text-center">
            <Button
                variant="unstyled"
                size="sm"
                class="w-8 h-8 p-0 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                onclick={() => state.removeFromCart(i)}
            >
                <X size={18} strokeWidth={3} />
            </Button>
        </td>
    </tr>
{/snippet}

<section class="space-y-4 pt-4 border-t border-slate-200">
    <SectionHeader title="Ringkasan Pesanan" />
    <Card padding="none" class="overflow-hidden">
        {#if state.cart.length > 0}
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead
                        class="bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-200"
                    >
                        <tr>
                            <th class="px-5 py-4">Item</th>
                            <th class="px-3 py-4 text-center">Qty</th>
                            <th class="px-5 py-4 text-right">Total</th>
                            <th class="w-12"></th>
                        </tr>
                    </thead>
                    <tbody class="text-sm divide-y divide-slate-100">
                        {#each state.cart as item, i}
                            {@render cartRow(item, i)}
                        {/each}
                    </tbody>
                    <tfoot class="bg-emerald-50 border-t-2 border-slate-200">
                        <tr>
                            <td
                                class="px-5 py-3 text-[10px] font-bold text-emerald-700 uppercase tracking-widest text-right"
                            >
                                Total Pesanan
                            </td>
                            <td
                                class="px-3 py-3 text-center font-mono font-bold text-emerald-900 text-lg"
                            >
                                <span
                                    class="bg-emerald-100 px-2.5 py-1 rounded border border-emerald-200"
                                >
                                    {totalQuantity(state.cart)}
                                </span>
                            </td>
                            <td
                                class="px-5 py-3 text-right font-mono font-black text-emerald-900 text-base"
                            >
                                {formatCurrency(state.total)
                                    .replace("Rp", "")
                                    .trim()}
                            </td>
                            <td></td>
                        </tr>
                        {#if state.catatan}
                            <tr
                                class="bg-amber-50/50 border-t border-slate-200"
                            >
                                <td
                                    colspan="4"
                                    class="px-5 py-3 text-sm text-amber-800 italic font-medium leading-snug"
                                >
                                    <div class="flex gap-2 items-start">
                                        <span
                                            class="font-black uppercase tracking-widest text-[10px] bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 shrink-0 mt-[2px]"
                                        >
                                            Catatan
                                        </span>
                                        <span class="text-wrap min-w-0"
                                            >{state.catatan}</span
                                        >
                                    </div>
                                </td>
                            </tr>
                        {/if}
                    </tfoot>
                </table>
            </div>
        {:else}
            <div
                class="py-16 flex flex-col items-center justify-center text-slate-400"
            >
                <div
                    class="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-3"
                >
                    <Plus size={20} class="opacity-50" />
                </div>
                <p
                    class="text-[10px] font-bold uppercase tracking-widest opacity-80"
                >
                    Keranjang Kosong
                </p>
            </div>
        {/if}
    </Card>
</section>
