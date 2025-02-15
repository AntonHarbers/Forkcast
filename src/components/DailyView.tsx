import { SubmitHandler } from "react-hook-form";
import NewMealForm from "./MealPlanningComponents/NewMealForm";
import DailyViewMeals from "./MealPlanningComponents/DailyViewMeals";
import { MealFormInputType } from "../ts/types";
import { useMemo, useState } from "react";
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
    setIsAddingNewMeal(false)
    AddMealHandler(day, data.name, data.ingredients);
  };
  const [isAddingNewMeal, setIsAddingNewMeal] = useState(false)
  const dailyNonDeletedMeals = useMemo(() => dailyMeals.filter(item => !item.isDeleted), [dailyMeals])

  const HandleToggleNewMealForm = () => {
    setIsAddingNewMeal(!isAddingNewMeal)
  }
  return (
    <>
      <div className="flex w-auto mx-auto justify-center items-center gap-[35vw] my-6">
        <div className="text-2xl text-white">Todays Meals:</div>
        <button onClick={HandleToggleNewMealForm} className="text-xl text-slate-400 bg-white px-2 py-1 rounded-md hover:bg-slate-400 hover:text-white active:bg-slate-600">{isAddingNewMeal ? "➖" : "➕"}</button>
      </div>
      {isAddingNewMeal && <NewMealForm onSubmit={onSubmit} />}
      <div>
        {dailyNonDeletedMeals.length === 0 && <div className="text-xl text-center my-2 text-white">No Meals</div>}
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
