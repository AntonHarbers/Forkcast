import { Path, UseFormRegister } from "react-hook-form";

export default function TextInputElement<InputType extends Record<string, unknown>>(
    {
        register,
        placeholder,
        registerName,
        required
    }:
        {
            register: UseFormRegister<InputType>,
            placeholder: string,
            registerName: Path<InputType>,
            required: boolean
        }
) {
    return (
        <input className="p-2 bg-blue-500 rounded-md m-2 text-white placeholder-slate-300" placeholder={placeholder} {...register(registerName, { required: required })} />
    )
}