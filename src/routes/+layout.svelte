<script lang="ts">
	import "../app.css";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/Header.svelte";
	import { ui } from "$lib/ui.svelte";

	let { data, children } = $props();

	// Sync global title with store name from settings
	$effect(() => {
		if (data.settings?.storeName) {
			// Only override if it's the default or specific pages want to use store name as title
			if (ui.title === "Pesan Degan") {
				ui.title = data.settings.storeName;
			}
		}
	});
</script>

<div
	class="max-w-md mx-auto min-h-screen bg-slate-50 relative flex flex-col md:border-x md:border-slate-200"
>
	<div class="sticky top-0 z-30">
		<Header
			title={ui.title}
			subtitle={ui.subtitle}
			pending={ui.pending}
			completed={ui.completed}
			showBack={ui.showBack}
		/>
	</div>

	<main class="flex-grow pb-20">
		{@render children()}
	</main>

	<BottomNav />
</div>

<style>
	:global(body) {
		touch-action: manipulation;
		background-color: #f1f5f9;
	}
</style>
