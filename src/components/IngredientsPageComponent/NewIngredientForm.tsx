import { useForm, useWatch } from "react-hook-form"
import TextInputElement from "../FormComponents/TextInputElement"
import SubmitInputElement from "../FormComponents/SubmitInputElement"
import { useEffect, useMemo } from "react"
import { IngredientFormInputs } from "../../ts/types"
import { useAppContext } from "../../context/useAppContext"
import DropdownInputElement from "../FormComponents/DropdownInputElement"
import FormError from "../FormComponents/FormError"
import useExistingStores from "../../hooks/useExistingStores"


export default function NewIngredientForm({ onSubmit }: { onSubmit: (data: IngredientFormInputs) => void }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset,
        control,
        setValue
    } = useForm<IngredientFormInputs>()
    const { state } = useAppContext()

    const selectedStoreId = useWatch({ control, name: 'storeUid' })

    const existingIngredientUnits = useMemo(() => state.ingredientUnits.filter(item => !item.isDeleted), [state.ingredientUnits])
    const existingStores = useExistingStores(state)
    const categoriesOfSelectedStore = useMemo(
        () => state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId),
        [selectedStoreId, state.categories]
    )

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    useEffect(() => {
        if (categoriesOfSelectedStore.length === 0) {
            setValue('categoryId', null)
        } else {
            setValue('categoryId', categoriesOfSelectedStore[0].id)
        }
    }, [setValue, categoriesOfSelectedStore])

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <TextInputElement register={register} placeholder={"Name..."} registerName={"name"} required={true} />
            {errors.name && <FormError />}
            <DropdownInputElement
                register={register}
                array={existingIngredientUnits}
                name="unitId"
            />
            <DropdownInputElement
                register={register}
                array={existingStores}
                name="storeUid"
            />
            {categoriesOfSelectedStore.length != 0
                && <DropdownInputElement
                    register={register}
                    array={categoriesOfSelectedStore.sort((a, b) => a.order - b.order)}
                    name="categoryId" />
            }
            <SubmitInputElement submitInputText="Add New Ingredient" />
        </form>
    )
}
