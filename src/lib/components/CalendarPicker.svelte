<script lang="ts">
    import { ChevronLeft, ChevronRight, X } from "lucide-svelte";

    export let value: string = "";
    export let show: boolean = false;
    export let onClose: () => void;
    export let onSelect: (date: string) => void;

    let currentDate = new Date();

    $: currentMonth = currentDate.getMonth();
    $: currentYear = currentDate.getFullYear();
    $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    $: firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    function prevMonth() {
        currentDate = new Date(currentYear, currentMonth - 1, 1);
    }

    function nextMonth() {
        currentDate = new Date(currentYear, currentMonth + 1, 1);
    }

    function selectDate(d: number) {
        const mm = String(currentMonth + 1).padStart(2, "0");
        const dd = String(d).padStart(2, "0");
        const dateStr = `${currentYear}-${mm}-${dd}`;
        onSelect(dateStr);
        onClose();
    }
</script>

{#if show}
    <div
        class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        onclick={onClose}
    >
        <div
            class="bg-white rounded-3xl w-full max-w-[340px] overflow-hidden shadow-2xl"
            onclick={(e) => e.stopPropagation()}
        >
            <div
                class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80"
            >
                <h3 class="font-bold text-slate-800 text-lg">Pilih Tanggal</h3>
                <button onclick={onClose}>
                    <X size={20} strokeWidth={3} />
                </button>
            </div>

            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <button onclick={prevMonth}>
                        <ChevronLeft size={20} strokeWidth={3} />
                    </button>

                    <div class="font-black text-[17px]">
                        <span>{monthNames[currentMonth]}</span>
                        <span> {currentYear}</span>
                    </div>

                    <button onclick={nextMonth}>
                        <ChevronRight size={20} strokeWidth={3} />
                    </button>
                </div>

                <div class="grid grid-cols-7 gap-1 mb-3">
                    {#each dayNames as d}
                        <div
                            class="text-center text-[10px] font-bold text-slate-400"
                        >
                            {d}
                        </div>
                    {/each}
                </div>

                <div class="grid grid-cols-7 gap-1">
                    {#each Array(firstDayOfMonth) as _}
                        <div class="h-10"></div>
                    {/each}

                    {#each Array(daysInMonth) as _, i}
                        {@const day = i + 1}
                        {@const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`}
                        {@const isSelected = value === dateStr}

                        <button
                            class="h-10 rounded-xl text-sm font-bold
                        {isSelected
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-700 hover:bg-slate-100'}"
                            onclick={() => selectDate(day)}
                        >
                            {day}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}
