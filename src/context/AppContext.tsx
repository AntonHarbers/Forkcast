import { createContext, ReactNode, useEffect, useReducer } from "react";
import { AppContextType, AppState } from "../ts/types";
import reducer from "./reducer";
import { getAllMeals } from "../DB/mealsCrud";
import { getAllIngredientUnits } from "../DB/ingredientUnitsCRUD";
import { getAllStores } from "../DB/storesCRUD";
import { getAllStoreCategories } from "../DB/storeCategoriesCRUD";
import { getAllIngredientBlueprints } from "../DB/ingredientBlueprintsCRUD";

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
        const fetchData = async () => {
            const storeData = await getAllStores()
            dispatch({ type: "SET_STORES", payload: storeData })
            const storeCategoryData = await getAllStoreCategories()
            dispatch({ type: "SET_CATEGORIES", payload: storeCategoryData })
            const ingredientBlueprintData = await getAllIngredientBlueprints()
            dispatch({ type: "SET_INGREDIENT_BLUEPRINTS", payload: ingredientBlueprintData })
            const ingredientUnitData = await getAllIngredientUnits()
            dispatch({ type: "SET_INGREDIENT_UNITS", payload: ingredientUnitData })
            const mealData = await getAllMeals()
            dispatch({ type: "SET_MEALS", payload: mealData })
        }
        fetchData()
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

    // useEffect(() => {
    //     console.log(state)
    // }, [state])

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