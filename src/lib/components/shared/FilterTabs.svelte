<script lang="ts">
    import Button from "$lib/components/ui/Button.svelte";

    let {
        items,
        activeValue = $bindable(),
        onUpdate,
        class: className = "",
    } = $props<{
        items: {
            label: string;
            value: any;
            icon?: any;
            iconClass?: string;
            badge?: string | number;
            badgeClass?: string;
            onclick?: () => void;
        }[];
        activeValue: any;
        onUpdate?: (val: any) => void;
        class?: string;
    }>();
</script>

<div
    class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 {className}"
>
    {#each items as item}
        {@const Icon = item.icon}
        <Button
            variant="unstyled"
            size="sm"
            class="flex-1 flex justify-center items-center gap-1.5 py-2.5 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap {activeValue ===
            item.value
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500'}"
            onclick={() => {
                if (item.onclick) item.onclick();
                else {
                    activeValue = item.value;
                    onUpdate?.(item.value);
                }
            }}
        >
            {#if Icon}
                <Icon
                    size={13}
                    strokeWidth={2.5}
                    class="{activeValue === item.value
                        ? item.iconClass || 'text-blue-500'
                        : 'text-slate-400'} shrink-0"
                />
            {/if}
            {item.label}
            {#if item.badge}
                <span
                    class="{item.badgeClass ||
                        'badge-slate'} h-4 px-1.5 min-w-4 text-[9px] shrink-0"
                    >{item.badge}</span
                >
            {/if}
        </Button>
    {/each}
</div>
