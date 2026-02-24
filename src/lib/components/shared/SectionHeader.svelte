<script lang="ts">
    let { title, class: className = "" } = $props<{
        title: string;
        class?: string;
    }>();
</script>

<h2
    class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1 {className}"
>
    {title}
</h2>
