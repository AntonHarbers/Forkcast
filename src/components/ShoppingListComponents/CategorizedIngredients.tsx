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

            <div className="relative text-xl my-2 font-semibold w-full flex justify-between">
                <h1 className="w-full text-center">{category.name}:</h1>
                <div className="mx-2 flex gap-1 absolute right-0 ">
                    {index != 0 && <button className="hover:scale-125 active:scale-90 transition-all duration-75 ease-in-out" onClick={() =>
                        SwapCategoryOrder(
                            category.id,
                            existingSelectedStoreCategories[index - 1].id,
                            category.order,
                            existingSelectedStoreCategories[index - 1].order
                        )}>
                        👆
                    </button>
                    }
                    {index != existingSelectedStoreCategories.length - 1 &&
                        <button className="hover:scale-125 active:scale-90 transition-all duration-75 ease-in-out" onClick={() =>
                            SwapCategoryOrder(
                                category.id,
                                existingSelectedStoreCategories[index + 1].id,
                                category.order,
                                existingSelectedStoreCategories[index + 1].order)}
                        >
                            👇
                        </button>
                    }
                </div>
            </div>
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
    )
}
