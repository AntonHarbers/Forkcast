import { UseFormRegister } from "react-hook-form";
import { IngredientFormInputs } from "../../ts/types";
import { CategoryInterface, StoreInterface, UnitInterface } from "../../ts/interfaces";

export default function DropdownInputElement(
    {
        register,
        name,
        array,
        defaultValue = ""
    }
        :
        {
            register: UseFormRegister<IngredientFormInputs>,
            name: "name" | "storeUid" | "unitId" | "categoryId",
            array: CategoryInterface[] | UnitInterface[] | StoreInterface[],
            defaultValue?: string
        }
) {
    return (
        <select {...register(name)} defaultValue={defaultValue}>
            {array.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>)
}
