import { SubmitHandler, useForm, useWatch } from "react-hook-form"
import { IngredientFormInputs } from "../../ts/types"
import { useEffect, useMemo } from "react"
import { useAppContext } from "../../context/useAppContext"
import TextInputElement from "../FormComponents/TextInputElement"
import { IngredientBlueprintInterface } from "../../ts/interfaces"
import DropdownInputElement from "../FormComponents/DropdownInputElement"
import FormError from "../FormComponents/FormError"
import SubmitInputElement from "../FormComponents/SubmitInputElement"
import useExistingStores from "../../hooks/useExistingStores"

export default function EditIngredientModal({
    editingIngredientBlueprint,
    setEditingIngredientBlueprint,
}: {
    editingIngredientBlueprint: IngredientBlueprintInterface | null,
    setEditingIngredientBlueprint: React.Dispatch<React.SetStateAction<IngredientBlueprintInterface | null>>
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        setValue,
        reset,
        control
    } = useForm<IngredientFormInputs>()
    const { dispatch, state } = useAppContext()
    const selectedStoreId = useWatch({ control, name: "storeUid" })

    const existingIngredientUnits = useMemo(() => state.ingredientUnits.filter(item => !item.isDeleted), [state.ingredientUnits])
    const existingStores = useExistingStores(state)
    const categoriesOfSelectedStore = useMemo(
        () => state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId),
        [selectedStoreId, state.categories]
    )

    const OnDeleteIngredientBlueprintBtnClick = () => {
        if (editingIngredientBlueprint) {
            dispatch({ type: "DELETE_INGREDIENT_BLUEPRINT", payload: editingIngredientBlueprint.id })
        }
        setEditingIngredientBlueprint(null)
    }

    const SubmitUpdateIngredientBlueprintForm: SubmitHandler<IngredientFormInputs> = (data) => {
        if (editingIngredientBlueprint) {
            if (!data.categoryId) data.categoryId = null
            const updatedIngredientBlueprints = state.ingredientBlueprints.map(blueprint => {
                return blueprint.id === editingIngredientBlueprint.id ? { ...blueprint, ...data } as IngredientBlueprintInterface : blueprint
            })
            dispatch({ type: "SET_INGREDIENT_BLUEPRINTS", payload: updatedIngredientBlueprints })
        }
        setEditingIngredientBlueprint(null)
    }

    useEffect(() => {
        if (editingIngredientBlueprint) {
            setValue('name', editingIngredientBlueprint.name)
            setValue('storeUid', editingIngredientBlueprint.storeUid)
            setValue('unitId', editingIngredientBlueprint.unitId)
        }
    }, [setValue, editingIngredientBlueprint])

    useEffect(() => {
        if (categoriesOfSelectedStore.length === 0) {
            setValue('categoryId', null)
        } else {
            if (editingIngredientBlueprint && editingIngredientBlueprint.categoryId) {
                setValue('categoryId', editingIngredientBlueprint.categoryId)
            } else {
                setValue('categoryId', categoriesOfSelectedStore[0].id)
            }
        }
    }, [state.categories, setValue, selectedStoreId, editingIngredientBlueprint, categoriesOfSelectedStore])

    useEffect(() => {
        reset()
    }, [isSubmitSuccessful, reset])

    return editingIngredientBlueprint && (
        <div className="absolute bg-blue-200 left-[10%] w-[80%] flex flex-col">
            <div className="flex justify-between">
                <p className="m-2 text-lg">Edit {editingIngredientBlueprint.name}</p>
                <button onClick={() => setEditingIngredientBlueprint(null)} className=" text-red-800 text-lg m-2">X</button>
            </div>
            <form onSubmit={handleSubmit(SubmitUpdateIngredientBlueprintForm)} className="flex flex-col gap-2 p-2">
                <TextInputElement placeholder={editingIngredientBlueprint.name} register={register} registerName="name" required={true} />
                {errors.name && <FormError />}
                <DropdownInputElement
                    array={existingIngredientUnits}
                    name="unitId"
                    register={register}
                    defaultValue={editingIngredientBlueprint.unitId}
                />
                <DropdownInputElement
                    array={existingStores}
                    register={register}
                    defaultValue={editingIngredientBlueprint.storeUid}
                    name="storeUid"
                />
                {categoriesOfSelectedStore.length != 0
                    && <DropdownInputElement
                        register={register}
                        defaultValue={editingIngredientBlueprint.categoryId || categoriesOfSelectedStore[0].id}
                        array={categoriesOfSelectedStore.sort((a, b) => a.order - b.order)}
                        name="categoryId"
                    />
                }
                <SubmitInputElement submitInputText="Submut" />
            </form>
            <button onClick={() => OnDeleteIngredientBlueprintBtnClick()}>DELETE INGREDIENT BLUEPRINT</button>
        </div>
    )
}