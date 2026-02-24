<script lang="ts">
    import { page } from "$app/state";
    import { Plus, ListTodo, History } from "lucide-svelte";

    const navItems = [
        { href: "/", label: "Order", icon: Plus },
        { href: "/queue", label: "Antrean", icon: ListTodo },
        { href: "/reports", label: "Laporan", icon: History },
    ];
</script>

<nav
    class="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 px-8 py-3 pb-safe flex justify-between items-center z-50 max-w-md mx-auto shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.1)]"
>
    {#each navItems as { href, label, icon: Icon }}
        {@const isActive = page.url.pathname === href}
        <a
            {href}
            class="relative flex flex-col items-center gap-1.5 py-1 px-4 transition-all duration-300"
        >
            <div class="relative flex flex-col items-center group">
                <Icon
                    size={24}
                    strokeWidth={isActive ? 4 : 2.5}
                    class="transition-all duration-300 {isActive
                        ? 'text-slate-950 scale-110'
                        : 'text-slate-500 group-hover:text-slate-900'}"
                />
                <span
                    class="text-[10px] font-black uppercase tracking-[0.1em] transition-colors {isActive
                        ? 'text-slate-950 underline underline-offset-4 decoration-slate-950 decoration-2'
                        : 'text-slate-500 group-hover:text-slate-900'}"
                >
                    {label}
                </span>
            </div>
        </a>
    {/each}
</nav>
