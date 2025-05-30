import React from 'react';
import { useGitHub } from '../context/GitHubContext';
import AuthForm from './AuthForm';
import RepositoryList from './RepositoryList';
import RepoActions from './RepoActions';

const RepoManager: React.FC = () => {
  const { token, selectedRepo, isLoading, error } = useGitHub();

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0969da] dark:border-[#58a6ff]"></div>
        </div>
      )}

      {!token ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Authentication</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Authenticate with GitHub to manage your repositories.
            </p>
            <div className="mt-4">
              <AuthForm />
            </div>
          </div>
        </div>
      ) : (
        <>
          {!selectedRepo ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Select a Repository</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Choose a repository to perform actions on.
                </p>
                <div className="mt-4">
                  <RepositoryList />
                </div>
              </div>
            </div>
          ) : (
            <RepoActions />
          )}
        </>
      )}
    </div>
  );
};

export default RepoManager;