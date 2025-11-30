import React from 'react';
import Header from '../components/Header';

const InboundPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-6">
      <Header title="入庫登録" showBack={true} />
      
      <main className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="product_name">商品名</label>
          <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 px-4 text-base" id="product_name" placeholder="例：オーガニックコットンTシャツ" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="large_category">大分類</label>
          <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base" id="large_category" list="large_category_list" placeholder="選択または入力"/>
          <datalist id="large_category_list">
            <option value="製品"></option>
            <option value="資材"></option>
            <option value="備品"></option>
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="medium_category">中分類</label>
          <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base" id="medium_category" list="medium_category_list" placeholder="選択または入力"/>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="small_category">小分類</label>
          <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base" id="small_category" list="small_category_list" placeholder="選択または入力"/>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="stock_quantity">入庫数</label>
          <div className="relative">
            <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base text-right pr-12" id="stock_quantity" placeholder="0" type="number" />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400">点</span>
          </div>
        </div>
      </main>

      <div className="p-4 bg-background-light dark:bg-background-dark">
        <button className="w-full flex h-12 items-center justify-center rounded-lg bg-primary text-white text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-95">
          登録する
        </button>
      </div>
    </div>
  );
};

export default InboundPage;
