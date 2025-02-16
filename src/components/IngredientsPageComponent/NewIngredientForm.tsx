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
        <form className="flex min-w-60 flex-col gap-2 my-4 items-center" onSubmit={handleSubmit(onSubmit)}>

            <TextInputElement register={register} placeholder={"Ingredient name..."} registerName={"name"} styles="text-center" required={true} />
            {errors.name && <FormError />}
            <DropdownInputElement
                register={register}
                array={existingIngredientUnits}
                name="unitId"
                labelText="Unit:"
            />
            <DropdownInputElement
                register={register}
                array={existingStores}
                name="storeUid"
                labelText="Store:"
            />
            {categoriesOfSelectedStore.length != 0
                && <DropdownInputElement
                    register={register}
                    array={categoriesOfSelectedStore.sort((a, b) => a.order - b.order)}
                    name="categoryId"
                    labelText="Category:"
                />
            }
            <SubmitInputElement styles="my-2 w-[90%]" submitInputText="Add New Ingredient" />
        </form>
    )
}
