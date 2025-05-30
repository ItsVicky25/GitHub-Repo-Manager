import React, { createContext, useContext, useState, ReactNode } from 'react';
import { githubApi } from '../services/githubApi';
import { Repository, GithubContextType } from '../types';

const GitHubContext = createContext<GithubContextType | null>(null);

export const useGitHub = () => {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};

interface GitHubProviderProps {
  children: ReactNode;
}

export const GitHubProvider: React.FC<GitHubProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string>('');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = async (newToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await githubApi.verifyToken(newToken);
      setToken(newToken);
      fetchRepositories(newToken);
      return user;
    } catch (err) {
      setError('Invalid token or authentication failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRepositories = async (accessToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const repos = await githubApi.getRepositories(accessToken);
      setRepositories(repos);
    } catch (err) {
      setError('Failed to fetch repositories');
    } finally {
      setIsLoading(false);
    }
  };

  const addCommentToReadme = async (repoFullName: string, comment: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await githubApi.updateReadme(token, repoFullName, comment);
      return true;
    } catch (err) {
      setError('Failed to update README');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createFolder = async (repoFullName: string, folderPath: string, initialContent?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await githubApi.createFolder(token, repoFullName, folderPath, initialContent);
      return true;
    } catch (err) {
      setError('Failed to create folder');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setRepositories([]);
    setSelectedRepo(null);
  };

  return (
    <GitHubContext.Provider
      value={{
        token,
        repositories,
        selectedRepo,
        isLoading,
        error,
        setSelectedRepo,
        authenticate,
        fetchRepositories,
        addCommentToReadme,
        createFolder,
        logout,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};