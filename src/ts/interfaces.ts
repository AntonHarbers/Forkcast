// Data Shape Interfaces
export interface IngredientBlueprintInterface {
  id: string;
  name: string;
  storeUid: string;
  unitId: string;
  categoryId: string | null;
  isDeleted: boolean;
  deletedAt: string;
}

export interface UnitInterface {
  id: string;
  name: string;
  isDeleted: boolean;
  deletedAt: string;
}

export interface StoreInterface {
  id: string;
  name: string;
  location: string;
  isDeleted: boolean;
  deletedAt: string;
}

export interface MealIngredientInterface {
  id: string;
  blueprintId: string;
  amount: number;
  bought: boolean;
}

export interface MealInterface {
  id: string;
  name: string;
  order: number;
  ingredients: MealIngredientInterface[];
  date: string;
  isFinished: boolean;
  isDeleted: boolean;
  deletedAt: string;
}

export interface CategoryInterface {
  id: string;
  name: string;
  order: number;
  storeId: string;
  isDeleted: boolean;
  deletedAt: string;
}
