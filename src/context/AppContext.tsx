import { createContext, ReactNode, useEffect, useState } from "react";
import { AppContextType } from "../types";
import IngredientBlueprint from "../classes/IngredientBlueprint";
import StoreData from "../classes/StoreData";
import MealData from "../classes/MealData";
import { CategoryDummyData, dummyMeals, IngredientBlueprintDataDB, StoreDataDB, UnitData } from "../data/dummy";
import Unit from "../classes/UnitData";
import Category from "../classes/CategoryData";

const AppContext = createContext<AppContextType | undefined>(undefined)

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ingredientBlueprints, setIngredientBlueprints] = useState<IngredientBlueprint[]>([])
    const [stores, setStores] = useState<StoreData[]>([])
    const [currentStoreTab, setCurrentStoreTab] = useState<StoreData | null>(null)
    const [ingredientUnits, setIngredientUnits] = useState<Unit[]>([])
    const [categories, setCategories] = useState<Category[]>([])

    const [meals, setMeals] = useState<MealData[]>([])
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());

    useEffect(() => {
        setIngredientBlueprints(IngredientBlueprintDataDB.map(item => new IngredientBlueprint(item.uid, item.name, item.storeUid, "0", item.categoryId)))
        setStores(StoreDataDB.map(item => new StoreData(item.uid, item.name, item.location)))
        setMeals(dummyMeals.map(item => new MealData(item.id, item.name, item.ingredients, item.date, item.order, item.finished)))
        setIngredientUnits(UnitData.map(item => new Unit(item.id, item.name, false, new Date().toDateString())))
        setCategories(CategoryDummyData.map(item => new Category(item.id, item.name, item.order, item.storeId, item.isDeleted, item.deletedAt)))
    }, [])

    useEffect(() => {
        setCurrentStoreTab(stores[0])
    }, [stores, meals])

    return (
        <AppContext.Provider value={{ categories, setCategories, selectedDay, setSelectedDay, currentStoreTab, setCurrentStoreTab, ingredientBlueprints, stores, meals, setIngredientBlueprints, setMeals, setStores, ingredientUnits, setIngredientUnits }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider }