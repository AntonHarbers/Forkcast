import { CategoryInterface, IngredientBlueprintInterface, MealIngredientInterface, UnitInterface } from "../../ts/interfaces"

export default function CategorizedIngredients(
    {
        category,
        index,
        SwapCategoryOrder,
        existingSelectedStoreCategories,
        entriesForCategory,
        ingredientUnitLookup,
        ToggleMealIngredientsBought,
    }:
        {
            category: CategoryInterface,
            index: number,
            SwapCategoryOrder: (selectedCategoryId: string, swapCategoryId: string | null, selectedOrder: number, swapOrder: number) => void,
            existingSelectedStoreCategories: CategoryInterface[]
            entriesForCategory: [IngredientBlueprintInterface, MealIngredientInterface[]][],
            ingredientUnitLookup: {
                [key: string]: UnitInterface;
            },
            ToggleMealIngredientsBought: (checked: boolean, blueprintId: string) => void
        }
) {
    return (
        <div key={category.id}>
            <h1 className="items-center text-2xl my-2 underline font-semibold w-full flex justify-between">
                {category.name}
                <div className="mx-2 flex flex-col gap-1">
                    {index != 0 && <button onClick={() =>
                        SwapCategoryOrder(
                            category.id,
                            existingSelectedStoreCategories[index - 1].id,
                            category.order,
                            existingSelectedStoreCategories[index - 1].order
                        )}>
                        UP
                    </button>
                    }
                    {index != existingSelectedStoreCategories.length - 1 &&
                        <button onClick={() =>
                            SwapCategoryOrder(
                                category.id,
                                existingSelectedStoreCategories[index + 1].id,
                                category.order,
                                existingSelectedStoreCategories[index + 1].order)}
                        >
                            DOWN
                        </button>
                    }
                </div>
            </h1>
            <div>
                {entriesForCategory.map(([blueprint, ingredients]) => {
                    let total: number = 0
                    let totalUnbought: number = 0
                    ingredients.forEach(item => {
                        if (item.bought) {
                            total += item.amount
                        } else {
                            totalUnbought += item.amount
                        }
                    })
                    return <div className="flex justify-between" key={blueprint.id}>
                        <div className="flex gap-1">
                            <div className="flex gap-2">
                                {totalUnbought != 0 && <div className="font-bold">{totalUnbought}</div>}
                                {totalUnbought != 0 && total != 0 && <div>/</div>}
                                {total != 0 && <div className="font-bold">{total + totalUnbought}</div>}
                            </div>
                            <div>{ingredientUnitLookup[blueprint.unitId].name}</div>
                        </div>
                        <div>{blueprint.name}</div>
                        <input
                            type="checkbox"
                            checked={ingredients.every(item => item.bought)}
                            onChange={(e) => ToggleMealIngredientsBought(e.target.checked, blueprint.id)}
                        />
                    </div>
                })}
            </div>
        </div>
    )
}
