<script lang="ts">
	import "../app.css";
	import BottomNav from "$lib/components/BottomNav.svelte";

	let { children } = $props();
</script>

<div class="max-w-md mx-auto min-h-screen bg-emerald-50 relative flex flex-col">
	<main class="flex-grow">
		{@render children()}
	</main>

	<BottomNav />
</div>

<style>
	:global(body) {
		touch-action: manipulation;
	}
</style>
