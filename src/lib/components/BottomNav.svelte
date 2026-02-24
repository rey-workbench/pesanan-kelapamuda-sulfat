<script lang="ts">
    import { page } from "$app/state";
    import { Plus, ListTodo, History } from "lucide-svelte";

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
            class="relative flex flex-col items-center gap-1.5 py-1 px-4 transition-colors duration-200"
        >
            <div class="flex flex-col items-center">
                <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    class="transition-colors duration-200 mb-1 {isActive
                        ? 'text-emerald-600'
                        : 'text-slate-400'}"
                />
                <span
                    class="text-[10px] font-bold tracking-wider transition-colors {isActive
                        ? 'text-emerald-600'
                        : 'text-slate-400'}"
                >
                    {label}
                </span>
            </div>
        </a>
    {/each}
</nav>
