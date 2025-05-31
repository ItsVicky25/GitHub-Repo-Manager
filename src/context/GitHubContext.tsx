import React, { createContext, useContext, useState, ReactNode } from 'react';
import { githubApi } from '../services/githubApi';
import { taskService } from '../services/taskService';
import { Repository, Task, Reminder, GithubContextType } from '../types';

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
    } catch (err: any) {
      console.error('Error in createFolder context function:', err);
      if (err.response?.status === 422) {
        setError('Failed to create folder: It might already exist, or the path is invalid. Please check the folder path.');
      } else if (err.response?.status === 403) {
         setError('Permission denied. Please ensure your GitHub token has the "repo" scope to modify repository contents.');
      }
      else {
        setError(`Failed to create folder: ${err.message || 'Unknown error'}`);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createTask = async (repoFullName: string, task: Task) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(repoFullName, task, token);
      return newTask;
    } catch (err: any) {
      console.error('Error in createTask context function:', err);
      setError(`Failed to create task: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createReminder = async (repoFullName: string, reminder: Reminder) => {
    setIsLoading(true);
    setError(null);
    try {
      const newReminder = await taskService.createReminder(repoFullName, reminder, token);
      return newReminder;
    } catch (err: any) {
      console.error('Error in createReminder context function:', err);
      setError(`Failed to create reminder: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTasks = async (repoFullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const tasks = await taskService.getTasks(repoFullName);
      return tasks;
    } catch (err: any) {
      console.error('Error in getTasks context function:', err);
      setError(`Failed to fetch tasks: ${err.message || 'Unknown error'}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getReminders = async (repoFullName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const reminders = await taskService.getReminders(repoFullName);
      return reminders;
    } catch (err: any) {
      console.error('Error in getReminders context function:', err);
      setError(`Failed to fetch reminders: ${err.message || 'Unknown error'}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (repoFullName: string, taskId: string, updates: Partial<Task>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(repoFullName, taskId, updates, token);
      return updatedTask;
    } catch (err: any) {
      console.error('Error in updateTask context function:', err);
      setError(`Failed to update task: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReminder = async (repoFullName: string, reminderId: string, updates: Partial<Reminder>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedReminder = await taskService.updateReminder(repoFullName, reminderId, updates, token);
      return updatedReminder;
    } catch (err: any) {
      console.error('Error in updateReminder context function:', err);
      setError(`Failed to update reminder: ${err.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (repoFullName: string, taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await taskService.deleteTask(repoFullName, taskId, token);
      return true;
    } catch (err: any) {
      console.error('Error in deleteTask context function:', err);
      setError(`Failed to delete task: ${err.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReminder = async (repoFullName: string, reminderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await taskService.deleteReminder(repoFullName, reminderId, token);
      return true;
    } catch (err: any) {
      console.error('Error in deleteReminder context function:', err);
      setError(`Failed to delete reminder: ${err.message || 'Unknown error'}`);
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
        createTask,
        createReminder,
        getTasks,
        getReminders,
        updateTask,
        updateReminder,
        deleteTask,
        deleteReminder,
        logout,
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
};