import { SubmitHandler, useForm } from "react-hook-form";
import MealData from "../classes/MealData";

type Inputs = {
  name: string,
  ingredients: string[],
}

export default function DailyView({
  day,
  AddMealHandler,
  dailyMeals,
}: {
  day: Date;
  AddMealHandler: (newDay: Date) => void;
  dailyMeals: MealData[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    // Create the MealData object and save it to AllMeals Array
    console.log(data);

  }

  return (
    <>
      <div>{day?.toDateString()}</div>
      <div>
        {dailyMeals.map((mealItem, index) => {
          return <div key={index}>{mealItem.name}</div>;
        })}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="Meal Name" {...register("name", { required: true })} />
        <select multiple {...register("ingredients")}>
          <option value="Apple">Apple</option>
          <option value="Banana">Banana</option>
          <option value="Candy">Candy</option>
        </select>
        {errors.name && <span>This field is required</span>}
        <input type="submit" />
      </form>
      <button
        onClick={() => {
          AddMealHandler(day);
        }}
      >
        Add Meal
      </button>
    </>
  );
}
