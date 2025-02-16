import { useAppContext } from '../../context/useAppContext'
import { updateMeal } from '../../DB/mealsCrud';
import { IngredientBlueprintInterface, MealInterface, UnitInterface } from '../../ts/interfaces'
import EditMealButton from './Local/EditButton';

export default function MealInfoView(
    { meal, editing, setEditing, blueprintsById, unitsById, copyMeal, ToggleCopyMeal, isSmallView, setIsSmallView }
        :
        {
            meal: MealInterface, editing: boolean, setEditing: React.Dispatch<React.SetStateAction<boolean>>,
            blueprintsById: { [key: string]: IngredientBlueprintInterface; },
            unitsById:
            { [key: string]: UnitInterface; },
            copyMeal: MealInterface | null;
            ToggleCopyMeal: (mealToSet: MealInterface) => void;
            isSmallView: boolean;
            setIsSmallView: React.Dispatch<React.SetStateAction<boolean>>
        }
) {
    const { state, dispatch } = useAppContext()
    const ToggleMealDone = async () => {
        try {
            const updatedMeal = { ...meal, isFinished: !meal.isFinished }
            const newMeals = state.meals.map(mealData => {
                return mealData.id != meal.id ? mealData : updatedMeal
            })
            await updateMeal(updatedMeal)
            dispatch({ type: "SET_MEALS", payload: newMeals })

        } catch (error) {
            console.error("Error toggle meal done: ", error)
        }
    }

    const EditMeal = () => {
        setEditing(!editing)
    }

    return isSmallView ? (
        <div className='flex justify-between mx-6'>
            <div className="text-2xl text-white font-bold">{meal.name}</div>
            <button className='hover:scale-125 transition-all duration-100 ease-in-out active:scale-90' onClick={() => setIsSmallView(false)}>⬇️</button>
        </div>
    ) : (
        <>
            <div className='flex justify-between mx-6 items-center'>
                <div className="text-2xl text-white font-bold">{meal.name}</div>
                <div>
                    <button className='text-white' onClick={() => ToggleCopyMeal(meal)}>{copyMeal != null && copyMeal.id === meal.id ? "submit" : "copy"}</button>

                    <EditMealButton OnClick={EditMeal} />
                    <button className='hover:scale-125 transition-all duration-100 ease-in-out active:scale-90' onClick={() => setIsSmallView(true)}>⬆️</button>
                </div>
            </div>
            <div className='text-xl text-white text-center my-2 border-b pb-1'>-Ingredients-</div>
            {meal.ingredients.map(
                ingredient => {
                    return (
                        <div key={ingredient.id} className="flex justify-between my-1 mx-[10vw] text-white">
                            <div className="text-lg">{blueprintsById[ingredient.blueprintId].name || "Name Err"}</div>
                            <div className="flex gap-5">
                                <div className="text-lg font-bold">{ingredient.amount}</div>
                                <div className="text-lg">{unitsById[blueprintsById[ingredient.blueprintId].unitId].name || "Unit Err"}</div>
                            </div>
                        </div>
                    )
                }
            )}
            {meal.ingredients.length === 0 && <div className="text-lg text-white">No ingredients</div>}
            <div className="flex justify-center gap-6 text-white">
                <div className="text-lg">Meal Finished:</div>
                <input type="checkbox" checked={meal.isFinished} onChange={ToggleMealDone} />
            </div>
        </>
    )
}
