import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { MOCK_USERS } from '../constants';

const PermissionSettingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = MOCK_USERS.find(u => u.id === id) || MOCK_USERS[0];

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
       <Header 
        title="権限設定" 
        showBack={true} 
        rightAction={
          <button className="flex h-10 items-center justify-center px-2 text-primary font-bold hover:opacity-70 transition-opacity">
            保存
          </button>
        }
      />

      <div className="flex flex-col items-center gap-2 p-6 bg-white dark:bg-background-dark">
        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-20 w-20 bg-gray-200" style={{ backgroundImage: `url("${user.avatarUrl}")` }}></div>
        <p className="text-gray-900 dark:text-white text-xl font-bold leading-tight mt-2">{user.name}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">{user.email}</p>
      </div>

      <div className="h-4"></div>

      <div className="flex flex-col bg-white dark:bg-background-dark flex-grow border-t border-gray-100 dark:border-gray-800">
        <div className="px-4 pt-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">役割</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">ユーザーの役割を選択してください。</p>
        </div>

        <div className="flex flex-col gap-2 px-4">
          <label className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer transition-colors hover:border-gray-300 dark:hover:border-gray-600">
            <div className="flex flex-col flex-grow">
              <span className="font-medium text-gray-900 dark:text-white">管理者（全機能）</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">すべての機能にアクセスできます。</span>
            </div>
            <input defaultChecked={user.role === '管理者'} className="form-radio h-5 w-5 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-800" name="role" type="radio" />
          </label>
          <label className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 has-[:checked]:border-primary has-[:checked]:bg-primary/5 cursor-pointer transition-colors hover:border-gray-300 dark:hover:border-gray-600">
            <div className="flex flex-col flex-grow">
              <span className="font-medium text-gray-900 dark:text-white">カスタム</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">機能ごとに権限を個別に設定します。</span>
            </div>
            <input defaultChecked={user.role !== '管理者'} className="form-radio h-5 w-5 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-800" name="role" type="radio" />
          </label>
        </div>

        <div className="px-4">
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-6"></div>
        </div>

        <div className="px-4 pb-6">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">詳細な権限設定</h2>
          <div className="space-y-4">
            {['在庫確認のみ', '入出庫登録のみ', 'レポート閲覧のみ'].map((perm, idx) => (
               <label key={idx} className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-800 dark:text-gray-200">{perm}</span>
                <input className="form-checkbox h-5 w-5 rounded text-primary focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-800" type="checkbox" defaultChecked={idx < 2} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionSettingsPage;
