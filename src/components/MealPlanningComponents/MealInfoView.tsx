import { useAppContext } from '../../context/useAppContext'
import { IngredientBlueprintInterface, MealInterface, UnitInterface } from '../../ts/interfaces'
import EditMealButton from './Local/EditButton';

export default function MealInfoView(
    { meal, editing, setEditing, blueprintsById, unitsById }
        :
        {
            meal: MealInterface, editing: boolean, setEditing: React.Dispatch<React.SetStateAction<boolean>>,
            blueprintsById: { [key: string]: IngredientBlueprintInterface; },
            unitsById:
            { [key: string]: UnitInterface; }
        }
) {
    const { state, dispatch } = useAppContext()

    const ToggleMealDone = () => {
        const newMeals = state.meals.map(mealData => {
            return mealData.id != meal.id ? mealData : { ...mealData, finished: !meal.isFinished }
        })
        dispatch({ type: "SET_MEALS", payload: newMeals })
    }


    const EditMeal = () => {
        setEditing(!editing)
    }

    return (
        <>
            <div className="flex justify-between">
                <div className="text-2xl font-bold">{meal.name}</div>
                <EditMealButton OnClick={EditMeal} text='Edit' />
                <div className="flex gap-2">
                    <div className="text-lg">Done</div>
                    <input type="checkbox" checked={meal.isFinished} onChange={ToggleMealDone} />
                </div>
            </div>
            {meal.ingredients.map(
                ingredient => {
                    return (
                        <div key={ingredient.id} className="flex justify-between gap-2">
                            <div className="text-lg">{blueprintsById[ingredient.blueprintId].name || "Name Err"}</div>
                            <div className="flex gap-1">
                                <div className="text-lg font-bold">{ingredient.amount}</div>
                                <div className="text-lg">{unitsById[blueprintsById[ingredient.blueprintId].unitId].name || "Unit Err"}</div>
                            </div>
                        </div>
                    )
                }
            )}
        </>
    )
}
