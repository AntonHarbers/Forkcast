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
}
