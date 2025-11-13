
import React from 'react';
import { SparklesIcon, InfoIcon } from './Icons';

interface CommentSectionProps {
  comment: string;
  generatedComment: string;
  onCommentChange: (comment: string) => void;
  onGenerateComment: () => void;
  isGenerating: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comment,
  generatedComment,
  onCommentChange,
  onGenerateComment,
  isGenerating,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h4 className="font-bold text-lg text-gray-800 flex items-center mb-4">
        <SparklesIcon className="h-6 w-6 mr-2 text-yellow-500" />
        Commentaire d'évaluation (Enseignant)
      </h4>
      <button
        onClick={onGenerateComment}
        disabled={isGenerating}
        className="flex items-center justify-center w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-wait"
      >
        {isGenerating ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération en cours...
            </>
        ) : (
            <>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Générer un commentaire
            </>
        )}
      </button>

      {generatedComment && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-r-lg">
          <div className="flex">
            <div className="py-1"><InfoIcon className="h-5 w-5 text-blue-400 mr-3"/></div>
            <div>
              <p className="text-sm">{generatedComment}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-1">
            Commentaires et observations
        </label>
        <textarea
          id="observations"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Ajouter des observations manuelles ici..."
        />
      </div>
    </div>
  );
};
