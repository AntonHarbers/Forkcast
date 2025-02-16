import { useMemo, useState } from "react";
import NewShopForm from "../components/ShoppingListComponents/NewShopForm";
import StoreTabItem from "../components/ShoppingListComponents/StoreTabItem";
import EditStoreModal from "../components/ShoppingListComponents/EditStoreModal";
import { useAppContext } from "../context/useAppContext";
import { IngredientBlueprintInterface, MealIngredientInterface, StoreInterface, UnitInterface } from "../ts/interfaces";
import Header from "../components/Global/Header";
import CategorizedIngredients from "../components/ShoppingListComponents/CategorizedIngredients";
import useShoppingList from "../hooks/useShoppingList";
import useExistingStores from "../hooks/useExistingStores";
import Loading from "../components/Global/Loading";
import { updateStoreCategories } from "../DB/storeCategoriesCRUD";
import { updateMeal } from "../DB/mealsCrud";

export default function ShoppingListPage() {
    const { state, dispatch } = useAppContext()
    const [editingStore, setEditingStore] = useState<StoreInterface | null>(null)
    const existingStores = useExistingStores(state)
    const [isShowingForm, setIsShowingForm] = useState(false)
    const shoppingList = useShoppingList(state, existingStores)

    const existingSelectedStoreCategories = useMemo(() =>
        state.categories.filter(item => !item.isDeleted && item.storeId === state.currentStoreTab?.id).sort((a, b) => a.order - b.order)
        , [state.categories, state.currentStoreTab])
    const blueprintIngredientEntries = useMemo(() => Array.from(shoppingList.BlueprintIngredients.entries()), [shoppingList])
    const ingredientUnitLookup = useMemo(() => {
        return state.ingredientUnits.reduce((acc: { [key: string]: UnitInterface }, unit) => {
            acc[unit.id] = unit
            return acc
        }, {})
    }, [state.ingredientUnits])

    const categorizedBlueprintIngredients = useMemo(() => {
        return blueprintIngredientEntries.reduce(
            (acc: {
                [key: string]: [IngredientBlueprintInterface, MealIngredientInterface[]][]
            },
                [blueprint, ingredients]
            ) => {
                const categoryKey =
                    (blueprint.categoryId && existingSelectedStoreCategories.find(item => item.id === blueprint.categoryId))
                        ? blueprint.categoryId
                        : 'uncategorized';

                if (!acc[categoryKey]) {
                    acc[categoryKey] = []
                }
                acc[categoryKey].push([blueprint, ingredients])
                return acc
            }, {})
    }, [blueprintIngredientEntries, existingSelectedStoreCategories])

    const ToggleMealIngredientsBought = async (checked: boolean, blueprintId: string) => {
        try {
            // find all the meals that have ingredients that are blueprintId
            // for all those meals make a updateMeal req passing in the meal with that blueprintsId set to bought
            const mealsWithBlueprint = state.meals.filter(meal => {
                let hasIngredient = false
                meal.ingredients.forEach(ing => {
                    if (ing.blueprintId === blueprintId) hasIngredient = true
                })
                return hasIngredient
            })

            const updatedMeals = mealsWithBlueprint.map(meal => ({
                ...meal,
                ingredients: meal.ingredients.map(ingredientDataItem => {
                    if (ingredientDataItem.blueprintId === blueprintId) {
                        return { ...ingredientDataItem, bought: checked }
                    }

                    return ingredientDataItem
                })
            }))

            await Promise.all(updatedMeals.map(meal => updateMeal(meal)))

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
        } catch (error) {
            console.error("Error meal ingredient bought toggle: ", error)
        }
    }

    const SwapCategoryOrder = async (selectedCategoryId: string, swapCategoryId: string | null, selectedOrder: number, swapOrder: number) => {
        if (swapCategoryId === null) return
        const oldCategory = state.categories.find(cat => cat.id === selectedCategoryId)
        const swapCategory = state.categories.find(cat => cat.id === swapCategoryId)
        if (!oldCategory || !swapCategory) return
        try {

            const newCategories = state.categories.map(cat => ({
                ...cat,
                order: cat.id === selectedCategoryId ? swapOrder : cat.id === swapCategoryId ? selectedOrder : cat.order
            }))
            const updatedStoreCategory = { ...state.categories.find(cat => cat.id === selectedCategoryId)!, order: swapOrder }
            const updatedSwapStoreCategory = { ...state.categories.find(cat => cat.id === swapCategoryId)!, order: selectedOrder }
            await updateStoreCategories(updatedStoreCategory)
            await updateStoreCategories(updatedSwapStoreCategory)
            dispatch({ type: 'SET_CATEGORIES', payload: newCategories })
        } catch (error) {
            console.error("Error changing store category order: ", error)
        }

    }

    return (
        <div className="relative">
            <div className="flex items-center border-b justify-between mx-10">
                <Header text="Shopping List" styles="border-none mb-0 text-center w-full" />
                <div onClick={() => setIsShowingForm(!isShowingForm)} className="pt-2 text-2xl hover:scale-110 active:scale-90 transition-all duration-100 ease-in-out hover:cursor-pointer select-none">{isShowingForm ? "➖" : "➕"}</div>
            </div>
            {isShowingForm && <NewShopForm setIsShowingForm={setIsShowingForm} />
            }
            <div className="bg-slate-700 text-white rounded-md w-[80%] mx-auto flex flex-col gap-10 p-2 m-10">
                <div className="flex bg-slate-700 justify-center flex-wrap gap-y-2">
                    {existingStores.map(item => <div key={item.id}><StoreTabItem item={item} /></div>)}
                </div>
                {state.currentStoreTab != null ?
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between w-full">
                            <p className="text-2xl underline font-bold">{state.currentStoreTab.name} Shopping List</p>
                            {state.currentStoreTab.name != "Default"
                                && <button
                                    className="text-xl hover:scale-125 active:scale-90 transition-all ease-in-out"
                                    onClick={() => setEditingStore(state.currentStoreTab)}
                                >
                                    ✏
                                </button>}
                        </div>
                        <div className="text-sm">{state.currentStoreTab.location}</div>
                        {/* Categories of this store sorted by their order */}
                        <div>
                            {existingSelectedStoreCategories.map((category, index) => {
                                const entriesForCategory = categorizedBlueprintIngredients[category.id] || []
                                return <CategorizedIngredients
                                    key={category.id}
                                    SwapCategoryOrder={SwapCategoryOrder}
                                    ToggleMealIngredientsBought={ToggleMealIngredientsBought}
                                    category={category}
                                    entriesForCategory={entriesForCategory}
                                    existingSelectedStoreCategories={existingSelectedStoreCategories}
                                    index={index}
                                    ingredientUnitLookup={ingredientUnitLookup}
                                />
                            })}
                        </div>
                        {/* Ingredients with a categoryID of null */}
                        <div>
                            <div className="text-xl text-center my-2 font-semibold">Not Categorized:</div>
                            {(categorizedBlueprintIngredients['uncategorized'] || [])
                                .map(([blueprint, ingredients]) => {
                                    let total: number = 0
                                    let totalUnbought: number = 0
                                    ingredients.forEach(item => {
                                        if (item.bought) {
                                            total += item.amount
                                        } else {
                                            totalUnbought += item.amount
                                        }
                                    })
                                    return <div className="flex justify-between mx-5 border-b border-slate-200" key={blueprint.id}>

                                        <div>- {blueprint.name}</div>
                                        <div className="flex gap-5">
                                            <div className="flex gap-1">
                                                <div className="flex gap-2">
                                                    {totalUnbought != 0 && <div className="font-bold">{totalUnbought}</div>}
                                                    {totalUnbought != 0 && total != 0 && <div>/</div>}
                                                    {total != 0 && <div className="font-bold">{total + totalUnbought}</div>}
                                                </div>
                                                <div>{ingredientUnitLookup[blueprint.unitId].name}</div>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={ingredients.every(item => item.bought)}
                                                onChange={(e) => ToggleMealIngredientsBought(e.target.checked, blueprint.id)}
                                            />
                                        </div>


                                    </div>
                                })}
                        </div>
                    </div>
                    : <Loading />
                }
            </div>
            <div className="fixed w-[100%] top-[20vh]">
                <EditStoreModal editingStore={editingStore} setEditingStore={setEditingStore} />
            </div>
        </div>
    )
}