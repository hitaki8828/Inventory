import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { MOCK_USERS } from '../constants';

const UserManagementPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header 
        title="ユーザー管理" 
        showBack={true} 
        onBack={() => navigate('/settings')}
        rightAction={
          <button className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        }
      />

      <div className="px-4 py-3 bg-white dark:bg-background-dark border-b border-gray-100 dark:border-gray-800">
        <label className="flex flex-col w-full">
          <div className="flex w-full items-center rounded-lg bg-gray-100 dark:bg-gray-800 px-4 h-12">
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">search</span>
            <input className="flex-1 bg-transparent border-none focus:ring-0 ml-2 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400" placeholder="ユーザーを検索" />
          </div>
        </label>
      </div>
      
      <div className="h-4"></div>

      <div className="flex flex-col bg-white dark:bg-background-dark flex-1 border-t border-gray-100 dark:border-gray-800">
        {MOCK_USERS.map((user) => (
          <div 
            key={user.id} 
            className="flex items-center gap-4 px-4 min-h-[72px] py-2 justify-between border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
            onClick={() => navigate(`/settings/users/${user.id}`)}
          >
            <div className="flex items-center gap-4">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-12 w-12 bg-gray-200 dark:bg-gray-700" style={{ backgroundImage: `url("${user.avatarUrl}")` }}></div>
              <div className="flex flex-col justify-center">
                <p className="text-gray-900 dark:text-white text-base font-medium leading-normal line-clamp-1">{user.name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal line-clamp-2">{user.role}</p>
              </div>
            </div>
            <div className="shrink-0 text-gray-400 dark:text-gray-500">
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagementPage;