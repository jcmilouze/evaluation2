
import React from 'react';
import { type Student } from '../types';

interface StudentNavigatorProps {
  student: Student;
  currentIndex: number;
  totalStudents: number;
  onPrev: () => void;
  onNext: () => void;
}

export const StudentNavigator: React.FC<StudentNavigatorProps> = ({
  student,
  currentIndex,
  totalStudents,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
        <p className="text-sm text-gray-500">Élève {currentIndex + 1} sur {totalStudents}</p>
      </div>
      <button
        onClick={onNext}
        disabled={currentIndex === totalStudents - 1}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </div>
  );
};
