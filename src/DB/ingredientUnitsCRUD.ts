// INGREDIENT_UNITS CRUD

import { UnitInterface } from '../ts/interfaces';
import { storeTransaction } from './indexedDB';

const STORE_NAME = 'INGREDIENT_UNITS';

export const addIngredientUnit = async (
  ingredientUnit: UnitInterface
): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.add(ingredientUnit);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getIngredientUnitById = async (
  id: string
): Promise<UnitInterface | undefined> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllIngredientUnits = async (): Promise<UnitInterface[]> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = async () => {
      if (req.result.length === 0) {
        const defaultUnit: UnitInterface = {
          id: '1',
          deletedAt: new Date().toDateString(),
          isDeleted: false,
          name: 'Piece',
        };
        await addIngredientUnit(defaultUnit);
        resolve([defaultUnit]);
      } else {
        resolve(req.result);
      }
    };
    req.onerror = () => reject(req.error);
  });
};

// export const deleteIngredientUnit = async (id: string): Promise<void> => {
//   const store = await storeTransaction(STORE_NAME, 'readwrite');

//   return new Promise((resolve, reject) => {
//     const req = store.delete(id);
//     req.onsuccess = () => resolve();
//     req.onerror = () => reject(req.error);
//   });
// };

export const updateIngredientUnit = async (
  ingredientUnit: UnitInterface
): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.put(ingredientUnit);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
