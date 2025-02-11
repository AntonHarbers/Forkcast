import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import DailyView from "../components/DailyView";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import { useMemo, useState } from "react";
import { MealIngredientInterface, MealInterface } from "../ts/interfaces";
import Header from "../components/Global/Header";

function MealPlanPage() {
  const { state, dispatch } = useAppContext()

  const [copyMeal, setCopyMeal] = useState<MealInterface | null>(null)
  const [mealCopyDates, setMealCopyDates] = useState<string[]>([])

  const ToggleCopyMeal = (mealToSet: MealInterface) => {
    if (copyMeal === null) {
      setCopyMeal(mealToSet)
      return
    }

    if (copyMeal.id != mealToSet.id) return

    const mealsToAdd: MealInterface[] = []
    mealCopyDates.forEach(newMealDate => {
      const maxOrder = state.meals.reduce((acc, cur) => {
        if (cur.date === newMealDate) {
          acc = Math.max(acc, cur.order);
        }
        return acc;
      }, 0);

      mealsToAdd.push({ ...mealToSet, date: newMealDate, id: v4(), order: maxOrder + 1, ingredients: mealToSet.ingredients.map(ing => { return { ...ing, id: v4(), bought: false } }) })
    })
    dispatch({ type: "SET_MEALS", payload: [...state.meals, ...mealsToAdd] })
    setCopyMeal(null)
    setMealCopyDates([])
  }

  const selectedDayExistingMeals = useMemo(() => state.meals.filter(item => !item.isDeleted && item.date === state.selectedDay.toDateString()), [state.selectedDay, state.meals])
  const AddMealHandler = (
    newDay: Date,
    name: string,
    ingredients: MealIngredientInterface[]
  ) => {
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

    dispatch({ type: "SET_MEALS", payload: [...state.meals, newMeal] })
  };

  return (
    <>
      <Header text="Meal Plan" />
      <div className="justify-center flex">
        <Calendar
          className={"react-calendar"}
          tileContent={
            ({ date, view }) => view === 'month' && mealCopyDates.includes(date.toDateString()) ? <p className="text-xs">Copy</p> : null
          }
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
