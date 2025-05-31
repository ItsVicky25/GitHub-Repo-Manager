import React, { useState } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { ArrowLeft, FolderPlus } from 'lucide-react';
import TaskReminderManager from './TaskReminderManager';

interface FolderFormProps {
  onBack: () => void;
}

const FolderForm: React.FC<FolderFormProps> = ({ onBack }) => {
  const { selectedRepo, createFolder, isLoading } = useGitHub();
  const [folderPath, setFolderPath] = useState('');
  const [initialContent, setInitialContent] = useState('# New Folder\nThis folder was created using the GitHub Repo Manager.\n\n## What to do\n\n- [ ] Add initial steps here\n\n## Tasks\n\n- [ ] Add initial tasks here');
  const [success, setSuccess] = useState(false);
  const [showTaskManager, setShowTaskManager] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRepo || !folderPath.trim()) return;
    
    const success = await createFolder(selectedRepo.fullName, folderPath, initialContent);
    if (success) {
      setSuccess(true);
      setShowTaskManager(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center mr-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Create New Folder</h3>
        </div>
        
        {success && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-400">Folder created successfully!</p>
              </div>
            </div>
          </div>
        )}

        {!showTaskManager ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="folderPath" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Folder Path
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="folderPath"
                  name="folderPath"
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  placeholder="docs/examples"
                  className="shadow-sm focus:ring-[#0969da] dark:focus:ring-[#58a6ff] focus:border-[#0969da] dark:focus:border-[#58a6ff] block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Specify the folder path. Use slashes to create nested folders (e.g., "docs/examples").
              </p>
            </div>

            <div>
              <label htmlFor="initialContent" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Initial README.md Content
              </label>
              <div className="mt-1">
                <textarea
                  id="initialContent"
                  name="initialContent"
                  rows={5}
                  value={initialContent}
                  onChange={(e) => setInitialContent(e.target.value)}
                  className="shadow-sm focus:ring-[#0969da] dark:focus:ring-[#58a6ff] focus:border-[#0969da] dark:focus:border-[#58a6ff] block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Content for the README.md file that will be created in the folder. Markdown is supported.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !folderPath.trim()}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isLoading || !folderPath.trim()
                  ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-[#0969da] dark:bg-[#58a6ff] hover:bg-[#0550af] dark:hover:bg-[#58a6ff]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0969da] dark:focus:ring-[#58a6ff] dark:focus:ring-offset-gray-900'
              }`}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Create Folder
                </>
              )}
            </button>
          </form>
        ) : (
          selectedRepo && (
            <TaskReminderManager
            />
          )
        )}
      </div>
    </div>
  );
};

export default FolderForm;