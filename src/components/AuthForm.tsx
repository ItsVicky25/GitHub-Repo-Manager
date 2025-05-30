import React, { useState } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { Info } from 'lucide-react';

const AuthForm: React.FC = () => {
  const [token, setToken] = useState('');
  const { authenticate, isLoading } = useGitHub();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      await authenticate(token.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-blue-400 dark:text-blue-300" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">GitHub Personal Access Token</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                You'll need a GitHub Personal Access Token with repo scope permissions.
                Create one at{' '}
                <a 
                  href="https://github.com/settings/tokens" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium underline"
                >
                  GitHub Token Settings
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Personal Access Token
          </label>
          <div className="mt-1">
            <input
              id="token"
              name="token"
              type="password"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0969da] dark:focus:ring-[#58a6ff] focus:border-[#0969da] dark:focus:border-[#58a6ff] sm:text-sm"
              placeholder="ghp_xxxxxxxxxxxx"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !token.trim()}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading || !token.trim()
              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
              : 'bg-[#0969da] dark:bg-[#58a6ff] hover:bg-[#0550af] dark:hover:bg-[#58a6ff]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0969da] dark:focus:ring-[#58a6ff] dark:focus:ring-offset-gray-900'
          }`}
        >
          {isLoading ? 'Authenticating...' : 'Authenticate'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm