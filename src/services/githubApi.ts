import axios from 'axios';
import { Repository, User } from '../types';

const GITHUB_API_URL = 'https://api.github.com';

// Helper functions for base64 encoding/decoding
const base64Decode = (str: string): string => {
  // First decode base64 to binary string
  const binaryStr = atob(str);
  // Convert binary string to Uint8Array
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  // Convert Uint8Array to UTF-8 string
  return new TextDecoder('utf-8').decode(bytes);
};

const base64Encode = (str: string): string => {
  // Convert string to Uint8Array
  const bytes = new TextEncoder().encode(str);
  // Convert Uint8Array to binary string
  let binaryStr = '';
  bytes.forEach(byte => binaryStr += String.fromCharCode(byte));
  // Convert binary string to base64
  return btoa(binaryStr);
};

export const githubApi = {
  verifyToken: async (token: string): Promise<User> => {
    try {
      const response = await axios.get(`${GITHUB_API_URL}/user`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      return {
        id: response.data.id,
        username: response.data.login,
        avatarUrl: response.data.avatar_url,
      };
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new Error('Invalid token or authentication failed');
    }
  },

  getRepositories: async (token: string): Promise<Repository[]> => {
    try {
      const response = await axios.get(`${GITHUB_API_URL}/user/repos?sort=updated`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      return response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        private: repo.private,
        updatedAt: repo.updated_at,
        url: repo.html_url,
        defaultBranch: repo.default_branch,
      }));
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw new Error('Failed to fetch repositories');
    }
  },

  getReadmeContent: async (token: string, repoFullName: string): Promise<{ content: string; sha: string }> => {
    try {
      const response = await axios.get(`${GITHUB_API_URL}/repos/${repoFullName}/contents/README.md`, {
        headers: {
          Authorization: `token ${token}`,
        },
      });
      
      const content = base64Decode(response.data.content);
      return {
        content,
        sha: response.data.sha,
      };
    } catch (error) {
      console.error('Error fetching README:', error);
      throw new Error('Failed to fetch README content');
    }
  },

  updateReadme: async (token: string, repoFullName: string, newComment: string): Promise<void> => {
    try {
      // First get the current README content and its SHA
      const { content, sha } = await githubApi.getReadmeContent(token, repoFullName);
      
      // Append the new comment to the existing content
      const updatedContent = `${content}\n\n${newComment}`;
      
      // Update the README
      await axios.put(
        `${GITHUB_API_URL}/repos/${repoFullName}/contents/README.md`,
        {
          message: 'Add comment to README',
          content: base64Encode(updatedContent),
          sha,
        },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error('Error updating README:', error);
      if (error.response?.status === 403) {
        throw new Error('Permission denied. Please ensure your GitHub token has the "repo" scope to modify repository contents. You can update your token permissions at GitHub Token Settings.');
      }
      throw new Error('Failed to update README');
    }
  },

  createFolder: async (
    token: string, 
    repoFullName: string, 
    folderPath: string, 
    initialContent: string = "# New Folder\nThis folder was created using the GitHub Repo Manager."
  ): Promise<void> => {
    try {
      // GitHub doesn't allow creating empty folders, so we'll create a README.md file inside
      const filePath = `${folderPath}/README.md`;
      
      await axios.put(
        `${GITHUB_API_URL}/repos/${repoFullName}/contents/${filePath}`,
        {
          message: `Create folder: ${folderPath}`,
          content: base64Encode(initialContent),
        },
        {
          headers: {
            Authorization: `token ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error('Error creating folder:', error);
      if (error.response?.status === 403) {
        throw new Error('Permission denied. Please ensure your GitHub token has the "repo" scope to modify repository contents. You can update your token permissions at GitHub Token Settings.');
      }
      throw new Error('Failed to create folder');
    }
  },
};