export interface Order {
    id?: number;
    customerName: string;
    quantity: number;
    price: number;
    total: number;
    type: string;
    notes: string;
    date: string;
    status: 'pending' | 'completed' | 'cancelled';
    createdAt: number;
}

export interface ProductType {
    name: string;
    price: number;
}

export interface AppSettings {
    products: ProductType[];
    storeName: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
    storeName: 'Pesan Degan',
    products: [
        { name: 'Biasa', price: 10000 },
        { name: 'Ijo', price: 15000 },
        { name: 'Bakar', price: 20000 }
    ]
};
