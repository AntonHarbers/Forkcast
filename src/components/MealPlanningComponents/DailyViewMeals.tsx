import { useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { IngredientBlueprintInterface, MealInterface, UnitInterface } from "../../ts/interfaces";
import UpdateMealForm from "./UpdateMealForm";
import MealInfoView from "./MealInfoView";

export default function DailyViewMeals({
  meal,
  prevId,
  nextId,
  copyMeal,
  ToggleCopyMeal,
}: {
  meal: MealInterface,
  prevId: string | null,
  nextId: string | null,
  copyMeal: MealInterface | null;
  ToggleCopyMeal: (mealToSet: MealInterface) => void
}) {
  const { state } = useAppContext()
  const [editing, setEditing] = useState<boolean>(false)
  const [isSmallView, setIsSmallView] = useState(true)

  const blueprintsById = useMemo(() => {
    return state.ingredientBlueprints.reduce((acc: { [key: string]: IngredientBlueprintInterface }, ingredient) => {
      acc[ingredient.id] = ingredient
      return acc
    }, {})
  }, [state.ingredientBlueprints])

  const unitsById = useMemo(() => {
    return state.ingredientUnits.reduce((acc: { [key: string]: UnitInterface }, unit) => {
      acc[unit.id] = unit
      return acc
    }, {})
  }, [state.ingredientUnits])

  return (
    <div
      className={`w-auto p-2 rounded-md m-10 text-2xl text-start ${meal.isFinished
        ? "bg-slate-800"
        : 'bg-gray-700'
        }`
      }
    >
      {editing
        ?
        <UpdateMealForm
          prevId={prevId}
          nextId={nextId}
          meal={meal}
          setEditing={setEditing}
          editing={editing}
          blueprintsById={blueprintsById}
          unitsById={unitsById}
        />
        :
        <MealInfoView
          editing={editing}
          setEditing={setEditing}
          meal={meal}
          unitsById={unitsById}
          blueprintsById={blueprintsById}
          copyMeal={copyMeal}
          ToggleCopyMeal={ToggleCopyMeal}
          isSmallView={isSmallView}
          setIsSmallView={setIsSmallView}
        />
      }
    </div>
  );
}
