
import React, { useState } from 'react';
import { LockKeyholeIcon } from '../components/Icons';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'jfayolle' && password === 'Evaluation1968!') {
      setError(null);
      onLoginSuccess();
    } else {
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
            <LockKeyholeIcon className="mx-auto h-12 w-12 text-blue-600" />
            <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Accès Enseignant
            </h1>
            <p className="mt-2 text-sm text-gray-600">
            Veuillez vous connecter pour continuer.
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                 <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Identifiant
                </label>
                <div className="mt-1">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="jfayolle"
                    />
                </div>
            </div>
           
            <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-700">
                    Mot de passe
                </label>
                <div className="mt-1">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            
            <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Connexion
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};
