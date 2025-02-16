import { useMemo } from "react";
import { useAppContext } from "../../context/useAppContext";
import { IngredientBlueprintInterface } from "../../ts/interfaces";

export default function IngredientListItem({ item, setEditingIngredientBlueprint }: { item: IngredientBlueprintInterface, setEditingIngredientBlueprint: React.Dispatch<React.SetStateAction<IngredientBlueprintInterface | null>> }) {

    const { state } = useAppContext()

    const ingredientUnit = useMemo(() => state.ingredientUnits.find(unit => unit.id === item.unitId), [state.ingredientUnits, item.unitId])
    const ingredientStore = useMemo(() => state.stores.find(store => store.id === item.storeUid), [state.stores, item.storeUid])
    const ingredientCategory = useMemo(() => state.categories.find(category => category.id === item.categoryId), [state.categories, item.categoryId])

    return (
        <div className="relative flex items-center mx-auto w-[90%] gap-2 border-white border-b p-2 justify-around text-white">
            <div className="flex flex-col gap-1 items-center">
                <div className="text-3xl font-bold">
                    {item.name}

                </div>
                {ingredientUnit
                    && <div className="text-lg font-bold" >Unit: {ingredientUnit.name}</div>}
                {ingredientStore
                    && <div className="text-lg font-bold" >Store: {ingredientStore.name}</div>}
                {ingredientCategory
                    ? <div className="text-lg font-bold">Category: {ingredientCategory.name}</div>
                    : <div className="text-lg font-bold">No Category</div>}

            </div>
            <button
                className="absolute right-0 text-xl px-2 rounded-md hover:scale-125 active:scale-90 transition-all ease-in-out"
                onClick={() => setEditingIngredientBlueprint(item)}
            >
                ✏
            </button>
        </div>
    )
}


{/* */ }