<script lang="ts">
	import "../app.css";
	import { page } from "$app/state";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/Header.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import PWAPrompt from "$lib/components/PWAPrompt.svelte";
	import { ui } from "$lib/state/ui.svelte";

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
	{#if page.url.pathname !== "/"}
		<div class="sticky top-0 z-30">
			<Header
				title={ui.title}
				subtitle={ui.subtitle}
				pending={ui.pending}
				completed={ui.completed}
				showBack={ui.showBack}
			/>
		</div>
	{/if}

	<main class="grow pb-20">
		{@render children()}
	</main>

	{#if page.url.pathname !== "/"}
		<BottomNav />
	{/if}
</div>

<PWAPrompt />

<!-- Global Loading Modal -->
<Modal
	show={ui.loading.show}
	title={ui.loading.title}
	message={ui.loading.message}
	type="loading"
/>

<style>
	:global(body) {
		touch-action: manipulation;
		background-color: #f1f5f9;
	}
</style>
