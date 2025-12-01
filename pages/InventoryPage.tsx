import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import { Product } from '../types';
import { useInventory } from '../contexts/InventoryContext';

export default function InventoryPage() {
  const navigate = useNavigate();
  const { products, categories } = useInventory(); // Use data from Context
  const [largeCategory, setLargeCategory] = useState('');
  const [mediumCategory, setMediumCategory] = useState('');
  const [smallCategory, setSmallCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Print Settings
  const [printSettings, setPrintSettings] = useState({
    orientation: 'portrait' as 'portrait' | 'landscape',
    rangeStart: 1,
    rangeEnd: 0 
  });

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

  // Determine items to display based on preview mode and range settings
  const itemsToDisplay = useMemo(() => {
    if (!showPreview) return filteredProducts;
    
    const start = Math.max(1, printSettings.rangeStart) - 1;
    const end = printSettings.rangeEnd > 0 ? printSettings.rangeEnd : filteredProducts.length;
    
    return filteredProducts.slice(start, end);
  }, [filteredProducts, showPreview, printSettings]);

  // Initialize range end when entering preview
  useEffect(() => {
    if (showPreview) {
      setPrintSettings(prev => ({ ...prev, rangeEnd: filteredProducts.length }));
    }
  }, [showPreview, filteredProducts.length]);

  const handleProductClick = (product: Product) => {
    if (showPreview) return;
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

  return (
    <div className={`flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24 relative print:bg-white print:pb-0 print:static print:h-auto print:overflow-visible ${showPreview ? 'fixed inset-0 z-50 bg-white overflow-y-auto pb-0' : ''}`}>
      
      {/* Dynamic Print Styles */}
      {showPreview && (
        <style>
          {`@media print { @page { size: ${printSettings.orientation}; } }`}
        </style>
      )}

      {/* Preview Toolbar */}
      {showPreview && (
        <div className="sticky top-0 z-50 flex flex-col bg-gray-900 text-white print:hidden shadow-md">
          <div className="flex h-14 items-center justify-between px-4">
            <button 
              onClick={() => setShowPreview(false)} 
              className="text-sm font-medium hover:text-gray-300 transition-colors"
            >
              閉じる
            </button>
            <span className="font-bold">プレビュー</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => window.print(), 50);
              }}
              className="flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              印刷
            </button>
          </div>
          
          {/* Print Controls */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-4 pb-3 text-sm border-t border-gray-800 pt-3">
             <div className="flex items-center gap-3">
                <span className="text-gray-400">向き:</span>
                <div className="flex bg-gray-800 rounded-lg p-1">
                   <button 
                     onClick={() => setPrintSettings(p => ({...p, orientation: 'portrait'}))}
                     className={`px-3 py-1 rounded-md transition-colors ${printSettings.orientation === 'portrait' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                   >縦</button>
                   <button 
                     onClick={() => setPrintSettings(p => ({...p, orientation: 'landscape'}))}
                     className={`px-3 py-1 rounded-md transition-colors ${printSettings.orientation === 'landscape' ? 'bg-gray-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                   >横</button>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <span className="text-gray-400">範囲 (全{filteredProducts.length}件):</span>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1">
                   <input 
                      type="number" 
                      min="1"
                      max={filteredProducts.length}
                      value={printSettings.rangeStart}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setPrintSettings(p => ({...p, rangeStart: val}));
                      }}
                      className="w-16 bg-transparent border-none text-center p-0 focus:ring-0 text-white font-mono placeholder-gray-600"
                   />
                   <span className="text-gray-500">~</span>
                   <input 
                      type="number" 
                      min="1"
                      max={filteredProducts.length}
                      value={printSettings.rangeEnd}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setPrintSettings(p => ({...p, rangeEnd: val}));
                      }}
                      className="w-16 bg-transparent border-none text-center p-0 focus:ring-0 text-white font-mono placeholder-gray-600"
                   />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Standard Header - Hidden in Preview Mode */}
      {!showPreview && (
        <Header 
          title="在庫" 
          rightAction={
            <div className="flex items-center gap-2">
              <button 
                className="flex items-center justify-center size-10 rounded-full text-primary hover:bg-primary/10 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setShowPreview(true);
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
      )}
      
      <main className="flex-1 print:w-full">
        {/* Print Title - Visible only in Preview or Print */}
        <div className={`px-4 py-6 border-b border-gray-200 mb-2 ${showPreview ? 'block' : 'hidden print:block'}`}>
          <div className="flex justify-between items-end">
             <h1 className="text-2xl font-bold text-gray-900">在庫一覧</h1>
             <p className="text-sm text-gray-500">{new Date().toLocaleDateString('ja-JP')}</p>
          </div>
        </div>

        {/* Filters - Hidden in Preview */}
        {!showPreview && (
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
        )}

        <div className={`h-4 ${showPreview ? 'hidden' : 'print:hidden'}`}></div>

        {/* List */}
        <div className="flex flex-col bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700 print:border-none print:bg-white">
          {itemsToDisplay.length > 0 ? (
            itemsToDisplay.map((product) => (
              <div 
                key={product.id} 
                className="flex items-center gap-4 px-4 min-h-[88px] py-3 justify-between border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer print:border-gray-300 print:break-inside-avoid"
                onClick={() => handleProductClick(product)}
              >
                <div className="flex items-center gap-4 w-full">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0 bg-gray-200 dark:bg-gray-700 print:border print:border-gray-200" 
                    style={{ backgroundImage: `url("${product.imageUrl}")` }}
                  ></div>
                  <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
                    <p className="text-gray-900 dark:text-white text-base font-bold leading-tight truncate print:text-black">{product.name}</p>
                    <div className="flex items-center gap-1.5">
                      <div className={`size-2.5 rounded-full ${
                        product.status === 'In Stock' ? 'bg-positive' : 
                        product.status === 'Low Stock' ? 'bg-orange-500' : 'bg-negative'
                      }`}></div>
                      <p className={`text-sm font-medium ${
                         product.status === 'In Stock' ? 'text-positive' : 
                         product.status === 'Low Stock' ? 'text-orange-500' : 'text-negative'
                      }`}>
                        {product.status === 'In Stock' ? '在庫あり' : product.status === 'Low Stock' ? '残りわずか' : '在庫切れ'}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-gray-900 dark:text-white text-lg font-bold leading-normal print:text-black">{product.stock}<span className="text-sm font-normal text-gray-500 ml-1">点</span></p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">該当する商品はありません</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">検索条件を変更するか、フィルターをクリアしてください。</p>
            </div>
          )}
        </div>
      </main>

      {/* Action Modal */}
      {isModalOpen && selectedProduct && !showPreview && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center print:hidden">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
           <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-transform animate-slide-up sm:animate-fade-in mx-auto">
              <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mb-2 sm:hidden"></div>
                 
                 <div className="flex w-full gap-4 mb-2">
                    <div 
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-20 shrink-0 bg-gray-200 dark:bg-gray-700" 
                        style={{ backgroundImage: `url("${selectedProduct.imageUrl}")` }}
                    ></div>
                    <div className="flex flex-col justify-center flex-1">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedProduct.category}</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight mb-1">{selectedProduct.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300">現在在庫: <span className="font-bold text-lg">{selectedProduct.stock}</span> 点</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 w-full mt-2">
                    <button 
                        onClick={() => handleAction('in')}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-positive-light text-positive hover:bg-positive/20 transition-colors active:scale-[0.98]"
                    >
                        <div className="p-3 rounded-full bg-white dark:bg-gray-900 shadow-sm">
                            <span className="material-symbols-outlined text-2xl">add</span>
                        </div>
                        <span className="font-bold text-lg">入庫登録</span>
                    </button>
                    <button 
                        onClick={() => handleAction('out')}
                        className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-negative-light text-negative hover:bg-negative/20 transition-colors active:scale-[0.98]"
                    >
                        <div className="p-3 rounded-full bg-white dark:bg-gray-900 shadow-sm">
                            <span className="material-symbols-outlined text-2xl">remove</span>
                        </div>
                        <span className="font-bold text-lg">出庫登録</span>
                    </button>
                 </div>
                 
                 <button 
                    onClick={handleEdit}
                    className="w-full mt-2 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                 >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    商品情報を編集
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