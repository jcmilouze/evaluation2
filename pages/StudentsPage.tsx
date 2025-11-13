
import React, { useState } from 'react';
import { type Class, type Student } from '../types';
import { TrashIcon, UsersIcon } from '../components/Icons';
import { Header } from '../components/Header';

interface StudentsPageProps {
  selectedClass: Class;
  onAddStudent: (name: string) => void;
  onDeleteStudent: (id: number) => void;
  onBack: () => void;
  onLogout: () => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ selectedClass, onAddStudent, onDeleteStudent, onBack, onLogout }) => {
  const [newStudentName, setNewStudentName] = useState('');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent(newStudentName);
    setNewStudentName('');
  };

  return (
    <>
      <Header 
        studentCount={selectedClass.students.length} 
        className={selectedClass.name} 
        onGoHome={onBack} 
        onLogout={onLogout} 
      />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-8">
            <UsersIcon className="h-8 w-8 mr-3 text-blue-600"/>
            Gestion des Élèves
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleAddStudent} className="flex gap-3 mb-6 pb-6 border-b border-gray-200">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Nom complet de l'élève..."
              className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Ajouter
            </button>
          </form>
          
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Liste des élèves ({selectedClass.students.length})</h2>
          
          {selectedClass.students.length > 0 ? (
              <ul className="space-y-3">
              {selectedClass.students.map((student, index) => (
                  <li
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                  >
                  <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 mr-4 w-6 text-right">{index + 1}.</span>
                      <span className="text-md text-gray-800">{student.name}</span>
                  </div>
                  <button
                      onClick={() => onDeleteStudent(student.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"
                      aria-label={`Supprimer ${student.name}`}
                  >
                      <TrashIcon className="h-5 w-5" />
                  </button>
                  </li>
              ))}
              </ul>
          ) : (
              <p className="text-center text-gray-500 py-4">Aucun élève dans cette classe pour le moment.</p>
          )}
        </div>
      </main>
    </>
  );
};
