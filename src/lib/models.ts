export type OrderOption = string;

export interface OrderItem {
    type: string;
    quantity: number;
    price: number;
    options: OrderOption[]; // multi-select options
}

export interface Order {
    id?: number;
    customerName: string;
    items: OrderItem[];
    total: number;
    cash: number;
    change: number;
    date: string;
    status: 'pending' | 'completed' | 'picked_up' | 'cancelled';
    catatan: string;
    createdAt: number;
}

export interface ProductType {
    name: string;
    price: number;
}

export interface AppSettings {
    products: ProductType[];
    options: string[];
    storeName: string;
    notificationSound?: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
    storeName: 'Pesan Degan',
    products: [],
    options: ['Murni', 'Gula', 'Es', 'Gula & Es'],
    notificationSound: 'notification/masuk.mp3'
};
