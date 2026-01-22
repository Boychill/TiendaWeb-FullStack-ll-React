import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/product';
import initialProductsData from '../data/products.json';

// Ensure data matches Type
const initialProducts = initialProductsData as Product[];

interface ProductContextType {
    products: Product[];
    filterByCategory: (category: string) => void;
    addProduct: (product: Product) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    getProductById: (id: string) => Product | undefined;
    filteredProducts: Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    useEffect(() => {
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

    const saveProducts = (newProducts: Product[]) => {
        setProducts(newProducts);
        setFilteredProducts(newProducts); // Reset filter to show all or handle filter re-apply if needed
        localStorage.setItem('products', JSON.stringify(newProducts));
    };

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

    const addProduct = (product: Product) => {
        const newProducts = [...products, product];
        saveProducts(newProducts);
    };

    const updateProduct = (updatedProduct: Product) => {
        const newProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
        saveProducts(newProducts);
    };

    const deleteProduct = (id: string) => {
        const newProducts = products.filter(p => p.id !== id);
        saveProducts(newProducts);
    };

    return (
        <ProductContext.Provider value={{
            products,
            filteredProducts,
            filterByCategory,
            getProductById,
            addProduct,
            updateProduct,
            deleteProduct
        }}>
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
