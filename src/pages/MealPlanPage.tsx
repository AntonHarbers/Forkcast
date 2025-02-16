import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import DailyView from "../components/DailyView";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import { useMemo, useState } from "react";
import { MealIngredientInterface, MealInterface } from "../ts/interfaces";
import Header from "../components/Global/Header";
import { addMeal } from "../DB/mealsCrud";

function MealPlanPage() {
  const { state, dispatch } = useAppContext()

  const [copyMeal, setCopyMeal] = useState<MealInterface | null>(null)
  const [mealCopyDates, setMealCopyDates] = useState<string[]>([])

  const ToggleCopyMeal = async (mealToSet: MealInterface) => {
    if (copyMeal === null) {
      setCopyMeal(mealToSet)
      return
    }

    if (copyMeal.id != mealToSet.id) return

    try {
      const mealsToAdd = await Promise.all(
        mealCopyDates.map(async (newMealDate) => {
          const maxOrder = state.meals.reduce((acc, cur) => {
            if (cur.date === newMealDate) {
              acc = Math.max(acc, cur.order);
            }
            return acc;
          }, 0);
          const newMeal = {
            ...mealToSet,
            date: newMealDate,
            id: v4(),
            order: maxOrder + 1,
            ingredients: mealToSet.ingredients.map(ing => { return { ...ing, id: v4(), bought: false } })
          }

          await addMeal(newMeal)

          return newMeal
        })
      )
      dispatch({ type: "SET_MEALS", payload: [...state.meals, ...mealsToAdd] })

    } catch (error) {
      console.error('Issue copying meals: ', error)
    }

    setCopyMeal(null)
    setMealCopyDates([])
  }

  const selectedDayExistingMeals = useMemo(() => state.meals.filter(item => !item.isDeleted && item.date === state.selectedDay.toDateString()), [state.selectedDay, state.meals])

  const AddMealHandler = async (
    newDay: Date,
    name: string,
    ingredients: MealIngredientInterface[]
  ) => {
    try {
      const highest = selectedDayExistingMeals.reduce((acc, cur) => {
        acc = Math.max(acc, cur.order)
        return acc
      }, 0)

      const newMeal: MealInterface = {
        id: v4(),
        name,
        ingredients,
        date: newDay.toDateString(),
        order: highest + 1,
        isFinished: false,
        isDeleted: false,
        deletedAt: new Date().toDateString()
      }

      await addMeal(newMeal)
      dispatch({ type: "SET_MEALS", payload: [...state.meals, newMeal] })
    } catch (error) {
      console.error('Adding meal failed: ', error)
    }
  };

  return (
    <>
      <Header text={state.selectedDay.toDateString()} />
      <div className="justify-center flex">
        <Calendar
          className={"react-calendar"}
          tileContent={
            ({ date, view }) => view === 'month' && mealCopyDates.includes(date.toDateString()) ? <p className="text-xs">Copy</p> : null
          }
          defaultValue={state.selectedDay}
          onChange={(e: Value) => {
            if (copyMeal == null) {
              if (e instanceof Date) dispatch({ type: 'SET_SELECTED_DAY', payload: e })
            } else {
              if (e instanceof Date) {
                const dateString: string = e.toDateString()
                if (mealCopyDates.includes(dateString)) {
                  setMealCopyDates(mealCopyDates.filter(e => e !== dateString))
                } else {
                  setMealCopyDates([...mealCopyDates, dateString])
                }
              }
            }
          }}
        />
      </div>

      <DailyView
        day={state.selectedDay}
        AddMealHandler={AddMealHandler}
        dailyMeals={selectedDayExistingMeals.sort((a, b) => a.order - b.order)}
        copyMeal={copyMeal}
        ToggleCopyMeal={ToggleCopyMeal}
      />
    </>
  );
}

export default MealPlanPage;
