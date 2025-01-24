import { SubmitHandler } from "react-hook-form";
import MealData from "../classes/MealData";
import NewMealForm from "./MealPlanningComponents/NewMealForm";
import DailyViewMeals from "./MealPlanningComponents/DailyViewMeals";

type Inputs = {
  name: string;
  ingredients: string[];
};

export default function DailyView({
  day,
  AddMealHandler,
  dailyMeals,
}: {
  day: Date;
  AddMealHandler: (newDay: Date, name: string, ingredients: string[]) => void;
  dailyMeals: MealData[];
}) {
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Create the MealData object and save it to AllMeals Array
    console.log(data);
    AddMealHandler(day, data.name, data.ingredients);
  };

  return (
    <>
      <div className="text-slate-800 text-3xl text-center my-10">{day?.toDateString()}</div>


      {/* Daily-view Meals */}
      <div>
        {dailyMeals.map((mealItem, index) => {
          return <DailyViewMeals key={mealItem.uid} index={index} name={mealItem.name} />;
        })}
      </div>
      <NewMealForm onSubmit={onSubmit} />

    </>
  );
}
