import NewIngredientForm from "../components/IngredientsPageComponent/NewIngredientForm";
import { SubmitHandler } from "react-hook-form";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import EditIngredientModal from "../components/IngredientsPageComponent/EditIngredientModal";
import { useMemo, useState } from "react";
import IngredientListItem from "../components/IngredientsPageComponent/IngredientListItem";
import { IngredientFormInputs } from "../ts/types";
import { IngredientBlueprintInterface } from "../ts/interfaces";
import Header from "../components/Global/Header";
import { addIngredientBlueprint } from "../DB/ingredientBlueprintsCRUD";

export default function IngredientsPage() {
    const { state, dispatch } = useAppContext()
    const [editingIngredientBlueprint, setEditingIngredientBlueprint] = useState<IngredientBlueprintInterface | null>(null)
    const HandleNewIngredientFormSubmit: SubmitHandler<IngredientFormInputs> = async (data) => {
        try {
            if (!data.categoryId) data.categoryId = null
            const newIngredient: IngredientBlueprintInterface = { ...data, id: v4(), deletedAt: new Date().toDateString(), isDeleted: false }
            await addIngredientBlueprint(newIngredient)
            dispatch({ type: 'SET_INGREDIENT_BLUEPRINTS', payload: [...state.ingredientBlueprints, newIngredient] })
        } catch (error) {
            console.error("Error adding new ingredient blueprint: ", error)
        }

    }

    const existingIngredientBlueprints = useMemo(() => state.ingredientBlueprints.filter(item => !item.isDeleted), [state.ingredientBlueprints])

    return (
        <>
            <Header text="Ingredients" />
            <div className=" justify-center flex ">
                <NewIngredientForm onSubmit={HandleNewIngredientFormSubmit} />
            </div>
            <EditIngredientModal
                editingIngredientBlueprint={editingIngredientBlueprint}
                setEditingIngredientBlueprint={setEditingIngredientBlueprint}
            />

            {existingIngredientBlueprints.map(item => {
                return (
                    <IngredientListItem key={item.id} item={item} setEditingIngredientBlueprint={setEditingIngredientBlueprint} />
                )
            })}
        </>
    )
}
