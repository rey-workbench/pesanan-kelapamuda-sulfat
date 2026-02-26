<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { ui } from "$lib/ui.svelte";

    let videoEl: HTMLVideoElement | undefined = $state();
    let isIOS = $state(false);

    function startRedirect(delay: number = 3000) {
        setTimeout(() => goto("/order"), delay);
    }

    onMount(() => {
        ui.setPage({ title: "", subtitle: "", showBack: false });

        isIOS =
            /iphone|ipad|ipod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        if (isIOS) {
            startRedirect(3000);
        }
    });

    function handleEnd() {
        goto("/order");
    }
</script>

{#if isIOS}
    <div class="icon-splash">
        <img src="/icon-512.png" alt="Logo" class="splash-icon" />
    </div>
{:else}
    <!-- svelte-ignore a11y_media_has_caption -->
    <div class="splash-wrapper">
        <video
            bind:this={videoEl}
            src="/splash.mp4"
            autoplay
            playsinline
            muted
            class="splash-video"
            onended={handleEnd}
            onerror={() => startRedirect(3000)}
        ></video>
    </div>
{/if}

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

    .icon-splash {
        position: fixed;
        inset: 0;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .splash-icon {
        width: 240px;
        height: 240px;
        object-fit: contain;
        animation: pop-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes pop-in {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1.1);
        }
    }
</style>
