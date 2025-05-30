import React, { useEffect, useState } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { Search } from 'lucide-react';
import { Repository } from '../types';

const RepositoryList: React.FC = () => {
  const { repositories, setSelectedRepo } = useGitHub();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRepos(repositories);
      return;
    }
    
    const filtered = repositories.filter(repo => 
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredRepos(filtered);
  }, [searchTerm, repositories]);

  return (
    <div className="space-y-4">
      <div className="relative rounded-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-[#0969da] dark:focus:ring-[#58a6ff] focus:border-[#0969da] dark:focus:border-[#58a6ff] sm:text-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm overflow-hidden">
        {filteredRepos.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No repositories match your search.' : 'No repositories found.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRepos.map((repo) => (
              <li key={repo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <button
                  onClick={() => setSelectedRepo(repo)}
                  className="w-full text-left px-4 py-4 sm:px-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#0969da] dark:text-[#58a6ff] truncate">{repo.name}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        repo.private 
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' 
                          : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                      }`}>
                        {repo.private ? 'Private' : 'Public'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        {repo.description || 'No description'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                      <p>
                        Updated {new Date(repo.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RepositoryList