// STORE_CATEGORIES CRUD

import { CategoryInterface } from '../ts/interfaces';
import { storeTransaction } from './indexedDB';

const STORE_NAME = 'STORE_CATEGORIES';

export const addStoreCategory = async (
  newCategory: CategoryInterface
): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.add(newCategory);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getStoreCategoryById = async (
  id: string
): Promise<CategoryInterface | undefined> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllStoreCategories = async (): Promise<CategoryInterface[]> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

// export const deleteStoreCategory = async (id: string): Promise<void> => {
//   const store = await storeTransaction(STORE_NAME, 'readwrite');

//   return new Promise((resolve, reject) => {
//     const req = store.delete(id);
//     req.onsuccess = () => resolve();
//     req.onerror = () => reject(req.error);
//   });
// };

export const updateStoreCategories = async (
  updatedCategory: CategoryInterface
): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.put(updatedCategory);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
