import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IngredientUnitFormInputType } from "../../ts/types";
import { useAppContext } from "../../context/useAppContext";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { UnitInterface } from "../../ts/interfaces";
import FormError from "../FormComponents/FormError";
import { updateIngredientUnit } from "../../DB/ingredientUnitsCRUD";

export default function UnitListItem({ unit }: { unit: UnitInterface }) {

    const [isEditing, setIsEditing] = useState<boolean>(false)
    const { handleSubmit, register, formState: { errors, isSubmitSuccessful }, reset } = useForm<IngredientUnitFormInputType>()
    const { state, dispatch } = useAppContext()

    const HandleSubmitUpdateUnit: SubmitHandler<IngredientUnitFormInputType> = async (data) => {
        try {
            const updatedUnit = { ...unit, name: data.name }
            const newUnits = state.ingredientUnits.map(unitItem => unitItem.id === unit.id ? updatedUnit : unitItem)
            await updateIngredientUnit(updatedUnit)
            dispatch({ type: "SET_INGREDIENT_UNITS", payload: newUnits })
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating ingredient unit: ', error)
        }
    }

    const HandleDeleteUnit = async () => {
        try {
            const deletedUnit: UnitInterface = { ...unit, isDeleted: true, deletedAt: new Date().toDateString() }
            await updateIngredientUnit(deletedUnit)
            dispatch({ type: "DELETE_INGREDIENT_UNIT", payload: unit.id })
        } catch (error) {
            console.error("Error deleting ingredient unit: ", error)
        }
    }

    useEffect(() => reset(), [isSubmitSuccessful, reset])

    return isEditing ? (
        <form className="flex gap-2" onSubmit={handleSubmit(HandleSubmitUpdateUnit)}>
            <TextInputElement placeholder="Unit Name..." register={register} registerName="name" required defaultValue={unit.name} />
            {errors.name && <FormError />}
            <button type='button' onClick={HandleDeleteUnit}>Delete</button>
            <SubmitInputElement submitInputText="Update Unit" />
        </form>
    ) : (
        <div className="flex gap-2">
            <div>{unit.name}</div>
            {unit.id != '1'
                && <button onClick={() => setIsEditing(true)}>Edit</button>
            }
        </div>
    )
}
