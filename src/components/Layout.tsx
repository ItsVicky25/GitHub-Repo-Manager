import React, { ReactNode } from 'react';
import { Github } from 'lucide-react';
import { useGitHub } from '../context/GitHubContext';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { token, logout } = useGitHub();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Github className="h-8 w-8 text-[#0969da] dark:text-[#58a6ff]" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900 dark:text-white">GitHub Repo Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {token && (
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0969da] dark:focus:ring-offset-gray-900"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            GitHub Repository Manager — Interact with your repositories with ease
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;