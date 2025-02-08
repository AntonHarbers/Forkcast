import { useForm, useWatch } from "react-hook-form"
import TextInputElement from "../FormComponents/TextInputElement"
import SubmitInputElement from "../FormComponents/SubmitInputElement"
import { useEffect, useMemo } from "react"
import { IngredientFormInputs } from "../../ts/types"
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

    const { state } = useAppContext()

    const existingIngredientUnits = useMemo(() => state.ingredientUnits.filter(item => !item.isDeleted), [state.ingredientUnits])
    const existingStores = useMemo(() => state.stores.filter(item => !item.isDeleted), [state.stores])
    const categoriesOfSelectedStore = useMemo(
        () => state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId),
        [selectedStoreId, state.categories]
    )

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    useEffect(() => {
        const categoriesOfStore = state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId)

        if (categoriesOfStore.length === 0) {
            setValue('categoryId', null)
        } else {
            setValue('categoryId', categoriesOfStore[0].id)
        }
    }, [setValue, selectedStoreId, state.categories])

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <TextInputElement register={register} placeholder={"Name..."} registerName={"name"} required={true} />
            {/* A select with every possible store as an option */}
            {errors.name && <span>This field is required!</span>}
            <select {...register('unitId')}>
                {existingIngredientUnits.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <select {...register('storeUid')}>
                {existingStores.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            {categoriesOfSelectedStore.length != 0 && <select {...register('categoryId')}>
                {categoriesOfSelectedStore.sort((a, b) => a.order - b.order).map(item =>
                    <option key={item.id} value={item.id}>{item.name}</option>
                )}
            </select>}
            <SubmitInputElement submitInputText="Add New Ingredient" />
        </form>
    )
}
