import { useForm } from "react-hook-form";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { useEffect } from "react";

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
    formState: { errors, isSubmitSuccessful },
    reset,

  } = useForm<Inputs>();

  useEffect(() => {
    reset()
  }, [isSubmitSuccessful, reset])

  return (
    <div className="flex w-full">
      {/* New Meal Form */}
      <form className="flex flex-col w-80 mx-auto" onSubmit={
        handleSubmit(onSubmit)
      }>
        <TextInputElement register={register} placeholder={"Meal Name"} registerName={"name"} required={true} />
        <select multiple {...register("ingredients")}>
          <option value="Apple">Apple</option>
          <option value="Banana">Banana</option>
          <option value="Candy">Candy</option>
        </select>
        {errors.name && <span>This field is required</span>}
        <SubmitInputElement submitInputText="Add New Meal!" />
      </form>
    </div>
  );
}
