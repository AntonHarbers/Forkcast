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
        <>
            <form className="flex gap-2 text-2xl my-2 justify-between w-[40%] mx-auto" onSubmit={handleSubmit(HandleSubmitUpdateUnit)}>
                <TextInputElement placeholder="Unit Name..." register={register} registerName="name" required defaultValue={unit.name} styles="m-0 px-1" />
                <SubmitInputElement submitInputText="🔁" styles="text-4xl px-2 pl-5 hover:scale-125 active:scale-90 transition-all ease-in-out  bg-transparent active:bg-transparent hover:bg-transparent " />
                <button className="ml-10 text-3xl hover:scale-125 active:scale-90 transition-all duration-100 ease-in-out" type='button' onClick={HandleDeleteUnit}>❌</button>
            </form>
            {errors.name && <FormError />}
        </>
    ) : (
        <div className="flex gap-2 text-white text-2xl my-2 justify-between w-[40%] mx-auto">
            <div>{unit.name}</div>
            {unit.id != '1'
                && <button className="hover:scale-125 active:scale-90 transition-all duration-100 ease-in-out" onClick={() => setIsEditing(true)}>✏</button>
            }
        </div>
    )
}
