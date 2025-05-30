export interface User {
  id: number;
  username: string;
  avatarUrl: string;
}

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  updatedAt: string;
  url: string;
  defaultBranch: string;
}

export interface GithubContextType {
  token: string;
  repositories: Repository[];
  selectedRepo: Repository | null;
  isLoading: boolean;
  error: string | null;
  setSelectedRepo: (repo: Repository | null) => void;
  authenticate: (token: string) => Promise<User | null>;
  fetchRepositories: (token: string) => void;
  addCommentToReadme: (repoFullName: string, comment: string) => Promise<boolean>;
  createFolder: (repoFullName: string, folderPath: string, initialContent?: string) => Promise<boolean>;
  logout: () => void;
}