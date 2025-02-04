import { useForm, useWatch } from "react-hook-form"
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
        reset,
        control,
        setValue
    } = useForm<IngredientFormInputs>()

    const selectedStoreId = useWatch({ control, name: 'storeUid' })

    const { stores, ingredientUnits, categories } = useAppContext()

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    useEffect(() => {
        const categoriesOfStore = categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId)

        if (categoriesOfStore.length === 0) {
            setValue('categoryId', null)
        } else {
            setValue('categoryId', categoriesOfStore[0].id)
        }
    }, [setValue, selectedStoreId, categories])

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
            {categories.filter(item => item.storeId === selectedStoreId && !item.isDeleted).length != 0 && <select {...register('categoryId')}>
                {categories.filter(item => item.storeId === selectedStoreId && !item.isDeleted).sort((a, b) => a.order - b.order).map(item => <option key={item.id} value={item.id}>{item.name}</option>
                )}
            </select>}

            <SubmitInputElement submitInputText="Add New Ingredient" />
        </form>
    )
}
