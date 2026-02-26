<script lang="ts">
    import type { Snippet } from "svelte";

    type Variant = "default" | "premium" | "emerald" | "slate" | "ghost";
    type Padding = "none" | "sm" | "md" | "lg";

    let {
        variant = "default",
        padding = "md",
        class: className = "",
        onclick,
        children,
    } = $props<{
        variant?: Variant;
        padding?: Padding;
        class?: string;
        onclick?: (e: MouseEvent) => void;
        children: Snippet;
    }>();

    const variants: Record<Variant, string> = {
        default: "bg-white border border-slate-200",
        premium: "bg-white border border-slate-200 shadow-premium",
        emerald: "bg-emerald-50 border border-emerald-100",
        slate: "bg-slate-900 text-white border border-slate-800",
        ghost: "bg-transparent border border-dashed border-slate-200",
    };

    const paddings: Record<Padding, string> = {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-8",
    };
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
    {onclick}
    onkeydown={(e) =>
        onclick && (e.key === "Enter" || e.key === " ") && onclick(e as any)}
    class="rounded-2xl transition-all {onclick
        ? 'active:scale-[0.99] cursor-pointer'
        : ''} {variants[variant as Variant]} {paddings[
        padding as Padding
    ]} {className}"
    role={onclick ? "button" : undefined}
    tabindex={onclick ? 0 : undefined}
>
    {@render children()}
</div>
