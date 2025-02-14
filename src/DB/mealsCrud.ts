// MEALS CRUD

import { MealInterface } from '../ts/interfaces';
import { storeTransaction } from './indexedDB';

const STORE_NAME = 'MEALS';

export const addMeal = async (meal: MealInterface): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.add(meal);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getMealById = async (
  id: string
): Promise<MealInterface | undefined> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllMeals = async (): Promise<MealInterface[]> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

// export const deleteMeal = async (id: string): Promise<void> => {
//   const store = await storeTransaction(STORE_NAME, 'readwrite');

//   return new Promise((resolve, reject) => {
//     const req = store.delete(id);
//     req.onsuccess = () => resolve();
//     req.onerror = () => reject(req.error);
//   });
// };

export const updateMeal = async (meal: MealInterface): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.put(meal);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
