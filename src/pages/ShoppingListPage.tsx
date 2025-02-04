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
    const { stores, setStores, currentStoreTab, setCurrentStoreTab, meals, ingredientBlueprints, setMeals } = useAppContext()
    const [editingStore, setEditingStore] = useState<StoreData | null>(null)
    const { ingredientUnits, categories, setCategories } = useAppContext()

    const shoppingList: ShoppingListItemType = useMemo(() => {
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
        return shopIngredients
    }, [currentStoreTab, ingredientBlueprints, meals])

    const ToggleMealIngredientsBought = (checked: boolean, blueprintId: string) => {
        // find every ingredient in this array
        // set its bought to the new value
        const newMeals = meals.map(meal => ({
            ...meal,
            ingredients: meal.ingredients.map(ingredientDataItem => {
                if (ingredientDataItem.blueprintId === blueprintId) {
                    return { ...ingredientDataItem, bought: checked }
                }

                return ingredientDataItem
            })
        }))
        setMeals(newMeals)
    }

    const SwapCategoryOrder = (selectedCategoryId: string, swapCategoryId: string | null, selectedOrder: number, swapOrder: number) => {
        if (swapCategoryId === null) return

        // look for the selected category
        // look for the swap category
        // get their orders and swap them
        const newCategories = categories.map(cat => ({
            ...cat,
            order: cat.id === selectedCategoryId ? swapOrder : cat.id === swapCategoryId ? selectedOrder : cat.order
        }))

        setCategories(newCategories)

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
                            {/* Categories of this store sorted by their order */}
                            <div>
                                {categories.filter(item => item.storeId === currentStoreTab.uid && !item.isDeleted).sort((a, b) => a.order - b.order).map((category, index) => {
                                    return <div key={category.id}>
                                        <h1 className="items-center text-2xl my-2 underline font-semibold w-full flex justify-between">
                                            {category.name}
                                            <div className="mx-2 flex flex-col gap-1">
                                                {/* if up is pressed, then the order of the prev item should be swapped with this item */}
                                                {index != 0 && <button onClick={() => SwapCategoryOrder(category.id, categories.filter(item => item.storeId === currentStoreTab.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index - 1].id, category.order, categories.filter(item => item.storeId === currentStoreTab.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index - 1].order)}>UP</button>}
                                                {/* if down is pressed, then the order of the next item should be swapped with this item */}
                                                {index != categories.filter(item => item.storeId === currentStoreTab.uid && !item.isDeleted).length - 1 && <button onClick={() => SwapCategoryOrder(category.id, categories.filter(item => item.storeId === currentStoreTab.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index + 1].id, category.order, categories.filter(item => item.storeId === currentStoreTab.uid && !item.isDeleted).sort((a, b) => a.order - b.order)[index + 1].order)}>DOWN</button>}
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
                                                            <div>{ingredientUnits.find(unitItem => unitItem.id === shoppingListItem[0].unitId)?.name}</div>
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
                                        return shoppingListItem[0].categoryId === null || categories.find(categoryData => shoppingListItem[0].categoryId === categoryData.id && categoryData.isDeleted) != undefined// or this category has been deleted
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



