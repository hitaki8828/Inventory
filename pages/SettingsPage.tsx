
import React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Header */}
      <div className="bg-white dark:bg-background-dark pt-12 pb-4 px-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">設定</h1>
      </div>

      <div className="flex flex-col mt-6 flex-1">
        {/* List Group */}
        <div className="bg-white dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
          <Link 
            to="/settings/categories" 
            className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="text-base font-medium text-gray-900 dark:text-white">分類設定</span>
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
          </Link>
          <Link 
            to="/settings/staff" 
            className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="text-base font-medium text-gray-900 dark:text-white">担当者設定</span>
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
          </Link>
          <Link 
            to="/settings/destinations" 
            className="flex items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span className="text-base font-medium text-gray-900 dark:text-white">出庫先設定</span>
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">chevron_right</span>
          </Link>
        </div>
        
        {/* Footer info */}
        <div className="mt-auto mb-8 text-center p-4">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500">にきや Inventory</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Version 8.2.0</p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">© I.Taki</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;