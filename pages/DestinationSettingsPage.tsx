import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';

const DestinationSettingsPage: React.FC = () => {
  const { destinations, addDestination, deleteDestination } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDestName, setNewDestName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddDestination = () => {
    if (!newDestName.trim()) return;
    addDestination(newDestName.trim());
    setNewDestName('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteDestination(id);
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter(d => 
      searchQuery === '' || d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [destinations, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header 
        title="出庫先設定" 
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
              placeholder="出庫先を検索" 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Destination List */}
        <div className="flex flex-col bg-white dark:bg-background-dark flex-1">
          {filteredDestinations.length > 0 ? (
            filteredDestinations.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <p className="text-base font-medium text-gray-900 dark:text-white">{d.name}</p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(d.id);
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
                <p>登録された出庫先はありません</p>
             </div>
          )}
        </div>
      </main>

      {/* Add Destination Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">出庫先を追加</h3>
            <input
              autoFocus
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-base text-gray-900 dark:text-white focus:border-primary focus:ring-primary mb-6"
              placeholder="出庫先名を入力"
              value={newDestName}
              onChange={(e) => setNewDestName(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-lg bg-gray-100 dark:bg-gray-700 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddDestination}
                disabled={!newDestName.trim()}
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

export default DestinationSettingsPage;