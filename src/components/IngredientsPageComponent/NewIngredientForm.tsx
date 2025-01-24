import { useForm } from "react-hook-form"
import TextInputElement from "../FormComponents/TextInputElement"
import SubmitInputElement from "../FormComponents/SubmitInputElement"
import { useEffect } from "react"
import { IngredientFormInputs } from "../../types"


export default function NewIngredientForm({ onSubmit }: { onSubmit: (data: IngredientFormInputs) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset
    } = useForm<IngredientFormInputs>()

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <TextInputElement register={register} placeholder={"Name..."} registerName={"name"} required={true} />
            {/* A select with every possible store as an option */}
            {errors.name && <span>This field is required!</span>}
            <SubmitInputElement submitInputText="Add New Ingredient" />
        </form>
    )
}
