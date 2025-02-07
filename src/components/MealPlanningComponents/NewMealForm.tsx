import { useFieldArray, useForm } from "react-hook-form";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { IngredientUnit, MealIngredientType } from "../../types";
import { v4 } from "uuid";
import IngredientBlueprint from "../../classes/IngredientBlueprint";
import debounce from "lodash.debounce";

// Type Def.
type Inputs = {
  name: string;
  ingredients: MealIngredientType[];
};

export default function NewMealForm({
  onSubmit,
}: {
  onSubmit: (data: Inputs) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    reset,
    control
  } = useForm<Inputs>();


  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" })

  const { state } = useAppContext()

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientBlueprint[]>([])

  const blueprintsById = useMemo(() => {
    return state.ingredientBlueprints.reduce((acc: { [key: string]: IngredientBlueprint }, ingredient) => {
      acc[ingredient.uid] = ingredient
      return acc
    }, {} as { [key: string]: IngredientBlueprint })
  }, [state.ingredientBlueprints])

  const unitsById = useMemo(() => {
    return state.ingredientUnits.reduce((acc, unit) => {
      acc[unit.id] = unit
      return acc
    }, {} as { [key: string]: IngredientUnit })
  }, [state.ingredientUnits])

  useEffect(() => {
    reset({ ingredients: [] })
  }, [isSubmitSuccessful, reset])

  const debouncedFilter = useMemo(() => debounce((value: string, ingredientBlueprints: IngredientBlueprint[]) => {
    if (!value) {
      setFilteredIngredients([])
      return
    }
    const regex = new RegExp(value, 'i')
    const filtered = ingredientBlueprints.filter(ingredient => regex.test(ingredient.name) && !ingredient.isDeleted)
    setFilteredIngredients(filtered)
  }, 250), [])

  const HandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    debouncedFilter(val, state.ingredientBlueprints)
  }

  return (
    <div className="flex w-full">
      {/* New Meal Form */}
      <form className="flex flex-col w-80 mx-auto gap-2" onSubmit={
        handleSubmit(onSubmit)
      }>
        <TextInputElement register={register} placeholder={"Meal Name"} registerName={"name"} required={true} />
        {errors.name && <span>This field is required</span>}
        <div>
          <input type="text" value={searchTerm} onChange={HandleSearchChange} className="p-2 rounded-md w-full" />
        </div>
        <div className="flex flex-col">
          {filteredIngredients.map(item => {
            return (
              <div className="bg-green-100 p-3 rounded-md border border-slate-600 m-2 flex justify-between items-center" key={item.uid}>
                <div>{item.name}</div>
                <button type="button" className="bg-green-500 rounded-md p-2 hover:bg-green-600 active:bg-green-800" onClick={() => {
                  append({ amount: 0, id: v4(), blueprintId: item.uid, bought: false })
                  setFilteredIngredients([])
                  setSearchTerm("")
                }}>Add</button>
              </div>
            )
          })}
        </div>
        {fields.map((field, index) => (
          <div className="flex items-center gap-2" key={field.id}>
            <div className="w-[50%]">{blueprintsById[field.blueprintId].name}</div>
            <input hidden {...register(`ingredients.${index}.blueprintId`)} />
            <input className="w-20 text-center p-1 rounded-sm" type="number" {...register(`ingredients.${index}.amount`, { valueAsNumber: true })} />
            <div>{unitsById[blueprintsById[field.blueprintId].unitId].name || "Err"}</div>
            <button className="bg-red-300 hover:bg-red-400 active:bg-red-500 rounded-md p-1" type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>

        ))}

        <SubmitInputElement submitInputText="Add New Meal!" />
      </form>
    </div>
  );
}
