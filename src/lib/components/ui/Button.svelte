<script lang="ts">
    type Variant =
        | "primary"
        | "secondary"
        | "danger"
        | "ghost"
        | "emerald"
        | "slate"
        | "unstyled";
    type Size = "sm" | "md" | "lg" | "xl";

    import type { Snippet } from "svelte";

    let {
        variant = "primary",
        size = "md",
        class: className = "",
        disabled = false,
        type = "button",
        onclick,
        children,
    } = $props<{
        variant?: Variant;
        size?: Size;
        class?: string;
        disabled?: boolean;
        type?: "button" | "submit" | "reset";
        onclick?: (e: MouseEvent) => void;
        children: Snippet;
    }>();

    const variants: Record<Variant, string> = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-100",
        secondary:
            "bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
        emerald:
            "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-100",
        slate: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-200",
        unstyled: "", // No preset bg/border/color — fully controlled by class prop
    };

    const sizes: Record<Size, string> = {
        sm: "h-9 px-3 text-xs rounded-lg",
        md: "h-11 px-4 text-sm rounded-xl",
        lg: "h-14 px-5 text-sm rounded-xl",
        xl: "h-16 px-8 text-base rounded-2xl",
    };
</script>

<button
    {type}
    {disabled}
    {onclick}
    class="inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100 {variants[
        variant as Variant
    ]} {sizes[size as Size]} {className}"
>
    {@render children()}
</button>
