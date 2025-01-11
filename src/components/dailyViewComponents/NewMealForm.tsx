import { useForm } from "react-hook-form";

// Type Def.
type Inputs = {
  name: string;
  ingredients: string[];
};

export default function NewMealForm({
  onSubmit,
}: {
  onSubmit: (data: Inputs) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <div>
      {/* New Meal Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          defaultValue="Meal Name"
          {...register("name", { required: true })}
        />
        <select multiple {...register("ingredients")}>
          <option value="Apple">Apple</option>
          <option value="Banana">Banana</option>
          <option value="Candy">Candy</option>
        </select>
        {errors.name && <span>This field is required</span>}
        <input type="submit" />
      </form>
    </div>
  );
}
