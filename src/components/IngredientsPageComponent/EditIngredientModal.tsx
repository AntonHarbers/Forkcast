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
import { updateIngredientBlueprint } from "../../DB/ingredientBlueprintsCRUD"

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

    const OnDeleteIngredientBlueprintBtnClick = async () => {
        if (editingIngredientBlueprint === null) return
        try {

            const updatedItem: IngredientBlueprintInterface = {
                ...editingIngredientBlueprint,
                isDeleted: true,
                deletedAt: new Date().toDateString(),
            };
            await updateIngredientBlueprint(updatedItem);
            dispatch({ type: "DELETE_INGREDIENT_BLUEPRINT", payload: editingIngredientBlueprint.id })
            setEditingIngredientBlueprint(null)

        } catch (error) {
            console.error("Error deleting ingredient blueprint: ", error)
        }
    }

    const SubmitUpdateIngredientBlueprintForm: SubmitHandler<IngredientFormInputs> = async (data) => {
        if (!editingIngredientBlueprint) return
        try {
            if (!data.categoryId) data.categoryId = null
            const updatedBlueprint: IngredientBlueprintInterface = { ...editingIngredientBlueprint, ...data }
            const updatedIngredientBlueprints = state.ingredientBlueprints.map(blueprint => {
                return blueprint.id === editingIngredientBlueprint.id ? updatedBlueprint : blueprint
            })
            await updateIngredientBlueprint(updatedBlueprint)
            dispatch({ type: "SET_INGREDIENT_BLUEPRINTS", payload: updatedIngredientBlueprints })
            setEditingIngredientBlueprint(null)
        } catch (error) {
            console.error("Error updating ingredient blueprint: ", error)
        }
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
        <div className="absolute bg-slate-700 rounded-md text-white left-[10%] w-[80%] flex flex-col">
            <div className="flex px-10 mt-2 items-center justify-between">
                <p className="m-2 text-3xl">Edit {editingIngredientBlueprint.name}</p>
                <button onClick={() => setEditingIngredientBlueprint(null)} className="text-lg m-2 hover:scale-125 active:scale-90 transition-all ease-in-out">❌</button>
            </div>
            <form onSubmit={handleSubmit(SubmitUpdateIngredientBlueprintForm)} className="flex flex-col gap-2 p-2">
                <TextInputElement placeholder={editingIngredientBlueprint.name} register={register} registerName="name" styles="w-[90%] mx-auto text-center text-2xl" required={true} />
                {errors.name && <FormError />}
                <DropdownInputElement
                    array={existingIngredientUnits}
                    name="unitId"
                    register={register}
                    defaultValue={editingIngredientBlueprint.unitId}
                    labelText="Unit: "
                    styles="mx-auto text-slate-800"
                />
                <DropdownInputElement
                    array={existingStores}
                    register={register}
                    defaultValue={editingIngredientBlueprint.storeUid}
                    name="storeUid"
                    labelText="Store:"
                    styles="mx-auto text-slate-800"

                />
                {categoriesOfSelectedStore.length != 0
                    && <DropdownInputElement
                        register={register}
                        defaultValue={editingIngredientBlueprint.categoryId || categoriesOfSelectedStore[0].id}
                        array={categoriesOfSelectedStore.sort((a, b) => a.order - b.order)}
                        name="categoryId"
                    />
                }
                <SubmitInputElement submitInputText="Update" styles="text-slate-800 my-2 w-[90%] mx-auto" />
            </form>
            <button className="bg-red-600 mx-auto w-[90%] rounded-md my-2 font-bold text-xl hover:bg-red-900 active:bg-red-400 transition-all ease-in-out" onClick={() => OnDeleteIngredientBlueprintBtnClick()}>DELETE INGREDIENT BLUEPRINT</button>
        </div>
    )
}