import { AppAction, AppState } from '../types';

export default function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_INGREDIENT_BLUEPRINTS':
      return { ...state, ingredientBlueprints: action.payload };
    case 'SET_STORES':
      return { ...state, stores: action.payload };
    case 'SET_CURRENT_STORE_TAB':
      return { ...state, currentStoreTab: action.payload };
    case 'SET_INGREDIENT_UNITS':
      return { ...state, ingredientUnits: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_MEALS':
      return { ...state, meals: action.payload };
    case 'SET_SELECTED_DAY':
      return { ...state, selectedDay: action.payload };
    default:
      return state;
  }
}

// CRUD REDUCER ACTIONS SHOULD BE ADDED AND IMPLEMENTED EVENTUALLY
