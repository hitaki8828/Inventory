import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const navItems = [
    { path: '/inventory', label: '在庫', icon: 'inventory_2' },
    { path: '/history', label: '履歴', icon: 'history' },
    { path: '/settings', label: '設定', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex h-20 items-center justify-around border-t border-gray-200 bg-white pb-6 dark:border-gray-800 dark:bg-background-dark print:hidden">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
              isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
            }`
          }
        >
          <span className="material-symbols-outlined text-2xl">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;