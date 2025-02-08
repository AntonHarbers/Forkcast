import { createContext, ReactNode, useEffect, useReducer } from "react";
import { AppContextType, AppState } from "../ts/types";
import { CategoryDummyData, dummyMeals, IngredientBlueprintDataDB, StoreDataDB, UnitData } from "../data/dummy";
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
            payload: IngredientBlueprintDataDB
        })
        dispatch({
            type: "SET_STORES",
            payload: StoreDataDB
        })
        dispatch({
            type: "SET_MEALS",
            payload: dummyMeals
        })
        dispatch({
            type: "SET_INGREDIENT_UNITS",
            payload: UnitData
        })
        dispatch({
            type: "SET_CATEGORIES",
            payload: CategoryDummyData
        })
    }, [])

    // Set initial current store tab to first store
    useEffect(() => {
        if (state.stores.length > 0 && !state.currentStoreTab) {
            dispatch({ type: "SET_CURRENT_STORE_TAB", payload: state.stores[0] })
        }
    }, [state.stores, state.currentStoreTab])

    useEffect(() => {
        console.log(state)
    }, [state])

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }