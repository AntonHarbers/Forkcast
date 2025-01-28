import { useFieldArray, useForm } from "react-hook-form";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { MealIngredientType } from "../../types";
import { v4 } from "uuid";
import { UnitData } from "../../data/dummy";
import IngredientBlueprint from "../../classes/IngredientBlueprint";

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

  const { ingredientBlueprints } = useAppContext()

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientBlueprint[]>([])

  useEffect(() => {
    reset({ ingredients: [] })
  }, [isSubmitSuccessful, reset])

  const HandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)

    if (!e.target.value) {
      setFilteredIngredients([])
      return
    }

    const regex = new RegExp(e.target.value, "i")
    const filtered = ingredientBlueprints.filter(ingredient => regex.test(ingredient.name))
    setFilteredIngredients(filtered)
  }

  return (
    <div className="flex w-full">
      {/* New Meal Form */}
      <form className="flex flex-col w-80 mx-auto gap-2" onSubmit={
        handleSubmit(onSubmit)
      }>
        <TextInputElement register={register} placeholder={"Meal Name"} registerName={"name"} required={true} />
        {errors.name && <span>This field is required</span>}

        {/* Search box that displays ingredients based on regex pattern */}
        <div>
          <input type="text" value={searchTerm} onChange={HandleSearchChange} className="p-2 rounded-md w-full" />

        </div>
        <div className="flex flex-col">
          {filteredIngredients.map(item => {
            return (
              <div className="bg-green-100 p-3 rounded-md border border-slate-600 m-2 flex justify-between items-center" key={item.uid}>
                <div>{item.name}</div>
                <button type="button" className="bg-green-500 rounded-md p-2 hover:bg-green-600 active:bg-green-800" onClick={() => {
                  append({ amount: 0, id: v4(), blueprintId: item.uid })
                  setFilteredIngredients([])
                  setSearchTerm("")
                }}>Add</button>
              </div>
            )
          })}
        </div>
        {/* Can add ingredients to the meal from here */}
        {/* If they are added then it should spawn a div with the ingredient name and an input field for its amount and an input field for its unit */}
        {/* Once everything is set the new meal should be created and show up with all its details in the dailyview */}
        {fields.map((field, index) => (
          <div key={field.id}>
            <div>{ingredientBlueprints.find(item => item.uid === field.blueprintId)?.name}</div>
            <input hidden {...register(`ingredients.${index}.blueprintId`)} />
            <input type="number" {...register(`ingredients.${index}.amount`)} />
            <div>{UnitData.find(unitItem => unitItem.id === ingredientBlueprints.find(item => item.uid === field.blueprintId)?.unitId)?.name || "Err"}</div>
            <button type="button" onClick={() => remove(index)}>
              Remove
            </button>
          </div>

        ))}

        <SubmitInputElement submitInputText="Add New Meal!" />
      </form>
    </div>
  );
}
