export function formatCurrency(val: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(val);
}

export async function apiCall(action: string, payload: any) {
    const response = await fetch("/api", {
        method: "POST",
        body: JSON.stringify({ action, payload }),
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Terjadi kesalahan pada server");
    }

    return await response.json();
}

export function totalQuantity(items: { quantity: number }[]) {
    return items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;
}
