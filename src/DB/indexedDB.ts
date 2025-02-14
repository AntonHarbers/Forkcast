const DB_NAME = 'ForkcastDB';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('MEALS')) {
        db.createObjectStore('MEALS', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('INGREDIENT_BLUEPRINTS')) {
        db.createObjectStore('INGREDIENT_BLUEPRINTS', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('INGREDIENT_UNITS')) {
        db.createObjectStore('INGREDIENT_UNITS', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('STORES')) {
        db.createObjectStore('STORES', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('STORE_CATEGORIES')) {
        db.createObjectStore('STORE_CATEGORIES', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('MEAL_INGREDIENTS')) {
        db.createObjectStore('MEAL_INGREDIENTS', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const storeTransaction = async (
  storeName:
    | 'MEALS'
    | 'INGREDIENT_BLUEPRINTS'
    | 'MEAL_INGREDIENTS'
    | 'INGREDIENT_UNITS'
    | 'STORES'
    | 'STORE_CATEGORIES',
  permission: IDBTransactionMode
): Promise<IDBObjectStore> => {
  const db = await openDB();
  const tx = db.transaction(storeName, permission);
  const store = tx.objectStore(storeName);

  return store;
};
