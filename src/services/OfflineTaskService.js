import { openDB } from 'idb';

const DB_NAME = 'crm-offline-db';
const STORE_NAME = 'offline-tasks';
const DB_VERSION = 1;

class OfflineTaskService {
  constructor() {
    this.db = null;
    this.initDB();
  }

  async initDB() {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
  }

  async addTask(task) {
    const offlineTask = {
      ...task,
      status: 'pending',
      created_at: new Date().toISOString(),
      isOffline: true,
    };

    const id = await this.db.add(STORE_NAME, offlineTask);
    return { ...offlineTask, id };
  }

  async getPendingTasks() {
    return this.db.getAllFromIndex(STORE_NAME, 'status', 'pending');
  }

  async markTaskAsSynced(taskId) {
    const task = await this.db.get(STORE_NAME, taskId);
    if (task) {
      await this.db.delete(STORE_NAME, taskId);
    }
  }

  async updateTask(taskId, updates) {
    const task = await this.db.get(STORE_NAME, taskId);
    if (task) {
      await this.db.put(STORE_NAME, { ...task, ...updates });
    }
  }

  async deleteTask(taskId) {
    await this.db.delete(STORE_NAME, taskId);
  }

  async syncWithServer() {
    const pendingTasks = await this.getPendingTasks();
    
    for (const task of pendingTasks) {
      try {
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        });

        if (response.ok) {
          await this.markTaskAsSynced(task.id);
        } else {
          console.error('Failed to sync task:', task);
        }
      } catch (error) {
        console.error('Error syncing task:', error);
      }
    }
  }
}

export const offlineTaskService = new OfflineTaskService(); 