import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import InventoryPage from './pages/InventoryPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import InboundPage from './pages/InboundPage';
import OutboundPage from './pages/OutboundPage';
import CategorySettingsPage from './pages/CategorySettingsPage';
import UserManagementPage from './pages/UserManagementPage';
import PermissionSettingsPage from './pages/PermissionSettingsPage';

// Helper to determine if we should show floating buttons for In/Out bound
const FloatingActions = () => {
  const location = useLocation();
  // Show on Inventory page only
  if (location.pathname !== '/inventory') return null;

  return (
    <div className="fixed bottom-24 left-6 flex flex-col gap-3 pointer-events-auto z-20">
      <a href="#/inbound" className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
         <div className="flex items-center justify-center size-10 rounded-full bg-positive-light text-positive">
            <span className="material-symbols-outlined">add</span>
         </div>
         <span className="font-bold text-gray-700 dark:text-white">入庫</span>
      </a>
      <a href="#/outbound" className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 pr-4 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
         <div className="flex items-center justify-center size-10 rounded-full bg-negative-light text-negative">
            <span className="material-symbols-outlined">remove</span>
         </div>
         <span className="font-bold text-gray-700 dark:text-white">出庫</span>
      </a>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<><Layout /><FloatingActions /></>}>
          <Route path="/" element={<Navigate to="/inventory" replace />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="/inbound" element={<InboundPage />} />
        <Route path="/outbound" element={<OutboundPage />} />
        <Route path="/settings/categories" element={<CategorySettingsPage />} />
        <Route path="/settings/users" element={<UserManagementPage />} />
        <Route path="/settings/users/:id" element={<PermissionSettingsPage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
