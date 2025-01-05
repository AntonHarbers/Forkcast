import Calendar from "react-calendar";
import "./App.css";
import DailyView from "./components/DailyView";
import { useEffect, useState } from "react";
import { Value } from "react-calendar/src/shared/types.js";
import MealData from "./classes/MealData";

function App() {
  const [day, setDay] = useState<Date>(new Date());
  const [mealData, setMealData] = useState<MealData[] | []>([]);

  const AddMealHandler = (newDay: Date) => {
    const newMeal = new MealData("1", "Test Meal", newDay, 0, false);
    setMealData([...mealData, newMeal]);
  };

  useEffect(() => {
    console.log(mealData);
  }, [mealData]);

  return (
    <>
      <Calendar
        onChange={(e: Value) => {
          if (e instanceof Date) setDay(e);
        }}
      />
      <DailyView
        day={day}
        AddMealHandler={AddMealHandler}
        dailyMeals={mealData.filter((item) => item.date === day)}
      />
    </>
  );
}

export default App;
