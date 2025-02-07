import { useEffect, useMemo, useState } from "react";
import MealData from "../../classes/MealData";
import { useAppContext } from "../../context/useAppContext";
import { useFieldArray, useForm } from "react-hook-form";
import { MealIngredientType } from "../../types";
import IngredientBlueprint from "../../classes/IngredientBlueprint";
import { v4 } from "uuid";
import Unit from "../../classes/UnitData";
import debounce from "lodash.debounce";

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
  const { state, dispatch } = useAppContext()
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
    const newMeals = state.meals.map(mealData => {
      return mealData.uid != meal.uid ? mealData : { ...mealData, finished: !meal.finished }
    })
    dispatch({ type: "SET_MEALS", payload: newMeals })
  }

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientBlueprint[]>([])

  const debouncedFilter = useMemo(() => debounce((value: string, ingredientBlueprints: IngredientBlueprint[]) => {
    if (!value) {
      setFilteredIngredients([])
      return
    }
    const regex = new RegExp(value, 'i')
    const filtered = ingredientBlueprints.filter(ingredient => !ingredient.isDeleted && regex.test(ingredient.name))
    setFilteredIngredients(filtered)
  }, 250), [])

  const HandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setSearchTerm(val)
    debouncedFilter(val, state.ingredientBlueprints)
  }

  const DeleteMeal = () => {
    dispatch({ type: "DELETE_MEAL", payload: meal.uid })
  }

  const EditMeal = () => {
    setEditing(!editing)
    meal.ingredients.forEach(data => append({ amount: data.amount, id: data.id, blueprintId: data.blueprintId, bought: data.bought }))
  }

  const SubmitEditMeal = (data: Inputs) => {
    setEditing(false)
    const UpdatedMeals = state.meals.map(mealData => {
      return mealData.uid != meal.uid ? mealData : { ...meal, name: data.name, ingredients: data.ingredients }
    })

    dispatch({ type: "SET_MEALS", payload: UpdatedMeals })
  }

  const SwapMealOrder = (swapId: string) => {
    const swapMeal = state.meals.find(mealData => mealData.uid === swapId)
    if (!swapMeal) return
    const savedOrder = swapMeal.order
    const newMeals = state.meals.map(mealData => {
      return mealData.uid === swapId
        ? { ...swapMeal, order: meal.order }
        : mealData.uid === meal.uid
          ? { ...meal, order: savedOrder }
          : mealData
    })
    dispatch({ type: "SET_MEALS", payload: newMeals })
  }

  useEffect(() => {
    reset({ ingredients: [] })
  }, [isSubmitSuccessful, reset])

  const blueprintsById = useMemo(() => {
    return state.ingredientBlueprints.reduce((acc: { [key: string]: IngredientBlueprint }, ingredient) => {
      acc[ingredient.uid] = ingredient
      return acc
    }, {})
  }, [state.ingredientBlueprints])

  const unitsById = useMemo(() => {
    return state.ingredientUnits.reduce((acc: { [key: string]: Unit }, unit) => {
      acc[unit.id] = unit
      return acc
    }, {})
  }, [state.ingredientUnits])

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
                      append({ amount: 0, id: v4(), blueprintId: item.uid, bought: false })
                      setFilteredIngredients([])
                      setSearchTerm("")
                    }}>Add</button>
                  </div>
                )
              })}
            </div>

            <button onClick={DeleteMeal} type="button" className="bg-red-300 p-1 text-lg rounded-sm hover:bg-red-400 active:bg-red-500">Delete</button>
            <div className="flex flex-col">
              {prevId && <button type="button" onClick={() => SwapMealOrder(prevId)}>Up</button>}
              {nextId && <button type="button" onClick={() => SwapMealOrder(nextId)}>Down</button>}
            </div>
            <input type="submit" className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 rounded-sm p-1 text-lg" />
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="flex justify-between gap-2">
              <div className="text-lg">{blueprintsById[field.blueprintId].name || "Name Err"}</div>
              <input hidden {...register(`ingredients.${index}.blueprintId`)} />
              <div className="flex gap-1">
                <input className="w-20 text-center p-1 rounded-sm" type="number" {...register(`ingredients.${index}.amount`, { valueAsNumber: true })} />
                <div>{unitsById[blueprintsById[field.blueprintId].unitId].name || "ERR"}</div>
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
              <div className="text-lg">{blueprintsById[ingredient.blueprintId].name || "Name Err"}</div>
              <div className="flex gap-1">
                <div className="text-lg font-bold">{ingredient.amount}</div>
                <div className="text-lg">{unitsById[blueprintsById[ingredient.blueprintId].unitId].name || "Unit Err"}</div>
              </div>
            </div>
          )
        })}
      </div>}
    </div>
  );
}
