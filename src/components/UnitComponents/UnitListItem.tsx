import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IngredientUnitFormInputType } from "../../ts/types";
import { useAppContext } from "../../context/useAppContext";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { UnitInterface } from "../../ts/interfaces";

export default function UnitListItem({ unit }: { unit: UnitInterface }) {

    const [isEditing, setIsEditing] = useState<boolean>(false)

    const { handleSubmit, register, formState: { errors, isSubmitSuccessful }, reset } = useForm<IngredientUnitFormInputType>()

    const { state, dispatch } = useAppContext()

    const HandleEditToggle = () => {
        setIsEditing(true)
    }

    const HandleSubmitUpdateUnit: SubmitHandler<IngredientUnitFormInputType> = (data) => {
        const newUnits = state.ingredientUnits.map(unitItem => unitItem.id === unit.id ? { ...unit, name: data.name } : unitItem)
        dispatch({ type: "SET_INGREDIENT_UNITS", payload: newUnits })
        setIsEditing(false)
    }

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    return isEditing ? (
        <form className="flex gap-2" onSubmit={handleSubmit(HandleSubmitUpdateUnit)}>
            <TextInputElement placeholder="Unit Name..." register={register} registerName="name" required defaultValue={unit.name} />
            {errors.name && <span>This field is required!</span>}
            <button type='button' onClick={() => dispatch({ type: "DELETE_INGREDIENT_UNIT", payload: unit.id })}>Delete</button>
            <SubmitInputElement submitInputText="Update Unit" />
        </form>
    ) : (
        <div className="flex gap-2">
            <div>{unit.name}</div>
            <button onClick={HandleEditToggle}>Edit</button>
        </div>
    )
}
