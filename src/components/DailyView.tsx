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
  copyMeal,
  ToggleCopyMeal,
}: {
  day: Date;
  AddMealHandler: (newDay: Date, name: string, ingredients: MealIngredientInterface[]) => void;
  dailyMeals: MealInterface[];
  copyMeal: MealInterface | null;
  ToggleCopyMeal: (mealToSet: MealInterface) => void
}) {
  const onSubmit: SubmitHandler<MealFormInputType> = (data) => {
    AddMealHandler(day, data.name, data.ingredients);
  };

  const dailyNonDeletedMeals = useMemo(() => dailyMeals.filter(item => !item.isDeleted), [dailyMeals])

  return (
    <>
      <div className="text-slate-800 text-3xl text-center my-10">{day?.toDateString()}</div>
      <NewMealForm onSubmit={onSubmit} />
      <div>
        {dailyNonDeletedMeals.map((mealItem, index) =>
          <DailyViewMeals
            key={mealItem.id}
            meal={mealItem}
            prevId={dailyNonDeletedMeals[index - 1]?.id ?? null}
            nextId={dailyNonDeletedMeals[index + 1]?.id || null}
            copyMeal={copyMeal}
            ToggleCopyMeal={ToggleCopyMeal}
          />
        )}
      </div>
    </>
  );
}
