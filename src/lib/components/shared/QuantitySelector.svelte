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
        let current =
            typeof quantity === "number" && !isNaN(quantity) ? quantity : 0;
        const newVal = Math.max(min, current + delta);
        if (newVal !== quantity) {
            quantity = newVal;
            onUpdate?.(quantity);
        }
    }

    function handleInput(e: Event) {
        const val = parseInt((e.target as HTMLInputElement).value);
        if (!isNaN(val)) {
            quantity = val;
            onUpdate?.(quantity);
        }
    }

    function handleBlur() {
        if (typeof quantity !== "number" || isNaN(quantity) || quantity < min) {
            quantity = min;
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
    <input
        type="number"
        inputmode="numeric"
        value={quantity}
        oninput={handleInput}
        onblur={handleBlur}
        class="flex-1 w-16 text-center text-3xl font-black font-mono text-slate-900 bg-transparent border-none p-0 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none min-w-0"
    />
    <Button
        variant="secondary"
        size="sm"
        class="w-11 h-11 p-0 rounded-xl flex-none"
        onclick={() => update(1)}
    >
        <Plus size={18} strokeWidth={3} />
    </Button>
</div>
