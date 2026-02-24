<script lang="ts">
    let {
        checked = $bindable(false),
        label = "",
        ariaLabel = "",
        class: className = "",
    } = $props<{
        checked: boolean;
        label?: string;
        ariaLabel?: string;
        class?: string;
    }>();
</script>

<div class="flex items-center justify-between {className}">
    {#if label}
        <span class="text-sm font-bold text-slate-700">{label}</span>
    {/if}
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        onclick={() => (checked = !checked)}
        class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors active:scale-95 {checked
            ? 'bg-emerald-500'
            : 'bg-slate-200'}"
    >
        <span
            class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform {checked
                ? 'translate-x-6'
                : 'translate-x-1'} shadow-sm"
        ></span>
    </button>
</div>
