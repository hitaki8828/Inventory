import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';
import { CategoryType } from '../types';

const CategorySettingsPage: React.FC = () => {
  const { categories, addCategory, deleteCategory } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedType, setSelectedType] = useState<CategoryType>('大分類');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim(), selectedType);
    setNewCategoryName('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('この分類を削除してもよろしいですか？')) {
      deleteCategory(id);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.type === selectedType);
  }, [categories, selectedType]);

  const categoryTypes: CategoryType[] = ['大分類', '中分類', '小分類'];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header 
        title="分類設定" 
        showBack={true} 
        rightAction={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        }
      />
      
      <main className="flex-1 pb-8">
        {/* Segmented Control */}
        <div className="px-4 py-3">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-200/60 p-1 dark:bg-gray-800/60">
            {categoryTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex h-full flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium leading-normal transition-all ${
                  selectedType === type
                    ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <span className="truncate">{type}</span>
              </button>
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
          {filteredCategories.map((cat) => (
            <div key={cat.id} className="flex min-h-[56px] items-center gap-4 rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800/50 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors group relative">
              <div className="flex flex-1 items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
                  <span className="material-symbols-outlined">{cat.icon || 'category'}</span>
                </div>
                <p className="flex-1 truncate text-base font-medium text-gray-900 dark:text-white">{cat.name}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <div className="flex size-8 shrink-0 cursor-move items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  <span className="material-symbols-outlined">drag_indicator</span>
                </div>
                <button 
                  type="button"
                  onClick={(e) => handleDelete(cat.id, e)}
                  className="flex size-8 shrink-0 cursor-pointer items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors relative z-20"
                  aria-label="削除"
                  title="削除"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}
          {filteredCategories.length === 0 && (
            <p className="text-center text-gray-500 mt-8">{selectedType}はありません</p>
          )}
        </div>
      </main>

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl animate-slide-up">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{selectedType}を追加</h3>
            <input
              autoFocus
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-base text-gray-900 dark:text-white focus:border-primary focus:ring-primary mb-6"
              placeholder={`${selectedType}名を入力`}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg bg-gray-100 dark:bg-gray-700 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySettingsPage;