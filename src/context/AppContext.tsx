import { createContext, ReactNode, useEffect, useState } from "react";
import { AppContextType } from "../types";
import IngredientBlueprint from "../classes/IngredientBlueprint";
import StoreData from "../classes/StoreData";
import MealData from "../classes/MealData";
import { dummyMeals, IngredientBlueprintDataDB, StoreDataDB } from "../data/dummy";

const AppContext = createContext<AppContextType | undefined>(undefined)

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ingredientBlueprints, setIngredientBlueprints] = useState<IngredientBlueprint[]>([])
    const [stores, setStores] = useState<StoreData[]>([])
    const [currentStoreTab, setCurrentStoreTab] = useState<StoreData | null>(null)

    const [meals, setMeals] = useState<MealData[]>([])
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    useEffect(() => {
        setIngredientBlueprints(IngredientBlueprintDataDB.map(item => new IngredientBlueprint(item.uid, item.name, item.storeUid, "0")))
        setStores(StoreDataDB.map(item => new StoreData(item.uid, item.name, item.location)))
        setMeals(dummyMeals.map(item => new MealData(item.id, item.name, item.ingredients, item.date, item.order || 1)))
    }, [])

    useEffect(() => {
        setCurrentStoreTab(stores[0])
    }, [stores, meals])

    return (
        <AppContext.Provider value={{ selectedDay, setSelectedDay, currentStoreTab, setCurrentStoreTab, ingredientBlueprints, stores, meals, setIngredientBlueprints, setMeals, setStores }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }