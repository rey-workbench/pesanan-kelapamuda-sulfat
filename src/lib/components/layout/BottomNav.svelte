<script lang="ts">
    import { page } from "$app/state";
    import { Plus, ListTodo, History } from "lucide-svelte";
    import { fade } from "svelte/transition";

    const navItems = [
        { href: "/order", label: "Order", icon: Plus },
        { href: "/queue", label: "Antrean", icon: ListTodo },
        { href: "/reports", label: "Laporan", icon: History },
    ];
</script>

<nav
    class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-8 py-3 pb-safe flex justify-between items-center max-w-md mx-auto"
>
    {#each navItems as { href, label, icon: Icon }}
        {@const isActive = page.url.pathname === href}
        <a
            {href}
            class="relative flex flex-col items-center gap-1 py-1 px-5 transition-all duration-300 active:scale-90"
        >
            {#if isActive}
                <div
                    class="absolute inset-0 bg-emerald-50 rounded-xl -z-10"
                    in:fade={{ duration: 200 }}
                ></div>
            {/if}
            <Icon
                size={20}
                strokeWidth={isActive ? 3 : 2}
                class="transition-all duration-300 {isActive
                    ? 'text-emerald-600 scale-110'
                    : 'text-slate-400'}"
            />
            <span
                class="text-[9px] font-black uppercase tracking-widest transition-all duration-300 {isActive
                    ? 'text-emerald-700'
                    : 'text-slate-400'}"
            >
                {label}
            </span>
        </a>
    {/each}
</nav>
