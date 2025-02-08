import { SubmitHandler } from "react-hook-form";
import NewMealForm from "./MealPlanningComponents/NewMealForm";
import DailyViewMeals from "./MealPlanningComponents/DailyViewMeals";
import { MealFormInputType } from "../ts/types";
import { useMemo } from "react";
import { MealIngredientInterface, MealInterface } from "../ts/interfaces";


export default function DailyView({
  day,
  AddMealHandler,
  dailyMeals,
}: {
  day: Date;
  AddMealHandler: (newDay: Date, name: string, ingredients: MealIngredientInterface[]) => void;
  dailyMeals: MealInterface[];
}) {
  const onSubmit: SubmitHandler<MealFormInputType> = (data) => {
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
          return <DailyViewMeals
            key={mealItem.id}
            meal={mealItem}
            prevId={dailyNonDeletedMeals[index - 1]?.id ?? null}
            nextId={dailyNonDeletedMeals[index + 1]?.id || null}
          />;
        })}
      </div>
    </>
  );
}
