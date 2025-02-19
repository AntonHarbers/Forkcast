import NewIngredientForm from "../components/IngredientsPageComponent/NewIngredientForm";
import { SubmitHandler } from "react-hook-form";
import { v4 } from "uuid";
import { useAppContext } from "../context/useAppContext";
import EditIngredientModal from "../components/IngredientsPageComponent/EditIngredientModal";
import { useEffect, useMemo, useState } from "react";
import IngredientListItem from "../components/IngredientsPageComponent/IngredientListItem";
import { IngredientFormInputs } from "../ts/types";
import { IngredientBlueprintInterface } from "../ts/interfaces";
import Header from "../components/Global/Header";
import { addIngredientBlueprint } from "../DB/ingredientBlueprintsCRUD";
import debounce from "lodash.debounce";

export default function IngredientsPage() {
    const { state, dispatch } = useAppContext()

    const [editingIngredientBlueprint, setEditingIngredientBlueprint] = useState<IngredientBlueprintInterface | null>(null)
    const [isShowingForm, setIsShowingForm] = useState<boolean>(false)
    const existingIngredientBlueprints = useMemo(() => state.ingredientBlueprints.filter(item => !item.isDeleted).sort((a, b) => a.name.localeCompare(b.name)), [state.ingredientBlueprints])

    const [filteredIngredients, setFilteredIngredients] = useState<IngredientBlueprintInterface[]>(existingIngredientBlueprints)
    const [searchTerm, setSearchTerm] = useState<string>("")

    useEffect(() => {
        setFilteredIngredients(existingIngredientBlueprints)
    }, [existingIngredientBlueprints])

    const debouncedFilter = useMemo(
        () =>
            debounce(
                (
                    value: string,
                    ingredientBlueprints: IngredientBlueprintInterface[]
                ) => {
                    if (!value) {
                        setFilteredIngredients(existingIngredientBlueprints);
                        return;
                    }
                    const regex = new RegExp(value, "i");
                    const filtered = ingredientBlueprints.filter(
                        (ingredient) => regex.test(ingredient.name) && !ingredient.isDeleted
                    );
                    setFilteredIngredients(filtered);
                },
                250
            ),
        [existingIngredientBlueprints]
    );

    const HandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchTerm(val);
        debouncedFilter(val, state.ingredientBlueprints);
    };

    const HandleNewIngredientFormSubmit: SubmitHandler<IngredientFormInputs> = async (data) => {
        try {
            if (!data.categoryId) data.categoryId = null
            const newIngredient: IngredientBlueprintInterface = { ...data, id: v4(), deletedAt: new Date().toDateString(), isDeleted: false }
            await addIngredientBlueprint(newIngredient)
            dispatch({ type: 'SET_INGREDIENT_BLUEPRINTS', payload: [...state.ingredientBlueprints, newIngredient] })
        } catch (error) {
            console.error("Error adding new ingredient blueprint: ", error)
        }

    }


    return (
        <div className="relative">
            <div className="flex items-center border-b justify-between mx-10">
                <Header text="Ingredients" styles="border-none mb-0 text-center w-full" />
                <div onClick={() => setIsShowingForm(!isShowingForm)} className="pt-2 text-2xl hover:scale-110 active:scale-90 transition-all duration-100 ease-in-out hover:cursor-pointer select-none">{isShowingForm ? "➖" : "➕"}</div>
            </div>
            {isShowingForm &&
                <div className="justify-center flex ">
                    <NewIngredientForm onSubmit={HandleNewIngredientFormSubmit} />
                </div>
            }
            <div className="flex bg-[#aaa] w-[50%] min-w-[250px] rounded-md mx-auto my-2">
                <input
                    id="searchInput"
                    type="text"
                    value={searchTerm}
                    onChange={HandleSearchChange}
                    className="p-2 rounded-md w-full bg-[#aaa] text-white outline-none text-center"
                />
                <label htmlFor="searchInput" className="p-1 text-lg hover:cursor-pointer">🔍</label>
            </div>
            <div className="text-white mx-auto text-center text-2xl flex justify-center">
                <div className="">Filter:</div>
                
            </div>
            {filteredIngredients.map(item => {
                return (
                    <IngredientListItem key={item.id} item={item} setEditingIngredientBlueprint={setEditingIngredientBlueprint} />
                )
            })}
            <div className="fixed w-full top-[20vh]">
                <EditIngredientModal
                    editingIngredientBlueprint={editingIngredientBlueprint}
                    setEditingIngredientBlueprint={setEditingIngredientBlueprint}
                />
            </div>

        </div>
    )
}
