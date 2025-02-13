import {
  CategoryInterface,
  IngredientBlueprintInterface,
  MealIngredientInterface,
  MealInterface,
  StoreInterface,
  UnitInterface,
} from '../ts/interfaces';

const DB_NAME = 'ForkcastDB';
const DB_VERSION = 1;

export const openDB = (): Promise<IDBDatabase> => {
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

// MEALS CRUD

export const addMeal = async (meal: MealInterface): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('MEALS', 'readwrite');
  const store = tx.objectStore('MEALS');

  return new Promise((resolve, reject) => {
    const req = store.add(meal);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getMealById = async (
  id: string
): Promise<MealInterface | undefined> => {
  const db = await openDB();
  const tx = db.transaction('MEALS', 'readonly');
  const store = tx.objectStore('MEALS');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllMeals = async (): Promise<MealInterface[]> => {
  const db = await openDB();
  const tx = db.transaction('MEALS', 'readonly');
  const store = tx.objectStore('MEALS');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const deleteMeal = async (id: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('MEALS', 'readwrite');
  const store = tx.objectStore('MEALS');

  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const updateMeal = async (meal: MealInterface): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('MEALS', 'readwrite');
  const store = tx.objectStore('MEALS');

  return new Promise((resolve, reject) => {
    const req = store.put(meal);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// INGREDIENT_BLUEPRINTS CRUD

export const addIngredientBlueprint = async (
  ingredientBlueprint: IngredientBlueprintInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('INGREDIENT_BLUEPRINTS', 'readwrite');
  const store = tx.objectStore('INGREDIENT_BLUEPRINTS');

  return new Promise((resolve, reject) => {
    const req = store.add(ingredientBlueprint);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getIngredientBlueprintById = async (
  id: string
): Promise<IngredientBlueprintInterface | undefined> => {
  const db = await openDB();
  const tx = db.transaction('INGREDIENT_BLUEPRINTS', 'readonly');
  const store = tx.objectStore('INGREDIENT_BLUEPRINTS');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllIngredientBlueprints = async (): Promise<
  IngredientBlueprintInterface[]
> => {
  const db = await openDB();
  const tx = db.transaction('INGREDIENT_BLUEPRINTS', 'readonly');
  const store = tx.objectStore('INGREDIENT_BLUEPRINTS');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const deleteIngredientBlueprint = async (id: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('INGREDIENT_BLUEPRINTS', 'readwrite');
  const store = tx.objectStore('INGREDIENT_BLUEPRINTS');

  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const updateIngredientBlueprint = async (
  ingredientBlueprint: IngredientBlueprintInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('INGREDIENT_BLUEPRINTS', 'readwrite');
  const store = tx.objectStore('INGREDIENT_BLUEPRINTS');

  return new Promise((resolve, reject) => {
    const req = store.put(ingredientBlueprint);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// INGREDIENT_UNITS CRUD

export const addIngredientUnit = async (
  ingredientUnit: UnitInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readwrite');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.add(ingredientUnit);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getIngredientUnitById = async (
  id: string
): Promise<UnitInterface | undefined> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readonly');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllIngredientUnits = async (): Promise<UnitInterface[]> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readonly');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const deleteIngredientUnit = async (id: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readwrite');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const updateIngredientUnit = async (
  ingredientUnit: UnitInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readwrite');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.put(ingredientUnit);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// STORES CRUD

export const addStore = async (newStore: StoreInterface): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readwrite');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.add(newStore);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getStoreById = async (
  id: string
): Promise<StoreInterface | undefined> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readonly');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllStores = async (): Promise<StoreInterface[]> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readonly');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const deleteStore = async (id: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readwrite');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const updateStore = async (
  updatedStore: StoreInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORES', 'readwrite');
  const store = tx.objectStore('STORES');

  return new Promise((resolve, reject) => {
    const req = store.put(updatedStore);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// STORE_CATEGORIES CRUD

export const addStoreCategory = async (
  newCategory: CategoryInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORE_CATEGORIES', 'readwrite');
  const store = tx.objectStore('STORE_CATEGORIES');

  return new Promise((resolve, reject) => {
    const req = store.add(newCategory);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getStoreCategoryById = async (
  id: string
): Promise<CategoryInterface | undefined> => {
  const db = await openDB();
  const tx = db.transaction('STORE_CATEGORIES', 'readonly');
  const store = tx.objectStore('STORE_CATEGORIES');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllStoreCategories = async (): Promise<CategoryInterface[]> => {
  const db = await openDB();
  const tx = db.transaction('STORE_CATEGORIES', 'readonly');
  const store = tx.objectStore('STORE_CATEGORIES');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const deleteStoreCategory = async (id: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORE_CATEGORIES', 'readwrite');
  const store = tx.objectStore('STORE_CATEGORIES');

  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const updateStoreCategories = async (
  updatedCategory: UnitInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('STORE_CATEGORIES', 'readwrite');
  const store = tx.objectStore('STORE_CATEGORIES');

  return new Promise((resolve, reject) => {
    const req = store.put(updatedCategory);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

// MEAL_INGREDIENTS CRUD

export const addMealIngredient = async (
  newMealIngredient: MealIngredientInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('MEAL_INGREDIENTS', 'readwrite');
  const store = tx.objectStore('MEAL_INGREDIENTS');

  return new Promise((resolve, reject) => {
    const req = store.add(newMealIngredient);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const getMealIngredientById = async (
  id: string
): Promise<MealIngredientInterface | undefined> => {
  const db = await openDB();
  const tx = db.transaction('MEAL_INGREDIENTS', 'readonly');
  const store = tx.objectStore('MEAL_INGREDIENTS');

  return new Promise((resolve, reject) => {
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getAllMealIngredients = async (): Promise<
  MealIngredientInterface[]
> => {
  const db = await openDB();
  const tx = db.transaction('MEAL_INGREDIENTS', 'readonly');
  const store = tx.objectStore('MEAL_INGREDIENTS');

  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const deleteMealIngredient = async (id: string): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('MEAL_INGREDIENTS', 'readwrite');
  const store = tx.objectStore('MEAL_INGREDIENTS');

  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};

export const updateMealIngredient = async (
  updatedMealIngredient: MealIngredientInterface
): Promise<void> => {
  const db = await openDB();
  const tx = db.transaction('MEAL_INGREDIENTS', 'readwrite');
  const store = tx.objectStore('MEAL_INGREDIENTS');

  return new Promise((resolve, reject) => {
    const req = store.put(updatedMealIngredient);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
};
