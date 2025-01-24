import IngredientBlueprint from './classes/IngredientBlueprint';
import MealData from './classes/MealData';
import StoreData from './classes/StoreData';

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
}

export type IngredientFormInputs = {
  name: string;
  storeUid: string;
};
