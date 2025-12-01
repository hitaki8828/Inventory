import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';

const HistoryPage: React.FC = () => {
  const [showPreview, setShowPreview] = useState(false);
  const { transactions, products, categories } = useInventory();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [largeCategory, setLargeCategory] = useState('');
  const [mediumCategory, setMediumCategory] = useState('');
  const [smallCategory, setSmallCategory] = useState('');

  // Print Settings
  const [printSettings, setPrintSettings] = useState({
    orientation: 'portrait' as 'portrait' | 'landscape',
    rangeStart: 1,
    rangeEnd: 0 
  });

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

  // Determine items to display based on preview mode and range settings
  const itemsToDisplay = useMemo(() => {
    if (!showPreview) return filteredTransactions;
    
    const start = Math.max(1, printSettings.rangeStart) - 1;
    const end = printSettings.rangeEnd > 0 ? printSettings.rangeEnd : filteredTransactions.length;
    
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, showPreview, printSettings]);

  // Initialize range end when entering preview
  useEffect(() => {
    if (showPreview) {
      setPrintSettings(prev => ({ ...prev, rangeEnd: filteredTransactions.length }));
    }
  }, [showPreview, filteredTransactions.length]);

  // Check if all items belong to the same product for single-product print layout
  const uniqueProductNames = useMemo(() => {
    return Array.from(new Set(itemsToDisplay.map(t => t.productName)));
  }, [itemsToDisplay]);

  const isSingleProduct = uniqueProductNames.length === 1;
  const singleProductName = isSingleProduct ? uniqueProductNames[0] : '';

  return (
    <div className={`flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24 print:bg-white print:pb-0 ${showPreview ? 'fixed inset-0 z-50 bg-gray-100 overflow-y-auto pb-0 print:static print:h-auto print:overflow-visible print:bg-white' : ''}`}>
      
      {/* Dynamic Print Styles */}
      {showPreview && (
        <style>
          {`@media print { 
              @page { size: ${printSettings.orientation}; margin: 10mm; } 
              body { background-color: white; }
              .print-container { width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; }
            }`}
        </style>
      )}

      {/* Preview Toolbar */}
      {showPreview && (
        <div className="sticky top-0 z-50 flex flex-col bg-gray-900 text-white print:hidden shrink-0 shadow-md">
          <div className="flex h-14 items-center justify-between px-4">
            <button 
              onClick={() => setShowPreview(false)} 
              className="text-sm font-medium hover:text-gray-300 transition-colors"
            >
              閉じる
            </button>
            <span className="font-bold">PDFプレビュー</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setTimeout(() => window.print(), 50);
              }}
              className="flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              PDF保存
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
                <span className="text-gray-400">範囲 (全{filteredTransactions.length}件):</span>
                <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-1">
                   <input 
                      type="number" 
                      min="1"
                      max={filteredTransactions.length}
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
                      max={filteredTransactions.length}
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

      {/* Standard Header - Hidden in Preview */}
      {!showPreview && (
        <Header 
          title="入出庫履歴" 
          rightAction={
            <button 
              className="flex items-center justify-center size-10 rounded-full text-primary hover:bg-primary/10 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                setShowPreview(true);
              }}
            >
              <span className="material-symbols-outlined text-2xl">print</span>
            </button>
          }
        />
      )}

      {/* Content Area */}
      <div className={`flex flex-col flex-1 ${showPreview ? 'p-4 sm:p-8 overflow-y-auto bg-gray-100' : 'print:p-0'}`}>
        
        {/* Filter - Hidden in Preview */}
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
        )}

        {/* Spacer for normal view */}
        <div className={`h-4 ${showPreview ? 'hidden' : 'print:hidden'}`}></div>

        {/* --- VIEW SWITCHER --- */}
        
        {showPreview ? (
          // ========================
          // PRINT PREVIEW VIEW (TABLE)
          // ========================
          <div 
            className={`print-container bg-white shadow-lg mx-auto p-12 transition-all duration-300 print:shadow-none print:p-0 ${
              printSettings.orientation === 'portrait' ? 'w-[210mm] min-h-[297mm]' : 'w-[297mm] min-h-[210mm]'
            }`}
          >
             {/* Print Title */}
            <div className="flex justify-between items-end border-b-2 border-gray-800 pb-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">入出庫履歴</h1>
                  {isSingleProduct && (
                    <h2 className="text-lg font-bold text-gray-800 mt-2">商品名: {singleProductName}</h2>
                  )}
                </div>
                <p className="text-sm text-gray-600">発行日: {new Date().toLocaleDateString('ja-JP')}</p>
            </div>

            {itemsToDisplay.length > 0 ? (
              <table className="w-full text-xs text-left text-gray-700 border-collapse table-fixed">
                <thead>
                  <tr className="bg-gray-100 border-b-2 border-gray-300 text-gray-900">
                    <th className={`py-2 px-1 font-bold ${isSingleProduct ? 'w-[20%]' : 'w-[15%]'}`}>日付</th>
                    {!isSingleProduct && <th className="py-2 px-1 font-bold w-[25%]">商品名</th>}
                    <th className={`py-2 px-1 font-bold ${isSingleProduct ? 'w-[25%]' : 'w-[15%]'}`}>担当者</th>
                    <th className={`py-2 px-1 font-bold ${isSingleProduct ? 'w-[40%]' : 'w-[25%]'}`}>出庫先</th>
                    <th className={`py-2 px-1 font-bold text-right ${isSingleProduct ? 'w-[15%]' : 'w-[10%]'}`}>数量</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToDisplay.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-200 hover:bg-gray-50 break-inside-avoid">
                      <td className="py-2 px-1 whitespace-nowrap">{transaction.date}</td>
                      {!isSingleProduct && <td className="py-2 px-1 whitespace-nowrap overflow-hidden text-ellipsis">{transaction.productName}</td>}
                      <td className="py-2 px-1 whitespace-nowrap overflow-hidden text-ellipsis">{transaction.user}</td>
                      <td className="py-2 px-1 whitespace-nowrap overflow-hidden text-ellipsis">
                        {transaction.type === 'out' ? transaction.destination || '-' : '-'}
                      </td>
                      <td className={`py-2 px-1 text-right font-medium whitespace-nowrap ${transaction.type === 'in' ? 'text-black' : 'text-red-600'}`}>
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
        ) : (
          // ========================
          // NORMAL LIST VIEW (CARDS)
          // ========================
          <div className="flex flex-col gap-3 px-4 print:hidden">
            {itemsToDisplay.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4 shadow-sm">
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
            {itemsToDisplay.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <span className="material-symbols-outlined text-4xl mb-2">history</span>
                <p>履歴はありません</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;