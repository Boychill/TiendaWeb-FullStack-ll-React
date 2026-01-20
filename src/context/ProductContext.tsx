import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import initialProductsData from '../data/products.json';

// Ensure data matches Type
const initialProducts = initialProductsData as Product[];

interface ProductContextType {
    products: Product[];
    filterByCategory: (category: string) => void;
    getProductById: (id: string) => Product | undefined;
    filteredProducts: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
        // Load products from JSON (simulate API)
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            try {
                const parsed = JSON.parse(storedProducts);
                setProducts(parsed);
                setFilteredProducts(parsed);
            } catch (e) {
                console.error("Failed to parse stored products", e);
                setProducts(initialProducts);
                setFilteredProducts(initialProducts);
            }
        } else {
            setProducts(initialProducts);
            setFilteredProducts(initialProducts);
            localStorage.setItem('products', JSON.stringify(initialProducts));
        }
    }, []);

    const filterByCategory = (category: string) => {
        if (category === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === category));
        }
    };

    const getProductById = (id: string) => {
        return products.find(p => p.id === id);
    };

    return (
        <ProductContext.Provider value={{ products, filterByCategory, getProductById, filteredProducts }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
