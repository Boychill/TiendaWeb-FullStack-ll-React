import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types/product';

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number, options?: { size?: string; color?: string }) => void;
    removeFromCart: (productId: string, options?: { size?: string; color?: string }) => void;
    clearCart: () => void;
    total: number;
    subtotal: number;
    shippingCost: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setCart(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, quantity: number, options?: { size?: string; color?: string }) => {
        setCart(prev => {
            const existingItemIndex = prev.findIndex(item =>
                item.id === product.id &&
                item.variants?.size === options?.size &&
                item.variants?.color === options?.color
            );

            if (existingItemIndex > -1) {
                const newCart = [...prev];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            }

            return [...prev, {
                ...product,
                quantity,
                // Override variants with selected options if any, or keep default
                variants: {
                    ...product.variants,
                    ...(options?.size ? { size: options.size } : {}),
                    ...(options?.color ? { color: options.color } : {})
                }
            }];
        });
    };

    const removeFromCart = (productId: string, options?: { size?: string; color?: string }) => {
        setCart(prev => prev.filter(item => !(
            item.id === productId &&
            (options?.size ? item.variants?.size === options.size : true) &&
            (options?.color ? item.variants?.color === options.color : true)
        )));
    };

    const clearCart = () => setCart([]);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const FREE_SHIPPING_THRESHOLD = 50000;
    const FLAT_SHIPPING_RATE = 3500;

    // Shipping logic: free if subtotal > threshold, else flat rate. If cart empty, 0.
    const shippingCost = cart.length === 0 ? 0 : (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE);

    const total = subtotal + shippingCost;
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total, subtotal, shippingCost, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
