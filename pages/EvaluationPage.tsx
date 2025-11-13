
import React, { useState, useMemo, useCallback } from 'react';
import { Header } from '../components/Header';
import { StudentNavigator } from '../components/StudentNavigator';
import { EvaluationCard } from '../components/EvaluationCard';
import { CommentSection } from '../components/CommentSection';
import { type Class, type EvaluationData, type Rating } from '../types';
import { EVALUATION_CRITERIA } from '../constants';
import { generateComment as generateCommentFromApi } from '../services/geminiService';

interface EvaluationPageProps {
  selectedClass: Class;
  evaluations: Record<number, EvaluationData>;
  comments: Record<number, string>;
  generatedComments: Record<number, string>;
  onRatingChange: (studentId: number, criterionId: string, rating: Rating) => void;
  onCommentChange: (studentId: number, comment: string) => void;
  onGeneratedComment: (studentId: number, comment: string) => void;
  onResetEvaluation: (studentId: number) => void;
  onGoHome: () => void;
  onLogout: () => void;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({
  selectedClass,
  evaluations,
  comments,
  generatedComments,
  onRatingChange,
  onCommentChange,
  onGeneratedComment,
  onResetEvaluation,
  onGoHome,
  onLogout
}) => {
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const students = selectedClass.students;

  const currentStudent = useMemo(() => students[currentStudentIndex], [students, currentStudentIndex]);
  const currentEvaluation = useMemo(() => evaluations[currentStudent?.id] || {}, [evaluations, currentStudent]);
  const currentComment = useMemo(() => comments[currentStudent?.id] || '', [comments, currentStudent]);
  const currentGeneratedComment = useMemo(() => generatedComments[currentStudent?.id] || '', [generatedComments, currentStudent]);

  const handleRatingChange = useCallback((criterionId: string, rating: Rating) => {
    if (currentStudent) {
      onRatingChange(currentStudent.id, criterionId, rating);
    }
  }, [currentStudent, onRatingChange]);

  const handleCommentChange = useCallback((comment: string) => {
    if (currentStudent) {
      onCommentChange(currentStudent.id, comment);
    }
  }, [currentStudent, onCommentChange]);

  const handleGenerateComment = useCallback(async () => {
    if (!currentStudent) return;
    setIsGenerating(true);
    try {
      const comment = await generateCommentFromApi(currentEvaluation, EVALUATION_CRITERIA);
      onGeneratedComment(currentStudent.id, comment);
    } catch (error) {
      console.error("Failed to generate comment:", error);
      alert("An error occurred while generating the comment. Please check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  }, [currentEvaluation, currentStudent, onGeneratedComment]);
  
  const handleReset = useCallback(() => {
      if(currentStudent) {
        onResetEvaluation(currentStudent.id);
      }
  }, [currentStudent, onResetEvaluation]);

  const handleNextStudent = () => {
    if (currentStudentIndex < students.length - 1) {
      setCurrentStudentIndex(prev => prev + 1);
    }
  };

  const handlePrevStudent = () => {
    if (currentStudentIndex > 0) {
      setCurrentStudentIndex(prev => prev - 1);
    }
  };

  if (students.length === 0) {
      return (
          <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
              <Header studentCount={0} className={selectedClass.name} onGoHome={onGoHome} onLogout={onLogout} />
              <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
                  <h2 className="text-xl font-semibold text-gray-700">Aucun élève dans cette classe.</h2>
                  <p className="text-gray-500 mt-2">Veuillez retourner à l'accueil pour gérer les élèves.</p>
              </main>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Header studentCount={students.length} className={selectedClass.name} onGoHome={onGoHome} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <StudentNavigator
          student={currentStudent}
          currentIndex={currentStudentIndex}
          totalStudents={students.length}
          onNext={handleNextStudent}
          onPrev={handlePrevStudent}
        />
        <div className="mt-6 space-y-6">
          <EvaluationCard
            evaluation={currentEvaluation}
            onRatingChange={handleRatingChange}
            onReset={handleReset}
          />
          <CommentSection
            comment={currentComment}
            generatedComment={currentGeneratedComment}
            onCommentChange={handleCommentChange}
            onGenerateComment={handleGenerateComment}
            isGenerating={isGenerating}
          />
        </div>
      </main>
    </div>
  );
};
