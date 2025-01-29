import MealData from "../../classes/MealData";
import { useAppContext } from "../../context/useAppContext";
import { UnitData } from "../../data/dummy";

export default function DailyViewMeals({
  meal
}: {
  meal: MealData
}) {
  const { ingredientBlueprints, setMeals, meals } = useAppContext()

  const ToggleMealDone = () => {
    const newMeals = meals.map(mealData => {
      if (mealData.uid === meal.uid) {
        const copy = meal
        copy.finished = !meal.finished
        return copy
      } else {
        return mealData
      }
    })

    setMeals(newMeals)
  }
  
  return (
    <div className={`w-auto border-b p-2 m-10 text-2xl text-start ${meal.finished ? "bg-slate-400" : 'bg-slate-100'}`}>
      <div className="flex justify-between">
        <div className="text-2xl font-bold">{meal.name}</div>
        <div className="flex gap-2">
          <div className="text-lg">Done</div>
          <input type="checkbox" checked={meal.finished} onChange={ToggleMealDone} />
        </div>
      </div>
      {meal.ingredients.map(ingredient => {
        return (
          <div key={ingredient.id} className="flex justify-between gap-2">
            <div className="text-lg">{ingredientBlueprints.find(item => item.uid === ingredient.blueprintId)?.name || "Name Err"}</div>
            <div className="flex gap-1">
              <div className="text-lg font-bold">{ingredient.amount}</div>
              <div className="text-lg">{UnitData.find(unit => unit.id === ingredientBlueprints.find(item => item.uid === ingredient.blueprintId)?.unitId)?.name || "Unit Err"}</div>
            </div>
          </div>
        )
      })}
    </div>
  );
}
