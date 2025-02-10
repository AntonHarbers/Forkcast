import { UseFormRegister } from "react-hook-form";
import { MealFormInputType } from "../../ts/types";

export default function NumberInputElement({
  register,
  index,
  styles = "",
}: {
  register: UseFormRegister<MealFormInputType>;
  index: number;
  styles?: string;
}) {
  return (
    <input
      className={`w-20 text-center p-1 rounded-sm ${styles}`}
      min={1}
      defaultValue={1}
      type="number"
      {...register(`ingredients.${index}.amount`, {
        min: 1,
        valueAsNumber: true,
      })}
    />
  );
}
