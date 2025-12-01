import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { useInventory } from '../contexts/InventoryContext';

const OutboundPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateStock } = useInventory();
  const [productName, setProductName] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [destination, setDestination] = useState('');

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

    updateStock(productName, Number(stockQuantity), 'out', destination);
    navigate('/inventory');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-6">
      <Header title="出庫登録" showBack={true} />
      
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
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="quantity">出庫数</label>
          <div className="relative">
            <input 
              className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base text-right pr-12 dark:text-white" 
              id="quantity" 
              placeholder="0" 
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">個</span>
          </div>
        </div>

        {/* Destination Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#111318] dark:text-white" htmlFor="destination">出庫先</label>
          <input 
            className="flex w-full min-w-0 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-12 px-4 text-base dark:text-white" 
            id="destination" 
            placeholder="出庫先を入力" 
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
      </main>

      <div className="p-4 bg-background-light dark:bg-background-dark">
        <button 
          onClick={handleRegister}
          className="w-full h-12 rounded-lg bg-primary text-white font-bold text-base flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          登録
        </button>
      </div>
    </div>
  );
};

export default OutboundPage;