<script lang="ts">
    import { fade, scale } from "svelte/transition";

    interface Props {
        show: boolean;
        title: string;
        message: string;
        confirmText?: string;
        cancelText?: string;
        type?: "confirm" | "info" | "danger" | "loading";
        onConfirm?: () => void;
        onCancel?: () => void;
        children?: any;
    }

    let {
        show = $bindable(false),
        title,
        message,
        confirmText = "Ya",
        cancelText = "Batal",
        type = "confirm",
        onConfirm,
        onCancel,
        children,
    }: Props = $props();

    function handleConfirm() {
        if (onConfirm) onConfirm();
        show = false;
    }

    function handleCancel() {
        if (onCancel) onCancel();
        show = false;
    }
</script>

{#if show}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-5 bg-slate-900/40"
        in:fade={{ duration: 150 }}
        out:fade={{ duration: 150 }}
    >
        <!-- Backdrop -->
        <button
            class="absolute inset-0 w-full h-full cursor-default"
            aria-label="Tutup"
            onclick={handleCancel}
        ></button>

        <div
            class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden border border-slate-200"
            in:scale={{ duration: 150, start: 0.95 }}
            out:scale={{ duration: 150, start: 0.95 }}
        >
            <div
                class={`p-6 text-center space-y-4 pt-8 ${type === "loading" ? "pb-8" : ""}`}
            >
                {#if type === "loading"}
                    <div class="flex justify-center mb-4">
                        <div
                            class="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"
                        ></div>
                    </div>
                {/if}
                <h3
                    class="text-xl font-bold text-slate-900 tracking-tight leading-none"
                >
                    {title}
                </h3>
                <p class="text-sm font-medium text-slate-500 leading-relaxed">
                    {message}
                </p>

                {#if children}
                    {@render children()}
                {/if}
            </div>

            {#if type !== "loading"}
                <div
                    class="grid gap-px bg-slate-200 border-t border-slate-200 mt-2 {type ===
                    'info'
                        ? 'grid-cols-1'
                        : 'grid-cols-2'}"
                >
                    {#if type !== "info"}
                        <!-- Keep raw buttons here for the grid-cell layout which doesn't suit the Button component -->
                        <button
                            onclick={handleCancel}
                            class="p-4 bg-white text-slate-500 font-bold text-sm transition-colors hover:bg-slate-50 active:bg-slate-100 uppercase tracking-widest"
                        >
                            {cancelText}
                        </button>
                        <button
                            onclick={handleConfirm}
                            class="p-4 bg-white font-bold text-sm transition-colors uppercase tracking-widest
                            {type === 'danger'
                                ? 'text-red-600 hover:bg-red-50 active:bg-red-100'
                                : 'text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100'}"
                        >
                            {confirmText}
                        </button>
                    {:else}
                        <button
                            onclick={handleConfirm}
                            class="p-4 bg-white font-bold text-sm text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100 transition-colors uppercase tracking-widest w-full"
                        >
                            {confirmText}
                        </button>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
{/if}
