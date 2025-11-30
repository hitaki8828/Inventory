import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightAction }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200/80 bg-background-light/80 px-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80">
      <div className="flex size-10 shrink-0 items-center justify-start">
        {showBack && (
          <button 
            onClick={() => navigate(-1)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-inherit hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-lg font-bold truncate px-2">{title}</h1>
      <div className="flex size-10 shrink-0 items-center justify-end">
        {rightAction}
      </div>
    </header>
  );
};

export default Header;
