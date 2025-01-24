import { createContext, ReactNode, useEffect, useState } from "react";
import { AppContextType } from "../types";
import IngredientBlueprint from "../classes/IngredientBlueprint";
import StoreData from "../classes/StoreData";
import MealData from "../classes/MealData";
import { v4 } from "uuid";

const AppContext = createContext<AppContextType | undefined>(undefined)

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ingredientBlueprints, setIngredientBlueprints] = useState<IngredientBlueprint[]>([])
    const [stores, setStores] = useState<StoreData[]>([])
    const [currentStoreTab, setCurrentStoreTab] = useState<StoreData | null>(null)

    const [meals, setMeals] = useState<MealData[]>([])
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    useEffect(() => {
        setIngredientBlueprints([
            new IngredientBlueprint(v4(), "Test 1", "10")
        ])
        setStores([new StoreData(v4(), "Default", "Default"), new StoreData(v4(), "ALDI", "Camp Phoenix"), new StoreData(v4(), "REWE", "Camp Phoenix"), new StoreData(v4(), "GLOBUS", "-")])
    }, [])

    useEffect(() => {
        setCurrentStoreTab(stores[0])
    }, [stores])

    return (
        <AppContext.Provider value={{ selectedDay, setSelectedDay, currentStoreTab, setCurrentStoreTab, ingredientBlueprints, stores, meals, setIngredientBlueprints, setMeals, setStores }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }