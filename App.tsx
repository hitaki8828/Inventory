import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import InventoryPage from './pages/InventoryPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import InboundPage from './pages/InboundPage';
import OutboundPage from './pages/OutboundPage';
import ProductRegistrationPage from './pages/ProductRegistrationPage';
import CategorySettingsPage from './pages/CategorySettingsPage';
import UserManagementPage from './pages/UserManagementPage';
import PermissionSettingsPage from './pages/PermissionSettingsPage';
import { InventoryProvider } from './contexts/InventoryContext';

const App: React.FC = () => {
  return (
    <InventoryProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/inventory" replace />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="/inbound" element={<InboundPage />} />
          <Route path="/outbound" element={<OutboundPage />} />
          <Route path="/product/new" element={<ProductRegistrationPage />} />
          <Route path="/product/edit/:id" element={<ProductRegistrationPage />} />
          <Route path="/settings/categories" element={<CategorySettingsPage />} />
          <Route path="/settings/users" element={<UserManagementPage />} />
          <Route path="/settings/users/:id" element={<PermissionSettingsPage />} />
        </Routes>
      </HashRouter>
    </InventoryProvider>
  );
};

export default App;