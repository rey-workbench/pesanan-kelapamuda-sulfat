<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { ui } from "$lib/ui.svelte";

    let videoEl: HTMLVideoElement;
    let isIOS = false;

    onMount(() => {
        ui.setPage({ title: "", subtitle: "", showBack: false });

        // Deteksi iOS (iPhone, iPad, iPod)
        isIOS =
            /iphone|ipad|ipod/i.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        if (isIOS) {
            // iOS: tampilkan icon, redirect setelah 2.5 detik
            setTimeout(() => goto("/order"), 2500);
        } else {
            // Android/Desktop: putar video dengan audio
            videoEl?.play().catch(() => goto("/order"));
        }
    });

    function onVideoEnded() {
        goto("/order");
    }

    function onVideoError() {
        setTimeout(() => goto("/order"), 3000);
    }
</script>

{#if isIOS}
    <!-- iOS fallback: tampilkan icon -->
    <div class="icon-splash">
        <img
            src="/icon-512.png"
            alt="Es Kelapa Muda Sulfat"
            class="splash-icon"
        />
    </div>
{:else}
    <!-- Android / Desktop: putar video -->
    <div class="splash-wrapper">
        <!-- svelte-ignore a11y-media-has-caption -->
        <video
            bind:this={videoEl}
            src="/splash.mp4"
            playsinline
            class="splash-video"
            on:ended={onVideoEnded}
            on:error={onVideoError}
        ></video>
    </div>
{/if}

<style>
    /* Android/Desktop: fullscreen video */
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

    /* iOS: icon splash */
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
        width: 160px;
        height: 160px;
        object-fit: contain;
        animation: pop-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    @keyframes pop-in {
        from {
            opacity: 0;
            transform: scale(0.7);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
