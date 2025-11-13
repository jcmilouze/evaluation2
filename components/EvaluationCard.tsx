import React, { useMemo } from 'react';
import { type EvaluationData, type Rating } from '../types';
import { EvaluationCriteriaRow } from './EvaluationCriteriaRow';
import { EVALUATION_CRITERIA, RATINGS, RATING_COLORS, RATING_POINTS } from '../constants';
import { GraduationCapIcon } from './Icons';

interface EvaluationCardProps {
  evaluation: EvaluationData;
  onRatingChange: (criterionId: string, rating: Rating) => void;
  onReset: () => void;
}

const RatingPill: React.FC<{ label: string }> = ({ label }) => {
  const ratingKey = label as keyof typeof RATING_COLORS;
  return (
    <div className={`px-3 py-1.5 text-sm font-semibold rounded-md text-center border ${RATING_COLORS[ratingKey]}`}>
      {label}
    </div>
  );
};

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation, onRatingChange, onReset }) => {
    
  const { totalScore, maxScore } = useMemo(() => {
    const maxPoints = Math.max(...Object.values(RATING_POINTS));
    let currentTotal = 0;
    let maxTotal = 0;

    EVALUATION_CRITERIA.forEach(criterion => {
        const weight = criterion.weight || 1;
        const rating = evaluation[criterion.id];
        
        if (rating) {
            const ratingKey = rating as keyof typeof RATING_POINTS;
            currentTotal += RATING_POINTS[ratingKey] * weight;
        }
        maxTotal += maxPoints * weight;
    });

    if (maxTotal === 0) {
        return { totalScore: 0, maxScore: 20 };
    }

    const finalScore = (currentTotal / maxTotal) * 20;

    return { totalScore: finalScore, maxScore: 20 };
  }, [evaluation]);


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-green-600 text-white flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <GraduationCapIcon className="h-10 w-10"/>
          <div>
            <h3 className="text-xl font-bold">Mode Enseignant</h3>
            <p className="opacity-90">Évaluation professionnelle</p>
          </div>
        </div>
        <div className="text-center bg-white/20 rounded-lg p-3 border-2 border-white/50">
          <p className="text-sm font-semibold opacity-90">Note enseignant</p>
          <p className="text-3xl font-bold">{totalScore.toFixed(1)}/{maxScore}</p>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-800 flex items-center">
              <GraduationCapIcon className="h-6 w-6 mr-2 text-yellow-500" />
              Évaluation Enseignant
            </h4>
          </div>
          <div className="grid grid-cols-4 gap-4 flex-1">
            {RATINGS.map(label => <RatingPill key={label} label={label} />)}
          </div>
        </div>
        
        <div className="space-y-2">
          {EVALUATION_CRITERIA.map((criterion, index) => (
            <EvaluationCriteriaRow
              key={criterion.id}
              criterion={criterion}
              currentRating={evaluation[criterion.id]}
              onRatingChange={onRatingChange}
              isLast={index === EVALUATION_CRITERIA.length - 1}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
            <p className="text-xs text-gray-500">Dernière modification : {new Date().toLocaleString('fr-FR')}</p>
            <button onClick={onReset} className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
                Réinitialiser l'évaluation
            </button>
        </div>

      </div>
    </div>
  );
};