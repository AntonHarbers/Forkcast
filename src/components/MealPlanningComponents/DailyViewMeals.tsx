import MealData from "../../classes/MealData";
import { useAppContext } from "../../context/useAppContext";
import { UnitData } from "../../data/dummy";

export default function DailyViewMeals({
  meal
}: {
  meal: MealData
}) {
  const { ingredientBlueprints } = useAppContext()


  return (
    <div className="w-auto border-b p-2 m-10 text-2xl text-center">
      <div>{meal.name}</div>
      {meal.ingredients.map(ingredient => {
        return (
          <div key={ingredient.id} className="flex justify-center gap-2">
            <div>{ingredientBlueprints.find(item => item.uid === ingredient.blueprintId)?.name || "Name Err"}</div>
            <div>{ingredient.amount}</div>
            <div>{UnitData.find(unit => unit.id === ingredientBlueprints.find(item => item.uid === ingredient.blueprintId)?.unitId)?.name || "Unit Err"}</div>
          </div>
        )

      })}
    </div>
  );
}
