import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import DailyView from "../components/DailyView";
import MealData from "../classes/MealData";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import { MealIngredientType } from "../types";

function MealPlanPage() {
  const { meals, setMeals, selectedDay, setSelectedDay } = useAppContext()

  const AddMealHandler = (
    newDay: Date,
    name: string,
    ingredients: MealIngredientType[]
  ) => {

    // get the highest order of this day
    let highest = 0;

    meals.filter(meal => meal.date === selectedDay.toDateString()).forEach(meal => highest = Math.max(highest, meal.order))

    const newMeal = new MealData(
      v4(),
      name,
      ingredients,
      newDay.toDateString(),
      highest + 1,
      false,
    );
    setMeals([...meals, newMeal]);
  };

  return (
    <>
      <h1 className="mx-auto w-full text-center text-5xl m-10">Meal Plan</h1>
      <div>
        <div className="justify-center flex">
          <Calendar
            className={"react-calendar"}
            onChange={(e: Value) => {
              if (e instanceof Date) setSelectedDay(e);
            }}
          />
        </div>

        <DailyView
          day={selectedDay}
          AddMealHandler={AddMealHandler}
          dailyMeals={meals.filter((item) => item.date === selectedDay.toDateString()).sort((a, b) => a.order - b.order)}
        />
      </div>

    </>
  );
}

export default MealPlanPage;
