export interface User {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  repo?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  reminderDate: string;
  isActive: boolean;
  repo?: string;
  email?: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string;
  private: boolean;
  htmlUrl: string;
  defaultBranch: string;
}

export interface GithubContextType {
  token: string;
  repositories: Repository[];
  selectedRepo: Repository | null;
  isLoading: boolean;
  error: string | null;
  setSelectedRepo: (repo: Repository | null) => void;
  authenticate: (token: string) => Promise<any>;
  fetchRepositories: (token: string) => Promise<void>;
  addCommentToReadme: (repoFullName: string, comment: string) => Promise<boolean>;
  createFolder: (repoFullName: string, folderPath: string, initialContent?: string) => Promise<boolean>;
  createTask: (repoFullName: string, task: Task) => Promise<Task | null>;
  createReminder: (repoFullName: string, reminder: Reminder) => Promise<Reminder | null>;
  getTasks: (repoFullName: string) => Promise<Task[]>;
  getReminders: (repoFullName: string) => Promise<Reminder[]>;
  updateTask: (repoFullName: string, taskId: string, updates: Partial<Task>) => Promise<Task | null>;
  updateReminder: (repoFullName: string, reminderId: string, updates: Partial<Reminder>) => Promise<Reminder | null>;
  deleteTask: (repoFullName: string, taskId: string) => Promise<boolean>;
  deleteReminder: (repoFullName: string, reminderId: string) => Promise<boolean>;
  logout: () => void;
}