import Category from './classes/CategoryData';
import IngredientBlueprint from './classes/IngredientBlueprint';
import MealData from './classes/MealData';
import StoreData from './classes/StoreData';
import Unit from './classes/UnitData';

export interface AppContextType {
  ingredientBlueprints: IngredientBlueprint[];
  stores: StoreData[];
  meals: MealData[];
  setIngredientBlueprints: React.Dispatch<
    React.SetStateAction<IngredientBlueprint[]>
  >;
  setStores: React.Dispatch<React.SetStateAction<StoreData[]>>;
  setMeals: React.Dispatch<React.SetStateAction<MealData[]>>;
  currentStoreTab: StoreData | null;
  setCurrentStoreTab: React.Dispatch<React.SetStateAction<StoreData | null>>;
  selectedDay: Date;
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>;
  ingredientUnits: Unit[];
  setIngredientUnits: React.Dispatch<React.SetStateAction<Unit[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

export type ShopFormInputType = {
  name: string;
  location: string;
};

export type IngredientUnitFormInputType = {
  name: string;
};

export type IngredientFormInputs = {
  name: string;
  storeUid: string;
  unitId: string;
  categoryId: string | null;
};

export type IngredientBlueprintType = {
  uid: string;
  name: string;
  storeUid: string;
  unitId: string;
  categoryId: string | null;
};

export type IngredientUnit = {
  id: string;
  name: string;
};

export type StoreType = {
  uid: string;
  name: string;
  location: string;
};

export type MealIngredientType = {
  id: string;
  blueprintId: string;
  amount: number;
  bought: boolean;
};

export type MealDataType = {
  id: string;
  name: string;
  order: number;
  ingredients: MealIngredientType[];
  date: string;
  finished: boolean;
};
