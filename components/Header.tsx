import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightAction, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200/80 bg-background-light/80 px-4 backdrop-blur-sm dark:border-gray-800/80 dark:bg-background-dark/80 print:static print:border-b-2 print:bg-white">
      <div className="flex size-10 shrink-0 items-center justify-start print:hidden">
        {showBack && (
          <button 
            onClick={handleBack}
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-inherit hover:bg-gray-200/50 dark:hover:bg-gray-800/50"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
          </button>
        )}
      </div>
      <h1 className="flex-1 text-center text-lg font-bold truncate px-2 print:text-left print:px-0 print:text-black">{title}</h1>
      <div className="flex min-w-[2.5rem] shrink-0 items-center justify-end print:hidden">
        {rightAction}
      </div>
    </header>
  );
};

export default Header;