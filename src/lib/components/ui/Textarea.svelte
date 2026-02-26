<script lang="ts">
    import type { HTMLTextareaAttributes } from "svelte/elements";

    let {
        value = $bindable(""),
        class: className = "",
        ...rest
    } = $props<
        {
            value?: string;
            class?: string;
        } & HTMLTextareaAttributes
    >();
</script>

<textarea
    bind:value
    class="w-full bg-white rounded-xl px-4 py-3 border border-slate-200 text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-500 transition-colors resize-none {className}"
    {...rest}
></textarea>
