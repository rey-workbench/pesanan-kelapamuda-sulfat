<script lang="ts">
    import { Plus, Minus } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let {
        quantity = $bindable(),
        min = 1,
        onUpdate,
    } = $props<{
        quantity: number;
        min?: number;
        onUpdate?: (val: number) => void;
    }>();

    function update(delta: number) {
        const newVal = Math.max(min, quantity + delta);
        if (newVal !== quantity) {
            quantity = newVal;
            onUpdate?.(quantity);
        }
    }
</script>

<div class="flex items-center gap-3">
    <Button
        variant="secondary"
        size="sm"
        class="w-11 h-11 p-0 rounded-xl flex-none"
        disabled={quantity <= min}
        onclick={() => update(-1)}
    >
        <Minus size={18} strokeWidth={3} />
    </Button>
    <span
        class="flex-1 text-center text-2xl font-black font-mono text-slate-900"
    >
        {quantity}
    </span>
    <Button
        variant="secondary"
        size="sm"
        class="w-11 h-11 p-0 rounded-xl flex-none"
        onclick={() => update(1)}
    >
        <Plus size={18} strokeWidth={3} />
    </Button>
</div>
