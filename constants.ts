import { Product, Transaction, User, Category } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'オーガニックコットンTシャツ',
    category: '衣類',
    mediumCategory: 'トップス',
    smallCategory: 'Tシャツ',
    imageUrl: 'https://picsum.photos/200/200?random=1',
    stock: 50,
    status: 'In Stock'
  },
  {
    id: '2',
    name: 'リネンブレンドパンツ',
    category: '衣類',
    mediumCategory: 'ボトムス',
    smallCategory: 'パンツ',
    imageUrl: 'https://picsum.photos/200/200?random=2',
    stock: 5,
    status: 'Low Stock'
  },
  {
    id: '3',
    name: 'シルクスカーフ',
    category: '服飾雑貨',
    mediumCategory: '小物',
    smallCategory: 'スカーフ',
    imageUrl: 'https://picsum.photos/200/200?random=3',
    stock: 0,
    status: 'Out of Stock'
  },
  {
    id: '4',
    name: 'デニムジャケット',
    category: '衣類',
    mediumCategory: 'アウター',
    smallCategory: 'ジャケット',
    imageUrl: 'https://picsum.photos/200/200?random=4',
    stock: 23,
    status: 'In Stock'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    productName: 'オーガニックコットンTシャツ',
    user: '田中',
    amount: 50,
    date: '2023/10/27 14:30',
    type: 'in'
  },
  {
    id: '2',
    productName: 'リネンブレンドパンツ',
    user: '鈴木',
    amount: -15,
    date: '2023/10/27 10:15',
    type: 'out',
    destination: '駅前店'
  },
  {
    id: '3',
    productName: 'オーガニックコットンTシャツ',
    user: '佐藤',
    amount: -5,
    date: '2023/10/26 18:00',
    type: 'out',
    destination: 'イベント会場A'
  },
  {
    id: '4',
    productName: 'デニムジャケット',
    user: '田中',
    amount: 20,
    date: '2023/10/26 09:00',
    type: 'in'
  }
];

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: '田中 圭',
    role: '管理者',
    email: 'tanaka.kei@example.com',
    avatarUrl: 'https://picsum.photos/200/200?random=10'
  },
  {
    id: '2',
    name: '鈴木 一郎',
    role: '在庫登録のみ',
    email: 'suzuki.ichiro@example.com',
    avatarUrl: 'https://picsum.photos/200/200?random=11'
  },
  {
    id: '3',
    name: '佐藤 花子',
    role: '一般',
    email: 'sato.hanako@example.com',
    avatarUrl: 'https://picsum.photos/200/200?random=12'
  },
  {
    id: '4',
    name: '高橋 結衣',
    role: '一般',
    email: 'takahashi.yui@example.com',
    avatarUrl: 'https://picsum.photos/200/200?random=13'
  },
  {
    id: '5',
    name: '渡辺 健',
    role: '在庫登録のみ',
    email: 'watanabe.ken@example.com',
    avatarUrl: 'https://picsum.photos/200/200?random=14'
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: '飲料', type: '大分類', icon: 'local_drink' },
  { id: '2', name: '食品', type: '大分類', icon: 'restaurant' },
  { id: '3', name: '備品', type: '大分類', icon: 'inventory_2' },
  { id: '4', name: '機材', type: '大分類', icon: 'build' },
  { id: '5', name: '衣類', type: '大分類', icon: 'checkroom' },
  { id: '6', name: '服飾雑貨', type: '大分類', icon: 'styler' },
  { id: '7', name: 'トップス', type: '中分類', icon: 'apparel' },
  { id: '8', name: 'ボトムス', type: '中分類', icon: 'trousers' },
  { id: '9', name: 'アウター', type: '中分類', icon: 'checkroom' },
  { id: '10', name: 'Tシャツ', type: '小分類', icon: 'checkroom' },
  { id: '11', name: 'パンツ', type: '小分類', icon: 'trousers' },
];