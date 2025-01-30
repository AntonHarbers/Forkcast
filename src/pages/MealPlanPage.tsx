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
    const newMeal = new MealData(
      v4(),
      name,
      ingredients,
      newDay.toDateString(),
      0, false
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
          dailyMeals={meals.filter((item) => item.date === selectedDay.toDateString())}
        />
      </div>

    </>
  );
}

export default MealPlanPage;
