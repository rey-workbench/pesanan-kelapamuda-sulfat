<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { ui } from "$lib/ui.svelte";

    let videoEl: HTMLVideoElement;

    onMount(() => {
        ui.setPage({ title: "", subtitle: "", showBack: false });
        videoEl?.play().catch(() => goto("/order"));
    });

    function onVideoEnded() {
        goto("/order");
    }

    function onVideoError() {
        setTimeout(() => goto("/order"), 3000);
    }
</script>

<div class="splash-wrapper">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
        bind:this={videoEl}
        src="/splash.mp4"
        autoplay
        playsinline
        muted
        class="splash-video"
        on:ended={onVideoEnded}
        on:error={onVideoError}
    ></video>
</div>

<style>
    .splash-wrapper {
        position: fixed;
        inset: 0;
        background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .splash-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
