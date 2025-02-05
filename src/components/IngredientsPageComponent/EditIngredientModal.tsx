import { SubmitHandler, useForm, useWatch } from "react-hook-form"
import { IngredientFormInputs } from "../../types"
import { useEffect } from "react"
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

    const { dispatch, state } = useAppContext()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        setValue,
        reset,
        control
    } = useForm<IngredientFormInputs>()

    const selectedStoreId = useWatch({ control, name: "storeUid" })

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
        const categoriesOfSelectedStore = state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId)
        if (categoriesOfSelectedStore.length === 0) {
            setValue('categoryId', null)
        } else {
            if (editingIngredientBlueprint && editingIngredientBlueprint.categoryId) {
                setValue('categoryId', editingIngredientBlueprint.categoryId)
            } else {
                setValue('categoryId', categoriesOfSelectedStore[0].id)
            }
        }
    }, [state.categories, setValue, selectedStoreId, editingIngredientBlueprint])

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
                    {state.ingredientUnits.map(item => !item.isDeleted &&
                        <option key={item.id} value={item.id}>{item.name}</option>
                    )}
                </select>
                <select {...register('storeUid')} defaultValue={editingIngredientBlueprint.storeUid}>
                    {state.stores.filter(item => !item.isDeleted).map(item =>
                        <option key={item.uid} value={item.uid} >{item.name}</option>
                    )}
                </select>
                {state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId).length != 0 && <select {...register('categoryId')} defaultValue={editingIngredientBlueprint.categoryId || state.categories.filter(item => item.storeId === selectedStoreId && !item.isDeleted)[0].id}>
                    {state.categories.filter(item => !item.isDeleted && item.storeId === selectedStoreId).sort((a, b) => a.order - b.order).map(item =>
                        <option key={item.id} value={item.id} >{item.name}</option>
                    )}
                </select>}
                <input type="submit" />
            </form>
            <button onClick={() => OnDeleteIngredientBlueprintBtnClick()}>DELETE INGREDIENT BLUEPRINT</button>
        </div>
    )
}


// when selecting a new store only use first index if our category doesnt match any