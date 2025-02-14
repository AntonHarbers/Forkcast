import { IngredientBlueprintInterface } from '../ts/interfaces';
import { AppAction, AppState } from '../ts/types';

export default function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // INGREDIENT BLUEPRINTS
    case 'SET_INGREDIENT_BLUEPRINTS':
      return { ...state, ingredientBlueprints: action.payload };
    case 'DELETE_INGREDIENT_BLUEPRINT': {
      const itemToDelete = state.ingredientBlueprints.find(
        (item) => item.id === action.payload
      );
      if (!itemToDelete) return { ...state };

      const updatedItem: IngredientBlueprintInterface = {
        ...itemToDelete,
        isDeleted: true,
        deletedAt: new Date().toDateString(),
      };

      const updatedIngredients = state.ingredientBlueprints.map((item) => {
        return item.id != action.payload ? item : updatedItem;
      });

      return { ...state, ingredientBlueprints: updatedIngredients };
    }
    // STORES
    case 'SET_STORES':
      return { ...state, stores: action.payload };
    case 'DELETE_STORE': {
      const updatedStores = state.stores.map((store) => {
        return store.id != action.payload
          ? store
          : {
              ...store,
              isDeleted: true,
              deletedAt: new Date().toDateString(),
            };
      });
      return { ...state, stores: updatedStores };
    }
    // INGREDIENT UNITS
    case 'SET_INGREDIENT_UNITS':
      return { ...state, ingredientUnits: action.payload };
    case 'DELETE_INGREDIENT_UNIT': {
      const updatedUnits = state.ingredientUnits.map((item) => {
        return item.id != action.payload
          ? item
          : {
              ...item,
              isDeleted: true,
              deletedAt: new Date().toDateString(),
            };
      });
      return { ...state, ingredientUnits: updatedUnits };
    }
    // CATEGORIES
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'DELETE_CATEGORY': {
      const updatedCategories = state.categories.map((item) => {
        return item.id != action.payload
          ? item
          : {
              ...item,
              isDeleted: true,
              deletedAt: new Date().toDateString(),
            };
      });

      return { ...state, categories: updatedCategories };
    }
    // MEALS
    case 'SET_MEALS':
      return { ...state, meals: action.payload };
    case 'DELETE_MEAL': {
      const updatedMeals = state.meals.map((meal) => {
        return meal.id != action.payload
          ? meal
          : {
              ...meal,
              isDeleted: true,
              deletedAt: new Date().toDateString(),
            };
      });
      return { ...state, meals: updatedMeals };
    }
    // REST
    case 'SET_SELECTED_DAY':
      return { ...state, selectedDay: action.payload };
    case 'SET_CURRENT_STORE_TAB':
      return { ...state, currentStoreTab: action.payload };
    default:
      return state;
  }
}

// CRUD REDUCER ACTIONS SHOULD BE ADDED AND IMPLEMENTED EVENTUALLY
