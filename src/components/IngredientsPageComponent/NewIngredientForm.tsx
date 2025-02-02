import { useForm } from "react-hook-form"
import TextInputElement from "../FormComponents/TextInputElement"
import SubmitInputElement from "../FormComponents/SubmitInputElement"
import { useEffect } from "react"
import { IngredientFormInputs } from "../../types"
import { useAppContext } from "../../context/useAppContext"


export default function NewIngredientForm({ onSubmit }: { onSubmit: (data: IngredientFormInputs) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset
    } = useForm<IngredientFormInputs>()

    const { stores, ingredientUnits } = useAppContext()

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <TextInputElement register={register} placeholder={"Name..."} registerName={"name"} required={true} />
            {/* A select with every possible store as an option */}
            {errors.name && <span>This field is required!</span>}
            <select {...register('unitId')}>
                {ingredientUnits.map(item => !item.isDeleted &&
                    <option key={item.id} value={item.id}>{item.name}</option>
                )}
            </select>
            <select {...register('storeUid')}>
                {stores.map(item => {
                    return <option key={item.uid} value={item.uid}>{item.name}</option>
                })}
            </select>
            <SubmitInputElement submitInputText="Add New Ingredient" />
        </form>
    )
}
