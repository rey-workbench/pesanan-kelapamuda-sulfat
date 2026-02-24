<script lang="ts">
    let { pending = 0, completed = 0 } = $props();
</script>

<div class="px-6 -mt-8 mb-4">
    <div
        class="bg-white rounded-3xl p-5 shadow-xl flex justify-around text-center border border-emerald-50"
    >
        <div>
            <p class="text-[10px] uppercase font-bold text-emerald-600/50 mb-1">
                Menunggu
            </p>
            <p class="text-xl font-black text-emerald-950">{pending}</p>
        </div>
        <div class="w-[1px] bg-emerald-100"></div>
        <div>
            <p class="text-[10px] uppercase font-bold text-emerald-600/50 mb-1">
                Selesai
            </p>
            <p class="text-xl font-black text-emerald-950">{completed}</p>
        </div>
    </div>
</div>
