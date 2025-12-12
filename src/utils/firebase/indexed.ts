
import { logger } from '../logger';

const DB_NAME = 'AS_Study_Dashboard';
const STORE_NAME = 'userData';

let db: IDBDatabase | null = null;
let connectionPromise: Promise<IDBDatabase> | null = null;

export const openDB = (): Promise<IDBDatabase> => {
  // CRITICAL FIX: Reject if IndexedDB is missing instead of resolving empty object
  // This allows dbPut/dbGet catch blocks to handle the failure gracefully
  if (typeof indexedDB === 'undefined') {
      return Promise.reject("IndexedDB not supported in this environment");
  }
  
  if (db) return Promise.resolve(db);
  
  // Singleton Promise to prevent multiple simultaneous open requests
  if (connectionPromise) return connectionPromise;

  connectionPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2);
    
    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      db = database;
      resolve(database);
    };
    
    request.onerror = (e) => {
        logger.warn("IndexedDB Open Error", e);
        connectionPromise = null; // Reset on failure
        reject(e);
    };
  });
  
  return connectionPromise;
};

export const dbPut = async (storeName: string, data: { id: string; value: any }) => {
  try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(data);
  } catch (e) { 
      // Gracefully fail if IDB is unavailable
      // console.debug("IndexedDB Put skipped:", e); 
  }
};

export const dbGet = async (id: string): Promise<any> => {
    try {
        const database = await openDB();
        return new Promise((resolve) => {
            const transaction = database.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result ? request.result.value : null);
            request.onerror = () => resolve(null);
        });
    } catch (e) { 
        // Gracefully return null if IDB is unavailable
        return null; 
    }
};

export const dbClear = async (storeName: string) => {
  try {
      const database = await openDB();
      const transaction = database.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
  } catch (e) { 
      // Gracefully fail
  }
};

export const cleanupStorage = () => {
    try {
        if (db) {
            db.close();
            db = null;
            connectionPromise = null;
        }
    } catch (e) {
        logger.warn("Storage cleanup failed", e);
    }
};
