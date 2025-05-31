import { Task, Reminder } from '../types';
import { githubApi } from './githubApi';

class TaskService {
  private static instance: TaskService;
  private tasks: Map<string, Task[]>;
  private reminders: Map<string, Reminder[]>;

  private constructor() {
    this.tasks = new Map();
    this.reminders = new Map();
  }

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  public async createTask(repoFullName: string, task: Task, token: string): Promise<Task> {
    const tasks = this.tasks.get(repoFullName) || [];
    tasks.push(task);
    this.tasks.set(repoFullName, tasks);
    
    // Update the repository's README.md with the new task
    await this.updateTasksFile(repoFullName, token);
    
    return task;
  }

  public async createReminder(repoFullName: string, reminder: Reminder, token: string): Promise<Reminder> {
    const reminders = this.reminders.get(repoFullName) || [];
    reminders.push(reminder);
    this.reminders.set(repoFullName, reminders);
    
    // Update the repository's README.md with the new reminder
    await this.updateRemindersFile(repoFullName, token);
    
    return reminder;
  }

  public async getTasks(repoFullName: string): Promise<Task[]> {
    return this.tasks.get(repoFullName) || [];
  }

  public async getReminders(repoFullName: string): Promise<Reminder[]> {
    return this.reminders.get(repoFullName) || [];
  }

  public async updateTask(repoFullName: string, taskId: string, updates: Partial<Task>, token: string): Promise<Task> {
    const tasks = this.tasks.get(repoFullName) || [];
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    this.tasks.set(repoFullName, tasks);
    
    await this.updateTasksFile(repoFullName, token);
    
    return tasks[taskIndex];
  }

  public async updateReminder(repoFullName: string, reminderId: string, updates: Partial<Reminder>, token: string): Promise<Reminder> {
    const reminders = this.reminders.get(repoFullName) || [];
    const reminderIndex = reminders.findIndex(r => r.id === reminderId);
    
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    reminders[reminderIndex] = { ...reminders[reminderIndex], ...updates };
    this.reminders.set(repoFullName, reminders);
    
    await this.updateRemindersFile(repoFullName, token);
    
    return reminders[reminderIndex];
  }

  public async deleteTask(repoFullName: string, taskId: string, token: string): Promise<void> {
    const tasks = this.tasks.get(repoFullName) || [];
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    this.tasks.set(repoFullName, filteredTasks);
    
    await this.updateTasksFile(repoFullName, token);
  }

  public async deleteReminder(repoFullName: string, reminderId: string, token: string): Promise<void> {
    const reminders = this.reminders.get(repoFullName) || [];
    const filteredReminders = reminders.filter(r => r.id !== reminderId);
    this.reminders.set(repoFullName, filteredReminders);
    
    await this.updateRemindersFile(repoFullName, token);
  }

  private async updateTasksFile(repoFullName: string, token: string): Promise<void> {
    const tasks = this.tasks.get(repoFullName) || [];
    const tasksContent = `# Tasks\n\n${tasks.map(task => `
## ${task.title}
- Description: ${task.description}
- Due Date: ${task.dueDate}
- Priority: ${task.priority}
- Status: ${task.status}
`).join('\n')}`;

    try {
      await githubApi.updateReadme(token, repoFullName, tasksContent);
      console.log(`Successfully updated README for tasks in ${repoFullName}`);
    } catch (error) {
      console.error(`Error updating README for tasks in ${repoFullName}:`, error);
      // Depending on how you want to handle this, you might re-throw or handle internally
      throw error; // Re-throw the error to be caught by the context
    }
  }

  private async updateRemindersFile(repoFullName: string, token: string): Promise<void> {
    const reminders = this.reminders.get(repoFullName) || [];
    const remindersContent = `# Reminders\n\n${reminders.map(reminder => `
## ${reminder.title}
- Description: ${reminder.description}
- Reminder Date: ${reminder.reminderDate}
- Status: ${reminder.isActive ? 'Active' : 'Inactive'}
`).join('\n')}`;

    try {
      await githubApi.updateReadme(token, repoFullName, remindersContent);
      console.log(`Successfully updated README for reminders in ${repoFullName}`);
    } catch (error) {
      console.error(`Error updating README for reminders in ${repoFullName}:`, error);
      throw error; // Re-throw the error
    }
  }
}

export const taskService = TaskService.getInstance(); 