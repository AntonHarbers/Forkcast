import { useEffect, useState } from "react";
import StoreData from "../classes/StoreData";
import NewShopForm from "../components/ShoppingListComponents/NewShopForm";
import StoreTabItem from "../components/ShoppingListComponents/StoreTabItem";
import EditStoreModal from "../components/ShoppingListComponents/EditStoreModal";
import { useAppContext } from "../context/useAppContext";
import { MealIngredientType } from "../types";
import IngredientBlueprint from "../classes/IngredientBlueprint";
import { UnitData } from "../data/dummy";

type ShoppingListItemType = {
    MealIngredients: MealIngredientType
    Blueprint: IngredientBlueprint
}

export default function ShoppingListPage() {
    const { stores, setStores, currentStoreTab, setCurrentStoreTab, meals, ingredientBlueprints } = useAppContext()
    const [editingStore, setEditingStore] = useState<StoreData | null>(null)

    const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([])

    useEffect(() => {
        const shopIngredients: ShoppingListItemType[] = []

        meals.forEach(meal => {
            meal.ingredients.forEach(mealIngredients => {
                const blueprint = ingredientBlueprints.find(blueprint => blueprint.uid == mealIngredients.blueprintId)
                if (!blueprint) return
                if (blueprint?.storeUid === currentStoreTab?.uid) {
                    shopIngredients.push({ MealIngredients: mealIngredients, Blueprint: blueprint })
                }
            })
        })
        setShoppingList(shopIngredients)
    }, [currentStoreTab, ingredientBlueprints, meals])

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
                            <div className="my-6">
                                Ingredients...

                            </div>
                            <div>
                                {shoppingList.map(shoppingListItem => {
                                    return <div key={shoppingListItem.MealIngredients.id}>
                                        <div>{shoppingListItem.Blueprint.name}</div>
                                        <div>{shoppingListItem.MealIngredients.amount}</div>
                                        <div>{UnitData.find(unitItem => unitItem.id === shoppingListItem.Blueprint.unitId)?.name}</div>
                                    </div>
                                })}
                            </div>
                        </div>
                    </>}
            </div>
        </div>
    )
}



