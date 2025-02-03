import { useEffect, useState } from "react";
import StoreData from "../classes/StoreData";
import NewShopForm from "../components/ShoppingListComponents/NewShopForm";
import StoreTabItem from "../components/ShoppingListComponents/StoreTabItem";
import EditStoreModal from "../components/ShoppingListComponents/EditStoreModal";
import { useAppContext } from "../context/useAppContext";
import { MealIngredientType } from "../types";
import IngredientBlueprint from "../classes/IngredientBlueprint";

// we want to condense every mealIngredient with this blueprint into a single data type
// array of mealingredients
// mapped to blueprint

type ShoppingListItemType = {
    BlueprintIngredients: Map<IngredientBlueprint, MealIngredientType[]>
    //MealIngredients: MealIngredientType
    //Blueprint: IngredientBlueprint
}

export default function ShoppingListPage() {
    const { stores, setStores, currentStoreTab, setCurrentStoreTab, meals, ingredientBlueprints, setMeals } = useAppContext()
    const [editingStore, setEditingStore] = useState<StoreData | null>(null)

    const [shoppingList, setShoppingList] = useState<ShoppingListItemType>({ BlueprintIngredients: new Map() })

    const { ingredientUnits, categories } = useAppContext()

    useEffect(() => {

        const shopIngredients: ShoppingListItemType = { BlueprintIngredients: new Map() }

        meals.forEach(meal => {
            const mealDate = new Date(meal.date)
            const currentDate = new Date()
            currentDate.setHours(0, 0, 0, 0) // Normalizes the date for comparison
            if (meal.finished || mealDate < currentDate) {
                return
            }
            meal.ingredients.forEach(mealIngredients => {
                const blueprint = ingredientBlueprints.find(blueprint => blueprint.uid == mealIngredients.blueprintId)
                if (!blueprint) return
                if (blueprint?.storeUid === currentStoreTab?.uid) {
                    if (shopIngredients.BlueprintIngredients.has(blueprint)) {
                        shopIngredients.BlueprintIngredients.get(blueprint)?.push(mealIngredients)
                    } else {
                        shopIngredients.BlueprintIngredients.set(blueprint, [mealIngredients])
                    }
                }
            })
        })
        setShoppingList(shopIngredients)
    }, [currentStoreTab, ingredientBlueprints, meals])

    const ToggleMealIngredientsBought = (checked: boolean, blueprintId: string) => {
        // find every ingredient in this array
        // set its bought to the new value
        const newMeals = meals.map(meal => {
            const newMeal = meal
            newMeal.ingredients = meal.ingredients.map(ingredientDataItem => {
                if (ingredientDataItem.blueprintId === blueprintId) {
                    const copy = ingredientDataItem
                    copy.bought = checked
                    return copy
                }

                return ingredientDataItem
            })
            return newMeal
        })
        setMeals(newMeals)
    }

    return (
        <div>
            <h1 className="mx-auto w-full text-center text-5xl m-10">Shopping List</h1>
            <NewShopForm storeData={stores} setStoreData={setStores} />
            {/* Shopping List Container */}
            <div className="bg-slate-200 w-[80%] mx-auto flex flex-col gap-10 p-2 m-10">
                {/* Shop Tabs */}
                <div>
                    <div className="flex bg-slate-200 justify-center">
                        {stores.map(item => <div key={item.uid}><StoreTabItem item={item} setEditingStore={setEditingStore} setSelectedStore={setCurrentStoreTab} selectedStore={currentStoreTab} /></div>)}
                    </div>
                </div>
                <EditStoreModal editingStore={editingStore} setEditingStore={setEditingStore} setStoreData={setStores} storeData={stores} />
                {/* Filtered Ingredients */}
                {currentStoreTab &&
                    <>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between w-full">
                                <p className="text-xl">{currentStoreTab.name} Shopping List</p>
                                {currentStoreTab.name != "Default" && <button className="text-xl hover:font-bold active:font-mono" onClick={() => setEditingStore(currentStoreTab)}>Edit</button>}
                            </div>
                            <div className="text-sm">{currentStoreTab.location}</div>
                            <div>
                                {Array.from(shoppingList.BlueprintIngredients.entries())
                                    .sort((a, b) => {
                                        return (categories.find(cat => cat.id == a[0].categoryId)?.order ?? 0) - (categories.find(cat => cat.id == b[0].categoryId)?.order ?? 0)
                                    })
                                    .map(shoppingListItem => {
                                        let total: number = 0
                                        let totalUnbought: number = 0
                                        shoppingListItem[1].forEach(item => {
                                            if (item.bought) {
                                                total += item.amount
                                            } else {
                                                totalUnbought += item.amount
                                            }
                                        })
                                        return <div className="flex justify-between" key={shoppingListItem[0].uid}>
                                            <div className="flex gap-1">
                                                <div className="flex gap-2">
                                                    {totalUnbought != 0 && <div className="font-bold">{totalUnbought}</div>}
                                                    {totalUnbought != 0 && total != 0 && <div>/</div>}
                                                    {total != 0 && <div className="font-bold">{total + totalUnbought}</div>}
                                                </div>
                                                <div>{ingredientUnits.find(unitItem => unitItem.id === shoppingListItem[0].unitId)?.name}</div>
                                            </div>
                                            <div>{shoppingListItem[0].name}</div>
                                            <input type="checkbox" checked={shoppingListItem[1].every(item => item.bought)} onChange={(e) => ToggleMealIngredientsBought(e.target.checked, shoppingListItem[0].uid)} />
                                        </div>
                                    })}
                            </div>
                        </div>
                    </>}
            </div>
        </div>
    )
}



