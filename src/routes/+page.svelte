<script lang="ts">
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { ShoppingBag } from "lucide-svelte";
    import { ui } from "$lib/ui.svelte";

    onMount(() => {
        // Hide header elements for pure splash experience
        ui.setPage({
            title: "",
            subtitle: "",
            showBack: false,
        });

        // Auto redirect after 2 seconds
        const timer = setTimeout(() => {
            goto("/order");
        }, 2000);

        return () => clearTimeout(timer);
    });
</script>

<div class="flex flex-col items-center justify-center min-h-[90vh] bg-slate-50">
    <!-- Pure Icon Splash -->
    <div
        in:scale={{ duration: 1000, start: 0.8, opacity: 0 }}
        class="w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-200 relative"
    >
        <div
            class="absolute inset-0 bg-emerald-400 rounded-[2.5rem] animate-ping opacity-20"
        ></div>
        <ShoppingBag size={64} class="text-white" strokeWidth={1.5} />
    </div>
</div>

<style>
    /* Splash screen specific styles */
</style>
