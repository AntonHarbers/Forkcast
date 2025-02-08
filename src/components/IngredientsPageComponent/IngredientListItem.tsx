import { useMemo } from "react";
import { useAppContext } from "../../context/useAppContext";
import { IngredientBlueprintInterface } from "../../ts/interfaces";

export default function IngredientListItem({ item, setEditingIngredientBlueprint }: { item: IngredientBlueprintInterface, setEditingIngredientBlueprint: React.Dispatch<React.SetStateAction<IngredientBlueprintInterface | null>> }) {

    const { state } = useAppContext()

    const ingredientUnit = useMemo(() => state.ingredientUnits.find(unit => unit.id === item.unitId), [state.ingredientUnits, item.unitId])
    const ingredientStore = useMemo(() => state.stores.find(store => store.id === item.storeUid), [state.stores, item.storeUid])
    const ingredientCategory = useMemo(() => state.categories.find(category => category.id === item.categoryId), [state.categories, item.categoryId])

    return (
        <div className="flex gap-6 m-6 border-slate-900 border rounded-md p-2 justify-around">
            <div className="text-xl font-bold text-slate-800">{item.name}</div>
            {ingredientUnit && <div className="text-xl font-bold text-slate-800" >{ingredientUnit.name}</div>}
            {ingredientStore && <div className="text-xl font-bold text-slate-800" >{ingredientStore.name}</div>}
            {ingredientCategory ?
                <div className="text-xl font-bold text-slate-800">{ingredientCategory.name}</div>
                : <div className="text-xl font-bold text-slate-800">None</div>}
            <button className="text-xl bg-slate-200 px-2 rounded-md hover:bg-slate-400 active:bg-slate-600" onClick={() => setEditingIngredientBlueprint(item)}>Edit</button>
        </div>
    )
}
