export interface Product {
  id: string;
  name: string;
  category: string; // 大分類
  mediumCategory?: string; // 中分類
  smallCategory?: string; // 小分類
  imageUrl: string;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

export interface Transaction {
  id: string;
  productName: string;
  user: string;
  amount: number;
  date: string;
  type: 'in' | 'out';
  destination?: string; // 出庫先
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
}

export type CategoryType = '大分類' | '中分類' | '小分類';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
}