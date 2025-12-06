import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';

const StaffSettingsPage: React.FC = () => {
  const { staff, addStaff, deleteStaff } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddStaff = () => {
    if (!newStaffName.trim()) return;
    addStaff(newStaffName.trim());
    setNewStaffName('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteStaff(id);
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(s => 
      searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [staff, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header 
        title="担当者設定" 
        showBack={true} 
        rightAction={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-2xl">add</span>
          </button>
        }
      />
      
      <main className="flex-1 pb-8 flex flex-col">
        {/* Search Bar */}
        <div className="px-4 py-3 bg-white dark:bg-background-dark border-b border-gray-200 dark:border-gray-800 sticky top-14 z-10 shadow-sm">
           <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input 
              className="w-full h-10 rounded-lg border-none bg-gray-100 dark:bg-gray-800 pl-10 pr-4 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50" 
              placeholder="担当者を検索" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="flex flex-col bg-white dark:bg-background-dark flex-1">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <p className="text-base font-medium text-gray-900 dark:text-white">{s.name}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(s.id);
                  }}
                  className="relative z-20 flex items-center justify-center w-10 h-10 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 cursor-pointer"
                  title="削除"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))
          ) : (
             <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <p>登録された担当者はいません</p>
             </div>
          )}
        </div>
      </main>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">担当者を追加</h3>
            <input
              autoFocus
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-base text-gray-900 dark:text-white focus:border-primary focus:ring-primary mb-6"
              placeholder="氏名を入力"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg bg-gray-100 dark:bg-gray-700 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddStaff}
                disabled={!newStaffName.trim()}
                className="flex-1 rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default StaffSettingsPage;