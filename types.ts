export interface Product {
  id: string;
  name: string;
  category: string;
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
}

export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
  avatarUrl: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
