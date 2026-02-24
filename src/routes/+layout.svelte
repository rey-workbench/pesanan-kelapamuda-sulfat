<script lang="ts">
	import "../app.css";
	import BottomNav from "$lib/components/BottomNav.svelte";

	let { children } = $props();
</script>

<div
	class="max-w-md mx-auto min-h-screen bg-slate-50 relative flex flex-col md:border-x md:border-slate-200"
>
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
