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

export default function NewUnitForm({ setIsShowingForm }: { setIsShowingForm: React.Dispatch<React.SetStateAction<boolean>> }) {
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
            setIsShowingForm(false)
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
        <>
            <form className="mx-auto w-[60%] my-6 justify-center flex" onSubmit={handleSubmit(HandleNewUnitSubmit)}>
                <div className="flex flex-col">
                    <TextInputElement register={register} placeholder="Unit Name..." registerName="name" required={true} styles="text-xl my-0" />
                </div>

                <SubmitInputElement submitInputText="➕" styles="px-2 bg-transparent hover:scale-125 hover:bg-transparent active:scale-90 active:bg-transparent transition-all duration-100 ease-in-out" />
            </form>
            <div className="flex justify-center mt-[-10px] mr-[8vw]">
                {errors.name && <FormError />}
            </div>

        </>

    )
}
