import { SubmitHandler, useForm } from "react-hook-form"
import { useAppContext } from "../../context/useAppContext"
import { IngredientUnitFormInputType } from "../../ts/types"
import { v4 } from "uuid"
import { useEffect } from "react"
import TextInputElement from "../FormComponents/TextInputElement"
import SubmitInputElement from "../FormComponents/SubmitInputElement"
import { UnitInterface } from "../../ts/interfaces"
import FormError from "../FormComponents/FormError"
import { addIngredientUnit } from "../../DB/ingredientUnitsCRUD"

export default function NewUnitForm() {
    const { state, dispatch } = useAppContext()

    const HandleNewUnitSubmit: SubmitHandler<IngredientUnitFormInputType> = async (data) => {
        try {
            const newUnit: UnitInterface = {
                id: v4(),
                name: data.name,
                isDeleted: false,
                deletedAt: new Date().toDateString()
            }
            await addIngredientUnit(newUnit)
            dispatch({ type: "SET_INGREDIENT_UNITS", payload: [...state.ingredientUnits, newUnit] })
        } catch (error) {
            console.error("Error adding new ingredient unit: ", error)
        }

    }

    const {
        formState: { errors, isSubmitSuccessful },
        register,
        handleSubmit,
        reset

    } = useForm<IngredientUnitFormInputType>()

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    return (
        <form onSubmit={handleSubmit(HandleNewUnitSubmit)}>
            <TextInputElement register={register} placeholder="Unit Name..." registerName="name" required={true} />
            {errors.name && <FormError />}
            <SubmitInputElement submitInputText="Add Unit" />
        </form>
    )
}
