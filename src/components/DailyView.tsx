import { SubmitHandler } from "react-hook-form";
import MealData from "../classes/MealData";
import NewMealForm from "./MealPlanningComponents/NewMealForm";
import DailyViewMeals from "./MealPlanningComponents/DailyViewMeals";
import { MealIngredientType } from "../types";
import { useMemo } from "react";

type Inputs = {
  name: string;
  ingredients: MealIngredientType[];
};

export default function DailyView({
  day,
  AddMealHandler,
  dailyMeals,
}: {
  day: Date;
  AddMealHandler: (newDay: Date, name: string, ingredients: MealIngredientType[]) => void;
  dailyMeals: MealData[];
}) {
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Create the MealData object and save it to AllMeals Array
    AddMealHandler(day, data.name, data.ingredients);
  };

  const dailyNonDeletedMeals = useMemo(() => dailyMeals.filter(item => !item.isDeleted), [dailyMeals])

  return (
    <>
      <div className="text-slate-800 text-3xl text-center my-10">{day?.toDateString()}</div>

      <NewMealForm onSubmit={onSubmit} />

      {/* Daily-view Meals */}
      <div>
        {dailyNonDeletedMeals.map((mealItem, index) => {
          return <DailyViewMeals key={mealItem.uid} meal={mealItem} prevId={dailyNonDeletedMeals[index - 1] ? dailyNonDeletedMeals[index - 1].uid : null} nextId={dailyNonDeletedMeals[index + 1] ? dailyNonDeletedMeals[index + 1].uid : null} />;
        })}
      </div>

    </>
  );
}
