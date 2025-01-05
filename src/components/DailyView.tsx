import MealData from "../classes/MealData";

export default function DailyView({
  day,
  AddMealHandler,
  dailyMeals,
}: {
  day: Date;
  AddMealHandler: (newDay: Date) => void;
  dailyMeals: MealData[];
}) {
  return (
    <>
      <div>{day?.toDateString()}</div>
      <div>
        {dailyMeals.map((mealItem, index) => {
          return <div key={index}>{mealItem.name}</div>;
        })}
      </div>
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
