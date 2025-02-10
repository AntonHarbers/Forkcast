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

  const SubmitEditMeal = (data: MealFormInputType) => {
    setEditing(false);
    const UpdatedMeals = state.meals.map((mealData) => {
      return mealData.id != meal.id
        ? mealData
        : { ...meal, name: data.name, ingredients: data.ingredients };
    });

    dispatch({ type: "SET_MEALS", payload: UpdatedMeals });
  };

  const SwapMealOrder = (swapId: string) => {
    const swapMeal = state.meals.find((mealData) => mealData.id === swapId);
    if (!swapMeal) return;
    const savedOrder = swapMeal.order;
    const newMeals = state.meals.map((mealData) => {
      return mealData.id === swapId
        ? { ...swapMeal, order: meal.order }
        : mealData.id === meal.id
        ? { ...meal, order: savedOrder }
        : mealData;
    });
    dispatch({ type: "SET_MEALS", payload: newMeals });
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

  const DeleteMeal = () => {
    dispatch({ type: "DELETE_MEAL", payload: meal.id });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(SubmitEditMeal)}>
        <div className="flex justify-between">
          <input
            defaultValue={meal.name}
            {...register("name", { required: true })}
            className="text-2xl font-bold"
          />
          {errors.name && <span>This field is required</span>}

          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={HandleSearchChange}
              className="p-2 rounded-md w-full"
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

          <button
            onClick={DeleteMeal}
            type="button"
            className="bg-red-300 p-1 text-lg rounded-sm hover:bg-red-400 active:bg-red-500"
          >
            Delete
          </button>
          <DateInputElement
            defaultValue={new Date(meal.date).toLocaleDateString("en-CA")}
            value={new Date(meal.date).toLocaleDateString("en-CA")}
            onChange={() => {}}
          />
          <div className="flex flex-col">
            {prevId && (
              <button type="button" onClick={() => SwapMealOrder(prevId)}>
                Up
              </button>
            )}
            {nextId && (
              <button type="button" onClick={() => SwapMealOrder(nextId)}>
                Down
              </button>
            )}
          </div>
          <input
            type="submit"
            className="bg-blue-300 hover:bg-blue-400 active:bg-blue-500 rounded-sm p-1 text-lg"
          />
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex justify-between gap-2">
            <div className="text-lg">
              {blueprintsById[field.blueprintId].name || "Name Err"}
            </div>
            <input hidden {...register(`ingredients.${index}.blueprintId`)} />
            <div className="flex gap-1">
              <NumberInputElement register={register} index={index} styles="" />
              <div>
                {unitsById[blueprintsById[field.blueprintId].unitId].name ||
                  "ERR"}
              </div>
            </div>
            <button
              className="bg-red-300 hover:bg-red-400 active:bg-red-500 rounded-md p-1"
              type="button"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </form>
    </div>
  );
}
