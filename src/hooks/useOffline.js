import { useState, useEffect } from 'react';
import { offlineTaskService } from '../services/OfflineTaskService';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingTasks();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending tasks on mount
    loadPendingTasks();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingTasks = async () => {
    const tasks = await offlineTaskService.getPendingTasks();
    setPendingTasks(tasks);
  };

  const syncPendingTasks = async () => {
    await offlineTaskService.syncWithServer();
    await loadPendingTasks();
  };

  const createOfflineTask = async (task) => {
    const newTask = await offlineTaskService.addTask(task);
    setPendingTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateOfflineTask = async (taskId, updates) => {
    await offlineTaskService.updateTask(taskId, updates);
    await loadPendingTasks();
  };

  const deleteOfflineTask = async (taskId) => {
    await offlineTaskService.deleteTask(taskId);
    await loadPendingTasks();
  };

  return {
    isOnline,
    pendingTasks,
    createOfflineTask,
    updateOfflineTask,
    deleteOfflineTask,
    syncPendingTasks,
  };
}; 