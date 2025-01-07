import Calendar from "react-calendar";
import { useState } from "react";
import { Value } from "react-calendar/src/shared/types.js";
import DailyView from "../components/DailyView";
import MealData from "../classes/MealData";

function MealPlanPage() {
    const [day, setDay] = useState<Date>(new Date());
    const [mealData, setMealData] = useState<MealData[] | []>([]);

    const AddMealHandler = (newDay: Date) => {
        const newMeal = new MealData("1", "Test Meal", newDay.toDateString(), 0, false);
        setMealData([...mealData, newMeal]);
    };

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
                dailyMeals={mealData.filter((item) => item.date === day.toDateString())}
            />
        </>
    );
}

export default MealPlanPage;
