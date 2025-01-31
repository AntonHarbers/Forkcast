import { useEffect, useState } from "react";
import MealData from "../../classes/MealData";
import { useAppContext } from "../../context/useAppContext";
import { UnitData } from "../../data/dummy";
import { useFieldArray, useForm } from "react-hook-form";
import { MealIngredientType } from "../../types";
import IngredientBlueprint from "../../classes/IngredientBlueprint";
import { v4 } from "uuid";

// Type Def.
type Inputs = {
  name: string;
  ingredients: MealIngredientType[];
};

export default function DailyViewMeals({
  meal,
  prevId,
  nextId,
}: {
  meal: MealData,
  prevId: string | null,
  nextId: string | null
}) {
  const { ingredientBlueprints, setMeals, meals } = useAppContext()
  const [editing, setEditing] = useState(false)

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    control,
    handleSubmit
  } = useForm<Inputs>()
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" })

  const ToggleMealDone = () => {
    const newMeals = meals.map(mealData => {
      if (mealData.uid === meal.uid) {
        const copy = meal
        copy.finished = !meal.finished
        return copy
      } else {
        return mealData
      }
    })

    setMeals(newMeals)
  }



  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientBlueprint[]>([])
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

  const DeleteMeal = () => {
    const newMeals = meals.filter(mealData => {
      return mealData.uid != meal.uid
    })
    setMeals(newMeals)
  }

  const EditMeal = () => {
    // put this mealData into the new Meal form and let that form handle the update
    setEditing(!editing)
    meal.ingredients.forEach(data => append({ amount: data.amount, id: data.id, blueprintId: data.blueprintId }))
  }

  const SubmitEditMeal = (data: Inputs) => {
    setEditing(false)

    // set the corresponding ingredient data
    const newMeal = new MealData(
      meal.uid,
      data.name,
      data.ingredients,
      meal.date,
      meal.order,
      meal.finished
    );

    const UpdatedMeals = meals.map(mealData => {
      if (mealData.uid === meal.uid) {
        return newMeal
      }
      return mealData
    })

    setMeals(UpdatedMeals);
  }

  const ShiftMealUp = () => {
    const nextMeal = meals.find(mealData => mealData.uid === nextId)
    if (!nextMeal) return
    const savedOrder = nextMeal.order
    nextMeal.order = meal.order
    meal.order = savedOrder
    const newMeals = meals.map(mealData => {
      if (mealData.uid === nextId) {
        return nextMeal
      } else if (mealData.uid === meal.uid) {
        return meal
      } else {
        return mealData
      }
    })

    setMeals(newMeals)
  }

  const ShiftMealDown = () => {
    const prevMeal = meals.find(mealData => mealData.uid === prevId)
    if (!prevMeal) return
    const savedOrder = prevMeal.order
    prevMeal.order = meal.order
    meal.order = savedOrder
    const newMeals = meals.map(mealData => {
      if (mealData.uid === prevId) {
        return prevMeal
      } else if (mealData.uid === meal.uid) {
        return meal
      } else {
        return mealData
      }
    })

    setMeals(newMeals)
  }

  useEffect(() => {
    reset({ ingredients: [] })
  }, [isSubmitSuccessful, reset])

  return (
    <div className={`w-auto border-b p-2 m-10 text-2xl text-start ${meal.finished ? "bg-slate-400" : editing ? 'bg-green-300' : 'bg-slate-100'}`}>
      {editing ? <div>
        <form onSubmit={handleSubmit(SubmitEditMeal)}>
          <div className="flex justify-between">
            <input defaultValue={meal.name} {...register("name", { required: true })} className="text-2xl font-bold" />
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
                      append({ amount: 0, id: v4(), blueprintId: item.uid })
                      setFilteredIngredients([])
                      setSearchTerm("")
                    }}>Add</button>
                  </div>
                )
              })}
            </div>

            <button onClick={DeleteMeal} className="bg-red-300 p-1 text-lg rounded-sm hover:bg-red-400 active:bg-red-500">Delete</button>
            <div className="flex flex-col">
              {prevId && <button type="button" onClick={ShiftMealDown}>Down</button>}
              {nextId && <button type="button" onClick={ShiftMealUp}>Up</button>}
            </div>
            <input type="submit" className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 rounded-sm p-1 text-lg" />
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex justify-between gap-2">
              <div className="text-lg">{ingredientBlueprints.find(item => item.uid === field.blueprintId)?.name || "Name Err"}</div>
              <input hidden {...register(`ingredients.${index}.blueprintId`)} />
              <div className="flex gap-1">
                <input className="w-20 text-center p-1 rounded-sm" type="number" {...register(`ingredients.${index}.amount`)} />
                <div>{UnitData.find(unitItem => unitItem.id === ingredientBlueprints.find(item => item.uid === field.blueprintId)?.unitId)?.name || "Err"}</div>
              </div>
              <button className="bg-red-300 hover:bg-red-400 active:bg-red-500 rounded-md p-1" type="button" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          ))}
        </form>
      </div> : <div>
        <div className="flex justify-between">
          <div className="text-2xl font-bold">{meal.name}</div>
          <button onClick={EditMeal} className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 rounded-sm p-1 text-lg">Edit</button>
          <div className="flex gap-2">
            <div className="text-lg">Done</div>
            <input type="checkbox" checked={meal.finished} onChange={ToggleMealDone} />
          </div>
        </div>
        {meal.ingredients.map(ingredient => {
          return (
            <div key={ingredient.id} className="flex justify-between gap-2">
              <div className="text-lg">{ingredientBlueprints.find(item => item.uid === ingredient.blueprintId)?.name || "Name Err"}</div>
              <div className="flex gap-1">
                <div className="text-lg font-bold">{ingredient.amount}</div>
                <div className="text-lg">{UnitData.find(unit => unit.id === ingredientBlueprints.find(item => item.uid === ingredient.blueprintId)?.unitId)?.name || "Unit Err"}</div>
              </div>
            </div>
          )
        })}
      </div>}
    </div>
  );
}
