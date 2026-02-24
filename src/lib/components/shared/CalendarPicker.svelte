<script lang="ts">
    import { ChevronLeft, ChevronRight, X } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let {
        value = $bindable(""),
        show = $bindable(false),
        onClose,
        onSelect,
    } = $props<{
        value: string;
        show: boolean;
        onClose: () => void;
        onSelect: (date: string) => void;
    }>();

    let currentDate = $state(new Date());

    let currentMonth = $derived(currentDate.getMonth());
    let currentYear = $derived(currentDate.getFullYear());
    let daysInMonth = $derived(
        new Date(currentYear, currentMonth + 1, 0).getDate(),
    );
    let firstDayOfMonth = $derived(
        new Date(currentYear, currentMonth, 1).getDay(),
    );

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
        onSelect(`${currentYear}-${mm}-${dd}`);
        onClose();
    }
</script>

{#if show}
    <div
        class="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        onclick={onClose}
        onkeydown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabindex="-1"
    >
        <div
            class="bg-white rounded-3xl w-full max-w-[340px] overflow-hidden shadow-2xl"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
        >
            <!-- Header -->
            <div
                class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80"
            >
                <h3 class="font-bold text-slate-800 text-lg">Pilih Tanggal</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    class="w-8 h-8 p-0 rounded-lg"
                    onclick={onClose}
                >
                    <X size={18} strokeWidth={3} />
                </Button>
            </div>

            <div class="p-5">
                <!-- Month navigation -->
                <div class="flex justify-between items-center mb-5">
                    <Button
                        variant="secondary"
                        size="sm"
                        class="w-8 h-8 p-0 rounded-lg"
                        onclick={prevMonth}
                    >
                        <ChevronLeft size={18} strokeWidth={3} />
                    </Button>

                    <div class="font-black text-[17px]">
                        {monthNames[currentMonth]}
                        {currentYear}
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        class="w-8 h-8 p-0 rounded-lg"
                        onclick={nextMonth}
                    >
                        <ChevronRight size={18} strokeWidth={3} />
                    </Button>
                </div>

                <!-- Day names -->
                <div class="grid grid-cols-7 gap-1 mb-2">
                    {#each dayNames as d}
                        <div
                            class="text-center text-[10px] font-bold text-slate-400"
                        >
                            {d}
                        </div>
                    {/each}
                </div>

                <!-- Day grid — raw buttons intentional: custom color per selected state, no fixed variant -->
                <div class="grid grid-cols-7 gap-1">
                    {#each Array(firstDayOfMonth) as _}
                        <div class="h-10"></div>
                    {/each}
                    {#each Array(daysInMonth) as _, i}
                        {@const day = i + 1}
                        {@const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`}
                        {@const isSelected = value === dateStr}
                        <button
                            class="h-10 rounded-xl text-sm font-bold transition-colors active:scale-95 {isSelected
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
