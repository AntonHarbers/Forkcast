import { useMemo } from "react";
import { AppState, ShoppingListItemType } from "../ts/types";
import { StoreInterface } from "../ts/interfaces";

export default function useShoppingList(state: AppState, existingStores: StoreInterface[]) {
    return useMemo(() => {
        const shopIngredients: ShoppingListItemType = { BlueprintIngredients: new Map() }

        state.meals.filter(meal => !meal.isDeleted).forEach(meal => {
            const mealDate = new Date(meal.date)
            const currentDate = new Date()
            currentDate.setHours(0, 0, 0, 0) // Normalizes the date for comparison
            if (meal.isFinished || mealDate < currentDate) {
                return
            }
            meal.ingredients.forEach(mealIngredients => {
                const blueprint = state.ingredientBlueprints.find(blueprint => blueprint.id == mealIngredients.blueprintId)
                if (!blueprint) return
                // if the store of this ingredient is deleted, then add the ingredients to the default page
                if (blueprint?.storeUid === state.currentStoreTab?.id) {
                    if (shopIngredients.BlueprintIngredients.has(blueprint)) {
                        shopIngredients.BlueprintIngredients.get(blueprint)?.push(mealIngredients)
                    } else {
                        shopIngredients.BlueprintIngredients.set(blueprint, [mealIngredients])
                    }
                }

                // make sure that deleted store ingredients show up on default page
                if (state.currentStoreTab?.id === '1' && !existingStores.find(item => item.id === blueprint.storeUid)) {
                    if (shopIngredients.BlueprintIngredients.has(blueprint)) {
                        shopIngredients.BlueprintIngredients.get(blueprint)?.push(mealIngredients)
                    } else {
                        shopIngredients.BlueprintIngredients.set(blueprint, [mealIngredients])
                    }
                }
            })
        })
        return shopIngredients
    }, [state.currentStoreTab, state.ingredientBlueprints, state.meals, existingStores])
}