import { useFieldArray, useForm } from "react-hook-form";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { useEffect } from "react";
import { useAppContext } from "../../context/useAppContext";
import { MealIngredientType } from "../../types";
import { v4 } from "uuid";
import { UnitData } from "../../data/dummy";

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

  useEffect(() => {
    reset({ ingredients: [] })
  }, [isSubmitSuccessful, reset])

  console.log(fields)

  return (
    <div className="flex w-full">
      {/* New Meal Form */}
      <form className="flex flex-col w-80 mx-auto" onSubmit={
        handleSubmit(onSubmit)
      }>
        <TextInputElement register={register} placeholder={"Meal Name"} registerName={"name"} required={true} />
        {/* Search box that displays ingredients based on regex pattern */}
        {/* Can add ingredients to the meal from here */}
        {/* If they are added then it should spawn a div with the ingredient name and an input field for its amount and an input field for its unit */}
        {/* Once everything is set the new meal should be created and show up with all its details in the dailyview */}
        <select multiple>
          {ingredientBlueprints.map(item => {
            return <option key={item.uid} value={item.name} onClick={() => append({ amount: 0, id: v4(), blueprintId: item.uid })}>{item.name}</option>
          })}
        </select>
        {errors.name && <span>This field is required</span>}
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
