import React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      <div className="flex flex-col gap-2 bg-white dark:bg-background-dark p-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center h-12 justify-end"></div>
        <p className="text-[#111318] dark:text-white tracking-tight text-[28px] font-bold leading-tight">設定</p>
      </div>

      <div className="flex flex-col flex-1">
        
        {/* Section 1 */}
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider px-4 pb-2 pt-6">データ管理</h3>
        <div className="flex flex-col bg-white dark:bg-background-dark/50 overflow-hidden border-y border-gray-200 dark:border-gray-800">
          <Link to="/settings/categories" className="flex items-center gap-4 bg-white dark:bg-gray-900/40 px-4 min-h-14 justify-between border-b border-slate-100 dark:border-slate-800 active:bg-gray-50 dark:active:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-10">
                <span className="material-symbols-outlined">tag</span>
              </div>
              <p className="text-[#111318] dark:text-white text-base font-normal leading-normal flex-1 truncate">分類設定</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </Link>
          
          <Link to="/settings/users" className="flex items-center gap-4 bg-white dark:bg-gray-900/40 px-4 min-h-14 justify-between active:bg-gray-50 dark:active:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 size-10">
                <span className="material-symbols-outlined">group</span>
              </div>
              <p className="text-[#111318] dark:text-white text-base font-normal leading-normal flex-1 truncate">ユーザー管理</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </Link>
        </div>

        {/* Section 2 */}
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider px-4 pb-2 pt-8">アプリについて</h3>
        <div className="flex flex-col bg-white dark:bg-background-dark/50 overflow-hidden border-y border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900/40 px-4 min-h-14 justify-between border-b border-slate-100 dark:border-slate-800 active:bg-gray-50 dark:active:bg-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">description</span>
              </div>
              <p className="text-[#111318] dark:text-white text-base font-normal leading-normal flex-1 truncate">利用規約</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900/40 px-4 min-h-14 justify-between border-b border-slate-100 dark:border-slate-800 active:bg-gray-50 dark:active:bg-gray-800">
             <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">shield</span>
              </div>
              <p className="text-[#111318] dark:text-white text-base font-normal leading-normal flex-1 truncate">プライバシーポリシー</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
           <div className="flex items-center gap-4 bg-white dark:bg-gray-900/40 px-4 min-h-14 justify-between active:bg-gray-50 dark:active:bg-gray-800">
             <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 size-10">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">info</span>
              </div>
              <p className="text-[#111318] dark:text-white text-base font-normal leading-normal flex-1 truncate">バージョン情報</p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-slate-500 dark:text-slate-400 text-base">1.0.0</p>
              <span className="material-symbols-outlined text-slate-400">chevron_right</span>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider px-4 pb-2 pt-8">アカウント</h3>
        <div className="flex flex-col bg-white dark:bg-background-dark/50 overflow-hidden border-y border-gray-200 dark:border-gray-800">
           <div className="flex items-center gap-4 bg-white dark:bg-gray-900/40 px-4 min-h-14 justify-between active:bg-gray-50 dark:active:bg-gray-800 cursor-pointer">
             <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-red-500/10 shrink-0 size-10">
                <span className="material-symbols-outlined text-red-500">logout</span>
              </div>
              <p className="text-red-500 text-base font-normal leading-normal flex-1 truncate">ログアウト</p>
            </div>
            <span className="material-symbols-outlined text-slate-400">chevron_right</span>
          </div>
        </div>
        
        <div className="flex-grow"></div>
        <div className="text-center p-4 mt-8">
          <p className="text-slate-500 dark:text-slate-400 text-sm">にきや Inventory</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">© I.Takiguchi</p>
        </div>
      </div>
      
      {/* Action Buttons for In/Out bound - Added for convenience from Settings page as well or just visual balance */}
      {/* We don't need them here as per design, but sticking to "App-ify" request, I might add them to Inventory page only */}
    </div>
  );
};

export default SettingsPage;
