import { useFieldArray, useForm } from "react-hook-form";
import { MealFormInputType } from "../../ts/types";
import { useAppContext } from "../../context/useAppContext";
import { useEffect, useMemo, useState } from "react";
import {
  IngredientBlueprintInterface,
  MealInterface,
  UnitInterface,
} from "../../ts/interfaces";
import debounce from "lodash.debounce";
import { v4 } from "uuid";
import NumberInputElement from "../FormComponents/NumberInputElement";
import DateInputElement from "../FormComponents/DateInputElement";
import FormError from "../FormComponents/FormError";
import { updateMeal } from "../../DB/mealsCrud";
import SubmitInputElement from "../FormComponents/SubmitInputElement";

export default function UpdateMealForm({
  meal,
  prevId,
  nextId,
  setEditing,
  editing,
  blueprintsById,
  unitsById,
}: {
  meal: MealInterface;
  prevId: string | null;
  nextId: string | null;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  blueprintsById: {
    [key: string]: IngredientBlueprintInterface;
  };
  unitsById: {
    [key: string]: UnitInterface;
  };
}) {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredIngredients, setFilteredIngredients] = useState<
    IngredientBlueprintInterface[]
  >([]);

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    control,
    handleSubmit,
    setValue,
  } = useForm<MealFormInputType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const SubmitEditMeal = async (data: MealFormInputType) => {
    try {
      setEditing(false);
      const updatedMeal = { ...meal, name: data.name, ingredients: data.ingredients }
      const UpdatedMeals = state.meals.map((mealData) => {
        return mealData.id != meal.id
          ? mealData
          : updatedMeal
      });
      await updateMeal(updatedMeal)
      dispatch({ type: "SET_MEALS", payload: UpdatedMeals });
    } catch (error) {
      console.error("Edit meal failed: ", error)
    }

  };

  const UpdateMealDate = async (newDate: Date) => {
    try {
      setEditing(false)
      // get highest order of new day
      const maxOrder = state.meals.reduce((acc, cur) => {
        if (cur.date === newDate.toDateString()) {
          acc = Math.max(acc, cur.order);
        }
        return acc;
      }, 0);
      const updatedMeal = { ...meal, date: newDate.toDateString(), order: maxOrder + 1 }
      const UpdatedMeals = state.meals.map((mealData) => mealData.id == meal.id ? updatedMeal : mealData)
      await updateMeal(updatedMeal)
      dispatch({ type: "SET_MEALS", payload: UpdatedMeals })
    } catch (error) {
      console.error("Update meal date error: ", error)
    }
  }

  const SwapMealOrder = async (swapId: string) => {
    try {
      const swapMeal = state.meals.find((mealData) => mealData.id === swapId);
      if (!swapMeal) return;
      const savedOrder = swapMeal.order;
      const updatedMeal = { ...meal, order: savedOrder }
      const updatedSwapMeal = { ...swapMeal, order: meal.order }

      await Promise.all([updateMeal(updatedMeal), updateMeal(updatedSwapMeal)])

      const newMeals = state.meals.map((mealData) =>
        mealData.id === swapId
          ? updatedSwapMeal
          : mealData.id === meal.id
            ? updatedMeal
            : mealData
      );
      dispatch({ type: "SET_MEALS", payload: newMeals });
    } catch (error) {
      console.error('Sweap meal order error: ', error)
    }

  };

  useEffect(() => {
    reset({ ingredients: [] });
  }, [isSubmitSuccessful, reset]);

  useEffect(() => {
    if (editing) {
      meal.ingredients.forEach((data) =>
        append({
          amount: data.amount,
          id: data.id,
          blueprintId: data.blueprintId,
          bought: data.bought,
        })
      );
    }
  }, [editing, append, meal.ingredients]);

  const debouncedFilter = useMemo(
    () =>
      debounce(
        (
          value: string,
          ingredientBlueprints: IngredientBlueprintInterface[]
        ) => {
          if (!value) {
            setFilteredIngredients([]);
            return;
          }
          const regex = new RegExp(value, "i");
          const filtered = ingredientBlueprints.filter(
            (ingredient) => !ingredient.isDeleted && regex.test(ingredient.name)
          );

          setFilteredIngredients(filtered);
        },
        250
      ),
    []
  );

  const HandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    debouncedFilter(val, state.ingredientBlueprints);
  };

  const DeleteMeal = async () => {
    try {
      const deletedMeal: MealInterface = { ...meal, isDeleted: true, deletedAt: new Date().toDateString() }
      await updateMeal(deletedMeal)
      dispatch({ type: "DELETE_MEAL", payload: meal.id });
    } catch (error) {
      console.error("Deleting meal failed: ", error)
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(SubmitEditMeal)}>
        <div className='flex justify-between mx-6 items-center mb-2'>
          <input
            defaultValue={meal.name}
            {...register("name", { required: true })}
            className="text-2xl font-bold rounded-md px-2 w-1/2 bg-[#aaaaaa] text-white"
          />
          {errors.name && <FormError />}
          <div className="flex gap-2">
            <div className="flex gap-4">
              {prevId && (
                <button type="button" onClick={() => SwapMealOrder(prevId)}>
                  👆
                </button>
              )}
              {nextId && (
                <button type="button" onClick={() => SwapMealOrder(nextId)}>
                  👇
                </button>
              )}
            </div>
            <SubmitInputElement submitInputText="📝" />
            <button className='hover:scale-125 transition-all duration-100 ease-in-out active:scale-90' onClick={() => { }}>⬆️</button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex bg-[#aaaaaa] rounded-md">
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={HandleSearchChange}
              className=" outline-none px-2 text-center py-1 rounded-md w-max bg-[#aaaaaa] text-white"
            />
            <label className="px-2 pt-1 select-none hover:cursor-pointer" htmlFor="search">🔍</label>

          </div>

          <DateInputElement
            value={new Date(meal.date).toLocaleDateString("en-CA")}
            onChange={UpdateMealDate}
            styles="bg-[#aaaaaa] text-white hover:cursor-pointer"
          />


        </div>
        <div className="flex flex-col">
          {filteredIngredients.map((item) => {
            return (
              <div
                className="bg-green-100 p-3 rounded-md border border-slate-600 m-2 flex justify-between items-center"
                key={item.id}
              >
                <div>{item.name}</div>
                <button
                  type="button"
                  className="bg-green-500 rounded-md p-2 hover:bg-green-600 active:bg-green-800"
                  onClick={() => {
                    if (
                      fields.find((field) => field.blueprintId === item.id)
                    ) {
                      window.alert("Meal already contains this ingredient!");
                      return;
                    }
                    append({
                      amount: 0,
                      id: v4(),
                      blueprintId: item.id,
                      bought: false,
                    });
                    setValue(`ingredients.${fields.length}.amount`, 1);
                    setFilteredIngredients([]);
                    setSearchTerm("");
                  }}
                >
                  Add
                </button>
              </div>
            );
          })}
        </div>
        <div className='text-lg text-white text-center my-2 border-b pb-1'>-Ingredients-</div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex justify-between gap-2 my-2 mx-[10vw] text-white">
            <div className="flex items-center gap-6">
              <button
                className="text-sm hover:scale-125 transition-all duration-100 ease-in-out active:scale-90"
                type="button"
                onClick={() => remove(index)}
              >
                ❌
              </button>
              <div className="text-lg">
                {blueprintsById[field.blueprintId].name || "Name Err"}
              </div>
            </div>

            <input hidden {...register(`ingredients.${index}.blueprintId`)} />
            <div className="flex gap-1">
              <NumberInputElement register={register} index={index} styles="text-2xl font-bold rounded-md px-2 bg-[#aaaaaa] text-white" />
              <div>
                {unitsById[blueprintsById[field.blueprintId].unitId].name ||
                  "ERR"}
              </div>
            </div>

          </div>
        ))}

        <button
          onClick={DeleteMeal}
          type="button"
          className="bg-red-300 p-1 text-lg rounded-sm hover:bg-red-400 active:bg-red-500 w-full"
        >
          Delete Meal
        </button>
      </form>
    </div>
  );
}
