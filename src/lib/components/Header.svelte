<script lang="ts">
    import { Settings as SettingsIcon, ChevronLeft } from "lucide-svelte";
    import { goto } from "$app/navigation";

    let {
        title = "Pesan Degan",
        subtitle = "",
        pending = null,
        completed = null,
        showBack = false,
    } = $props();
</script>

<header
    class="bg-white border-b-4 border-slate-950 px-6 pt-10 pb-8 sticky top-0 z-50"
>
    <div class="max-w-md mx-auto">
        <div class="flex justify-between items-start mb-6">
            <div class="flex items-center gap-4">
                {#if showBack}
                    <button
                        onclick={() => history.back()}
                        class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-950 border-2 border-slate-200 shadow-sm active:scale-90 transition-all hover:bg-slate-100"
                    >
                        <ChevronLeft size={24} strokeWidth={4} />
                    </button>
                {/if}
                <div class="space-y-1">
                    <h1
                        class="text-3xl font-black text-slate-950 tracking-tighter uppercase leading-none"
                    >
                        {title}
                    </h1>
                    <p
                        class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]"
                    >
                        {subtitle}
                    </p>
                </div>
            </div>

            <button
                onclick={() => goto("/settings")}
                class="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-950 border-2 border-slate-200 shadow-sm active:scale-90 transition-all hover:bg-slate-200"
            >
                <SettingsIcon size={24} strokeWidth={3} />
            </button>
        </div>

        {#if pending !== null}
            <div class="flex gap-4 mt-8">
                <div
                    class="flex-1 bg-slate-950 p-5 rounded-[1.5rem] border-2 border-slate-800 shadow-xl"
                >
                    <p
                        class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                    >
                        Menunggu
                    </p>
                    <div class="flex items-center justify-between">
                        <span
                            class="text-3xl font-black text-white font-mono leading-none"
                            >{pending}</span
                        >
                        <div
                            class="w-2 h-2 rounded-full bg-slate-400 animate-pulse"
                        ></div>
                    </div>
                </div>
                <div
                    class="flex-1 bg-white p-5 rounded-[1.5rem] border-2 border-slate-950 shadow-md"
                >
                    <p
                        class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2"
                    >
                        Selesai
                    </p>
                    <div class="flex items-center justify-between">
                        <span
                            class="text-3xl font-black text-slate-950 font-mono leading-none"
                            >{completed}</span
                        >
                        <div class="w-2 h-2 rounded-full bg-slate-950"></div>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</header>
