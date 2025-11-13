import React, { useMemo } from 'react';
import { type Class, type EvaluationData, type RatingLabel } from '../types';
import { SparklesIcon, TrendingUpIcon, TrendingDownIcon, BarChartIcon, PieChartIcon } from '../components/Icons';
import { EVALUATION_CRITERIA, RATING_POINTS, RATING_COLORS, RATINGS } from '../constants';
import { Header } from '../components/Header';

interface StatsPageProps {
  selectedClass: Class;
  evaluations: Record<number, EvaluationData>;
  onBack: () => void;
  onLogout: () => void;
}

const getStudentScore = (evaluation: EvaluationData | undefined) => {
    if (!evaluation) return { score: 0, isEvaluated: false };

    let currentTotal = 0;
    let maxTotal = 0;
    let isEvaluated = false;
    const maxPoints = Math.max(...Object.values(RATING_POINTS));

    EVALUATION_CRITERIA.forEach(criterion => {
        const weight = criterion.weight || 1;
        const rating = evaluation[criterion.id];
        
        if (rating) {
            isEvaluated = true;
            const ratingKey = rating as keyof typeof RATING_POINTS;
            currentTotal += RATING_POINTS[ratingKey] * weight;
        }
        maxTotal += maxPoints * weight;
    });
    
    if (!isEvaluated || maxTotal === 0) {
        return { score: 0, isEvaluated: false };
    }

    return { score: (currentTotal / maxTotal) * 20, isEvaluated: true };
};


export const StatsPage: React.FC<StatsPageProps> = ({ selectedClass, evaluations, onBack, onLogout }) => {
    
  const studentAverages = useMemo(() => {
    return selectedClass.students
      .map(student => {
        const { score, isEvaluated } = getStudentScore(evaluations[student.id]);
        return { student, score, isEvaluated };
      })
      .filter(item => item.isEvaluated)
      .sort((a, b) => b.score - a.score);
  }, [selectedClass, evaluations]);

  const classAverage = useMemo(() => {
    if (studentAverages.length === 0) return 0;
    const total = studentAverages.reduce((sum, item) => sum + item.score, 0);
    return total / studentAverages.length;
  }, [studentAverages]);

  const studentsInDifficulty = useMemo(() => studentAverages.filter(s => s.score < 8), [studentAverages]);
  const topStudents = useMemo(() => studentAverages.filter(s => s.score >= 15), [studentAverages]);

  const criteriaAverages = useMemo(() => {
      const results = EVALUATION_CRITERIA.map(criterion => {
          let totalScore = 0;
          let count = 0;
          const maxPoints = Math.max(...Object.values(RATING_POINTS));

          studentAverages.forEach(({ student }) => {
              const rating = evaluations[student.id]?.[criterion.id];
              if(rating) {
                  const ratingKey = rating as keyof typeof RATING_POINTS;
                  totalScore += RATING_POINTS[ratingKey];
                  count++;
              }
          });
          
          const averagePoints = count > 0 ? totalScore / count : 0;
          const averageOutOf20 = (averagePoints / maxPoints) * 20;

          return {
              id: criterion.id,
              title: criterion.title,
              average: averageOutOf20,
          };
      });
      return results;
  }, [studentAverages, evaluations]);

  const ratingDistribution = useMemo(() => {
      const counts = RATINGS.reduce((acc, rating) => ({ ...acc, [rating]: 0 }), {} as Record<RatingLabel, number>);
      let totalCount = 0;
      
      Object.values(evaluations).forEach(evaluation => {
          Object.values(evaluation).forEach(rating => {
              if (rating) {
                counts[rating]++;
                totalCount++;
              }
          });
      });

      return { counts, totalCount };
  }, [evaluations]);


  return (
    <>
      <Header 
        studentCount={selectedClass.students.length} 
        className={selectedClass.name} 
        onGoHome={onBack} 
        onLogout={onLogout} 
      />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-8">
            <SparklesIcon className="h-8 w-8 mr-3 text-blue-600"/>
            Tableau de Bord de la Classe
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-md font-semibold text-gray-600">Moyenne de la classe</h2>
              <p className="text-4xl font-bold text-blue-600 mt-2">{classAverage.toFixed(2)} / 20</p>
          </div>
           <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-md font-semibold text-gray-600">Élèves évalués</h2>
              <p className="text-4xl font-bold text-blue-600 mt-2">{studentAverages.length} / {selectedClass.students.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-md font-semibold text-gray-600">Élèves en difficulté</h2>
              <p className="text-4xl font-bold text-red-600 mt-2">{studentsInDifficulty.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h2 className="text-md font-semibold text-gray-600">Excellents élèves</h2>
              <p className="text-4xl font-bold text-green-600 mt-2">{topStudents.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><BarChartIcon className="h-6 w-6 mr-2 text-blue-500"/>Analyse par Compétence</h2>
                <div className="space-y-4">
                    {criteriaAverages.map(item => (
                        <div key={item.id}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-600">{item.title}</span>
                                <span className="text-sm font-bold text-gray-800">{item.average.toFixed(1)} / 20</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(item.average / 20) * 100}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4"><PieChartIcon className="h-6 w-6 mr-2 text-blue-500"/>Répartition des Évaluations</h2>
                <div className="space-y-4">
                    {RATINGS.map(rating => {
                        const count = ratingDistribution.counts[rating];
                        const percentage = ratingDistribution.totalCount > 0 ? (count / ratingDistribution.totalCount) * 100 : 0;
                        const ratingKey = rating as keyof typeof RATING_COLORS;
                        const colorClass = RATING_COLORS[ratingKey].split(' ')[0].replace('bg-', 'bg-');
                        
                        return (
                            <div key={rating}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-600">{rating}</span>
                                    <span className="text-sm font-medium text-gray-800">{count} ({percentage.toFixed(0)}%)</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div className={`${colorClass.replace('100', '500')} h-4 rounded-full`} style={{ width: `${percentage}%` }}></div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-red-700 flex items-center mb-4"><TrendingDownIcon className="h-6 w-6 mr-2"/>Élèves en Difficulté (&lt; 8/20)</h2>
                 {studentsInDifficulty.length > 0 ? (
                    <ul className="space-y-2">
                        {studentsInDifficulty.map(({ student, score }) => (
                            <li key={student.id} className="flex justify-between items-center p-2 bg-red-50 rounded-md">
                                <span className="font-medium text-gray-800">{student.name}</span>
                                <span className="font-bold text-red-600">{score.toFixed(2)} / 20</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Aucun élève en grande difficulté.</p>
                )}
            </div>
             <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-green-700 flex items-center mb-4"><TrendingUpIcon className="h-6 w-6 mr-2"/>Meilleurs Élèves (&gt;= 15/20)</h2>
                {topStudents.length > 0 ? (
                    <ul className="space-y-2">
                        {topStudents.map(({ student, score }) => (
                            <li key={student.id} className="flex justify-between items-center p-2 bg-green-50 rounded-md">
                                <span className="font-medium text-gray-800">{student.name}</span>
                                <span className="font-bold text-green-600">{score.toFixed(2)} / 20</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">Aucun élève avec une très bonne maîtrise pour le moment.</p>
                )}
            </div>
        </div>
      
      </main>
    </>
  );
};