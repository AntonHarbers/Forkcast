import {
  CategoryInterface,
  IngredientBlueprintInterface,
  MealIngredientInterface,
  MealInterface,
  StoreInterface,
  UnitInterface,
} from './interfaces';

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export type AppState = {
  ingredientBlueprints: IngredientBlueprintInterface[];
  stores: StoreInterface[];
  currentStoreTab: StoreInterface | null;
  ingredientUnits: UnitInterface[];
  categories: CategoryInterface[];
  meals: MealInterface[];
  selectedDay: Date;
};

export type AppAction =
  | {
      type: 'SET_INGREDIENT_BLUEPRINTS';
      payload: IngredientBlueprintInterface[];
    }
  | { type: 'DELETE_INGREDIENT_BLUEPRINT'; payload: string }
  | { type: 'SET_STORES'; payload: StoreInterface[] }
  | { type: 'DELETE_STORE'; payload: string }
  | { type: 'SET_INGREDIENT_UNITS'; payload: UnitInterface[] }
  | { type: 'DELETE_INGREDIENT_UNIT'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: CategoryInterface[] }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_MEALS'; payload: MealInterface[] }
  | { type: 'DELETE_MEAL'; payload: string }
  | { type: 'SET_SELECTED_DAY'; payload: Date }
  | { type: 'SET_CURRENT_STORE_TAB'; payload: StoreInterface | null };

export type ShoppingListItemType = {
  BlueprintIngredients: Map<
    IngredientBlueprintInterface,
    MealIngredientInterface[]
  >;
};

// form input types
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

export type MealFormInputType = {
  name: string;
  ingredients: MealIngredientInterface[];
};

export type CategoryFormInputs = {
  name: string;
};
