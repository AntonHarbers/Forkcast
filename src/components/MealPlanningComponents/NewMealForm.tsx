import { useForm } from "react-hook-form";
import TextInputElement from "../FormComponents/TextInputElement";
import SubmitInputElement from "../FormComponents/SubmitInputElement";
import { useEffect } from "react";
import { useAppContext } from "../../context/useAppContext";

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

  const { ingredientBlueprints } = useAppContext()

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
          {ingredientBlueprints.map(item => {
            return <option key={item.uid} value={item.name}>{item.name}</option>
          })}
        </select>
        {errors.name && <span>This field is required</span>}
        <SubmitInputElement submitInputText="Add New Meal!" />
      </form>
    </div>
  );
}
