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

<header class="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-50">
    <div class="max-w-md mx-auto">
        <div class="flex items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
                {#if showBack}
                    <button
                        onclick={() => history.back()}
                        class="w-9 h-9 flex-none flex items-center justify-center rounded-lg bg-slate-50 text-slate-900 active:scale-95 transition-all hover:bg-slate-100 border border-slate-200 shadow-sm"
                    >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                    </button>
                {/if}
                <div class="min-w-0 flex flex-col justify-center">
                    {#if subtitle}
                        <p
                            class="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate leading-tight mb-0.5"
                        >
                            {subtitle}
                        </p>
                    {/if}
                    <h1
                        class="text-lg font-black text-slate-900 tracking-tight leading-none truncate"
                    >
                        {title}
                    </h1>
                </div>
            </div>

            <div class="flex items-center gap-2.5 flex-none">
                {#if pending !== null}
                    <div
                        class="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200 shadow-sm"
                    >
                        <div
                            class="flex items-center px-1.5 gap-1.5"
                            title="Menunggu"
                        >
                            <span
                                class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
                            ></span>
                            <span class="text-xs font-bold text-slate-700"
                                >{pending}</span
                            >
                        </div>
                        <div class="w-px h-3 bg-slate-300 mx-0.5"></div>
                        <div
                            class="flex items-center px-1.5 gap-1.5"
                            title="Selesai"
                        >
                            <span class="w-1.5 h-1.5 rounded-full bg-slate-400"
                            ></span>
                            <span class="text-xs font-bold text-slate-700"
                                >{completed}</span
                            >
                        </div>
                    </div>
                {/if}

                <button
                    onclick={() => goto("/settings")}
                    class="w-9 h-9 flex-none flex items-center justify-center rounded-lg bg-emerald-600 text-white active:scale-95 transition-colors hover:bg-emerald-700 shadow-md border border-emerald-500"
                >
                    <SettingsIcon size={18} strokeWidth={2} />
                </button>
            </div>
        </div>
    </div>
</header>
