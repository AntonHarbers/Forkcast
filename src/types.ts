import Category from './classes/CategoryData';
import IngredientBlueprint from './classes/IngredientBlueprint';
import MealData from './classes/MealData';
import StoreData from './classes/StoreData';
import Unit from './classes/UnitData';

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export type AppState = {
  ingredientBlueprints: IngredientBlueprint[];
  stores: StoreData[];
  currentStoreTab: StoreData | null;
  ingredientUnits: Unit[];
  categories: Category[];
  meals: MealData[];
  selectedDay: Date;
};

export type AppAction =
  | { type: 'SET_INGREDIENT_BLUEPRINTS'; payload: IngredientBlueprint[] }
  | { type: 'SET_STORES'; payload: StoreData[] }
  | { type: 'SET_CURRENT_STORE_TAB'; payload: StoreData | null }
  | { type: 'SET_INGREDIENT_UNITS'; payload: Unit[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'SET_MEALS'; payload: MealData[] }
  | { type: 'SET_SELECTED_DAY'; payload: Date };

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
