import { useMemo, useState } from "react";
import { useAppContext } from "../../context/useAppContext";
import { IngredientBlueprintInterface, MealInterface, UnitInterface } from "../../ts/interfaces";
import UpdateMealForm from "./UpdateMealForm";
import MealInfoView from "./MealInfoView";

export default function DailyViewMeals({
  meal,
  prevId,
  nextId,
}: {
  meal: MealInterface,
  prevId: string | null,
  nextId: string | null
}) {
  const { state } = useAppContext()
  const [editing, setEditing] = useState<boolean>(false)

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
      className={`w-auto border-b p-2 m-10 text-2xl text-start ${meal.isFinished
        ? "bg-slate-400"
        : editing
          ? 'bg-green-300'
          : 'bg-slate-100'}`
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
        />
      }
    </div>
  );
}
