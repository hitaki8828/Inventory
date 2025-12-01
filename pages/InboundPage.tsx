import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';

const InboundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateStock } = useInventory();
  const [productName, setProductName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');

  // Auto-fill from navigation state
  useEffect(() => {
    if (location.state && location.state.productName) {
      setProductName(location.state.productName);
    } else {
      // If accessed directly without state, redirect to inventory
      navigate('/inventory');
    }
  }, [location.state, navigate]);

  const handleRegister = () => {
    if (!productName || !stockQuantity) return;
    
    updateStock(productName, Number(stockQuantity), 'in');
    navigate('/inventory');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-6">
      <Header title="入庫登録" showBack={true} />
      
      <main className="flex-1 p-4 space-y-6">
        {/* Product Name Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white">商品名</label>
          <div className="flex items-center w-full min-w-0 flex-1 rounded-lg border border-transparent bg-gray-100 dark:bg-gray-800 h-12 px-4 text-base text-gray-900 dark:text-white font-bold">
            {productName}
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="stock_quantity">入庫数</label>
          <div className="relative">
            <input 
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111318] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base text-right pr-12" 
              id="stock_quantity" 
              placeholder="0" 
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              autoFocus
            />
            <span className="absolute inset-y-0 right-4 flex items-center text-gray-500 dark:text-gray-400">点</span>
          </div>
        </div>
      </main>

      <div className="p-4 bg-background-light dark:bg-background-dark">
        <button 
          onClick={handleRegister}
          className="w-full flex h-12 items-center justify-center rounded-lg bg-primary text-white text-base font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
        >
          登録する
        </button>
      </div>
    </div>
  );
};

export default InboundPage;