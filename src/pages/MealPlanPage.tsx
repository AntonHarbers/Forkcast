import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import DailyView from "../components/DailyView";
import MealData from "../classes/MealData";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import { MealIngredientType } from "../types";

function MealPlanPage() {
  const { state, dispatch } = useAppContext()

  const AddMealHandler = (
    newDay: Date,
    name: string,
    ingredients: MealIngredientType[]
  ) => {

    // get the highest order of this day
    let highest = 0;

    state.meals.filter(meal => meal.date === state.selectedDay.toDateString()).forEach(meal => highest = Math.max(highest, meal.order))

    const newMeal = new MealData(
      v4(),
      name,
      ingredients,
      newDay.toDateString(),
      highest + 1,
      false,
    );
    dispatch({ type: "SET_MEALS", payload: [...state.meals, newMeal] })
  };

  return (
    <>
      <h1 className="mx-auto w-full text-center text-5xl m-10">Meal Plan</h1>
      <div>
        <div className="justify-center flex">
          <Calendar
            className={"react-calendar"}
            onChange={(e: Value) => {
              if (e instanceof Date) dispatch({ type: 'SET_SELECTED_DAY', payload: e })
            }}
          />
        </div>

        <DailyView
          day={state.selectedDay}
          AddMealHandler={AddMealHandler}
          dailyMeals={state.meals.filter((item) => item.date === state.selectedDay.toDateString()).sort((a, b) => a.order - b.order)}
        />
      </div>

    </>
  );
}

export default MealPlanPage;
