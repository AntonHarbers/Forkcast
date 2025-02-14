// INGREDIENT_BLUEPRINTS CRUD

import { IngredientBlueprintInterface } from '../ts/interfaces';
import { storeTransaction } from './indexedDB';

const STORE_NAME = 'INGREDIENT_BLUEPRINTS';

export const addIngredientBlueprint = async (
  ingredientBlueprint: IngredientBlueprintInterface
): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.add(ingredientBlueprint);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getIngredientBlueprintById = async (
  id: string
): Promise<IngredientBlueprintInterface | undefined> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllIngredientBlueprints = async (): Promise<
  IngredientBlueprintInterface[]
> => {
  const store = await storeTransaction(STORE_NAME, 'readonly');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

// export const deleteIngredientBlueprint = async (id: string): Promise<void> => {
//   const store = await storeTransaction(STORE_NAME, 'readwrite');

//   return new Promise((resolve, reject) => {
//     const req = store.delete(id);
//     req.onsuccess = () => resolve();
//     req.onerror = () => reject(req.error);
//   });
// };

export const updateIngredientBlueprint = async (
  ingredientBlueprint: IngredientBlueprintInterface
): Promise<void> => {
  const store = await storeTransaction(STORE_NAME, 'readwrite');

  return new Promise((resolve, reject) => {
    const req = store.put(ingredientBlueprint);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
