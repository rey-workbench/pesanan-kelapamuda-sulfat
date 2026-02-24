<script lang="ts">
    import { Settings as SettingsIcon } from "lucide-svelte";

    let { title = "Pesan Degan", subtitle = "" } = $props();
</script>

<header class="bg-emerald-700 text-white p-4 pb-12 rounded-b-[40px] shadow-lg">
    <div class="flex justify-between items-center px-2">
        <div>
            <h1 class="text-2xl font-black lowercase tracking-tight">
                {title}
            </h1>
            {#if subtitle}
                <p
                    class="text-emerald-100 text-xs font-medium uppercase tracking-widest opacity-80"
                >
                    {subtitle}
                </p>
            {/if}
        </div>
        <a href="/settings" class="p-2 bg-emerald-600/50 rounded-full">
            <SettingsIcon size={20} />
        </a>
    </div>
</header>
