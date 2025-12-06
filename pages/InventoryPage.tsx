
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Product } from '../types';
import { useInventory } from '../contexts/InventoryContext';

export default function InventoryPage() {
  const navigate = useNavigate();
  const { products, categories, deleteProduct } = useInventory(); // Use data from Context
  const [largeCategory, setLargeCategory] = useState('');
  const [mediumCategory, setMediumCategory] = useState('');
  const [smallCategory, setSmallCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate available options dynamically combining configured categories and existing product data
  const largeCategoryOptions = useMemo(() => {
    const used = new Set(products.map(p => p.category).filter(Boolean));
    const configured = categories.filter(c => c.type === '大分類').map(c => c.name);
    return Array.from(new Set([...used, ...configured]));
  }, [products, categories]);

  const mediumCategoryOptions = useMemo(() => {
    const used = new Set(products.map(p => p.mediumCategory).filter(Boolean) as string[]);
    const configured = categories.filter(c => c.type === '中分類').map(c => c.name);
    return Array.from(new Set([...used, ...configured]));
  }, [products, categories]);

  const smallCategoryOptions = useMemo(() => {
    const used = new Set(products.map(p => p.smallCategory).filter(Boolean) as string[]);
    const configured = categories.filter(c => c.type === '小分類').map(c => c.name);
    return Array.from(new Set([...used, ...configured]));
  }, [products, categories]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (largeCategory && product.category !== largeCategory) return false;
      if (mediumCategory && product.mediumCategory !== mediumCategory) return false;
      if (smallCategory && product.smallCategory !== smallCategory) return false;
      return true;
    });
  }, [products, searchQuery, largeCategory, mediumCategory, smallCategory]);

  // Calculate Grand Total for Print View
  const grandTotal = useMemo(() => {
    return filteredProducts.reduce((sum, product) => {
      return sum + ((product.price || 0) * product.stock);
    }, 0);
  }, [filteredProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300); // Clear after animation
  };

  const handleAction = (type: 'in' | 'out') => {
    if (!selectedProduct) return;
    const targetPath = type === 'in' ? '/inbound' : '/outbound';
    navigate(targetPath, { state: { productName: selectedProduct.name } });
    closeModal();
  };

  const handleEdit = () => {
    if (!selectedProduct) return;
    navigate(`/product/edit/${selectedProduct.id}`);
    closeModal();
  };

  const handleDelete = () => {
    if (!selectedProduct) return;
    deleteProduct(selectedProduct.id);
    closeModal();
  };

  // Helper to join categories
  const getCategoryDisplay = (p: Product) => {
    return [p.category, p.mediumCategory, p.smallCategory].filter(Boolean).join(' > ');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24 relative print:bg-white print:pb-0 print:static print:h-auto print:overflow-visible">
      
      {/* Standard Header */}
      <Header 
        title="在庫" 
        rightAction={
          <div className="flex items-center gap-2">
            <button 
              className="flex items-center justify-center size-10 rounded-full text-primary hover:bg-primary/10 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                window.print();
              }}
            >
              <span className="material-symbols-outlined text-2xl">print</span>
            </button>
            <button 
              onClick={() => navigate('/product/new')}
              className="flex items-center justify-center px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-lg mr-1">add</span>
              登録
            </button>
          </div>
        }
      />
      
      <main className="flex-1 print:w-full">
        {/* Filters - Hidden in Print */}
        <div className="flex flex-col print:hidden">
            {/* Search Bar */}
             <div className="px-4 pt-3">
                <div className="relative flex w-full items-center">
                   <input
                      className="flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary h-11 pl-10 pr-10 text-base shadow-sm"
                      placeholder="商品名で検索"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                   <span className="material-symbols-outlined absolute left-3 text-gray-500 dark:text-gray-400">search</span>
                   {searchQuery && (
                     <button 
                       onClick={() => setSearchQuery('')}
                       className="absolute right-3 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                     >
                       <span className="material-symbols-outlined text-xl">cancel</span>
                     </button>
                   )}
                </div>
             </div>

            {/* Categories Pills */}
            <div className="flex gap-3 px-4 py-2 mt-2 overflow-x-auto no-scrollbar">
               {/* Large Category */}
               <div className={`relative flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 border shadow-sm active:scale-95 transition-transform ${largeCategory ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white'}`}>
                  <p className="text-sm font-medium leading-normal">{largeCategory || '大分類'}</p>
                  <span className="material-symbols-outlined text-base">expand_more</span>
                  <select 
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    value={largeCategory}
                    onChange={(e) => setLargeCategory(e.target.value)}
                  >
                    <option value="">すべて</option>
                    {largeCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>

               {/* Medium Category */}
               <div className={`relative flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 border shadow-sm active:scale-95 transition-transform ${mediumCategory ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white'}`}>
                  <p className="text-sm font-medium leading-normal">{mediumCategory || '中分類'}</p>
                  <span className="material-symbols-outlined text-base">expand_more</span>
                  <select 
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    value={mediumCategory}
                    onChange={(e) => setMediumCategory(e.target.value)}
                  >
                    <option value="">すべて</option>
                    {mediumCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               
               {/* Small Category */}
               <div className={`relative flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 border shadow-sm active:scale-95 transition-transform ${smallCategory ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white'}`}>
                  <p className="text-sm font-medium leading-normal">{smallCategory || '小分類'}</p>
                  <span className="material-symbols-outlined text-base">expand_more</span>
                   <select 
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    value={smallCategory}
                    onChange={(e) => setSmallCategory(e.target.value)}
                  >
                    <option value="">すべて</option>
                    {smallCategoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
            </div>
        </div>

        <div className="h-4 print:hidden"></div>

        {/* List View (Screen Only) */}
        <div className="flex flex-col bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 print:hidden">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center gap-4 px-4 min-h-[72px] py-3 justify-between border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                  <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
                    <p className="text-gray-900 dark:text-white text-base font-bold leading-tight truncate">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {getCategoryDisplay(product)}
                    </p>
                  </div>
                  <div className="shrink-0 text-right pl-4">
                    <p className="text-gray-900 dark:text-white text-lg font-bold leading-normal">{product.stock}<span className="text-sm font-normal text-gray-500 ml-1">点</span></p>
                  </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">該当する商品はありません</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">検索条件を変更するか、フィルターをクリアしてください。</p>
            </div>
          )}
        </div>

        {/* Table View (Print Only) */}
        <div className="hidden print:block p-8">
            <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">在庫一覧</h1>
                <p className="text-sm text-gray-600">発行日: {new Date().toLocaleDateString('ja-JP')}</p>
            </div>

            {filteredProducts.length > 0 ? (
              <table className="w-full text-sm text-left text-gray-700 border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-900">
                    <th className="py-2 px-1 font-bold w-[30%]">商品名</th>
                    <th className="py-2 px-1 font-bold w-[20%]">カテゴリー</th>
                    <th className="py-2 px-1 font-bold text-right w-[15%]">単価</th>
                    <th className="py-2 px-1 font-bold text-right w-[10%]">在庫数</th>
                    <th className="py-2 px-1 font-bold text-right w-[25%]">合計金額</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 break-inside-avoid">
                      <td className="py-2 px-1 align-middle font-medium text-gray-900">{product.name}</td>
                      <td className="py-2 px-1 align-middle text-xs text-gray-500">{getCategoryDisplay(product)}</td>
                      <td className="py-2 px-1 align-middle text-right">
                        {product.price ? `¥${product.price.toLocaleString()}` : '-'}
                      </td>
                      <td className="py-2 px-1 align-middle text-right">{product.stock}</td>
                      <td className="py-2 px-1 align-middle text-right">
                        {product.price ? `¥${(product.price * product.stock).toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-800 font-bold text-base text-gray-900">
                    <td colSpan={3} className="py-4 text-right">総計:</td>
                    <td colSpan={2} className="py-4 text-right text-xl">¥{grandTotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                該当する商品はありません
              </div>
            )}
             <div className="mt-8 text-right text-xs text-gray-400">
              にきや Inventory
            </div>
        </div>
      </main>

      {/* Action Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center print:hidden">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
           <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-transform animate-slide-up sm:animate-fade-in mx-auto">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mb-2 sm:hidden"></div>
                 
                 <div className="flex w-full gap-4 mb-2">
                    <div className="flex flex-col justify-center flex-1">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{getCategoryDisplay(selectedProduct)}</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-2">{selectedProduct.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-base">現在在庫: <span className="font-bold text-2xl">{selectedProduct.stock}</span> 点</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full mt-2">
                    <button 
                        onClick={() => handleAction('in')}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-positive-light text-positive hover:bg-positive/20 transition-colors active:scale-[0.98]"
                    >
                        <span className="font-bold text-lg">入庫登録</span>
                    </button>
                    <button 
                        onClick={() => handleAction('out')}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-negative-light text-negative hover:bg-negative/20 transition-colors active:scale-[0.98]"
                    >
                        <span className="font-bold text-lg">出庫登録</span>
                    </button>
                 </div>
                 
                 <button 
                    onClick={handleEdit}
                    className="w-full mt-2 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                 >
                    商品情報を編集
                 </button>

                 <button 
                    type="button"
                    onClick={handleDelete}
                    className="w-full py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                 >
                    商品を削除
                 </button>

                 <button onClick={closeModal} className="w-full mt-2 py-2 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200">
                    キャンセル
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
