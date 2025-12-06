
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';
import { Product } from '../types';

const ProductRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID if editing
  const { addProduct, updateProduct, categories, products } = useInventory();
  
  const [name, setName] = useState('');
  const [largeCategory, setLargeCategory] = useState('');
  const [mediumCategory, setMediumCategory] = useState('');
  const [smallCategory, setSmallCategory] = useState('');
  const [price, setPrice] = useState('');
  const [initialStock, setInitialStock] = useState('');
  const [memo, setMemo] = useState('');

  const isEditing = Boolean(id);

  // Load product data if editing
  useEffect(() => {
    if (isEditing && id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setName(product.name);
        setLargeCategory(product.category);
        setMediumCategory(product.mediumCategory || '');
        setSmallCategory(product.smallCategory || '');
        setPrice(product.price ? product.price.toString() : '');
        setInitialStock(product.stock.toString());
        // Memo field is not currently in Product type, but if it were, we'd load it here
      }
    }
  }, [isEditing, id, products]);

  // Extract categories for datalists
  const largeCategories = useMemo(() => categories.filter(c => c.type === '大分類'), [categories]);
  const mediumCategories = useMemo(() => categories.filter(c => c.type === '中分類'), [categories]);
  const smallCategories = useMemo(() => categories.filter(c => c.type === '小分類'), [categories]);

  const handleRegister = () => {
    if (!name) {
      alert('商品名を入力してください');
      return;
    }

    const stock = Number(initialStock) || 0;
    const priceValue = price ? Number(price) : undefined;
    
    // Determine status based on stock
    let status: Product['status'] = 'In Stock';
    if (stock === 0) status = 'Out of Stock';
    else if (stock < 10) status = 'Low Stock';

    const productData: Product = {
      id: isEditing && id ? id : Date.now().toString(),
      name: name,
      category: largeCategory || '未分類',
      mediumCategory: mediumCategory || undefined,
      smallCategory: smallCategory || undefined,
      imageUrl: 'https://via.placeholder.com/200?text=No+Image', // Default placeholder
      stock: stock,
      status: status,
      price: priceValue
    };

    if (isEditing) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    
    navigate('/inventory');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-6">
      <Header title={isEditing ? "商品編集" : "商品登録"} showBack={true} />
      
      <main className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="product-name">商品名</label>
          <input 
            className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base" 
            id="product-name" 
            placeholder="商品名を入力"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="category1">大分類</label>
          <input 
            className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base dark:text-white" 
            id="category1" 
            list="large-category-list" 
            placeholder="選択または入力"
            value={largeCategory}
            onChange={(e) => setLargeCategory(e.target.value)}
          />
          <datalist id="large-category-list">
            {largeCategories.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="medium_category">中分類</label>
          <input 
            className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base dark:text-white" 
            id="medium_category" 
            list="medium-category-list"
            placeholder="選択または入力"
            value={mediumCategory}
            onChange={(e) => setMediumCategory(e.target.value)}
          />
          <datalist id="medium-category-list">
            {mediumCategories.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="small_category">小分類</label>
          <input 
            className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base dark:text-white" 
            id="small_category" 
            list="small-category-list"
            placeholder="選択または入力"
            value={smallCategory}
            onChange={(e) => setSmallCategory(e.target.value)}
          />
           <datalist id="small-category-list">
            {smallCategories.map(c => <option key={c.id} value={c.name} />)}
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="price">価格</label>
          <div className="relative">
            <input 
              className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base text-right pr-12 dark:text-white" 
              id="price" 
              placeholder="0" 
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">円</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="initial_stock">初期在庫数</label>
          <div className="relative">
            <input 
              className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base text-right pr-12 dark:text-white" 
              id="initial_stock" 
              placeholder="0" 
              type="number"
              value={initialStock}
              onChange={(e) => setInitialStock(e.target.value)}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">点</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="memo">メモ</label>
          <textarea 
            className="flex w-full min-w-0 flex-1 resize-y rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base dark:text-white" 
            id="memo" 
            placeholder="商品に関するメモを入力" 
            rows={4}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          ></textarea>
        </div>
      </main>

      <div className="p-4 bg-background-light dark:bg-background-dark">
        <button 
          onClick={handleRegister}
          className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          {isEditing ? "更新する" : "登録する"}
        </button>
      </div>
    </div>
  );
};

export default ProductRegistrationPage;
