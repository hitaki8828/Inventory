import React from 'react';
import Header from '../components/Header';
import { MOCK_CATEGORIES } from '../constants';

const CategorySettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header 
        title="分類設定" 
        showBack={true} 
        rightAction={
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        }
      />
      
      <main className="flex-1 pb-8">
        {/* Segmented Control */}
        <div className="px-4 py-3">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200/60 p-1 dark:bg-gray-800/60">
            {['大分類', '中分類', '小分類'].map((label, idx) => (
              <label key={idx} className="flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal text-gray-500 has-[:checked]:bg-white has-[:checked]:text-gray-900 has-[:checked]:shadow-sm dark:text-gray-400 dark:has-[:checked]:bg-gray-700 dark:has-[:checked]:text-white transition-all">
                <span className="truncate">{label}</span>
                <input className="invisible w-0 hidden" name="category_type" type="radio" defaultChecked={idx === 0} />
              </label>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3 pt-1">
          <div className="relative flex h-11 w-full items-center">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 text-gray-400 dark:text-gray-500">search</span>
            <input className="h-full w-full rounded-lg border-none bg-gray-200/60 py-2 pl-10 pr-4 text-inherit placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-gray-800/60 dark:placeholder-gray-500 dark:text-white" placeholder="分類を検索" type="text"/>
          </div>
        </div>

        {/* Category List */}
        <div className="flex flex-col gap-2 px-4">
          {MOCK_CATEGORIES.map((cat) => (
            <div key={cat.id} className="flex min-h-[56px] items-center gap-4 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <p className="flex-1 truncate text-base font-medium text-gray-900 dark:text-white">{cat.name}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex size-8 shrink-0 cursor-move items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <span className="material-symbols-outlined">drag_indicator</span>
                </div>
                <div className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <span className="material-symbols-outlined">chevron_right</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CategorySettingsPage;
