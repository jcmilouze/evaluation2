
import React, { useState } from 'react';
import { type Class } from '../types';
import { UsersIcon, GraduationCapIcon, SparklesIcon, TrashIcon } from '../components/Icons';

interface LoginPageProps {
  classes: Class[];
  selectedClassId: string | null;
  onSelectClass: (id: string | null) => void;
  onAddClass: (name: string) => void;
  onDeleteClass: (id: string) => void;
  onNavigate: (view: 'evaluation' | 'students' | 'stats') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  onAddClass,
  onDeleteClass,
  onNavigate
}) => {
  const [newClassName, setNewClassName] = useState('');

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    onAddClass(newClassName);
    setNewClassName('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <SparklesIcon className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Gestionnaire d'Évaluation
            </h1>
            <p className="mt-2 text-sm text-gray-600">
            Sélectionnez une classe pour commencer ou créez-en une nouvelle.
            </p>
        </div>
        
        <form onSubmit={handleAddClass} className="flex gap-2">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Nom de la nouvelle classe..."
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Créer
            </button>
        </form>

        <div className="border-t border-gray-200 pt-6">
          <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
            Choisir une classe existante :
          </label>
          <div className="flex items-center gap-2">
            <select
                id="class-select"
                value={selectedClassId || ''}
                onChange={(e) => onSelectClass(e.target.value || null)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="">-- Sélectionnez une classe --</option>
                {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            {selectedClassId && (
                <button
                    onClick={() => onDeleteClass(selectedClassId)}
                    className="p-2.5 text-gray-500 bg-gray-100 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
                    aria-label="Supprimer la classe sélectionnée"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            )}
           </div>
        </div>
        
        {selectedClassId && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <ActionButton 
                icon={<GraduationCapIcon className="h-5 w-5 mr-2" />}
                label="Évaluer"
                onClick={() => onNavigate('evaluation')}
            />
            <ActionButton 
                icon={<UsersIcon className="h-5 w-5 mr-2" />}
                label="Gérer élèves"
                onClick={() => onNavigate('students')}
            />
            <ActionButton 
                icon={<SparklesIcon className="h-5 w-5 mr-2" />}
                label="Statistiques"
                onClick={() => onNavigate('stats')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onClick }) => (
     <button
        onClick={onClick}
        className="flex items-center justify-center w-full bg-gray-100 text-gray-800 px-4 py-3 rounded-md font-medium hover:bg-gray-200 hover:text-blue-600 transition-colors"
     >
        {icon}
        {label}
    </button>
);
