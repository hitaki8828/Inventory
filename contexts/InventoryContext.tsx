import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Product, Transaction, Category, CategoryType } from '../types';
import { MOCK_PRODUCTS, MOCK_TRANSACTIONS, MOCK_CATEGORIES } from '../constants';

interface InventoryContextType {
  products: Product[];
  transactions: Transaction[];
  categories: Category[];
  updateStock: (productName: string, amount: number, type: 'in' | 'out', destination?: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  addCategory: (name: string, type: CategoryType) => void;
  deleteCategory: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or fallback to MOCK data
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('inventory_products');
      return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
    } catch (e) {
      console.error("Failed to load products from local storage", e);
      return MOCK_PRODUCTS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('inventory_transactions');
      return saved ? JSON.parse(saved) : MOCK_TRANSACTIONS;
    } catch (e) {
      console.error("Failed to load transactions from local storage", e);
      return MOCK_TRANSACTIONS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('inventory_categories');
      return saved ? JSON.parse(saved) : MOCK_CATEGORIES;
    } catch (e) {
      console.error("Failed to load categories from local storage", e);
      return MOCK_CATEGORIES;
    }
  });

  // Persist state to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inventory_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('inventory_categories', JSON.stringify(categories));
  }, [categories]);

  const updateStock = (productName: string, amount: number, type: 'in' | 'out', destination?: string) => {
    // Update products
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.name === productName) {
          const change = type === 'in' ? amount : -amount;
          const newStock = Math.max(0, product.stock + change);
          
          let newStatus: Product['status'] = 'In Stock';
          if (newStock === 0) newStatus = 'Out of Stock';
          else if (newStock < 10) newStatus = 'Low Stock';

          return { ...product, stock: newStock, status: newStatus };
        }
        return product;
      });
    });

    // Add transaction record
    const newTransaction: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      productName: productName,
      user: '現在のユーザー', // Placeholder for current user
      amount: type === 'in' ? amount : -amount,
      date: new Date().toLocaleString('ja-JP', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      type: type,
      destination: destination
    };

    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);

    // Initial stock history
    if (product.stock > 0) {
       const newTransaction: Transaction = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        productName: product.name,
        user: '現在のユーザー', // Placeholder for current user
        amount: product.stock,
        date: new Date().toLocaleString('ja-JP', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        type: 'in',
        destination: '初期在庫' // Optional note
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const addCategory = (name: string, type: CategoryType) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name,
      type: type,
      icon: 'category' // Default icon
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return (
    <InventoryContext.Provider value={{ products, transactions, categories, updateStock, addProduct, updateProduct, addCategory, deleteCategory }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};