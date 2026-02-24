<script lang="ts">
    import { User, NotebookPen, Search } from "lucide-svelte";

    type StringIcon = "user" | "note" | "search";

    interface Props {
        id?: string;
        type?: string;
        placeholder?: string;
        value?: string;
        /** Pass a predefined string ("user"|"note"|"search") or any Svelte icon component */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon?: StringIcon | any;
        class?: string;
        onfocus?: (e: FocusEvent) => void;
    }

    let {
        id,
        type = "text",
        placeholder,
        value = $bindable(),
        icon,
        class: className = "",
        onfocus,
    }: Props = $props();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stringIcons: Record<StringIcon, any> = {
        user: User,
        note: NotebookPen,
        search: Search,
    };

    const Icon = $derived(
        !icon
            ? null
            : typeof icon === "string"
              ? stringIcons[icon as StringIcon]
              : icon,
    );
</script>

<div
    class="input-pos flex items-center relative group px-0! h-auto! min-h-14 {className} focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
>
    {#if Icon}
        <div class="pl-4 flex-none flex items-center justify-center">
            <Icon
                size={20}
                class="text-emerald-600 group-focus-within:text-emerald-500 transition-colors"
                strokeWidth={2.5}
            />
        </div>
    {/if}
    <input
        {id}
        {type}
        {placeholder}
        bind:value
        {onfocus}
        class="bg-transparent border-none outline-none w-full h-14 {Icon
            ? 'pl-3'
            : 'pl-4'} pr-4 text-base text-slate-900 placeholder-slate-400"
    />
</div>

<style>
    input {
        width: 100%;
    }
</style>
