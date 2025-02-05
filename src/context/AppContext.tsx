import { createContext, ReactNode, useEffect, useReducer } from "react";
import { AppContextType, AppState } from "../types";
import IngredientBlueprint from "../classes/IngredientBlueprint";
import StoreData from "../classes/StoreData";
import MealData from "../classes/MealData";
import { CategoryDummyData, dummyMeals, IngredientBlueprintDataDB, StoreDataDB, UnitData } from "../data/dummy";
import Unit from "../classes/UnitData";
import Category from "../classes/CategoryData";
import reducer from "./reducer";

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialState: AppState = {
    ingredientBlueprints: [],
    stores: [],
    currentStoreTab: null,
    ingredientUnits: [],
    categories: [],
    meals: [],
    selectedDay: new Date(),
};

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    // Init State Data
    useEffect(() => {
        dispatch({
            type: "SET_INGREDIENT_BLUEPRINTS",
            payload: IngredientBlueprintDataDB.map(item => new IngredientBlueprint(item.uid, item.name, item.storeUid, "0", item.categoryId))
        })
        dispatch({
            type: "SET_STORES",
            payload: StoreDataDB.map(item => new StoreData(item.uid, item.name, item.location))
        })
        dispatch({
            type: "SET_MEALS",
            payload: dummyMeals.map(item => new MealData(item.id, item.name, item.ingredients, item.date, item.order, item.finished))
        })
        dispatch({
            type: "SET_INGREDIENT_UNITS",
            payload: UnitData.map(item => new Unit(item.id, item.name, false, new Date().toDateString()))
        })
        dispatch({
            type: "SET_CATEGORIES",
            payload: CategoryDummyData.map(item => new Category(item.id, item.name, item.order, item.storeId, item.isDeleted, item.deletedAt))
        })
    }, [])

    // Set initial current store tab to first store
    useEffect(() => {
        if (state.stores.length > 0 && !state.currentStoreTab) {
            dispatch({ type: "SET_CURRENT_STORE_TAB", payload: state.stores[0] })
        }
    }, [state.stores, state.currentStoreTab])

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }