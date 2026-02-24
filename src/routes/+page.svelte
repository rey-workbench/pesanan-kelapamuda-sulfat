<script lang="ts">
    import { onMount } from "svelte";
    import { scale } from "svelte/transition";
    import { goto } from "$app/navigation";
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
        class="w-full h-full flex items-center justify-center relative"
    >
        <img
            src="/icon-512.png"
            alt="Logo Es Kelapa Muda Sulfat"
            class="w-full h-full object-contain drop-shadow-2xl"
        />
    </div>
</div>

<style>
    /* Splash screen specific styles */
</style>
