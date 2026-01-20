export interface ProductVariant {
    color?: string;
    size?: string;
    material?: string;
    [key: string]: string | undefined;
}

export interface Product {
    id: string; // Changed to string to support more complex IDs if needed, or keep number if strict
    parentId?: string; // For variations matching a base product
    name: string;
    slug: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    stock: number;
    variants?: ProductVariant;
    featured?: boolean;
}

export interface CartItem extends Product {
    quantity: number;
}
