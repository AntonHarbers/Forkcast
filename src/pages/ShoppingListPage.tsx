import { useMemo, useState } from "react";
import StoreData from "../classes/StoreData";
import NewShopForm from "../components/ShoppingListComponents/NewShopForm";
import StoreTabItem from "../components/ShoppingListComponents/StoreTabItem";
import EditStoreModal from "../components/ShoppingListComponents/EditStoreModal";
import { useAppContext } from "../context/useAppContext";
import { MealIngredientType } from "../types";
import IngredientBlueprint from "../classes/IngredientBlueprint";

type ShoppingListItemType = {
    BlueprintIngredients: Map<IngredientBlueprint, MealIngredientType[]>
}

export default function ShoppingListPage() {
    const { state, dispatch } = useAppContext()
    const [editingStore, setEditingStore] = useState<StoreData | null>(null)

    const shoppingList: ShoppingListItemType = useMemo(() => {
        const shopIngredients: ShoppingListItemType = { BlueprintIngredients: new Map() }

        state.meals.forEach(meal => {
            const mealDate = new Date(meal.date)
            const currentDate = new Date()
            currentDate.setHours(0, 0, 0, 0) // Normalizes the date for comparison
            if (meal.finished || mealDate < currentDate) {
                return
            }
            meal.ingredients.forEach(mealIngredients => {
                const blueprint = state.ingredientBlueprints.find(blueprint => blueprint.uid == mealIngredients.blueprintId)
                if (!blueprint) return
                if (blueprint?.storeUid === state.currentStoreTab?.uid) {
                    if (shopIngredients.BlueprintIngredients.has(blueprint)) {
                        shopIngredients.BlueprintIngredients.get(blueprint)?.push(mealIngredients)
                    } else {
                        shopIngredients.BlueprintIngredients.set(blueprint, [mealIngredients])
                    }
                }
            })
        })
        return shopIngredients
    }, [state.currentStoreTab, state.ingredientBlueprints, state.meals])

    const ToggleMealIngredientsBought = (checked: boolean, blueprintId: string) => {
        // find every ingredient in this array
        // set its bought to the new value
        const newMeals = state.meals.map(meal => ({
            ...meal,
            ingredients: meal.ingredients.map(ingredientDataItem => {
                if (ingredientDataItem.blueprintId === blueprintId) {
                    return { ...ingredientDataItem, bought: checked }
                }

                return ingredientDataItem
            })
        }))
        dispatch({ type: 'SET_MEALS', payload: newMeals })
    }

    const SwapCategoryOrder = (selectedCategoryId: string, swapCategoryId: string | null, selectedOrder: number, swapOrder: number) => {
        if (swapCategoryId === null) return

        // look for the selected category
        // look for the swap category
        // get their orders and swap them
        const newCategories = state.categories.map(cat => ({
            ...cat,
            order: cat.id === selectedCategoryId ? swapOrder : cat.id === swapCategoryId ? selectedOrder : cat.order
        }))
        dispatch({ type: 'SET_CATEGORIES', payload: newCategories })
    }

    return (
        <div>
            <h1 className="mx-auto w-full text-center text-5xl m-10">Shopping List</h1>
            <NewShopForm />
            {/* Shopping List Container */}
            <div className="bg-slate-200 w-[80%] mx-auto flex flex-col gap-10 p-2 m-10">
                {/* Shop Tabs */}
                <div>
                    <div className="flex bg-slate-200 justify-center">
                        {state.stores.map(item => <div key={item.uid}><StoreTabItem item={item} /></div>)}
                    </div>
                </div>
                <EditStoreModal editingStore={editingStore} setEditingStore={setEditingStore} />
                {/* Filtered Ingredients */}
                {state.currentStoreTab != null &&
                    <>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between w-full">
                                <p className="text-xl">{state.currentStoreTab.name} Shopping List</p>
                                {state.currentStoreTab.name != "Default" && <button className="text-xl hover:font-bold active:font-mono" onClick={() => setEditingStore(state.currentStoreTab)}>Edit</button>}
                            </div>
                            <div className="text-sm">{state.currentStoreTab.location}</div>
                            {/* Categories of this store sorted by their order */}
                            <div>
                                {state.categories.filter(item => item.storeId === state.currentStoreTab!.uid && !item.isDeleted).sort((a, b) => a.order - b.order).map((category, index) => {
                                    return <div key={category.id}>
                                        <h1 className="items-center text-2xl my-2 underline font-semibold w-full flex justify-between">
                                            {category.name}
                                            <div className="mx-2 flex flex-col gap-1">
                                                {/* if up is pressed, then the order of the prev item should be swapped with this item */}
                                                {index != 0 && <button onClick={() => SwapCategoryOrder(category.id, state.categories.filter(item => item.storeId === state.currentStoreTab!.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index - 1].id, category.order, state.categories.filter(item => item.storeId === state.currentStoreTab!.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index - 1].order)}>UP</button>}
                                                {/* if down is pressed, then the order of the next item should be swapped with this item */}
                                                {index != state.categories.filter(item => item.storeId === state.currentStoreTab!.uid && !item.isDeleted).length - 1 && <button onClick={() => SwapCategoryOrder(category.id, state.categories.filter(item => item.storeId === state.currentStoreTab!.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index + 1].id, category.order, state.categories.filter(item => item.storeId === state.currentStoreTab!.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index + 1].order)}>DOWN</button>}
                                            </div>
                                        </h1>
                                        <div>
                                            {Array.from(shoppingList.BlueprintIngredients.entries())
                                                .filter(shoppingListItem => {
                                                    return shoppingListItem[0].categoryId === category.id
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
                                                            <div>{state.ingredientUnits.find(unitItem => unitItem.id === shoppingListItem[0].unitId)?.name}</div>
                                                        </div>
                                                        <div>{shoppingListItem[0].name}</div>
                                                        <input type="checkbox" checked={shoppingListItem[1].every(item => item.bought)} onChange={(e) => ToggleMealIngredientsBought(e.target.checked, shoppingListItem[0].uid)} />
                                                    </div>
                                                })}
                                        </div>
                                    </div>
                                })}
                            </div>
                            {/* Ingredients with a categoryID of null */}
                            <div>
                                <div className="text-2xl my-2 underline font-semibold">Not Categorized:</div>
                                {Array.from(shoppingList.BlueprintIngredients.entries())
                                    .filter(shoppingListItem => {
                                        return shoppingListItem[0].categoryId === null || state.categories.find(categoryData => shoppingListItem[0].categoryId === categoryData.id && categoryData.isDeleted) != undefined// or this category has been deleted
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
                                                <div>{state.ingredientUnits.find(unitItem => unitItem.id === shoppingListItem[0].unitId)?.name}</div>
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



