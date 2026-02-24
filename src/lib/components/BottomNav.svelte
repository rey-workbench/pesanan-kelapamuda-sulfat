<script lang="ts">
    import { page } from "$app/state";
    import { Plus, ListTodo, History } from "lucide-svelte";

    const navItems = [
        { href: "/", label: "Baru", icon: Plus },
        { href: "/queue", label: "Queue", icon: ListTodo },
        { href: "/reports", label: "Laporan", icon: History },
    ];
</script>

<nav
    class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-emerald-100 px-6 py-4 flex justify-between items-center z-50 rounded-t-3xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)]"
>
    {#each navItems as { href, label, icon: Icon }}
        {@const isActive = page.url.pathname === href}
        <a
            {href}
            class="flex flex-col items-center gap-1 transition-all {isActive
                ? 'text-emerald-700 scale-110'
                : 'text-emerald-200'}"
        >
            <Icon size={isActive ? 28 : 24} strokeWidth={3} />
            <span class="text-[10px] font-black uppercase tracking-tighter"
                >{label}</span
            >
        </a>
    {/each}
</nav>
