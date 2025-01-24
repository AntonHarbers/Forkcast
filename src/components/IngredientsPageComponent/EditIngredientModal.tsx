import { SubmitHandler, useForm } from "react-hook-form"
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

    const { ingredientBlueprints, setIngredientBlueprints } = useAppContext()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        setValue,
        reset,
    } = useForm<IngredientFormInputs>()

    const OnDeleteIngredientBlueprintBtnClick = () => {
        if (editingIngredientBlueprint) {
            const newIngredientBlueprintData = ingredientBlueprints.filter(item => item.uid != editingIngredientBlueprint.uid)
            setIngredientBlueprints(newIngredientBlueprintData)
        }
        setEditingIngredientBlueprint(null)
    }

    const SubmitUpdateIngredientBlueprintForm: SubmitHandler<IngredientFormInputs> = (data) => {
        if (editingIngredientBlueprint) {
            const updatedIngredientBlueprints = ingredientBlueprints.map(blueprint => {
                return blueprint.uid === editingIngredientBlueprint.uid ? new IngredientBlueprint(blueprint.uid, data.name, data.storeUid) : blueprint
            })
            setIngredientBlueprints(updatedIngredientBlueprints)
        }
        setEditingIngredientBlueprint(null)
    }

    useEffect(() => {
        if (editingIngredientBlueprint) {
            setValue('name', editingIngredientBlueprint.name)
        }
    }, [setValue, editingIngredientBlueprint])

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
                <input type="submit" />
            </form>
            <button onClick={() => OnDeleteIngredientBlueprintBtnClick()}>DELETE INGREDIENT BLUEPRINT</button>
        </div>
    )
}
