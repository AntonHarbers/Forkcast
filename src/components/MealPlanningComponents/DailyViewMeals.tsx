import { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { useFieldArray, useForm } from "react-hook-form";
import { v4 } from "uuid";
import debounce from "lodash.debounce";
import { MealFormInputType } from "../../ts/types";
import { IngredientBlueprintInterface, MealInterface, UnitInterface } from "../../ts/interfaces";

export default function DailyViewMeals({
  meal,
  prevId,
  nextId,
}: {
  meal: MealInterface,
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
    handleSubmit,
    setValue
  } = useForm<MealFormInputType>()
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" })

  const ToggleMealDone = () => {
    const newMeals = state.meals.map(mealData => {
      return mealData.id != meal.id ? mealData : { ...mealData, finished: !meal.isFinished }
    })
    dispatch({ type: "SET_MEALS", payload: newMeals })
  }

  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filteredIngredients, setFilteredIngredients] = useState<IngredientBlueprintInterface[]>([])

  const debouncedFilter = useMemo(() => debounce((value: string, ingredientBlueprints: IngredientBlueprintInterface[]) => {
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
    dispatch({ type: "DELETE_MEAL", payload: meal.id })
  }

  const EditMeal = () => {
    setEditing(!editing)
    meal.ingredients.forEach(data => append({ amount: data.amount, id: data.id, blueprintId: data.blueprintId, bought: data.bought }))
  }

  const SubmitEditMeal = (data: MealFormInputType) => {
    setEditing(false)
    const UpdatedMeals = state.meals.map(mealData => {
      return mealData.id != meal.id ? mealData : { ...meal, name: data.name, ingredients: data.ingredients }
    })

    dispatch({ type: "SET_MEALS", payload: UpdatedMeals })
  }

  const SwapMealOrder = (swapId: string) => {
    const swapMeal = state.meals.find(mealData => mealData.id === swapId)
    if (!swapMeal) return
    const savedOrder = swapMeal.order
    const newMeals = state.meals.map(mealData => {
      return mealData.id === swapId
        ? { ...swapMeal, order: meal.order }
        : mealData.id === meal.id
          ? { ...meal, order: savedOrder }
          : mealData
    })
    dispatch({ type: "SET_MEALS", payload: newMeals })
  }

  useEffect(() => {
    reset({ ingredients: [] })
  }, [isSubmitSuccessful, reset])

  const blueprintsById = useMemo(() => {
    return state.ingredientBlueprints.reduce((acc: { [key: string]: IngredientBlueprintInterface }, ingredient) => {
      acc[ingredient.id] = ingredient
      return acc
    }, {})
  }, [state.ingredientBlueprints])

  const unitsById = useMemo(() => {
    return state.ingredientUnits.reduce((acc: { [key: string]: UnitInterface }, unit) => {
      acc[unit.id] = unit
      return acc
    }, {})
  }, [state.ingredientUnits])

  return (
    <div className={`w-auto border-b p-2 m-10 text-2xl text-start ${meal.isFinished ? "bg-slate-400" : editing ? 'bg-green-300' : 'bg-slate-100'}`}>
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
                  <div className="bg-green-100 p-3 rounded-md border border-slate-600 m-2 flex justify-between items-center" key={item.id}>
                    <div>{item.name}</div>
                    <button type="button" className="bg-green-500 rounded-md p-2 hover:bg-green-600 active:bg-green-800" onClick={() => {
                      if (fields.find(field => field.blueprintId === item.id)) {
                        window.alert('Meal already contains this ingredient!')
                        return
                      }
                      append({ amount: 0, id: v4(), blueprintId: item.id, bought: false })
                      setValue(`ingredients.${fields.length}.amount`, 1)
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
                <input className="w-20 text-center p-1 rounded-sm" defaultValue={1} min={1} type="number" {...register(`ingredients.${index}.amount`, { min: 1, valueAsNumber: true })} />
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
            <input type="checkbox" checked={meal.isFinished} onChange={ToggleMealDone} />
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
