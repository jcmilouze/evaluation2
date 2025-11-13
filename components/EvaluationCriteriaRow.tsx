
import React from 'react';
import { type EvaluationCriterion, type Rating, type RatingLabel } from '../types';
import { RATINGS } from '../constants';
import { GraduationCapIcon } from './Icons';


interface EvaluationCriteriaRowProps {
  criterion: EvaluationCriterion;
  currentRating: Rating;
  onRatingChange: (criterionId: string, rating: Rating) => void;
  isLast: boolean;
}

export const EvaluationCriteriaRow: React.FC<EvaluationCriteriaRowProps> = ({ criterion, currentRating, onRatingChange, isLast }) => {
  return (
    <div className={`flex items-center p-4 rounded-lg transition-colors bg-green-50/50 ${!isLast ? 'border-b border-gray-200' : ''}`}>
      <div className="flex-1 pr-4">
        <div className="flex items-center mb-1">
          <criterion.icon className="h-6 w-6 mr-3 text-blue-500" />
          <h5 className="font-bold text-md text-gray-800">{criterion.title}</h5>
        </div>
        <p className="text-sm text-gray-600 ml-9">{criterion.description}</p>
      </div>
      <div className="grid grid-cols-4 gap-4 flex-1">
        {RATINGS.map((rating) => (
          <label key={rating} className="flex flex-col items-center justify-center cursor-pointer space-y-2">
            <input
              type="radio"
              name={`${criterion.id}-rating`}
              value={rating}
              checked={currentRating === rating}
              onChange={() => onRatingChange(criterion.id, rating as RatingLabel)}
              className="sr-only peer"
            />
            <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all peer-checked:border-blue-600 peer-checked:bg-blue-600">
                <div className="w-2 h-2 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></div>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
                <GraduationCapIcon className="h-4 w-4 text-yellow-600"/>
                <span>Prof</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
