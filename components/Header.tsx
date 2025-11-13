
import React from 'react';
import { HomeIcon, UsersIcon, LogOutIcon } from './Icons';

interface HeaderProps {
  studentCount: number;
  className: string;
  onGoHome: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ studentCount, className, onGoHome, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <button onClick={onGoHome} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <HomeIcon className="h-6 w-6" />
             </button>
            <h1 className="text-xl font-semibold text-gray-800">Évaluation Comportementale</h1>
            <span className="hidden sm:inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {className}
            </span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
             <div className="flex items-center space-x-2 text-sm text-gray-500">
               <UsersIcon className="h-4 w-4"/>
               <span>Élèves: {studentCount}</span>
             </div>
             <button onClick={onLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                <LogOutIcon className="h-5 w-5" />
                <span className="hidden sm:inline text-sm font-medium">Déconnexion</span>
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};
