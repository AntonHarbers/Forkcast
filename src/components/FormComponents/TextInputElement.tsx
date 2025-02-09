import { Path, UseFormRegister } from "react-hook-form";

export default function TextInputElement<InputType extends Record<string, unknown>>(
    {
        register,
        placeholder,
        registerName,
        required,
        defaultValue = ""
    }:
        {
            register: UseFormRegister<InputType>,
            placeholder: string,
            registerName: Path<InputType>,
            required: boolean,
            defaultValue?: string
        }
) {
    return (
        <input
            defaultValue={defaultValue}
            className="p-2 bg-blue-500 rounded-md m-2 text-white placeholder-slate-300"
            placeholder={placeholder}
            {...register(registerName, { required: required })}
        />
    )
}