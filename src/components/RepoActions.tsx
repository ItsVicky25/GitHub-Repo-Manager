import React, { useState } from 'react';
import { useGitHub } from '../context/GitHubContext';
import ReadmeForm from './ReadmeForm';
import FolderForm from './FolderForm';
import { ArrowLeft, BookOpen, FolderPlus } from 'lucide-react';

type ActionType = 'readme' | 'folder' | null;

const RepoActions: React.FC = () => {
  const { selectedRepo, setSelectedRepo } = useGitHub();
  const [currentAction, setCurrentAction] = useState<ActionType>(null);

  if (!selectedRepo) return null;

  const resetAction = () => {
    setCurrentAction(null);
  };

  const renderActionSelector = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Repository Actions</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select an action to perform on <span className="font-medium">{selectedRepo.fullName}</span>
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => setCurrentAction('readme')}
              className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0969da] dark:focus:ring-[#58a6ff] dark:focus:ring-offset-gray-900"
            >
              <BookOpen className="h-5 w-5 mr-2 text-[#0969da] dark:text-[#58a6ff]" />
              Add Comment to README
            </button>
            <button
              onClick={() => setCurrentAction('folder')}
              className="inline-flex items-center px-4 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0969da] dark:focus:ring-[#58a6ff] dark:focus:ring-offset-gray-900"
            >
              <FolderPlus className="h-5 w-5 mr-2 text-[#0969da] dark:text-[#58a6ff]" />
              Create New Folder
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActionForm = () => {
    switch (currentAction) {
      case 'readme':
        return <ReadmeForm onBack={resetAction} />;
      case 'folder':
        return <FolderForm onBack={resetAction} />;
      default:
        return renderActionSelector();
    }
  };

  return (
    <div className="space-y-4">
      {/* Repository header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentAction === null && (
            <button
              onClick={() => setSelectedRepo(null)}
              className="inline-flex items-center mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
            </button>
          )}
          {selectedRepo.fullName}
        </h2>
        <a
          href={selectedRepo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#0969da] dark:text-[#58a6ff] hover:underline"
        >
          View on GitHub
        </a>
      </div>

      {renderActionForm()}
    </div>
  );
};

export default RepoActions