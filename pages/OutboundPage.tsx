import React from 'react';
import Header from '../components/Header';

const OutboundPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-6">
      <Header title="出庫登録" showBack={true} />
      
      <main className="flex-1 p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="product-name">商品名</label>
          <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base" id="product-name" placeholder="商品名を入力" />
        </div>
        
        {/* Categories simplified for brevity in this example, same structure as Inbound */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="category1">大分類</label>
          <input className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base dark:text-white" id="category1" list="category1-list" placeholder="選択または入力"/>
          <datalist id="category1-list">
            <option value="製品" />
            <option value="資材" />
          </datalist>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="quantity">数量</label>
          <div className="relative">
            <input className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base text-right pr-12 dark:text-white" id="quantity" placeholder="0" type="number"/>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">個</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="destination">出庫先</label>
          <input className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base dark:text-white" id="destination" placeholder="出庫先を入力" type="text"/>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="memo">メモ</label>
          <textarea className="flex w-full min-w-0 flex-1 resize-y rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-3 text-base dark:text-white" id="memo" placeholder="メモを入力" rows={4}></textarea>
        </div>
      </main>

      <div className="p-4 bg-background-light dark:bg-background-dark">
        <button className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">登録</button>
      </div>
    </div>
  );
};

export default OutboundPage;
