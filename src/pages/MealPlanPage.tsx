import Calendar from "react-calendar";
import { Value } from "react-calendar/src/shared/types.js";
import DailyView from "../components/DailyView";
import MealData from "../classes/MealData";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";

function MealPlanPage() {
  const { meals, setMeals, selectedDay, setSelectedDay } = useAppContext()

  const AddMealHandler = (
    newDay: Date,
    name: string,
    ingredients: string[]
  ) => {
    const newMeal = new MealData(
      v4(),
      name,
      ingredients,
      newDay.toDateString(),
      0,
      false
    );
    setMeals([...meals, newMeal]);
  };

  return (
    <>
      <Calendar
        onChange={(e: Value) => {
          if (e instanceof Date) setSelectedDay(e);
        }}
      />
      <DailyView
        day={selectedDay}
        AddMealHandler={AddMealHandler}
        dailyMeals={meals.filter((item) => item.date === selectedDay.toDateString())}
      />
    </>
  );
}

export default MealPlanPage;
