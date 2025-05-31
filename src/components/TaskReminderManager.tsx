import React, { useState, useEffect } from 'react';
import { useGitHub } from '../context/GitHubContext';
import { CheckCircle, AlertCircle, Trash2, Plus } from 'lucide-react';
import { Task, Reminder } from '../types';

const TaskReminderManager: React.FC = () => {
  const { 
    repositories,
    selectedRepo,
    setSelectedRepo,
    createTask, 
    createReminder, 
    getTasks, 
    getReminders, 
    updateTask, 
    updateReminder, 
    deleteTask, 
    deleteReminder,
    isLoading 
  } = useGitHub();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending'
  });
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    reminderDate: '',
    isActive: true
  });

  useEffect(() => {
    if (selectedRepo) {
      loadTasksAndReminders();
    }
  }, [selectedRepo]);

  const loadTasksAndReminders = async () => {
    if (!selectedRepo) return;
    const loadedTasks = await getTasks(selectedRepo.fullName);
    const loadedReminders = await getReminders(selectedRepo.fullName);
    setTasks(loadedTasks);
    setReminders(loadedReminders);
  };

  const handleAddTask = async () => {
    if (!selectedRepo || !newTask.title || !newTask.dueDate) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      dueDate: newTask.dueDate,
      priority: newTask.priority || 'medium',
      status: 'pending',
      repo: selectedRepo.fullName
    };

    const createdTask = await createTask(selectedRepo.fullName, task);
    if (createdTask) {
      setTasks([...tasks, createdTask]);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        status: 'pending'
      });
      setShowTaskForm(false);
    }
  };

  const handleAddReminder = async () => {
    if (!selectedRepo || !newReminder.title || !newReminder.reminderDate) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      description: newReminder.description || '',
      reminderDate: newReminder.reminderDate,
      isActive: true,
      repo: selectedRepo.fullName
    };

    const createdReminder = await createReminder(selectedRepo.fullName, reminder);
    if (createdReminder) {
      setReminders([...reminders, createdReminder]);
      setNewReminder({
        title: '',
        description: '',
        reminderDate: '',
        isActive: true
      });
      setShowReminderForm(false);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!selectedRepo) return;
    const updatedTask = await updateTask(selectedRepo.fullName, taskId, updates);
    if (updatedTask) {
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    }
  };

  const handleUpdateReminder = async (reminderId: string, updates: Partial<Reminder>) => {
    if (!selectedRepo) return;
    const updatedReminder = await updateReminder(selectedRepo.fullName, reminderId, updates);
    if (updatedReminder) {
      setReminders(reminders.map(reminder => reminder.id === reminderId ? updatedReminder : reminder));
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!selectedRepo) return;
    const success = await deleteTask(selectedRepo.fullName, taskId);
    if (success) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (!selectedRepo) return;
    const success = await deleteReminder(selectedRepo.fullName, reminderId);
    if (success) {
      setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Repository Selection */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Select Repository</h2>
        <select
          value={selectedRepo?.fullName || ''}
          onChange={(e) => {
            const repo = repositories.find(r => r.fullName === e.target.value);
            setSelectedRepo(repo || null);
          }}
          className="input-field"
        >
          <option value="">Select a repository</option>
          {repositories.map(repo => (
            <option key={repo.id} value={repo.fullName}>
              {repo.fullName}
            </option>
          ))}
        </select>
      </div>

      {selectedRepo && (
        <>
          {/* Tasks Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks</h2>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </button>
            </div>

            {showTaskForm && (
              <div className="mb-6 p-4 border dark:border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="input-field"
                  />
                  <textarea
                    placeholder="Task Description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="input-field"
                  />
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="input-field"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <button
                    onClick={handleAddTask}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {tasks.map(task => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{task.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{task.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{task.dueDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleUpdateTask(task.id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
                          className={`text-sm ${
                            task.status === 'completed' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <AlertCircle className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reminders</h2>
              <button
                onClick={() => setShowReminderForm(!showReminderForm)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </button>
            </div>

            {showReminderForm && (
              <div className="mb-6 p-4 border dark:border-gray-700 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Reminder Title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    className="input-field"
                  />
                  <textarea
                    placeholder="Reminder Description"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="datetime-local"
                    value={newReminder.reminderDate}
                    onChange={(e) => setNewReminder({ ...newReminder, reminderDate: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="email"
                    placeholder="Reminder Email (Optional)"
                    value={newReminder.email || ''}
                    onChange={(e) => setNewReminder({ ...newReminder, email: e.target.value })}
                    className="input-field"
                  />
                  <button
                    onClick={handleAddReminder}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? 'Adding...' : 'Add Reminder'}
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reminder Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reminders.map(reminder => (
                    <tr key={reminder.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{reminder.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{reminder.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(reminder.reminderDate).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${reminder.isActive ? 'status-active' : 'status-inactive'}`}>
                          {reminder.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateReminder(reminder.id, { isActive: !reminder.isActive })}
                            className={`text-sm ${
                              reminder.isActive 
                                ? 'text-green-600 dark:text-green-400' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            {reminder.isActive ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <AlertCircle className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteReminder(reminder.id)}
                            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskReminderManager; 