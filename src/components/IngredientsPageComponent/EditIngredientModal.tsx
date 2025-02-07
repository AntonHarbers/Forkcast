import { SubmitHandler, useForm, useWatch } from "react-hook-form"
import { IngredientFormInputs } from "../../types"
import { useEffect, useMemo } from "react"
import IngredientBlueprint from "../../classes/IngredientBlueprint"
import { useAppContext } from "../../context/useAppContext"
import TextInputElement from "../FormComponents/TextInputElement"

export default function EditIngredientModal({
    editingIngredientBlueprint,
    setEditingIngredientBlueprint,
}: {
    editingIngredientBlueprint: IngredientBlueprint | null,
    setEditingIngredientBlueprint: React.Dispatch<React.SetStateAction<IngredientBlueprint | null>>
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
    const existingStores = useMemo(() => state.stores.filter(item => !item.isDeleted), [state.stores])
    const categoriesOfSelectedStore = useMemo(
        () => state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId),
        [selectedStoreId, state.categories]
    )



    const OnDeleteIngredientBlueprintBtnClick = () => {
        if (editingIngredientBlueprint) {
            dispatch({ type: "DELETE_INGREDIENT_BLUEPRINT", payload: editingIngredientBlueprint.uid })
        }
        setEditingIngredientBlueprint(null)
    }

    const SubmitUpdateIngredientBlueprintForm: SubmitHandler<IngredientFormInputs> = (data) => {
        if (editingIngredientBlueprint) {
            if (!data.categoryId) data.categoryId = null
            const updatedIngredientBlueprints = state.ingredientBlueprints.map(blueprint => {
                return blueprint.uid === editingIngredientBlueprint.uid ? new IngredientBlueprint(blueprint.uid, data.name, data.storeUid, data.unitId, data.categoryId, blueprint.isDeleted, blueprint.deletedAt) : blueprint
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
                {errors.name && <span>This field is required!</span>}
                <select {...register('unitId')} defaultValue={editingIngredientBlueprint.unitId}>
                    {existingIngredientUnits.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
                <select {...register('storeUid')} defaultValue={editingIngredientBlueprint.storeUid}>
                    {existingStores.map(item => <option key={item.uid} value={item.uid} >{item.name}</option>)}
                </select>
                {categoriesOfSelectedStore.length != 0 && 
                <select {...register('categoryId')} defaultValue={editingIngredientBlueprint.categoryId || categoriesOfSelectedStore[0].id}>
                    {categoriesOfSelectedStore.sort((a, b) => a.order - b.order).map(item =>
                        <option key={item.id} value={item.id} >{item.name}</option>
                    )}
                </select>}
                <input type="submit" />
            </form>
            <button onClick={() => OnDeleteIngredientBlueprintBtnClick()}>DELETE INGREDIENT BLUEPRINT</button>
        </div>
    )
}