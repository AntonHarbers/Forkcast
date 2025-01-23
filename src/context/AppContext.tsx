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
    const [meals, setMeals] = useState<MealData[]>([])

    useEffect(() => {
        setIngredientBlueprints([
            new IngredientBlueprint(v4(), "Test", "10")
        ])
    }, [])

    return (
        <AppContext.Provider value={{ ingredientBlueprints, stores, meals, setIngredientBlueprints, setMeals, setStores }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }