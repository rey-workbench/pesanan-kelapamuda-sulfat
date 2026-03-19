<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { ui } from "$lib/ui.svelte";

  function startRedirect(delay: number = 2000) {
    setTimeout(() => goto("/order"), delay);
  }

  onMount(() => {
    ui.setPage({ title: "", subtitle: "", showBack: false });
    startRedirect();
  });
</script>

<div class="splash-container">
  <div class="icon-wrapper">
    <img src="/icon-512.png" alt="Logo" class="splash-icon" />
  </div>
</div>

<style>
  .splash-container {
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at center, #ffffff 0%, #f1f5f9 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .icon-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-wrapper::before {
    content: "";
    position: absolute;
    width: 160px;
    height: 160px;
    background: rgba(34, 197, 94, 0.1);
    border-radius: 50%;
    filter: blur(20px);
    animation: glow 2s ease-in-out infinite;
  }

  .splash-icon {
    width: 120px;
    height: 120px;
    object-fit: contain;
    position: relative;
    z-index: 1;
    animation: reveal 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }

  @keyframes reveal {
    0% {
      opacity: 0;
      transform: scale(0.5) translateY(20px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes glow {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.8;
    }
  }
</style>
