import React, { useState, useEffect } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { ArrowLeft, Save } from 'lucide-react';
import { githubApi } from '../services/githubApi';
import ReactMarkdown from 'react-markdown';

interface ReadmeFormProps {
  onBack: () => void;
}

const ReadmeForm: React.FC<ReadmeFormProps> = ({ onBack }) => {
  const { selectedRepo, token, addCommentToReadme, isLoading } = useGitHub();
  const [comment, setComment] = useState('');
  const [readmePreview, setReadmePreview] = useState<string | null>(null);
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedRepo) {
      fetchReadmeContent();
    }
  }, [selectedRepo]);

  const fetchReadmeContent = async () => {
    if (!selectedRepo || !token) return;
    
    setIsLoadingReadme(true);
    try {
      const { content } = await githubApi.getReadmeContent(token, selectedRepo.fullName);
      setReadmePreview(content);
    } catch (error) {
      setReadmePreview('*No README.md found in this repository*');
    } finally {
      setIsLoadingReadme(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRepo || !comment.trim()) return;
    
    const success = await addCommentToReadme(selectedRepo.fullName, comment);
    if (success) {
      setSuccess(true);
      setReadmePreview(prev => prev ? `${prev}\n\n${comment}` : comment);
      setComment('');
      
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
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Add Comment to README</h3>
        </div>
        
        {success && (
          <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-green-700 dark:text-green-400">Comment added successfully!</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Your Comment
                </label>
                <div className="mt-1">
                  <textarea
                    id="comment"
                    name="comment"
                    rows={8}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add your comment in Markdown format..."
                    className="shadow-sm focus:ring-[#0969da] dark:focus:ring-[#58a6ff] focus:border-[#0969da] dark:focus:border-[#58a6ff] block w-full sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Markdown formatting is supported.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || !comment.trim()}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isLoading || !comment.trim()
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-[#0969da] dark:bg-[#58a6ff] hover:bg-[#0550af] dark:hover:bg-[#58a6ff]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0969da] dark:focus:ring-[#58a6ff] dark:focus:ring-offset-gray-900'
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Comment
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="border dark:border-gray-700 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">README Preview</h4>
            <div className="prose dark:prose-invert prose-sm max-w-none overflow-auto max-h-96">
              {isLoadingReadme ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0969da] dark:border-[#58a6ff]"></div>
                </div>
              ) : (
                <ReactMarkdown>{readmePreview || '*No content to display*'}</ReactMarkdown>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadmeForm