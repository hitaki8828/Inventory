import React, { useState } from 'react';
import Header from '../components/Header';
import { MOCK_TRANSACTIONS } from '../constants';

const HistoryPage: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <Header 
        title="入出庫履歴" 
        rightAction={
          <button className="flex items-center justify-center text-primary active:opacity-70">
            <span className="material-symbols-outlined text-2xl">print</span>
          </button>
        }
      />

      <div className="flex flex-col p-4 gap-4">
        {/* Filter */}
        <div className={`flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark transition-all duration-300 overflow-hidden ${isFilterOpen ? '' : 'h-[58px]'}`}>
          <div 
            className="flex cursor-pointer list-none items-center justify-between gap-6 p-4 bg-white dark:bg-background-dark z-10"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">フィルター</p>
            <span className={`material-symbols-outlined text-gray-600 dark:text-gray-400 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </div>
          
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-background-dark/50">
            <div className="flex flex-col gap-4 pt-4">
              <label className="flex flex-col w-full">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 pb-2">商品名</p>
                <div className="relative flex w-full items-center">
                  <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary h-12 placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-10 pr-4 text-base" placeholder="商品名で検索" />
                  <span className="material-symbols-outlined absolute left-3 text-gray-500 dark:text-gray-400">search</span>
                </div>
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input className="flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary h-12 pl-3 pr-2 text-sm" type="date" defaultValue="2023-10-01" />
                </div>
                <span className="text-gray-600 dark:text-gray-400">〜</span>
                <div className="relative flex-1">
                  <input className="flex w-full min-w-0 flex-1 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-primary h-12 pl-3 pr-2 text-sm" type="date" defaultValue="2023-10-31" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {/* Select inputs placeholder */}
                 <div className="h-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 flex items-center px-3 text-gray-500 dark:text-gray-400">大分類</div>
                 <div className="h-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 flex items-center px-3 text-gray-500 dark:text-gray-400">中分類</div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">リセット</button>
                <button className="rounded-lg px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm">適用</button>
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {MOCK_TRANSACTIONS.map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 shadow-sm">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${transaction.type === 'in' ? 'bg-positive-light' : 'bg-negative-light'}`}>
                <span className={`material-symbols-outlined ${transaction.type === 'in' ? 'text-positive' : 'text-negative'}`}>
                  {transaction.type === 'in' ? 'add' : 'remove'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{transaction.productName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">担当: {transaction.user}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`font-bold text-lg ${transaction.type === 'in' ? 'text-positive' : 'text-negative'}`}>
                  {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
