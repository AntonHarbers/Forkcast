import IngredientBlueprint from "../../classes/IngredientBlueprint";
import { useAppContext } from "../../context/useAppContext";

export default function IngredientListItem({ item, setEditingIngredientBlueprint }: { item: IngredientBlueprint, setEditingIngredientBlueprint: React.Dispatch<React.SetStateAction<IngredientBlueprint | null>> }) {

    const { state } = useAppContext()

    return (
        <div className="flex gap-6 m-6 border-slate-900 border rounded-md p-2 justify-around">
            <div className="text-xl font-bold text-slate-800">{item.name}</div>
            <div className="text-xl font-bold text-slate-800">{state.ingredientUnits.map(unit => unit.id === item.unitId && <div key={unit.id}>{unit.name}</div>)}</div>
            <button className="text-xl bg-slate-200 px-2 rounded-md hover:bg-slate-400 active:bg-slate-600" onClick={() => setEditingIngredientBlueprint(item)}>Edit</button>
        </div>
    )
}
