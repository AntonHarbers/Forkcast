// STORES CRUD

import { StoreInterface } from '../ts/interfaces';
import { storeTransaction } from './indexedDB';

const STORE_NAME = 'STORES';

export const addStore = async (newStore: StoreInterface): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.add(newStore);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getStoreById = async (
  id: string
): Promise<StoreInterface | undefined> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllStores = async (): Promise<StoreInterface[]> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = async () => {
      if (req.result.length === 0) {
        const defaultStore: StoreInterface  = {
          id: '1',
          deletedAt: new Date().toDateString(),
          isDeleted: false,
          location: '-',
          name: 'Default',
        };
        await addStore(defaultStore);
        resolve([defaultStore]);
      } else {
        resolve(req.result);
      }
    };
    req.onerror = () => reject(req.error);
  });
};

// export const deleteStore = async (id: string): Promise<void> => {
//   const store = await storeTransaction(STORE_NAME, 'readwrite');

//   return new Promise((resolve, reject) => {
//     const req = store.delete(id);
//     req.onsuccess = () => resolve();
//     req.onerror = () => reject(req.error);
//   });
// };

export const updateStore = async (
  updatedStore: StoreInterface
): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.put(updatedStore);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
