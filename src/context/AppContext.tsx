import { createContext, ReactNode, useEffect, useReducer } from "react";
import { AppContextType, AppState } from "../ts/types";
import reducer from "./reducer";
import { getAllMeals } from "../DB/indexedDB";

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

    // useFetchData("test.com", dispatch)

    // Init State Data
    useEffect(() => {
        const fetchMealData = async () => {
            const mealData = await getAllMeals()
            dispatch({ type: "SET_MEALS", payload: mealData })
        }
        fetchMealData()
        // if it does then get data from there
        // if it doesnt then dont set any data yet
        // either way we fire out the fetch request and update the state based on its response
        // dispatch({
        //     type: "SET_INGREDIENT_BLUEPRINTS",
        //     payload: IngredientBlueprintDataDB
        // })
        // dispatch({
        //     type: "SET_STORES",
        //     payload: StoreDataDB
        // })
        // dispatch({
        //     type: "SET_MEALS",
        //     payload: dummyMeals
        // })
        // dispatch({
        //     type: "SET_INGREDIENT_UNITS",
        //     payload: UnitData
        // })
        // dispatch({
        //     type: "SET_CATEGORIES",
        //     payload: CategoryDummyData
        // })
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