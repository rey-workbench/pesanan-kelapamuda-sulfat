<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";

    let {
        variant = "slate",
        class: className = "",
        children,
        ...rest
    } = $props<
        {
            variant?: "slate" | "emerald" | "blue" | "danger" | "warning";
            class?: string;
            children: any;
        } & HTMLAttributes<HTMLSpanElement>
    >();

    const variantClasses = {
        slate: "bg-slate-100 text-slate-700 border-slate-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        danger: "bg-red-50 text-red-700 border-red-200",
        warning: "bg-amber-50 text-amber-800 border-amber-200",
    };
</script>

<span
    class="inline-flex items-center text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border {variantClasses[
        variant as keyof typeof variantClasses
    ]} {className}"
    {...rest}
>
    {@render children()}
</span>
