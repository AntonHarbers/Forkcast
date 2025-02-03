import NewIngredientForm from "../components/IngredientsPageComponent/NewIngredientForm";
import { SubmitHandler } from "react-hook-form";
import IngredientBlueprint from "../classes/IngredientBlueprint";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import EditIngredientModal from "../components/IngredientsPageComponent/EditIngredientModal";
import { useState } from "react";
import IngredientListItem from "../components/IngredientsPageComponent/IngredientListItem";

type Inputs = {
    name: string,
    storeUid: string,
    unitId: string,
    categoryId: string | null
}


export default function IngredientsPage() {
    const { ingredientBlueprints, setIngredientBlueprints } = useAppContext()
    const [editingIngredientBlueprint, setEditingIngredientBlueprint] = useState<IngredientBlueprint | null>(null)
    const HandleNewIngredientFormSubmit: SubmitHandler<Inputs> = (data) => {
        if (!data.categoryId) data.categoryId = null
        const newIngredient = new IngredientBlueprint(v4(), data.name, data.storeUid, data.unitId, data.categoryId)
        setIngredientBlueprints([...ingredientBlueprints, newIngredient])

    }

    return (
        <div>
            <h1 className="mx-auto w-full text-center text-5xl m-10">Ingredients</h1>
            <div className=" justify-center flex ">
                <NewIngredientForm onSubmit={HandleNewIngredientFormSubmit} />
            </div>
            <EditIngredientModal editingIngredientBlueprint={editingIngredientBlueprint} setEditingIngredientBlueprint={setEditingIngredientBlueprint} />

            {ingredientBlueprints.map(item => {
                return (
                    <IngredientListItem key={item.uid} item={item} setEditingIngredientBlueprint={setEditingIngredientBlueprint} />
                )
            })}
        </div>
    )
}
