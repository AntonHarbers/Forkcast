import { UseFormRegister } from "react-hook-form";
import { IngredientFormInputs } from "../../ts/types";
import { CategoryInterface, StoreInterface, UnitInterface } from "../../ts/interfaces";

export default function DropdownInputElement(
    {
        register,
        name,
        array,
        defaultValue = "",
        labelText = "",
        styles = ""
    }
        :
        {
            register: UseFormRegister<IngredientFormInputs>,
            name: "name" | "storeUid" | "unitId" | "categoryId",
            array: CategoryInterface[] | UnitInterface[] | StoreInterface[],
            defaultValue?: string,
            labelText?: string,
            styles?: string,
        }
) {
    return (
        <div className={`w-[90%] flex flex-col items-center gap-1 ${styles}`}>
            <label
                htmlFor={name}
                className="text-white text-2xl cursor-pointer"
            >
                {labelText}
            </label>
            <select id={name} className="w-full rounded-md p-2 text-center" {...register(name)} defaultValue={defaultValue}>
                {array.map(item => <option className="bg-gray-200" key={item.id} value={item.id}>{item.name}</option>)}
            </select>
        </div>
    )
}
