import React from 'react';
import Header from '../components/Header';
import { MOCK_PRODUCTS } from '../constants';

const InventoryPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header 
        title="在庫確認" 
        rightAction={<div className="size-10" />} // Placeholder for balance
      />
      
      <main className="flex-1">
        {/* Search */}
        <div className="px-4 py-3 bg-background-light dark:bg-background-dark sticky top-14 z-10">
          <label className="flex flex-col h-12 w-full shadow-sm">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full overflow-hidden">
              <div className="text-gray-500 dark:text-gray-400 flex border-none bg-white dark:bg-gray-800 items-center justify-center pl-4 pr-2">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="flex w-full min-w-0 flex-1 resize-none border-none bg-white dark:bg-gray-800 focus:ring-0 h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 px-2 text-base font-normal leading-normal" 
                placeholder="商品名で検索" 
              />
            </div>
          </label>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
          {['大分類', '中分類', '小分類'].map((label, idx) => (
            <button key={idx} className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-gray-800 px-4 border border-gray-100 dark:border-gray-700 shadow-sm active:scale-95 transition-transform">
              <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">{label}</p>
              <span className="material-symbols-outlined text-gray-900 dark:text-white text-base">expand_more</span>
            </button>
          ))}
        </div>

        <div className="h-4"></div>

        {/* List */}
        <div className="flex flex-col bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          {MOCK_PRODUCTS.length > 0 ? (
            MOCK_PRODUCTS.map((product) => (
              <div key={product.id} className="flex items-center gap-4 px-4 min-h-[88px] py-3 justify-between border-b border-gray-100 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 w-full">
                  <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 shrink-0 bg-gray-200 dark:bg-gray-700" 
                    style={{ backgroundImage: `url("${product.imageUrl}")` }}
                  ></div>
                  <div className="flex flex-col justify-center flex-1 min-w-0 gap-1">
                    <p className="text-gray-900 dark:text-white text-base font-bold leading-tight truncate">{product.name}</p>
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
                    <p className="text-gray-900 dark:text-white text-lg font-bold leading-normal">{product.stock}<span className="text-sm font-normal text-gray-500 ml-1">点</span></p>
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

      {/* FAB */}
      <div className="fixed bottom-24 right-6">
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 active:scale-95 shadow-primary/30">
          <span className="material-symbols-outlined text-3xl">print</span>
        </button>
      </div>
    </div>
  );
};

export default InventoryPage;
