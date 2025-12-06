
import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';

const HistoryPage: React.FC = () => {
  const { transactions, products, categories } = useInventory();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [largeCategory, setLargeCategory] = useState('');
  const [mediumCategory, setMediumCategory] = useState('');
  const [smallCategory, setSmallCategory] = useState('');

  // Category Options (Dynamic from Context)
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

  // Helper to map product names to their categories for filtering
  const productCategoryMap = useMemo(() => {
    const map = new Map<string, { large: string; medium?: string; small?: string }>(); 
    products.forEach(p => {
      map.set(p.name, { 
        large: p.category, 
        medium: p.mediumCategory,
        small: p.smallCategory
      });
    });
    return map;
  }, [products]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // 1. Name Filter
      if (searchQuery && !t.productName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // 2. Date Filter
      if (startDate || endDate) {
        const tDate = new Date(t.date); 
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (tDate < start) return false;
        }

        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (tDate > end) return false;
        }
      }

      // 3. Category Filter
      if (largeCategory || mediumCategory || smallCategory) {
        const productInfo = productCategoryMap.get(t.productName);
        if (!productInfo) return false;

        if (largeCategory && productInfo.large !== largeCategory) {
          return false;
        }
        if (mediumCategory && productInfo.medium !== mediumCategory) {
          return false;
        }
        if (smallCategory && productInfo.small !== smallCategory) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, searchQuery, startDate, endDate, largeCategory, mediumCategory, smallCategory, productCategoryMap]);

  // Check if all items belong to the same product for single-product print layout
  const uniqueProductNames = useMemo(() => {
    return Array.from(new Set(filteredTransactions.map(t => t.productName)));
  }, [filteredTransactions]);

  const isSingleProduct = uniqueProductNames.length === 1;
  const singleProductName = isSingleProduct ? uniqueProductNames[0] : '';

  const getCategoryString = (productName: string) => {
    const cat = productCategoryMap.get(productName);
    if (!cat) return '';
    return [cat.large, cat.medium, cat.small].filter(Boolean).join(' > ');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24 print:bg-white print:pb-0 print:h-auto">
      
      {/* Header - Hidden in Print */}
      <div className="print:hidden">
        <Header 
          title="入出庫履歴" 
          rightAction={
            <button 
              className="flex items-center justify-center size-10 rounded-full text-primary hover:bg-primary/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                window.print();
              }}
            >
              <span className="material-symbols-outlined text-2xl">print</span>
            </button>
          }
        />
      </div>

      <div className="flex flex-col flex-1">
        
        {/* Filter - Hidden in Print */}
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

            {/* Row 1: Date Filter Pills */}
            <div className="flex items-center gap-3 px-4 py-2 mt-2 overflow-x-auto no-scrollbar">
               <div className={`relative flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 border shadow-sm transition-colors ${startDate ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white'}`}>
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <input 
                    type="date"
                    className="bg-transparent border-none p-0 text-sm focus:ring-0 font-medium h-full w-28 text-inherit" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="開始日"
                  />
               </div>
               <span className="flex items-center text-gray-400">~</span>
               <div className={`relative flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-3 border shadow-sm transition-colors ${endDate ? 'bg-primary/10 border-primary text-primary' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white'}`}>
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  <input 
                    type="date"
                    className="bg-transparent border-none p-0 text-sm focus:ring-0 font-medium h-full w-28 text-inherit"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="終了日"
                  />
               </div>
            </div>

            {/* Row 2: Category Filters */}
            <div className="flex gap-3 px-4 py-2 overflow-x-auto no-scrollbar">
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
       

        {/* Normal List View (Cards) - Hidden in Print */}
        <div className="flex flex-col gap-3 px-4 print:hidden">
            <div className="h-4"></div>
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => setSearchQuery(transaction.productName)}
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${transaction.type === 'in' ? 'bg-positive-light' : 'bg-negative-light'}`}>
                  <span className={`material-symbols-outlined ${transaction.type === 'in' ? 'text-positive' : 'text-negative'}`}>
                    {transaction.type === 'in' ? 'add' : 'remove'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{transaction.productName}</p>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm text-gray-600 dark:text-gray-400">担当: {transaction.user}</p>
                    {transaction.destination && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                          {transaction.destination}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-bold text-lg ${transaction.type === 'in' ? 'text-positive' : 'text-negative'}`}>
                    {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <p>履歴はありません</p>
              </div>
            )}
        </div>

        {/* ========================
            PRINT TABLE VIEW 
            Visible ONLY when printing
           ======================== */}
        <div className="hidden print:block p-8">
            {/* Print Header */}
            <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">入出庫履歴</h1>
                  {isSingleProduct && (
                    <div className="flex items-baseline gap-3 mt-2">
                        <h2 className="text-lg font-bold text-gray-800">商品名: {singleProductName}</h2>
                        <span className="text-sm text-gray-600 font-medium">{getCategoryString(singleProductName)}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">発行日: {new Date().toLocaleDateString('ja-JP')}</p>
            </div>

            {/* Table */}
            {filteredTransactions.length > 0 ? (
              <table className="w-full text-xs text-left text-gray-700 border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-900">
                    <th className={`py-2 px-1 font-bold ${isSingleProduct ? 'w-[20%]' : 'w-[15%]'}`}>日付</th>
                    {!isSingleProduct && <th className="py-2 px-1 font-bold w-[35%]">商品名</th>}
                    <th className={`py-2 px-1 font-bold ${isSingleProduct ? 'w-[25%]' : 'w-[15%]'}`}>担当者</th>
                    <th className={`py-2 px-1 font-bold ${isSingleProduct ? 'w-[40%]' : 'w-[25%]'}`}>出庫先</th>
                    <th className={`py-2 px-1 font-bold text-right ${isSingleProduct ? 'w-[15%]' : 'w-[10%]'}`}>数量</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 break-inside-avoid">
                      <td className="py-2 px-1 whitespace-nowrap align-middle">{transaction.date}</td>
                      {!isSingleProduct && (
                        <td className="py-2 px-1 whitespace-nowrap overflow-hidden text-ellipsis align-middle">
                          <div className="text-gray-900 font-semibold">{transaction.productName}</div>
                          <div className="text-[10px] text-gray-500">{getCategoryString(transaction.productName)}</div>
                        </td>
                      )}
                      <td className="py-2 px-1 whitespace-nowrap overflow-hidden text-ellipsis align-middle">{transaction.user}</td>
                      <td className="py-2 px-1 whitespace-nowrap overflow-hidden text-ellipsis align-middle">
                        {transaction.type === 'out' ? transaction.destination || '-' : '-'}
                      </td>
                      <td className={`py-2 px-1 text-right font-medium whitespace-nowrap align-middle ${transaction.type === 'in' ? 'text-black' : 'text-red-600'}`}>
                        {transaction.type === 'in' ? '+' : ''}{transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-500">
                履歴はありません
              </div>
            )}
            
            <div className="mt-8 text-right text-xs text-gray-400">
              にきや Inventory
            </div>
        </div>

      </div>
    </div>
  );
};

export default HistoryPage;
